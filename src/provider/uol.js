const providerBase = require('../provider-base');
const url = 'https://noticias.uol.com.br/internacional/';

function cutHtml(htmlBody){
  return htmlBody;
}

function assembleItems(ch, partialUrl, source){
  items = [];

  ch('div.results-items').children().each((i,e) => {
    let aEl = ch(e).find('a').first();
    let h3 = ch(e).find('h3').first();

    items.push({ 
      title: h3.text(),
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
