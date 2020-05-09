const url_module = require('url');
const cheerio = require('cheerio');
const fetcher = require('./fetcher');
const providerFactory = require('./provider-factory');

// should be in a separate helper
function shuffle(array){
  for(let i = array.length - 1; i > 0; i--){
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

async function extract(){
  elements = [];
  const providers = providerFactory.getProviders();

  for(let provider of providers){
    try{
      let source = await fetcher.fetch(provider.url, provider.encoding);
      source = provider.cutHtml(source);
      let ch = cheerio.load(source);
      let parsedUrl = url_module.parse(provider.url);
      let partialUrl = parsedUrl.protocol + '//' + parsedUrl.host;

      let website = parsedUrl.hostname.toLowerCase()
        .replace(/(^www\.|\.com\.br$|\.com$|\.org$|\.org\.br$)/g, '');

      elements = elements.concat(provider.getItems(ch, partialUrl, website));
    } catch(err){
      console.log('Error while fetching data from provider:', err.message);
      throw err;
    }
  }

  shuffle(elements);
  return elements;
}

module.exports.extract = extract;
