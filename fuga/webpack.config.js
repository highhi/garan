const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',

  entry: {
    index: './src/index.js',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
  },

  module: {
    rules: [
      { test: /\.tsx?$/, use: 'awesome-typescript-loader', exclude: /node_modlues/ },
    ]
  },

  plugins: [],

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};