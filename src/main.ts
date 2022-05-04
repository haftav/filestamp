#!/usr/bin/env node
import yargs from 'yargs';
import prompts, { PromptObject } from 'prompts';
import invariant from 'tiny-invariant';
import path from 'path';

import { Command, Config } from './types';
import { isConfigObject, isFunction, isArray } from './utils';
import createScaffolda from './scaffolda';

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
    .scriptName('scaffolda')
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
      const importedConfig = await import(path.resolve(WORKING_DIRECTORY, 'scaffolda.config.js'));
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

  type PromptFunction = () => PromptObject[];

  // TODO: allow array parameter
  async function collectProps(fnOrArray?: PromptFunction | PromptObject[]) {
    // read all variables from CLI
    const cliVariables = getCommandLineVariables(argsObject);

    // Override any prompts with variables that were supplied through CLI
    prompts.override(cliVariables);

    let userPrompts: PromptObject[];

    /* 
      NOTE: these narrowing functions may need to validate better.
      There's a possibility of runtime errors if user passes invalid config.
    */
    if (isFunction(fnOrArray)) {
      userPrompts = fnOrArray();
    } else if (isArray(fnOrArray)) {
      userPrompts = fnOrArray;
    } else {
      userPrompts = [];
    }

    // Execute prompts -> will skip if all prompts overridden through CLI
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

// TODO: I think this can live somewhere else -> probably would be good to separate CLI from core functionality

main();

export { default as scaffolda, createFile, createFolder } from './scaffolda';
export { collectProps };
