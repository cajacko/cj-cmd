#! /usr/bin/env node

const winston = require('winston');
const commandLineArgs = require('command-line-args');
const path = require('path');
const spawn = require('child_process').spawnSync;
const commandLineCommands = require('command-line-commands');
const generatorMap = require('../generator-map.json');

winston.cli();

const validCommands = [null, 'install', 'update'];
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
  winston.log('debug', 'Install');

  const yo = path.join(__dirname, '/../node_modules/yo/lib/cli.js');

  winston.log('debug', 'Yo path', yo);
  winston.log('debug', 'Spawn Yeoman child process');

  let generatorName = argv[0];

  if (generatorMap[generatorName]) {
    generatorName = generatorMap[generatorName];
  }

  const generatorPath = `./../node_modules/generator-${generatorName}/generators/app/index.js`;
  const generator = path.join(__dirname, generatorPath);

  winston.log('debug', 'Generator path: ', generator);

  spawn('node', [yo, generator], { stdio: 'inherit' });

  winston.log('debug', 'Finished Yeoman child process');
} else if (command === 'update') {
  winston.log('debug', 'Update');

  const update = path.join(__dirname, '/../node_modules/npm-check-updates/bin/npm-check-updates');

  winston.log('debug', 'npm-check-updates path', update);
  winston.log('debug', 'Spawn npm-check-updates child process');

  const updateArgs = argv;
  updateArgs.unshift(update);
  updateArgs.push('-u');

  spawn('node', updateArgs, { stdio: 'inherit' });

  winston.log('debug', 'Finished update child process');
}
