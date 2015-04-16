/*global define*/
define([
	"./main",
	"esri/toolbars/draw",
	"esri/layers/GraphicsLayer",
	"esri/graphic"
], function (DrawUI, Draw, GraphicsLayer, Graphic) {
	function DrawUIHelper(map, drawUIElement) {

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
				}
			}
		};


		// Create a graphics layer to store drawn graphics.
		// Styling of graphics will be handled by CSS.
		var gLayer = new GraphicsLayer({
			id: "drawnFeatures",
			styling: false,
			className: "drawn-features",
			dataAttributes: "geometry-type"
		});

		map.addLayer(gLayer);

		// Create the Draw toolbar.
		var draw = new Draw(map);

		// Setup the Draw toolbar's event handler that will add graphics to the graphics layer.
		draw.on("draw-complete", function (e) {
			this.deactivate();
			var graphic = new Graphic(e.geometry, null, {"geometry-type": e.geometry.type});
			gLayer.add(graphic);
		});

		// Create the Draw UI.
		var drawUI = new DrawUI(drawUIElement);

		// Assign event handlers to buttons.
		var buttons = drawUI.root.querySelectorAll("button");

		for (var i = 0, l = buttons.length; i < l; i += 1) {
			buttons[i].addEventListener("click", handleButtonClick);
		}

		////// Add event listener that will activate the tool corresponding to the button that the user clicked.
		////drawUI.root.addEventListener("draw-tool-selected", function (e) {
		////	draw.activate(Draw[e.detail]);
		////});

		////drawUI.root.addEventListener("delete", function () {
		////	gLayer.clear();
		////});


	}

	return DrawUIHelper;
});