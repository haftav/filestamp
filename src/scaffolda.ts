import fs from 'fs';
import { stripIndent } from 'common-tags';

import { CreatorType, FileCreator, FolderCreator } from './types';

import createBuilder from './builder';

const cwd = process.cwd();

/*

  do all recursion and generate paths of all folders that need to be created.
  If file already exists and shouldn't be overwritten, cancel scaffolda

*/

export default function scaffolda<P = any>(
  directory: string,
  props: P,
  creatorEntity: CreatorType | CreatorType[]
) {
  const builder = createBuilder(cwd);

  const entries = builder(directory, props, creatorEntity);

  entries.forEach((entry) => entry());
}

// TODO: name better
export function createFile<P = any>(
  contentCreator: (props: P) => string,
  nameCreator: ((props: P) => string) | string
): CreatorType {
  const action: FileCreator = (entityPath: string, props: P) => {
    // get file content
    const fileContent = stripIndent`${contentCreator(props)}`;
    // create file with content depending on previous options
    console.log(`Writing file at ${entityPath}`);
    fs.writeFileSync(entityPath, fileContent);
  };

  return {
    action,
    type: 'FILE',
    nameGetter: (props) => (typeof nameCreator === 'string' ? nameCreator : nameCreator(props)),
  };
}

// TODO: name better
export function createFolder<FolderChildren, P = any>(
  folderChildren: FolderChildren[] | null,
  nameCreator: ((props: P) => string) | string
): CreatorType {
  const action: FolderCreator = (entityPath: string, props: P) => {
    console.log(`Writing folder at ${entityPath}`);
    fs.mkdirSync(entityPath, { recursive: true });
  };

  return {
    action,
    type: 'FOLDER',
    nameGetter: (props) => (typeof nameCreator === 'string' ? nameCreator : nameCreator(props)),
    children: folderChildren,
  };
}
