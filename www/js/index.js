const good = [];
const bad = [];

function highlightKeywords(){
  $('ul#items li span.title').each((i, e) => {
    let elementText = $(e).text();

    for(let kw of CONFIG.keywords){ // from js/config.js
      const re = new RegExp('\\b' + kw + '\\b', 'ig');
      elementText = elementText.replace(re,
        `<mark class="keyword">${kw}</mark>`);
    }
    $(e).html(elementText);
  });
}

function setGoodBadIds(e){
  let arr, checked, id;

  switch(e.target.className){
    case 'bad': arr = bad;
      break;
    case 'good': arr = good;
      break;
    default: return;
  }

  checked = e.target.checked;
  id = e.target.parentElement.getAttribute('data-id');

  if(checked){
    arr.push(id);
  } else{
    let idx = arr.findIndex(el => el === id);

    if(idx === -1) return;
    arr.splice(idx, 1);
  }
}

function submitForm(e){
  e.preventDefault();
  let req = new XMLHttpRequest();
  req.open('POST', '', true);
  req.setRequestHeader('Content-Type', 'application/json');
  let content = JSON.stringify({ good: good, bad: bad })
  console.log('Sending: ', content);
  req.send(content);
  req.onloadend = (res) => {
    console.log(res);
    console.log('Request finalized.');
    console.log('Status:', res.target.status);
  }
}

function setHandlers(){
  $('input[type=checkbox]').each((i,e) => {
    $(e).on('change', (evt) => setGoodBadIds(evt));
  });

  document.getElementById('mainform').onsubmit = (e) => submitForm(e);
}

// Execute:
setHandlers();
highlightKeywords();
