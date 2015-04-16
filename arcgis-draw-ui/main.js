/*global define*/
define(function () {

	function DrawingOperation(name, properties) {
		this.name = name;
		this.definition = properties.definition;
	}

	var drawingOperations = (function (ops) {
		var output = {};
		for (var name in ops) {
			if (ops.hasOwnProperty(name)) {
				output[name] = new DrawingOperation(name, ops[name]);
			}
		}
		return output;
	}(
		{
		POINT: { definition: "Draws a point." },
		MULTI_POINT: { definition: "Draws a Multipoint." },

		LINE: { definition: "Draws a line." },
		POLYLINE: { definition: "Draws a polyline." },
		FREEHAND_POLYLINE: { definition: "Draws a freehand polyline." },


		POLYGON: { definition: "Draws a polygon." },
		FREEHAND_POLYGON: { definition: "Draws a freehand polygon." },
		CIRCLE: { definition: "Draws a circle." },
		EXTENT: { definition: "Draws an extent box." },
		RECTANGLE: { definition: "Draws a rectangle." },
		ELLIPSE: { definition: "Draws an ellipse." },
		TRIANGLE: { definition: "Draws a triangle." },


		ARROW: { definition: "Draws an arrow." },
		UP_ARROW: { definition: "Draws an arrow that points up." },
		LEFT_ARROW: { definition: "Draws an arrow that points left." },
		RIGHT_ARROW: { definition: "Draws an arrow that points right." },
		DOWN_ARROW: { definition: "Draws an arrow that points down." },
		}));

	DrawingOperation.prototype.toClassName = function () {
		return this.name.replace("_", "-").toLowerCase();
	};

	DrawingOperation.prototype.createDrawUIButton = function () {
		var button = document.createElement("button");
		button.type = "button";
		button.value = this.name;
		button.title = this.definition;
		button.classList.add(this.toClassName());

		var iconSpan = document.createElement("span");
		iconSpan.classList.add("icon");
		button.appendChild(iconSpan);

		var labelSpan = document.createElement("span");
		labelSpan.classList.add("label");
		labelSpan.textContent = name.replace("_", " ").toLowerCase();
		button.appendChild(labelSpan);



		return button;
	};



	/**
	 * Creates a toolbar UI for drawing graphics on a map.
	 * @param {HTMLElement} rootDiv - An HTML container element, e.g., <div>, <nav>.
	 * @class
	 */
	function DrawUI(rootDiv) {
		/**
		 * 
		 * @this {HTMLButtonElement}
		 */
		function activateDrawToolbar() {
			var evt = new CustomEvent("draw-tool-selected", { detail: this.value });
			rootDiv.dispatchEvent(evt);
		}

		this.root = rootDiv;

		rootDiv.classList.add("draw-ui");

		var button, docFrag;

		docFrag = document.createDocumentFragment();

		for (var name in drawingOperations) {
			if (drawingOperations.hasOwnProperty(name)) {
				button = drawingOperations[name].createDrawUIButton();
				button.addEventListener("click", activateDrawToolbar);
				docFrag.appendChild(button);
			}
		}

		button = new DrawingOperation("Delete", { definition: "Deletes the user-drawn graphics." }).createDrawUIButton();
		docFrag.appendChild(button);

		button.addEventListener("click", function () {
			var evt = new CustomEvent("delete", null);
			rootDiv.dispatchEvent(evt);
		});

		rootDiv.appendChild(docFrag);
	}

	DrawUI.drawingOperations = drawingOperations;


	return DrawUI;
});