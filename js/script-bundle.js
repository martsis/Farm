!function(t){var e={};function o(i){if(e[i])return e[i].exports;var s=e[i]={i:i,l:!1,exports:{}};return t[i].call(s.exports,s,s.exports,o),s.l=!0,s.exports}o.m=t,o.c=e,o.d=function(t,e,i){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(o.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)o.d(i,s,function(e){return t[e]}.bind(null,s));return i},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=1)}([function(t,e){t.exports={MAIN_HEIGHT:35,MAIN_WIDTH:60,BLOCK_HEIGHT:20,BLOCK_WIDTH:20,VIEW_HEIGHT:700,VIEW_WIDHT:1200,UNICELLULAR_COUNT:60,UNICELLULAR_CHILDREN:4,HEALTH:100,FOOD_COUNT:150,INTOXICATE_PROB:20,WALL_COUNT:150,totalIterations:0,totalGenerations:1,totalSurvivors:0,isPaused:!0,saveEnabled:!1}},function(t,e,o){o(0),o(2);const i=o(3),s=o(4),n=o(5),r=o(6);o(7);i.init(),s.check(),n.init(),i.updateCanvas(),setInterval(r.run,100)},function(t,e,o){const i=o(0),s=o(8);class n{constructor(t,e,o){this.context=t,this.positionX=e,this.positionY=o,this.text=""}draw(){this.context.beginPath(),this.context.rect(this.positionX*i.BLOCK_WIDTH+1,this.positionY*i.BLOCK_HEIGHT+1,i.BLOCK_WIDTH-1,i.BLOCK_HEIGHT-1),this.context.closePath(),this.context.strokeStyle=this.getColor(),this.context.stroke(),this.context.font=`${i.BLOCK_HEIGHT-2}px serif`,this.context.fillText(this.text,this.positionX*i.BLOCK_WIDTH+1,this.positionY*i.BLOCK_HEIGHT+(i.BLOCK_HEIGHT-1))}getColor(){return"black"}}class r extends n{constructor(t,e,o,n){super(t,e,o),this.nda=[],this.health=i.HEALTH,this.direction=s.getRandomInt(0,7),this.iterator=void 0!==n?n:0,this.subIterator=0,this.id;for(let t=0;t<64;t++)this.nda.push(s.getRandomInt(0,63))}getColor(){return this.health>0?"blue":"gray"}move(t){let e=this.positionX,o=this.positionY,s=0,n=0,r=!1;if(this.direction==t){switch(t){case 0:o--;break;case 1:o--,e++;break;case 2:e++;break;case 3:e++,o++;break;case 4:o++;break;case 5:e--,o++;break;case 6:e--;break;case 7:e--,o--}e<0&&(e=i.MAIN_WIDTH),e>i.MAIN_WIDTH&&(e=0),o<0&&(o=i.MAIN_HEIGHT),o>i.MAIN_HEIGHT&&(o=0);for(let t in c.walls)if(c.walls[t].positionX==e&&c.walls[t].positionY==o){s=1;break}for(let t in c.unicellulars)if(c.unicellulars[t].positionX==e&&c.unicellulars[t].positionY==o){s=3;break}for(let t in c.foods)if(c.foods[t].positionX==e&&c.foods[t].positionY==o){s=(r=c.foods[t].isIntoxicated)?4:2,n=t;break}}switch(s){case 1:this.iteratorUp(1);break;case 2:this.iteratorUp(2),this.healthUp(),delete c.foods[n];break;case 3:this.iteratorUp(3);break;case 4:r||this.healthUp(),delete c.foods[n],this.positionX=e,this.positionY=o,this.death();break;default:this.positionX=e,this.positionY=o,this.iteratorUp(5)}this.subIterator=10}do(){if(this.health>0){do{const t=this.nda[this.iterator];t<=7?this.move(t):t>=8&&t<=15?this.take(t):t>=16&&t<=23?this.see(t):t>=24&&t<=31?this.rotate(t):(this.subIterator++,this.iteratorUp(t))}while(this.subIterator<10);this.health--,this.subIterator=0,this.text=this.health}}take(t){let e=0,o=this.positionX,i=this.positionY,s=0,n=!1;switch(t){case 8:i--;break;case 9:i--,o++;break;case 10:o++;break;case 11:o++,i++;break;case 12:i++;break;case 13:o--,i++;break;case 14:o--;break;case 15:o--,i--}for(let t in c.walls)if(c.walls[t].positionX==o&&c.walls[t].positionY==i){e=1;break}for(let t in c.foods)if(c.foods[t].positionX==o&&c.foods[t].positionY==i){e=(n=c.foods[t].isIntoxicated)?4:2,s=t;break}for(let t in c.unicellulars)if(c.unicellulars[t].positionX==o&&c.unicellulars[t].positionY==i){e=3;break}switch(e){case 1:this.iteratorUp(1);break;case 2:this.iteratorUp(2),n||this.healthUp(),delete c.foods[s];break;case 3:this.iteratorUp(3);break;case 4:c.foods[s].isIntoxicated=!1,this.iteratorUp(4);break;default:this.iteratorUp(5)}this.subIterator=10}see(t){let e=1,o=this.positionX,i=this.positionY,s=!1;switch(t){case 8:i--;break;case 9:i--,o++;break;case 10:o++;break;case 11:o++,i++;break;case 12:i++;break;case 13:o--,i++;break;case 14:o--;break;case 15:o--,i--}for(let t in c.walls)if(c.walls[t].positionX==o&&c.walls[t].positionY==i){e=1;break}for(let t in c.foods)if(c.foods[t].positionX==o&&c.foods[t].positionY==i){e=(s=c.foods[t].isIntoxicated)?4:2;break}for(let t in c.unicellulars)if(c.unicellulars[t].positionX==o&&c.unicellulars[t].positionY==i){e=3;break}switch(e){case 1:this.iteratorUp(1);break;case 2:this.iteratorUp(2);break;case 3:this.iteratorUp(3);break;case 4:this.iteratorUp(4);break;default:this.iteratorUp(5)}this.subIterator++}rotate(t){this.direction+=t-24,this.direction>7&&(this.direction=this.direction-8),this.subIterator++,this.iteratorUp()}healthUp(){this.health+=10,this.health>200&&(this.health=200)}iteratorUp(t){void 0===t?this.iterator++:this.iterator+=t,this.iterator>63&&(this.iterator=this.iterator-64)}death(){for(const t in c.unicellulars)c.unicellulars[t]===this&&delete c.unicellulars[t]}}r.count=0;class a extends n{constructor(t,e,o,i){super(t,e,o),this.context=t,this.positionX=e,this.positionY=o,this.isIntoxicated=i}getColor(){return this.isIntoxicated?"red":"green"}}a.count=0;class l extends n{constructor(t,e,o){super(t,e,o),this.context=t,this.positionX=e,this.positionY=o}getColor(){return"black"}}l.count=0;const c={unicellulars:{},stuffs:{},foods:{},walls:{},Stuff:n,Unicellular:r,Food:a,Wall:l};t.exports=c},function(t,e,o){const i=o(0),s=o(2),n=document.createElement("div"),r=document.createElement("canvas"),a=document.createElement("p"),l=document.createElement("p"),c=document.createElement("p"),u=document.createElement("div"),h=document.body,d=document.createElement("button"),f={context:null,init:function(){document.body.append(n),n.append(r),n.append(u),n.append(a),n.append(l),n.append(c),h.style.backgroundColor="#000",n.style.width=`${i.VIEW_WIDHT}px`,n.style.margin="auto",f.context=r.getContext("2d"),r.style.backgroundColor="#FFF",r.width=i.VIEW_WIDHT,r.height=i.VIEW_HEIGHT,d.textContent="Start",d.addEventListener("click",p),u.append(d),a.style.color="#FFF",l.style.color="#FFF",c.style.color="#FFF"},pauseToggle:p,updateCanvas:function t(){requestAnimationFrame(t);a.textContent=`Iterations: ${i.totalIterations}`,l.textContent=`Generation: ${i.totalGenerations}`,c.textContent=`Survivors: ${i.totalSurvivors}`;r.width=r.width;for(const t in s.unicellulars)s.unicellulars[t].draw();for(const t in s.foods)s.foods[t].draw();for(const t in s.walls)s.walls[t].draw()}};function p(){i.isPaused=!i.isPaused,i.isPaused?d.textContent="Play":d.textContent="Pause"}t.exports=f},function(t,e,o){const i=o(0),s=o(2);t.exports={check:function(){if("unicellulars"in localStorage&&i.saveEnabled){const t=JSON.parse(localStorage.unicellulars);for(const e in t)unicellulars[e]=new s.Unicellular(view.context,t[e].positionX,t[e].positionY,t[e].iterator),unicellulars[e].nda=t[e].nda,e>s.Unicellular.count&&(s.Unicellular.count=e);s.Unicellular.count++}}}},function(t,e,o){const i=o(0),s=o(2),n=o(7),r=o(3),a=o(8);t.exports={init:function(){if(0==Object.keys(s.unicellulars).length)for(;Object.keys(s.unicellulars).length<i.UNICELLULAR_COUNT;){const t=n.getNewPosition();s.unicellulars[s.Unicellular.count++]=new s.Unicellular(r.context,t.x,t.y)}else for(let t=0;t<i.UNICELLULAR_CHILDREN;t++){const t=n.getNewPosition();s.unicellulars[s.Unicellular.count++]=new s.Unicellular(r.context,t.x,t.y)}for(;s.Food.count<i.FOOD_COUNT;){const t=n.getNewPosition();let e=!1;a.getRandomInt(0,100)>i.INTOXICATE_PROB||(e=!0),s.foods[s.Food.count++]=new s.Food(r.context,t.x,t.y,e)}for(;s.Wall.count<i.WALL_COUNT;){const t=n.getNewPosition();s.walls[s.Wall.count++]=new s.Wall(r.context,t.x,t.y)}}}},function(t,e,o){const i=o(0),s=o(2),n=o(3),r=o(7),a=o(8);t.exports={run:function(){if(!i.isPaused){i.totalIterations++;const t=Object.keys(s.unicellulars).length;for(const t in s.unicellulars)s.unicellulars[t].health>0?s.unicellulars[t].do():s.unicellulars[t].death();for(;Object.keys(s.foods).length<i.FOOD_COUNT;){const t=r.getNewPosition();let e=!1;a.getRandomInt(0,100)>i.INTOXICATE_PROB||(e=!0),s.foods[s.Food.count++]=new s.Food(n.context,t.x,t.y,e)}if(0==t&&n.pauseToggle(),t<i.UNICELLULAR_COUNT/5){const e={};let o=0;i.totalGenerations++,t>0&&i.saveEnabled&&(localStorage.unicellulars=JSON.stringify(s.unicellulars));for(const t in s.unicellulars){const n=s.unicellulars[t];s.unicellulars[t].health=100;for(let t=0;t<i.UNICELLULAR_CHILDREN;t++){const i=r.getNewPosition();e[o]=new s.Unicellular(n.context,i.x,i.y,n.iterator),n.nda.forEach((i,s,n)=>{if(0==t){const t=a.getRandomInt(0,63);NaN!==i&&null!==i||(i=0),e[o].nda[s]=s!=t?i:t}else e[o].nda[s]=i}),o++}}for(const t in e)s.unicellulars[s.Unicellular.count++]=e[t]}}}}},function(t,e,o){const i=o(0),s=o(2),n=o(8);t.exports={getNewPosition:function(){let t=!1;const e={x:0,y:0};do{e.x=n.getRandomInt(0,i.MAIN_WIDTH),e.y=n.getRandomInt(0,i.MAIN_HEIGHT),t=!0;for(let o in s.unicellulars)if(s.unicellulars[o].positionX==e.x&&s.unicellulars[o].positionY==e.y){t=!1;break}if(t)for(let o in s.foods)if(s.foods[o].positionX==e.x&&s.foods[o].positionY==e.y){t=!1;break}if(t)for(let o in s.walls)if(s.walls[o].positionX==e.x&&s.walls[o].positionY==e.y){t=!1;break}}while(!t);return e}}},function(t,e){t.exports={getRandomInt:function(t,e){return Math.floor(Math.random()*(e-t))+t}}}]);
//# sourceMappingURL=script-bundle.js.map