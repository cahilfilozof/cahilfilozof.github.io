// Opt-in, local-only diagnostics. Nothing is uploaded or sent anywhere.
export function setupDiagnostics(){
 if(!new URLSearchParams(location.search).has('debug'))return;
 const events=[];const record=(type,detail='')=>{events.push({ms:Math.round(performance.now()),type,detail});if(events.length>40)events.shift();};
 addEventListener('error',e=>record('error',e.message||e.target?.src||'Asset failed'),true);
 addEventListener('unhandledrejection',e=>record('rejection',String(e.reason)));
 addEventListener('resize',()=>record('viewport',`${innerWidth}x${innerHeight}`));
 const panel=document.createElement('details');Object.assign(panel.style,{position:'fixed',bottom:'8px',left:'8px',zIndex:'2147483647',maxWidth:'min(560px,95vw)',maxHeight:'45vh',overflow:'auto',padding:'12px',background:'#fff',color:'#17251d',border:'1px solid',font:'12px/1.5 monospace'});
 panel.innerHTML='<summary>Diagnostics / Tanılama</summary><button type="button">Copy report / Raporu kopyala</button><pre style="white-space:pre-wrap"></pre>';document.body.append(panel);
 const report=()=>JSON.stringify({browser:navigator.userAgent,release:document.querySelector('script[type="module"]')?.getAttribute('src'),viewport:[innerWidth,innerHeight],devicePixelRatio,reduceMotion:matchMedia('(prefers-reduced-motion:reduce)').matches,motionPaused:document.body.classList.contains('motion-paused'),phase:document.querySelector('#puzzle-dialog')?.dataset.phase,dialogWidth:document.querySelector('#puzzle-dialog')?.clientWidth,events},null,2);
 panel.addEventListener('toggle',()=>{if(panel.open)panel.querySelector('pre').textContent=report();});
 panel.querySelector('button').addEventListener('click',async()=>{const text=report();panel.querySelector('pre').textContent=text;try{await navigator.clipboard.writeText(text);}catch{panel.querySelector('pre').textContent=text+'\nSelect and copy this text.';}});
 const observer=new MutationObserver(changes=>{for(const change of changes)record('puzzle',change.target.dataset.phase);if(panel.open)panel.querySelector('pre').textContent=report();});
 observer.observe(document.querySelector('#app'),{subtree:true,attributes:true,attributeFilter:['data-phase']});
}
