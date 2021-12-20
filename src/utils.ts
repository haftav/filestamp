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
