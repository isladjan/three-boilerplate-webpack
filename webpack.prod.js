const path = require("path");                                             
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const WebpackBar = require("webpackbar");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {

  mode: "production",

  entry: path.resolve(__dirname, "./src/index.js"),

  output: {                                     
    path: path.resolve(__dirname, "./dist"),     
    filename: "js/[name].[contenthash].js", 
  },

  stats: {                           
    modules: false,
    entrypoints: false,
  },

  //devtool: "source-map",

  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },

  plugins: [
    new WebpackBar({}),                      

    new CleanWebpackPlugin({}),             

    new CopyPlugin({                            
      patterns: [
        { from: "src/img", to: "img" },        
      ],
    }),


    new MiniCssExtractPlugin({                
      filename: "css/main.[contenthash].css"    
    }),

    new HtmlWebpackPlugin({
      template: './src/template.html',            
      inject: 'body'                    
    })
  ],


  module: {
    rules: [

      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,

          { loader: "css-loader", options: { url: false } },

          { loader: "postcss-loader", options: {} },
        ],
      },
    ]
  },


  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
        },
      }
    },
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: { comments: false },
        },
        extractComments: false,

      }),

      new CssMinimizerPlugin({
        minimizerOptions: {
          sourceMap: true,                                  
          preset: ["default", { discardComments: { removeAll: true } }]
        }
      }),
    ]
  },
};