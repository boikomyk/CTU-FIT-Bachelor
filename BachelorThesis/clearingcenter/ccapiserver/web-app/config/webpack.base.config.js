import Config from "webpack-config";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import autoprefixer from "autoprefixer";
import path from "path";
const DotenvPlugin = require("webpack-dotenv-plugin");

export default new Config().merge({
  entry: {
    bundle: path.resolve(__dirname, "../src/index.js")
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => [
                autoprefixer({
                  browsers: [
                    ">1%",
                    "last 4 versions",
                    "Firefox ESR",
                    "not ie < 9"
                  ]
                })
              ]
            }
          },
          "sass-loader"
        ]
      }
    ]
  },

  resolve: {
    modules: [path.resolve(__dirname, "../src"), "node_modules"],
    extensions: [".js", ".jsx", ".json", ".jss", ".scss"]
  },
  plugins: [
    new DotenvPlugin({
      path: ".env",
      sample: ".env",
      allowEmptyValues: true
    })
  ]
});
