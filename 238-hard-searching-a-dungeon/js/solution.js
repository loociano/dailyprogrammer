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
  this.prev = null;
  this.visited = false;
  this.children = [];
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

var searchGoal = function(map){
  
  var queue = [];
  var root = new Node(start, getStartPos(map));
  queue.push(root);
  var node = root;

  while (queue.length > 0){
    node = queue.shift();
    node.visited = true;

    if (node.tile === goal){
      return node;
    } else if (node.tile === up) {
      move(queue, map, root, node, {x: 0, y: 0, z: -1});
    } else if (node.tile === down){
      move(queue, map, root, node, {x: 0, y: 0, z: 1});
    } else {
      [{x: 0, y: -1, z: 0},
       {x: 1, y: 0, z: 0},
       {x: 0, y: 1, z: 0},
       {x: -1, y: 0, z: 0}].forEach(function(dir){
        move(queue, map, root, node, dir);
      });
    }
  }
  throw Error('Goal was not found');
};

var isInTree = function(root, pos){
  
  var curr = root;
  if (equalPos(curr.pos, pos)){
    return true; // found
  } else {
    var result = false;
    curr.children.forEach(function(node){
      if (isInTree(node, pos)){
        result = true;
      }
    });
    return result;
  }
}

var move = function(queue, map, root, node, dir){

  var next = getAdjacentNode(map, root, node, dir);

  if (canMove(next)){
      next.prev = node;
      node.children.push(next);
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

var getAdjacentNode = function(map, root, node, dir){
  
  var nextPos = {
    x: node.pos.x + dir.x, 
    y: node.pos.y + dir.y, 
    z: node.pos.z + dir.z
  };

  if (isInTree(root, nextPos)){
    return null;
  }

  var tile = getTileAt(map, nextPos);
  if (tile){
    return new Node(tile, nextPos);
  } else {
    return null;
  }
};

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
  while(curr.prev !== null){
    if (curr.tile !== goal && curr.tile !== up && curr.tile !== down){
      paintTileAt(map, curr.pos);
    }
    curr = curr.prev;
  }
};

var paintTileAt = function(map, pos){
  var row = map[pos.z][pos.y];
  map[pos.z][pos.y] = row.substr(0, pos.x) + breadcrumb + row.substr(pos.x+1);
};

printMap(input);
paintPath(input, searchGoal(input));
printMap(input);

})(input);