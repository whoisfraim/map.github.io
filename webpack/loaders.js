const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (options) => ({
  rules: [
    {
      test: /\.css$/i,
      use: [options.isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
    },
    {
      test: /\.(png|jpg|jpeg|gif)$/,
      type: 'asset/resource',
      generator: {
        filename: options.paths.resources,
      }
    },
    {
      test: /\.(?:js|mjs|cjs)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: 'defaults' }]
          ]
        }
      }
    }
  ],
});