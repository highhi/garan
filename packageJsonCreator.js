const fs = require('fs-extra');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { SETTINGS_PATH } = require('./constans');

const DEV_PACKAGES = [
  '@babel/core',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/preset-env',
  'webpack',
  'webpack-cli'
];

const BasePackageJson = {
  name: '',
  version: '0.0.1', 
  license: 'MIT',
  scripts: {
    start: 'webpack -w'
  }
};
const dependencies = {};
const devDependencies = {
  "babel-loader": "8.0.0-beta.2"
};

module.exports = (dir, useTypeScript) => {
  const pkgs = !useTypeScript ? DEV_PACKAGES : DEV_PACKAGES.concat([
    'typescript',
    'awesome-typescript-loader'
  ]);

  const promises = pkgs.map(pkg => {
    return exec(`npm info ${pkg} version`).then(({ stdout }) => {
      return devDependencies[pkg] = `^${stdout.replace(/\n/g, '')}`;
    });
  });

  return Promise.all(promises)
    .then(() => {
      const packageJson = Object.assign({}, BasePackageJson, {
        name: dir,
        devDependencies: { ...devDependencies }
      });

      fs.writeJSON(`./${dir}/package.json`, packageJson, { spaces: 2 });
    })
    .catch(err => {
      throw new Error(err);
    })
}
