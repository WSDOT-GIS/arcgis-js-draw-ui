ArcGIS JavaScript Draw UI
=========================

User interface for the [Draw] toolbar of the ArcGIS API for JavaScript (version 3.X).

[Demo](http://wsdot-gis.github.io/arcgis-js-draw-ui/demo/)

## Design Goals ##

* The UI code is kept separate from the ArcGIS API for JavaScript code. This allows it to be used with other frameworks in the future.
* Use built-in functionality wherever possible. Use polyfills for backward compatibility with older browsers.
* Buttons are standard HTML `<button>` elements. Some frameworks (e.g. Dojo) have their own "button" objects that are not actually HTML `<button>` elements, but instead are made of `<span>` or other types of HTML elements.

## Generated markup ##

Inside the root element will be a series of `<button>` elements.  Each button has a class indicating the operation it represents and contains two `<span>` elements:

1. The first `<span>` has a class of `label` and contains a text label. This label span can be hidden using CSS if desired if you only want to see icons.
2. The second `<span>` is empty and has an class of `icon`. This is used to give the button an icon using CSS.

## Setup ##

### Install ###

```shell
$ npm install @wsdot/arcgis-js-draw-ui
```

If your are using typescript, you'll need some additional modules for development.

```shell
$ npm install -SD typescript @types/arcgis-js-api@3
```

### Required CSS ###

The package includes a CSS file for providing the necessary styling for the toolbar. As part of your build process, you'll need to copy the `node_modules/@wsdot/arcgis-js-draw-ui/arcgis-draw-ui.css` file to your website directory and then reference this copy in your page. If this CSS file is not included, the buttons will have text labels instead of icons.

#### Sample NodeJS script to copy CSS file ####

```javascript
/**
 * Copies the CSS file from the @wsdot/arcgis-js-draw-ui package to the root folder.
 */

const fs = require("fs");

(async () => {
  process.stderr.write("Copying CSS file...");
  try {
    await fs.promises.copyFile(
      "node_modules/@wsdot/arcgis-js-draw-ui/arcgis-draw-ui.css",
      "arcgis-draw-ui.css"
    );
  } catch (error) {
    console.error("error copying file", error);
    throw error;
  }
})();

```

### Use ###

The TypeScript sample code below shows how to use the module. This code is taken from the `demo` package in this code repository.

```typescript
import EsriMap from "esri/map";
import Graphic from "esri/graphic";
import InfoTemplate from "esri/InfoTemplate";
import SimpleMarkerSymbol from "esri/symbols/SimpleMarkerSymbol";
import SimpleLineSymbol from "esri/symbols/SimpleLineSymbol";
import SimpleFillSymbol from "esri/symbols/SimpleFillSymbol";
import TextSymbol from "esri/symbols/TextSymbol";

import { SymbolOptions, DrawUIHelper } from "@wsdot/arcgis-js-draw-ui";

/**
 * Creates a document fragment containing a button that will
 * delete the associated graphic from its parent layer.
 * @param {esri/Graphic} graphic
 * @returns {HTMLDocumentFragment}
 */
function createInfoWindowContent(graphic: Graphic) {
  const deleteFeature = function() {
    map.infoWindow.hide();
    console.log(graphic);
    helper.layer.remove(graphic);
  };

  const frag = document.createDocumentFragment();
  const btn = document.createElement("button");
  btn.type = "Button";
  btn.onclick = deleteFeature;
  btn.textContent = "Delete";
  btn.title = "Delete the selected graphic.";
  btn.classList.add("delete-feature-button");

  btn.onclick = deleteFeature;

  frag.appendChild(btn);
  return frag;
}

const lineSymbol = new SimpleLineSymbol();
const pointSymbol = new SimpleMarkerSymbol();
const fillSymbol = new SimpleFillSymbol();
const textSymbol = new TextSymbol("Default Label");

// Cast from string color name to "any" type required due to issues with dojo/color type declaration.
lineSymbol.setColor("red" as any);
pointSymbol.setOutline(lineSymbol);
fillSymbol.setOutline(lineSymbol);
textSymbol.setColor("red" as any);

const symbolOptions = new SymbolOptions(
  pointSymbol,
  lineSymbol,
  fillSymbol,
  textSymbol
);

// Create the map in #map element.
const map = new EsriMap("map", {
  basemap: "hybrid",
  center: [-120.80566406246835, 47.41322033015946],
  zoom: 7,
  showAttribution: true,
  showInfoWindowOnClick: true
});
map.setInfoWindowOnClick(true);

const helper = new DrawUIHelper(
  map,
  document.getElementById("drawUI")!,
  symbolOptions
);
helper.on("draw-activate", function() {
  console.log("draw-activate");
});
helper.on("draw-complete", function(e: any) {
  console.log("draw-complete", e);
});

// Setup draw layer info template.
helper.layer.setInfoTemplate(
  new InfoTemplate("Drawn Graphic", createInfoWindowContent)
);
```

### Customizing drawn line symbol via CSS

```css
.drawn-features path {
    stroke: red;
    stroke-opacity: 1;
    stroke-width: 10px;
    stroke-linecap: round;
    stroke-linejoin: round;
}
```

## Credits ##

[Trashcan icon](https://openclipart.org/detail/141991/trashcan)

[Draw]:https://developers.arcgis.com/javascript/3/jsapi/draw-amd.html
