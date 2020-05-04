const url_module = require('url');
const cheerio = require('cheerio');
const fetcher = require('./fetcher');

const providers = [
  require('./provider/afp'),
  require('./provider/reuters'),
  require('./provider/uol'),
  require('./provider/g1'),
  require('./provider/dw'),
];

async function extract(){
  elements = [];

  for(let provider of providers){
    let source = await fetcher.fetch(provider.url);
    source = provider.cutHtml(source);
    let ch = cheerio.load(source);
    let parsedUrl = url_module.parse(provider.url);
    let partialUrl = parsedUrl.protocol + '//' + parsedUrl.host;

    elements = elements.concat(
      provider.assembleItems(ch, partialUrl,
        parsedUrl.hostname.toLowerCase().replace('www.', '')));
  }

  return elements;
}

module.exports.extract = extract;
