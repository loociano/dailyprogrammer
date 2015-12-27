'use strict';
var fs = require('fs');

function load(filename){
  return fs.readFileSync(filename, 'utf8').split('\r\n');
}

function dateformat(lines){

  for(var l = 0; l < lines.length; l++){
    var tokens = lines[l].split(lines[l].replace(/\d/g, '')[0]);

    for(var t = 0; t < tokens.length; t++){
      if (tokens[t].length < 2) tokens[t] = '0' + tokens[t];
    }

    if (tokens[0].length > 2){
      lines[l] = tokens.join('-'); // Y M D
    } else {
      if (tokens[2].length < 4){
        tokens[2] = '20' + tokens[2];
      }
      lines[l] = tokens[2] + '-' + tokens[0] + '-' + tokens[1]; // M D Y
    }
  }

  return lines.join('\r\n');
}

console.log(dateformat(load('../input.txt')));