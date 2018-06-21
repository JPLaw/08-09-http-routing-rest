'use strict';

const superagent = require('superagent');
const server = require('../lib/server');
const Puppy = require('../model/note');

const apiUrl = 'http://localhost:3000/api/v1/puppy';

const mockResource = {
    title: 'test title',
    content: 'test content',

};

beforeAll(() => server.start(3000));
afterAll(() => server.stop());

describe('POST to /api/v1/puppy', () => {
    test('200 for successful saving of a new puppy', () => {
        return superagent.post(apiUrl)
        .send(mockResource)
        .then((response) => {
            expect(response.body.title).toEqual(mockResource.title);
            expect(response.body.content).toEqual(mockResource.content);
            expect(response.body._id).toBeTruthy();
            expect(response.status).toEqual(200);
        })
        .catch((err) => {
            throw err;
        });
    });

    test('400 for a bad request', () => {
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

     test('200 successful GET request', () => {
         return superagent.get(`${apiUrl}?id=${mockResourceForGet._id}`)
         .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.title).toEqual(mockResourceForGet.name);
            expect(response.body.content).toEqual(mockResourceForGet.breed);
            expect(response.body.createdOn).toEqual(mockResourceForGet.createdOn.toISOString());
          })
          .catch((err) => {
            throw err;
          });
      });
});