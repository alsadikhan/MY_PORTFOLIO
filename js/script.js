const $=id=>document.getElementById(id),root=document.documentElement;

/* use the native mail app on phones and Gmail web on desktop */
const emailLink=document.querySelector('[data-i="email"]'),emailLayout=matchMedia('(max-width:760px)');
function updateEmailLink(){
const mobile=emailLayout.matches;
emailLink.href=mobile?emailLink.dataset.mobileHref:emailLink.dataset.desktopHref;
if(mobile){emailLink.removeAttribute('target');emailLink.removeAttribute('rel')}
else{emailLink.target='_blank';emailLink.rel='noopener noreferrer'}
}
updateEmailLink();
emailLayout.addEventListener('change',updateEmailLink);

/* highlight the navigation link for the section currently in view */
const sectionLinks=[...document.querySelectorAll('nav a[href^="#"]')].map(link=>({
link,
section:document.querySelector(link.getAttribute('href'))
})).filter(item=>item.section);
function setActiveSection(section){
sectionLinks.forEach(({link,section:target})=>{
const active=target===section;
link.classList.toggle('active',active);
if(active)link.setAttribute('aria-current','location');
else link.removeAttribute('aria-current');
});
}
const sectionObserver=new IntersectionObserver(entries=>{
const current=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
if(current)setActiveSection(current.target);
},{rootMargin:'-90px 0px -65% 0px',threshold:[0,.25,.5,1]});
sectionLinks.forEach(({section})=>sectionObserver.observe(section));
sectionLinks.forEach(({link,section})=>link.addEventListener('click',()=>{
setActiveSection(section);
}));

/* always-on polish: scroll bar, mouse glow, card spotlight */
const bar=$('bar'),glow=$('glow');
addEventListener('scroll',()=>{const h=root;bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight||1)*100)+'%'},{passive:true});
addEventListener('pointermove',e=>{glow.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)'},{passive:true});
document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.card,.flag');if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true});

/* logo library (inline SVG) + automatic logo insertion */
const H='12,1.5 21.5,7 21.5,17 12,22.5 2.5,17 2.5,7',T=(t,f,c,x)=>'<text x="12" y="'+(x||16.5)+'" font-size="'+f+'" font-weight="700" text-anchor="middle" fill="'+c+'" font-family="Arial,sans-serif">'+t+'</text>';
const IC={
python:'<rect width="24" height="24" rx="6" fill="#3776ab"/>'+T('Py',11,'#ffd43b'),
javascript:'<rect width="24" height="24" rx="4" fill="#f7df1e"/>'+T('JS',11,'#111'),
typescript:'<rect width="24" height="24" rx="4" fill="#3178c6"/>'+T('TS',11,'#fff'),
java:'<path d="M5 11h11v3a4 4 0 01-4 4H9a4 4 0 01-4-4z" fill="#f89820"/><path d="M16 12h1.5a1.7 1.7 0 010 3.400H16" stroke="#f89820" fill="none" stroke-width="1.5"/><path d="M8.500 3c1.200 1.600-1.200 2.600 0 4.500M12 3c1.200 1.600-1.200 2.600 0 4.500" stroke="#5382a1" fill="none" stroke-width="1.300"/><path d="M4.500 20.500h12" stroke="#5382a1" stroke-width="1.600"/>',
c:'<polygon points="'+H+'" fill="#00599c"/>'+T('C',12,'#fff',16),
cpp:'<polygon points="'+H+'" fill="#00599c"/>'+T('C++',7.5,'#fff',14.800),
sql:'<g fill="#4aa3df"><ellipse cx="12" cy="5.500" rx="8" ry="3"/><path d="M4 8v4c0 1.700 3.600 3 8 3s8-1.300 8-3V8c0 1.700-3.600 3-8 3S4 9.700 4 8z"/><path d="M4 14v4c0 1.700 3.600 3 8 3s8-1.300 8-3v-4c0 1.700-3.600 3-8 3s-8-1.300-8-3z"/></g>',
html:'<path d="M3 2l1.700 19L12 23l7.300-2L21 2z" fill="#e34f26"/>'+T('5',11,'#fff',16.500),
css:'<path d="M3 2l1.700 19L12 23l7.300-2L21 2z" fill="#1572b6"/>'+T('3',11,'#fff',16.500),
react:'<g fill="none" stroke="#61dafb" stroke-width="1.300"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></g><circle cx="12" cy="12" r="1.800" fill="#61dafb"/>',
node:'<polygon points="'+H+'" fill="#539e43"/>'+T('N',11,'#fff',16),
git:'<rect x="4" y="4" width="16" height="16" rx="2.500" transform="rotate(45 12 12)" fill="#f05032"/><g stroke="#fff" stroke-width="1.400" fill="none"><path d="M9 8.500v7M9 11.500l5.500 1.500"/></g><g fill="#fff"><circle cx="9" cy="8.500" r="1.500"/><circle cx="9" cy="15.500" r="1.500"/><circle cx="14.500" cy="13" r="1.500"/></g>',
github:'<path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
docker:'<g fill="#2496ed"><rect x="5" y="8" width="2.500" height="2.200"/><rect x="8" y="8" width="2.500" height="2.200"/><rect x="11" y="8" width="2.500" height="2.200"/><rect x="8" y="5.500" width="2.500" height="2.200"/><rect x="11" y="5.500" width="2.500" height="2.200"/><path d="M2 11h18.500c.9-.3 1.600-1 1.800-2 .8.300 1.300.900 1.500 1.500-.6 5.500-5.500 9-11 9-4.500 0-8-2.500-9-8.500z"/></g>',
linux:'<rect width="24" height="24" rx="6" fill="#222"/>'+T('Lx',10.500,'#fcc624'),
vscode:'<path d="M17 2l5 2.500v15L17 22 7 12.800 3 16V8l4 3.200z" fill="#007acc"/>',
linkedin:'<path fill="#0a66c2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>',
facebook:'<path fill="#1877f2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
instagram:'<rect x="3" y="3" width="18" height="18" rx="5.500" fill="none" stroke="#e1306c" stroke-width="2"/><circle cx="12" cy="12" r="4.200" fill="none" stroke="#e1306c" stroke-width="2"/><circle cx="17.300" cy="6.700" r="1.200" fill="#e1306c"/>',
youtube:'<rect x="1" y="4.500" width="22" height="15" rx="4.500" fill="#f00"/><path d="M10 9l5.500 3-5.500 3z" fill="#fff"/>',
x:'<path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>',
email:'<rect x="2" y="5" width="20" height="14" rx="2.500" fill="none" stroke="currentColor" stroke-width="1.800"/><path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" stroke-width="1.800"/>'};
const LB={cpp:'C++',javascript:'JavaScript',typescript:'TypeScript',node:'Node.js',sql:'MySQL',html:'HTML5',css:'CSS3',vscode:'VS Code',github:'GitHub'};
const AL={'c++':'cpp','js':'javascript','node.js':'node','nodejs':'node','mysql':'sql','html5':'html','css3':'css','vs code':'vscode'};
const svg=k=>IC[k]?'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">'+IC[k]+'</svg>':'';
document.querySelectorAll('[data-auto]').forEach(m=>{const row=m.dataset.auto.split(',').map(k=>'<span class="lg">'+svg(k)+'<b>'+(LB[k]||k[0].toUpperCase()+k.slice(1))+'</b></span>').join('');m.innerHTML='<div class="track">'+row+row+'</div>'});
document.querySelectorAll('.chip,.btn,.soc a').forEach(el=>{let k=el.dataset.i||el.textContent.trim().toLowerCase();k=AL[k]||k;if(IC[k]&&!el.querySelector('.ic'))el.insertAdjacentHTML('afterbegin',svg(k))});

/* small line icons on project and skill cards */
const TI={book:'<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>',cloud:'<path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>',chat:'<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',bars:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',code:'<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12.500l9 5 9-5"/><path d="M3 17l9 5 9-5"/>',tools:'<path d="M14.700 6.300a1 1 0 000 1.400l1.600 1.600a1 1 0 001.400 0l3.770-3.770a6 6 0 01-7.940 7.940l-6.910 6.910a2.120 2.120 0 01-3-3l6.910-6.910a6 6 0 017.940-7.940l-3.760 3.760z"/>'};
document.querySelectorAll('[data-ti]').forEach(e=>e.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+(TI[e.dataset.ti]||'')+'</svg>');

/* PORTFOLIO letters react to the pointer */
const hw=document.querySelector('.hero-word'),hs=[...hw.children];
const lift=e=>hs.forEach(sp=>{const r=sp.getBoundingClientRect(),d=Math.abs(e.clientX-(r.left+r.width/2));sp.style.setProperty('--l',Math.max(0,1-d/(r.width*1.7)).toFixed(2))});
hw.addEventListener('pointermove',lift);hw.addEventListener('pointerdown',lift);
hw.addEventListener('pointerleave',()=>hs.forEach(sp=>sp.style.setProperty('--l',0)));

/* Type visible content only while the page is actively scrolling. */
if(root.classList.contains('scroll-typing'))runScrollTyping();

function runScrollTyping(){
const fx=$('fx'),hud=$('hud'),skip=$('skip');
const colors=['#7dd3fc','#a5b4fc','#5eead4','#f9a8d4','#93c5fd','#fde68a','#86efac','#fdba74'];
const names=['agent-01','planner','builder','reviewer','designer','copywriter','tester','deployer'];
function createAgent(index){
const name=index<names.length?names[index]:'agent-'+String(index+1).padStart(2,'0');
const color=colors[index%colors.length];
const el=document.createElement('div');
el.className='ag';
el.style.setProperty('--c',color);
el.innerHTML='<svg viewBox="0 0 16 16"><path d="M1 1l5 14 2-6 6-2z" fill="'+color+'" stroke="#fff" stroke-width=".8"/></svg><i>'+name+'</i>';
fx.appendChild(el);
return{el,x:innerWidth*.5,y:innerHeight+40,tx:0,ty:0,follow:null};
}
const agents=names.map((_,index)=>createAgent(index));
$('dots').innerHTML=colors.map(color=>'<s style="--c:'+color+'"></s>').join('');

const items=[...document.querySelectorAll('[data-b]')].map(el=>{
const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:node=>node.parentElement.closest('.nt')||!node.nodeValue.trim()?2:1});
const nodes=[];
while(walker.nextNode())nodes.push([walker.currentNode,walker.currentNode.nodeValue]);
return{el,nodes,caret:null,seen:false};
}).filter(item=>item.nodes.length);
$('nt').textContent=items.length;

const active=new Map(),boxes=new Set(),autoPlayedItems=new Set(),manualPlayedItems=new Set();
let rendering=false,lastRenderTime=0,skipAnimation=false,direction=1,autoScrollRunning=false,autoScrollAtEnd=false,autoScrollFrame=0,autoScrollTime=0;
let lastScrollY=scrollY,pendingDirection=1,pendingDistance=0,touchY=null,touchPendingDirection=1,touchPendingDistance=0,scanFrame=0,hudTimer=0,scrollEndTimer=0,completed=0;
const originalScrollBehavior=root.style.scrollBehavior;

function visible(item){
const rect=item.el.getBoundingClientRect();
return rect.bottom>0&&rect.top<innerHeight&&rect.right>0&&rect.left<innerWidth;
}
function restore(item,state){
if(state.box){state.box.remove();boxes.delete(state.box)}
if(item.caret){item.caret.remove();item.caret=null}
item.nodes.forEach(([node,text])=>node.nodeValue=text);
item.el.style.minHeight='';
state.agent.follow=null;
state.agent.el.classList.remove('on');
active.delete(item);
}
function finishScroll(){
if(scanFrame){
clearTimeout(scrollEndTimer);
scrollEndTimer=setTimeout(finishScroll,50);
return;
}
clearTimeout(scrollEndTimer);
if(active.size)return;
$('st').textContent='Scroll to type';
clearTimeout(hudTimer);
hudTimer=setTimeout(()=>hud.classList.remove('show'),350);
}
function stopAutoScroll(){
if(!autoScrollRunning)return;
autoScrollRunning=false;
if(autoScrollFrame)cancelAnimationFrame(autoScrollFrame);
autoScrollFrame=0;
autoScrollTime=0;
root.style.scrollBehavior=originalScrollBehavior;
}
function returnToTopAfterAutoScroll(){
if(!autoScrollAtEnd||active.size||skipAnimation)return;
autoScrollAtEnd=false;
window.scrollTo({top:0,behavior:'smooth'});
}
function autoScroll(time){
if(!autoScrollRunning||skipAnimation)return;
if(!autoScrollTime)autoScrollTime=time;
const elapsed=Math.min(time-autoScrollTime,50);
autoScrollTime=time;
const maxScroll=root.scrollHeight-innerHeight;
const nextY=Math.min(maxScroll,scrollY+elapsed*.45);
window.scrollTo(0,nextY);
if(nextY<maxScroll)autoScrollFrame=requestAnimationFrame(autoScroll);
else{
stopAutoScroll();
autoScrollAtEnd=true;
returnToTopAfterAutoScroll();
}
}
function startRender(){
if(rendering)return;
rendering=true;
requestAnimationFrame(render);
}
function render(time){
const frameDuration=lastRenderTime?Math.min(time-lastRenderTime,50):16.67;
lastRenderTime=time;
const easing=1-Math.pow(1-.22,frameDuration/16.67);
const updates=[];
active.forEach((state,item)=>{
if(state.phase!=='type'||time<state.nextTypeAt)return;
const steps=Math.min(12,Math.floor((time-state.nextTypeAt)/state.typingDelay)+1);
state.nextTypeAt+=steps*state.typingDelay;
type(item,state,steps);
});
active.forEach((state,item)=>{
const {agent,box}=state;
const rect=item.el.getBoundingClientRect();
if(agent.follow){
const caret=item.caret&&item.caret.isConnected?item.caret.getBoundingClientRect():null;
agent.tx=caret?caret.right+4:rect.left+8;
agent.ty=caret?caret.bottom:rect.top+8;
}
agent.x+=(agent.tx-agent.x)*easing;
agent.y+=(agent.ty-agent.y)*easing;
updates.push({agent,box,rect,x:agent.x,y:agent.y});
});
updates.forEach(({agent,box,rect,x,y})=>{
agent.el.style.transform='translate('+x+'px,'+y+'px)';
if(!box)return;
box.style.transform='translate('+rect.left+'px,'+rect.top+'px)';
const width=rect.width+'px',height=rect.height+'px';
if(box.style.width!==width)box.style.width=width;
if(box.style.height!==height)box.style.height=height;
const size=Math.round(rect.width)+' × '+Math.round(rect.height);
if(box.lastChild.textContent!==size)box.lastChild.textContent=size;
});
if(active.size)requestAnimationFrame(render);
else{rendering=false;lastRenderTime=0}
}
function addBox(item,state){
if(state.box)return;
const box=document.createElement('div');
box.className='sel';box.style.setProperty('--c',state.agent.el.style.getPropertyValue('--c'));
box.innerHTML='<u></u><u></u><u></u><u></u><em></em>';
fx.appendChild(box);state.box=box;boxes.add(box);
}
function addCaret(item,state,node){
if(!item.caret){
item.caret=document.createElement('i');item.caret.className='caret';
item.caret.style.setProperty('--c',state.agent.el.style.getPropertyValue('--c'));
}
node.parentNode.insertBefore(item.caret,node.nextSibling);
}
function type(item,state,steps){
if(!active.has(item)||state.phase!=='type')return;
let index=state.nodeIndex,offset=state.offset,remaining=steps;
const changedNodes=new Map();
while(remaining>0&&index<item.nodes.length){
const[node,text]=item.nodes[index],next=Math.min(offset+2,text.length);
changedNodes.set(node,text.slice(0,next));
remaining--;
if(next>=text.length){index++;offset=0}
else offset=next;
}
state.nodeIndex=index;
state.offset=offset;
let caretNode=null;
changedNodes.forEach((text,node)=>{node.nodeValue=text;caretNode=node});
if(index>=item.nodes.length){
if(state.box){state.box.remove();boxes.delete(state.box);state.box=null}
if(item.caret)item.caret.remove();
item.caret=null;state.phase='typed';
state.agent.follow=null;state.agent.el.classList.remove('on');
item.el.style.minHeight='';
active.delete(item);completed=Math.min(items.length,completed+1);
$('nd').textContent=completed;
if(!active.size){
finishScroll();
returnToTopAfterAutoScroll();
}
return;
}
if(caretNode)addCaret(item,state,caretNode);
}
function startItem(item,isAutoScroll=autoScrollRunning){
const playedItems=isAutoScroll?autoPlayedItems:manualPlayedItems;
if(active.has(item)||playedItems.has(item))return;
playedItems.add(item);
let agent=agents.find(candidate=>![...active.values()].some(state=>state.agent===candidate));
if(!agent){
agent=createAgent(agents.length);
agents.push(agent);
$('na').textContent=agents.length;
}
const typingDelay=isAutoScroll?5:25;
const state={agent,box:null,phase:'type',typingDelay,nextTypeAt:performance.now()+350,nodeIndex:0,offset:0,height:item.el.getBoundingClientRect().height};
active.set(item,state);
item.el.style.minHeight=state.height+'px';
item.nodes.forEach(([node])=>node.nodeValue='');
agent.el.classList.add('on');
agent.follow=item;
const rect=item.el.getBoundingClientRect();
agent.tx=rect.left+8;agent.ty=rect.top+8;
addBox(item,state);
startRender();
}
function scan(){
scanFrame=0;
if(direction<0){
active.forEach((state,item)=>restore(item,state));
return;
}
items.forEach(item=>{
if(visible(item)&&!(autoScrollRunning?autoPlayedItems:manualPlayedItems).has(item))startItem(item);
});
}
function onScroll(){
if(skipAnimation)return;
const currentY=scrollY;
if(autoScrollRunning){
direction=1;pendingDirection=1;pendingDistance=0;lastScrollY=currentY;
}else if(touchY!==null){
lastScrollY=currentY;
}else if(currentY!==lastScrollY){
const delta=currentY-lastScrollY,nextDirection=delta>0?1:-1;
lastScrollY=currentY;
if(nextDirection===direction){pendingDirection=nextDirection;pendingDistance=0}
else{
if(nextDirection!==pendingDirection){pendingDirection=nextDirection;pendingDistance=0}
pendingDistance+=Math.abs(delta);
if(pendingDistance>=8){direction=nextDirection;pendingDistance=0}
}
}
if(currentY<=1){direction=1;pendingDirection=1;pendingDistance=0}
clearTimeout(hudTimer);
hud.classList.add('show');
$('st').textContent=direction>0?'Typing while scrolling':'Normal while scrolling';
if(!scanFrame)scanFrame=requestAnimationFrame(scan);
if(direction<0){
active.forEach((state,item)=>restore(item,state));
if(scanFrame){cancelAnimationFrame(scanFrame);scanFrame=0}
}
clearTimeout(scrollEndTimer);
scrollEndTimer=setTimeout(finishScroll,220);
}
function onTouchStart(event){
stopAutoScroll();
touchY=event.touches.length===1?event.touches[0].clientY:null;
touchPendingDirection=direction;
touchPendingDistance=0;
}
function onTouchMove(event){
if(touchY===null||event.touches.length!==1)return;
const nextY=event.touches[0].clientY,delta=touchY-nextY;
touchY=nextY;
if(!delta)return;
const nextDirection=delta>0?1:-1;
if(nextDirection===direction){touchPendingDirection=nextDirection;touchPendingDistance=0}
else{
if(nextDirection!==touchPendingDirection){touchPendingDirection=nextDirection;touchPendingDistance=0}
touchPendingDistance+=Math.abs(delta);
if(touchPendingDistance>=8){direction=nextDirection;pendingDirection=nextDirection;pendingDistance=0;touchPendingDistance=0}
}
}
function onTouchEnd(){
touchY=null;
touchPendingDistance=0;
lastScrollY=scrollY;
}
addEventListener('scroll',onScroll,{passive:true});
addEventListener('wheel',stopAutoScroll,{passive:true});
addEventListener('touchstart',onTouchStart,{passive:true});
addEventListener('touchmove',onTouchMove,{passive:true});
addEventListener('touchend',onTouchEnd,{passive:true});
addEventListener('touchcancel',onTouchEnd,{passive:true});
sectionLinks.forEach(({link})=>link.addEventListener('click',stopAutoScroll));
addEventListener('keydown',event=>{
if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))stopAutoScroll();
});
skip.addEventListener('click',()=>{
skipAnimation=true;stopAutoScroll();clearTimeout(hudTimer);clearTimeout(scrollEndTimer);
active.forEach((state,item)=>restore(item,state));
items.forEach(item=>item.nodes.forEach(([node,text])=>node.nodeValue=text));
root.classList.remove('scroll-typing','scroll-ready');
fx.remove();hud.classList.remove('show');
});
addEventListener('scrollend',()=>{
if(skipAnimation)return;
finishScroll();
},{passive:true});
requestAnimationFrame(()=>{
root.style.scrollBehavior='auto';
window.scrollTo(0,0);
lastScrollY=0;
direction=1;
root.classList.add('scroll-ready');
const initialItems=items.filter(visible);
if(initialItems.length){
clearTimeout(hudTimer);
hud.classList.add('show');
$('st').textContent='Auto scrolling';
initialItems.forEach(item=>startItem(item,true));
}
autoScrollRunning=true;
autoScrollFrame=requestAnimationFrame(autoScroll);
});
}