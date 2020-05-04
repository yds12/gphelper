const http = require('http');
const https = require('https');

function fetch(url){
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
        resolve(data);
      });
    }).on('error', (err) => {
      console.log('Error fetching URL: ' + err.message);
      reject(err);
    });
  });
}

module.exports.fetch = fetch;
