ArcGIS JavaScript Draw UI
=========================

User interface for ArcGIS API for JavaScript's [Draw] toolbar.

## Design Goals ##

* The UI code is kept separate from the ArcGIS API for JavaScript code. This allows it to be used with other frameworks in the future.
* Use built-in functionality wherever possible. (E.g., [CustomEvents] are used to fire events instead of [dojo/on].) Use polyfills for backward compatibility with older browsers.

## Polyfills ##

The draw UI uses [CustomEvents] to communicate. For [browsers that do not support CustomEvents] you will need to use a polyfill.

E.g. 

```html
<script src="//cdn.polyfill.io/v1/polyfill.min.js?features=CustomEvent"></script>
```

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