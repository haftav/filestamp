import { Config } from './types';

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

// TODO: maybe program to an interface?
export function isList(maybeArray: unknown): maybeArray is Array<unknown> {
  return Array.isArray(maybeArray);
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
