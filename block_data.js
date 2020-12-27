data = {
    kerf: 0.2,
    blocksets: {
      s10060_roofless: {label:"100x60 no Roof", blocks:[
        { w: 100, h: 60, num:  1 },
        { w: 100, h: 15, num:  2 },
        { w:  60, h: 15, num:  2 }
      ]},

      s10060_roofF: {label:"100x60 Slant root", blocks:[
        { w: 100, h: 60, num:  1 },
        { w: 100, h: 15, num:  2 },
        { w:  60, h: 15, num:  2 },

        { w: 130, h: 43, num:  1 }   
      ]},

      s10060_roofA: {label:"100x60 A roof", blocks:[
        { w: 100, h: 60, num:  1 },
        { w: 100, h: 15, num:  2 },
        { w:  60, h: 15, num:  2 },

        { w: 110, h: 30, num:  2 } 
      ]},

      s12080_roofless: {label:"120x80 no roof", blocks:[
        { w: 120, h: 80, num:  1 },
        { w: 120, h: 15, num:  2 },
        { w:  80, h: 15, num:  2 }
      ]},

      s12080_roofF: {label:"120x80 Slant roof", blocks:[
        { w: 120, h: 80, num:  1 },
        { w: 120, h: 15, num:  2 },
        { w:  80, h: 15, num:  2 },
        
        { w: 120+30, h: 43, num:  1}    
      ]},

      s12080_roofA: {label:"120x80 A Roof", blocks:[
        { w: 120, h: 80, num:  1 },
        { w: 120, h: 15, num:  2 },
        { w:  80, h: 15, num:  2 },
        
        { w: 120+30, h: 30, num:  2}    
      ]}
    }
};
