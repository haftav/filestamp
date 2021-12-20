#!/usr/bin/env node
import yargs from 'yargs';
import prompts, { PromptObject } from 'prompts';
import invariant from 'tiny-invariant';
import path from 'path';

import { Command, Config } from './types';
import { isConfigObject } from './utils';

const WORKING_DIRECTORY = process.cwd();

interface InitialArgs {
  [argName: string]: unknown;
  _: (string | number)[];
  $0: string;
}

type Args = Omit<InitialArgs, '_' | '$0'>;
type CommandLineVariables = Omit<Args, 'command'>;

function init() {
  return yargs
    .scriptName('filestamp')
    .usage('$0 [command] [args]')
    .command('$0 [command]', 'Specifies which scaffold command to run', (yargs) => {
      yargs.positional('command', {
        type: 'string',
        describe: 'the command to run',
      });
    })
    .help().argv;
}

function create(argv: InitialArgs) {
  const argsObject = stripIgnoredArgs(argv);

  async function main() {
    // find user config, get default function
    // TODO: need to add error handling
    const importedConfig = await import(path.resolve(WORKING_DIRECTORY, 'filestamp.config.js'));
    const configObject = (await importedConfig.default()) as Config;
    const { commands = [], handleCommand } = configObject;

    invariant(commands.length > 0, 'Must have at least one command to run.');
    invariant(isConfigObject(configObject), 'Please use valid config object.');

    const command = await getCommand(argsObject, commands);

    invariant(typeof command === 'string', 'Command must be a string.');

    // TODO: change this to use function exported from user config
    handleCommand(command);
  }

  function createFilestamp() {
    return function filestamp(currentPath: string, ...args: Array<unknown>) {
      // TODO: add stuff
    };
  }

  function createPropCollector() {
    return async function collectProps(fn?: () => PromptObject[]) {
      // read all variables from CLI
      const cliVariables = getCommandLineVariables(argsObject);

      // Override any prompts with variables that were supplied through CLI
      prompts.override(cliVariables);

      // Get list of user prompst
      const userPrompts = fn ? fn() : [];

      // Execute prompts -> will skip if all prompts overriden through CLI
      const answers = await prompts(userPrompts);

      return answers;
    };
  }

  const collectProps = createPropCollector();
  const filestamp = createFilestamp();

  return {
    main,
    filestamp,
    collectProps,
  };
}

function stripIgnoredArgs(argv: InitialArgs): Args {
  const output = { ...argv } as Args;

  if ('_' in output) {
    delete output._;
  }

  if ('$0' in output) {
    delete output.$0;
  }

  return output;
}

async function getCommand(argsObject: Args, commands: Command[]) {
  if ('command' in argsObject) {
    return argsObject.command;
  }

  const { command } = await prompts({
    type: 'select',
    name: 'command',
    choices: commands,
    message: 'Please choose command you want to run',
  });

  return command;
}

type File = () => void;
type Folder = () => void;

// strip out any 'command' option supplied by user so we're left with just variable arguments
function getCommandLineVariables(argsObject: Args): CommandLineVariables {
  const output = { ...argsObject } as CommandLineVariables;

  if ('command' in output) {
    delete output.command;
  }

  return output;
}

/*
===========================================================================
*/

// EXAMPLE USER CODE

// import filestamp from 'filestamp'

// async function handleCommand(command: string) {
//   if (command === 'component') {
//     const props = await collectProps(() => userPrompts);
//     filestamp('./components', props);
//   }
//   if (command === 'hook') {
//     filestamp('./hooks');
//   }
// }

/*
===========================================================================
*/

const argv = init();

const { main, collectProps, filestamp } = create(argv as InitialArgs);

main();

export { filestamp, collectProps };
