const low = require('lowdb');
const lodashId = require('lodash-id');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('database/db.json');
const db = low(adapter);

let counter = 0;

/* it adds the functionality of automatically generated ID for each entry in the db */
lodashId.createId = (collectionName, item) => `${++counter}`;
db._.mixin(lodashId);

/* Set default values (required if JSON file is empty) */
db.defaults({
  user: {},
  exercises: [],
  tests: []
}).write();

module.exports = db;

