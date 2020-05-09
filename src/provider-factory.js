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


  // Set providers' assembleItems method
  provAfp.assembleItems = (ch, partialUrl) => {
    items = [];

    ch('h3 a').each((i,e) => {
      items.push({ 
        title: ch(e).text(),
        link: partialUrl + ch(e).attr('href')
      });
    });
    return items;
  };

  provReuters.assembleItems = (ch, partialUrl) => {
    items = [];

    ch('h4 a').each((i,e) => {
      items.push({ 
        title: ch(e).text(),
        link: partialUrl + ch(e).attr('href')
      });
    });
    ch('h5 a').each((i,e) => {
      items.push({ 
        title: ch(e).text(),
        link: partialUrl + ch(e).attr('href')
      });
    });
    ch('div.headlineMed a').each((i,e) => {
      if(ch(e).siblings().length > 0){
        items.push({ 
          title: ch(e).text(),
          link: partialUrl + ch(e).attr('href')
        });
      }
    });
    return items;
  };
 
  provUol.assembleItems = (ch, partialUrl) => {
    items = [];

    ch('div.results-items').children().each((i,e) => {
      let aEl = ch(e).find('a').first();
      let h3 = ch(e).find('h3').first();

      items.push({ 
        title: h3.text(),
        link: aEl.attr('href')
      });
    });
    return items;
  };
 
  provDw.assembleItems = (ch, partialUrl) => {
    items = [];

    ch('div.news, div.linkList').each((i,e) => {
      let aEl = ch(e).find('a');
      let h2 = ch(e).find('h2');
      items.push({ 
        title: h2.text(),
        link: partialUrl + aEl.attr('href')
      });
    });
    return items;
  };
 
  provG1.assembleItems = (ch, partialUrl) => {
    items = [];

    ch('div._xn div.bastian-feed-item a.feed-post-link').each((i,e) => {
      items.push({ 
        title: ch(e).text(),
        link: ch(e).attr('href')
      });
    });
    return items;
  };
 
  provUn.assembleItems = (ch, partialUrl) => {
    items = [];

    ch('h1.story-title').each((i,e) => {
      let aEl = ch(e).find('a');
      items.push({ 
        title: aEl.text(),
        link: partialUrl + aEl.attr('href')
      });
    });
    return items;
  };
 
  provEm.assembleItems = (ch, partialUrl) => {
    items = [];

    ch('div.news-box h4 a').each((i,e) => {
      items.push({ 
        title: ch(e).text(),
        link: ch(e).attr('href')
      });
    });
    return items;
  };
 
  provElpais.assembleItems = (ch, partialUrl) => {
    items = [];

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
 
  provLemonde.assembleItems = (ch, partialUrl) => {
    items = [];

    ch('div.card-featured-black').each((i,e) => {
      let aEl = ch(e).find('a');
      let h = ch(e).find('h2');
      items.push({ 
        title: h.text(),
        link: aEl.attr('href')
      });
    });
    
    ch('div.card-clean').each((i,e) => {
      let aEl = ch(e).find('a');
      let h = ch(e).find('h4');
      items.push({ 
        title: h.text(),
        link: aEl.attr('href')
      });
    });
    return items;
  };
 
  provCarta.assembleItems = (ch, partialUrl) => {
    items = [];

    ch('#nav-menu-item-45572 * a.eltdf-pt-link').each((i,e) => {
      items.push({ 
        title: ch(e).text(),
        link: ch(e).attr('href')
      });
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
