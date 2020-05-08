const tokenId = {
  lastId: null,
  mutex: false,
  waiting: []
};

function tokenIdGetMutex(){
  tokenId.mutex = true;
}

function tokenIdGetAccess(resolve) {
  tokenId.waiting.push(resolve);
}

function tokenIdFreeMutex() {
  if(!tokenId.mutex) return;

  let resolve = tokenId.waiting.splice(0, 1)[0];
  while(resolve){
    resolve();
    resolve = tokenId.waiting.splice(0, 1)[0];
  }
  tokenId.mutex = false;
}

function tokenIdGetLastId(){
  return tokenId.lastId;
}

function tokenIdIsBlocked(){
  return tokenId.mutex;
}

module.exports.tokenId = {};
module.exports.tokenId.isBlocked = tokenIdIsBlocked;
module.exports.tokenId.getAccess = tokenIdGetAccess;
module.exports.tokenId.getMutex = tokenIdGetMutex;
module.exports.tokenId.freeMutex = tokenIdFreeMutex;
module.exports.tokenId.lastId = tokenId.lastId;
