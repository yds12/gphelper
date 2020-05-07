const stemmer = require('./stemmer');
const util = require('./util');

let blacklist = [];

function initialize(config){
  try{
    util.readLines(config.blacklistFile, (line) => {
      let word = line.trim().toLowerCase();
      blacklist.push(word);
    }, () => {});
  } catch(err){
    console.log('Could not read blacklist file.');
  }
}

function isNumber(word){
  return !isNaN(+word);
}

function isBlacklisted(word){
  return blacklist.findIndex(w => w === word) >= 0;
}

function removePunctuation(word){
//  word = word.replace(/(^\-|\-$)/g, ''); // remove leading/trailing dashes
  return word.replace(
    /[~`!@#$%^&\*\(\)\{\}\[\];:"\'<,\.>\?\/\\\|_\+=]/g, '');
}

function replaceSpecialChars(word){
  return word;
}

function getTokens(text){
  let tokens = [];
  let words = text.match(/\S+/g); // matches non-whitespace sequences

  for(let word of words){
    word = word.trim();
    if(!word) continue;

    word = removePunctuation(word);

    if(isNumber(word)){
      tokens.push('_NUM_');
      continue;
    }

    word = word.toLowerCase();
    if(isBlacklisted(word)) continue;

    word = stemmer.getStem(word);
    word = replaceSpecialChars(word);

    tokens.push(word);
  }

  return tokens;
}

module.exports.initialize = initialize;
module.exports.getTokens = getTokens;
