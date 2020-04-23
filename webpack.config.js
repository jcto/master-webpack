const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const safePostCssParser = require("postcss-safe-parser");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

const isEnvProduction = true;

const isEnvDevelopment = false;
const appPackageJson = require("./package.json");

module.exports = {
  mode: "production",
  bail: true,
  devtool: isEnvProduction
    ? shouldUseSourceMap
      ? "source-map"
      : false
    : isEnvDevelopment && "cheap-module-source-map",
  // entry: ["./src/index.js"],
  entry: {
    main: "./src/index.js",
    reactApp: "./src/reactApp.js",
    vueApp: "./src/vueApp.js",
  },
  output: {
    // 这里需要绝对路径
    path: path.resolve(__dirname, "dist"),
    filename: isEnvProduction
      ? "static/js/[name].[contenthash:8].js"
      : isEnvDevelopment && "static/js/bundle.js",
    pathinfo: isEnvDevelopment,
    chunkFilename: isEnvProduction
      ? "static/js/[name].[contenthash:8].chunk.js"
      : isEnvDevelopment && "static/js/[name].chunk.js",
    publicPath: "./",
    jsonpFunction: `webpackJsonp${appPackageJson.name}`,
    globalObject: "this",
  },
  optimization: {
    minimize: isEnvProduction,
    minimizer: [
      // 压缩js
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          keep_classnames: false,
          keep_fnames: false,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        extractComments: false,
        sourceMap: shouldUseSourceMap,
      }), // 压缩css
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: shouldUseSourceMap
            ? {
                inline: false,
                annotation: true,
              }
            : false,
        },
        cssProcessorPluginOptions: {
          preset: [
            "default",
            {
              minifyFontValues: {
                removeQuotes: false,
              },
            },
          ],
        },
      }),
    ],
    splitChunks: {
      chunks: "all",

      // name: false,
      cacheGroups: {},
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
  },
  resolve: {
    modules: ["node_modules"],
    alias: { "@": "./src" },
    extensions: [".js", ".jsx", ".ts", ".vue"],
    plugins: [PnpWebpackPlugin],
  },
  resolveLoader: {
    plugins: [
      // Also related to Plug'n'Play, but this time it tells webpack to load its loaders
      // from the current package.
      PnpWebpackPlugin.moduleLoader(module),
    ],
  },
  module: {
    strictExportPresence: true,

    rules: [
      { parser: { requireEnsure: false } },
      // eslint TODO
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve("url-loader"),
        options: {
          limit: "10000",
          name: "static/media/[name].[hash:8].[ext]",
        },
      },
      {
        test: /\.css$/,
        include: [path.resolve("./src")],
        use: [
          isEnvProduction
            ? {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: "./cao/",
                },
              }
            : "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.less$/,
        include: [path.resolve("./src")],
        use: [
          isEnvProduction
            ? {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: "./cao/",
                },
              }
            : "style-loader",
          "css-loader",
          "less-loader",
        ],
      },
      { test: /\.vue/, loader: "vue-loader" },
      {
        test: /\.(ts|js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      excludeChunks: ["reactApp", "vueApp"],
    }),
    new HtmlWebpackPlugin({
      template: "./public/reactApp.html",
      filename: "reactApp.html",
      excludeChunks: ["main", "vueApp"],
    }),
    new HtmlWebpackPlugin({
      template: "./public/vueApp.html",
      filename: "vueApp.html",
      chunks: ["vueApp"],
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    isEnvProduction &&
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:8].css",
        chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
      }),
  ],
};
