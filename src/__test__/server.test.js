'use strict';

const superagent = require('superagent');
const server = require('../lib/server');
const Puppy = require('../model/puppy');

const apiUrl = 'http://localhost:3000/api/v1/puppy';

const mockResource = {
  name: 'test name',
  breed: 'test breed',
};

beforeAll(() => server.start(3000));
afterAll(() => server.stop());

describe('POST to /api/v1/puppy', () => {
  it('should show 200 for successful saving of a new puppy', () => {
    return superagent.post(apiUrl)
      .send(mockResource)
      .then((response) => {
        expect(response.body.name).toEqual(mockResource.name);
        expect(response.body.breed).toEqual(mockResource.breed);
        expect(response.body._id).toBeTruthy();
        expect(response.status).toEqual(200);
      })
      .catch((error) => {
        throw error;
      });
  });

  it('should show 400 for a bad request', () => {
    return superagent.post(apiUrl)
      .send({})
      .then((response) => {
        throw response;
      })
      .catch((error) => {
        expect(error.status).toEqual(400);
        expect(error).toBeInstanceOf(Error);
      });
  });
});

describe('GET /api/v1/puppy', () => {
  let mockResourceForGet;
  beforeEach(() => {
    const newPuppy = new Puppy(mockResource);
    newPuppy.save()
      .then((puppy) => {
        mockResourceForGet = puppy;
      })
      .catch((error) => {
        throw error;
      });
  });

  it('should show 200 successful GET request', () => {
    return superagent.get(`${apiUrl}?id=${mockResourceForGet._id}`)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(mockResourceForGet.name);
        expect(response.body.breed).toEqual(mockResourceForGet.breed);
        expect(response.body.createdOn).toEqual(mockResourceForGet.createdOn.toISOString());
      })
      .catch((error) => {
        throw error;
      });
  });
      
  it('show show 404 bad GET request', () => {
    return superagent.get(`${apiUrl}`)
      .then((response) => {
        // throw error;
        throw response;
      })
      .catch((error) => {
        expect(error.status).toEqual(404);
      });
  });


  describe('DELETE /api/v1/puppy', () => {
    // let mockResourceForGet;
    beforeEach((done) => {
      const newPuppy = new Puppy(mockResource);
      newPuppy.save()
        .then((puppy) => {
          mockResourceForGet = puppy;
          done();
        }) 
        .catch((err) => {
          throw err;
        });
    });
  
    it('should have status 200 and succesfully delete the item', (done) => {
      superagent.delete(`${apiUrl}?id=${mockResourceForGet._id}`)
        .then((response) => {
          expect(response.status).toEqual(200);
          done();
        })
        .catch((done));
    });

    it('should show 404 for bad DELETE request', () => {
      return superagent.delete(`${apiUrl}`)
        .then((response) => {
          // throw error;
          throw response;
        })
        .catch((error) => {
          expect(error.status).toEqual(404);
        });
    });
  });
});
