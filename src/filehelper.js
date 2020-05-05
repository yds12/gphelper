const fs = require('fs');
const path = require('path');

async function getFile(filename){
  let data = await fs.promises.readFile(path.join(__dirname, filename));
  return data.toString();
}

async function getFileAbsolute(filename){
  let data = await fs.promises.readFile(filename);
  return data.toString();
}

module.exports.getFile = getFile;
module.exports.getFileAbsolute = getFileAbsolute;
