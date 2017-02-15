#! /usr/bin/env node

var winston = require('winston')
winston.cli()

const commandLineCommands = require('command-line-commands')

const validCommands = [ null, 'install' ]
const { command, argv } = commandLineCommands(validCommands)

if (argv.length && argv[argv.length - 1] == '--debug') {
  winston.level = 'debug'
}

winston.log('debug', 'Command: ', command)
winston.log('debug', 'Args: ', argv)

if (command === null) {
  winston.log('debug', 'No command')
  const commandLineArgs = require('command-line-args')
  const optionDefinitions = [
    { name: 'version', type: Boolean },
    { name: 'debug', type: Boolean }
  ]

  // pass in the `argv` returned by `commandLineCommands()`
  const options = commandLineArgs(optionDefinitions, argv)

  if (options.version) {
    winston.log('debug', 'Get version')
    console.log('version 1.0.1')
  }
}

if (command === 'install' && argv[0]) {
  winston.log('debug', 'Install eslint')

  var yo = __dirname + '/../node_modules/yo/lib/cli.js'

  winston.log('debug', 'Yo path', yo)
  winston.log('debug', 'Spawn Yeoman child process')
  var spawn = require('child_process').spawnSync;
  var child = spawn('node', [yo, argv[0]], {stdio: 'inherit'})
  winston.log('debug', 'Finished Yeoman child process')
}
