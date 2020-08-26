const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const common = require('./webpack-common.js');
const merge = require('webpack-merge');

module.exports = merge(common, {
    mode: 'development',
    

    
  devServer: {
    publicPath: "/",
    contentBase: "./dist",
    hot: true,
    filename: 'login.js'

  },


    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates style nodes from JS strings
                    'style-loader',
                    // compile css into commonJS
                    'css-loader',
                    // Compile sass to css
                    'sass-loader'
                ],
            },
            
            {
                test: /\.html$/,
                use: ["html-loader"]
              },
              {
                test: /\.(svg|png|jpe?g|gif)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                    name: "[name].[ext]",
                    outputPath: 'images',
                },
                }
                
              },
        ],
    },
});