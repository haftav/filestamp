import path from 'path';

import { isList } from './utils';

import { ActionsCreator, Action } from './types';

const MAX_DEPTH = 9;

export default function createBuilder(cwd: string) {
  let currentDepth = 0;

  // TODO: fix types
  const entries: Action[] = [];

  return function builder<P = any>(
    directory: string,
    props: P,
    createActions: ActionsCreator<P> | ActionsCreator<P>[]
  ) {
    if (currentDepth >= MAX_DEPTH) {
      throw new Error('Possible infinite loop reached, throwing error');
    }

    const currentDirectory = path.resolve(cwd, directory);

    if (isList(createActions)) {
      currentDepth += 1;

      const createActionsList = createActions;

      createActionsList.forEach((createActions) => {
        builder(currentDirectory, props, createActions);
      });
    } else {
      const actions = createActions({ currentDirectory: directory, props, builder });

      entries.push(...actions);
    }

    return entries;
  };
}
