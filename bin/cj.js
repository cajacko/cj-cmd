#! /usr/bin/env node
console.log("console.log output")

const commandLineCommands = require('command-line-commands')

const validCommands = [ null, 'install' ]
const { command, argv } = commandLineCommands(validCommands)

/* print the command and remaining command-line args */
console.log('command: %s', command)
console.log('argv:    %s', JSON.stringify(argv))

if (command === null) {
  const commandLineArgs = require('command-line-args')
  const optionDefinitions = [
    { name: 'version', type: Boolean }
  ]

  // pass in the `argv` returned by `commandLineCommands()`
  const options = commandLineArgs(optionDefinitions, argv)

  if (options.version) {
    console.log('version 1.0.1')
  }
}
