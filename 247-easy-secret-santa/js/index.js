function secretSanta(input){
  
  var from = input.split('\n');
  var to = [];
  var result = [];

  for (var i = 0; i < from.length; i++){
    to.push(from[i].split(' '));
    from[i] = from[i].split(' ');
  }
  
  for (var i = 0; i < from.length; i++){

    var group = from[i];
    for (var j = 0; j < group.length; j++){

      var index = i + 1;
      var target = undefined;
      while (!target){
        if (index === i) index++;
        if (index === from.length) index = 0;
        target = to[index].pop();
        index++;
      }
      result.push(group[j] + ' -> ' + target);
    }

  }
  return result.join('\n');
}

function check(input, output){
  var map = {};
  var families = input.split('\n');
  var assig = output.split('\n');
  for (var i = 0; i < assig.length; i++){
    var pair = assig[i].split(' -> ');
    map[pair[0]] = pair[1];
    
    if (map[pair[1]] === pair[0]){
      return false;
    }

    for(var j = 0; j < families.length; j++){
      var members = families[j].split(' ');
      if (members.indexOf(pair[0]) > -1 && members.indexOf(pair[1]) > -1){
        return false;
      }
    }
  }
  return true;
}

var input = 'Sean\nWinnie\nBrian Amy\nSamir\nJoe Bethany\nBruno Anna Matthew Lucas\nGabriel Martha Philip\nAndre\nDanielle\nLeo Cinthia\nPaula\nMary Jane\nAnderson\nPriscilla\nRegis Julianna Arthur\nMark Marina\nAlex Andrea';
var output = secretSanta(input); 
console.log(output);
console.log(check(input, output));