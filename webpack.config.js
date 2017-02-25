const path = require('path');
const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

module.exports = {
  entry: './src/index.js',
  context: path.resolve(__dirname),
  devtool: isProd ? 'hidden-source-map' : 'eval-source-map',
  output: {
    filename: 'bundle.js',
    path: 'dist',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
};
