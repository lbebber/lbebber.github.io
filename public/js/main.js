!function(){function t(){return b.pageYOffset||T.scrollTop}function e(){return Math.max(R.scrollHeight,R.offsetHeight,T.clientHeight,T.scrollHeight,T.offsetHeight)}function r(t,e){var r=y.createElement("canvas");return h("width",t*E,r),h("height",e*E,r),r}function n(t,e,r,n,i){i.save(),i.translate(t,e),i.scale(n,n),i.rotate(Math.PI/4),i.fillRect(-r/2,-r/2,r,r),i.restore()}function i(t,e,r){r.addColorStop(t,e)}function a(t){return y.querySelector(t)}function o(t){var e=y.querySelectorAll(t);return[].slice.call(e)}function l(t){return t.getContext("2d",{})}function u(t){return t.getBoundingClientRect()}function h(t,e,r){r.setAttribute(t,e)}function c(t,e){e.fillStyle=t}function s(t){return Math.random()*t}function f(t){return t*t*(3-2*t)}function k(t,e){for(var r=0;r<t;r++)e(r)}function j(t,e){for(var r=0;r<t.length;r++)e(t[r],r)}function g(t,e,r){h("width",t.width*e,r),h("height",t.height*e,r)}function d(){var n=!1,a=o(".Scene-mountains");return j(a,function(a){function o(){function r(){function t(){return d.getUniformLocation.apply(d,arguments)}function e(){return d.texParameteri.apply(d,arguments)}try{d=a.getContext("experimental-webgl",{premultipliedAlpha:!1,alpha:!0})}catch(t){}if(!d)return!1;if(g=d.createBuffer(),d.bindBuffer(d.ARRAY_BUFFER,g),d.bufferData(d.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]),d.STATIC_DRAW),h=i(p,v),null==h)return!1;c=t(h,"t"),f=t(h,"r"),k=t(h,"s");var r=d.TEXTURE_2D,n=d.createTexture();return d.bindTexture(r,n),e(r,d.TEXTURE_WRAP_S,d.CLAMP_TO_EDGE),e(r,d.TEXTURE_WRAP_T,d.CLAMP_TO_EDGE),e(r,d.TEXTURE_MIN_FILTER,d.LINEAR),e(r,d.TEXTURE_MAG_FILTER,d.LINEAR),d.texImage2D(r,0,d.RGBA,d.RGBA,d.UNSIGNED_BYTE,j),!0}function i(t,e){var r=d.createProgram(),n=o(t,d.VERTEX_SHADER),i=o("#ifdef GL_ES\nprecision highp float;\n#endif\n\n"+e,d.FRAGMENT_SHADER);return null==n||null==i?null:(d.attachShader(r,n),d.attachShader(r,i),d.deleteShader(n),d.deleteShader(i),d.linkProgram(r),d.getProgramParameter(r,d.LINK_STATUS)?r:null)}function o(t,e){var r=d.createShader(e);return d.shaderSource(r,t),d.compileShader(r),d.getShaderParameter(r,d.COMPILE_STATUS)?r:null}function l(){var r="true"==a.getAttribute("data-stop-on-scroll"),i=t();(r&&i<b.innerHeight||!r&&i>e()-b.innerHeight-200)&&u(),n||S(l)}function u(){if(h){w=(new Date).getTime()-m,d.clear(d.COLOR_BUFFER_BIT|d.DEPTH_BUFFER_BIT),d.useProgram(h),d.uniform1f(c,w/1e3);var e=Math.max(0,1-t()/(.5*b.innerHeight));d.uniform1f(k,"true"==a.getAttribute("data-stop-on-scroll")?e:1),d.uniform2f(f,s.width*E,s.height*E),d.bindBuffer(d.ARRAY_BUFFER,g);var r;d.vertexAttribPointer(r,2,d.FLOAT,!1,0,0),d.enableVertexAttribArray(r),d.drawArrays(d.TRIANGLES,0,6),d.disableVertexAttribArray(r),d.viewport(0,0,s.width*E,s.height*E)}}var h,c,f,k,g,d,p=x.vert,v=x.frag,m=(new Date).getTime(),w=0;return!!r()&&(l(),!0)}function h(){function t(t,e,r){a.beginPath();var n=0,i=!1;k(t.length,function(o){var l=t.charAt(o);n+="."==l?0:"j"==l?-1:1,0==n||i||(i=!0,a.moveTo((f.x+(o-1)*h*e)*E,f.y*E)),a.lineTo((f.x+o*h*e)*E,(f.y+n*h*r)*E)}),a.closePath(),a.fill()}function e(e,r,n){c(r,a),a.strokeStyle=r,a.lineWidth=4,a.lineJoin="round",t(j.left[e],-1,-1),t(j.right[e],1,-1),c(n,a),a.strokeStyle=n,t(j.left[e],-1,1),t(j.right[e],1,1),a.strokeStyle="transparent"}var n=r(s.width,s.height);g(s,E,n);var a=l(n),o=20;b.innerWidth<700&&(o=18);var u=Math.round(s.width/o),h=s.width/u,j={left:["......kkkkjjjkkjjkjkkjjkkkkkjjjjjj..kkjj","....kkkjjj..kkkkjkkjjjj.......kkkkjjjjj","...kkjj...kkkkjjj..kkkjkjjjj.....kkkkjjkjjj"],right:["......kkkkjjjkkjjjkkkjjkkkkkjjjjjkjj..kkkjjj","....kkkjjjkkkkjjjkkjj.......kkkkjjjjj","...kkjj.kkkkjjkkjjjjkkkkjkjjjj...kkkkjkjjjj"]};e(2,m.pink,m.green),e(1,m.purple,m.pink),e(0,m.blackish,m.purple);var d=r(s.width,s.height),p=l(d);p.drawImage(n,0,0),p.save(),p.globalCompositeOperation="lighten",p.globalAlpha=.53;var v=Math.max(300*E,s.width*E/4),w=p.createRadialGradient(f.x*E,f.y*E,0,f.x*E,f.y*E,v);i(0,m.whiteish,w),i(.33,m.pink,w),i(.66,m.purple,w),i(1,"rgba(0,0,0,0)",w),p.fillStyle=w,p.beginPath(),p.arc(f.x*E,f.y*E,v,0,2*Math.PI),p.fill();var A=8*h*E,y=p.createRadialGradient(f.x*E,f.y*E,0,f.x*E,f.y*E,A);return i(.8,"black",y),i(.85,m.pink,y),i(.875,m.whiteish,y),i(.92,m.green,y),i(.95,m.purple,y),i(1,"rgba(0,0,0,0)",y),p.globalAlpha=.05,p.fillStyle=y,p.beginPath(),p.arc(f.x*E,f.y*E,A,0,2*Math.PI),p.fill(),a.save(),a.globalCompositeOperation="source-atop",a.drawImage(d,0,0),p.clearRect(0,0,s.width*E,s.height*E),p.restore(),p.drawImage(n,0,0),a.clearRect(0,0,s.width*E,s.height*E),a.restore(),c(m.whiteish,a),a.arc(f.x*E,f.y*E,2.5*h*E,Math.PI,2*Math.PI),a.fill(),a.drawImage(d,0,0),n}var s=u(a);g(s,E,a);var f={x:s.width/2,y:s.height/2},j=h();o()}),{stop:function(){n=!0}}}function p(){function e(){return{x:s(h.width),y:s(h.height),s:0,speed:.01+s(.035),growing:!0,maxSize:1+10*Math.pow(s(1),3)}}var r=a(".Scene-stars"),i=!1,o=l(r),h=u(r);g(h,E,r);var k=[],d=[{p:1.5,a:.02,s:350},{p:1.7,a:.01,s:30},{p:1.3,a:.01,s:35},{p:1,a:.02,s:100},{p:.94,a:.02,s:50},{p:.85,a:.03,s:60},{p:.65,a:.026,s:50},{p:.5,a:.03,s:150},{p:.47,a:.04,s:40},{p:.4,a:.06,s:50},{p:.25,a:.07,s:70},{p:-.19,a:.06,s:30},{p:-.3,a:.06,s:70},{p:-.6,a:.04,s:45},{p:-.9,a:.07,s:30},{p:-1.2,a:.06,s:25},{p:-1.5,a:.04,s:50},{p:-1.9,a:.02,s:100}];return function r(a){if(t()<b.innerHeight){o.clearRect(0,0,h.width*E,h.height*E),c(m.whiteish,o);var l=[];j(k,function(t){t.s+=t.speed*(t.growing?1:-1),t.s>1&&(t.growing=!1),t.s<0||(l.push(t),n(t.x*E,t.y*E,1,f(t.s)*t.maxSize*E,o))}),s(1)<.3&&l.push(e()),k=l;var u=t(),g=.75*A-u;j(d,function(t){o.globalAlpha=t.a;var e=t.p,r=1-e,i=u+g*r+(A-g)*e;n(h.width/2*E,i*E,1,t.s*E,o)}),o.globalAlpha=1}i||S(r)}(),{stop:function(){i=!0}}}function v(){var t=document.createElement("div");t.style.position="absolute",t.style.height="100vh",document.body.appendChild(t);var e=t.getBoundingClientRect().height;return t.remove(),0==e&&(e=b.innerHeight),e}var m={whiteish:"#FFEDDB",yellow:"#F7F7B6",pink:"#E96F92",purple:"#75517D",blackish:"#1B2947",green:"#54fad4"},w=120,A=0,b=window,E=b.devicePixelRatio,y=document,R=y.body,T=y.documentElement,x={vert:"attribute vec3 position;void main(){gl_Position=vec4(position,1.0);}",frag:"uniform float t;uniform float s;uniform vec2 r;uniform sampler2D i;void main(){vec2 p=gl_FragCoord.xy/r;p=vec2(p.x,1.0-p.y);if(p.y>0.5){float dist=(p.y-0.5)/0.5;float w=(dist*8.5)-t*1.0;float x=(sin(w*3.0-(t*4.0))+3.0)*0.5;w-=x*0.15;w=w-floor(w);w=(floor(w*4.0)-0.4)/4.0;p.y+=w*0.35*dist*s;}gl_FragColor=texture2D(i,p);}"},S=requestAnimationFrame;!function(){var t=d(),e=p(),r=b.innerWidth,n=b.innerHeight,i=null;b.addEventListener("resize",function(){function a(){var i=b.innerWidth,a=b.innerHeight;if(i!=r){r=i,t.stop(),e.stop();var l=o(".Scene-mountains");j(l,function(t){t.removeAttribute("width"),t.removeAttribute("height")}),S(function(){t=d(),e=p()})}Math.abs(a-n)>w&&(n=a,e.stop(),S(function(){e=p()}))}null!=i&&(clearTimeout(i),i=null),i=setTimeout(a,1e3)})}(),function(){function t(){var t=v();j(o(".js-HasVH"),function(e){e.style.height=t*parseFloat(e.getAttribute("data-vh"))+"px"}),A=t}var e=b.innerHeight;t(),b.addEventListener("resize",function(){var r=b.innerHeight;Math.abs(r-e)>w&&(t(),e=r)})}(),function(){j(o(".js-Lazyload"),function(t){t.classList.remove("js-Lazyload--hidden");var e=document.createElement("img"),r="true"==t.getAttribute("data-hires")&&E>1,n=t.getAttribute("data-image");if(r){var i=n.lastIndexOf(".");n=n.substr(0,i)+"@2x"+n.substr(i)}h("src",n,e),h("role","presentation",e),t.appendChild(e)})}(),function(){h("href","mailto:lucasbbebber@gmail.com",a(".Email"))}()}();