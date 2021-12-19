#!/usr/bin/env node

// just testing things out here

/* eslint-disable */
const path = require('path');
const fs = require('fs');
const prompts = require('prompts');
const { stripIndent } = require('common-tags');

// 1. determine which command user wants to run
// 2. collect variables needed for that command

const actions = {
  component({ name }) {
    const rawContent = `
    import * as React from 'react'

    const ${name[0].toUpperCase() + name.slice(1)} = () => ()

    export default ${name[0].toUpperCase() + name.slice(1)}
    `;

    const content = stripIndent`${rawContent}`;

    const folderPath = path.join(__dirname, '/random');
    const filePath = path.join(folderPath, `${name}.jsx`);

    fs.writeFileSync(filePath, content);
  },
};

async function init() {
  console.log('running program');

  const { command } = await prompts({
    type: 'select',
    name: 'command',
    choices: [{ title: 'Component', value: 'component' }],
    message: 'Please choose command you want to run.',
  });

  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: 'Choose a name for your component.',
  });

  // collect variables
  const variables = {
    name,
  };

  if (!actions[command]) {
    throw new Error('no command');
  }

  const commandFunction = actions[command];

  // write to file somewhere
  commandFunction(variables);
}

init().catch((err) => console.error(err));
