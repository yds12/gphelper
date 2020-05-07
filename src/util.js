const fs = require('fs');
const readline = require('readline');
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

function readLines(file, online, onend){
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity
  });

  rl.on('line', line => {
    online(line);
  });

  rl.on('close', () => {
    onend();
  });
}

function getHash(str){
  return crypto.createHash('md5').update(str).digest('hex');
}

module.exports.getFile = getFile;
module.exports.getFileAbsolute = getFileAbsolute;
module.exports.readLines = readLines;
module.exports.getHash = getHash;
