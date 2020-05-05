$('ul#items li span.title').each((i, e) => {
  let elementText = $(e).text();

  for(let kw of keywords){
    const re = new RegExp('\\b' + kw + '\\b', 'ig');
    elementText = elementText.replace(re,
      `<mark class="keyword">${kw}</mark>`);
  }
  $(e).html(elementText);
});
