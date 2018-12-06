const webpack = require("webpack");
const path = require("path");

const config = {
  mode: "production",
  devtool: "source-map",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    libraryTarget: "amd"
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  externals: /^(esri)|(dojo)|(dijit)/
};

module.exports = config;
