const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanwebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack-common.js');
const merge = require('webpack-merge');
const path = require('path');
module.exports = merge(common, {

    mode: 'production',
    optimization: {
        minimizer: [new OptimizeCssAssetsWebpackPlugin(), new TerserPlugin(),],
    },
    output: {
        filename: '[name].[contentHash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [new CleanwebpackPlugin(), new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: 'main.[contentHash].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader, //"style-loader",  Extract css into files
                    'css-loader', // compile css into commonJS
                    'sass-loader' // Compile sass to css
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
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
                        name: "[name].[hash].[ext]",
                        outputPath: 'images',
                    },
                },
                
            },
        ],
    },
});