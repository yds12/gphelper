let lastId = null;
let mutex = false;
const waiting = [];

function getMutex(){
  mutex = true;
}

function getAccess(resolve) {
  waiting.push(resolve);
}

function freeMutex() {
  if(!mutex) return;

  let resolve = waiting.splice(0, 1)[0];
  while(resolve){
    resolve();
    resolve = waiting.splice(0, 1)[0];
  }
  mutex = false;
}

function isBlocked(){
  return mutex;
}

module.exports.isBlocked = isBlocked;
module.exports.getAccess = getAccess;
module.exports.getMutex = getMutex;
module.exports.freeMutex = freeMutex;
