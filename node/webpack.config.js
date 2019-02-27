const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    //mode: 'development',
    entry: './app/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
            test: /\.ts$/,
            loader: 'ts-loader',
        },{
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        },{
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=100000',
        }]
    },
    plugins: [
        /** HTML generator */
        new HtmlWebpackPlugin({
            title: 'jsore.com',
        }),
        /** for Bootstrap functionality */
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
        }),
    ],
};