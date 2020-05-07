const stemmer = require('./stemmer');

function getTokens(text){
  let tokens = text.split(' ');
  
  for(let i = 0; i < words.length; i++){
    tokens[i] = stemmer.getStem(tokens[i]);
  }

  return tokens;
}

module.exports.getTokens = getTokens;
