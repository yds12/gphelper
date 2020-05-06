const providerBase = require('../provider-base');
const url = 'https://br.reuters.com/news/world';

function cutHtml(htmlBody){
  return htmlBody;
}

function assembleItems(ch, partialUrl, source){
  items = [];

  ch('h4 a').each((i,e) => {
    items.push({ 
      title: ch(e).text(),
      link: partialUrl + ch(e).attr('href'),
      source: source 
    });
  });
  ch('h5 a').each((i,e) => {
    items.push({ 
      title: ch(e).text(),
      link: partialUrl + ch(e).attr('href'),
      source: source 
    });
  });
  ch('div.headlineMed a').each((i,e) => {
    if(ch(e).siblings().length > 0){
      items.push({ 
        title: ch(e).text(),
        link: partialUrl + ch(e).attr('href'),
        source: source 
      });
    }
  });

  providerBase.generateItemsId(items);
  return items;
}

module.exports.url = url;
module.exports.cutHtml = cutHtml;
module.exports.assembleItems = assembleItems;
