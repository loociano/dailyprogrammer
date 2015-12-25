var input = 929;

(function(input){

  var Node = function(n, op, sum){
    this.n = n;
    this.op = op || 0;
    this.sum = (sum || 0) + this.op;
    this.children = [];
    this.parent = null;
  }

  var recursiveTree = function(root){

    var n = root.n;

    if (n > 1 || n < -1){

      if (n % 3 === 0){
        divide(root, n, 0);
      
      } else {
        
        [-2, -1, 1, 2].forEach(function(op){

          var m = n + op;

          if ( m % 3 === 0 ){
            divide(root, m, op);
          }

        });
      }
    } else if (root.sum === 0){
        throw root;
    }

  };

  var divide = function(root, n, op){
    n /= 3;
    var node = new Node(n, op, root.sum);
    node.parent = root;
    root.children.push(node);
    recursiveTree(node);
  }

  var backtrack = function(node){

    var lines = [];

    while (node !== null) {
      lines.push({n: node.n, op: node.op});
      node = node.parent;
    }

    for(var i = lines.length - 1; i > 0; --i){
      console.log(lines[i].n + ' ' + lines[i-1].op);
    }
    console.log('1');
    
  };

  try {
    recursiveTree(new Node(input));
    console.log('Impossible');
  } catch(solution){
    backtrack(solution);
  }

})(input);

