#!/usr/bin/env node
import yargs from 'yargs';

async function init() {
  yargs
    .scriptName('filestamp')
    .usage('$0 <cmd> [args]')
    .command(
      '[command]',
      'Specifies which scaffold command to run',
      (yargs) => {
        yargs.positional('command', {
          type: 'string',
          describe: 'the command to run',
        });
      },
      function (argv) {
        console.log('argv,', argv);
      }
    )
    .help().argv;
}

init().catch((err) => console.error(err));
