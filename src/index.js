#! /usr/bin/env node

const winston = require('winston');
const path = require('path');
const commandLineCommands = require('command-line-commands');
const npmCheck = require('npm-check');
const checkOutOfDatePackages = require('check-out-of-date-packages');
const globCom = require('./globCom');
const update = require('./update');
const install = require('./install');
const nullCommand = require('./nullCommand');
const updateSelf = require('./updateSelf');

const cwd = path.join(__dirname, '../');

checkOutOfDatePackages(cwd, 'Charlie Jackson').then(() => {
  winston.cli();

  const validCommands = [null, 'install', 'update', 'globCom'];
  const { command, argv } = commandLineCommands(validCommands);

  const args = argv;
  let dev = false;

  if (args.length && args[args.length - 1] === '--dev') {
    dev = true;
    args.pop();
  }

  if (args.length && args[args.length - 1] === '--debug') {
    winston.level = 'debug';
    args.pop();
  }

  winston.log('debug', 'Command: ', command);
  winston.log('debug', 'Args: ', args);

  winston.log('debug', 'Getting global packages to check module version');

  npmCheck({
    global: true,
  }).then((currentState) => {
    if (command !== 'update' || args[0] !== '--self') {
      updateSelf(dev, currentState);
    }

    if (command === null) {
      nullCommand(args);
    } else if (command === 'install' && args[0]) {
      install(args);
    } else if (command === 'update') {
      update(args);
    } else if (command === 'globCom') {
      globCom(args);
    }
  });
});
