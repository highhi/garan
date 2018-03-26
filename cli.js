#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const meow = require('meow');
const fn = require('.');

const options = {
  flags: {
    dir: { type: 'string', alias: 'd' },
    typescript: { type: 'boolean', alias: 't', default: false }
  }
};

const cli = meow(`
  Usage
  $ gran --dir <source>

  Options
  -a, --add         Create new template file
  -o, --overwrite   Overwrite by template
`, options);

fn(cli.input, cli.flags);
