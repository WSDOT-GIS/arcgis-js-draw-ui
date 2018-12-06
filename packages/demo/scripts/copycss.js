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
