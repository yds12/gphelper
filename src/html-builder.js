const path = require('path');
const fetcher = require('./fetcher');
const extractor = require('./extractor');
const util = require('./util');

async function buildTemplate(template){
  let data = await extractor.extract();

  if(template === 'index'){
    let fileContent = 
      await util.getFile(`html-template/${template}.html`);

    let list = '<ul id="items">';
    for(let item of data){
      list += `<li data-id="${item.id}">`;
      list += `<span class="source">${item.source}</span>`;
      list += `<a href="${item.link}">`;
      list += `<span class="title">${item.title}</span></a></li>`;
    }
    list += '</ul>';

    return fileContent.replace('$$LINKS$$', list);
  }
  return '';
}

module.exports.template = buildTemplate;
