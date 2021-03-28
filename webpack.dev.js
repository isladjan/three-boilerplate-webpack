const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackBar = require("webpackbar");

module.exports = {
    mode: "development",

    entry: path.resolve(__dirname, "./src/index.js"),

    output: {                                     
        path: path.resolve(__dirname, "./dist"),    
        filename: "js/[name].js",                  
    },

    stats: {                             
        modules: false,
        entrypoints: false,
    },

    devtool: "eval-source-map",
    //devtool: "source-map",            
    //devtool: false,                

    plugins: [
        new WebpackBar({}),                      

        new CleanWebpackPlugin({}),              

        new CopyPlugin({                             
            patterns: [
                { from: "src/img", to: "img" },         
            ],
        }),

        new MiniCssExtractPlugin({                  
            filename: "css/main.css"             
        }),

        new HtmlWebpackPlugin({
            template: "./src/template.html",            
            inject: "body"               
        }),
    ],


    module: {
        rules: [

            // .css 
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,

                    { loader: "css-loader", options: { url: false } },

                    { loader: "postcss-loader", options: {} },
                ],
            }
        ]
    },

    devServer: {                           
        compress: true,                  
        port: 9000,                         
        open: "Chrome",                      
        stats: "minimal",
        contentBase: './dist',
    },
};