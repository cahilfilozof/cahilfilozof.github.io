// Launchfolio-inspired rhythm, adapted to the portfolio's existing GSAP lifecycle.
// All generated wrappers are reversible; readable content exists before animation.
export function setupEditorialMotion({language,motion}) {
 const restorations=[],abort=new AbortController();let context;
 const headings=[...document.querySelectorAll('.hero-copy h1,.case-heading h1,main h2')];
 headings.forEach(heading=>{
  const original=heading.innerHTML;restorations.push(()=>heading.innerHTML=original);
  const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim())fragment.append(document.createTextNode(word));else{const span=document.createElement('span');span.className='reveal-word';span.textContent=word;fragment.append(span);}});node.replaceWith(fragment);});
 });
 document.querySelectorAll('.button-outline,.text-link,.package-action-primary').forEach(link=>{
  const node=[...link.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());if(!node)return;
  const label=document.createElement('span');label.className='rolling-label';const original=node.textContent;
  label.innerHTML='<span></span><span aria-hidden="true"></span>';label.querySelectorAll('span').forEach(span=>span.textContent=original.trim());node.replaceWith(label);
  restorations.push(()=>label.replaceWith(document.createTextNode(original)));
 });
 const contact=document.querySelector('.contact');let reel;
 if(contact){
  const words=language==='en'?['Places.','Stories.','Connections.']:['Mekânlar.','Hikâyeler.','Bağlantılar.'];
  reel=document.createElement('div');reel.className='contact-reel';reel.setAttribute('aria-hidden','true');
  words.forEach((word,i)=>{const span=document.createElement('span');span.textContent=word;span.className=i===0?'is-first':'';reel.append(span);});contact.prepend(reel);restorations.push(()=>reel.remove());
 }
 const header=document.querySelector('.site-header');
 const start=()=>{
  context?.revert();header.classList.remove('header-condensed');
  if(!motion())return;
  context=gsap.context(()=>{
   headings.forEach(heading=>gsap.from(heading.querySelectorAll('.reveal-word'),{y:18,opacity:0,filter:'blur(5px)',duration:.8,stagger:.055,ease:'power3.out',scrollTrigger:{trigger:heading,start:'top 93%',once:true},onComplete(){gsap.set(heading.querySelectorAll('.reveal-word'),{clearProps:'filter,transform,opacity'});}}));
   document.querySelectorAll('.case-render,.board-figure,.case-facts,.cv-group').forEach(el=>gsap.from(el,{y:32,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
   ScrollTrigger.create({start:100,end:'max',onUpdate:self=>header.classList.toggle('header-condensed',self.scroll()>100)});
   if(reel){
    const words=[...reel.children];gsap.set(words,{yPercent:110,opacity:0});gsap.set(words[0],{yPercent:0,opacity:1});
    const cycle=gsap.timeline({repeat:-1,paused:true});
    words.forEach((word,i)=>cycle.to(word,{yPercent:-110,opacity:0,duration:.65,ease:'power3.inOut'},i*3+2.35).fromTo(words[(i+1)%words.length],{yPercent:110,opacity:0},{yPercent:0,opacity:1,duration:.65,ease:'power3.inOut',immediateRender:false},i*3+2.35));
    ScrollTrigger.create({trigger:contact,start:'top bottom',end:'bottom top',onToggle:self=>self.isActive?cycle.play():cycle.pause()});
   }
  });
 };
 window.addEventListener('portfolio-motion',start,{signal:abort.signal});start();
 return ()=>{abort.abort();context?.revert();header.classList.remove('header-condensed');restorations.reverse().forEach(restore=>restore());};
}
