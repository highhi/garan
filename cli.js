#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const meow = require('meow');
const ejs = require('ejs');
const util = require('util');

const options = {
  flags: {
    dir: { type: 'string', alias: 'd' },
    typescript: { type: 'boolean', alias: 't', default: false },
    port: { type: 'string', alias: 'p', default: '3030' }
  }
};

const { flags } = meow(`
  Usage
  $ gran --dir <dir-name>

  Options
  -t, --typescript  Use typescript
  -p, --port        Port number, default 3030
`, options);

if (!flags.dir) {
  return console.log('The Dir option is required (--dir <dir-name>)');
}

const dir = `./${flags.dir}`;
const useTs = flags.typescript;
const TEMPLATE_PATH = path.resolve(__dirname, 'templates');

function loadTemplateFiles() {
  const base = [
    fs.copy(`${TEMPLATE_PATH}/.babelrc`, `${dir}/.babelrc`),
    fs.copy(`${TEMPLATE_PATH}/index.html`, `${dir}/public/index.html`),
  ];

  const files = useTs ? [
    fs.copy(`${TEMPLATE_PATH}/tsconfig.json`, `${dir}/tsconfing.json`),
    fs.copy(`${TEMPLATE_PATH}/index.ts`, `${dir}/src/index.ts`),
    fs.copy(`${TEMPLATE_PATH}/hello.ts`, `${dir}/src/hello.ts`),
  ] : [
    fs.copy(`${TEMPLATE_PATH}/index.js`, `${dir}/src/index.js`),
    fs.copy(`${TEMPLATE_PATH}/hello.js`, `${dir}/src/hello.js`),
  ];

  return base.concat(base, files);
}

function loadTemplateOfEjs(filename) {
  const file = fs.readFileSync(`${TEMPLATE_PATH}/${filename}`, 'utf8');
  return data => ejs.render(file, data, { escape: util.inspect });
}

function createPackagejson() {
  const base = {
    name: `${flags.dir}`,
    version: '0.0.0',
    license: 'MIT',
    private: true,
    scripts: {
      start: 'webpack-dev-server'
    },
    devDependencies: {
      '@babel/core': '7.0.0-beta.42',
      '@babel/plugin-proposal-class-properties': '7.0.0-beta.42',
      '@babel/plugin-proposal-object-rest-spread': '7.0.0-beta.42',
      '@babel/preset-env': '7.0.0-beta.42',
      'webpack': '^4.4.0',
      'webpack-cli': '^2.0.13',
      "webpack-dev-server": "^3.1.1",
      'babel-loader': "8.0.0-beta.2",
    },
  };

  const pkg = useTs ? Object.assign({}, base, {
    devDependencies: {
      ...base.devDependencies,
      'typescripot': '^2.8.0',
      'awesome-typescript-loader': '^5.0.0-1',
    },
  }) : base;

  return fs.writeJson(`${dir}/package.json`, pkg, { spaces: 2 }).then(() => {
    console.log('Created package.json');
  }).catch(err => {
    console.log(err);
  });
}

function createWebpackConfig() {
  const render = loadTemplateOfEjs('webpack.config.js.ejs');
  return fs.writeFile(`${dir}/webpack.config.js`, render({ useTs: useTs, port: flags.port })).then(() => {
    console.log('Created webpack.config.js');
  }).catch(err => {
    console.log(err);
  });
}

fs.mkdirsSync(`${dir}/src`);
fs.mkdirsSync(`${dir}/public`);

(async () => {
  try {
    await Promise.all([...loadTemplateFiles(), createPackagejson(), createWebpackConfig()]);
    console.log('Compleated!!');
    process.exit(0);
  } catch(err) {
    console.log(err);
    process.exit(1);
  }
})();

