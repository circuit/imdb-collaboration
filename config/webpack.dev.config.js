const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, '/../app/src/app.js'),
  ],
  output: {
    path: path.join(__dirname, '/../dist/'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/../app/index.html'),
      inject: 'body',
      filename: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          "presets": [
            ["latest", {
              "es2015": false,
              "es2016": false
            }]
          ]
        },
      }],
    }],
  },
};