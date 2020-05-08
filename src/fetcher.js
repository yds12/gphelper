const http = require('http');
const https = require('https');
const cacher = require('./cacher');

async function fetch(url, encoding){
  if(!encoding) encoding = 'utf-8';

  let cache = await cacher.getCache(url);
  if(cache) return cache;

  let lib;

  if(url.toLowerCase().startsWith('https://')) lib = https;
  else lib = http;

  return new Promise((resolve, reject) => {
    lib.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        cacher.saveCache(url, data);
        resolve(data);
      });
    }).on('error', (err) => {
      console.log('Error fetching URL: ' + err.message);
      reject(err);
    });
  });
}

module.exports.fetch = fetch;
