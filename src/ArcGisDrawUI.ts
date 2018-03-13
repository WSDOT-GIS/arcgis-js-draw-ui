/**
 * Represents a drawing operation that the user can select from the toolbar.
 */
function DrawingOperation(name, properties) {
  Object.defineProperties(this, {
    name: { value: name },
    definition: { value: properties.definition }
  });
}

// Convert generic objects to DrawingOperation objects.
const drawingOperations = (function(ops) {
  const output = {};
  for (const name in ops) {
    if (ops.hasOwnProperty(name)) {
      output[name] = new DrawingOperation(name, ops[name]);
    }
  }
  return output;
})({
  TEXT: { definition: "Adds a text label" },
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
  CLEAR: { definition: "Deletes the user-drawn graphics." }
});

/**
 * Creates a CSS class name. Name is lower case with hyphen (-) separated words.
 * @returns {string}
 */
DrawingOperation.prototype.toClassName = function() {
  return this.name.replace("_", "-").toLowerCase();
};

/**
 * Creates a button for the drawing operation.
 * @returns {HTMLButtonElement}
 */
DrawingOperation.prototype.createDrawUIButton = function() {
  const button = document.createElement("button");
  button.type = "button";
  button.value = this.name;
  button.title = this.definition;
  button.disabled = this.name === "TEXT";
  button.classList.add(this.toClassName());

  const iconSpan = document.createElement("span");
  iconSpan.classList.add("icon");
  button.appendChild(iconSpan);

  const labelSpan = document.createElement("span");
  labelSpan.classList.add("label");
  labelSpan.textContent = this.toClassName();
  button.appendChild(labelSpan);

  return button;
};

/**
 * Creates a toolbar UI for drawing graphics on a map.
 * @param {HTMLElement} rootDiv - An HTML container element, e.g., <div>, <nav>.
 * @class
 */
function DrawUI(rootDiv: HTMLElement) {
  rootDiv.classList.add("draw-ui");
  let button, docFrag;
  docFrag = document.createDocumentFragment();
  for (const name in drawingOperations) {
    if (drawingOperations.hasOwnProperty(name)) {
      button = drawingOperations[name].createDrawUIButton();
      docFrag.appendChild(button);
    }
  }
  docFrag.appendChild(button);
  rootDiv.appendChild(docFrag);

  const textbox = document.createElement("input");
  textbox.type = "text";
  textbox.name = "label";
  textbox.placeholder = "label for text goes here";

  const textButton = rootDiv.querySelector(
    "button[value='TEXT']"
  ) as HTMLButtonElement;

  textbox.addEventListener("change", function() {
    textButton.disabled = !Boolean(this.value);
  });

  rootDiv.insertBefore(textbox, rootDiv.firstChild);

  Object.defineProperties(this, {
    root: { value: rootDiv }
  });
}

(DrawUI as any).drawingOperations = drawingOperations;

export = DrawUI;
