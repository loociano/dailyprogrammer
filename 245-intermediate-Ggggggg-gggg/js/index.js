'use strict';
var fs = require('fs');

function load(filename){
  return fs.readFileSync(filename, 'utf8');
}

function loadEncoded(data){
  
  var input = data.split('\r\n');
  var key = input.splice(0, 1)[0].split(' ');

  var map = {};
  for(var i = 0; i < key.length; i+=2){
    map[key[i+1]] = key[i];
  }

  return {
    key: map, 
    message: input.join('\r\n')
  };
}


function decode(key, message){

  var output = [];
  var cursor = 0;
  var buffer = message[cursor];

  while(cursor < message.length){
    
    if (key[buffer] !== undefined){
      output.push(key[buffer]);
      buffer = '';
    }

    var next = message[++cursor];
    if (/(g|G)/.test(next)){
      buffer += next;
    } else {
      output.push(next);
    }
  }
  return output.join('');
}

function encode(message){

  function genKey(message){

    var letters = [];
    for(var i = 0; i < message.length; i++){
      var letter = message[i];
      if (letters.indexOf(letter) > -1 || !/[a-zA-Z]/.test(letter)) continue;
      letters.push(letter);
    }

    var digits = Math.ceil(Math.log(letters.length) / Math.log(2));
    var keymap = {};

    for (var j = 0; j < letters.length; j++){
      var code = j.toString(2).replace(/0/g, 'g').replace(/1/g, 'G');
      while(code.length < digits){
        code = 'g' + code;
      }
      keymap[letters[j]] = code;
    }
    return keymap;
  }

  var result = [];
  var keymap = genKey(message);

  var firstline = '';
  for (var key in keymap){
    firstline += key + ' ' + keymap[key] + ' ';
  }
  result.push(firstline + '\r\n');

  for (var k = 0; k < message.length; k++){
    var letter = message[k];
    if (keymap[letter]){
      result.push(keymap[letter]);
    } else {
      result.push(letter);
    }
  }
  return result.join('');
}

var input1 = loadEncoded(load('../input1.txt'));
console.log(decode(input1.key, input1.message));

console.log();

var input2 = loadEncoded(load('../input2.txt'));
console.log(decode(input2.key, input2.message));

console.log();

var decodeChallenge = loadEncoded(load('../decodeChallenge.txt'));
console.log(decode(decodeChallenge.key, decodeChallenge.message));

console.log();

var encodeChallenge = loadEncoded(encode(load('../encodeChallenge.txt')));
console.log(decode(encodeChallenge.key, encodeChallenge.message));