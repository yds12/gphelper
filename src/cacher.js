const fs = require('fs');
const path = require('path');
const url_module = require('url');
const fileHelper = require('./filehelper');

const cacheDir = '../cache';
const CACHE_EXP = 600; // in seconds

function getCacheFile(url){
  let parsedUrl = url_module.parse(url);
  return path.join(__dirname, cacheDir, parsedUrl.host + '.html');
}

async function getCache(url){
  let filename = getCacheFile(url);
  if(!fs.existsSync(filename)) {
    console.log(`No cache file ${filename}.`);
    return null;
  }

  let now = Date.now();
  let mtime = fs.statSync(filename).mtimeMs;
  let age = Math.floor((now - mtime)/1000);

  if(age > CACHE_EXP) {
    console.log(`Cache file ${filename} is ${age}s old, and thus expired.`);
    return null;
  }

  console.log(`Cache file ${filename} is ${age}s old, and will be used.`);
  return await fileHelper.getFileAbsolute(filename);
}

function saveCache(url, content){
  let filename = getCacheFile(url);

  fs.writeFile(filename, content, err => {
    if(err) console.log('Error reading file:', err.message);
    else console.log(`Cached ${filename}.`);
  });
}

module.exports.getCache = getCache;
module.exports.saveCache = saveCache;
