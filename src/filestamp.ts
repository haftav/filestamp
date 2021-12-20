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

  return function filestamp(currentPath: string, props: unknown, entity: File | Folder) {
    if (currentDepth >= MAX_DEPTH) {
      throw new Error('Possible infinite loop reached, throwing error');
    }

    currentDepth += 1;

    console.log('current depth', currentDepth);
    console.log('current path', currentPath);

    if (entity.type === 'FILE') {
      parseTemplateString`${entity({ props })}`;
    }
  };
}

function parseTemplateString(strings: TemplateStringsArray, ...keys: Array<Record<string, any>>) {
  console.log('strings', strings);
  console.log('keys', keys);
}

export function createFile(entity: File) {
  entity.type = 'FILE';
  return entity;
}
