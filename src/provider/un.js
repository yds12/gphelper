const providerBase = require('../provider-base');
const url = 'https://news.un.org/pt/';

function cutHtml(htmlBody){
  return htmlBody;
}

function assembleItems(ch, partialUrl, source){
  items = [];

  ch('h1.story-title').each((i,e) => {
    let aEl = ch(e).find('a');
    items.push({ 
      title: aEl.text(),
      link: partialUrl + aEl.attr('href'),
      source: source 
    });
  });

  providerBase.generateItemsId(items);
  return items;
}

module.exports.url = url;
module.exports.cutHtml = cutHtml;
module.exports.assembleItems = assembleItems;
