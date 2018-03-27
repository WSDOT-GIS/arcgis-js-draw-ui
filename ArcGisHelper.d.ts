import EsriMap = require("esri/map");
import DrawUI = require("./ArcGisDrawUI");
import declare = require("dojo/_base/declare");
import lang = require("dojo/_base/lang");
import Evented = require("dojo/Evented");
import Draw = require("esri/toolbars/draw");
import GraphicsLayer = require("esri/layers/GraphicsLayer");
import Graphic = require("esri/graphic");
import Geometry = require("esri/geometry/Geometry");
import Symbol = require("esri/symbols/Symbol");
import MarkerSymbol = require("esri/symbols/MarkerSymbol");
import LineSymbol = require("esri/symbols/LineSymbol");
import FillSymbol = require("esri/symbols/FillSymbol");
import TextSymbol = require("esri/symbols/TextSymbol");

/**
 * Symbol definitions for different geometry types.
 */
interface ISymbolOptions {
  /** Symbol that will be used for point features. */
  point: MarkerSymbol;
  /** Symbol that will be used for line features. */
  line: LineSymbol;
  /** Symbol that will be used for polygon features. */
  polygon: FillSymbol;
  /** Symbol that will be used as the basis for text labels. */
  text: TextSymbol;
}

/**
 * Symbol definitions for different geometry types.
 */
declare class SymbolOptions implements ISymbolOptions {
  /** Symbol that will be used for point features. */
  public point: MarkerSymbol;
  /** Symbol that will be used for line features. */
  public line: LineSymbol;
  /** Symbol that will be used for polygon features. */
  public polygon: FillSymbol;
  /** Symbol that will be used as the basis for text labels. */
  public text: TextSymbol;
  /**
   * Creates a new instance of this class.
   * @param {esri/symbols/MarkerSymbol} point - Symbol that will be used for point features.
   * @param {esri/symbols/LineSymbol} line - Symbol that will be used for line features.
   * @param {esri/symbols/FillSymbol} polygon - Symbol that will be used for polygon features.
   * @param {esry/symbols/TextSymbol} text - Symbol that will be used as the basis for text labels.
   */
  constructor(
    point: MarkerSymbol,
    line: LineSymbol,
    polygon: FillSymbol,
    text: TextSymbol
  );
  /**
   * Creates a new instance of this class.
   * @param options A single object that defines the point, line, polygon, and text properties.
   */
  constructor(options: ISymbolOptions);
  /**
   * Get's the symbol approprate for the graphic.
   * @param {(esri/Graphic|esri/geometries/Geometry)} graphicOrGeometry
   * @returns {esri/symbols/Symbol}
   */
  public getSymbol(graphic: Graphic | Geometry): Symbol;

}

declare class DrawUIHelper extends Evented {
    public layer: GraphicsLayer;
    public draw: Draw;
    constructor(map: EsriMap, drawUIElement: HTMLElement, symbols: ISymbolOptions)
    public static SymbolOptions: SymbolOptions;
}

export = DrawUIHelper;