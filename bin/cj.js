#! /usr/bin/env node

const winston = require('winston');
const commandLineArgs = require('command-line-args');
const path = require('path');
const spawn = require('child_process').spawnSync;
const commandLineCommands = require('command-line-commands');
const generatorMap = require('../generator-map.json');
const npmCheck = require('npm-check');

winston.cli();

const validCommands = [null, 'install', 'update', 'globCom'];
const { command, argv } = commandLineCommands(validCommands);
const windowsEnvironment = /^win/.test(process.platform);

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
    const globalPackages = currentState.get('packages');

    globalPackages.forEach((globalPackage) => {
      if (dev) {
        return true;
      }

      if (globalPackage.moduleName !== 'cj-cmd') {
        return false;
      }

      if (globalPackage.latest === globalPackage.installed) {
        winston.log('debug', 'cj-cmd is up to date');
        return true;
      }

      const errorMessage = 'cj-cmd is out of date! You must upgrade the plugin using: cj update --self';

      winston.log('error', errorMessage);
      throw new Error(errorMessage);
    });
  }

  if (command === null) {
    const optionDefinitions = [
      { name: 'version', type: Boolean },
      { name: 'debug', type: Boolean }
    ];

    winston.log('debug', 'No command');

    const options = commandLineArgs(optionDefinitions, args);

    if (options.version) {
      winston.log('debug', 'Get version');
      winston.log('info', 'Version 1.0.0');
    }
  }

  if (command === 'install' && args[0]) {
    winston.log('debug', 'Install');

    const yo = path.join(__dirname, '/../node_modules/yo/lib/cli.js');

    winston.log('debug', 'Yo path', yo);
    winston.log('debug', 'Spawn Yeoman child process');

    let generatorName = args[0];

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

    let npm;

    if (windowsEnvironment) {
      npm = 'npm.cmd';
    } else {
      npm = 'npm';
    }

    if (args[0] === '--self' || args[0] === '-s') {
      winston.log('debug', 'Update self');
      winston.log('debug', 'Spawn npm-check-updates child process');

      spawn(npm, ['uninstall', '-g', 'cj-cmd'], { stdio: 'inherit' });
      spawn(npm, ['install', '-g', 'cj-cmd'], { stdio: 'inherit' });
    } else {
      const updateArgs = args;

      updateArgs.unshift(update);
      updateArgs.push('-u');

      winston.log('debug', 'Spawn npm-check-updates child process');
      spawn('node', updateArgs, { stdio: 'inherit' });
      spawn(npm, ['install'], { stdio: 'inherit' });
    }

    winston.log('debug', 'Finished update child process');
  } else if (command === 'globCom') {
    winston.log('debug', 'globCom');

    const globCom = path.join(__dirname, '/../node_modules/global-commands/src/index.js');

    winston.log('debug', 'Global Commands path', globCom);
    winston.log('debug', 'Spawn Global Commands child process');

    const updateArgs = args;

    updateArgs.unshift(globCom);

    winston.log('debug', 'Spawn Global Commands child process');
    spawn('node', updateArgs, { stdio: 'inherit' });
  }
});
