const url_module = require('url');
const cheerio = require('cheerio');
const fetcher = require('./fetcher');

const URLs = [''];

async function extract(url){
  let source = await fetcher.fetch(url);
  let idx = source.toLowerCase().indexOf('últimos textos');

  if(idx > -1){
    source = source.substr(idx);
  }

  idx = source.toLowerCase().indexOf('esporte');
  if(idx > -1){
    source = source.substr(0, idx);
  }

  let ch = cheerio.load(source);

  let parsedUrl = url_module.parse(url);
  let partialUrl = parsedUrl.protocol + '//' + parsedUrl.host;
  elements = [];

  ch('h3 a').each((i,e) => {
    elements[i] = { 
      title: ch(e).text(),
      link: partialUrl + ch(e).attr('href'),
      source: parsedUrl.hostname.toLowerCase().replace('www.', '')
    };
  });
  return elements;
}

module.exports.extract = extract;
