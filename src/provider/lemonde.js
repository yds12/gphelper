const providerBase = require('../provider-base');
const url = 'https://diplomatique.org.br/';

function cutHtml(htmlBody){
  return htmlBody;
}

function assembleItems(ch, partialUrl, source){
  items = [];

  ch('div.card-featured-black').each((i,e) => {
    let aEl = ch(e).find('a');
    let h = ch(e).find('h2');
    items.push({ 
      title: h.text(),
      link: aEl.attr('href'),
      source: source 
    });
  });
  
  ch('div.card-clean').each((i,e) => {
    let aEl = ch(e).find('a');
    let h = ch(e).find('h4');
    items.push({ 
      title: h.text(),
      link: aEl.attr('href'),
      source: source 
    });
  });

  providerBase.generateItemsId(items);
  return items;
}

module.exports.url = url;
module.exports.cutHtml = cutHtml;
module.exports.assembleItems = assembleItems;
