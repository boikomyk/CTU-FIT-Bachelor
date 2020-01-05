import Config from "webpack-config";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack";

// noinspection ChainedFunctionCallJS
export default new Config().extend("config/webpack.base.config.js").merge({
  entry: {
    bundle: "./src/index.js"
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "../public")
  },
  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png|gif|svg|pdf|ico|ttf|woff2?)$/,
        use: [
          {
            loader: "file-loader?name=images/[name].[ext]"
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "../public"),
    port: 9000,
    watchOptions: {
      inline: true,
      port: 9000,
      aggregateTimeout: 300,
      poll: 1000
    },
    proxy: {
      "/": {
        target: "http://localhost",
        secure: false
      }
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization"
    },
    hot: true
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../public/index.html"),
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});
