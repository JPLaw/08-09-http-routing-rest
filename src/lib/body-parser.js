const url = require('url');
const queryString = require('querystring');


module.exports = (request) => {
  return new Promise((resolve, reject) => {
    if (!request || !request.url) return reject(new Error('Invalid Request Object. Cannot parse.'));

    request.url = url.parse(request.url);
    request.url.query = queryString.parse(request.url.query);


    // this line only hits for GET and DELETE
    if (!request.method.match(/POST|PUT|PATCH/)) {
      return resolve(request);
    }

    let message = '';

    //accumulating checks of message
    request.on('data', (data) => {
      debug(`Chunked request data: ${data.toString()}`);
      message += data.toString();
    });

    request.on('end', () => {
      // this takes the JSON message and turns it into a JS object, 
      // and attaches it as the "body" propery on the bigger request object
      // possible errors: passing in ' ', usually results in a SyntaxError
      try {
        request.body = JSON.parse(message);
        debug(`Completed request body: ${request.body}`);
        return resolve(request);
      } catch (err) {
        console.log(err);
        return reject(err);
      }
    });

    //error beyond our control (i.e. server error)
    request.on('error', reject);
    debug(`Error occured on parsing request body: ${err}`);
    return reject(err);
  });
};