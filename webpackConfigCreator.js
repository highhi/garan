const fs = require('fs-extra');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const { SETTINGS_PATH } = require('./constans');

const ruleOfBabel = `{ test: /\.js?$/, use: 'babel-loader', exclude: /node_modeules/ },`;
const ruleOfTs = `{ test: /\.tsx?$/, use: 'awesome-typescript-loader', exclude: /node_modlues/ },`;

module.exports = (dir, useTypeScript) => {
  const rules = useTypeScript === true ? ruleOfTs : ruleOfBabel;
  const extensions = useTypeScript === true ? `'.ts', '.tsx'` : `'.js', '.jsx'`;
  const conifg = `const path = require('path');
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
      ${rules}
    ]
  },

  plugins: [],

  resolve: {
    extensions: [${extensions}],
  },
};
  `;

  return writeFile(`./${dir}/webpack.config.js`, conifg, 'utf8');
}
