const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const { SETTINGS_PATH } = require('./constans');
const webpackConfigCreator = require('./webpackConfigCreator');
const packageJsonCreator = require('./packageJsonCreator');
const srcDirCreator = require('./srcDirCreator');

module.exports = (input, flags) => {
  if (!flags.dir) {
    return console.log('The Dir flag is required (--dir <dir-name>)');
  }

  const spinner = ora('Creating project').start();

  // Make project dir
  fs.mkdirsSync(`./${flags.dir}`);

  const promises = [
    fs.copy(`${SETTINGS_PATH}/.babelrc`, `./${flags.dir}/.babelrc`),
    webpackConfigCreator(flags.dir, flags.typescript),
    packageJsonCreator(flags.dir, flags.typescript),
    srcDirCreator(flags.dir, flags.typescript)
  ];

  if (flags.typescript) {
    process.push(fs.copy(`${SETTINGS_PATH}/tsconfig.json`, `./${flags.dir}/tsconfig.json`));
  }

  Promise.all(promises).then(() => {
    spinner.stop();
    console.log('🎉  Compleated!!');
  }).catch(err => {
    spinner.stop();
    console.log(err);
  })
}