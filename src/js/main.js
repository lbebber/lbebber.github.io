(function(){
  var colors={
    whiteish : '#FFEDDB',
    yellow : '#F7F7B6',
    pink : '#E96F92',
    purple : '#75517D',
    blackish : '#1B2947',
    green : '#54fad4',
  }
  var win=window;
  var dpi=win.devicePixelRatio;
  var doc=document;
  var body=doc.body;
  var html=doc.documentElement;
  var shaders={
    vert:'attribute vec3 position;void main(){gl_Position=vec4(position,1.0);}',
    frag:'uniform float t;uniform float s;uniform vec2 r;uniform sampler2D i;void main(){vec2 p=gl_FragCoord.xy/r;p=vec2(p.x,1.0-p.y);if(p.y>0.5){float dist=(p.y-0.5)/0.5;float w=(dist*9.0)-t;float x=(sin(w*3.0-(t*3.0))+1.0)*0.5;w-=x*0.25;w=w-floor(w);w=(floor(w*4.0)+-0.4)/4.0;p.y+=w*0.35*dist*s;}gl_FragColor=texture2D(i,p);}',
  };

  function getScroll(){
    return win.pageYOffset || html.scrollTop;
  }
  function documentHeight(){
    return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
  }
  function createCanvas(width,height){
    var canvas=doc.createElement('canvas');
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
    return doc.querySelector(selector);
  }
  function querySelectorAll(selector){
    var nodes=doc.querySelectorAll(selector);
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

  function mountains(){
    var stopAnim=false;
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
        var vertexShader = shaders.vert;
        var fragmentShader = shaders.frag;
        var currentProgram;
        var timeLocation;
        var resolutionLocation;
        var scrollLocation;
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
          function getUniformLocation(){
            return gl.getUniformLocation.apply(gl,arguments);
          }
          timeLocation = getUniformLocation(currentProgram, 't');
          resolutionLocation = getUniformLocation(currentProgram, 'r');
          scrollLocation=getUniformLocation(currentProgram,'s');

          function texParameteri(){
            return gl.texParameteri.apply(gl,arguments);
          }
          var gl_TEXTURE_2D=gl.TEXTURE_2D;

          // Create a texture.
          var texture = gl.createTexture();
          gl.bindTexture(gl_TEXTURE_2D, texture);
         
          // Set the parameters so we can render any size image.
          texParameteri(gl_TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          texParameteri(gl_TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          texParameteri(gl_TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          texParameteri(gl_TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          // Upload the image into the texture.
          gl.texImage2D(gl_TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureMountains);
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
            // console.log( "ERROR:\n" +
            // "VALIDATE_STATUS: " + gl.getProgramParameter( program, gl.VALIDATE_STATUS ) + "\n" +
            // "ERROR: " + gl.getError() + "\n\n" +
            // "- Vertex Shader -\n" + vertex + "\n\n" +
            // "- Fragment Shader -\n" + fragment );
            return null;
          }
          return program;
        }

        function createShader(src, type) {
          var shader = gl.createShader( type );

          gl.shaderSource( shader, src );
          gl.compileShader( shader );

          if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
            // console.log( ( type == gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT" ) + " SHADER:\n" + gl.getShaderInfoLog( shader ) );
            return null;
          }
          return shader;
        }
        
        function animate(){
          var top=canvas.getAttribute('data-stop-on-scroll')=='true';
          var scroll=getScroll();
          if((top && scroll<win.innerHeight) ||
              (!top && scroll>documentHeight()-win.innerHeight-200)
            )
            render();
          if(!stopAnim)
            raf(animate);
        }

        function render(){
          if ( !currentProgram ) return;

          time=new Date().getTime()-startTime;

          gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

          gl.useProgram(currentProgram);

          gl.uniform1f(timeLocation, time/1000);
          var s=Math.max(0,1-(getScroll()/(win.innerHeight*0.5)));
          gl.uniform1f(scrollLocation,canvas.getAttribute('data-stop-on-scroll')=='true'?s:1);
          gl.uniform2f(resolutionLocation, bounds.width*dpi,bounds.height*dpi);

          gl.bindBuffer( gl.ARRAY_BUFFER, buffer );

          var vertexPosition;
          gl.vertexAttribPointer( vertexPosition, 2, gl.FLOAT, false, 0, 0 );
          gl.enableVertexAttribArray(vertexPosition);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
          gl.disableVertexAttribArray(vertexPosition);
          gl.viewport(0,0,bounds.width*dpi,bounds.height*dpi);
        }
        return true;
      }

      function createMountains(){
        var textureCanvas=createCanvas(bounds.width,bounds.height);
        sizeToBounds(bounds,dpi,textureCanvas);
        var ctx=getContext(textureCanvas);
        var factor=20;
        if(win.innerWidth<700) factor=18;
        var cols=Math.round(bounds.width/factor);
        // if(bounds.width>1200){
        //   cols=55;
        // }
        var gridSize=bounds.width/cols;
        var mountains={
          left:[
            '......kkkkjjjkkjjkjkkjjkkkkkjjjjjj..kkjj',
            '....kkkjjj..kkkkjkkjjjj.......kkkkjjjjj',
            '...kkjj...kkkkjjj..kkkjkjjjj.....kkkkjjkkkkjjjjjj',
          ],
          right:[
            '......kkkkjjjkkjjjkkkjjkkkkkjjjjjkjj..kkkjjj',
            '....kkkjjjkkkkjjjkkjj.......kkkkjjjjj',
            '...kkjj.kkkkjjkkjjjjkkkkjkjjjj...kkkkjkjjjj',
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
    return {
      stop:function(){
        stopAnim=true;
      }
    }
  };

  function initStars(){
    var canvas=querySelector('.Scene-stars');    
    var stopAnim=false;
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
      if(getScroll()<win.innerHeight){
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
      }
      if(!stopAnim)
        raf(draw);
    }());
    return {
      stop:function(){
        stopAnim=true;
      }
    }
  };

  (function(){
    var animMountains=mountains();
    var animStars=initStars();
    var lastResize=win.innerWidth;
    win.addEventListener('resize',function(){
      var ww=win.innerWidth;
      if(ww==lastResize) return;
      lastResize=ww;
      animMountains.stop();
      animStars.stop();
      var canvases=querySelectorAll('.Scene-mountains');
      forEach(canvases,function(canvas){
        canvas.removeAttribute('width');
        canvas.removeAttribute('height');
      });
      raf(function(){
        animMountains=mountains();
        animStars=initStars();
      });
    });
  }());


  ;(function(){
    var lastUpdate=win.innerHeight;
    function update(){
      forEach(querySelectorAll('.js-HasVH'),function(el){
        el.style.height=(win.innerHeight*(parseFloat(el.getAttribute('data-vh'))))+'px';
      });
    }
    update();
    win.addEventListener('resize',function(){
      var wh=win.innerHeight;
      if(Math.abs(wh-lastUpdate)>100){
        update();
        lastUpdate=wh;
      }
    });
  }());

  ;(function(){
    forEach(querySelectorAll('.js-Lazyload'),function(el){
      var img=document.createElement('img');
      setAttribute('src',el.getAttribute('data-image'),img);
      el.appendChild(img);
    });
  }())

  ;(function(){
    setAttribute('href','mailto:lucasbbebber@gmail.com',querySelector('.Email'));
  }());
}());
