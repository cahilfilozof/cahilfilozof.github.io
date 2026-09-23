import {projects} from './projects.79ed2fb2348b.mjs';
import {clamp} from './geometry.79ed2fb2348b.mjs';

export function setupStudio({language,project,motion}){
 const controller=new AbortController(),opts={signal:controller.signal},cleanups=[];
 const t=(tr,en)=>language==='en'?en:tr;
 const on=(el,event,fn)=>el?.addEventListener(event,fn,opts);
 const desk=document.querySelector('.scrap-surface');
 if(desk){
  let top=4;
  const states=[...desk.querySelectorAll('[data-scrap]')].map(el=>({el,x:0,y:0,drag:null}));
  const place=s=>{s.x=clamp(s.x,12-s.el.offsetLeft,desk.clientWidth-s.el.offsetLeft-s.el.offsetWidth-12);s.y=clamp(s.y,12-s.el.offsetTop,desk.clientHeight-s.el.offsetTop-s.el.offsetHeight-12);s.el.style.setProperty('--drag-x',`${s.x}px`);s.el.style.setProperty('--drag-y',`${s.y}px`);};
  states.forEach(s=>{
   const grip=s.el.querySelector('.scrap-grip');
   on(grip,'pointerdown',e=>{if(e.button>0)return;e.preventDefault();grip.setPointerCapture(e.pointerId);s.drag={id:e.pointerId,x:e.clientX-s.x,y:e.clientY-s.y};s.el.style.zIndex=++top;s.el.classList.add('held');});
   on(grip,'pointermove',e=>{if(s.drag?.id!==e.pointerId)return;s.x=e.clientX-s.drag.x;s.y=e.clientY-s.drag.y;place(s);});
   const drop=()=>{s.drag=null;s.el.classList.remove('held');};
   on(grip,'pointerup',drop);on(grip,'pointercancel',drop);on(grip,'lostpointercapture',drop);
   on(grip,'keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const step=e.shiftKey?3:18;s.x+=e.key==='ArrowRight'?step:e.key==='ArrowLeft'?-step:0;s.y+=e.key==='ArrowDown'?step:e.key==='ArrowUp'?-step:0;s.el.style.zIndex=++top;place(s);});
  });
  const reset=()=>states.forEach(s=>{s.x=s.y=0;s.drag=null;s.el.style.removeProperty('z-index');s.el.style.setProperty('--drag-x','0px');s.el.style.setProperty('--drag-y','0px');s.el.classList.remove('held');});
  on(document.querySelector('.desk-reset'),'click',reset);on(window,'resize',reset);
 }
 const lab=document.querySelector('.project-lab');
 if(lab&&project){
  const base='../../',viewer=lab.querySelector('.drawing-viewer'),overlay=lab.querySelector('.study-overlay'),image=overlay.querySelector('img'),lens=lab.querySelector('.detail-lens'),range=lab.querySelector('.reveal-range');
  let lensOn=false,lx=.5,ly=.5;
  let comparing=null;
  const compareAt=e=>{const rect=viewer.getBoundingClientRect();range.value=Math.round(clamp((e.clientX-rect.left)/rect.width*100,0,100));viewer.style.setProperty('--reveal',range.value+'%');};
  on(viewer,'dragstart',e=>e.preventDefault());
  on(viewer,'pointerdown',e=>{if(lensOn||e.button>0)return;comparing=e.pointerId;viewer.setPointerCapture(e.pointerId);compareAt(e);});
  on(viewer,'pointermove',e=>{if(comparing===e.pointerId)compareAt(e);});
  const stopComparing=()=>{comparing=null;};
  on(viewer,'pointerup',stopComparing);on(viewer,'pointercancel',stopComparing);on(viewer,'lostpointercapture',stopComparing);
  const lensPosition=()=>{
   const w=viewer.clientWidth,h=viewer.clientHeight,r=lens.clientWidth/2,ratio=(image.naturalWidth||1200)/(image.naturalHeight||800),cw=Math.min(w,h*ratio),ch=cw/ratio,x=lx*w,y=ly*h;
   lens.style.left=`${clamp(x,r,w-r)}px`;lens.style.top=`${clamp(y,r,h-r)}px`;
   lens.style.backgroundSize=`${cw*2.6}px ${ch*2.6}px`;
   lens.style.backgroundPosition=`${r-(x-(w-cw)/2)*2.6}px ${r-(y-(h-ch)/2)*2.6}px`;
  };
  on(range,'input',()=>viewer.style.setProperty('--reveal',range.value+'%'));
  on(lab.querySelector('.paper-opacity'),'input',e=>{overlay.style.opacity=+e.target.value/100;});
  on(lab.querySelector('.lens-toggle'),'click',e=>{lensOn=!lensOn;e.currentTarget.setAttribute('aria-pressed',String(lensOn));viewer.classList.toggle('lens-active',lensOn);lensPosition();if(lensOn)viewer.focus({preventScroll:true});});
  on(viewer,'pointermove',e=>{if(!lensOn)return;const rect=viewer.getBoundingClientRect();lx=clamp((e.clientX-rect.left)/rect.width,0,1);ly=clamp((e.clientY-rect.top)/rect.height,0,1);lensPosition();});
  on(viewer,'click',e=>{if(!lensOn)return;const rect=viewer.getBoundingClientRect();lx=clamp((e.clientX-rect.left)/rect.width,0,1);ly=clamp((e.clientY-rect.top)/rect.height,0,1);lensPosition();});
  on(viewer,'keydown',e=>{if(!lensOn||!e.key.startsWith('Arrow'))return;e.preventDefault();lx=clamp(lx+(e.key==='ArrowRight'?.04:e.key==='ArrowLeft'?-.04:0),0,1);ly=clamp(ly+(e.key==='ArrowDown'?.04:e.key==='ArrowUp'?-.04:0),0,1);lensPosition();});
  lab.querySelectorAll('[data-layer]').forEach(button=>on(button,'click',()=>{
   const board=button.dataset.layer==='board',src=board?`${base}assets/boards/page-${project.pages[0]}.webp`:base+project.puzzleImage;
   image.src=src;image.alt=t(board?'Orijinal proje paftası':'Proje çizimi',board?'Original project board':'Project drawing');lens.style.backgroundImage=`url('${src}')`;
   lab.querySelectorAll('[data-layer]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   lab.querySelector('.view-left').textContent=t(board?'Pafta':'Çizim',board?'Board':'Drawing');
  }));on(image,'load',lensPosition);
  const slides=[{src:base+project.puzzleImage,label:t('Çizim','Drawing')},{src:base+project.image,label:t('Görselleştirme','Visualization')},...project.pages.map((n,i)=>({src:`${base}assets/boards/page-${n}.webp`,label:`${t('Pafta','Board')} ${i+1} / ${t('Portfolyo sayfa','Portfolio page')} ${n}`}))];
  const scrub=lab.querySelector('.process-range'),output=lab.querySelector('.process-image');
  const show=()=>{const i=+scrub.value;output.src=slides[i].src;output.alt=slides[i].label;lab.querySelector('.process-caption').textContent=slides[i].label;lab.querySelector('.process-count').textContent=`${String(i+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;lab.querySelector('.process-prev').disabled=i===0;lab.querySelector('.process-next').disabled=i===slides.length-1;};
  on(scrub,'input',show);on(lab.querySelector('.process-prev'),'click',()=>{scrub.value=clamp(+scrub.value-1,0,slides.length-1);show();});on(lab.querySelector('.process-next'),'click',()=>{scrub.value=clamp(+scrub.value+1,0,slides.length-1);show();});show();
 }
 const model=document.querySelector('.model-table');
 if(model){
  const stage=model.querySelector('.model-stage'),plane=model.querySelector('.model-plane'),angle=model.querySelector('.model-angle');
  const tilt=(x,y)=>{plane.style.transform=`rotateX(${y}deg) rotateY(${x}deg)`;};
  on(stage,'pointermove',e=>{if(!motion()||e.pointerType==='touch')return;const r=stage.getBoundingClientRect();tilt(((e.clientX-r.left)/r.width-.5)*16,((e.clientY-r.top)/r.height-.5)*-10);});
  on(stage,'pointerleave',()=>tilt(+angle.value,0));on(angle,'input',()=>tilt(+angle.value,0));
  on(window,'portfolio-motion',()=>{if(!motion())tilt(0,0);});
  const detail=model.querySelector('.model-detail');
  model.querySelectorAll('.model-pin').forEach((b,i)=>on(b,'click',()=>{detail.hidden=false;detail.querySelector('img').style.transformOrigin=`${b.dataset.x}% ${b.dataset.y}%`;detail.querySelector('span').textContent=`${t('Ayrıntı','Detail')} 0${i+1}`;model.querySelectorAll('.model-pin').forEach(pin=>pin.setAttribute('aria-pressed',String(pin===b)));}));
  on(model.querySelector('.model-reset'),'click',()=>{angle.value=0;tilt(0,0);detail.hidden=true;model.querySelectorAll('.model-pin').forEach(pin=>pin.setAttribute('aria-pressed','false'));});
 }
 // Return to the same physical folder, including when opening a project directly.
 let folding=false;
 if(project){document.querySelectorAll('a[href="../../#portfolio"]').forEach(link=>on(link,'click',e=>{
  if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();if(folding)return;folding=true;
  try{sessionStorage.setItem('portfolio-return',project.id);}catch{}
  const destination=`../../#package-${project.id}`;
  if(!motion()){location.href=destination;return;}
  const sheet=document.createElement('div');sheet.className='return-sheet';sheet.style.backgroundColor=project.color;
  const img=document.createElement('img');img.src='../../'+project.puzzleImage;img.alt='';sheet.append(img);document.body.append(sheet);
  const tween=gsap.fromTo(sheet,{scale:1.15,rotation:0,opacity:0},{scale:.25,rotation:-8,opacity:1,duration:.7,ease:'power3.inOut',onComplete:()=>{location.href=destination;}});
  cleanups.push(()=>{tween.kill();sheet.remove();});
 }));}
 else{
  let returning;try{returning=sessionStorage.getItem('portfolio-return');sessionStorage.removeItem('portfolio-return');}catch{}
  if(returning&&projects.some(p=>p.id===returning)){
   const folder=document.querySelector(`#package-${returning}`);
   const frame=requestAnimationFrame(()=>{folder.scrollIntoView({block:'center',behavior:'instant'});if(motion()){const tween=gsap.fromTo(folder.querySelector('.package-cover'),{scale:1.12,rotation:-4},{scale:1,rotation:0,duration:.85,ease:'power3.out',clearProps:'transform'});cleanups.push(()=>tween.kill());}});
   cleanups.push(()=>cancelAnimationFrame(frame));
  }
  const packages=[...document.querySelectorAll('.project-package')];
  if(packages.length){const io=new IntersectionObserver(entries=>{const active=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(active){const p=projects.find(p=>p.id===active.target.dataset.project);document.querySelector('.collection').style.setProperty('--section-tint',p.color);}}, {threshold:[.2,.5,.8]});packages.forEach(p=>io.observe(p));cleanups.push(()=>io.disconnect());}
 }
 return ()=>{controller.abort();cleanups.forEach(fn=>fn());};
}
