(function(){
  function rect(x,y,w,h,ctx){
    ctx.fillRect(x-(w/2),y-(h/2),w,h);
  }
  function square(x,y,size,ctx){
    rect(x,y,size,size,ctx);
  }
  function square45(x,y,size,ctx){
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(Math.PI/4);
    square(0,0,size,ctx);
    ctx.restore();
  }

  (function(){
    var canvas=document.querySelector('.Scene-mountains');
    var ctx=canvas.getContext('2d');
    var bounds=canvas.getBoundingClientRect();
    canvas.setAttribute('width',bounds.width);
    canvas.setAttribute('height',bounds.height);
    var middle={
      x:bounds.width/2,
      y:bounds.height/2
    }
    var centerMargin=40;
    var cols=20;
    var gridSize=bounds.width/cols;
    var mountains=[
      [
        {p:-4,s:3},
        {p:-6,s:2},
        {p:-7,s:1},
        {p:-8,s:2},
        {p:-10,s:4},
        {p:4,s:3},
        {p:6,s:2},
        {p:7,s:1},
        {p:8,s:2},
        {p:13,s:4},
      ],
      [
        {p:-3,s:2},
        {p:1,s:1},
        {p:4,s:1},
        {p:5,s:2},
      ],
      [
        {p:-2,s:1},
        {p:1,s:1},
        {p:4,s:1},
        {p:5,s:2},
      ]
    ]

    function drawLayer(layer,scale){
      var grid=gridSize/scale;
      for(var i=0;i<layer.length;i++){
        var m=layer[i];
        var w=m.s*grid;
        var s=Math.sqrt((w*w)/2);
        square45(
          middle.x+(m.p*grid),
          middle.y,
          s,
          ctx
        );
      }
    }

    ctx.fillStyle='green';
    drawLayer(mountains[2],1);
    ctx.fillStyle='blue';
    drawLayer(mountains[1],1);
    ctx.fillStyle='black';
    drawLayer(mountains[0],1);


  }());
}());
