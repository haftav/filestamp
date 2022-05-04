import { Config, FileCreator, FolderCreator } from './types';

export function isConfigObject(value: unknown): value is Config {
  const testValue = value as Config;
  if (Object.prototype.toString.call(testValue) !== '[object Object]') {
    return false;
  }

  if ('commands' in testValue === false || 'handleCommand' in testValue === false) {
    return false;
  }

  if (!testValue.commands.every((command) => 'title' in command && 'value' in command)) {
    return false;
  }

  if (typeof testValue.handleCommand !== 'function') {
    return false;
  }

  return true;
}

export function isFileCreator(maybeFileCreator: unknown): maybeFileCreator is FileCreator {
  const fileCreator = maybeFileCreator as FileCreator;

  return 'type' in fileCreator && fileCreator.type === 'FILE';
}

export function isFolderCreator(maybeFolderCreator: unknown): maybeFolderCreator is FolderCreator {
  const folderCreator = maybeFolderCreator as FolderCreator;

  return 'type' in folderCreator && folderCreator.type === 'FOLDER';
}

export function isFileOrFolderList(
  maybeArray: unknown
): maybeArray is Array<FileCreator | FolderCreator> {
  return (
    Array.isArray(maybeArray) && maybeArray.every((el) => isFileCreator(el) || isFolderCreator(el))
  );
}

export function isFunction(maybeFunction: unknown): maybeFunction is (args: any[]) => void {
  return typeof maybeFunction === 'function';
}

export function isArray(maybeArray: unknown): maybeArray is any[] {
  if (typeof maybeArray === 'undefined') {
    return false;
  }

  return Array.isArray(maybeArray);
}
