(function(){
  var colors={
    whiteish : '#FFEDDB',
    yellow : '#F7F7B6',
    pink : '#E96F92',
    purple : '#75517D',
    blackish : '#1B2947',
    green : '#54fad4',
  }
  var dpi=window.devicePixelRatio;
  function createCanvas(width,height){
    var canvas=document.createElement('canvas');
    setAttribute('width',width*dpi,canvas);
    setAttribute('height',height*dpi,canvas);
    return canvas;
  }
  function drawStar(x,y,size,scale,ctx){
    ctx.save();
    ctx.translate(x,y);
    ctx.scale(scale,scale);
    ctx.rotate(Math.PI/4);
    ctx.fillRect(-size/2,-size/2,size,size);
    ctx.restore();
  }
  function querySelector(selector){
    return document.querySelector(selector);
  }
  function querySelectorAll(selector){
    var nodes=document.querySelectorAll(selector);
    return [].slice.call(nodes);
  }
  function getContext(canvas){
    return canvas.getContext('2d');
  }
  function getBounds(element){
    return element.getBoundingClientRect();
  }
  function setAttribute(attr,value,element){
    element.setAttribute(attr,value);
  }
  function setFillStyle(fill,ctx){
    ctx.fillStyle=fill;
  }
  function random(max){
    return Math.random()*max;
  }
  function smooth(x){
    return x*x*(3 - 2*x);
  }
  function repeat(times,callback){
    for(var i=0;i<times;i++){
      callback(i);
    }
  }
  function forEach(array,callback){
    for(var i=0;i<array.length;i++){
      callback(array[i],i);
    }
  }
  var raf=requestAnimationFrame;
  function sizeToBounds(bounds,dpi,element){
    setAttribute('width',bounds.width*dpi,element);
    setAttribute('height',bounds.height*dpi,element);
  }

  (function(){
    var canvases=querySelectorAll('.Scene-mountains');
    forEach(canvases,function(canvas){
      var bounds=getBounds(canvas);
      sizeToBounds(bounds,dpi,canvas);
      var middle={
        x:bounds.width/2,
        y:bounds.height/2
      }
      var textureMountains=createMountains();
      var createdGL=createGL();

      function createGL(){
        var vertexShader = document.getElementById('vs').textContent;
        var fragmentShader = document.getElementById('fs').textContent;
        var currentProgram;
        var timeLocation;
        var resolutionLocation;
        var buffer;
        var gl;
        var startTime=new Date().getTime();
        var time=0;

        if(!init()) return false;
        animate();

        function init(){
          try {
            gl = canvas.getContext('experimental-webgl',{
              premultipliedAlpha:false
            });
          } catch( error ) { }
          if ( !gl ) {
            return false;
          }
          buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( [ - 1.0, - 1.0, 1.0, - 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0 ] ), gl.STATIC_DRAW );
          currentProgram = createProgram(vertexShader, fragmentShader);
          if(currentProgram==null) return false;
          timeLocation = gl.getUniformLocation(currentProgram, 'time');
          resolutionLocation = gl.getUniformLocation(currentProgram, 'resolution');

          // Create a texture.
          var texture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, texture);
         
          // Set the parameters so we can render any size image.
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          // Upload the image into the texture.
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureMountains);

          return true;
        }

        function createProgram( vertex, fragment ) {
          var program = gl.createProgram();

          var vs = createShader( vertex, gl.VERTEX_SHADER );
          var fs = createShader( '#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + fragment, gl.FRAGMENT_SHADER );
          if ( vs == null || fs == null ) return null;

          gl.attachShader( program, vs );
          gl.attachShader( program, fs );

          gl.deleteShader( vs );
          gl.deleteShader( fs );

          gl.linkProgram( program );

          if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
            console.log( "ERROR:\n" +
            "VALIDATE_STATUS: " + gl.getProgramParameter( program, gl.VALIDATE_STATUS ) + "\n" +
            "ERROR: " + gl.getError() + "\n\n" +
            "- Vertex Shader -\n" + vertex + "\n\n" +
            "- Fragment Shader -\n" + fragment );
            return null;
          }
          return program;
        }

        function createShader(src, type) {
          var shader = gl.createShader( type );

          gl.shaderSource( shader, src );
          gl.compileShader( shader );

          if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
            console.log( ( type == gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT" ) + " SHADER:\n" + gl.getShaderInfoLog( shader ) );
            return null;
          }
          return shader;
        }
        
        function animate(){
          render();
          raf(animate);
        }

        function render(){
          if ( !currentProgram ) return;

          time=new Date().getTime()-startTime;

          gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

          gl.useProgram(currentProgram);

          gl.uniform1f(timeLocation, time/1000);
          gl.uniform2f(resolutionLocation, bounds.width*dpi,bounds.height*dpi);

          gl.bindBuffer( gl.ARRAY_BUFFER, buffer );

          var vertexPosition;
          gl.vertexAttribPointer( vertexPosition, 2, gl.FLOAT, false, 0, 0 );
          gl.enableVertexAttribArray(vertexPosition);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
          gl.disableVertexAttribArray(vertexPosition);
        }
        return true;
      }

      function createMountains(){
        var textureCanvas=createCanvas(bounds.width,bounds.height);
        sizeToBounds(bounds,dpi,textureCanvas);
        var ctx=getContext(textureCanvas);
        var factor=18;
        var cols=Math.round(bounds.width/factor);
        if(bounds.width>1200){
          cols=55;
        }
        var gridSize=bounds.width/cols;
        var mountains={
          left:[
            '......kkkkjjjkkjjkjkkjjkkkkjjjjj',
            '....kkkjjj..kkkkjkkjjjj.....kkkkkjjjjjj',
            '..kkjj....kkkkjjjjkkkkjkjjjj',
          ],
          right:[
            '......kkkkjjjkkjjkjkkjjkkkkkjjjjjj',
            '....kkkjjj..kkkkjkkjjjj.....kkkkkjjjjjj',
            '..kkjj....kkkkjjjjkkkkjkjjjj',
          ]
        }
        function drawLayer(layer,directionX,directionY){
          ctx.beginPath();
          var pos=0;
          var started=false;
          repeat(layer.length,function(i){
            var dir=layer.charAt(i);
            pos+=dir=='.'?0:(dir=='j'?-1:1);
            if(pos!=0 && !started){
              started=true;
              ctx.moveTo((middle.x+((i-1)*gridSize*directionX))*dpi,middle.y*dpi);
            }
            ctx.lineTo(
              (middle.x+(i*gridSize)*directionX)*dpi,
              (middle.y+(pos*gridSize)*directionY)*dpi
            )
          });
          ctx.closePath();
          ctx.fill();
          // ctx.stroke();
        }
        function drawLayers(i,color1,color2){
          setFillStyle(color1,ctx);
          ctx.strokeStyle=color1;
          ctx.lineWidth=4;
          ctx.lineJoin='round'
          drawLayer(mountains.left[i],-1,-1);
          drawLayer(mountains.right[i],1,-1);
          setFillStyle(color2,ctx);
          ctx.strokeStyle=color2;
          drawLayer(mountains.left[i],-1,1);
          drawLayer(mountains.right[i],1,1);
          ctx.strokeStyle='transparent';
        }
        drawLayers(2,colors.pink,colors.green);
        drawLayers(1,colors.purple,colors.pink);
        drawLayers(0,colors.blackish,colors.purple);
        return textureCanvas;
      }
    });
  }());

  ;(function(){
    var canvas=querySelector('.Scene-stars');    
    var ctx=getContext(canvas);
    var bounds=getBounds(canvas);
    sizeToBounds(bounds,dpi,canvas);
    var stars=[];
    function createStar(){
      return {
        x:random(bounds.width),
        y:random(bounds.height),
        s:0,
        speed:0.01+random(0.035),
        growing:true,
        maxSize:1+(Math.pow(random(1),3)*10),
      }
    }

    ;(function draw(){
      ctx.clearRect(0,0,bounds.width*dpi,bounds.height*dpi);
      setFillStyle(colors.whiteish,ctx);
      var newStars=[];
      forEach(stars,function(star){
        star.s+=star.speed*(star.growing?1:-1);
        if(star.s>1) star.growing=false;
        if(star.s<0){
          return;
        }else{
          newStars.push(star);
        }
        drawStar(
          star.x*dpi,
          star.y*dpi,
          1,
          smooth(star.s)*star.maxSize*dpi,
          ctx
        );
      });
      if(random(1)<0.3) newStars.push(createStar());
      stars=newStars;
      raf(draw);
    }());

  }());

  (function(){
    forEach(querySelectorAll('.js-HasVH'),function(el){
      var bounds=getBounds(el);
      el.style.height=bounds.height+'px';
    });
  }());
}());
