const url = 'https://www.dw.com/pt-br/not%C3%ADcias/mundo/s-30734';

function cutHtml(htmlBody){
  return htmlBody;
}

function assembleItems(ch, partialUrl, source){
  items = [];

  ch('div.news, div.linkList').each((i,e) => {
    let aEl = ch(e).find('a');
    let h2 = ch(e).find('h2');
    items.push({ 
      title: h2.text(),
      link: partialUrl + aEl.attr('href'),
      source: source 
    });
  });

  return items;
}

module.exports.url = url;
module.exports.cutHtml = cutHtml;
module.exports.assembleItems = assembleItems;
