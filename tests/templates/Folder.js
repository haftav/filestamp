/* eslint-disable */
const { createFolder } = require('../../dist/main');

const Component = require('./Component');

module.exports = createFolder([Component], (props) => props.name);
