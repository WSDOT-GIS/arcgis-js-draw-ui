/*global require*/
require([
	"esri/map",
	"esri/InfoTemplate",
	"esri/layers/ArcGISDynamicMapServiceLayer",
	"arcgis-draw-ui/arcgis-helper"
], function (Map, InfoTemplate, ArcGISDynamicMapServiceLayer, DrawUIHelper) {
	var map, helper;

	var layer = new ArcGISDynamicMapServiceLayer("http://www.wsdot.wa.gov/geosvcs/ArcGIS/rest/services/Shared/LegislativeDistricts/MapServer", {
		id: "Legislative Districts",
		infoTemplates: {
			"0": {
				infoTemplate: new InfoTemplate(),
				layerUrl: null
			}
		}
	});

	// Create the map in #map element.
	map = new Map("map", {
		basemap: "hybrid",
		center: [-120.80566406246835, 47.41322033015946],
		zoom: 7,
		showAttribution: true,
		showInfoWindowOnClick: true
	});
	map.setInfoWindowOnClick(true);

	map.on("load", function () {
		map.addLayer(layer);
		console.log("layer info", layer.infoTemplates);
	});

	helper = new DrawUIHelper(map, document.getElementById("drawUI"));
});