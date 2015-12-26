'use strict';

var fs = require('fs');

/* @return hashmap */  
function getWords(filename){  
  
  var hashmap = {};
  var words = fs.readFileSync(filename, 'utf8').split('\r\n');
  
  for(var i = 0; i < words.length; i++){
    var word = words[i];
    if (hashmap[word] === undefined){
      hashmap[word] = true;
    }
  }
  
  return hashmap;
}

function search(wordMap, searchArray){

  var results = [];

  for (var i = 0; i < searchArray.length; i++){
    var word = searchArray[i];
    if (wordMap[word.toLowerCase()] !== undefined){
      results.push(word);
    }
  }
  return results;
}

function Node(data){
  this.data = data;
  this.children = [];
}

Node.prototype.append = function(data){
  var node = new Node(data);
  this.children.push(node);
  return node;
};

function numberToChar(number){
  return String.fromCharCode(number + 64);
}

function solve(input, start, root, output){

  if (start === input.length){
    output.push(root.data); // leaf
    return;
  }

  var current = parseInt(input[start]);

  if (start === input.length - 1){
    if (current > 0 && current < 10){
      var node = root.append(root.data + numberToChar(current));
      output.push(node.data);
    }
    return;
  }

  var next = parseInt(input[start+1]);

  if (current > 0 && current < 10 && next !== 0){
    var node = root.append(root.data + numberToChar(current));
    solve(input, start + 1, node, output);
  }

  var currentAndNext = parseInt(input[start] + input[start + 1]);
  if (currentAndNext > 0 && currentAndNext < 27){
    var node = root.append(root.data + numberToChar(currentAndNext));
    solve(input, start + 2, node, output);
  }
  
}

var wordMap = getWords('../../resources/enable1.txt');
process.stdin.setEncoding('utf8');
console.log('Type a number: ');

process.stdin.on('data', function (input) {
  var time = process.hrtime();
  
  console.log('');
  var output = [];
  solve(input.trim(), 0, new Node(''), output);

  console.log(output.length + ' combinations');

  var dictWords = search(wordMap, output);

  if (dictWords.length > 0){

    console.log('Dictionary Words: ');
  
    dictWords.forEach(function(i){
      console.log(i);
    });
  }
  
  var diff = process.hrtime(time);
  console.log('Total: %d milliseconds', (diff[0] * 1e9 + diff[1])/ 1e6);
  process.exit();
});

