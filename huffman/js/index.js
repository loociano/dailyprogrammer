'use strict';

function huffman(input, symbols){

  var symbols = symbols || ['0', '1'];
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
  return results;
}

var input = [
  {symbol: 'a1', w:0.4}, 
  {symbol: 'a2', w:0.35}, 
  {symbol: 'a3', w:0.2}, 
  {symbol: 'a4', w:0.05}];

console.log(huffman(input));

