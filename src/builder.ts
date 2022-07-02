import fs from 'fs';
import path from 'path';
import { stripIndent } from 'common-tags';

import { isList, isCreator } from './utils';

import { ActionsCreator, Action, CreatorType } from './types';

const MAX_DEPTH = 9;

export default function createBuilder(cwd: string) {
  const currentDepth = 0; // TODO: update

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
      const createActionsList = createActions;

      createActionsList.forEach((createActions) => {
        builder(currentDirectory, props, createActions);
      });
    } else {
      const actions = createActions({ currentDirectory: directory, props });

      entries.push(...actions);

      // if (creatorEntity.type === 'FOLDER') {
      //   // add to entries if folder doesn't exist

      //   const folderName = creatorEntity.nameGetter(props);
      //   const folderPath = path.join(currentDirectory, folderName);
      //   const folderExists = fs.existsSync(folderPath);

      //   const actionWrapper = () => {
      //     return creatorEntity.action(folderPath, props);
      //   };

      //   if (!folderExists) {
      //     entries.push(actionWrapper);
      //   }

      //   if (creatorEntity.children !== null) {
      //     if (!Array.isArray(creatorEntity.children)) {
      //       throw new Error('Error: Folder creator must have a valid children argument.');
      //     }

      //     currentDepth += 1;

      //     (creatorEntity.children as Array<any>).forEach((child) => {
      //       builder(path.join(currentDirectory, folderName), props, child);
      //     });
      //   }
      // }
    }

    // run other plugins

    return entries;
  };
}
