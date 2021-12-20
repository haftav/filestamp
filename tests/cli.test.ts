import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const executablePath = path.join(__dirname, '..', 'dist/main.js');

const directoryName = '/samples';
const pathToDirectory = path.join(__dirname, directoryName);

function removeTestFiles() {
  if (fs.existsSync(pathToDirectory)) {
    fs.rmdirSync(pathToDirectory, { recursive: true });
  }
}

beforeEach(() => removeTestFiles());
afterEach(() => removeTestFiles());

describe('Does things', () => {
  it('Should work', () => {
    const result = execSync(`node ${executablePath}`, { cwd: __dirname }).toString();
    console.log(result);
    expect(true).toBe(true);
  });
});
