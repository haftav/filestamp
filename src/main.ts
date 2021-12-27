#!/usr/bin/env node
import yargs from 'yargs';
import prompts, { PromptObject } from 'prompts';
import invariant from 'tiny-invariant';
import path from 'path';

import { Command, Config } from './types';
import { isConfigObject } from './utils';
import createFilestamp from './filestamp';

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

    let configObject;
    try {
      const importedConfig = await import(path.resolve(WORKING_DIRECTORY, 'filestamp.config.js'));
      configObject = (await importedConfig.default()) as Config;
    } catch (err) {
      throw new Error(`Error importing config: ${err}`);
    }
    const { commands = [], handleCommand } = configObject;

    // maybe just warn here
    invariant(commands.length > 0, 'Must have at least one command to run.');
    invariant(isConfigObject(configObject), 'Please use valid config object.');

    const command = await getCommand(argsObject, commands);

    invariant(typeof command === 'string', 'Command must be a string.');

    // TODO: change this to use function exported from user config
    handleCommand(command);
  }

  // TODO: allow array parameter
  async function collectProps(fn?: () => PromptObject[]) {
    // read all variables from CLI
    const cliVariables = getCommandLineVariables(argsObject);

    // Override any prompts with variables that were supplied through CLI
    prompts.override(cliVariables);

    // Get list of user prompts
    const userPrompts = fn ? fn() : [];

    // Execute prompts -> will skip if all prompts overriden through CLI
    const answers = await prompts(userPrompts, {
      onCancel: () => {
        process.exit(1);
      },
    });

    return answers;
  }

  return {
    main,
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

// strip out any 'command' option supplied by user so we're left with just variable arguments
function getCommandLineVariables(argsObject: Args): CommandLineVariables {
  const output = { ...argsObject } as CommandLineVariables;

  if ('command' in output) {
    delete output.command;
  }

  return output;
}

const argv = init();

const { main, collectProps } = create(argv as InitialArgs);
const filestamp = createFilestamp();

main();

export { createFile, createFolder } from './filestamp';
export { filestamp, collectProps };
