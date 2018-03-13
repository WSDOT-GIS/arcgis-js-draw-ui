import Map = require("esri/map");
import InfoTemplate = require("esri/InfoTemplate");
import ArcGISDynamicMapServiceLayer = require("esri/layers/ArcGISDynamicMapServiceLayer");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");
import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol");
import TextSymbol = require("esri/symbols/TextSymbol");
import DrawUIHelper from "../dist/ArcGisHelper";

// tslint:disable:no-console

/**
 * Creates a document fragment containing a button that will
 * delete the associated graphic from its parent layer.
 * @param {esri/Graphic} graphic
 * @returns {HTMLDocumentFragment}
 */
function createInfoWindowContent(graphic) {
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

lineSymbol.setColor("red" as any);
pointSymbol.setOutline(lineSymbol);
fillSymbol.setOutline(lineSymbol);
textSymbol.setColor("red" as any);

const symbolOptions = new DrawUIHelper.SymbolOptions(
  pointSymbol,
  lineSymbol,
  fillSymbol,
  textSymbol
);

const layer = new ArcGISDynamicMapServiceLayer(
  "http://www.wsdot.wa.gov/geosvcs/ArcGIS/rest/services/Shared/LegislativeDistricts/MapServer",
  {
    id: "Legislative Districts",
    infoTemplates: {
      "0": {
        infoTemplate: new InfoTemplate(),
        layerUrl: null
      }
    }
  }
);

// Create the map in #map element.
const map = new Map("map", {
  basemap: "hybrid",
  center: [-120.80566406246835, 47.41322033015946],
  zoom: 7,
  showAttribution: true,
  showInfoWindowOnClick: true
});
map.setInfoWindowOnClick(true);

map.on("load", function() {
  map.addLayer(layer);
  console.log("layer info", layer.infoTemplates);
});

const helper = new DrawUIHelper(
  map,
  document.getElementById("drawUI"),
  symbolOptions
);
helper.on("draw-activate", function() {
  console.log("draw-activate");
});
helper.on("draw-complete", function(e) {
  console.log("draw-complete", e);
});

// Setup draw layer info template.
helper.layer.setInfoTemplate(
  new InfoTemplate("Drawn Graphic", createInfoWindowContent)
);
