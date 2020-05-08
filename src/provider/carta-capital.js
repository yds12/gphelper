const providerBase = require('../provider-base');
const url = 'https://www.cartacapital.com.br/Mundo/';

function cutHtml(htmlBody){
  return htmlBody;
}

function assembleItems(ch, partialUrl, source){
  items = [];

  ch('#nav-menu-item-45572 * a.eltdf-pt-link').each((i,e) => {
    items.push({ 
      title: ch(e).text(),
      link: partialUrl + ch(e).attr('href'),
      source: source 
    });
  });

  providerBase.generateItemsId(items);
  return items;
}

module.exports.url = url;
module.exports.cutHtml = cutHtml;
module.exports.assembleItems = assembleItems;
