import {projects} from './projects.mjs';
import {home,caseStudy,pick} from './render.mjs';
import {PuzzleBoard} from './puzzle.mjs';
const root=document.querySelector('#app');
const project=projects.find(p=>p.id===document.body.dataset.project);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let language='tr',paused=false,opened=[],context,board,lenis,ticker;
try {language=localStorage.getItem('portfolio-language')==='en'?'en':'tr';paused=localStorage.getItem('portfolio-motion')==='paused';opened=JSON.parse(sessionStorage.getItem('landscape-opened')||'[]');if(!Array.isArray(opened))opened=[];}catch{}
const motion=()=>!paused&&!reduced.matches;
const text=(tr,en)=>language==='en'?en:tr;
function remember(p){if(!opened.includes(p.id))opened.push(p.id);try{sessionStorage.setItem('landscape-opened',JSON.stringify(opened));}catch{}updateProgress();}
function updateProgress(){document.querySelectorAll('[data-status]').forEach(el=>{const done=opened.includes(el.dataset.status);el.textContent=done?text('Açıldı · yeniden incele','Opened · explore again'):text('Bir araya getir','Bring it together');el.closest('.project-package')?.classList.toggle('opened',done);});const status=document.querySelector('#collection-progress');if(status)status.textContent=opened.length?`${opened.length} / 7 ${text('proje keşfedildi','projects explored')}`:'';}
function destroyMotion(){context?.revert();if(ticker)gsap.ticker.remove(ticker);lenis?.destroy();lenis=null;}
function setupMotion(entrance=true){
 destroyMotion();document.body.classList.toggle('motion-paused',!motion());
 const button=document.querySelector('.motion-toggle');button.innerHTML=`${motion()?text('Hareketi durdur','Pause motion'):text('Hareketi başlat','Resume motion')} <span aria-hidden="true">${motion()?'Ⅱ':'▷'}</span>`;button.setAttribute('aria-pressed',String(!motion()));button.disabled=reduced.matches;
 if(!motion())return;
 gsap.registerPlugin(ScrollTrigger);
 if(window.Lenis&&matchMedia('(pointer:fine)').matches){lenis=new Lenis({duration:.9,anchors:{offset:-90},prevent:node=>!!node.closest('dialog')});lenis.on('scroll',ScrollTrigger.update);ticker=time=>lenis?.raf(time*1000);gsap.ticker.add(ticker);}
 context=gsap.context(()=>{
  if(entrance)gsap.from('.hero-copy, .case-heading',{y:40,autoAlpha:0,duration:1.2,ease:'power3.out'});
  if(!project){
   if(entrance)gsap.from('.hero-folder, .hero-puzzle',{y:70,autoAlpha:0,stagger:.12,duration:1.4,ease:'power3.out'});
   gsap.to('.hero-puzzle',{y:-12,duration:3.5,yoyo:true,repeat:-1,ease:'sine.inOut'});
   gsap.to('.hero-art',{y:80,rotation:3,ease:'none',scrollTrigger:{trigger:'.assembly-hero',start:'top top',end:'bottom top',scrub:1}});
   document.querySelectorAll('.project-package').forEach(el=>gsap.from(el,{y:65,rotation:0,autoAlpha:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
   gsap.from('.sketch-frame',{rotation:-8,y:55,ease:'none',scrollTrigger:{trigger:'.about',start:'top bottom',end:'top 20%',scrub:1}});
  }else{gsap.from('.case-hero',{clipPath:'inset(6% 8% round 20px)',duration:1.3,ease:'power3.out'});}
 });
}
function render(entrance=true){
 const y=scrollY;destroyMotion();root.innerHTML=project?caseStudy(project,language):home(language);
 document.documentElement.lang=language;document.title=project?`${pick(project.title,language)} — Sevde Nur Fidan`:`Sevde Nur Fidan — ${text('Peyzaj Mimarlığı','Landscape Architecture')}`;
 document.querySelector('meta[name=description]').content=project?pick(project.description,language):text('Sevde Nur Fidan — Peyzajları parça parça bir araya getiren interaktif portfolyo.','Sevde Nur Fidan — Building landscapes, piece by piece. An interactive landscape architecture portfolio.');
 document.querySelector('.language-toggle').addEventListener('click',()=>{language=language==='tr'?'en':'tr';try{localStorage.setItem('portfolio-language',language);}catch{}render(false);});
 document.querySelector('.motion-toggle').addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('portfolio-motion',paused?'paused':'playing');}catch{}setupMotion(false);});
 document.querySelectorAll('[data-open]').forEach(link=>link.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const p=projects.find(item=>item.id===link.dataset.open);if(opened.includes(p.id))return;
  event.preventDefault();lenis?.stop();
  board=new PuzzleBoard({dialog:document.querySelector('#puzzle-dialog'),project:p,language,motion,onClose:()=>lenis?.start(),onComplete:p=>{remember(p);location.href=p.route;}});board.open(link);
 }));
 if(project)remember(project);else updateProgress();
 setupMotion(entrance);if(!entrance)scrollTo(0,y);
 const cursor=document.querySelector('.cursor');
 if(cursor&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  document.querySelectorAll('[data-open]').forEach(link=>{
   link.addEventListener('pointermove',e=>{if(!motion())return;cursor.textContent=text('AÇ','OPEN');cursor.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;cursor.classList.add('visible');});
   link.addEventListener('pointerleave',()=>cursor.classList.remove('visible'));link.addEventListener('click',()=>cursor.classList.remove('visible'));
  });
 }
 document.querySelectorAll('img').forEach(img=>img.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true}));
}
reduced.addEventListener('change',()=>{setupMotion(false);if(board&&!board.disposed)board.layout(true);});
addEventListener('pagehide',()=>board?.dispose());
// A BFCache return should reveal the collection, not a completed modal.
addEventListener('pageshow',event=>{if(event.persisted){const dialog=document.querySelector('dialog');dialog?.close();document.body.classList.remove('puzzle-active');lenis?.start();try{const saved=JSON.parse(sessionStorage.getItem('landscape-opened')||'[]');if(Array.isArray(saved))opened=saved;}catch{}updateProgress();}});
render();
