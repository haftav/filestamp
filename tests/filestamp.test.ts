import fs from 'fs';
import path from 'path';
import { stripIndent } from 'common-tags';

import { removeTestFiles } from './utils';

import createFilestamp, { createFile, createFolder } from '../dist/filestamp';

const directoryName = '/samples';
const pathToDirectory = path.join(__dirname, directoryName);

beforeEach(() => removeTestFiles(pathToDirectory));
afterEach(() => removeTestFiles(pathToDirectory));

const component = (props: { name: string }) => `
import * as React from 'react';

const ${props.name} = () => <div>test</div>;

export default ${props.name};
`;

const index = (props: { name: string }) => `
export { default } from './${props.name}'
`;

const componentFile = createFile(component, (props: { name: string }) => `${props.name}.jsx`);
const indexFile = createFile(index, () => 'index.js');
const emptyFolder = createFolder(null, () => 'empty');

const filestamp = createFilestamp();

describe('Filestamp tests', () => {
  const props = { name: 'Test' };

  it('Creates file with specified content and path', async () => {
    await filestamp('./tests/samples', props, componentFile);

    const filePath = path.join(__dirname, './samples/Test.jsx');
    const fileExists = fs.existsSync(filePath);

    expect(fileExists).toBe(true);

    const content = fs.readFileSync(filePath, { encoding: 'utf-8' });

    expect(content).toMatch(
      stripIndent`
      import * as React from 'react';

      const Test = () => <div>test</div>;

      export default Test;
      `
    );
  });

  it('Creates empty folders', async () => {
    const emptyFolder = createFolder(null, (props) => `${props.name}`);

    await filestamp('./tests/samples', props, emptyFolder);

    const folderPath = path.join(__dirname, './samples/Test');
    const folderExists = fs.existsSync(folderPath);

    expect(folderExists).toBe(true);

    const folderContent = fs.readdirSync(folderPath);
    expect(folderContent.length).toBe(0);
  });

  it('Creates folders with files', async () => {
    const folderWithComponents = createFolder(
      [componentFile, indexFile],
      (props) => `${props.name}`
    );

    await filestamp('./tests/samples', props, folderWithComponents);

    const folderPath = path.join(__dirname, './samples/Test');
    const folderExists = fs.existsSync(folderPath);

    expect(folderExists).toBe(true);

    const folderContent = fs.readdirSync(folderPath);
    expect(folderContent.length).toBe(2);
    expect(folderContent).toContain('Test.jsx');
    expect(folderContent).toContain('index.js');
  });

  it('Creates folders with mixed content', async () => {
    const folderWithComponentsAndSubfolders = createFolder(
      [componentFile, indexFile, emptyFolder],
      (props) => `${props.name}`
    );

    await filestamp('./tests/samples', props, folderWithComponentsAndSubfolders);

    const folderPath = path.join(__dirname, './samples/Test');
    const folderExists = fs.existsSync(folderPath);

    expect(folderExists).toBe(true);

    const folderContent = fs.readdirSync(folderPath);
    expect(folderContent.length).toBe(3);
    expect(folderContent).toContain('Test.jsx');
    expect(folderContent).toContain('index.js');
    expect(folderContent).toContain('empty');
  });

  it('Creates files in already existing folders', async () => {
    fs.mkdirSync(path.join(__dirname, './samples/Test'), { recursive: true });

    const folder = createFolder([componentFile], (props) => `${props.name}`);

    await filestamp('./tests/samples', props, folder);

    const filePath = path.join(__dirname, './samples/Test/Test.jsx');
    const fileExists = fs.existsSync(filePath);

    expect(fileExists).toBe(true);
  });

  it("Doesn't overwrite existing content", async () => {
    fs.mkdirSync(path.join(__dirname, './samples/Test'), { recursive: true });
    fs.writeFileSync(path.join(__dirname, './samples/Test/Test.jsx'), 'Testing');

    const folder = createFolder([componentFile], (props) => `${props.name}`);

    await filestamp('./tests/samples', props, folder);

    const filePath = path.join(__dirname, './samples/Test/Test.jsx');
    const fileExists = fs.existsSync(filePath);

    expect(fileExists).toBe(true);

    const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
    expect(content).toMatch('Testing');
  });

  // it('Fails if folder contains invalid content', () => {});
  // it('Fails on possible infinite recursion', () => {});
});
