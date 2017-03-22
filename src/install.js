const winston = require('winston');
const path = require('path');
const spawn = require('child_process').spawnSync;
const generatorMap = require('../generator-map.json');

module.exports = (args) => {
  winston.log('debug', 'Install');

  const yo = path.join(__dirname, '/../node_modules/yo/lib/cli.js');

  winston.log('debug', 'Yo path', yo);
  winston.log('debug', 'Spawn Yeoman child process');

  let generatorName = args[0];

  if (generatorMap[generatorName]) {
    generatorName = generatorMap[generatorName];
  }

  const generatorIndex = `generator-${generatorName}/generators/app/index.js`;
  const generatorPath = `./../node_modules/${generatorIndex}`;
  const generator = path.join(__dirname, generatorPath);

  winston.log('debug', 'Generator path: ', generator);

  spawn('node', [yo, generator], { stdio: 'inherit' });

  winston.log('debug', 'Finished Yeoman child process');
};
