const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function getFile(filename){
  let data = await fs.promises.readFile(path.join(__dirname, filename));
  return data.toString();
}

async function getFileAbsolute(filename){
  let data = await fs.promises.readFile(filename);
  return data.toString();
}

function getHash(str){
  return crypto.createHash('md5').update(str).digest('hex');
}

module.exports.getFile = getFile;
module.exports.getFileAbsolute = getFileAbsolute;
module.exports.getHash = getHash;
