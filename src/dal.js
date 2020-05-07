const nodeCouchDb = require('node-couchdb');
const tokenIdSingleton = require('./tokenid-singleton');

const tokenIdView = '_design/token-ids/_view/token-ids';

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

async function getNextTokenId(){
  let id = 0;
  
  if(tokenIdSingleton.isBlocked()){
    let p = new Promise((res, rej) => tokenIdSingleton.getAccess(res));
    return p.then(() => {
      id = tokenIdSingleton.lastId + 1;
      tokenIdSingleton.lastId = id;
      return id;
    });
  }
  
  tokenIdSingleton.getMutex();
  return db.get(dbName, tokenIdView).then(({ data, headers, status }) => {
    tokenIdSingleton.lastTime = Date.now();

    const id = data.rows.length === 0 ? 1 : data.rows[0].value + 1;
    tokenIdSingleton.lastId = id;
    console.log('Token IDs query successful: ', id - 1);
    tokenIdSingleton.freeMutex();
    return id;
  }, err => {
    console.log(`Error querying ${tokenIdView}: ${err.message}`);
    tokenIdSingleton.freeMutex();
    throw err;
  });
}

function getNewsItem(id){
  db.get(dbName, id).then(({ data, headers, status }) => {
  }, err => {
  });
}

function addToken(token){
  const tokenObj = {
    value: token,
    type: 'token'
  };

  getNextTokenId().then(id => {
    console.log('id received:',id);
    tokenObj._id = id.toString();
    db.insert(dbName, tokenObj).then(({data, headers, status}) => {
      console.log(`Token ${tokenObj} inserted successfully in the DB.`);
    });
  }).catch(err => {
    throw err;
    console.log(`Error inserting ${tokenObj}: ${err.message}`);
  });
}

module.exports.setup = setup;
module.exports.testConnection = testConnection;
module.exports.getNewsItem = getNewsItem;
module.exports.addToken = addToken;
