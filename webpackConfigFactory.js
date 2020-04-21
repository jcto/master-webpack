const appPackageJson = require("...package.json");
const safePostCssParser = require("postcss-safe-parser");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || "10000"
);

module.exports.webpackConfigFactory = function (configEnv = "development") {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";

  configEnv == "production" ? "development" : "production";
  return {
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? "source-map"
        : false
      : isEnvDevelopment && "cheap-module-source-map",
    // entry:'src/index.js',
    // entry:{main:'src/index.js'}
    entry: ["src/index.js"],
    output: {
      path: "./dist",
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction
        ? "static/js/[name].[contenthash:8].js"
        : isEnvDevelopment && "static/js/bundle.js",
      chunkFilename:
        isEnvProduction && "static/js/[name].[contenthash:8].chunk.js",
      publicPath: "/",
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
              warnins: false,
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
              comment: false,
              ascii_only: true,
            },
          },
          sourceMap: shouldUseSourceMap,
        }),
        // 压缩css
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
        name: false,
      },
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
    },
    // 告诉webpack到哪里寻找引用的模块
    resolve: {
      modules: ["node_modules"],
      extensions: ["js", "jsx", "ts", "tsx", "vue"],
      //   给要引用的特定的模块取个别名，方便引用
      alias: {},
      plugins: [PnpWebpackPlugin],
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          paser: {
            requireEnsure: false,
          },
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          enforce: "pre",
          use: [
            {
              loader: require.resolve("eslint-loader"),
              options: {
                cache: true,
                eslintPath: require.resolve("eslint"),
                resolvePluginsRelativeTo: __dirname,
              },
            },
          ],
          include: "./src",
        },
        {
          oneOf: [
            //   图片
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve("url-loader"),
              options: {
                limit: imageInlineSizeLimit,
                name: "static/imgs/[name].[hash:8].[ext]",
              },
            },
            {
              test: /\.(js|jsx|ts|tsx)$/,
              include: "./src",
              loader: require.resolve("babel-loader"),
              options: {},
            },
            {
              test: /\.css$/,
              use: [
                isEnvDevelopment && require.resolve("style-loader"),
                isEnvProduction && {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    // publicPath:'../../'
                  },
                },
                {
                  loader: require.resolve("css-loader"),
                  options: {
                    importLoaders: 1,
                    sourceMap: isEnvProduction && shouldUseSourceMap,
                  },
                },
              ],
              sideEffects: true,
            },
            {
              test: /\.(scss|sass)$/,
              use: [
                isEnvDevelopment && require.resolve("style-loader"),
                isEnvProduction && {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    // publicPath:'../../'
                  },
                },
                {
                  loader: require.resolve("css-loader"),
                  options: {
                    importLoaders: 3,
                    sourceMap: isEnvProduction && shouldUseSourceMap,
                  },
                },
                "sass-loader",
              ],
              sideEffects: true,
            },
            {
              loader: require.resolve("file-loader"),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: "static/img/[name].[hash:8].[ext]",
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: "./public/index.html",
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttribute: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),
      new webpack.DefinePlugin(env.stringified),
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          filename: "static/css/[name].[contenthash:8].css",
          chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
      new ManifestPlugin({
        fileName: "asset-manifest.json",
        publicPath: "/",
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.main.filter(
            (fileName) => !fileName.endsWith(".map")
          );

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),
      isEnvProduction &&
        new WorkboxWebpackPlugin.GenerateSW({
          clientsClaim: true,
          exclude: [/\.map$/, /asset-manifest\.json$/],
          importWorkboxFrom: "cdn",
          navigateFallback: paths.publicUrlOrPath + "index.html",
          navigateFallbackBlacklist: [
            new RegExp("^/_"),
            new RegExp("/[^/?]+\\.[^/]+$"),
          ],
        }),
    ],
    performance: false,
  };
};
