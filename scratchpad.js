/* eslint-disable */

// a scratchpad for brainstorming stuff

import { collectComponentProps, component } from './scaffold/component';
import { collectHookProps, hook } from './scaffold/hook';

export default function handleScaffold({ command }) {
  if (command === 'component') {
    const props = collectComponentProps();

    scaffold('/random', props, component);
  }

  if (command === 'hook') {
    const props = collectHookProps();

    scaffold('/random', props, hook);
  }
}

// add elements inside

function component({ props, currentPath }) {
  return scaffold(currentPath, props, ComponentFile);
}

function withFolder(fn) {
  return function (filePath) {
    fs.mkDirSync(filePathj);

    fn();
  };
}

const Component = withFolder(component);

function withFile(fn) {
  return function (filePath) {
    fs.mkFileSync(filePath);

    fn();
  };
}

function file({ props }) {
  return `
  import * as React from 'react';

  const Thing = () => <div>thing</div>


  export default thing
  `;
}

const ComponentFile = withFile(fn);

// file functions return template literals
// literals check each arg - if folder type will throw
// folder functions return scaffold or null

// need to figure out how to prevent infinite loop -> maybe just limit depth?
