(() => {
  const language = window.portfolioLanguage;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const motionButton = document.querySelector('#motion-toggle');
  let paused = false;
  try { paused = localStorage.getItem('portfolio-motion') === 'paused'; } catch {}
  let lenis, animationContext, ticker;
  const animationsAllowed = () => !reduced.matches && !paused;
  window.portfolioMotion = { get enabled() { return animationsAllowed(); } };
  const contours = document.querySelector('#contours');
  for (let ring = 0; ring < 34; ring++) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let d = '';
    for (let step = 0; step <= 180; step++) {
      const a = step / 180 * Math.PI * 2;
      const r = 45 + ring * 14 + Math.sin(a * 3 + ring * .045) * (12 + ring * 1.4) + Math.cos(a * 5) * 9;
      d += `${step ? 'L' : 'M'}${(580 + Math.cos(a) * r).toFixed(1)},${(390 + Math.sin(a) * r * .77 + Math.cos(a * 2) * 28).toFixed(1)} `;
    }
    path.setAttribute('d', d + 'Z');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', ring % 5 === 0 ? '1.4' : '.65');
    contours.append(path);
  }
  const dialog = document.querySelector('#project-dialog');
  const closeButton = dialog.querySelector('.dialog-close');
  const works = [...document.querySelectorAll('.work-item')];
  let projectIndex = 0, opener, imageTransition;
  const text = (tr, en) => language.text(tr, en);
  function populateProject() {
    const work = works[projectIndex];
    const source = work.querySelector('img');
    document.querySelector('#dialog-title').textContent = work.querySelector('h3').textContent;
    document.querySelector('#dialog-type').textContent = work.querySelector('.work-labels').textContent.replace(/\s+/g, ' ').trim();
    const image = document.querySelector('#dialog-image');
    image.src = source.src;
    image.alt = source.alt;
    document.querySelector('#dialog-description').textContent = work.querySelector('p').textContent.trim();
    dialog.dataset.project = projectIndex;
  }
  function openProject(index, button) {
    projectIndex = index;
    opener = button;
    populateProject();
    const from = works[index].querySelector('img').getBoundingClientRect();
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
    lenis?.stop();
    closeButton.focus();
    if (animationsAllowed()) {
      const target = document.querySelector('#dialog-image');
      const to = target.getBoundingClientRect();
      imageTransition?.cancel();
      imageTransition = target.animate([
        { transformOrigin: 'top left', transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`, borderRadius: '12px' },
        { transformOrigin: 'top left', transform: 'translate(0,0) scale(1)', borderRadius: '0' }
      ], { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
  }
  works.forEach((work, index) => {
    work.dataset.project = index;
    const button = document.createElement('button');
    button.className = 'project-open';
    button.innerHTML = '<span></span>';
    work.querySelector('.work-visual').append(button);
    button.addEventListener('click', () => openProject(index, button));
  });
  function updateLabels() {
    works.forEach(work => {
      const button = work.querySelector('.project-open');
      button.querySelector('span').textContent = text('Projeyi keşfet ↗', 'Explore project ↗');
      button.setAttribute('aria-label', `${text('Projeyi keşfet:', 'Explore project:')} ${work.querySelector('h3').textContent}`);
    });
    motionButton.textContent = animationsAllowed() ? text('Hareketi durdur', 'Pause motion') : text('Hareketi başlat', 'Resume motion');
    motionButton.setAttribute('aria-pressed', String(!animationsAllowed()));
    motionButton.disabled = reduced.matches;
    motionButton.title = reduced.matches ? text('Cihazınızın azaltılmış hareket tercihi etkin.', 'Your device’s reduced-motion preference is active.') : '';
    if (dialog.open) populateProject();
    window.ScrollTrigger?.refresh();
  }
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    imageTransition?.cancel();
    document.body.classList.remove('modal-open');
    lenis?.start();
    opener?.focus({ preventScroll: true });
  });
  function changeProject(direction) {
    imageTransition?.cancel();
    projectIndex = (projectIndex + direction + works.length) % works.length;
    populateProject();
    dialog.scrollTop = 0;
    if (animationsAllowed()) dialog.querySelector('.dialog-content').animate([{ opacity: .3, transform: `translateX(${direction * 24}px)` }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'ease-out' });
  }
  document.querySelector('#previous-project').addEventListener('click', () => changeProject(-1));
  document.querySelector('#next-project').addEventListener('click', () => changeProject(1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); changeProject(event.key === 'ArrowRight' ? 1 : -1); }
  });
  function configureMotion() {
    animationContext?.revert();
    if (ticker) window.gsap?.ticker.remove(ticker);
    lenis?.destroy();
    lenis = null;
    document.body.classList.toggle('motion-paused', !animationsAllowed());
    if (animationsAllowed() && window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      if (window.Lenis && finePointer.matches) {
        lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: { offset: -90 }, prevent: node => !!node.closest('#project-dialog') });
        lenis.on('scroll', ScrollTrigger.update);
        ticker = time => lenis?.raf(time * 1000);
        gsap.ticker.add(ticker);
        if (dialog.open) lenis.stop();
      }
      animationContext = gsap.context(() => {
        gsap.from('.hero-title h1', { y: 65, opacity: 0, duration: 1.3, ease: 'power3.out' });
        gsap.from('.hero-top, .edition, .terrain-caption, .landscape-controls', { opacity: 0, y: 18, duration: .9, stagger: .1, delay: .15 });
        works.forEach(work => {
          gsap.from(work.querySelector('.work-heading'), { y: 36, opacity: 0, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: work, start: 'top 92%', once: true } });
          const visual = work.querySelector('.work-visual');
          gsap.fromTo(visual, { clipPath: 'inset(8% 6% 8% 6% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 4px)', ease: 'none', scrollTrigger: { trigger: visual, start: 'top 94%', end: 'top 30%', scrub: .7 } });
        });
        gsap.fromTo('.journey-route path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '#selected-works', start: 'top 75%', end: 'bottom 75%', scrub: .6 } });
        gsap.to('.landscape-marquee > div', { xPercent: -20, ease: 'none', scrollTrigger: { trigger: '.landscape-marquee', start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.from('.about-tag', { rotation: -8, y: 45, ease: 'none', scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'top 25%', scrub: 1 } });
      });
    }
    updateLabels();
    document.dispatchEvent(new CustomEvent('motionchange'));
  }
  motionButton.addEventListener('click', () => { paused = !paused; try { localStorage.setItem('portfolio-motion', paused ? 'paused' : 'playing'); } catch {} configureMotion(); });
  reduced.addEventListener('change', configureMotion);
  finePointer.addEventListener('change', configureMotion);
  document.addEventListener('languagechange', updateLabels);
  document.querySelectorAll('.work-visual img').forEach(image => image.addEventListener('load', () => window.ScrollTrigger?.refresh(), { once: true }));
  configureMotion();
  const cursor = document.querySelector('.project-cursor');
  works.forEach(work => {
    const visual = work.querySelector('.work-visual');
    visual.addEventListener('pointermove', event => {
      if (!finePointer.matches || !animationsAllowed()) return;
      cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      cursor.classList.add('visible');
      const bounds = visual.getBoundingClientRect();
      visual.style.setProperty('--pointer-x', `${(event.clientX - bounds.left) / bounds.width * 100}%`);
      visual.style.setProperty('--pointer-y', `${(event.clientY - bounds.top) / bounds.height * 100}%`);
    });
    visual.addEventListener('pointerleave', () => cursor.classList.remove('visible'));
    visual.addEventListener('click', () => cursor.classList.remove('visible'));
  });
  document.querySelectorAll('.btn, .round-arrow, .language-toggle').forEach(button => {
    button.addEventListener('pointermove', event => {
      if (!animationsAllowed() || !finePointer.matches || !window.gsap) return;
      const r = button.getBoundingClientRect();
      gsap.to(button, { x: (event.clientX - r.left - r.width / 2) * .12, y: (event.clientY - r.top - r.height / 2) * .16, duration: .35 });
    });
    button.addEventListener('pointerleave', () => window.gsap?.to(button, { x: 0, y: 0, duration: .5 }));
  });
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.nav-links a').forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }), { rootMargin: '-15% 0px -65% 0px' });
  document.querySelectorAll('main > section[id]').forEach(section => sectionObserver.observe(section));
})();
