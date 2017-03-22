const winston = require('winston');
const path = require('path');
const spawn = require('child_process').spawnSync;

module.exports = (args) => {
  winston.log('debug', 'globCom');

  const globCom = path.join(__dirname, '/../node_modules/global-commands/src/index.js');

  winston.log('debug', 'Global Commands path', globCom);
  winston.log('debug', 'Spawn Global Commands child process');

  const updateArgs = args;

  updateArgs.unshift(globCom);

  winston.log('debug', 'Spawn Global Commands child process');
  spawn('node', updateArgs, { stdio: 'inherit' });
};
