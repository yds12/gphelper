const providerBase = require('../provider-base');
const url = 'https://www.em.com.br/internacional/';
const encoding = 'ISO-8859-1';

function cutHtml(htmlBody){
  return htmlBody;
}

function assembleItems(ch, partialUrl, source){
  items = [];

  ch('div.news-box h4 a').each((i,e) => {
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
module.exports.encoding = encoding;
