'use strict';

const fileSystem = require('./file-system');
const memory = require('./memory');

require('dotenv').config();

module.exports = process.env.STORAGE === 'filesystem' ? fileSystem : memory;
