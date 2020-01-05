import Config from "webpack-config";
import ManifestPlugin from "webpack-manifest-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";

export default new Config().extend("config/webpack.base.config.js").merge({
  output: {
    path: __dirname + "/../../public/build",
    publicPath: "/build/",
    filename: "[name].[chunkhash:8].js",
    chunkFilename: "[name].[chunkhash:8].chunk.js"
  },
  module: {
    rules: [
      {
        test: /\.(svg|ttf|woff|woff2)$/,
        use: "base64-inline-loader"
      },
      {
        test: /\.(jpe?g|png|gif|pdf|ico|)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              limit: 50000,
              publicPath: "/build/",
              name: "images/[hash].[ext]"
            }
          }
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 1
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        cache: "/build/",
        parallel: true,
        test: /\.js(\?.*)?$/i,
        chunkFilter: chunk => {
          return chunk.name !== "vendors";
        },
        terserOptions: {
          output: {
            comments: false
          },
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {},
          mangle: true,
          module: false,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false
        }
      })
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.[contenthash:20].css",
      chunkFilename: "styles.[contenthash:20].css",
      allChunks: true
    }),
    new OptimizeCSSAssetsPlugin({}),
    new ManifestPlugin({
      publicPath: "/build/"
    })
  ]
});
