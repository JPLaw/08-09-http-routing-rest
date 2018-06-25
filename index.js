'use strict';

require('dotenv').config();

const server = require('./lib/server');


server.start(3000, () => console.log(`Listening on 3000`));
server.start(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));