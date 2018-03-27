/**
 * Valid drawing operation names
 */
declare type DrawOperationName =
  | "TEXT"
  | "POINT"
  | "MULTI_POINT"
  | "LINE"
  | "POLYLINE"
  | "FREEHAND_POLYLINE"
  | "POLYGON"
  | "FREEHAND_POLYGON"
  | "CIRCLE"
  | "EXTENT"
  | "RECTANGLE"
  | "ELLIPSE"
  | "TRIANGLE"
  | "ARROW"
  | "UP_ARROW"
  | "LEFT_ARROW"
  | "RIGHT_ARROW"
  | "DOWN_ARROW"
  | "CLEAR";

interface IDrawingOperationProperties {
  [key: string]: string;
  definition: string;
}

/**
 * Represents a drawing operation that the user can select from the toolbar.
 */
declare class DrawingOperation {
  public name: DrawOperationName;
  public definition: string;
  constructor(name: DrawOperationName, properties: IDrawingOperationProperties);

  /**
   * Creates a CSS class name. Name is lower case with hyphen (-) separated words.
   * @returns {string}
   */
  public toClassName(): string;

  /**
   * Creates a button for the drawing operation.
   * @returns {HTMLButtonElement}
   */
  public createDrawButton(): HTMLButtonElement;
}

/**
 * Creates a toolbar UI for drawing graphics on a map.
 * @class
 */
declare class DrawUI {
  public root: HTMLElement;
  /**
   * Creates a toolbar UI for drawing graphics on a map.
   * @param {HTMLElement} rootDiv - An HTML container element, e.g., <div>, <nav>.
   * @class
   */
  constructor(rootDiv: HTMLElement);
  public static drawingOperations: { [key: string]: DrawingOperation };
}

export = DrawUI;
