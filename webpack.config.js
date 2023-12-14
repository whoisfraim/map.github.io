const path = require('path');

const getConfig = require('./webpack/config');

module.exports = (env) => {
  const mode = env.mode || 'development';
  const isDev = mode === 'development';
  const isProd = !isDev;

  const outputPath = path.resolve(__dirname, 'dist');

  const paths = {
    entry: {
      app: path.resolve(__dirname, 'src', 'index.js'),
      sw: {
        import: path.resolve(__dirname, 'src', 'sw.js'),
        filename: 'sw.js'
      }
    },
    output: {
      filename: '[name].[contenthash].js',
      path: outputPath,
      clean: true,
    },
    css: '[name].[contenthash].css',
    html: path.resolve(__dirname, 'src', 'index.html'),
    resources: 'assets/[name].[contenthash].[ext]',
  };

  const copy = {
    patterns: [
      {
        from: path.resolve(__dirname, 'manifest.json'),
        to: outputPath
      },
      {
        from: path.resolve(__dirname, 'manifest-icons', '256.png'),
        to: path.resolve(outputPath, 'assets'),
      },
    ],
  }

  const options = {
    port: env.port || 3000,
    mode,
    isDev,
    isProd,
    paths,
    copy,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.js'],
    },
  };

  return getConfig(options);
};