'use strict';

const Note = require('../model/puppy');
const logger = require('../lib/logger');
const customResponse = require('../lib/response');

module.exports = (router) => {
  router.post('/api/v1/puppy', (request, response) => {
    logger.log(logger.INFO, 'ROUTE-PUPPY: POST /api/v1/puppy');
    const newPuppy = new Puppy(request.body);
    newPuppy.save()
      .then((note) => {
        customResponse.sendJSON(response, 200, note);
        return undefined;
      })
      .catch((err) => {
        logger.log(logger.INFO, `ROUTE PUPPY: There was a bad request ${JSON.stringify(err.message)}`);
        customResponse.sendError(response, 400, err.message);
        return undefined;
      });
  });

  
  router.get('/api/v1/puppy', (request, response) => {
    if (!request.url.query.id) {
      customResponse.sendError(response, 404, 'Your request requires an id');
      return undefined;
    }

    Puppy.findOne(request.url.query.id)
      .then((puppy) => {
        customResponse.sendJSON(response, 200, puppy);
      })
      .catch((err) => {
        console.log(err);
        customResponse.sendError(response, 404, err.message);
      });
    return undefined;
  });
};
    
