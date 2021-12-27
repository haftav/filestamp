import fs from 'fs';
import path from 'path';
import { stripIndent } from 'common-tags';

const cwd = process.cwd();

export interface File<P = any> {
  (currentDirectory: string, props: P): void;
  type: 'FILE';
}

export interface Folder<P = any> {
  (currentDirectory: string, props: P): { children: any[] | null; folderName: string };
  type: 'FOLDER';
}

export default function createFilestamp() {
  let currentDepth = 0;
  const MAX_DEPTH = 9;

  return function filestamp<P = any>(
    directory: string,
    props: P,
    createFileOrFolder: File | Folder
  ) {
    if (currentDepth >= MAX_DEPTH) {
      throw new Error('Possible infinite loop reached, throwing error');
    }

    const currentDirectory = path.resolve(cwd, directory);

    if (createFileOrFolder.type === 'FILE') {
      createFileOrFolder(currentDirectory, props);
    }

    if (createFileOrFolder.type === 'FOLDER') {
      // this is where i think i have to recurse
      const { children, folderName } = createFileOrFolder(currentDirectory, props);

      currentDepth += 1;

      if (!children) {
        return;
      }

      if (!children.every((child) => child.type === 'FOLDER' || child.type === 'FILE')) {
        throw new Error('Not all children are wrapped in a createFile or createFolder call.');
      }

      children.forEach((child) => {
        filestamp(path.join(currentDirectory, folderName), props, child);
      });
    }
  };
}

export function createFile<P = any>(
  contentCreator: (props: P) => string,
  nameCreator: (props: P) => string
) {
  const fn: File = (currentDirectory, props: P) => {
    // get file content
    const fileContent = stripIndent`${contentCreator(props)}`;
    const fileName = nameCreator(props);

    const filePath = path.join(currentDirectory, fileName);
    const fileExists = fs.existsSync(filePath);

    // check if file exists
    if (!fileExists) {
      // check if folder doesn't exist and make it if not
      if (!fs.existsSync(currentDirectory)) {
        fs.mkdirSync(currentDirectory, { recursive: true });
      }

      // create file with content depending on previous options
      console.log(`Writing file at ${filePath}`);
      fs.writeFileSync(filePath, fileContent);
    } else {
      throw new Error(`File already exists at ${filePath}.`);
    }
  };

  fn.type = 'FILE';

  // return function to create file, accepting path + props
  return fn;
}

export function createFolder<FolderChildren, P = any>(
  folderChildren: FolderChildren[] | null,
  nameCreator: (props: P) => string
) {
  const fn: Folder = (currentDirectory: string, props: P) => {
    const folderName = nameCreator(props);

    const folderPath = path.join(currentDirectory, folderName);
    const folderExists = fs.existsSync(folderPath);

    // check if folder exists
    if (!folderExists) {
      // create directory
      console.log(`Writing folder at ${folderPath}`);
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // return children
    return { children: folderChildren, folderName };
  };

  fn.type = 'FOLDER';

  return fn;
}
