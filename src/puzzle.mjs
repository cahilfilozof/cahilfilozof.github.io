import {piecePath,topology,clamp,closeEnough} from './geometry.mjs';
import {pick,esc,arrow} from './render.mjs';
const NS='http://www.w3.org/2000/svg';
const make=(tag,attrs={})=>{const el=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el;};
export class PuzzleBoard {
  constructor({dialog,project,language,motion,onComplete,onClose}) {
    Object.assign(this,{dialog,project,language,motion,onComplete,onClose});
    this.abort=new AbortController();this.states=[];this.generation=0;this.disposed=false;this.completed=false;
    this.t=(tr,en)=>language==='en'?en:tr;
  }
  async open(opener) {
    this.opener=opener;
    const p=this.project;
    this.dialog.innerHTML=`<div class="puzzle-shell" style="--folder:${p.color}"><header class="puzzle-header"><div><span>${p.number} / ${esc(pick(p.category,this.language))}</span><h2 id="puzzle-title">${esc(pick(p.title,this.language))}</h2></div><button class="puzzle-close" aria-label="${this.t('Paketi kapat','Close package')}">${this.t('Kapat','Close')} <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" stroke="currentColor" fill="none"/></svg></button></header><p class="puzzle-instructions">${this.t('Parçaları sürükleyerek birleştir. Klavyeyle: parçayı seç, Enter ile yerleştir.','Drag each piece into place. Keyboard: focus a piece and press Enter to place it.')}</p><div class="puzzle-workspace"><svg class="puzzle-board" role="group" aria-label="${this.t('Yapboz çalışma alanı','Puzzle workspace')}"></svg><div class="opening-cover" aria-hidden="true"><span>${p.number}</span><h3>${esc(pick(p.title,this.language))}</h3><p>${esc(pick(p.category,this.language))}</p></div></div><footer class="puzzle-controls"><span class="puzzle-progress" role="status" aria-live="polite"></span><div><button class="puzzle-reset">${this.t('Sıfırla','Reset')}</button><button class="puzzle-skip button-solid">${this.t('Atla ve göster','Skip & reveal')} ${arrow()}</button></div></footer><p class="puzzle-hint" aria-live="polite"></p></div>`;
    this.svg=this.dialog.querySelector('.puzzle-board');
    this.dialog.showModal();document.body.classList.add('puzzle-active');
    this.dialog.querySelector('.puzzle-close').focus();
    this.dialog.querySelector('.puzzle-close').addEventListener('click',()=>this.close(),{signal:this.abort.signal});
    this.dialog.addEventListener('cancel',e=>{e.preventDefault();this.close();},{signal:this.abort.signal});
    this.dialog.querySelector('.puzzle-reset').addEventListener('click',()=>this.reset(),{signal:this.abort.signal});
    this.dialog.querySelector('.puzzle-skip').addEventListener('click',()=>this.skip(),{signal:this.abort.signal});
    const image=new Image();image.src=p.puzzleImage;
    const reveal=new Image();reveal.src=p.image;
    try {await image.decode();} catch {if(this.disposed)return;this.close();location.href=p.route;return;}
    if(this.disposed)return;
    this.ratio=image.naturalWidth/image.naturalHeight;
    this.layout(false);
    const cover=this.dialog.querySelector('.opening-cover');
    if(this.motion())gsap.to(cover,{rotationX:-95,y:-35,opacity:0,duration:.8,ease:'power3.inOut',onComplete:()=>cover.hidden=true});
    else cover.hidden=true;
    this.resizeObserver=new ResizeObserver(()=>{clearTimeout(this.resizeTimer);this.resizeTimer=setTimeout(()=>{if(!this.disposed&&!this.completed&&this.lastWidth!==Math.round(this.dialog.clientWidth))this.layout(true);},160);});
    this.resizeObserver.observe(this.dialog);
    this.armHint();
  }
  layout(preserve) {
    if(!this.ratio||this.disposed)return;
    this.cancelAnimation();
    const old=this.states;this.lastWidth=Math.round(this.dialog.clientWidth);
    const mobile=this.lastWidth<640;
    const {cols,rows}=topology(this.lastWidth,this.project.pieceCount);
    const W=mobile?600:1200,H=mobile?800:700;
    let tw=mobile?420:520,th=tw/this.ratio;
    const maxH=mobile?295:345;if(th>maxH){th=maxH;tw=th*this.ratio;}
    const x=(W-tw)/2,y=mobile?35:(H-th)/2-30,cw=tw/cols,ch=th/rows;
    this.metrics={W,H,x,y,tw,th,cw,ch,cols,rows,mobile};
    this.svg.setAttribute('viewBox',`0 0 ${W} ${H}`);this.svg.replaceChildren();
    const defs=make('defs');this.svg.append(defs);
    const ghost=make('image',{href:this.project.puzzleImage,x,y,width:tw,height:th,opacity:.09,preserveAspectRatio:'none'});this.svg.append(ghost);
    this.whole=make('image',{href:this.project.puzzleImage,x,y,width:tw,height:th,opacity:0,preserveAspectRatio:'none',class:'puzzle-whole'});
    this.states=[];
    for(let i=0;i<cols*rows;i++) {
      const c=i%cols,r=Math.floor(i/cols),path=piecePath(c,r,cols,rows,tw,th,x,y),id=`clip-${this.project.id}-${i}`;
      const clip=make('clipPath',{id,clipPathUnits:'userSpaceOnUse'});clip.append(make('path',{d:path}));defs.append(clip);
      const target=make('path',{d:path,class:'puzzle-target','data-target':i,fill:'none',stroke:'#253f37','stroke-opacity':.18,'stroke-width':1.2});this.svg.append(target);
      const group=make('g',{class:'puzzle-piece',tabindex:0,role:'button','aria-label':`${this.t('Parçayı yerleştir','Place piece')} ${i+1}`,'data-piece':i});
      const image=make('image',{href:this.project.puzzleImage,x,y,width:tw,height:th,'clip-path':`url(#${id})`,preserveAspectRatio:'none','pointer-events':'none'});
      group.append(image,make('path',{d:path,fill:'transparent',stroke:'#f2eee6','stroke-width':2.5,class:'piece-outline'}));
      const state={group,target,i,c,r,dx:0,dy:0,rotation:0,locked:preserve&&old.length===cols*rows&&old[i]?.locked,cx:x+(c+.5)*cw,cy:y+(r+.5)*ch};
      this.states.push(state);this.svg.append(group);this.bindPiece(state);
      const destination=this.scatter(state);
      if(state.locked){this.lockAttributes(state);this.transform(state);}
      else if(!preserve&&this.motion()) {
        gsap.to(state,{...destination,duration:.8,delay:.45+i*.045,ease:'power3.out',onUpdate:()=>this.transform(state)});
      } else {Object.assign(state,destination);this.transform(state);}
    }
    ghost.setAttribute('pointer-events','none');this.whole.setAttribute('pointer-events','none');
    this.svg.append(this.whole);this.progress();
  }
  scatter(s) {
    const m=this.metrics,pad=Math.max(m.cw,m.ch)*.15;
    let px,py;
    if(m.mobile) {px=55+(s.i%2)*280;py=415+Math.floor(s.i/2)*190;}
    else {px=s.i%2?m.W-m.cw-pad-40:pad+40;py=45+Math.floor(s.i/2)*((m.H-m.ch-100)/Math.max(1,Math.ceil(this.states.length/2)-1));}
    // Deterministic scattering keeps every piece inside the visible SVG.
    if(!m.mobile){const n=m.cols*m.rows;py=45+Math.floor(s.i/2)*((m.H-m.ch-100)/Math.max(1,Math.ceil(n/2)-1));}
    px=clamp(px,pad,m.W-m.cw-pad);py=clamp(py,pad,m.H-m.ch-pad);
    return {dx:px-(m.x+s.c*m.cw),dy:py-(m.y+s.r*m.ch),rotation:this.motion()?(s.i%2?4:-4):0};
  }
  transform(s){s.group.setAttribute('transform',`translate(${s.dx} ${s.dy}) rotate(${s.rotation} ${s.cx} ${s.cy})`);}
  point(event){const p=new DOMPoint(event.clientX,event.clientY);return p.matrixTransform(this.svg.getScreenCTM().inverse());}
  bindPiece(s) {
    const opts={signal:this.abort.signal};
    s.group.addEventListener('pointerdown',e=>{
      if(s.locked||this.completed||e.button>0)return;
      e.preventDefault();this.armHint();gsap.killTweensOf(s);this.svg.append(s.group);
      const p=this.point(e);s.drag={id:e.pointerId,x:p.x-s.dx,y:p.y-s.dy};s.group.setPointerCapture(e.pointerId);
      s.group.classList.add('dragging');s.rotation=0;this.transform(s);
    },opts);
    s.group.addEventListener('pointermove',e=>{
      if(!s.drag||s.drag.id!==e.pointerId)return;e.preventDefault();const p=this.point(e),m=this.metrics,pad=Math.max(m.cw,m.ch)*.14;
      s.dx=clamp(p.x-s.drag.x,pad-(m.x+s.c*m.cw),m.W-pad-(m.x+(s.c+1)*m.cw));
      s.dy=clamp(p.y-s.drag.y,pad-(m.y+s.r*m.ch),m.H-pad-(m.y+(s.r+1)*m.ch));
      s.target.classList.toggle('near',closeEnough(s.dx,s.dy,Math.min(m.cw,m.ch)*.38));this.transform(s);
    },opts);
    const end=e=>{if(!s.drag)return;s.drag=null;s.group.classList.remove('dragging');s.target.classList.remove('near');if(s.group.hasPointerCapture(e.pointerId))s.group.releasePointerCapture(e.pointerId);if(closeEnough(s.dx,s.dy,Math.min(this.metrics.cw,this.metrics.ch)*.38))this.snap(s);};
    s.group.addEventListener('pointerup',end,opts);s.group.addEventListener('pointercancel',e=>{s.drag=null;s.group.classList.remove('dragging');s.target.classList.remove('near');},opts);
    s.group.addEventListener('keydown',e=>{
      if(s.locked||this.completed)return;
      if(e.key==='Enter'||e.key===' '){e.preventDefault();this.snap(s);this.states.find(p=>!p.locked)?.group.focus();}
      else if(e.key.startsWith('Arrow')){
        e.preventDefault();gsap.killTweensOf(s);const step=e.shiftKey?4:15,m=this.metrics,pad=Math.max(m.cw,m.ch)*.14;
        s.dx=clamp(s.dx+(e.key==='ArrowRight'?step:e.key==='ArrowLeft'?-step:0),pad-(m.x+s.c*m.cw),m.W-pad-(m.x+(s.c+1)*m.cw));
        s.dy=clamp(s.dy+(e.key==='ArrowDown'?step:e.key==='ArrowUp'?-step:0),pad-(m.y+s.r*m.ch),m.H-pad-(m.y+(s.r+1)*m.ch));
        this.transform(s);this.armHint();
      }
    },opts);
    s.group.addEventListener('focus',()=>s.target.classList.add('near'),opts);s.group.addEventListener('blur',()=>s.target.classList.remove('near'),opts);
  }
  lockAttributes(s){s.group.setAttribute('tabindex','-1');s.group.setAttribute('aria-disabled','true');s.group.classList.add('placed');s.target.classList.remove('near');}
  snap(s,delay=0) {
    if(s.locked||this.disposed)return;s.locked=true;this.lockAttributes(s);gsap.killTweensOf(s);
    const duration=this.motion()?.28:0;
    gsap.to(s,{dx:0,dy:0,rotation:0,duration,delay,ease:'power3.out',onUpdate:()=>this.transform(s),onComplete:()=>{if(!this.disposed)this.checkCompletion();}});
    this.progress();this.armHint();
  }
  progress(){const count=this.states.filter(s=>s.locked).length;this.dialog.querySelector('.puzzle-progress').textContent=`${String(count).padStart(2,'0')} / ${String(this.states.length).padStart(2,'0')} ${this.t('parça yerleştirildi','pieces placed')}`;}
  checkCompletion(){if(this.completed||!this.states.every(s=>s.locked&&Math.abs(s.dx)<.1&&Math.abs(s.dy)<.1))return;this.completed=true;clearTimeout(this.hintTimer);this.dialog.querySelector('.puzzle-hint').textContent=this.t('Parçalar bir arada. Peyzaj ortaya çıkıyor.','The pieces connect. A landscape emerges.');this.completionTimer=setTimeout(()=>this.reveal(),this.motion()?450:0);}
  skip(){if(this.completed)return;this.states.forEach((s,i)=>this.snap(s,this.motion()?i*.045:0));}
  reset(){this.completed=false;this.generation++;this.cancelAnimation();this.whole?.setAttribute('opacity',0);this.states.forEach(s=>{s.locked=false;s.group.classList.remove('placed');s.group.setAttribute('tabindex','0');s.group.removeAttribute('aria-disabled');s.group.style.opacity='';Object.assign(s,this.scatter(s));this.transform(s);});this.progress();this.dialog.querySelector('.puzzle-hint').textContent='';this.armHint();}
  reveal(){if(this.disposed)return;const gen=this.generation;const finish=()=>{if(this.disposed||gen!==this.generation)return;this.onComplete(this.project);};
    if(!this.motion()){this.whole.setAttribute('opacity','1');finish();return;}
    const tl=gsap.timeline({onComplete:finish});this.revealTimeline=tl;
    tl.to(this.whole,{attr:{opacity:1},duration:.35}).to(this.states.map(s=>s.group),{opacity:0,duration:.3},'<');
    const transitions={garden:{scale:1.055,y:-25},soft:{scale:1.025},horizontal:{xPercent:12,scale:1.04},zoom:{scale:1.2},drawing:{clipPath:'inset(0 0 100% 0)'},layers:{yPercent:-12,scale:1.08}};
    tl.to(this.svg,{...transitions[this.project.transition],opacity:.15,duration:.65,ease:'power3.inOut'},'+=.2');
  }
  armHint(){clearTimeout(this.hintTimer);this.states.forEach(s=>s.target.classList.remove('hint'));if(this.completed)return;this.hintTimer=setTimeout(()=>{if(this.disposed)return;const s=this.states.find(s=>!s.locked);if(s){s.target.classList.add('hint');this.dialog.querySelector('.puzzle-hint').textContent=this.t('İpucu: parçayı soluk çizime yaklaştır. Dilersen atlayabilirsin.','Hint: move a piece toward its faint outline. You can skip at any time.');}},6500);}
  cancelAnimation(){clearTimeout(this.completionTimer);this.revealTimeline?.kill();this.states.forEach(s=>gsap.killTweensOf(s));if(this.svg)gsap.set(this.svg,{clearProps:'all'});}
  close(){if(this.disposed)return;this.dispose();this.dialog.close();document.body.classList.remove('puzzle-active');this.opener?.focus({preventScroll:true});this.onClose?.();}
  dispose(){this.disposed=true;this.generation++;this.cancelAnimation();clearTimeout(this.hintTimer);clearTimeout(this.resizeTimer);this.resizeObserver?.disconnect();this.abort.abort();gsap.killTweensOf(this.dialog.querySelector('.opening-cover'));}
}
