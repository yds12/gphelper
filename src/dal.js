const nodeCouchDb = require('node-couchdb');

let db;

function setup(config){
  db = new nodeCouchDb({
    auth: {
      user: config.user,
      pass: config.pw
  }});

//  db.listDatabases().then(dbs => {
//    console.log('Connected to database successfully! List of DBs:', dbs);
//  }, err => console.log('Error connecting to database: ', err.message));

  db.get(config.dbName, '_all_docs').then((data, headers, status) =>
    console.log(`Query from ${config.dbName}:`, data), err =>
    console.log(`Failed to query ${config.dbName}:`, err.message));
}

module.exports.setup = setup;
