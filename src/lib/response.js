'use strict';

const response = module.exports = {};

response.sendJSON = (response, status, data) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(data));
  response.end();
  return undefined;
};

response.sendError = (response, status, msg) => {
  response.writeHead(status, { 'Content-Type': 'text/plain' });
  response.write(msg);
  response.end();
  return undefined;
};