/*global define*/
define([
	"./ArcGisDrawUI",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/Evented",
	"esri/toolbars/draw",
	"esri/layers/GraphicsLayer",
	"esri/graphic"
], function (DrawUI, declare, lang, Evented, Draw, GraphicsLayer, Graphic) {

	/**
	 * @typedef {Object} SymbolOptionsOptions
	 * @property {esri/symbols/MarkerSymbol} point - Symbol that will be used for point features.
	 * @property {esri/symbols/LineSymbol} line - Symbol that will be used for line features.
	 * @property {esri/symbols/FillSymbol} polygon - Symbol that will be used for polygon features.
	 * @property {esry/symbols/TextSymbol} text - Symbol that will be used as the basis for text labels.
	 */


	/**
	 * Contains point, line, and polygon symbols.
	 * @param {(esri/symbols/MarkerSymbol|SymbolOptionsOptions)} pointSymbolOrSymbolOptions
	 * @param {esri/symbols/LineSymbol} [lineSymbol] - Required if first parameter was a MarkerSymbol.
	 * @param {esri/symbols/FillSymbol} [polygonSymbol] - Required if the first parameter was a MarkerSymbol.
	 * @param {esry/symbols/TextSymbol} [textSymbol] - Required if the first parameter was a MarkerSymbol
	 */
	function SymbolOptions() {
		if (arguments.length === 1) {
			Object.defineProperties(this, {
				point: { value: arguments[0].point },
				line: { value: arguments[0].line },
				polygon: { value: arguments[0].polygon },
				text: {value: arguments[0].text }
			});
		} else if (arguments.length === 4) {
			Object.defineProperties(this, {
				point: { value: arguments[0] },
				line: { value: arguments[1] },
				polygon: { value: arguments[2] },
				text: { value: arguments[3] }
			});
		} else {
			throw TypeError("Invalid number of arguments.");
		}
	}

	/**
	 * Get's the symbol approprate for the graphic.
	 * @param {(esri/Graphic|esri/geometries/Geometry)} graphicOrGeometry
	 * @returns {esri/symbols/Symbol}
	 */
	SymbolOptions.prototype.getSymbol = function (graphicOrGeometry) {
		var geometry, symbol;
		if (graphicOrGeometry) {
			if (graphicOrGeometry.geometry) {
				geometry = graphicOrGeometry.geometry;
			} else if (graphicOrGeometry.type) {
				geometry = graphicOrGeometry;
			}
		}
		if (geometry) {
			symbol = /\w*point/i.test(geometry.type) ? this.point : /\w*line/i.test(geometry.type) ? this.line : this.polygon;
		}
		return symbol;
	};

	/**
	 * Creates a DrawUI and esri/toolbars/draw and then connects them.
	 */
	var DrawUIHelper = declare([Evented], {
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
		constructor: function (map, drawUIElement, symbols, graphicsLayerOptions) {
			var self = this;

			/**
			 * Create a text symbol IF the text button is currently active; otherwise returns null.
			 * @returns {?esri/symbols/TextSymbol}
			 */
			function createTextSymbol() {
				var activeTextButton = drawUIElement.querySelector("button.text.active");
				// TODO: get text from a UI control.
				var output = null;
				if (activeTextButton) {
					output = lang.clone(symbols.text);
					output.setText(drawUIElement.querySelector("input[name='label']").value);
				}
				return output;
			}

			/**
			 * Removes the "active" class from the buttons.
			 */
			function removeActiveStyling() {
				var buttons = drawUIElement.querySelectorAll("button.active");

				for (var i = 0, l = buttons.length; i < l; i += 1) {
					buttons[i].classList.remove("active");
				}
			}

			/**
			 * @this {HTMLButtonElement}
			 */
			var handleButtonClick = function () {
				var operation = this.value;
				if (operation) {
					if (operation === "CLEAR") {
						if (window.confirm("Are you sure you want to delete all of your drawn features?")) {
							gLayer.clear();
						}
					} else {
						map.setInfoWindowOnClick(false);
						if (operation === "TEXT") {
							draw.activate(Draw.POINT);
						} else {
							draw.activate(Draw[operation]);
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
			graphicsLayerOptions.styling = this.symbols ? true : Boolean(graphicsLayerOptions.styling);
			graphicsLayerOptions.className = graphicsLayerOptions.className || "drawn-features";
			graphicsLayerOptions.dataAttributes = graphicsLayerOptions.dataAttributes || "geometry-type";

			// Create a graphics layer to store drawn graphics.
			var gLayer = new GraphicsLayer(graphicsLayerOptions);

			this.layer = gLayer;

			map.addLayer(gLayer);

			// Create the Draw toolbar.
			var draw = new Draw(map);
			this.draw = draw;

			// Setup the Draw toolbar's event handler that will add graphics to the graphics layer.
			draw.on("draw-complete", function (e) {
				this.deactivate();
				self.emit("draw-complete", e);
				map.setInfoWindowOnClick(true);
				var graphic = new Graphic(e.geometry, symbols ? createTextSymbol() || symbols.getSymbol(e.geometry) : null, { "geometry-type": e.geometry.type });
				gLayer.add(graphic);
				// Remove styling for active buttons.
				removeActiveStyling();
			});

			// Create the Draw UI.
			var drawUI = new DrawUI(drawUIElement);

			// Assign event handlers to buttons.
			var buttons = drawUI.root.querySelectorAll("button");

			for (var i = 0, l = buttons.length; i < l; i += 1) {
				buttons[i].addEventListener("click", handleButtonClick);
			}
		}
	});

	DrawUIHelper.SymbolOptions = SymbolOptions;

	return DrawUIHelper;
});