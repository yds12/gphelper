const url = 'https://www.afp.com/pt';

function cutHtml(htmlBody){
  let idx = htmlBody.toLowerCase().indexOf('últimos textos');
  if(idx > -1) htmlBody = htmlBody.substr(idx);
  idx = htmlBody.toLowerCase().indexOf('esporte');
  if(idx > -1) htmlBody = htmlBody.substr(0, idx);

  return htmlBody;
}

function assembleItems(ch, partialUrl, source){
  items = [];

  ch('h3 a').each((i,e) => {
    items.push({ 
      title: ch(e).text(),
      link: partialUrl + ch(e).attr('href'),
      source: source 
    });
  });

  return items;
}

module.exports.url = url;
module.exports.cutHtml = cutHtml;
module.exports.assembleItems = assembleItems;
