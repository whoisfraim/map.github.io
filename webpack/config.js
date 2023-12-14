const getPlugins = require('./plugins');
const getDevServer = require('./devServer');
const getLoaders = require('./loaders');
const getOptimization = require('./optimization');

module.exports = (options) => ({
  mode: options.mode,
  entry: options.paths.entry,
  output: options.paths.output,
  plugins: getPlugins(options),
  devServer: options.isDev ? getDevServer(options) : undefined,
  module: getLoaders(options),
  optimization: getOptimization(options),
  resolve: options.resolve,
});