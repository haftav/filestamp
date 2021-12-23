import fs from 'fs';
import path from 'path';
import { stripIndent } from 'common-tags';

const cwd = process.cwd();

interface File {
  (props: unknown): any;
  type: 'FILE';
}
interface Folder {
  (props: unknown): any;
  type: 'FOLDER';
}

export default function createFilestamp() {
  let currentDepth = 0;
  const MAX_DEPTH = 9;

  return async function filestamp(directory: string, props: unknown, creator: any) {
    if (currentDepth >= MAX_DEPTH) {
      throw new Error('Possible infinite loop reached, throwing error');
    }

    const currentDirectory = path.resolve(cwd, directory);

    console.log('current depth', currentDepth);
    console.log('pathString', currentDirectory);

    if (creator.type === 'FILE') {
      creator(currentDirectory, props);
    }
    if (creator.type === 'FOLDER') {
      // this is where i think i have to recurse
      const { children, folderName } = creator(currentDirectory, props);

      currentDepth += 1;

      if (!children) {
        return;
      }

      children.forEach((child: any) => {
        filestamp(path.join(currentDirectory, folderName), props, child);
      });
    }
  };
}

export function createFile(
  contentCreator: (props: any) => string,
  nameCreator: (props: any) => string
) {
  const fn = (currentDirectory: string, props: any): void => {
    // get file content
    const fileContent = stripIndent`${contentCreator(props)}`;
    const fileName = nameCreator(props);

    console.log('content', fileContent);
    console.log('name', fileName);

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
      throw new Error(`File already exists at path ${filePath}`);
    }
  };

  fn.type = 'FILE';

  // return function to create file, accepting path + props
  return fn;
}

export function createFolder(folderChildren: any[] | null, nameCreator: (props: any) => string) {
  const fn = (currentDirectory: string, props: any): { children: any; folderName: string } => {
    const folderName = nameCreator(props);

    const folderPath = path.join(currentDirectory, folderName);
    const folderExists = fs.existsSync(folderPath);

    // check if folder exists
    if (!folderExists) {
      // create directory
      console.log(`Writing folder at ${folderPath}`);
      fs.mkdirSync(folderPath, { recursive: true });
    } else {
      throw new Error(`Folder already exists at path ${folderPath}`);
    }

    // return children
    return { children: folderChildren, folderName };
  };

  fn.type = 'FOLDER';

  return fn;
}
