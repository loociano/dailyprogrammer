'use strict';

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

function numberToTree(input, start, root){

  if (start === input.length){
    console.log(root.data); // LEAF
    return;
  }

  var current = parseInt(input[start]);

  if (start === input.length - 1){
    if (current > 0 && current < 10){
      var node = root.append(root.data + numberToChar(current));
      console.log(node.data); // LEAF
    }
    return;
  }

  var next = parseInt(input[start+1]);

  if (current > 0 && current < 10 && next !== 0){
    var node = root.append(root.data + numberToChar(current));
    numberToTree(input, start + 1, node);
  }

  var currentAndNext = parseInt(input[start] + input[start+1]);
  if (currentAndNext > 0 && currentAndNext < 27){
    var node = root.append(root.data + numberToChar(currentAndNext));
    numberToTree(input, start + 2, node);
  }
  
}

process.stdin.setEncoding('utf8');
console.log('Type a number: ');

process.stdin.on('data', function (input) {
  var time = process.hrtime();
  
  console.log('');
  numberToTree(input.trim(), 0, new Node(''));
  
  var diff = process.hrtime(time);
  console.log('Total: %d milliseconds', (diff[0] * 1e9 + diff[1])/ 1e6);
  process.exit();
});

