ArcGIS JavaScript Draw UI
=========================

User interface for ArcGIS API for JavaScript's [Draw] toolbar.

## Design Goals ##

* The UI code is kept separate from the ArcGIS API for JavaScript code. This allows it to be used with other frameworks in the future.
* Use built-in functionality wherever possible. Use polyfills for backward compatibility with older browsers.
* Buttons are standard HTML `<button>` elements. Some frameworks (e.g. Dojo) have their own "button" objects that are not actually HTML `<button>` elements, but instead are made of `<span>` or other types of HTML elements.

## Generated markup ##

Inside the root element will be a series of `<button>` elements.  Each button has a class indicating the operation it represents and contains two `<span>` elements: 

1. The first `<span>` has a class of `label` and contains a text label. This label span can be hidden using CSS if desired if you only want to see icons.
2. The second `<span>` is empty and has an class of `icon`. This is used to give the button an icon using CSS.

## Setup ##

```javascript
/*global require*/
require([
	"esri/map",
	"arcgis-draw-ui/arcgis-helper"
], function (Map, DrawUIHelper) {
	var map, helper;

	// Create the map in #map element.
	map = new Map("map", {
		basemap: "hybrid",
		center: [-120.80566406246835, 47.41322033015946],
		zoom: 7,
		showAttribution: true
	});

	helper = new DrawUIHelper(map, document.getElementById("drawUI"));
});
```

```css
.drawn-features path {
    stroke: red;
    stroke-opacity: 1;
    stroke-width: 10px;
    stroke-linecap: round;
    stroke-linejoin: round;
}
```

[CustomEvents]:https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
[browsers that do not support CustomEvents]:https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Browser_compatibility
[dojo/on]:https://dojotoolkit.org/reference-guide/dojo/on.html
[Draw]:https://developers.arcgis.com/javascript/jsapi/draw-amd.html