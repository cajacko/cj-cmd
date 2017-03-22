const winston = require('winston');

module.exports = (dev, currentState) => {
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
};
