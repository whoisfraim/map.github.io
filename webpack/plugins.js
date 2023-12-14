const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (options) => [
  new MiniCssExtractPlugin({ filename: options.paths.css }),
  new HtmlWebpackPlugin({
    title: 'Map',
    template: options.paths.html,
    filename: 'index.html',
  }),
  new CopyWebpackPlugin(options.copy),
];
