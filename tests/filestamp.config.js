/* eslint-disable */
// TODO: figure out eslint issues
const { filestamp, collectProps } = require('../dist/main');

const Component = require('./templates/Component');

const commands = [{ title: 'Component', value: 'component' }];

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
    filestamp('./src', props, Component);
  }
}

module.exports = async () => {
  return { commands, handleCommand };
};
