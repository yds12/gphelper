const keywords = [
  'África',
  'aquecimento',
  'Argentina',
  'Ásia',
  'Brasil',
  'China',
  'climática',
  'climático',
  'economia',
  'economias',
  'econômico',
  'EUA',
  'Gaza',
  'geopolítica',
  'Irã',
  'Iraque',
  'Israel',
  'ONU',
  'OTAN',
  'Palestina',
  'política',
  'políticas',
  'político',
  'políticos',
  'Reino Unido',
  'Rússia',
  'Síria',
  'UE',
  'União Europeia',
];

$('ul#items li span.title').each((i, e) => {
  let elementText = $(e).text();

  for(let kw of keywords){
    const re = new RegExp('\\b' + kw + '\\b', 'ig');
    elementText = elementText.replace(re,
      `<mark class="keyword">${kw}</mark>`);
  }
  $(e).html(elementText);
});
