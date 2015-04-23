/*global require*/
require([
	"esri/map",
	"esri/InfoTemplate",
	"esri/layers/ArcGISDynamicMapServiceLayer",
	"arcgis-draw-ui/arcgis-helper",
	"esri/symbols/SimpleMarkerSymbol",
	"esri/symbols/SimpleLineSymbol",
	"esri/symbols/SimpleFillSymbol"
], function (Map, InfoTemplate, ArcGISDynamicMapServiceLayer, DrawUIHelper, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol) {
	var map, helper;



	/**
	 * Creates a document fragment containing a button that will
	 * delete the associated graphic from its parent layer.
	 * @param {esri/Graphic} graphic
	 * @returns {HTMLDocumentFragment}
	 */
	function createInfoWindowContent(graphic) {
		var frag = document.createDocumentFragment();
		var btn = document.createElement("button");
		btn.type = "Button";
		btn.onclick = deleteFeature;
		btn.textContent = "Delete";
		btn.title = "Delete the selected graphic.";
		btn.classList.add("delete-feature-button");

		var deleteFeature = function () {
			map.infoWindow.hide();
			console.log(graphic);
			helper.layer.remove(graphic);
		};

		btn.onclick = deleteFeature;
		
		frag.appendChild(btn);
		return frag;
	}

	var lineSymbol = new SimpleLineSymbol();
	var pointSymbol = new SimpleMarkerSymbol();
	var fillSymbol = new SimpleFillSymbol();

	lineSymbol.setColor("red");
	pointSymbol.setOutline(lineSymbol);
	fillSymbol.setOutline(lineSymbol);

	var symbolOptions = new DrawUIHelper.SymbolOptions(pointSymbol, lineSymbol, fillSymbol);

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

	helper = new DrawUIHelper(map, document.getElementById("drawUI"), symbolOptions);
	helper.on("draw-activate", function () {
		console.log("draw-activate");
	});
	helper.on("draw-complete", function (e) {
		console.log("draw-complete", e);
	});

	// Setup draw layer info template.
	helper.layer.setInfoTemplate(new InfoTemplate("Drawn Graphic", createInfoWindowContent));
});