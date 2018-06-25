'use strict';

const superagent = require('superagent');
const server = require('../lib/server');
const Puppy = require('../model/note');

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
        .catch((err) => {
            throw err;
        });
    });

    it('should show 400 for a bad request', () => {
        return superagent.post(apiUrl)
          .send({})
          .then((response) => {
            throw response;
          })
          .catch((err) => {
            expect(err.status).toEqual(400);
            expect(err).toBeInstanceOf(Error);
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
         .catch((err) => {
             throw err;
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
          .catch((err) => {
            throw err;
          });
      });
}); 

describe('DELETE /api/puppy/?id', () => {
    it('should have status 204 and succesfully delete the item', (done) => {
      superagent.delete(`${apiURL}?id=${mockResourceForGet._id}`)
      .then((res) => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch((done));
    });
  });

  describe('DELETE /api/notes/?id with bad ID', () => {
    it('should have status 404', (done) => {
      superagent.delete(`${apiURL}?id=12345`)
      .then(done)
      .catch((err) => {
      expect(err.status).to.equal(404);
      done();
      });
    });
  });
