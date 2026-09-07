(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const board = $('#board');
  const content = $('#content');
  const stage = $('#stage');
  const boardShell = $('#boardShell');
  const toast = $('#toast');
  const drawer = $('#drawer');

  const setup = {
    size: $('#size'),
    orientation: $('#orientation'),
    guideColumns: $('#guideColumns'),
    margin: $('#margin'),
    gap: $('#gap'),
    theme: $('#theme'),
    accent: $('#accent')
  };

  const editor = {
    title: $('#drawerTitle'),
    text: $('#moduleText'),
    width: $('#moduleWidth'),
    height: $('#moduleHeight'),
    x: $('#moduleX'),
    y: $('#moduleY'),
    align: $('#moduleAlign'),
    border: $('#moduleBorder'),
    fit: $('#fit')
  };

  const singleImageTools = $('#singleImageTools');
  const multiImageTools = $('#multiImageTools');
  const replaceImage = $('#replaceImage');
  const replaceImages = $('#replaceImages');
  const addImages = $('#addImages');

  const GRID_COLS = 12;
  const GRID_ROWS = 16;

  let selectedId = null;
  let activeTemplate = 'balanced';
  let zoom = .72;
  let counter = 0;

  const singleImageTypes = new Set(['image', 'analysis', 'section']);
  const multiImageTypes = new Set(['beforeafter', 'photostrip']);

  const moduleDefaults = {
    heading: { type: 'heading', w: 6, h: 3, x: 1, y: 1, text: 'PROJECT TITLE\nLandscape Architecture Studio', align: 'end' },
    text: { type: 'text', w: 4, h: 3, x: 1, y: 1, text: 'DESIGN INTENT\nUse this block for a short project statement, design decision, or jury explanation.', align: 'start' },
    image: { type: 'image', w: 6, h: 6, x: 1, y: 1, text: 'Master Plan / Perspective', image: '', fit: 'cover', align: 'center' },
    analysis: { type: 'analysis', w: 4, h: 5, x: 1, y: 1, text: 'Analysis Map', image: '', fit: 'contain', align: 'center' },
    diagram: { type: 'diagram', w: 4, h: 3, x: 1, y: 1, text: 'ANALYZE|CONNECT|TRANSFORM', align: 'center' },
    timeline: { type: 'timeline', w: 8, h: 3, x: 1, y: 1, text: '1890:Early industry|1958:Port transformation|1980:Urban expansion|2026:Reconnection', align: 'center' },
    objectives: { type: 'objectives', w: 4, h: 6, x: 1, y: 1, text: 'Reclaim the urban void:Transform underused space into active public landscape|Ecology as infrastructure:Use rainwater and planting systems as spatial structure|Strengthen connectivity:Reconnect pedestrian and ecological flows|Activate public life:Support gathering, play, culture and everyday use', align: 'start' },
    strategy: { type: 'strategy', w: 4, h: 6, x: 1, y: 1, text: 'STRATEGIES\nP.1|Create a continuous pedestrian-green corridor\nP.2|Reconnect fragmented open spaces\nP.3|Introduce flexible public programs\nP.4|Strengthen ecological continuity', align: 'start' },
    swot: { type: 'swot', w: 4, h: 5, x: 1, y: 1, text: 'Strengths:Access, identity, existing green assets|Weaknesses:Fragmentation, barriers, low continuity|Opportunities:Green corridors, adaptive reuse, public space|Threats:Development pressure, privatization, ecological loss', align: 'start' },
    legend: { type: 'legend', w: 3, h: 4, x: 1, y: 1, text: 'LEGEND\nPublic green:#819a79|Mixed use:#cda36a|Water:#8db8c7|Pedestrian:#d9c7a6|Ecological corridor:#58735f', align: 'start' },
    materials: { type: 'materials', w: 3, h: 5, x: 1, y: 1, text: 'MATERIAL LEGEND\nGrass groundcover|Timber deck board|Concrete|Natural stone|Permeable paving', align: 'start' },
    schedule: { type: 'schedule', w: 5, h: 5, x: 1, y: 1, text: 'PLANT SCHEDULE\nAcer campestre|Hedge Maple|8|Deciduous\nTilia tomentosa|Silver Linden|11|Deciduous\nLavandula angustifolia|Lavender|24|Evergreen\nViburnum tinus|Laurustinus|18|Evergreen', align: 'start' },
    section: { type: 'section', w: 6, h: 3, x: 1, y: 1, text: 'A–A’ SECTION', image: '', fit: 'contain', align: 'center' },
    beforeafter: { type: 'beforeafter', w: 6, h: 6, x: 1, y: 1, text: 'Before|After', images: [], align: 'center' },
    photostrip: { type: 'photostrip', w: 6, h: 3, x: 1, y: 1, text: 'Atmosphere / Renders', images: [], align: 'center' },
    callouts: { type: 'callouts', w: 8, h: 4, x: 1, y: 1, text: 'Stage:Flexible events and performances|Socialization:Daily gathering and interaction|Urban Furniture:Pause, sit and meet|Eco-Amphitheater:Topography-led gathering|Wooden Deck:Flexible activity surface|Market:Local production and temporary sales|Bioswale:Rainwater collection and filtration|Play:Active recreation', align: 'center' },
    palette: { type: 'palette', w: 4, h: 2, x: 1, y: 1, text: 'Planting / Material Palette', align: 'end' },
    meta: { type: 'meta', w: 4, h: 3, x: 1, y: 1, text: 'Location:Bursa, Türkiye|Studio:Landscape Design|Scale:1:500|Year:2026|Software:AutoCAD · ArcGIS · SketchUp|Author:Student Name', align: 'end' },
    north: { type: 'north', w: 2, h: 2, x: 1, y: 1, text: '0|5|10|20 m', align: 'center' }
  };

  const templates = {
    balanced: {
      name: 'Balanced Jury', category: 'design', description: 'Plan, perspective, concept and section in one clear jury board.',
      modules: [
        ['heading',1,1,7,3], ['meta',9,1,4,3],
        ['image',1,4,7,8,'Master Plan'], ['image',9,4,4,5,'Key Perspective'],
        ['text',9,9,4,3], ['diagram',1,12,4,4], ['section',5,12,5,4,'A–A’ Section'], ['palette',10,12,3,2]
      ]
    },
    masterplan: {
      name: 'Masterplan Focus', category: 'design', description: 'Very large plan with compact legend, metadata and section strip.',
      modules: [
        ['heading',1,1,8,2], ['meta',10,1,3,2],
        ['image',1,3,9,11,'1:500 Landscape Plan'], ['legend',10,3,3,6], ['north',10,9,3,2],
        ['section',1,14,8,3,'A–A’ Section'], ['palette',10,12,3,2], ['text',10,14,3,3]
      ]
    },
    renderstory: {
      name: 'Render Narrative', category: 'portfolio', description: 'Large hero perspective with supporting views and short narrative.',
      modules: [
        ['heading',1,1,7,2], ['meta',9,1,4,2],
        ['image',1,3,12,8,'Hero Perspective'],
        ['photostrip',1,11,8,3], ['text',9,11,4,3], ['objectives',1,14,7,3], ['palette',9,14,4,2]
      ]
    },
    analysisatlas: {
      name: 'Analysis Atlas', category: 'analysis', description: 'Dense analysis set inspired by jury mapping boards.',
      modules: [
        ['heading',1,1,8,2], ['text',9,1,4,2],
        ['analysis',1,3,4,5,'Solid–Void'], ['analysis',5,3,4,5,'Land Use'], ['analysis',9,3,4,5,'Green Network'],
        ['analysis',1,8,5,5,'Circulation'], ['analysis',6,8,4,5,'Hydrology / Climate'], ['swot',10,8,3,5],
        ['legend',1,13,4,4], ['diagram',5,13,5,4], ['meta',10,13,3,4]
      ]
    },
    heritage: {
      name: 'Heritage + Timeline', category: 'analysis', description: 'Location, urban development, historical timeline and cultural mapping.',
      modules: [
        ['heading',1,1,8,2], ['meta',10,1,3,2],
        ['analysis',1,3,4,5,'Location'], ['timeline',5,3,8,3],
        ['photostrip',1,8,7,3], ['text',8,6,5,5],
        ['analysis',1,11,4,5,'Cultural Heritage'], ['analysis',5,11,4,5,'Attraction Points'], ['legend',9,11,4,5]
      ]
    },
    solidvoid: {
      name: 'Solid–Void + Land Use', category: 'analysis', description: 'Urban morphology, vacant land, land use and explanatory text.',
      modules: [
        ['heading',1,1,8,2], ['meta',10,1,3,2],
        ['analysis',1,3,5,6,'Solid–Void'], ['analysis',7,3,6,8,'Land Use'],
        ['analysis',1,9,5,5,'Vacant Areas'], ['text',7,11,4,3], ['legend',11,11,2,5],
        ['section',1,14,6,3,'Urban Section'], ['north',8,14,2,2]
      ]
    },
    strategy: {
      name: 'Strategy Masterplan', category: 'planning', description: 'Large strategic map, numbered interventions, sections and atmosphere strip.',
      modules: [
        ['heading',1,1,7,2], ['text',9,1,4,2],
        ['image',1,3,8,11,'Strategic Masterplan'], ['strategy',9,3,4,7],
        ['photostrip',9,10,4,4], ['section',1,14,8,3,'Strategic Sections'], ['north',10,14,3,2]
      ]
    },
    development: {
      name: 'Design Development', category: 'design', description: 'Before/after comparison, objectives, inspiration and concept logic.',
      modules: [
        ['heading',1,1,8,2], ['meta',10,1,3,2],
        ['beforeafter',1,3,7,8], ['objectives',9,3,4,6],
        ['analysis',9,9,4,4,'Inspiration / Texture'], ['diagram',1,11,7,3], ['text',1,14,8,3], ['palette',10,14,3,2]
      ]
    },
    plancallouts: {
      name: 'Plan + Function Callouts', category: 'design', description: 'Large function plan with icon-style program explanation below.',
      modules: [
        ['heading',1,1,8,2], ['meta',10,1,3,2],
        ['image',1,3,12,10,'1:500 Function Plan'], ['callouts',1,13,12,4]
      ]
    },
    plansections: {
      name: 'Plan + Sections', category: 'technical', description: 'Clean plan-led technical board with two major sections and legend.',
      modules: [
        ['heading',1,1,8,2], ['north',11,1,2,2],
        ['image',1,3,9,10,'1:500 Texture / Construction Plan'], ['materials',10,3,3,6],
        ['section',1,13,6,4,'A–A’ Section'], ['section',7,13,6,4,'B–B’ Section']
      ]
    },
    planting: {
      name: 'Planting Plan', category: 'technical', description: 'Planting plan with species schedule, legend and north/scale graphics.',
      modules: [
        ['heading',1,1,8,2,'1:500 PLANTING PLAN\nLandscape Architecture Studio'], ['north',11,1,2,2],
        ['image',1,3,8,11,'Planting Plan'], ['schedule',9,3,4,8],
        ['legend',9,11,4,4], ['palette',1,14,5,3], ['meta',6,14,3,3]
      ]
    },
    construction: {
      name: 'Construction Details', category: 'technical', description: 'Construction plan, material legend and a strip of detailed sections.',
      modules: [
        ['heading',1,1,8,2,'1:200 CONSTRUCTION PLAN\nLandscape Construction'], ['north',11,1,2,2],
        ['image',1,3,9,10,'Construction Plan'], ['materials',10,3,3,7],
        ['section',1,13,4,4,'Detail 01'], ['section',5,13,4,4,'Detail 02'], ['section',9,13,4,4,'Detail 03']
      ]
    },
    sectionsrenders: {
      name: 'Sections + Renders', category: 'technical', description: 'Overview plan, design-function diagrams, zoom details and sections.',
      modules: [
        ['heading',1,1,7,2], ['meta',9,1,4,2],
        ['analysis',1,3,6,6,'Detail Location Plan'], ['section',8,3,5,3,'DT_1 Section'], ['section',8,6,5,3,'DT_2 Section'],
        ['diagram',1,9,6,4], ['section',8,9,5,3,'DT_3 Section'], ['photostrip',1,13,7,4], ['text',8,12,5,5]
      ]
    },
    functionplan: {
      name: 'Function Plan', category: 'design', description: 'Landscape plan with graphic function callouts and program descriptions.',
      modules: [
        ['heading',1,1,8,2,'FUNCTION PLAN\nLandscape Architecture Studio'], ['meta',10,1,3,2],
        ['image',1,3,12,10,'1:500 Function Plan'], ['callouts',1,13,12,4]
      ]
    },
    competition: {
      name: 'Competition Minimal', category: 'portfolio', description: 'Dramatic image hierarchy with minimal text and strong negative space.',
      modules: [
        ['heading',1,1,8,3], ['meta',10,1,3,3],
        ['image',1,4,12,8,'Main Competition Visual'],
        ['text',1,12,4,3], ['diagram',5,12,4,3], ['section',9,12,4,3,'Key Section'], ['palette',9,15,4,2]
      ]
    },
    editorial: {
      name: 'Editorial Portfolio', category: 'portfolio', description: 'Clean portfolio spread with one dominant image and quiet supporting pieces.',
      modules: [
        ['heading',1,1,6,3], ['text',8,1,5,3],
        ['image',1,4,8,8,'Main Project Image'], ['image',10,4,3,4,'Detail'], ['image',10,8,3,4,'Perspective'],
        ['section',1,12,7,3,'Section / Elevation'], ['palette',9,13,4,2], ['meta',9,15,4,2]
      ]
    },
    jurygrid: {
      name: 'Dense Jury Grid', category: 'planning', description: 'Multi-map, multi-diagram layout for analysis-heavy studio juries.',
      modules: [
        ['heading',1,1,8,2], ['meta',10,1,3,2],
        ['analysis',1,3,4,4,'Urban Development'], ['analysis',5,3,4,4,'Green Areas'], ['analysis',9,3,4,4,'Circulation'],
        ['analysis',1,7,4,4,'Topography'], ['analysis',5,7,4,4,'Blue Infrastructure'], ['analysis',9,7,4,4,'User / Activity'],
        ['diagram',1,11,4,3], ['swot',5,11,4,3], ['strategy',9,11,4,3], ['section',1,14,6,3,'A–A’'], ['section',7,14,6,3,'B–B’']
      ]
    }
  };

  function uid() { counter += 1; return `m-${Date.now()}-${counter}`; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, Number(v))); }
  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
      .replaceAll('"','&quot;').replaceAll("'",'&#039;');
  }
  function alignFlex(value) { return value === 'center' ? 'center' : value === 'end' ? 'flex-end' : 'flex-start'; }

  function createModule(type, overrides = {}) {
    const base = structuredClone(moduleDefaults[type]);
    const model = { id: uid(), border: false, ...base, ...overrides };
    normalizePosition(model);

    const el = document.createElement('section');
    el.className = 'module';
    el.draggable = true;
    el.dataset.id = model.id;
    el.dataset.type = model.type;
    el._m = model;
    renderModule(el);
    attachModuleEvents(el);
    return el;
  }

  function normalizePosition(m) {
    m.w = clamp(m.w || 4, 1, GRID_COLS);
    m.h = clamp(m.h || 3, 1, GRID_ROWS);
    m.x = clamp(m.x || 1, 1, GRID_COLS - m.w + 1);
    m.y = clamp(m.y || 1, 1, GRID_ROWS - m.h + 1);
  }

  function renderModule(el) {
    const m = el._m;
    normalizePosition(m);
    el.style.setProperty('--x', m.x);
    el.style.setProperty('--y', m.y);
    el.style.setProperty('--w', m.w);
    el.style.setProperty('--h', m.h);
    el.style.setProperty('--align', alignFlex(m.align));
    el.classList.toggle('presentation-border', Boolean(m.border));

    if (m.type === 'heading') {
      const [title = 'Project Title', ...rest] = String(m.text).split('\n');
      el.innerHTML = `<div class="inner heading"><span class="kicker">${escapeHtml(rest.join(' ') || 'Landscape Architecture Studio')}</span><h2>${escapeHtml(title)}</h2></div>`;
      return;
    }

    if (m.type === 'text') {
      const parts = String(m.text).split('\n');
      const label = parts.shift() || 'Design Intent';
      el.innerHTML = `<div class="inner text"><b>${escapeHtml(label)}</b><p>${escapeHtml(parts.join('\n') || 'Add project text.').replace(/\n/g,'<br>')}</p></div>`;
      return;
    }

    if (m.type === 'image' || m.type === 'analysis') {
      const image = m.image
        ? `<img src="${m.image}" alt="${escapeHtml(m.text)}" style="--fit:${m.fit || 'cover'}">`
        : `<div class="placeholder"><div><b>Drop in a project image</b><span>Double-click to choose an image</span></div></div>`;
      const cls = m.type === 'analysis' ? 'analysis' : 'image';
      const tag = m.type === 'analysis' ? `<span class="analysis-tag">ANALYSIS</span>` : '';
      el.innerHTML = `<div class="inner ${cls}">${image}${tag}<span class="caption">${escapeHtml(m.text || 'Project Image')}</span></div>`;
      return;
    }

    if (m.type === 'section') {
      const body = m.image
        ? `<img src="${m.image}" alt="${escapeHtml(m.text)}" style="--fit:${m.fit || 'contain'}"><span class="caption">${escapeHtml(m.text)}</span>`
        : `<div class="section-placeholder"><div class="section-silhouette"></div><div class="section-label">${escapeHtml(m.text || 'SECTION')}</div></div>`;
      el.innerHTML = `<div class="inner section">${body}</div>`;
      return;
    }

    if (m.type === 'diagram') {
      const items = String(m.text).split('|').map(x => x.trim()).filter(Boolean);
      el.innerHTML = `<div class="inner diagram">${items.map((item,i) => `<span class="node">${escapeHtml(item)}</span>${i < items.length-1 ? '<span class="arrow">→</span>' : ''}`).join('')}</div>`;
      return;
    }

    if (m.type === 'timeline') {
      const steps = String(m.text).split('|').map(item => item.split(':')).slice(0,4);
      el.innerHTML = `<div class="inner timeline"><div class="timeline-line">${steps.map(([year,...label]) => `<div class="timeline-step"><span class="timeline-dot">${escapeHtml(year)}</span><b>${escapeHtml(label.join(':') || 'Stage')}</b><span>Key spatial or historical transition.</span></div>`).join('')}</div></div>`;
      return;
    }

    if (m.type === 'objectives') {
      const items = String(m.text).split('|').map(item => item.split(':'));
      el.innerHTML = `<div class="inner objectives">${items.map(([title,...body],i) => `<div class="objective-row"><span class="objective-icon">0${i+1}</span><div class="objective-copy"><b>${escapeHtml(title)}</b><span>${escapeHtml(body.join(':'))}</span></div></div>`).join('')}</div>`;
      return;
    }

    if (m.type === 'strategy') {
      const lines = String(m.text).split('\n').filter(Boolean);
      const title = lines.shift() || 'Strategies';
      const items = [];
      for (let i=0; i<lines.length; i+=2) items.push([lines[i], lines[i+1] || '']);
      el.innerHTML = `<div class="inner strategy"><div class="strategy-title">${escapeHtml(title)}</div>${items.map(([n,body]) => `<div class="strategy-item"><span class="strategy-num">${escapeHtml(n)}</span><p>${escapeHtml(body)}</p></div>`).join('')}</div>`;
      return;
    }

    if (m.type === 'swot') {
      const items = String(m.text).split('|').map(item => item.split(':'));
      el.innerHTML = `<div class="inner swot">${items.slice(0,4).map(([title,...body]) => `<div class="swot-cell"><b>${escapeHtml(title)}</b><p>${escapeHtml(body.join(':'))}</p></div>`).join('')}</div>`;
      return;
    }

    if (m.type === 'legend') {
      const lines = String(m.text).split('\n');
      const title = lines.shift() || 'Legend';
      const items = lines.join('\n').split('|').map(item => item.split(':'));
      el.innerHTML = `<div class="inner legend"><div class="legend-title">${escapeHtml(title)}</div>${items.map(([label,color],i) => `<div class="legend-item"><span class="legend-swatch" style="--sw:${escapeHtml(color || ['#819a79','#cda36a','#8db8c7','#d9c7a6','#58735f'][i%5])}"></span><span>${escapeHtml(label)}</span></div>`).join('')}</div>`;
      return;
    }

    if (m.type === 'materials') {
      const lines = String(m.text).split('\n');
      const title = lines.shift() || 'Material Legend';
      const items = lines.join('\n').split('|').filter(Boolean);
      el.innerHTML = `<div class="inner materials"><div class="legend-title">${escapeHtml(title)}</div>${items.map((item,i) => `<div class="legend-item"><span class="material-pattern p${(i%5)+1}"></span><span>${escapeHtml(item)}</span></div>`).join('')}</div>`;
      return;
    }

    if (m.type === 'schedule') {
      const lines = String(m.text).split('\n');
      const title = lines.shift() || 'Plant Schedule';
      const rows = lines.map(line => line.split('|'));
      el.innerHTML = `<div class="inner schedule"><div class="schedule-title">${escapeHtml(title)}</div><table><thead><tr><th>Botanical name</th><th>Common name</th><th>Qty</th><th>Type</th></tr></thead><tbody>${rows.map(row => `<tr>${[0,1,2,3].map(i => `<td>${escapeHtml(row[i] || '')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      return;
    }

    if (m.type === 'beforeafter') {
      const labels = String(m.text).split('|');
      const images = m.images || [];
      el.innerHTML = `<div class="inner beforeafter">${[0,1].map(i => `<div class="ba-panel">${images[i] ? `<img src="${images[i]}" alt="${escapeHtml(labels[i] || '')}">` : `<div class="placeholder"><div><b>${escapeHtml(labels[i] || (i ? 'After' : 'Before'))}</b><span>Use “Replace module images”</span></div></div>`}<span class="ba-label">${escapeHtml(labels[i] || (i ? 'AFTER' : 'BEFORE'))}</span></div>`).join('')}</div>`;
      return;
    }

    if (m.type === 'photostrip') {
      const images = m.images || [];
      el.innerHTML = `<div class="inner photostrip">${[0,1,2].map(i => `<div class="photo-panel">${images[i] ? `<img src="${images[i]}" alt="${escapeHtml(m.text)} ${i+1}">` : `<div class="placeholder"><div><b>Image 0${i+1}</b><span>${escapeHtml(m.text || 'Photo strip')}</span></div></div>`}</div>`).join('')}</div>`;
      return;
    }

    if (m.type === 'callouts') {
      const items = String(m.text).split('|').map(item => item.split(':')).slice(0,8);
      el.innerHTML = `<div class="inner callouts">${items.map(([title,...body],i) => `<div class="callout-item"><span class="callout-icon">0${i+1}</span><b>${escapeHtml(title)}</b><p>${escapeHtml(body.join(':'))}</p></div>`).join('')}</div>`;
      return;
    }

    if (m.type === 'palette') {
      const colors = ['#5f735d','#8da080','#c4b49b','#d8d0bd','#8ca6a0','#b27c6b'];
      el.innerHTML = `<div class="inner palette"><b>${escapeHtml(m.text)}</b><div class="palette-row">${colors.map((c,i) => `<i style="background:${c}"><span>0${i+1}</span></i>`).join('')}</div></div>`;
      return;
    }

    if (m.type === 'meta') {
      const items = String(m.text).split('|').map(item => { const [a,...b]=item.split(':'); return [a,b.join(':')]; });
      el.innerHTML = `<div class="inner meta">${items.map(([label,value]) => `<div><small>${escapeHtml(label)}</small><b>${escapeHtml(value || '—')}</b></div>`).join('')}</div>`;
      return;
    }

    if (m.type === 'north') {
      const labels = String(m.text).split('|');
      el.innerHTML = `<div class="inner north"><div class="north-arrow"><b>N</b><span class="north-triangle"></span></div><div class="scale-bar"><div class="scale-line"><i></i><i></i><i></i><i></i></div><div class="scale-labels">${labels.map(x => `<span>${escapeHtml(x)}</span>`).join('')}</div></div></div>`;
    }
  }

  function attachModuleEvents(el) {
    el.addEventListener('click', e => { e.stopPropagation(); selectModule(el); });
    el.addEventListener('dblclick', e => {
      if (singleImageTypes.has(el._m.type)) { e.stopPropagation(); selectModule(el); replaceImage.click(); }
      if (multiImageTypes.has(el._m.type)) { e.stopPropagation(); selectModule(el); replaceImages.click(); }
    });
    el.addEventListener('dragstart', e => {
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', el.dataset.id);
    });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));
  }

  content.addEventListener('dragover', e => e.preventDefault());
  content.addEventListener('drop', e => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const el = $(`.module[data-id="${CSS.escape(id)}"]`, content);
    if (!el) return;
    const rect = content.getBoundingClientRect();
    const xRatio = clamp((e.clientX - rect.left) / rect.width, 0, .9999);
    const yRatio = clamp((e.clientY - rect.top) / rect.height, 0, .9999);
    el._m.x = Math.min(GRID_COLS - el._m.w + 1, Math.floor(xRatio * GRID_COLS) + 1);
    el._m.y = Math.min(GRID_ROWS - el._m.h + 1, Math.floor(yRatio * GRID_ROWS) + 1);
    renderModule(el);
    syncEditor();
  });

  board.addEventListener('click', () => { clearSelection(); closeDrawer(); });

  function selectModule(el) {
    clearSelection();
    selectedId = el.dataset.id;
    el.classList.add('selected');
    syncEditor();
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
  }
  function clearSelection() { $$('.module.selected', content).forEach(el => el.classList.remove('selected')); selectedId = null; }
  function getSelected() { return selectedId ? $(`.module[data-id="${CSS.escape(selectedId)}"]`, content) : null; }
  function closeDrawer() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); }
  $('#close').addEventListener('click', closeDrawer);

  const typeNames = {
    heading:'Heading', text:'Text block', image:'Image', analysis:'Analysis map', diagram:'Process diagram', timeline:'Timeline',
    objectives:'Design objectives', strategy:'Strategies', swot:'SWOT analysis', legend:'Legend', materials:'Material legend', schedule:'Plant schedule',
    section:'Section / elevation', beforeafter:'Before / After', photostrip:'Photo strip', callouts:'Function callouts', palette:'Palette', meta:'Project information', north:'North + scale'
  };

  function syncEditor() {
    const el = getSelected(); if (!el) return;
    const m = el._m;
    editor.title.textContent = typeNames[m.type] || 'Module';
    editor.text.value = m.text || '';
    editor.width.value = String(m.w);
    editor.height.value = String(m.h);
    editor.x.value = m.x;
    editor.y.value = m.y;
    editor.align.value = m.align || 'start';
    editor.border.checked = Boolean(m.border);
    editor.fit.value = m.fit || 'cover';
    singleImageTools.classList.toggle('visible', singleImageTypes.has(m.type));
    multiImageTools.classList.toggle('visible', multiImageTypes.has(m.type));
  }

  function updateSelected() {
    const el = getSelected(); if (!el) return;
    const m = el._m;
    m.text = editor.text.value;
    m.w = clamp(editor.width.value,1,12);
    m.h = clamp(editor.height.value,1,GRID_ROWS);
    m.x = clamp(editor.x.value,1,13-m.w);
    m.y = clamp(editor.y.value,1,17-m.h);
    m.align = editor.align.value;
    m.border = editor.border.checked;
    if (singleImageTypes.has(m.type)) m.fit = editor.fit.value;
    renderModule(el);
    syncEditor();
  }
  Object.values(editor).filter(el => el instanceof HTMLElement && el !== editor.title).forEach(el => {
    el.addEventListener('input', updateSelected);
    el.addEventListener('change', updateSelected);
  });

  $('#delete').addEventListener('click', () => {
    const el = getSelected(); if (!el) return;
    el.remove(); clearSelection(); closeDrawer(); showToast('Module deleted');
  });
  $('#duplicate').addEventListener('click', () => {
    const el = getSelected(); if (!el) return;
    const copy = structuredClone(el._m); delete copy.id;
    copy.x = Math.min(13-copy.w, copy.x+1); copy.y = Math.min(17-copy.h, copy.y+1);
    const clone = createModule(copy.type, copy); content.append(clone); selectModule(clone); showToast('Module duplicated');
  });

  replaceImage.addEventListener('change', async () => {
    const el = getSelected(); const file = replaceImage.files?.[0];
    if (!el || !file || !singleImageTypes.has(el._m.type)) return;
    el._m.image = await fileToDataURL(file); renderModule(el); replaceImage.value=''; showToast('Image replaced');
  });
  replaceImages.addEventListener('change', async () => {
    const el = getSelected(); const files = [...(replaceImages.files || [])];
    if (!el || !files.length || !multiImageTypes.has(el._m.type)) return;
    el._m.images = await Promise.all(files.slice(0, el._m.type === 'beforeafter' ? 2 : 3).map(fileToDataURL));
    renderModule(el); replaceImages.value=''; showToast('Module images replaced');
  });

  function fileToDataURL(file) {
    return new Promise((resolve,reject) => { const r=new FileReader(); r.onload=()=>resolve(r.result); r.onerror=reject; r.readAsDataURL(file); });
  }

  $$('.module-add').forEach(btn => btn.addEventListener('click', () => {
    const type = btn.dataset.add;
    if (type === 'image') { addImages.click(); return; }
    const defaults = structuredClone(moduleDefaults[type]);
    const spot = findFreeSpot(defaults.w, defaults.h);
    const el = createModule(type, spot || {}); content.append(el); selectModule(el);
    if (!spot) showToast('Added at the top-left. Drag it to an open area.');
  }));

  addImages.addEventListener('change', async () => {
    const files = [...(addImages.files || [])];
    for (const file of files) {
      const spot = findFreeSpot(4,4) || {x:1,y:1};
      const el = createModule('image', { ...spot, w:4, h:4, text:file.name.replace(/\.[^/.]+$/,''), image:await fileToDataURL(file) });
      content.append(el);
    }
    addImages.value=''; if (files.length) showToast(`${files.length} image${files.length>1?'s':''} added`);
  });

  function findFreeSpot(w,h) {
    const occ = Array.from({length:GRID_ROWS},()=>Array(GRID_COLS).fill(false));
    $$('.module', content).forEach(el => {
      const m=el._m;
      for(let yy=m.y-1; yy<Math.min(GRID_ROWS,m.y-1+m.h); yy++) for(let xx=m.x-1; xx<Math.min(GRID_COLS,m.x-1+m.w); xx++) occ[yy][xx]=true;
    });
    for(let y=1; y<=GRID_ROWS-h+1; y++) for(let x=1; x<=GRID_COLS-w+1; x++) {
      let free=true;
      for(let yy=y-1; yy<y-1+h && free; yy++) for(let xx=x-1; xx<x-1+w; xx++) if(occ[yy][xx]) {free=false; break;}
      if(free) return {x,y,w,h};
    }
    return null;
  }

  function buildTemplateLibrary() {
    const lib = $('#templateLibrary'); lib.innerHTML='';
    Object.entries(templates).forEach(([key,t]) => {
      const card = document.createElement('button');
      card.className = `template-card${key===activeTemplate?' active':''}`;
      card.dataset.template=key; card.dataset.category=t.category;
      card.innerHTML = `<span class="template-preview"></span><b>${escapeHtml(t.name)}</b><small>${escapeHtml(t.description)}</small>`;
      const preview = $('.template-preview', card);
      t.modules.forEach(spec => {
        const [type,x,y,w,h] = spec;
        const r=document.createElement('i'); r.className=`preview-block type-${type}`;
        r.style.left=`${((x-1)/12)*100}%`; r.style.top=`${((y-1)/16)*100}%`; r.style.width=`${(w/12)*100}%`; r.style.height=`${(h/16)*100}%`;
        preview.append(r);
      });
      card.addEventListener('click',()=>applyTemplate(key,true));
      lib.append(card);
    });
  }

  $$('#templateFilters button').forEach(btn => btn.addEventListener('click',()=>{
    $$('#templateFilters button').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    const cat=btn.dataset.category;
    $$('.template-card').forEach(card => card.hidden = cat !== 'all' && card.dataset.category !== cat);
  }));

  function captureReusableContent() {
    const pools={};
    $$('.module', content).forEach(el => { const m=el._m; (pools[m.type] ||= []).push(structuredClone(m)); });
    return pools;
  }

  function applyTemplate(key, preserve=true) {
    const t=templates[key]; if(!t) return;
    const pools = preserve ? captureReusableContent() : {};
    content.innerHTML=''; clearSelection(); closeDrawer(); activeTemplate=key;
    const used={};
    t.modules.forEach(spec => {
      const [type,x,y,w,h,text] = spec;
      const idx = used[type] || 0; used[type]=idx+1;
      const prior = pools[type]?.[idx];
      const overrides={x,y,w,h};
      if(text) overrides.text=text;
      if(prior) {
        if(prior.image) overrides.image=prior.image;
        if(prior.images) overrides.images=prior.images;
        if(prior.text && !text) overrides.text=prior.text;
        if(prior.fit) overrides.fit=prior.fit;
      }
      content.append(createModule(type,overrides));
    });
    $$('.template-card').forEach(c=>c.classList.toggle('active',c.dataset.template===key));
    $('#activeTemplateName').textContent=t.name;
    showToast(`${t.name} applied`);
  }
  $('#reapplyTemplate').addEventListener('click',()=>applyTemplate(activeTemplate,true));

  function updateSetup() {
    board.dataset.size=setup.size.value;
    board.dataset.orientation=setup.orientation.value;
    board.className = `board theme-${setup.theme.value}${$('#guides').checked?' guides':''}${$('#grid').checked?' show-grid':''}`;
    document.documentElement.style.setProperty('--guide-cols',setup.guideColumns.value);
    document.documentElement.style.setProperty('--board-margin',`${setup.margin.value}px`);
    document.documentElement.style.setProperty('--board-gap',`${setup.gap.value}px`);
    document.documentElement.style.setProperty('--accent',setup.accent.value);
    requestAnimationFrame(updateShellSize);
  }
  [setup.size,setup.orientation,setup.guideColumns,setup.theme].forEach(el=>el.addEventListener('change',updateSetup));
  [setup.margin,setup.gap,setup.accent].forEach(el=>el.addEventListener('input',updateSetup));

  $$('.swatch').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.swatch').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    document.documentElement.style.setProperty('--board-bg',btn.dataset.bg);
    if(btn.dataset.bg==='#17211d') setup.theme.value='dark';
    updateSetup();
  }));

  $('#grid').addEventListener('change',updateSetup);
  $('#guides').addEventListener('change',updateSetup);

  function setZoom(value, keepCenter=true) {
    const old=zoom;
    const stageCenterX=stage.scrollLeft+stage.clientWidth/2;
    const stageCenterY=stage.scrollTop+stage.clientHeight/2;
    zoom=clamp(value,.2,1.5);
    document.documentElement.style.setProperty('--zoom',zoom);
    $('#zoomText').textContent=`${Math.round(zoom*100)}%`;
    updateShellSize();
    if(keepCenter && old>0) {
      const ratio=zoom/old;
      requestAnimationFrame(()=>{
        stage.scrollLeft=Math.max(0,stageCenterX*ratio-stage.clientWidth/2);
        stage.scrollTop=Math.max(0,stageCenterY*ratio-stage.clientHeight/2);
      });
    }
  }
  function updateShellSize() {
    boardShell.style.width=`${board.offsetWidth*zoom}px`;
    boardShell.style.height=`${board.offsetHeight*zoom}px`;
  }
  function fitBoard() {
    const availableW=Math.max(200,stage.clientWidth-110);
    const availableH=Math.max(200,stage.clientHeight-110);
    const z=Math.min(availableW/board.offsetWidth,availableH/board.offsetHeight,1);
    setZoom(z,false);
    requestAnimationFrame(()=>{ stage.scrollLeft=0; stage.scrollTop=0; });
  }
  $('#plus').addEventListener('click',()=>setZoom(zoom+.08));
  $('#minus').addEventListener('click',()=>setZoom(zoom-.08));
  $('#fitBoard').addEventListener('click',fitBoard);
  $('#actualSize').addEventListener('click',()=>setZoom(1));
  stage.addEventListener('wheel',e=>{
    if(!e.ctrlKey) return;
    e.preventDefault();
    setZoom(zoom + (e.deltaY<0 ? .06 : -.06));
  },{passive:false});
  window.addEventListener('resize',()=>requestAnimationFrame(updateShellSize));
  new ResizeObserver(updateShellSize).observe(board);

  $('#reset').addEventListener('click',()=>{
    if(!confirm('Reset BoardLab to the default presentation board?')) return;
    setup.size.value='A2'; setup.orientation.value='landscape'; setup.guideColumns.value='8'; setup.margin.value='42'; setup.gap.value='12'; setup.theme.value='landscape'; setup.accent.value='#4c6d5d';
    document.documentElement.style.setProperty('--board-bg','#f3f0e8');
    $$('.swatch').forEach(b=>b.classList.toggle('active',b.dataset.bg==='#f3f0e8'));
    $('#grid').checked=false; $('#guides').checked=true;
    updateSetup(); applyTemplate('balanced',false); fitBoard();
  });

  $('#png').addEventListener('click', async()=>{
    if(!window.html2canvas){ showToast('PNG export library did not load. Use Print / Save PDF.'); return; }
    const selected=getSelected(); selected?.classList.remove('selected');
    const hadGuides=board.classList.contains('guides'); const hadGrid=board.classList.contains('show-grid');
    board.classList.remove('guides','show-grid');
    showToast('Rendering high-resolution PNG…');
    try {
      const canvas=await html2canvas(board,{scale:Number($('#exportScale').value),backgroundColor:getComputedStyle(board).backgroundColor,useCORS:true,logging:false});
      const link=document.createElement('a'); link.download='boardlab-presentation.png'; link.href=canvas.toDataURL('image/png',1); link.click(); showToast('PNG exported');
    } catch(err){ console.error(err); showToast('PNG export failed. Try Print / Save PDF.'); }
    if(hadGuides) board.classList.add('guides'); if(hadGrid) board.classList.add('show-grid'); selected?.classList.add('selected');
  });

  $('#print').addEventListener('click',()=>{
    updatePrintStyle();
    const selected=getSelected(); const hadGuides=board.classList.contains('guides'); const hadGrid=board.classList.contains('show-grid');
    board.classList.remove('guides','show-grid'); selected?.classList.remove('selected');
    setTimeout(()=>{ window.print(); if(hadGuides) board.classList.add('guides'); if(hadGrid) board.classList.add('show-grid'); selected?.classList.add('selected'); },80);
  });
  function updatePrintStyle() {
    const s=setup.size.value; const o=setup.orientation.value;
    let page;
    if(['A0','A1','A2','A3'].includes(s)) page=`${s} ${o}`;
    else if(s==='Square') page='210mm 210mm';
    else page=o==='landscape'?'320mm 180mm':'180mm 320mm';
    $('#pageStyle').textContent=`@page{size:${page};margin:0;}`;
  }

  $('#save').addEventListener('click',()=>{
    const project={version:3,setup:{size:setup.size.value,orientation:setup.orientation.value,guideColumns:setup.guideColumns.value,margin:setup.margin.value,gap:setup.gap.value,theme:setup.theme.value,accent:setup.accent.value,boardBg:getComputedStyle(document.documentElement).getPropertyValue('--board-bg').trim(),template:activeTemplate},modules:$$('.module',content).map(el=>el._m)};
    const blob=new Blob([JSON.stringify(project,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='boardlab-project.json'; a.click(); URL.revokeObjectURL(url); showToast('Editable project saved');
  });
  $('#load').addEventListener('change',async e=>{
    const file=e.target.files?.[0]; if(!file) return;
    try { loadProject(JSON.parse(await file.text())); showToast('Project loaded'); } catch(err){console.error(err);showToast('Could not load project');}
    e.target.value='';
  });
  function loadProject(p) {
    if(!p?.setup || !Array.isArray(p.modules)) throw new Error('Invalid project');
    setup.size.value=p.setup.size||'A2'; setup.orientation.value=p.setup.orientation||'landscape'; setup.guideColumns.value=p.setup.guideColumns||'8'; setup.margin.value=p.setup.margin||'42'; setup.gap.value=p.setup.gap||'12'; setup.theme.value=p.setup.theme||'landscape'; setup.accent.value=p.setup.accent||'#4c6d5d';
    document.documentElement.style.setProperty('--board-bg',p.setup.boardBg||'#f3f0e8'); activeTemplate=p.setup.template||'balanced'; updateSetup(); content.innerHTML='';
    p.modules.forEach(model=>{const copy=structuredClone(model);delete copy.id;content.append(createModule(copy.type,copy));});
    $('#activeTemplateName').textContent=templates[activeTemplate]?.name||'Custom Board';
    requestAnimationFrame(fitBoard);
  }

  function showToast(message) { toast.textContent=message; toast.classList.add('show'); clearTimeout(showToast.t); showToast.t=setTimeout(()=>toast.classList.remove('show'),1800); }

  buildTemplateLibrary();
  updateSetup();
  applyTemplate('balanced',false);
  requestAnimationFrame(()=>requestAnimationFrame(fitBoard));
})();
