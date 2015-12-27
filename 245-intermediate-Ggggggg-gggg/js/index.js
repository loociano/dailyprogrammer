'use strict';
var fs = require('fs');

function huffman(input, symbols){

  var array = [];
  for(var i in input){
    array.push({symbol: i, w: input[i]});
  }

  while(array.length > 1){
    
    array.sort(function(a, b){
      return b.w - a.w;
    });

    var node1 = array.pop();
    var node2 = array.pop();

    var node = { w: node1.w + node2.w };
    node[symbols[1]] = node1;
    node[symbols[0]] = node2;

    array.push(node);
  }

  var queue = [];
  if (array.length > 0) queue.push(array.pop());

  while (queue.length > 0){
    var n = queue.shift();
    var carry = n.code || '';
    
    symbols.forEach(function(bit){
      if (n[bit] != null){
        n[bit].code = carry + bit;
        queue.push(n[bit]);
      } else {
        input[n.symbol] = n.code || symbols[0];
      }
    });

  }
  return input;
}

function load(filename){
  return fs.readFileSync(filename, 'utf8');
}

function removeDups(array){
  return array.join('').split('').filter(function(value, i, array){
    return i == array.indexOf(value);
  });
}

function getMessageWithKey(data){
  
  var input = data.split('\r\n');
  var key = input.splice(0, 1)[0].split(' ');

  var map = {};
  if (key.length > 1){
    for(var i = 0; i < key.length; i+=2){
      map[key[i+1]] = key[i];
    }
  }

  return {
    symbols: removeDups(Object.keys(map)),
    key: map, 
    message: input.join('\r\n')
  };
}

function decode(key, message, symbols){
  
  var output = [];
  var cursor = 0;
  var buffer = message[cursor];

  while(cursor < message.length){
    
    if (key[buffer] !== undefined){
      output.push(key[buffer]);
      buffer = '';
    }

    var next = message[++cursor];
    if (symbols.indexOf(next) > -1){
      buffer += next;
    } else {
      output.push(next);
    }
  }
  return output.join('') || message;
}

function genKeyMap(message, symbols){

  var letters = {};

  // Count letter repetition
  for(var i = 0; i < message.length; i++){
    var letter = message[i];
    if (!/[a-zA-Z]/.test(letter)) continue;
    if (!letters[letter]) letters[letter] = 0;
    letters[letter]++;
  }

  return huffman(letters, symbols);
}

function encode(message, symbols){

  var result = [];
  var keymap = genKeyMap(message, symbols);

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

/********************************************************/

var input1 = getMessageWithKey(load('../input1.txt'));
console.log(decode(input1.key, input1.message, input1.symbols));

console.log();

var input2 = getMessageWithKey(load('../input2.txt'));
console.log(decode(input2.key, input2.message, input2.symbols));

console.log();

var decodeChallenge = getMessageWithKey(load('../decodeChallenge.txt'));
console.log(decode(decodeChallenge.key, decodeChallenge.message, decodeChallenge.symbols));

console.log();

var challenge = load('../encodeChallenge.txt');

var encoded = encode(challenge, ['g', 'G']);
fs.writeFileSync('../encoded.txt', encoded);
console.log(encoded);

console.log();

var encodeChallenge = getMessageWithKey(encoded);
console.log(challenge === decode(encodeChallenge.key, encodeChallenge.message, encodeChallenge.symbols));