import fs from 'fs';
import path from 'path';
import { stripIndent } from 'common-tags';

import { ActionsCreator } from './types';

import createBuilder from './builder';

const cwd = process.cwd();

/*

  do all recursion and generate paths of all folders that need to be created.
  If file already exists and shouldn't be overwritten, cancel scaffolda

*/

export default function scaffolda<P = any>(
  directory: string,
  props: P,
  actionsCreator: ActionsCreator<P> | ActionsCreator<P>[]
) {
  const builder = createBuilder(cwd);

  const entries = builder(directory, props, actionsCreator);

  entries.forEach((entry) => entry());
}

// TODO: name better
export function createFile<P = any>(
  contentCreator: (props: P) => string,
  nameCreator: ((props: P) => string) | string
): ActionsCreator<P> {
  /* 
    The process looks like this:
    1. user supplies their props to the plugin
    2. builder passes current directory information, props, and builder to inner function (that is returned from plugin)
    3. inner function returns list of actions 
  */

  return function createActions({
    currentDirectory,
    props,
  }: {
    currentDirectory: string;
    props: P;
  }) {
    const fileName = getName({ name: nameCreator, props });
    const filePath = path.join(currentDirectory, fileName);
    const folderExists = fs.existsSync(currentDirectory);
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
      throw new Error(`Error: file ${fileName} already exists at path ${currentDirectory} `);
    }

    const createFileAction = () => {
      // get file content
      const fileContent = stripIndent`${contentCreator(props)}`;
      // create file with content depending on previous options
      console.log(`Writing file at ${filePath}`);
      fs.writeFileSync(filePath, fileContent);
    };

    const createFolderAction = () => {
      fs.mkdirSync(currentDirectory, { recursive: true });
    };

    const actions = [];

    if (!folderExists) {
      actions.push(createFolderAction);
    }

    actions.push(createFileAction);

    return actions;
  };
}

export function createFolder<P = any>(
  folderChildren: ActionsCreator<P>[] | ActionsCreator<P> | null,
  nameCreator: ((props: P) => string) | string
): ActionsCreator<P> {
  return function createActions({ currentDirectory, props, builder }) {
    const folderName = getName({ name: nameCreator, props });
    const folderPath = path.join(currentDirectory, folderName);
    const folderExists = fs.existsSync(folderPath);

    const createFolderAction = () => {
      console.log(`Writing folder at ${folderPath}`);
      fs.mkdirSync(folderPath, { recursive: true });
    };

    const actions = [];

    if (!folderExists) {
      actions.push(createFolderAction);
    }

    if (folderChildren) {
      builder(folderPath, props, folderChildren);
    }

    return actions;
  };
}

interface GetNameParams<T> {
  name: string | ((props: T) => string);
  props: T;
}

function getName<T>({ name, props }: GetNameParams<T>) {
  return typeof name === 'string' ? name : name(props);
}
