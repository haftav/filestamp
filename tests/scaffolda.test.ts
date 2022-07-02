import fs from 'fs';
import path from 'path';
import { stripIndent } from 'common-tags';

import { removeTestFiles } from './utils';

import scaffolda, { createFile, createFolder } from '../dist/scaffolda';

const directoryName = '/samples';
const pathToDirectory = path.join(__dirname, directoryName);

beforeEach(() => {
  removeTestFiles(pathToDirectory);
});
afterEach(() => {
  removeTestFiles(pathToDirectory);
});

const component = (props: { name: string }) => `
import * as React from 'react';

const ${props.name} = () => <div>test</div>;

export default ${props.name};
`;

const index = (props: { name: string }) => `
export { default } from './${props.name}'
`;

const hookComponent = (props: { name: string }) => `
${component(props)}
function use${props.name}State() {}
`;

const componentFile = createFile(component, (props: { name: string }) => `${props.name}.jsx`);
const componentFileWithStringArg = createFile(component, 'Test.jsx');
const indexFile = createFile(index, () => 'index.js');
const hookFile = createFile(hookComponent, () => 'hookFile.js');
const emptyFolder = createFolder(null, () => 'empty');

// NOTE: I'm currently hardcoding recursion depth to 10 to prevent infinite recursion
const nestedFolders = createFolder(
  [
    createFolder(
      [
        createFolder(
          [
            createFolder(
              [
                createFolder(
                  [
                    createFolder(
                      [
                        createFolder(
                          [
                            createFolder(
                              [createFolder([createFolder(null, () => 'ten')], () => 'nine')],
                              () => 'eight'
                            ),
                          ],
                          () => 'seven'
                        ),
                      ],
                      () => 'six'
                    ),
                  ],
                  () => 'five'
                ),
              ],
              () => 'four'
            ),
          ],
          () => 'three'
        ),
      ],
      () => 'two'
    ),
  ],
  () => 'one'
);

describe('Scaffolda tests', () => {
  const props = { name: 'Test' };

  it('Creates file with specified content and path', async () => {
    scaffolda('./tests/samples', props, componentFile);

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

  it('Creates files using string argument', async () => {
    scaffolda('./tests/samples', props, componentFileWithStringArg);

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

  it('Fails if file already exists', async () => {
    scaffolda('./tests/samples', props, componentFile);

    const filePath = path.join(__dirname, './samples/Test.jsx');

    expect(() => scaffolda('./tests/samples', props, componentFile)).toThrow();
  });

  // it('Creates empty folders', () => {
  //   const emptyFolder = createFolder(null, (props) => `${props.name}`);

  //   scaffolda('./tests/samples', props, emptyFolder);

  //   const folderPath = path.join(__dirname, './samples/Test');
  //   const folderExists = fs.existsSync(folderPath);

  //   expect(folderExists).toBe(true);

  //   const folderContent = fs.readdirSync(folderPath);
  //   expect(folderContent.length).toBe(0);
  // });

  // it('Creates folders with files', () => {
  //   const folderWithComponents = createFolder(
  //     [componentFile, indexFile],
  //     (props) => `${props.name}`
  //   );

  //   scaffolda('./tests/samples', props, folderWithComponents);

  //   const folderPath = path.join(__dirname, './samples/Test');
  //   const folderExists = fs.existsSync(folderPath);

  //   expect(folderExists).toBe(true);

  //   const folderContent = fs.readdirSync(folderPath);
  //   expect(folderContent.length).toBe(2);
  //   expect(folderContent).toContain('Test.jsx');
  //   expect(folderContent).toContain('index.js');
  // });

  // it('Creates folders using string argument', () => {
  //   const folderWithComponents = createFolder([componentFile, indexFile], 'Test');

  //   scaffolda('./tests/samples', props, folderWithComponents);

  //   const folderPath = path.join(__dirname, './samples/Test');
  //   const folderExists = fs.existsSync(folderPath);

  //   expect(folderExists).toBe(true);

  //   const folderContent = fs.readdirSync(folderPath);
  //   expect(folderContent.length).toBe(2);
  //   expect(folderContent).toContain('Test.jsx');
  //   expect(folderContent).toContain('index.js');
  // });

  // it('Creates folders with mixed content', () => {
  //   const folderWithComponentsAndSubfolders = createFolder(
  //     [componentFile, indexFile, emptyFolder],
  //     (props) => `${props.name}`
  //   );

  //   scaffolda('./tests/samples', props, folderWithComponentsAndSubfolders);

  //   const folderPath = path.join(__dirname, './samples/Test');
  //   const folderExists = fs.existsSync(folderPath);

  //   expect(folderExists).toBe(true);

  //   const folderContent = fs.readdirSync(folderPath);
  //   expect(folderContent.length).toBe(3);
  //   expect(folderContent).toContain('Test.jsx');
  //   expect(folderContent).toContain('index.js');
  //   expect(folderContent).toContain('empty');
  // });

  // it('Lets you nest content in content templates', () => {
  //   const folder = createFolder([hookFile], (props) => `${props.name}`);

  //   scaffolda('./tests/samples', props, folder);

  //   const filePath = path.join(__dirname, './samples/Test/hookFile.js');
  //   const fileExists = fs.existsSync(filePath);

  //   expect(fileExists).toBe(true);

  //   const content = fs.readFileSync(filePath, { encoding: 'utf-8' });

  //   expect(content).toMatch(
  //     stripIndent`
  //     import * as React from 'react';

  //     const Test = () => <div>test</div>;

  //     export default Test;

  //     function useTestState() {}
  //     `
  //   );
  // });

  // it('Creates files in already existing folders', () => {
  //   fs.mkdirSync(path.join(__dirname, './samples/Test'), { recursive: true });

  //   const folder = createFolder([componentFile], (props) => `${props.name}`);

  //   scaffolda('./tests/samples', props, folder);

  //   const filePath = path.join(__dirname, './samples/Test/Test.jsx');
  //   const fileExists = fs.existsSync(filePath);

  //   expect(fileExists).toBe(true);
  // });

  // it('Scaffolds lists of files or folders', () => {
  //   const emptyFolder = createFolder([], () => 'empty');
  //   const folderWithFile = createFolder([componentFile], (props) => `${props.name}`);

  //   scaffolda('./tests/samples', props, [emptyFolder, folderWithFile, componentFile]);

  //   const folderPath = path.join(__dirname, './samples');
  //   const folderExists = fs.existsSync(folderPath);

  //   expect(folderExists).toBe(true);

  //   const folderContent = fs.readdirSync(folderPath);

  //   expect(folderContent.length).toBe(3);
  //   expect(folderContent).toContain('empty');
  //   expect(folderContent).toContain('Test');
  //   expect(folderContent).toContain('Test.jsx');
  // });

  // it("Doesn't overwrite existing content", () => {
  //   fs.mkdirSync(path.join(__dirname, './samples/Test'), { recursive: true });
  //   fs.writeFileSync(path.join(__dirname, './samples/Test/Test.jsx'), '');

  //   const folder = createFolder([componentFile], (props) => `${props.name}`);

  //   expect(() => scaffolda('./tests/samples', props, folder)).toThrow();
  // });

  // it('Fails if folder contains invalid content', () => {
  //   const folderWithComponents = createFolder(
  //     [componentFile, indexFile, 'i am some invalid content'],
  //     (props) => `${props.name}`
  //   );

  //   expect(() => scaffolda('./tests/samples', props, folderWithComponents)).toThrow();
  // });

  // it('Fails on possible infinite recursion', () => {
  //   expect(() => scaffolda('./tests/samples', props, nestedFolders)).toThrow();
  // });
});
