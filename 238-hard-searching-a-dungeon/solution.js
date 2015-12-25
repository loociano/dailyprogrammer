var input = 
[[
'##########',
'#S###    #',
'#   # ####',
'### # #D##',
'# # # # ##',
'#D# ### ##',
'###     ##',
'### ### ##',
'###     ##',
'##########'
],[
'##########',
'#   #   D#',
'#     ####',
'###   # ##',
'#U#   # ##',
'# #    D##',
'##########',
'#       ##',
'#D# # # ##',
'##########'
],[
'##########',
'#        #',
'# ########',
'# #U     #',
'# #      #',
'# ####   #',
'#    #####',
'#### ##U##',
'# D#    ##',
'##########'
],[
'##########',
'#        #',
'# ###### #',
'# #    # #',
'# # ## # #',
'# #  #   #',
'# ## # # #',
'# ##   # #',
'#  #####G#',
'##########'
]];

(function(input){

'use strict';

var start = 'S';
var wall = '#';
var breadcrumb = '*';
var goal = 'G';
var up = 'U';
var down = 'D';

var Node = function(tile, pos){
  this.tile = tile;
  this.pos = pos;
  this.parent = null;
  this.visited = false;
};

var getStartPos = function(map){

    var floors = map.length;

    for(var z = 0; z < floors; z++){
      var floor = map[z];
      for (var y = 0; y < floor.length; y++){
        var row = floor[y];
        for (var x = 0; x < row.length; x++){
          if (row.charAt(x) === start){
            return { x: x, y: y, z: z};
          }
        }
      }
    }
    throw Error('Start was not found');
};

var bfs = function(map){
  
  var queue = [];
  var node = new Node(start, getStartPos(map));
  queue.push(node);

  while (queue.length > 0){
    node = queue.shift();
    node.visited = true;

    if (node.tile === goal){
      paintPath(map, node.parent);
      return;
    } else if (node.tile === up || node.tile === down){
      move(queue, map, node, node.tile);
    } else {
      ['N', 'E', 'S', 'W'].forEach(function(dir){
        move(queue, map, node, dir);
      });
    }
  }
  throw Error('Goal was not found');
};

var move = function(queue, map, node, dir){

  var next = getAdjacentNode(map, node, dir);

  if (canMove(next)){
      next.parent = node;
      queue.push(next);
  }
}

var canMove = function(node){
  return node && !node.visited && node.tile !== wall;
}

var getTileAt = function(map, pos){
  try {
    return map[pos.z][pos.y].charAt(pos.x);
  } catch(e){
    return null;
  }
};

var getAdjacentNode = function(map, node, dir){
  
  var nextPos = {x: node.pos.x, y: node.pos.y, z: node.pos.z};

  switch(dir){
    case 'N':
      nextPos.y--; break;

    case 'W':
      nextPos.x--; break;

    case 'E':
      nextPos.x++; break;

    case 'S':
      nextPos.y++; break;

    case 'U':
      nextPos.z--; break;

    case 'D':
      nextPos.z++; break;
  }

  if (repeated(node, nextPos)){
    return null;
  }

  var tile = getTileAt(map, nextPos);
  if (tile){
    return new Node(tile, nextPos);
  } else {
    return null;
  }
};

var repeated = function(node, nextPos){
  var curr = node;
  while(curr.parent !== null){
    if (equalPos(curr.pos, nextPos)){
      return true;
    }
    curr = curr.parent;
  }
  return false;
}

var equalPos = function(pos1, pos2){
  return pos1.x === pos2.x 
    && pos1.y === pos2.y 
    && pos1.z === pos2.z;
}

var printMap = function(map){
  for(var z = 0; z < map.length; z++){
    var floor = map[z];
    for (var y = 0; y < floor.length; y++){
      console.log(floor[y]);
    }
    console.log('\n');
  }
};

var paintPath = function(map, node){
  var curr = node;
  while(curr.parent !== null){
    if (curr.tile !== up && curr.tile !== down){
      paintTileAt(map, curr.pos);
    }
    curr = curr.parent;
  }
};

var paintTileAt = function(map, pos){
  var row = map[pos.z][pos.y];
  map[pos.z][pos.y] = row.substr(0, pos.x) + breadcrumb + row.substr(pos.x+1);
};

printMap(input);
bfs(input);
printMap(input);

})(input);