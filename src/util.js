const fs = require('fs');
const readline = require('readline');
const path = require('path');
const crypto = require('crypto');
const iconv = require('iconv-lite');

async function getFile(filename){
  let data = await fs.promises.readFile(path.join(__dirname, filename));
  return data.toString();
}

async function getFileAbsolute(filename, encoding){
  return new Promise((resolve, reject) => {
    let reader = fs.createReadStream(filename);
    let converterStream = iconv.decodeStream(encoding);
    reader.pipe(converterStream);

    let data = '';
    converterStream.on('data', (chunk) => {
      data += chunk;
    });
    converterStream.on('end', () => {
      resolve(data);
    });
    converterStream.on('error', (err) => {
      reject(err);
    });
  });
}

function saveFileAbsolute(filename, content, encoding){
  let data = iconv.encode(content, encoding);

  fs.writeFile(filename, data, err => {
    if(err) throw err;
  });
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

function removeDuplicates(arr){
  return arr.filter((v, i, self) => self.indexOf(v) === i);
}

function shuffle(array){
  for(let i = array.length - 1; i > 0; i--){
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function flatten(array){
  return array.reduce((arr, el) => {
    for(let subEl of el) arr.push(subEl);
    return arr;
  })
}

module.exports.removeDuplicates = removeDuplicates;
module.exports.getFile = getFile;
module.exports.getFileAbsolute = getFileAbsolute;
module.exports.readLines = readLines;
module.exports.getHash = getHash;
module.exports.saveFileAbsolute = saveFileAbsolute;
module.exports.shuffle = shuffle;
