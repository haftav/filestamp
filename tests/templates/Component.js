/* eslint-disable */
const { createFile } = require('../../dist');

function Component(props) {
  return `
  import * as React from 'react';
  
  const ${props.name} = () => <div>content</div>;

  export default ${props.name};
  `;
}

module.exports = createFile(Component, (props) => `${props.name}.jsx`);
