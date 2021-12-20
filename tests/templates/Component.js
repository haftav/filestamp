/* eslint-disable */
const { createFile } = require('../../dist/main');

function Component({ props }) {
  console.log('props', props);
  return `
  import * as React from 'react';
  
  const ${props.name} = () => <div>content</div>;

  export default ${props.name};
  `;
}

module.exports = createFile(Component);
