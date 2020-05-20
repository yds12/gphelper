const Provider = require('./provider');

const providers = [];
let initialized = false;

function getProviders(){
  if(!initialized) initialize();

  return providers;
}

function initialize(){
  // Instantiate providers
  const provAfp = new Provider('https://www.afp.com/pt');
  const provReuters = new Provider('https://br.reuters.com/news/world');
  const provUol = new Provider('https://noticias.uol.com.br/internacional/');
  const provDw = new Provider(
    'https://www.dw.com/pt-br/not%C3%ADcias/mundo/s-30734');
  const provG1 = new Provider('https://g1.globo.com/mundo/');
  const provUn = new Provider('https://news.un.org/pt/');
  const provEm = new Provider(
    'https://www.em.com.br/internacional/', 'ISO-8859-1');
  const provElpais = new Provider(
    'https://brasil.elpais.com/seccion/internacional/');
  const provLemonde = new Provider('https://diplomatique.org.br/');
  const provCarta = new Provider('https://www.cartacapital.com.br/Mundo/');


  // Set providers' cutHtml method
  provAfp.cutHtml = (body) => {
    let idx = body.toLowerCase().indexOf('últimos textos');
    if(idx > -1) body = body.substr(idx);
    idx = body.toLowerCase().indexOf('esporte');
    if(idx > -1) body = body.substr(0, idx);
    return body;
  };


  // Add parts to the items processing pipeline
  provAfp.addItemsPipeline({
    mainFilter: 'h3 a'
  });

  provUol.addItemsPipeline({
    mainFilter: 'div.results-items',
    useChildren: true,
    otherFilters: [ 'h3', 'a' ],
    titleElementIdx: 0,
    urlElementIdx: 1
  });

  provDw.addItemsPipeline({
    mainFilter: 'div.news, div.linkList',
    otherFilters: [ 'h2', 'a' ],
    titleElementIdx: 0,
    urlElementIdx: 1
  });

  provG1.addItemsPipeline({
    mainFilter: 'div._xn div.bastian-feed-item a.feed-post-link'
  });

  provUn.addItemsPipeline({
    mainFilter: 'h1.story-title',
    otherFilters: ['a'],
    titleElementIdx: 0,
    urlElementIdx: 0
  });

  provEm.addItemsPipeline({
    mainFilter: 'div.news-box h4 a'
  });
  
  provLemonde.addItemsPipeline({
    mainFilter: 'div.card-featured-black',
    otherFilters: [ 'h2', 'a' ],
    titleElementIdx: 0,
    urlElementIdx: 1
  });
  provLemonde.addItemsPipeline({
    mainFilter: 'div.card-clean',
    otherFilters: [ 'h4', 'a' ],
    titleElementIdx: 0,
    urlElementIdx: 1
  });

  provCarta.addItemsPipeline({
    mainFilter: '#nav-menu-item-45572 a.eltdf-pt-link'
  });


  // Set assembleItems for providers that don't fit the items pipeline
  // standard
  provReuters.assembleItems = (ch, baseUrl) => {
    let items = [];

    ch('h4 a').each((i,e) => {
      items.push({ 
        title: ch(e).text(),
        link: baseUrl + ch(e).attr('href')
      });
    });
    ch('h5 a').each((i,e) => {
      items.push({ 
        title: ch(e).text(),
        link: baseUrl + ch(e).attr('href')
      });
    });
    ch('div.headlineMed a').each((i,e) => {
      if(ch(e).siblings().length > 0){
        items.push({ 
          title: ch(e).text(),
          link: baseUrl + ch(e).attr('href')
        });
      }
    });
    return items;
  };
 
  provElpais.assembleItems = (ch, baseUrl) => {
    let items = [];

    ch('article.story_card script').each((i,e) => {
      try{
        let obj = JSON.parse(ch(e).html());

        items.push({ 
          title: obj.headline,
          link: obj.url
        });
      } catch(err) {
        console.log('Error processing El Pais data:', err);
      }
    });
    return items;
  };


  // Add all providers to array
  providers.push(provEm);
  providers.push(provAfp);
  providers.push(provReuters);
  providers.push(provUol);
  providers.push(provDw);
  providers.push(provG1);
  providers.push(provUn);
  providers.push(provElpais);
  providers.push(provLemonde);
  providers.push(provCarta);

  initialized = true;
}

module.exports.getProviders = getProviders;
