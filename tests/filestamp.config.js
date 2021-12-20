/* eslint-disable */
// TODO: figure out eslint issues
const { initializeFilestamp, filestamp, collectProps } = require('../dist/main');

const Component = require('./templates/Component');

const commands = [{ name: 'Component', value: 'component' }];

async function handleCommand(command) {
  if (command === 'component') {
    const props = await collectProps();
    filestamp('./src', props, Component);
  }
}

module.exports = async () => {
  return { commands, handleCommand };
};
