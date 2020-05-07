const nodeCouchDb = require('node-couchdb');

let db, dbName;

function setup(config){
  db = new nodeCouchDb({
    auth: {
      user: config.user,
      pass: config.pw
  }});

  dbName = config.dbName;
}

function testConnection(){
  db.get(dbName, '_all_docs').then((data, headers, status) =>
    console.log(`Query from ${dbName}:`, data), err =>
    console.log(`Failed to query ${dbName}:`, err.message));
}

function getNextTokenId(callback){
  const viewUrl = '_design/token-ids/_view/token-ids';
  db.get(dbName, viewUrl).then(({ data, headers, status }) => {
    let id = data.rows[0].value + 1;
    console.log('Token IDs query successful: ', data.rows[0].value);
    callback(id);
  }, err => {
    console.log(`Error querying ${viewUrl}: ${err.message}`);
    throw err;
  });
}

function getNewsItem(id){
  db.get(dbName, id).then(({ data, headers, status }) => {
  }, err => {
  });
}

function addToken(token){
  getNextTokenId(id => {
    const tokenObj = {
      _id: id.toString(),
      value: token,
      type: 'token'
    };

    db.insert(dbName, tokenObj).then(({data, headers, status}) => {
      console.log(`Token ${tokenObj} inserted successfully in the DB.`);
    }, err => {
      console.log(`Error inserting ${tokenObj}: ${err.message}`);
    });
  });
}

module.exports.setup = setup;
module.exports.testConnection = testConnection;
module.exports.getNewsItem = getNewsItem;
module.exports.addToken = addToken;
