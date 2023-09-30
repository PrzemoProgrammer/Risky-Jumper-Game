const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "/index.js",
  mode: "production",
  target: "node",
  externals: [nodeExternals()],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
