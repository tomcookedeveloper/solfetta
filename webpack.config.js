const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        "solfetta": ['./src/solfetta.js', './src/solfetta.css']
    },
    module: {
        rules: [{
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(css)$/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Caching',
            template: './src/index_template.html'
        }),
        new CopyPlugin({
            patterns: [
                "./images/icon-256.png",
                "./images/favicon.ico",
                "./LICENSE"
            ],
        })
    ],
    output: {
        library: 'Solfetta',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true
    },
    target: ['web', 'es5']
};