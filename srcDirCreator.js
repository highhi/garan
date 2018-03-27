const fs = require('fs-extra');
const { SETTINGS_PATH } = require('./constans');

module.exports = (dir, useTypeScript) => {
  const src = `./${dir}/src`;
  
  fs.copySync(`${SETTINGS_PATH}/src`, src);

  const promises = useTypeScript ? [
    fs.remove(`${src}/index.js`),
    fs.remove(`${src}/hello.js`)
  ] : [
    fs.remove(`${src}/index.ts`),
    fs.remove(`${src}/hello.ts`)
  ];

  return Promise.all(promises).catch((err) => {
    console.log(err);
  });
};
