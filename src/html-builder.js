const fs = require('fs').promises;
const path = require('path');
const fetcher = require('./fetcher');

async function buildTemplate(template, url){
  let source = await fetcher.fetch(url);
  let data = [{title: 'noticia 1'}, {title: 'noticia 2'}];

  if(template === 'index'){
    let fileContent = await getFile(`html-template/${template}.html`);
    let list = '<ul>';
    for(let item of data){
      list += `<li>${item.title}</li>`;
    }
    list += '</ul>';

    return fileContent.replace('$$LINKS$$', list);
  }
  return '';
}

async function getFile(filename){
  let data = await fs.readFile(path.join(__dirname, filename));
  return data.toString();
}

module.exports.template = buildTemplate;
