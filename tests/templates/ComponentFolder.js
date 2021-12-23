/* eslint-disable */
const { createFile } = require('../../dist/main');
import { createFolder } from '../../dist/filestamp';

function Component(props) {
  return `
  import * as React from 'react';
  
  const ${props.name} = () => <div>content</div>;

  export default ${props.name};
  `;
}

function Folder({ props }) {
  return createFolder[(ComponentFile(), HookFile(), StyleFile(), TestFile())];
}

module.exports = createFile(Component);
