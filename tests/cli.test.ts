import path from 'path';
import { execSync } from 'child_process';

import { removeTestFiles } from './utils';

const executablePath = path.join(__dirname, '..', 'dist/main.js');

const directoryName = '/samples';
const pathToDirectory = path.join(__dirname, directoryName);

beforeEach(() => removeTestFiles(pathToDirectory));
afterEach(() => removeTestFiles(pathToDirectory));

describe('Does things', () => {
  it('Prompts for command if no command passed', () => {
    const result = execSync(`node ${executablePath}`, { cwd: __dirname }).toString();
    expect(result).toContain('Please choose command you want to run');
  });

  it('Prompts for props if no props passed', () => {
    const result = execSync(`node ${executablePath} component`, { cwd: __dirname }).toString();
    expect(result).toContain('What is the name of your component?');
  });

  it('Skips prompts if props are passed via CLI', () => {
    const result = execSync(`node ${executablePath} component --name=Test`, {
      cwd: __dirname,
    }).toString();
    expect(result).toContain('How old are you?');
  });

  it('Skips all prompts if all props passed via CLI', () => {
    const result = execSync(
      `node ${executablePath} component --name=Test --age=27 --about="A random component"`,
      {
        cwd: __dirname,
      }
    ).toString();
    expect(result).toContain('');
  });
});
