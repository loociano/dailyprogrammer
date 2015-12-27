'use strict';

function huffman(input, symbols){

  var array = [];
  var probSum = 0;
  for(var i in input){
    array.push({symbol: i, w: input[i]});
    probSum += input[i];
  }

  if (probSum !== 1) return input;

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
  queue.push(array.pop());

  while (queue.length > 0){
    var n = queue.shift();
    var carry = n.code || '';
    
    symbols.forEach(function(bit){
      if (n[bit] != null){
        n[bit].code = carry + bit;
        queue.push(n[bit]);
      } else {
        input[n.symbol] = n.code;
      }
    });

  }
  return input;
}

var input = {
  'a': 0.25,
  'b': 0.25,
  'c': 0.2,
  'd': 0.15,
  'e': 0.10,
  'f': 0.025,
  'g': 0.025
};

console.log(huffman(input, ['0', '1']));

