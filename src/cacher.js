const fs = require('fs');
const path = require('path');
const url_module = require('url');
const util = require('./util');

const cacheDir = '../cache';
const CACHE_EXP = 3000; // in seconds

function getCacheFile(url){
  let parsedUrl = url_module.parse(url);
  return path.join(__dirname, cacheDir, parsedUrl.host + '.html');
}

async function getCache(url, encoding){
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
  return await util.getFileAbsolute(filename, encoding);
}

function saveCache(url, content, encoding){
  let filename = getCacheFile(url);
  try{
    util.saveFileAbsolute(filename, content, encoding);
  } catch(err) {
    console.log('Error saving file:', err.message);
    return;
  }
  console.log(`Cached ${filename}.`);
}

module.exports.getCache = getCache;
module.exports.saveCache = saveCache;
