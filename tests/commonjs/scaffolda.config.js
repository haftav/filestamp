/* eslint-disable */

// TODO: figure out eslint issues
const { scaffolda } = require('../../dist');
const { collectProps } = require('../../dist/cli');

const Component = require('../templates/Component');
const Folder = require('../templates/Folder');

const commands = [
  { title: 'Component', value: 'component' },
  { title: 'Folder', value: 'folder' },
];

const componentPrompts = [
  {
    type: 'text',
    name: 'name',
    message: 'What is the name of your component?',
  },
  {
    type: 'number',
    name: 'age',
    message: 'How old are you?',
  },
  {
    type: 'text',
    name: 'about',
    message: 'Tell something about yourself',
    initial: 'Why should I?',
  },
];

async function handleCommand(command) {
  if (command === 'component') {
    const props = await collectProps(() => componentPrompts);
    scaffolda('./samples', props, Component);
  }
  if (command === 'folder') {
    const props = await collectProps(() => [
      {
        type: 'text',
        name: 'name',
        message: 'What is the name of your folder?',
      },
    ]);

    scaffolda('./samples', props, Folder);
  }

  if (command === 'folder-test') {
    const props = await collectProps([
      {
        type: 'text',
        name: 'name',
        message: 'What are you naming this resource?',
      },
    ]);

    scaffolda('./samples', props, Folder);
  }
}

module.exports = async () => {
  return { commands, handleCommand };
};
