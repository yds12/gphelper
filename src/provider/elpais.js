const providerBase = require('../provider-base');
const url = 'https://brasil.elpais.com/seccion/internacional/';

function cutHtml(htmlBody){
  return htmlBody;
}

function assembleItems(ch, partialUrl, source){
  items = [];

  ch('article.story_card script').each((i,e) => {
    try{
      let obj = JSON.parse(ch(e).html());

      items.push({ 
        title: obj.headline,
        link: obj.url,
        source: source 
      });
    } catch(err) {
      console.log('Error processing El Pais data:', err);
    }
  });

  providerBase.generateItemsId(items);
  return items;
}

module.exports.url = url;
module.exports.cutHtml = cutHtml;
module.exports.assembleItems = assembleItems;
