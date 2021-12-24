/* eslint-disable */
const { createFile, createFolder } = require('../../dist/main');

const Component = require('./Component');

function HookContent(props) {
  return `
  import * as React from 'react';

  function actions = {}

  function reducer(state, action) {
    switch(action.type) {
      default:
        return state;
    }
  }

  const initialState = {};

  function use${props.name}State() {
    const [state, dispatch] = React.useReducer(reducer, initialState)

    return [state, dispatch];
  }

  export default use${props.name}State;

  `;
}

function StyleContent() {
  return ``;
}

const HookFile = createFile(HookContent, (props) => `use${props.name}State.js`);
const StyleFile = createFile(StyleContent, (props) => `${props.name}.styles.css`);

module.exports = createFolder([Component, HookFile, StyleFile], (props) => props.name);
