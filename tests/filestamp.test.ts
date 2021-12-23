import fs from 'fs';
import path from 'path';
import { stripIndent } from 'common-tags';

import createFilestamp, { createFile } from '../dist/filestamp';

const Component = (props: { name: string }) => `
import * as React from 'react';

const ${props.name} = () => <div>test</div>;

export default ${props.name};
`;
const ComponentFile = createFile(Component, (props: { name: string }) => `${props.name}.jsx`);

const filestamp = createFilestamp();

describe('Filestamp tests', () => {
  const props = { name: 'Test' };

  it('Creates file with specified content and path', async () => {
    await filestamp('./tests/samples', props, ComponentFile);

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
});
