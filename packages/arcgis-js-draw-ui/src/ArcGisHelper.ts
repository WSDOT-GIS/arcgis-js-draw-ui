import DrawUI from "./ArcGisDrawUI";

import declare = require("dojo/_base/declare");
import lang = require("dojo/_base/lang");
import Evented = require("dojo/Evented");
import Draw = require("esri/toolbars/draw");
import GraphicsLayer = require("esri/layers/GraphicsLayer");
import Graphic = require("esri/graphic");

import EsriMap = require("esri/map");
import Geometry = require("esri/geometry/Geometry");
import MarkerSymbol = require("esri/symbols/MarkerSymbol");
import LineSymbol = require("esri/symbols/LineSymbol");
import FillSymbol = require("esri/symbols/FillSymbol");
import TextSymbol = require("esri/symbols/TextSymbol");

/**
 * @typedef {Object} SymbolOptionsOptions
 * @property {esri/symbols/MarkerSymbol} point - Symbol that will be used for point features.
 * @property {esri/symbols/LineSymbol} line - Symbol that will be used for line features.
 * @property {esri/symbols/FillSymbol} polygon - Symbol that will be used for polygon features.
 * @property {esry/symbols/TextSymbol} text - Symbol that will be used as the basis for text labels.
 */
export interface ISymbolOptionConstructorOptions {
  point: MarkerSymbol;
  line: LineSymbol;
  polygon: FillSymbol;
  text: TextSymbol;
}

export class SymbolOptions {
  public point: MarkerSymbol;
  public line: LineSymbol;
  public polygon: FillSymbol;
  public text: TextSymbol;
  /**
   * Contains point, line, and polygon symbols.
   * @param {(esri/symbols/MarkerSymbol|SymbolOptionsOptions)} pointSymbolOrSymbolOptions
   * @param {esri/symbols/LineSymbol} [lineSymbol] - Required if first parameter was a MarkerSymbol.
   * @param {esri/symbols/FillSymbol} [polygonSymbol] - Required if the first parameter was a MarkerSymbol.
   * @param {esry/symbols/TextSymbol} [textSymbol] - Required if the first parameter was a MarkerSymbol
   */
  constructor(
    ...symbols: Array<
      | ISymbolOptionConstructorOptions
      | MarkerSymbol
      | LineSymbol
      | FillSymbol
      | TextSymbol
    >
  ) {
    if (arguments.length === 1) {
      this.point = arguments[0].point;
      this.line = arguments[0].line;
      this.polygon = arguments[0].polygon;
      this.text = arguments[0].text;
    } else if (arguments.length === 4) {
      this.point = arguments[0];
      this.line = arguments[1];
      this.polygon = arguments[2];
      this.text = arguments[3];
    } else {
      throw TypeError("Invalid number of arguments.");
    }
  }

  /**
   * Get's the symbol approprate for the graphic.
   * @param {(esri/Graphic|esri/geometries/Geometry)} graphicOrGeometry
   * @returns {esri/symbols/Symbol}
   */
  public getSymbol(graphicOrGeometry: Graphic | Geometry) {
    let geometry, symbol;
    if (graphicOrGeometry) {
      if (graphicOrGeometry instanceof Graphic && graphicOrGeometry.geometry) {
        geometry = graphicOrGeometry.geometry;
      } else if (
        graphicOrGeometry instanceof Geometry &&
        graphicOrGeometry.type
      ) {
        geometry = graphicOrGeometry;
      }
    }
    if (geometry) {
      symbol = /\w*point/i.test(geometry.type)
        ? this.point
        : /\w*line/i.test(geometry.type) ? this.line : this.polygon;
    }
    return symbol;
  }
}

/**
 * Creates a DrawUI and esri/toolbars/draw and then connects them.
 */
const DrawUIHelper = declare(undefined, [Evented], {
  layer: null,
  draw: null,
  symbolOptions: null,
  /**
   *
   * @param {esri/Map} map
   * @param {HTMLElement} drawUIElement
   * @param {SymbolOptions} [symbols]
   * @param {Object} graphicsLayerOptions - See esri/layer/GraphicsLayer constructor for details.
   * @constructs
   */
  constructor(
    this: any,
    map: EsriMap,
    drawUIElement: HTMLElement,
    symbols: SymbolOptions,
    graphicsLayerOptions: any
  ) {
    const self = this;

    /**
     * Create a text symbol IF the text button is currently active; otherwise returns null.
     * @returns {?esri/symbols/TextSymbol}
     */
    function createTextSymbol() {
      const activeTextButton = drawUIElement.querySelector(
        "button.text.active"
      );
      // TODO: get text from a UI control.
      let output: TextSymbol | null = null;
      if (activeTextButton) {
        output = lang.clone(symbols.text) as TextSymbol;
        const labelInput: HTMLInputElement | null = drawUIElement.querySelector(
          "input[name='label']"
        );
        output.setText(labelInput ? labelInput.value : "");
      }
      return output;
    }

    /**
     * Removes the "active" class from the buttons.
     */
    function removeActiveStyling() {
      const activeButtons = drawUIElement.querySelectorAll("button.active");

      for (let i = 0, l = activeButtons.length; i < l; i += 1) {
        activeButtons[i].classList.remove("active");
      }
    }

    /**
     * @this {HTMLButtonElement}
     */
    const handleButtonClick = function(this: HTMLButtonElement) {
      const operation = this.value;
      if (operation) {
        if (operation === "CLEAR") {
          if (
            window.confirm(
              "Are you sure you want to delete all of your drawn features?"
            )
          ) {
            gLayer.clear();
          }
        } else {
          map.setInfoWindowOnClick(false);
          if (operation === "TEXT") {
            draw.activate(Draw.POINT);
            self.emit("draw-activate", {});
          } else {
            draw.activate((Draw as any)[operation]);
            self.emit("draw-activate", {});
          }
          // Add a class to allow "active" operation's button to by styled.
          removeActiveStyling();
          this.classList.add("active");
        }
      }
    };

    // Setup default graphics layer options for undefined.
    if (!graphicsLayerOptions) {
      graphicsLayerOptions = {};
    }

    if (symbols && !(symbols instanceof SymbolOptions)) {
      symbols = new SymbolOptions(symbols);
    }

    this.symbols = symbols || null;

    graphicsLayerOptions.id = graphicsLayerOptions.id || "drawnFeatures";
    graphicsLayerOptions.styling = this.symbols
      ? true
      : Boolean(graphicsLayerOptions.styling);
    graphicsLayerOptions.className =
      graphicsLayerOptions.className || "drawn-features";
    graphicsLayerOptions.dataAttributes =
      graphicsLayerOptions.dataAttributes || "geometry-type";

    // Create a graphics layer to store drawn graphics.
    const gLayer = new GraphicsLayer(graphicsLayerOptions);

    this.layer = gLayer;

    map.addLayer(gLayer);

    // Create the Draw toolbar.
    const draw = new Draw(map);
    this.draw = draw;

    // Setup the Draw toolbar's event handler that will add graphics to the graphics layer.
    draw.on("draw-complete", function(this: any, e) {
      this.deactivate();
      self.emit("draw-complete", e);
      map.setInfoWindowOnClick(true);
      const graphic = new Graphic(
        e.geometry,
        symbols
          ? createTextSymbol() || symbols.getSymbol(e.geometry)
          : undefined,
        { "geometry-type": e.geometry.type }
      );
      gLayer.add(graphic);
      // Remove styling for active buttons.
      removeActiveStyling();
    });

    // Create the Draw UI.
    const drawUI = new DrawUI(drawUIElement);

    // Assign event handlers to buttons.
    const buttons = drawUI.root.querySelectorAll("button");

    for (let i = 0, l = buttons.length; i < l; i += 1) {
      buttons[i].addEventListener("click", handleButtonClick);
    }
  }
});

// export default DrawUIHelper;
// export { SymbolOptions };
