const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[id].[chunkhash].js',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Map',
      template: __dirname + '/src/index.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'static', to: 'static' }]
    })
  ],
  devServer: { static: './dist' },
  optimization: {
    runtimeChunk: 'single',
  },
  resolve: {
    extensions: ['.js', '.json']
  },
};