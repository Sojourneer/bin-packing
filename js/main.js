/******************************************************************************

 This is a demo page to experiment with binary tree based
 algorithms for packing blocks into a single 2 dimensional bin.

 See individual .js files for descriptions of each algorithm:

  * packer.js         - simple algorithm for a fixed width/height bin
  * packer.growing.js - complex algorithm that grows automatically

 TODO
 ====
  * step by step animated render to watch packing in action (and help debug)
  * optimization - mark branches as "full" to avoid walking them
  * optimization - dont bother with nodes that are less than some threshold w/h (2? 5?)

*******************************************************************************/

Demo = {

  init: function(block_data) {
    Demo.el = {
      examples: $('#examples'),
      blocks:   $('#blocks'),
      canvases: $('#canvases'),
      canvas:   $('.canvas')[0],
      size:     $('#size'),
      panels:   $('#panels'),
      sort:     $('#sort'),
      color:    $('#color'),
      ratio:    $('#ratio'),
      nofit:    $('#nofit')
    };
    console.log("canvases",Demo.el.canvases.html());
    
    for(tag in block_data) {
        var block = block_data[tag]
        if($.isArray(block)) Demo.blocks.examples[tag] = block;
        Demo.el.examples.append($('<option>', {value: tag, text:tag}));
    }   

    if (!Demo.el.canvas.getContext) // no support for canvas
      return false;

//    Demo.el.draw = Demo.el.canvas.getContext("2d");
//Demo.el.draw.scale(3.0,3.0);
    Demo.el.blocks.val(Demo.blocks.serialize(Demo.blocks.examples.current()));
    Demo.el.blocks.change(Demo.run);
    Demo.el.size.change(Demo.run);
    Demo.el.panels.change(Demo.run);
    Demo.el.sort.change(Demo.run);
    Demo.el.color.change(Demo.run);
    Demo.el.examples.change(Demo.blocks.examples.change);
    Demo.run();

    Demo.el.blocks.keypress(function(ev) {
      if (ev.which == 13)
        Demo.run(); // run on <enter> while entering block information
    });
  },

  //---------------------------------------------------------------------------

  run: function() {
    nPanels = parseInt(Demo.el.panels.val());
    console.log("run()", nPanels);
    
    var blocks = Demo.blocks.deserialize(Demo.el.blocks.val());
    var packer = Demo.packer();

    Demo.sort.now(blocks);

    packer.fit(blocks);
    console.log(blocks);
    
    //console.log("run: starting canvas population",Demo.el.canvases.html());
    
    //console.log(Demo.el.canvases.html());
    Demo.el.canvases.empty();
    //console.log("run: emptied canvas population",Demo.el.canvases.html());

    //console.log(Demo.el.canvases.html());
    for(i=0; i < nPanels; ++i)
        Demo.el.canvases.append("<canvas class='canvas'>");
    //console.log("run: completed canvas population",Demo.el.canvases.html());

    canvases = $("canvas", Demo.el.canvases);
    //console.log("# of canvas elements",canvases.length);
    
    for(i=0; i < canvases.length; ++i) {
        Demo.el.canvas = canvases[i];
        console.log("nth canvas(",i,Demo.el.canvas.outerHTML);
        
        Demo.el.draw = Demo.el.canvas.getContext("2d");
        Demo.canvas.reset(packer.root.w, packer.root.h);
        Demo.canvas.blocks(blocks, i+1);
        Demo.canvas.boundary(packer.root);
        //console.log(")nth canvas",i,Demo.el.canvas.outerHTML);

        Demo.report(blocks, packer.root.w, packer.root.h);
    }
  },

  //---------------------------------------------------------------------------

  packer: function() {
    var size = Demo.el.size.val();
    if (size == 'automatic') {
      return new GrowingPacker();
    }
    else {
      var dims = size.split("x");
      return new Packer(parseInt(dims[0]), parseInt(dims[1]), Demo.el.panels.val());
    }
  },

  //---------------------------------------------------------------------------

  report: function(blocks, w, h) {
    var fit = 0, nofit = [], block, n, len = blocks.length;
    for (n = 0 ; n < len ; n++) {
      block = blocks[n];
      if (block.fit)
        fit = fit + block.area;
      else
        nofit.push("" + block.w + "x" + block.h);
    }
    Demo.el.ratio.text(Math.round(100 * fit / (w * h)));
    Demo.el.nofit.html("Did not fit (" + nofit.length + ") :<br>" + nofit.join(", ")).toggle(nofit.length > 0);
  },

  //---------------------------------------------------------------------------

  sort: {

    random  : function (a,b) { return Math.random() - 0.5; },
    w       : function (a,b) { return b.w - a.w; },
    h       : function (a,b) { return b.h - a.h; },
    a       : function (a,b) { return b.area - a.area; },
    max     : function (a,b) { return Math.max(b.w, b.h) - Math.max(a.w, a.h); },
    min     : function (a,b) { return Math.min(b.w, b.h) - Math.min(a.w, a.h); },

    height  : function (a,b) { return Demo.sort.msort(a, b, ['h', 'w']);               },
    width   : function (a,b) { return Demo.sort.msort(a, b, ['w', 'h']);               },
    area    : function (a,b) { return Demo.sort.msort(a, b, ['a', 'h', 'w']);          },
    maxside : function (a,b) { return Demo.sort.msort(a, b, ['max', 'min', 'h', 'w']); },

    msort: function(a, b, criteria) { /* sort by multiple criteria */
      var diff, n;
      for (n = 0 ; n < criteria.length ; n++) {
        diff = Demo.sort[criteria[n]](a,b);
        if (diff != 0)
          return diff;  
      }
      return 0;
    },

    now: function(blocks) {
      var sort = Demo.el.sort.val();
      if (sort != 'none')
        blocks.sort(Demo.sort[sort]);
    }
  },

  //---------------------------------------------------------------------------

  canvas: {

    reset: function(width, height) {
      Demo.el.canvas.width  = Demo.el.canvas.style.width = width  + 1; // add 1 because we draw boundaries offset by 0.5 in order to pixel align and get crisp boundaries
      Demo.el.canvas.height = Demo.el.canvas.style.height = height + 1; // (ditto)
      
      Demo.el.draw.clearRect(0, 0, Demo.el.canvas.width, Demo.el.canvas.height);
    },

    rect:  function(x, y, w, h, color) {
      Demo.el.draw.fillStyle = color;
      Demo.el.draw.fillRect(x + 0.5, y + 0.5, w, h);
    },

    stroke: function(x, y, w, h) {
      Demo.el.draw.strokeRect(x + 0.5, y + 0.5, w, h);
    },
    
    label: function(x, y, w, h, text) {
        Demo.el.draw.fillStyle = "black";
        Demo.el.draw.font = "8px san-serif";
        textWidth = Demo.el.draw.measureText(text).width;
        
        Demo.el.draw.fillText(text, x+w/2-textWidth/2, y+h/2+4);
    },

    blocks: function(blocks, stock) {
      var n, block;
      for (n = 0 ; n < blocks.length ; n++) {
        block = blocks[n];
        color = Demo.color(block.index); // or Demo.color(n), if you want each block different
        if (block.fit && block.fit.stock == stock) {
            if(block.fit.rotated) {
                Demo.canvas.rect(block.fit.x, block.fit.y, block.h, block.w, color);
                Demo.canvas.stroke(block.fit.x, block.fit.y, block.h, block.w, color);
                Demo.canvas.label(block.fit.x, block.fit.y, block.h, block.w, block.id);
            } else {
                Demo.canvas.rect(block.fit.x, block.fit.y, block.w, block.h, color);
                Demo.canvas.stroke(block.fit.x, block.fit.y, block.w, block.h, color);
                Demo.canvas.label(block.fit.x, block.fit.y, block.w, block.h, block.id);
            }
        }
      }
    },
    
    boundary: function(node) {
      if (node) {
        Demo.canvas.stroke(node.x, node.y, node.w, node.h);
        //Demo.canvas.boundary(node.down);
        //Demo.canvas.boundary(node.right);
      }
    }
  },

  //---------------------------------------------------------------------------

  blocks: {

    examples: {
      current: function() {
        return Demo.blocks.examples[Demo.el.examples.val()];
      },

      change: function() {
        Demo.el.blocks.val(Demo.blocks.serialize(Demo.blocks.examples.current()));
        Demo.run();
      }
    },

    deserialize: function(val) {
      // WxHxN
      var i, j, block, blocks = val.split("\n"), result = [];
      for(i = 0 ; i < blocks.length ; i++) {
        block = blocks[i].split("x");
        if (block.length >= 2) // well-formed
          result.push({
                id:blocks[i],
                w: parseInt(block[0]),
                h: parseInt(block[1]),
                num: (block.length == 2 ? 1 : parseInt(block[2]))
          });
      }
      var expanded = [];
      for(i = 0 ; i < result.length ; i++) {
        item = result[i];
        for(j = 0 ; j < item.num ; j++)
          expanded.push(
                {   index: i,
                    id:(item.num == 1 ? item.id : item.id + "(" + (j+1) + ")"),
                    w: item.w,
                    h: item.h,
                    area: item.w * item.h
                }
          );
      }
      return expanded;
    },

    serialize: function(blocks) {
      var i, block, str = "";
      for(i = 0; i < blocks.length ; i++) {
        block = blocks[i];
        str = str + block.w + "x" + block.h + (block.num > 1 ? "x" + block.num : "") + "\n";
        //str = str + (block.num > 1 ? block.num +" @ " : "") + block.w + "x" + block.h + "\n";
      }
      return str;
    }

  },
  
  //---------------------------------------------------------------------------

  colors: {
    pastel:         [ "#FFF7A5", "#FFA5E0", "#A5B3FF", "#BFFFA5", "#FFCBA5" ],
    basic:          [ "silver", "gray", "red", "maroon", "yellow", "olive", "lime", "green", "aqua", "teal", "blue", "navy", "fuchsia", "purple" ],
    gray:           [ "#111", "#222", "#333", "#444", "#555", "#666", "#777", "#888", "#999", "#AAA", "#BBB", "#CCC", "#DDD", "#EEE" ],
    vintage:        [ "#EFD279", "#95CBE9", "#024769", "#AFD775", "#2C5700", "#DE9D7F", "#7F9DDE", "#00572C", "#75D7AF", "#694702", "#E9CB95", "#79D2EF" ],
    solarized:      [ "#b58900", "#cb4b16", "#dc322f", "#d33682", "#6c71c4", "#268bd2", "#2aa198", "#859900" ],
    none:           [ "transparent" ]
  },

  color: function(n) {
    var cols = Demo.colors[Demo.el.color.val()];
    return cols[n % cols.length];
  }

  //---------------------------------------------------------------------------

}

$(document).ready(function() {
  Demo.init(block_data);
});

