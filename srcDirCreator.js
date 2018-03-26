const fs = require('fs-extra');
const { SETTINGS_PATH } = require('./constans');

module.exports = (dir, useTypeScript) => {
  const src = `./${dir}/src`;
  
  fs.mkdirsSync(src);

  const files = useTypeScript ? [
    fs.copy(`${SETTINGS_PATH}/index.ts`, `${src}/index.ts`),
    fs.copy(`${SETTINGS_PATH}/hello.ts`, `${src}/hello.ts`)
  ] : [
    fs.copy(`${SETTINGS_PATH}/index.js`, `${src}/index.js`),
    fs.copy(`${SETTINGS_PATH}/hello.js`, `${src}/hello.js`)
  ]

  return Promise.all(files);
};
