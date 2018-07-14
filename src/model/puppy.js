'use strict';

const uuid = require('uuid/v4');
const storage = require('../lib/storage');

module.exports = class Puppy {
  constructor(config) {
    this._id = uuid();
    this.createdOn = new Date();
    this.name = config.name;
    this.breed = config.breed;
  }

  save() {
    return storage.save('Puppy', this);
  }
    
  static findOne(_id) {
    return storage.get('Puppy', _id);
  }

  static delete(_id) {
    return storage.delete('Puppy', _id);
  }
};
