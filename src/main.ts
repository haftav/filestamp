#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import prompts from 'prompts';
import invariant from 'tiny-invariant';

interface Command {
  title: string;
  value: string;
}

// hardcoding commands for now - these will eventually be defined in config file
const commands: Command[] = [{ title: 'Component', value: 'component' }];

async function init() {
  yargs(hideBin(process.argv))
    .scriptName('filestamp')
    .usage('$0 [command] [args]')
    .command(
      '$0 [command]',
      'Specifies which scaffold command to run',
      (yargs) => {
        yargs.positional('command', {
          type: 'string',
          describe: 'the command to run',
        });
      },
      function (argv) {
        filestamp(argv);
      }
    )
    .help()
    .parse();
}

interface InitialArgs {
  [argName: string]: unknown;
  _: (string | number)[];
  $0: string;
}

type Args = Omit<InitialArgs, '_' | '$0'>;
type CommandLineVariables = Omit<Args, 'command'>;

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

// strip out any 'command' option supplied by user so we're left with just variable arguments
function getCommandLineVariables(argsObject: Args): CommandLineVariables {
  const output = { ...argsObject } as CommandLineVariables;

  if ('command' in output) {
    delete output.command;
  }

  return output;
}

async function filestamp(argv: InitialArgs) {
  const argsObject = stripIgnoredArgs(argv);
  const command = await getCommand(argsObject);

  invariant(typeof command === 'string', 'Command must be a string.');

  console.log('argv', argv);
  console.log('commandLineArgs', argsObject);
  console.log(command);

  const argsVariables = getCommandLineVariables(argsObject);
}

async function getCommand(argsObject: Args) {
  if ('command' in argsObject) {
    return argsObject.command;
  }

  const { command } = await prompts({
    type: 'select',
    name: 'command',
    choices: commands, // TODO: make dynamic
    message: 'Please choose command you want to run',
  });

  return command;
}

init().catch((err) => console.error(err));
