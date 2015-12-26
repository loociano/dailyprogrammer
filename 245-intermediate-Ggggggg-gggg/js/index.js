'use strict';
var fs = require('fs');

/* Examples:
   @param input: [{symbol: 'a', w: 0.8}, {symbol: 'b', w: 0.2}]
   @param symbols: ['0', '1'] 
   @return {'a': 0, 'b': 1}
   */
function huffman(input, symbols){

  var results = {};

  while(input.length > 1){
    
    var node1 = input.pop();
    var node2 = input.pop();

    var node = {
      w: node1.w + node2.w
    };
    node[symbols[1]] = node1;
    node[symbols[0]] = node2;

    input.push(node);
  }

  var queue = [];
  queue.push(input.pop());

  while (queue.length > 0){
    var n = queue.shift();
    var carry = n.code || '';
    
    symbols.forEach(function(bit){
      if (n[bit] != null){
        n[bit].code = carry + bit;
        queue.push(n[bit]);
      } else {
        results[n.symbol] = n.code;
      }
    });

  }
  //console.log(results);
  return results;
}

function load(filename){
  return fs.readFileSync(filename, 'utf8');
}

function getMessageWithKey(data){
  
  var input = data.split('\r\n');
  var key = input.splice(0, 1)[0].split(' ');

  var map = {};
  for(var i = 0; i < key.length; i+=2){
    map[key[i+1]] = key[i];
  }

  // Get symbols from keys
  var symbols = Object.keys(map).join('').split('').filter(function(value,i,array){
    return i == array.indexOf(value); // Discard duplicates
  });

  return {
    symbols: symbols,
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
  return output.join('');
}

function genKey(message, symbols){

  var letters = {};
  var count = 0;

  // Get letters and occurrences
  for(var i = 0; i < message.length; i++){
    var letter = message[i];
    if (!/[a-zA-Z]/.test(letter)) continue;
    if (!letters[letter]) letters[letter] = 0;
    letters[letter]++;
    count++; 
  }

  // hashmap to ordered array
  var ordered = [];
  for(var l in letters){
    ordered.push({symbol: l, w: letters[l]});
  }

  ordered.sort(function(a,b){
    return a.w - b.w;
  });

  return huffman(ordered, symbols);
}

function encode(message, symbols){

  var result = [];
  var keymap = genKey(message, symbols);

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
console.log(encoded);

console.log();

var encodeChallenge = getMessageWithKey(encoded);
console.log(challenge === decode(encodeChallenge.key, encodeChallenge.message, encodeChallenge.symbols));