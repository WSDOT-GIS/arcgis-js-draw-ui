/*global define*/
define([
	"./main",
	"dojo/_base/declare",
	"esri/toolbars/draw",
	"esri/layers/GraphicsLayer",
	"esri/graphic"
], function (DrawUI, declare, Draw, GraphicsLayer, Graphic) {

	var DrawUIHelper = declare(null, {
		layer: null,
		draw: null,
		constructor: function (map, drawUIElement) {

			/**
			 * Removes the "active" class from the buttons.
			 */
			function removeActiveStyling() {
				var button = drawUIElement.querySelector("button.active");
				if (button) {
					button.classList.remove("active");
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
						this.classList.add("active");
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

			this.layer = gLayer;

			map.addLayer(gLayer);

			// Create the Draw toolbar.
			var draw = new Draw(map);
			this.draw = draw;

			// Setup the Draw toolbar's event handler that will add graphics to the graphics layer.
			draw.on("draw-complete", function (e) {
				this.deactivate();
				map.setInfoWindowOnClick(true);
				var graphic = new Graphic(e.geometry, null, { "geometry-type": e.geometry.type });
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

	return DrawUIHelper;
});