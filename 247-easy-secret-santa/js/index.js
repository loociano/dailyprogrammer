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

var input = 'Sean\nWinnie\nBrian Amy\nSamir\nJoe Bethany\nBruno Anna Matthew Lucas\nGabriel Martha Philip\nAndre\nDanielle\nLeo Cinthia\nPaula\nMary Jane\nAnderson\nPriscilla\nRegis Julianna Arthur\nMark Marina\nAlex Andrea';
console.log(secretSanta(input));