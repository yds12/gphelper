const nodeCouchDb = require('node-couchdb');
const mutex = require('./mutex');


let db, dbName, designDocument, tokenIdView, tokenByValueView, headlinesView;

function setup(config){
  designDocument = config.designDocument;
  tokenIdView = `_design/${designDocument}/_view/token-ids`;
  tokenByValueView = `_design/${designDocument}/_view/token-by-value`;
  headlinesView = `_design/${designDocument}/_view/headlines`;

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

function headlineExists(id){
  const queryOptions = { key: id };

  return db.get(dbName, headlinesView, queryOptions)
    .then(({ data, headers, status }) => {
      if(data){
        if(data.rows.length > 0 && data.rows[0].id) return true;
        else return false;
      }
      else throw Error(`Headline query failed for ID=${id}!`);
    }, err => console.log('Query failed:', err));
}

function insertHeadline(headline){
  const headlineObj = {
    _id: headline.id,
    type: 'headline',
    tokens: headline.tokens,
    good: headline.good
  };

  db.insert(dbName, headlineObj).then(({ data, headers, status }) => {
    console.log(`Headline ID=${headline.id} inserted successfully.`);
  }).catch(err => 
    console.log(`Error inserting headline ID=${headline.id}. Error:`,
      err.message));
}

function getTokenId(token){
  const queryOptions = { key: token };

  return db.get(dbName, tokenByValueView, queryOptions)
    .then(({ data, headers, status }) => {
      if(data && data.rows.length > 0 && !isNaN(data.rows[0].id))
        return +data.rows[0].id;
      else return -1;
    }, err => console.log('Query failed:', err.message));
}

async function getNextTokenId(){
  let id = 0;
  
  // If mutex is locked, waits until the first request to query the ID
  // returns, then use/increment this ID (stored at a singleton).
  if(mutex.tokenId.isBlocked()){
    let p = new Promise((res, rej) => mutex.tokenId.getAccess(res));
    return p.then(() => {
      id = mutex.tokenId.lastId + 1;
      mutex.tokenId.lastId = id;
      return id;
    });
  }
  
  // Only one query at a time to get the last ID in the DB. Locks mutex.
  mutex.tokenId.getMutex();
  return db.get(dbName, tokenIdView).then(({ data, headers, status }) => {
    const id = data.rows.length === 0 ? 1 : data.rows[0].value + 1;
    mutex.tokenId.lastId = id;
    console.log('Token IDs query successful: ', id - 1);
    mutex.tokenId.freeMutex();
    return id;
  }, err => {
    console.log(`Error querying ${tokenIdView}: ${err.message}`);
    mutex.tokenId.freeMutex();
    throw err;
  });
}

async function addToken(token){
  const tokenObj = {
    value: token,
    type: 'token'
  };

  let existingId = await getTokenId(token);
  if(existingId > -1){
    console.log(`Token ${token} ID=${existingId} already exists.`);
    return existingId;
  }

  let newId = await getNextTokenId();
  tokenObj._id = newId.toString();
  try{
    let { data, headers, status } = await db.insert(dbName, tokenObj);
    console.log(`Token ${token} ID=${newId} inserted successfully.`);
  } catch(err) {
    console.log(`Failed to insert token ${token} ID=${newId}. Error:`,
      err.message);
  }
  return newId;
}

module.exports.setup = setup;
module.exports.testConnection = testConnection;
module.exports.addToken = addToken;
module.exports.headlineExists = headlineExists;
module.exports.insertHeadline = insertHeadline;
