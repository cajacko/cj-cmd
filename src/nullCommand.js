const winston = require('winston');
const commandLineArgs = require('command-line-args');

module.exports = (args) => {
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
};
