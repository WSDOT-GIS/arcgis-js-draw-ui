/*global define*/
define([
	"./main",
	"dojo/_base/declare",
	"dojo/Evented",
	"esri/toolbars/draw",
	"esri/layers/GraphicsLayer",
	"esri/graphic"
], function (DrawUI, declare, Evented, Draw, GraphicsLayer, Graphic) {

	/**
	 * @typedef {Object} SymbolOptionsOptions
	 * @property {esri/symbols/MarkerSymbol} point - Symbol that will be used for point features.
	 * @property {esri/symbols/LineSymbol} line - Symbol that will be used for line features.
	 * @property {esri/symbols/FillSymbol} polygon - Symbol that will be used for polygon features.
	 */


	/**
	 * Contains point, line, and polygon symbols.
	 * @param {(esri/symbols/MarkerSymbol|SymbolOptionsOptions)} pointSymbolOrSymbolOptions
	 * @param {esri/symbols/LineSymbol} [lineSymbol] - Required if first parameter was a MarkerSymbol.
	 * @param {esri/symbols/FillSymbol} [polygonSymbol] - Required if the first parameter was a MarkerSymbol.
	 */
	function SymbolOptions() {
		this.point = null;
		this.line = null;
		this.polygon = null;
		if (arguments.length === 1) {
			this.point = arguments[0].point;
			this.line = arguments[0].line;
			this.polygon = arguments[0].polygon;
		} else if (arguments.length === 3) {
			this.point = arguments[0];
			this.line = arguments[1];
			this.polygon = arguments[2];
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
						gLayer.clear();
					} else {
						draw.activate(Draw[operation]);
						map.setInfoWindowOnClick(false);
						// Add a class to allow "active" operation's button to by styled.
						removeActiveStyling();
						this.classList.add("active");
						self.emit("draw-activate", {});
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
				var graphic = new Graphic(e.geometry, symbols ? symbols.getSymbol(e.geometry) : null, { "geometry-type": e.geometry.type });
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