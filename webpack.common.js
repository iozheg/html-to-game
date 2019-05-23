const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/index.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Output managment",
      template: "./src/index.html"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      }, {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: 'images',
          },
        }],
      }
    ]
  }
};