var path = require("path");
var {CleanWebpackPlugin} = require('clean-webpack-plugin')
var htmlWebpackPlugin=require('html-webpack-plugin')
module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "./dist/step1/"),
    filename: "[name].js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {},
          },
        ],
      },
    ],
  },
  plugins: [
      new CleanWebpackPlugin(),
      new htmlWebpackPlugin({
          template:'./index.html',
          filename:'./indexDist.html'
      })
  ],
  devtool: "source-map",
};
