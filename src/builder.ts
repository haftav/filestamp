import fs from 'fs';
import path from 'path';
import { stripIndent } from 'common-tags';

import { isList, isCreator } from './utils';

import { CreatorType } from './types';

const MAX_DEPTH = 9;

export default function createBuilder(cwd: string) {
  let currentDepth = 0; // TODO: update

  // TODO: fix types
  const entries: Array<() => void> = [];

  return function builder<P = any>(
    directory: string,
    props: P,
    creatorEntity: CreatorType | CreatorType[]
  ) {
    if (currentDepth >= MAX_DEPTH) {
      throw new Error('Possible infinite loop reached, throwing error');
    }

    const currentDirectory = path.resolve(cwd, directory);

    if (isList(creatorEntity)) {
      const entityList = creatorEntity;

      entityList.forEach((entity) => {
        builder(currentDirectory, props, entity);
      });
    } else {
      if (!isCreator(creatorEntity)) {
        console.log('creator', creatorEntity);
        throw new Error('Invalid creator type used');
      }

      if (creatorEntity.type === 'FILE') {
        // check if file exists
        const fileName = creatorEntity.nameGetter(props);
        const filePath = path.join(currentDirectory, fileName);
        const folderExists = fs.existsSync(currentDirectory);
        const fileExists = fs.existsSync(filePath);

        if (fileExists) {
          throw new Error(`Error: file ${fileName} already exists at path ${currentDirectory} `);
        }

        const actionWrapper = () => {
          return creatorEntity.action(filePath, props);
        };

        // someday have options to overwrite

        // add folder creation to entries if folder doesn't exist
        if (!folderExists) {
          entries.push(() => {
            if (!folderExists) {
              fs.mkdirSync(currentDirectory, { recursive: true });
            }
          });
        }

        // add to entries
        entries.push(actionWrapper);
      }

      if (creatorEntity.type === 'FOLDER') {
        // add to entries if folder doesn't exist

        const folderName = creatorEntity.nameGetter(props);
        const folderPath = path.join(currentDirectory, folderName);
        const folderExists = fs.existsSync(folderPath);

        const actionWrapper = () => {
          return creatorEntity.action(folderPath, props);
        };

        if (!folderExists) {
          entries.push(actionWrapper);
        }

        if (creatorEntity.children !== null) {
          if (!Array.isArray(creatorEntity.children)) {
            throw new Error('Error: Folder creator must have a valid children argument.');
          }

          currentDepth += 1;

          (creatorEntity.children as Array<any>).forEach((child) => {
            builder(path.join(currentDirectory, folderName), props, child);
          });
        }
      }
    }

    // run other plugins

    return entries;
  };
}
