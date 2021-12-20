module.exports = function Component({ props }) {
  return `
  import * as React from 'react';
  
  const ${props.name} = () => <div>content</div>;

  export default ${props.name};
  `;
};
