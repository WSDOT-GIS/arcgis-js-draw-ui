/*global define*/
define([
	"./main",
	"esri/toolbars/draw",
	"esri/layers/GraphicsLayer",
	"esri/graphic"
], function (DrawUI, Draw, GraphicsLayer, Graphic) {
	function DrawUIHelper(map, drawUIElement) {
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

		// Add event listener that will activate the tool corresponding to the button that the user clicked.
		drawUI.root.addEventListener("draw-tool-selected", function (e) {
			draw.activate(Draw[e.detail]);
		});
	}

	return DrawUIHelper;
});