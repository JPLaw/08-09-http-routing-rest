'use strict';

const Puppy = require('../model/puppy');
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
      .catch((error) => {
        logger.log(logger.INFO, `ROUTE PUPPY: There was a bad request ${JSON.stringify(error.message)}`);
        customResponse.sendError(response, 400, error.message);
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
      .catch((error) => {
        console.log(error);
        customResponse.sendError(response, 404, error.message);
      });
    return undefined;
  });

  router.delete('/api/v1/puppy', (request, response) => {
    if (!request.url.query.id) {
      customResponse.sendError(response, 404, 'Your request requires an ID');
      return undefined;
    }
    Puppy.delete(request.url.query.id)
      .then((puppy) => {
        customResponse.sendJSON(response, 200, {
          result: `${puppy.name} has been deleted`,
        });
      })
      .catch((error) => {
        console.log(error);
        customResponse.sendError(response, 404, error.message);
      });
    return undefined;
  });
};
    
