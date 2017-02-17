#! /usr/bin/env node

const winston = require('winston');
const commandLineArgs = require('command-line-args');
const path = require('path');
const spawn = require('child_process').spawnSync;
const commandLineCommands = require('command-line-commands');

winston.cli();

const validCommands = [null, 'install'];
const { command, argv } = commandLineCommands(validCommands);

if (argv.length && argv[argv.length - 1] === '--debug') {
  winston.level = 'debug';
}

winston.log('debug', 'Command: ', command);
winston.log('debug', 'Args: ', argv);

if (command === null) {
  const optionDefinitions = [
    { name: 'version', type: Boolean },
    { name: 'debug', type: Boolean }
  ];

  winston.log('debug', 'No command');

  const options = commandLineArgs(optionDefinitions, argv);

  if (options.version) {
    winston.log('debug', 'Get version');
    winston.log('info', 'Version 1.0.0');
  }
}

if (command === 'install' && argv[0]) {
  winston.log('debug', 'Install eslint');

  const yo = path.join(__dirname, '/../node_modules/yo/lib/cli.js');

  winston.log('debug', 'Yo path', yo);
  winston.log('debug', 'Spawn Yeoman child process');

  spawn('node', [yo, argv[0]], { stdio: 'inherit' });

  winston.log('debug', 'Finished Yeoman child process');
}
