// 2020/12/25 DJH: Modified to support rotating the blocks 90 degrees to fit
/******************************************************************************

This is a very simple binary tree based bin packing algorithm that is initialized
with a fixed width and height and will fit each block into the first node where
it fits and then split that node into 2 parts (down and right) to track the
remaining whitespace.

Best results occur when the input blocks are sorted by height, or even better
when sorted by max(width,height).

Inputs:
------

  w:       width of target rectangle
  h:      height of target rectangle
  blocks: array of any objects that have .w and .h attributes

Outputs:
-------

  marks each block that fits with a .fit attribute pointing to a
  node with .x and .y coordinates

Example:
-------

  var blocks = [
    { w: 100, h: 100 },
    { w: 100, h: 100 },
    { w:  80, h:  80 },
    { w:  80, h:  80 },
    etc
    etc
  ];

  var packer = new Packer(500, 500);
  packer.fit(blocks);

  for(var n = 0 ; n < blocks.length ; n++) {
    var block = blocks[n];
    if (block.fit) {
      Draw(block.fit.x, block.fit.y, block.w, block.h);
    }
  }


******************************************************************************/

Packer = function(w, h, n) {
  console.log(n);
  this.init(w, h, n);
};

Packer.prototype = {

  init: function(w, h, n) {
      if(n == 1) {
        this.root = { x: 0, y: 0, w: w, h: h, stock:1 };
      } else {
        var p1 = { x: 0, y: 0, w: w, h: h, stock:1 };
        var p2 = { x: 0, y: 0, w: w, h: h, stock:2 };
        this.root = {
            x: 0, y: 0, w: w, h: h,
            used: true,
            right: p1,
            down: p2
        }
      }
  },

  fit: function(blocks) {
    var n, node, block;
    for (n = 0; n < blocks.length; n++) {
      block = blocks[n];
        if (result = this.findNode(this.root, block.w, block.h)) {
            console.log("fit",result);
            if(result.rotated)
                block.fit = this.splitNode(result.node, block.h, block.w);
            else
                block.fit = this.splitNode(result.node, block.w, block.h);
            block.fit.rotated = result.rotated;
            
        }
    }
  },

  findNode: function(root, w, h) {
    if (root.used)
      return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
    else if ((w <= root.w) && (h <= root.h))
      return {node:root,rotated:false};
    // try rotated
    else if ((h <= root.w) && (w <= root.h))
      return {node:root,rotated:true};
    else
      return null;
  },

  splitNode: function(node, w, h) {
    node.used = true;
    node.down  = { x: node.x,     y: node.y + h, w: node.w,     h: node.h - h, stock: node.stock };
    node.right = { x: node.x + w, y: node.y,     w: node.w - w, h: h         , stock: node.stock };
    return node;
  }

}

