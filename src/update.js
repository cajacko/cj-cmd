const winston = require('winston');
const path = require('path');
const spawn = require('child_process').spawnSync;
const windowsEnvironment = require('./windowsEnvironment');

module.exports = (args) => {
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
};
