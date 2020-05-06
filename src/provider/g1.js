const providerBase = require('../provider-base');
const url = 'https://g1.globo.com/mundo/';

function cutHtml(htmlBody){
  return htmlBody;
}

function assembleItems(ch, partialUrl, source){
  items = [];

  ch('div._xn div.bastian-feed-item a.feed-post-link').each((i,e) => {
    items.push({ 
      title: ch(e).text(),
      link: ch(e).attr('href'),
      source: source 
    });
  });

  providerBase.generateItemsId(items);
  return items;
}

module.exports.url = url;
module.exports.cutHtml = cutHtml;
module.exports.assembleItems = assembleItems;
