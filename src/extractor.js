const url_module = require('url');
const cheerio = require('cheerio');
const fetcher = require('./fetcher');
const providerFactory = require('./provider-factory');
const util = require('./util');

async function extract(){
  let elements = [];
  const providers = providerFactory.getProviders();

  for(let provider of providers){
    try{
      let source = await fetcher.fetch(provider.url, provider.encoding);
      source = provider.cutHtml(source);
      let ch = cheerio.load(source);
      let parsedUrl = url_module.parse(provider.url);
      let baseUrl = parsedUrl.protocol + '//' + parsedUrl.host;

      let website = parsedUrl.hostname.toLowerCase()
        .replace(/(^www\.|\.com\.br$|\.com$|\.org$|\.org\.br$)/g, '');

      let elementsOfThisProvider = provider.getItems(ch, baseUrl, website);

      if(elementsOfThisProvider.length > 0)
        elements.push(elementsOfThisProvider);
    } catch(err){
      console.log('Error while fetching data from provider:', err.message);
      throw err;
    }
  }

  let headlines = sortElements(elements);
  return headlines;
}

// Sort between providers, preserving each provider's order intact
function sortElements(elements){
  let sortedHeadlines = [];

  while(elements.length > 0){
    let provIdx = Math.floor(Math.random() * elements.length);
    let elementsProv = elements[provIdx].toString();
    let headline = elements[provIdx].splice(0, 1)[0];

    sortedHeadlines.push(headline);

    if(elements[provIdx].length === 0) elements.splice(provIdx, 1);
  }

  return sortedHeadlines;
}

module.exports.extract = extract;
