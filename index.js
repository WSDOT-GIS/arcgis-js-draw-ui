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