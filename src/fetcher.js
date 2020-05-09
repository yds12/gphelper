const http = require('http');
const https = require('https');
const iconv = require('iconv-lite');
const cacher = require('./cacher');

async function fetch(url, encoding){
  let cache = await cacher.getCache(url, encoding);
  if(cache) return cache;

  let lib;

  if(url.toLowerCase().startsWith('https://')) lib = https;
  else lib = http;

  return new Promise((resolve, reject) => {
    lib.get(url, (res) => {
      console.log('Fetching ', url);
      let converterStream = iconv.decodeStream(encoding);
      res.pipe(converterStream);

      let data = '';
      converterStream.on('data', (chunk) => {
        data += chunk;
      });
      converterStream.on('end', () => {
        cacher.saveCache(url, data, encoding);
        resolve(data);
      });
    }).on('error', (err) => {
      console.log('Error fetching URL: ' + err.message);
      reject(err);
    });
  });
}

module.exports.fetch = fetch;
