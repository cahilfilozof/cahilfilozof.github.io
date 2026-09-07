
(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const board = $("#board");
  const content = $("#content");
  const stage = $("#stage");
  const boardShell = $("#boardShell");
  const toast = $("#toast");
  const drawer = $("#drawer");
  const printPages = $("#printPages");

  const setup = {
    size: $("#size"),
    orientation: $("#orientation"),
    guideColumns: $("#guideColumns"),
    margin: $("#margin"),
    gap: $("#gap"),
    theme: $("#theme"),
    accent: $("#accent")
  };

  const editor = {
    title: $("#drawerTitle"),
    text: $("#moduleText"),
    width: $("#moduleWidth"),
    height: $("#moduleHeight"),
    x: $("#moduleX"),
    y: $("#moduleY"),
    align: $("#moduleAlign"),
    border: $("#moduleBorder"),
    fit: $("#fit")
  };

  const singleImageTools = $("#singleImageTools");
  const multiImageTools = $("#multiImageTools");
  const replaceImage = $("#replaceImage");
  const replaceImages = $("#replaceImages");
  const addImages = $("#addImages");
  const pageList = $("#pageList");

  const GRID_COLS = 12;
  const GRID_ROWS = 16;

  const BOARD_SIZES = ["A0", "A1", "A2", "A3", "Square", "16:9"];
  const PORTFOLIO_SIZES = ["A4", "A3", "Square"];

  const singleImageTypes = new Set(["image", "analysis", "section", "fullbleed"]);
  const multiImageTypes = new Set(["beforeafter", "photostrip"]);

  const state = {
    mode: "board",
    boardTemplate: "balanced",
    portfolioTemplate: "projectOverview",
    zoom: .72,
    selectedId: null,
    counter: 0,
    boardModules: [],
    portfolioPages: [],
    activePageIndex: 0,
    boardBg: "#f3f0e8"
  };

  const moduleDefaults = {
    heading: {type:"heading",w:6,h:3,x:1,y:1,text:"PROJECT TITLE\nLandscape Architecture Studio",align:"end"},
    projecttitle:{type:"projecttitle",w:8,h:4,x:1,y:1,text:"01 — PROJECT TITLE\nLandscape Architecture · 2026\nBursa, Türkiye",align:"end"},
    text:{type:"text",w:4,h:3,x:1,y:1,text:"DESIGN INTENT\nUse this block for a short project statement, design decision, or jury explanation.",align:"start"},
    quote:{type:"quote",w:8,h:4,x:1,y:1,text:"Landscape is not only what we see — it is the system that connects ecology, movement and everyday life.",align:"center"},
    image:{type:"image",w:6,h:6,x:1,y:1,text:"Master Plan / Perspective",image:"",fit:"cover",align:"center"},
    fullbleed:{type:"fullbleed",w:12,h:10,x:1,y:1,text:"Hero Perspective",image:"",fit:"cover",align:"center"},
    analysis:{type:"analysis",w:4,h:5,x:1,y:1,text:"Analysis Map",image:"",fit:"contain",align:"center"},
    diagram:{type:"diagram",w:4,h:3,x:1,y:1,text:"ANALYZE|CONNECT|TRANSFORM",align:"center"},
    timeline:{type:"timeline",w:8,h:3,x:1,y:1,text:"1890:Early industry|1958:Port transformation|1980:Urban expansion|2026:Reconnection",align:"center"},
    objectives:{type:"objectives",w:4,h:6,x:1,y:1,text:"Reclaim the urban void:Transform underused space into active public landscape|Ecology as infrastructure:Use rainwater and planting systems as spatial structure|Strengthen connectivity:Reconnect pedestrian and ecological flows|Activate public life:Support gathering, play, culture and everyday use",align:"start"},
    strategy:{type:"strategy",w:4,h:6,x:1,y:1,text:"STRATEGIES\nP.1|Create a continuous pedestrian-green corridor\nP.2|Reconnect fragmented open spaces\nP.3|Introduce flexible public programs\nP.4|Strengthen ecological continuity",align:"start"},
    swot:{type:"swot",w:4,h:5,x:1,y:1,text:"Strengths:Access, identity, existing green assets|Weaknesses:Fragmentation, barriers, low continuity|Opportunities:Green corridors, adaptive reuse, public space|Threats:Development pressure, privatization, ecological loss",align:"start"},
    legend:{type:"legend",w:3,h:4,x:1,y:1,text:"LEGEND\nPublic green:#819a79|Mixed use:#cda36a|Water:#8db8c7|Pedestrian:#d9c7a6|Ecological corridor:#58735f",align:"start"},
    materials:{type:"materials",w:3,h:5,x:1,y:1,text:"MATERIAL LEGEND\nGrass groundcover|Timber deck board|Concrete|Natural stone|Permeable paving",align:"start"},
    schedule:{type:"schedule",w:5,h:5,x:1,y:1,text:"PLANT SCHEDULE\nAcer campestre|Hedge Maple|8|Deciduous\nTilia tomentosa|Silver Linden|11|Deciduous\nLavandula angustifolia|Lavender|24|Evergreen\nViburnum tinus|Laurustinus|18|Evergreen",align:"start"},
    section:{type:"section",w:6,h:3,x:1,y:1,text:"A–A’ SECTION",image:"",fit:"contain",align:"center"},
    beforeafter:{type:"beforeafter",w:6,h:6,x:1,y:1,text:"Before|After",images:[],align:"center"},
    photostrip:{type:"photostrip",w:6,h:3,x:1,y:1,text:"Atmosphere / Renders",images:[],align:"center"},
    callouts:{type:"callouts",w:8,h:4,x:1,y:1,text:"Stage:Flexible events and performances|Socialization:Daily gathering and interaction|Urban Furniture:Pause, sit and meet|Eco-Amphitheater:Topography-led gathering|Wooden Deck:Flexible activity surface|Market:Local production and temporary sales|Bioswale:Rainwater collection and filtration|Play:Active recreation",align:"center"},
    palette:{type:"palette",w:4,h:2,x:1,y:1,text:"Planting / Material Palette",align:"end"},
    meta:{type:"meta",w:4,h:3,x:1,y:1,text:"Location:Bursa, Türkiye|Studio:Landscape Design|Scale:1:500|Year:2026|Software:AutoCAD · ArcGIS · SketchUp|Author:Student Name",align:"end"},
    north:{type:"north",w:2,h:2,x:1,y:1,text:"0|5|10|20 m",align:"center"},
    toc:{type:"toc",w:7,h:8,x:1,y:1,text:"01|Urban Square|04\n02|Urban Landscape Planning|10\n03|Collective Housing|16\n04|Single Residence|22\n05|Construction + Details|28\n06|Selected Work|34",align:"start"},
    skills:{type:"skills",w:5,h:6,x:1,y:1,text:"Design|Landscape design, planting design, public space\nCAD + 3D|AutoCAD, SketchUp, Rhino\nVisualization|Lumion, D5, Photoshop\nGIS|ArcGIS, QGIS\nResearch|Site analysis, mapping, data visualization",align:"start"},
    tags:{type:"tags",w:5,h:2,x:1,y:1,text:"Public Space|Planting Design|Urban Landscape|Water Sensitive Design|Visualization",align:"center"},
    contact:{type:"contact",w:6,h:4,x:1,y:1,text:"CONTACT\nhello@example.com\nlinkedin.com/in/yourname\ngithub.com/yourname",align:"end"},
    pagenumber:{type:"pagenumber",w:2,h:1,x:11,y:16,text:"PAGE",align:"end"}
  };

  const boardTemplates = {
    balanced:{name:"Balanced Jury",category:"design",description:"Plan, perspective, concept and section in one clear jury board.",modules:[
      ["heading",1,1,7,3],["meta",9,1,4,3],["image",1,4,7,8,"Master Plan"],["image",9,4,4,5,"Key Perspective"],["text",9,9,4,3],["diagram",1,12,4,4],["section",5,12,5,4,"A–A’ Section"],["palette",10,12,3,2]
    ]},
    masterplan:{name:"Masterplan Focus",category:"design",description:"Very large plan with compact legend, metadata and section strip.",modules:[
      ["heading",1,1,8,2],["meta",10,1,3,2],["image",1,3,9,11,"1:500 Landscape Plan"],["legend",10,3,3,6],["north",10,9,3,2],["section",1,14,8,3,"A–A’ Section"],["palette",10,12,3,2],["text",10,14,3,3]
    ]},
    renderstory:{name:"Render Narrative",category:"portfolio",description:"Large hero perspective with supporting views and short narrative.",modules:[
      ["heading",1,1,7,2],["meta",9,1,4,2],["image",1,3,12,8,"Hero Perspective"],["photostrip",1,11,8,3],["text",9,11,4,3],["objectives",1,14,7,3],["palette",9,14,4,2]
    ]},
    analysisatlas:{name:"Analysis Atlas",category:"analysis",description:"Dense analysis set for site mapping and jury explanation.",modules:[
      ["heading",1,1,8,2],["text",9,1,4,2],["analysis",1,3,4,5,"Solid–Void"],["analysis",5,3,4,5,"Land Use"],["analysis",9,3,4,5,"Green Network"],["analysis",1,8,5,5,"Circulation"],["analysis",6,8,4,5,"Hydrology / Climate"],["swot",10,8,3,5],["legend",1,13,4,4],["diagram",5,13,5,4],["meta",10,13,3,4]
    ]},
    strategy:{name:"Strategy Masterplan",category:"planning",description:"Large strategic map, interventions, sections and atmosphere strip.",modules:[
      ["heading",1,1,7,2],["text",9,1,4,2],["image",1,3,8,11,"Strategic Masterplan"],["strategy",9,3,4,7],["photostrip",9,10,4,4],["section",1,14,8,3,"Strategic Sections"],["north",10,14,3,2]
    ]},
    planting:{name:"Planting Plan",category:"technical",description:"Planting plan with species schedule, legend and scale graphics.",modules:[
      ["heading",1,1,8,2,"1:500 PLANTING PLAN\nLandscape Architecture Studio"],["north",11,1,2,2],["image",1,3,8,11,"Planting Plan"],["schedule",9,3,4,8],["legend",9,11,4,4],["palette",1,14,5,3],["meta",6,14,3,3]
    ]},
    construction:{name:"Construction Details",category:"technical",description:"Construction plan, material legend and detailed section strip.",modules:[
      ["heading",1,1,8,2,"1:200 CONSTRUCTION PLAN\nLandscape Construction"],["north",11,1,2,2],["image",1,3,8,9,"Construction Plan"],["materials",9,3,4,9],["section",1,12,4,5,"Detail Section 01"],["section",5,12,4,5,"Detail Section 02"],["section",9,12,4,5,"Detail Section 03"]
    ]},
    functionplan:{name:"Function Plan",category:"planning",description:"Plan plus compact explanation of functions and social program.",modules:[
      ["heading",1,1,8,2],["meta",10,1,3,2],["image",1,3,9,11,"1:500 Function Plan"],["callouts",10,3,3,11],["legend",1,14,4,3],["north",6,14,2,2],["text",8,14,5,3]
    ]},
    competition:{name:"Competition Minimal",category:"portfolio",description:"Restrained composition with one dominant visual and minimal text.",modules:[
      ["heading",1,1,8,2],["image",1,3,12,10,"Main Visual"],["text",1,13,5,4],["diagram",7,13,3,4],["meta",10,13,3,4]
    ]},
    editorial:{name:"Editorial Portfolio Board",category:"portfolio",description:"Asymmetrical editorial composition for portfolio-style presentation.",modules:[
      ["heading",1,1,6,3],["meta",9,1,4,3],["image",1,4,8,8,"Primary Visual"],["image",10,4,3,4,"Detail"],["text",10,8,3,4],["photostrip",1,12,7,4],["palette",9,13,4,2]
    ]}
  };

  const portfolioTemplates = {
    cover:{name:"Cover",category:"frontmatter",description:"Minimal portfolio cover with name, discipline and large image.",modules:[
      ["projecttitle",1,1,10,5,"LANDSCAPE ARCHITECTURE\nPORTFOLIO · 2026\nYOUR NAME"],["image",1,7,12,8,"Selected Work"],["pagenumber",11,16,2,1]
    ]},
    contents:{name:"Contents",category:"frontmatter",description:"Editorial contents page with project list and introductory statement.",modules:[
      ["heading",1,1,6,3,"CONTENTS\nSelected Works"],["toc",1,5,7,10],["quote",9,5,4,6],["pagenumber",11,16,2,1]
    ]},
    about:{name:"About + CV",category:"frontmatter",description:"About statement, portrait, skills and compact experience section.",modules:[
      ["heading",1,1,6,3,"ABOUT\nLandscape Architecture"],["image",1,5,4,7,"Portrait / Process Image"],["text",6,5,7,4,"ABOUT ME\nWrite a concise professional biography here."],["skills",6,10,7,5],["pagenumber",11,16,2,1]
    ]},
    projectOpener:{name:"Project Opener",category:"project",description:"Large project title and full-width visual for opening a new project.",modules:[
      ["projecttitle",1,1,9,4],["meta",10,1,3,4],["image",1,6,12,9,"Hero Render / Plan"],["tags",1,15,8,2],["pagenumber",11,16,2,1]
    ]},
    projectOverview:{name:"Project Overview",category:"project",description:"Project statement with one dominant visual and supporting information.",modules:[
      ["projecttitle",1,1,8,3],["meta",10,1,3,3],["image",1,5,8,9,"Primary Visual"],["text",10,5,3,5],["diagram",10,10,3,4],["tags",1,15,8,1],["pagenumber",11,16,2,1]
    ]},
    masterplan:{name:"Masterplan Page",category:"project",description:"Large masterplan with legend, scale and short design explanation.",modules:[
      ["heading",1,1,7,2,"MASTERPLAN\nProject Title"],["image",1,4,9,11,"1:500 Masterplan"],["legend",10,4,3,6],["north",10,10,3,2],["text",10,12,3,3],["pagenumber",11,16,2,1]
    ]},
    analysis:{name:"Analysis Page",category:"project",description:"Three analytical maps with synthesis and concise explanation.",modules:[
      ["heading",1,1,8,2,"SITE ANALYSIS\nProject Title"],["analysis",1,4,4,4,"Land Use"],["analysis",5,4,4,4,"Green Network"],["analysis",9,4,4,4,"Circulation"],["analysis",1,9,6,6,"Synthesis"],["text",8,9,5,3],["diagram",8,12,5,3],["pagenumber",11,16,2,1]
    ]},
    process:{name:"Process Page",category:"project",description:"Concept development, diagrams, sketches and design objectives.",modules:[
      ["heading",1,1,8,2,"DESIGN PROCESS\nConcept Development"],["diagram",1,4,8,3],["objectives",10,4,3,6],["analysis",1,8,4,5,"Concept Study"],["analysis",5,8,4,5,"Spatial Study"],["text",1,14,8,2],["pagenumber",11,16,2,1]
    ]},
    render:{name:"Render Story",category:"visual",description:"Large render with two supporting perspectives and a short caption.",modules:[
      ["heading",1,1,7,2,"ATMOSPHERE\nProject Title"],["image",1,4,12,7,"Hero Perspective"],["image",1,12,5,3,"Perspective 02"],["image",7,12,3,3,"Perspective 03"],["text",11,12,2,3],["pagenumber",11,16,2,1]
    ]},
    fullBleed:{name:"Full-Bleed Image",category:"visual",description:"One dramatic image with restrained project label.",modules:[
      ["fullbleed",1,1,12,16,"Project Perspective"],["projecttitle",1,1,8,4,"PROJECT TITLE\nLandscape Architecture · 2026\nSelected Work"],["pagenumber",11,16,2,1]
    ]},
    twoImage:{name:"Two-Image Editorial",category:"visual",description:"Clean editorial spread with two visuals and concise text.",modules:[
      ["heading",1,1,7,2,"PROJECT DETAILS\nSelected Views"],["image",1,4,7,7,"Primary Visual"],["image",9,4,4,5,"Secondary Visual"],["text",9,10,4,4],["quote",1,12,7,3],["pagenumber",11,16,2,1]
    ]},
    technical:{name:"Technical Page",category:"technical",description:"Construction plan with material legend and sectional details.",modules:[
      ["heading",1,1,8,2,"TECHNICAL DEVELOPMENT\nConstruction + Sections"],["image",1,4,8,8,"Construction Plan"],["materials",10,4,3,8],["section",1,13,5,3,"A–A’ Detail"],["section",7,13,4,3,"B–B’ Detail"],["pagenumber",11,16,2,1]
    ]},
    planting:{name:"Planting Page",category:"technical",description:"Planting plan, palette and abbreviated species schedule.",modules:[
      ["heading",1,1,8,2,"PLANTING DESIGN\nProject Title"],["image",1,4,8,10,"Planting Plan"],["schedule",10,4,3,7],["palette",10,12,3,2],["north",1,14,3,2],["pagenumber",11,16,2,1]
    ]},
    closing:{name:"Closing + Contact",category:"frontmatter",description:"Final portfolio page with contact information and closing statement.",modules:[
      ["quote",1,2,9,6],["contact",1,10,6,5],["image",9,10,4,5,"Final Project Image"],["pagenumber",11,16,2,1]
    ]}
  };

  const moduleLibraryConfig = [
    ["heading","Heading","title + studio line"],["projecttitle","Project opener","portfolio project title"],["text","Text","concept / explanation"],["quote","Quote","large editorial statement"],
    ["image","Image","plan / render / map"],["fullbleed","Full-bleed","large visual"],["analysis","Analysis map","map + label"],["section","Section","section / elevation"],
    ["diagram","Process diagram","concept sequence"],["timeline","Timeline","heritage / development"],["objectives","Objectives","design goals"],["strategy","Strategies","numbered decisions"],
    ["swot","SWOT","4-quadrant analysis"],["legend","Legend","map / function legend"],["materials","Material legend","hatches + labels"],["schedule","Plant schedule","species table"],
    ["beforeafter","Before / After","design comparison"],["photostrip","Photo strip","3-image narrative"],["callouts","Function callouts","program labels"],["palette","Palette","plant / material colors"],
    ["meta","Project info","location / year / tools"],["north","North + scale","graphic utilities"],["toc","Contents","portfolio contents list"],["skills","Skills","software + capabilities"],
    ["tags","Project tags","keyword chips"],["contact","Contact","portfolio closing info"],["pagenumber","Page number","portfolio page marker"]
  ];

  const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || min));
  const uid = () => `m-${Date.now()}-${++state.counter}`;
  const esc = value => String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  const toFlex = align => align === "center" ? "center" : align === "end" ? "flex-end" : "flex-start";
  const fileToDataURL = file => new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});
  const stripExtension = name => name.replace(/\.[^/.]+$/,"");
  const currentTemplates = () => state.mode === "portfolio" ? portfolioTemplates : boardTemplates;
  const currentTemplateKey = () => state.mode === "portfolio" ? state.portfolioTemplate : state.boardTemplate;
  const setCurrentTemplateKey = key => state.mode === "portfolio" ? state.portfolioTemplate = key : state.boardTemplate = key;
  const currentPage = () => state.portfolioPages[state.activePageIndex];

  function makeModel(type, overrides={}) {
    const base = structuredClone(moduleDefaults[type]);
    const m = {id:uid(),border:false,...base,...overrides};
    m.x=clamp(m.x,1,GRID_COLS);m.y=clamp(m.y,1,GRID_ROWS);
    m.w=clamp(m.w,1,GRID_COLS-m.x+1);m.h=clamp(m.h,1,GRID_ROWS-m.y+1);
    return m;
  }

  function createModule(type, overrides={}) {
    const model=makeModel(type,overrides);
    const el=document.createElement("section");
    el.className="module";el.dataset.id=model.id;el.dataset.type=model.type;el._m=model;
    renderModule(el);attachModuleEvents(el);return el;
  }

  function applyModelPosition(el){
    const m=el._m;
    el.style.setProperty("--x",m.x);el.style.setProperty("--y",m.y);el.style.setProperty("--w",m.w);el.style.setProperty("--h",m.h);el.style.setProperty("--module-align",toFlex(m.align));
    el.classList.toggle("with-border",Boolean(m.border));
  }

  function renderModule(el){
    const m=el._m;applyModelPosition(el);
    const lines=String(m.text??"").split("\n");

    if(m.type==="heading"){
      el.innerHTML=`<div class="module-inner module-heading"><span class="module-kicker">${esc(lines.slice(1).join(" · ")||"Landscape Architecture Studio")}</span><h2>${esc(lines[0]||"PROJECT TITLE")}</h2></div>`;return;
    }
    if(m.type==="projecttitle"){
      el.innerHTML=`<div class="module-inner module-projecttitle"><span class="module-kicker">SELECTED WORK</span><h2>${esc(lines[0]||"PROJECT TITLE")}</h2><div class="project-subline">${esc(lines.slice(1).join(" · ")||"Landscape Architecture · 2026")}</div></div>`;return;
    }
    if(m.type==="text"){
      el.innerHTML=`<div class="module-inner module-text"><span class="module-label">${esc(lines[0]||"DESIGN INTENT")}</span><p>${esc(lines.slice(1).join("\n")||"Add your project description.").replaceAll("\n","<br>")}</p></div>`;return;
    }
    if(m.type==="quote"){
      el.innerHTML=`<div class="module-inner module-quote"><span class="module-label">STATEMENT</span><blockquote>${esc(m.text)}</blockquote></div>`;return;
    }
    if(singleImageTypes.has(m.type)){
      const visual=m.image?`<img src="${m.image}" alt="${esc(m.text||"Project image")}" style="--image-fit:${m.fit||"cover"}">`:`<div class="image-placeholder"><div><strong>Add project image</strong><span>Double-click to choose an image</span></div></div>`;
      const analysisHead=m.type==="analysis"?`<div class="analysis-head">${esc(m.text||"Analysis")}</div>`:"";
      el.innerHTML=`<div class="module-inner module-${m.type}">${analysisHead}${visual}<div class="module-caption">${esc(m.text||"Project Image")}</div></div>`;return;
    }
    if(m.type==="diagram"){
      const nodes=String(m.text).split("|").map(s=>s.trim()).filter(Boolean);
      el.innerHTML=`<div class="module-inner module-diagram"><div class="diagram-flow">${nodes.map((n,i)=>`<div class="diagram-node">${esc(n)}</div>${i<nodes.length-1?'<div class="diagram-arrow">→</div>':""}`).join("")}</div></div>`;return;
    }
    if(m.type==="timeline"){
      const items=String(m.text).split("|").map(item=>{const [year,...rest]=item.split(":");return [year,rest.join(":")]});
      el.innerHTML=`<div class="module-inner module-timeline"><div class="timeline-line" style="--timeline-count:${Math.max(1,items.length)}">${items.map(([year,text])=>`<div class="timeline-item"><b>${esc(year)}</b><span>${esc(text)}</span></div>`).join("")}</div></div>`;return;
    }
    if(m.type==="objectives"){
      const items=String(m.text).split("|").map(item=>{const [title,...rest]=item.split(":");return [title,rest.join(":")]});
      el.innerHTML=`<div class="module-inner"><span class="module-label">DESIGN OBJECTIVES</span><div class="objective-list">${items.map(([t,b])=>`<div class="objective-item"><strong>${esc(t)}</strong><span>${esc(b)}</span></div>`).join("")}</div></div>`;return;
    }
    if(m.type==="strategy"){
      const src=String(m.text).split("\n").slice(1).filter(Boolean);const items=[];for(let i=0;i<src.length;i+=2)items.push([src[i]||"",src[i+1]||""]);
      el.innerHTML=`<div class="module-inner"><span class="module-label">STRATEGIES</span><div class="strategy-list">${items.map(([t,b])=>`<div class="strategy-item"><strong>${esc(t)}</strong><span>${esc(b)}</span></div>`).join("")}</div></div>`;return;
    }
    if(m.type==="swot"){
      const items=String(m.text).split("|").map(item=>{const [t,...rest]=item.split(":");return [t,rest.join(":")]});
      el.innerHTML=`<div class="module-inner swot-grid">${items.slice(0,4).map(([t,b])=>`<div class="swot-cell"><b>${esc(t)}</b><span>${esc(b)}</span></div>`).join("")}</div>`;return;
    }
    if(m.type==="legend"){
      const rows=String(m.text).split("\n").slice(1).join("\n").split("|").filter(Boolean).map(item=>{const [label,color]=item.split(":");return [label,color||"#999"]});
      el.innerHTML=`<div class="module-inner"><span class="module-label">LEGEND</span><div class="legend-list">${rows.map(([label,color])=>`<div class="legend-row"><span class="legend-chip" style="--legend-color:${esc(color)}"></span><span>${esc(label)}</span></div>`).join("")}</div></div>`;return;
    }
    if(m.type==="materials"){
      const rows=String(m.text).split("\n").slice(1).join("\n").split("|").filter(Boolean);
      el.innerHTML=`<div class="module-inner"><span class="module-label">MATERIAL LEGEND</span><div class="material-list">${rows.map(row=>`<div class="material-row"><span class="material-hatch"></span><span>${esc(row)}</span></div>`).join("")}</div></div>`;return;
    }
    if(m.type==="schedule"){
      const rows=String(m.text).split("\n").slice(1).filter(Boolean).map(line=>line.split("|"));
      el.innerHTML=`<div class="module-inner"><span class="module-label">PLANT SCHEDULE</span><table class="schedule-table"><thead><tr><th>Botanical</th><th>Common</th><th>Qty.</th><th>Type</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r[0]||"")}</td><td>${esc(r[1]||"")}</td><td>${esc(r[2]||"")}</td><td>${esc(r[3]||"")}</td></tr>`).join("")}</tbody></table></div>`;return;
    }
    if(m.type==="beforeafter"){
      const labels=String(m.text).split("|"),imgs=m.images||[];
      el.innerHTML=`<div class="module-inner beforeafter-grid">${[0,1].map(i=>`<div class="beforeafter-cell">${imgs[i]?`<img src="${imgs[i]}" alt="${esc(labels[i]||"")}">`:`<div class="image-placeholder"><span>Add image ${i+1}</span></div>`}<span>${esc(labels[i]||(i?"After":"Before"))}</span></div>`).join("")}</div>`;return;
    }
    if(m.type==="photostrip"){
      const imgs=m.images||[];
      el.innerHTML=`<div class="module-inner photostrip-grid">${[0,1,2].map(i=>`<div>${imgs[i]?`<img src="${imgs[i]}" alt="Project image ${i+1}">`:`<div class="image-placeholder"><span>Image ${i+1}</span></div>`}</div>`).join("")}</div>`;return;
    }
    if(m.type==="callouts"){
      const rows=String(m.text).split("|").map(item=>{const [t,...rest]=item.split(":");return [t,rest.join(":")]});
      el.innerHTML=`<div class="module-inner callout-grid">${rows.slice(0,8).map(([t,b])=>`<div class="callout-item"><b>${esc(t)}</b><span>${esc(b)}</span></div>`).join("")}</div>`;return;
    }
    if(m.type==="palette"){
      el.innerHTML=`<div class="module-inner palette-wrap"><div class="palette-title">${esc(m.text)}</div><div class="palette-row"><span></span><span></span><span></span><span></span><span></span></div></div>`;return;
    }
    if(m.type==="meta"){
      const rows=String(m.text).split("|").map(item=>{const [t,...rest]=item.split(":");return [t,rest.join(":")]});
      el.innerHTML=`<div class="module-inner"><div class="meta-grid">${rows.map(([t,b])=>`<div class="meta-item"><small>${esc(t)}</small><b>${esc(b)}</b></div>`).join("")}</div></div>`;return;
    }
    if(m.type==="north"){
      el.innerHTML=`<div class="module-inner north-wrap"><div class="north-arrow">N<i></i></div><div><div class="scale-bar"><span></span><span></span><span></span><span></span></div><div class="module-label">${esc(m.text)}</div></div></div>`;return;
    }
    if(m.type==="toc"){
      const rows=String(m.text).split("\n").filter(Boolean).map(line=>line.split("|"));
      el.innerHTML=`<div class="module-inner module-toc"><span class="module-label">PROJECT INDEX</span><div class="toc-list">${rows.map(r=>`<div class="toc-row"><small>${esc(r[0]||"")}</small><b>${esc(r[1]||"")}</b><span>${esc(r[2]||"")}</span></div>`).join("")}</div></div>`;return;
    }
    if(m.type==="skills"){
      const rows=String(m.text).split("\n").filter(Boolean).map(line=>line.split("|"));
      el.innerHTML=`<div class="module-inner module-skills"><span class="module-label">SKILLS + TOOLS</span><div class="skills-grid">${rows.map(r=>`<div class="skill-group"><b>${esc(r[0]||"")}</b><span>${esc(r.slice(1).join("|"))}</span></div>`).join("")}</div></div>`;return;
    }
    if(m.type==="tags"){
      const tags=String(m.text).split("|").map(s=>s.trim()).filter(Boolean);
      el.innerHTML=`<div class="module-inner"><div class="tag-list">${tags.map(tag=>`<span class="tag">${esc(tag)}</span>`).join("")}</div></div>`;return;
    }
    if(m.type==="contact"){
      el.innerHTML=`<div class="module-inner module-contact"><span class="module-label">${esc(lines[0]||"CONTACT")}</span><p>${esc(lines.slice(1).join("\n")).replaceAll("\n","<br>")}</p></div>`;return;
    }
    if(m.type==="pagenumber"){
      const n=state.mode==="portfolio"?state.activePageIndex+1:1;
      el.innerHTML=`<div class="module-inner page-number-wrap"><span>${esc(m.text||"PAGE")}</span><b>${String(n).padStart(2,"0")}</b></div>`;return;
    }
  }

  let dragState=null;
  function attachModuleEvents(el){
    el.addEventListener("click",e=>{e.stopPropagation();selectModule(el)});
    el.addEventListener("dblclick",e=>{
      if(singleImageTypes.has(el._m.type)){e.stopPropagation();selectModule(el);replaceImage.click()}
      else if(multiImageTypes.has(el._m.type)){e.stopPropagation();selectModule(el);replaceImages.click()}
    });
    el.addEventListener("pointerdown",startModuleDrag);
  }

  function startModuleDrag(e){
    if(e.button!==0||e.target.closest("input,textarea,select,button"))return;
    const el=e.currentTarget,rect=board.getBoundingClientRect();
    dragState={el,startClientX:e.clientX,startClientY:e.clientY,startX:el._m.x,startY:el._m.y,rect};
    el.classList.add("dragging");el.setPointerCapture?.(e.pointerId);
    document.addEventListener("pointermove",moveModuleDrag);document.addEventListener("pointerup",endModuleDrag,{once:true});
  }
  function moveModuleDrag(e){
    if(!dragState)return;
    const {el,startClientX,startClientY,startX,startY,rect}=dragState;
    const cs=getComputedStyle(document.documentElement),margin=parseFloat(cs.getPropertyValue("--board-margin"))*state.zoom;
    const usableW=Math.max(1,rect.width-2*margin),usableH=Math.max(1,rect.height-2*margin);
    const colDelta=Math.round((e.clientX-startClientX)/(usableW/GRID_COLS)),rowDelta=Math.round((e.clientY-startClientY)/(usableH/GRID_ROWS));
    el._m.x=clamp(startX+colDelta,1,GRID_COLS-el._m.w+1);el._m.y=clamp(startY+rowDelta,1,GRID_ROWS-el._m.h+1);
    applyModelPosition(el);editor.x.value=el._m.x;editor.y.value=el._m.y;
  }
  function endModuleDrag(){if(!dragState)return;dragState.el.classList.remove("dragging");dragState=null;document.removeEventListener("pointermove",moveModuleDrag);saveCurrentDocumentState()}

  function getSelected(){return state.selectedId?document.querySelector(`.module[data-id="${CSS.escape(state.selectedId)}"]`):null}
  function moduleName(type){return moduleLibraryConfig.find(r=>r[0]===type)?.[1]||"Module"}
  function selectModule(el){
    $$(".module.selected",content).forEach(x=>x.classList.remove("selected"));el.classList.add("selected");state.selectedId=el._m.id;
    const m=el._m;editor.title.textContent=moduleName(m.type);editor.text.value=m.text??"";editor.width.value=m.w;editor.height.value=m.h;editor.x.value=m.x;editor.y.value=m.y;editor.align.value=m.align||"start";editor.border.checked=!!m.border;editor.fit.value=m.fit||"cover";
    singleImageTools.hidden=!singleImageTypes.has(m.type);multiImageTools.hidden=!multiImageTypes.has(m.type);drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");
  }
  function clearSelection(){$$(".module.selected",content).forEach(x=>x.classList.remove("selected"));state.selectedId=null}
  function closeDrawer(){drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true")}
  $("#closeDrawer").addEventListener("click",closeDrawer);
  board.addEventListener("click",()=>{clearSelection();closeDrawer()});

  function updateSelectedFromEditor(){
    const el=getSelected();if(!el)return;const m=el._m;
    m.text=editor.text.value;m.w=clamp(editor.width.value,1,GRID_COLS-m.x+1);m.h=clamp(editor.height.value,1,GRID_ROWS-m.y+1);
    m.x=clamp(editor.x.value,1,GRID_COLS-m.w+1);m.y=clamp(editor.y.value,1,GRID_ROWS-m.h+1);m.align=editor.align.value;m.border=editor.border.checked;if(singleImageTypes.has(m.type))m.fit=editor.fit.value;
    renderModule(el);saveCurrentDocumentState();if(state.mode==="portfolio")refreshPageList(false);
  }
  [editor.text,editor.width,editor.height,editor.x,editor.y,editor.align,editor.border,editor.fit].forEach(c=>{c.addEventListener("input",updateSelectedFromEditor);c.addEventListener("change",updateSelectedFromEditor)});
  $("#remove").addEventListener("click",()=>{const el=getSelected();if(!el)return;el.remove();clearSelection();closeDrawer();saveCurrentDocumentState();showToast("Module deleted")});
  $("#duplicate").addEventListener("click",()=>{const el=getSelected();if(!el)return;const c=structuredClone(el._m);delete c.id;c.x=clamp(c.x+1,1,GRID_COLS-c.w+1);c.y=clamp(c.y+1,1,GRID_ROWS-c.h+1);const clone=createModule(c.type,c);content.append(clone);selectModule(clone);saveCurrentDocumentState();showToast("Module duplicated")});

  replaceImage.addEventListener("change",async e=>{const file=e.target.files?.[0],el=getSelected();if(!file||!el||!singleImageTypes.has(el._m.type))return;el._m.image=await fileToDataURL(file);renderModule(el);saveCurrentDocumentState();e.target.value="";showToast("Image replaced")});
  replaceImages.addEventListener("change",async e=>{const files=[...(e.target.files||[])],el=getSelected();if(!files.length||!el||!multiImageTypes.has(el._m.type))return;el._m.images=await Promise.all(files.slice(0,el._m.type==="beforeafter"?2:3).map(fileToDataURL));renderModule(el);saveCurrentDocumentState();e.target.value="";showToast("Images replaced")});
  addImages.addEventListener("change",async e=>{const files=[...(e.target.files||[])];for(const file of files){const image=await fileToDataURL(file);const el=createModule("image",{image,text:stripExtension(file.name),x:1+(content.children.length*2)%8,y:4+(content.children.length*2)%8});content.append(el)}saveCurrentDocumentState();e.target.value="";if(files.length)showToast(`${files.length} image${files.length>1?"s":""} added`)});

  function buildModuleLibrary(){
    const lib=$("#moduleLibrary");lib.innerHTML="";
    moduleLibraryConfig.forEach(([type,name,desc])=>{
      const b=document.createElement("button");b.className="module-add";b.innerHTML=`<b>${esc(name)}</b><small>${esc(desc)}</small>`;
      b.addEventListener("click",()=>{if(type==="image"){addImages.click();return}const el=createModule(type);content.append(el);selectModule(el);saveCurrentDocumentState()});
      lib.append(b);
    });
  }

  function categories(){return state.mode==="portfolio"?[["all","All"],["frontmatter","Front matter"],["project","Project"],["visual","Visual"],["technical","Technical"]]:[["all","All"],["design","Design"],["analysis","Analysis"],["technical","Technical"],["planning","Planning"],["portfolio","Portfolio"]]}
  function buildTemplateFilters(){
    const wrap=$("#templateFilters");wrap.innerHTML="";
    categories().forEach(([key,label],i)=>{const b=document.createElement("button");b.dataset.category=key;b.textContent=label;if(i===0)b.classList.add("active");
      b.addEventListener("click",()=>{$$("#templateFilters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");$$(".template-card").forEach(card=>card.hidden=key!=="all"&&card.dataset.category!==key)});wrap.append(b);
    });
  }
  function buildTemplateLibrary(){
    buildTemplateFilters();const lib=$("#templateLibrary"),templates=currentTemplates();lib.innerHTML="";
    Object.entries(templates).forEach(([key,t])=>{const card=document.createElement("button");card.className="template-card";card.dataset.template=key;card.dataset.category=t.category;card.innerHTML=`<span class="template-preview"></span><b>${esc(t.name)}</b><small>${esc(t.description)}</small>`;
      const preview=$(".template-preview",card);t.modules.forEach(([type,x,y,w,h])=>{const r=document.createElement("i");r.className=`preview-block type-${type}`;r.style.left=`${((x-1)/12)*100}%`;r.style.top=`${((y-1)/16)*100}%`;r.style.width=`${(w/12)*100}%`;r.style.height=`${(h/16)*100}%`;preview.append(r)});
      card.addEventListener("click",()=>applyTemplate(key,true));lib.append(card);
    });markActiveTemplate();
  }
  function markActiveTemplate(){
    const key=currentTemplateKey();$$(".template-card").forEach(c=>c.classList.toggle("active",c.dataset.template===key));
    $("#activeTemplateName").textContent=currentTemplates()[key]?.name||(state.mode==="portfolio"?"Custom Portfolio Page":"Custom Board");
  }
  function captureReusableContent(){const pools={};$$(".module",content).forEach(el=>(pools[el._m.type]??=[]).push(structuredClone(el._m)));return pools}
  function applyTemplate(key,preserve=true){
    const t=currentTemplates()[key];if(!t)return;const pools=preserve?captureReusableContent():{},used={};content.innerHTML="";clearSelection();closeDrawer();setCurrentTemplateKey(key);
    t.modules.forEach(([type,x,y,w,h,text])=>{const idx=used[type]||0;used[type]=idx+1;const prior=pools[type]?.[idx],o={x,y,w,h};if(text)o.text=text;if(prior){if(prior.image)o.image=prior.image;if(prior.images)o.images=prior.images;if(prior.text&&!text)o.text=prior.text;if(prior.fit)o.fit=prior.fit}content.append(createModule(type,o))});
    saveCurrentDocumentState();markActiveTemplate();if(state.mode==="portfolio")refreshPageList(false);showToast(`${t.name} applied`);
  }
  $("#reapplyTemplate").addEventListener("click",()=>applyTemplate(currentTemplateKey(),true));

  function currentModulesSnapshot(){return $$(".module",content).map(el=>structuredClone(el._m))}
  function guessPageName(page){const opener=page.modules?.find(m=>["projecttitle","heading"].includes(m.type));return opener?.text?.split("\n")[0]?.replace(/^\d+\s*[—–-]\s*/,"").trim()||page.name||"Portfolio Page"}
  function saveCurrentDocumentState(){
    if(state.mode==="portfolio"){const p=currentPage();if(!p)return;p.modules=currentModulesSnapshot();p.template=state.portfolioTemplate;p.name=guessPageName(p)}else state.boardModules=currentModulesSnapshot();
  }

  function createPortfolioPage(templateKey="projectOverview",name=null){
    const t=portfolioTemplates[templateKey]||portfolioTemplates.projectOverview;
    return {id:`p-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,name:name||t.name,template:templateKey,modules:t.modules.map(([type,x,y,w,h,text])=>makeModel(type,{x,y,w,h,...(text?{text}:{})}))};
  }
  function ensurePortfolioPages(){
    if(state.portfolioPages.length)return;
    state.portfolioPages=[createPortfolioPage("cover","Cover"),createPortfolioPage("contents","Contents"),createPortfolioPage("about","About + CV"),createPortfolioPage("projectOpener","Project 01"),createPortfolioPage("projectOverview","Project Overview")];state.activePageIndex=0;
  }
  function renderPortfolioPage(){
    ensurePortfolioPages();const p=currentPage();content.innerHTML="";
    p.modules.forEach(model=>{const copy=structuredClone(model),el=createModule(copy.type,copy);el._m.id=copy.id;el.dataset.id=copy.id;renderModule(el);content.append(el)});
    state.portfolioTemplate=p.template||"projectOverview";clearSelection();closeDrawer();markActiveTemplate();refreshPageList(false);requestAnimationFrame(updateShellSize);
  }
  function refreshPageList(save=true){
    if(state.mode!=="portfolio")return;if(save)saveCurrentDocumentState();pageList.innerHTML="";
    state.portfolioPages.forEach((p,i)=>{const b=document.createElement("button");b.className=`page-item${i===state.activePageIndex?" active":""}`;b.innerHTML=`<span class="page-number">${String(i+1).padStart(2,"0")}</span><span><strong>${esc(p.name||`Page ${i+1}`)}</strong><small>${esc(portfolioTemplates[p.template]?.name||"Custom page")}</small></span><span class="page-dot"></span>`;
      b.addEventListener("click",()=>{saveCurrentDocumentState();state.activePageIndex=i;renderPortfolioPage()});pageList.append(b);
    });
  }
  $("#addPage").addEventListener("click",()=>{saveCurrentDocumentState();state.portfolioPages.push(createPortfolioPage("projectOverview",`Page ${state.portfolioPages.length+1}`));state.activePageIndex=state.portfolioPages.length-1;renderPortfolioPage();showToast("New portfolio page added")});
  $("#duplicatePage").addEventListener("click",()=>{saveCurrentDocumentState();const p=currentPage();if(!p)return;const c=structuredClone(p);c.id=`p-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;c.name=`${p.name} Copy`;c.modules=c.modules.map(m=>({...m,id:uid()}));state.portfolioPages.splice(state.activePageIndex+1,0,c);state.activePageIndex++;renderPortfolioPage();showToast("Page duplicated")});
  $("#deletePage").addEventListener("click",()=>{if(state.portfolioPages.length<=1){showToast("Portfolio must contain at least one page");return}if(!confirm("Delete the current portfolio page?"))return;state.portfolioPages.splice(state.activePageIndex,1);state.activePageIndex=Math.min(state.activePageIndex,state.portfolioPages.length-1);renderPortfolioPage();showToast("Page deleted")});
  $("#movePageUp").addEventListener("click",()=>{if(state.activePageIndex<=0)return;saveCurrentDocumentState();const i=state.activePageIndex;[state.portfolioPages[i-1],state.portfolioPages[i]]=[state.portfolioPages[i],state.portfolioPages[i-1]];state.activePageIndex--;renderPortfolioPage()});
  $("#movePageDown").addEventListener("click",()=>{if(state.activePageIndex>=state.portfolioPages.length-1)return;saveCurrentDocumentState();const i=state.activePageIndex;[state.portfolioPages[i+1],state.portfolioPages[i]]=[state.portfolioPages[i],state.portfolioPages[i+1]];state.activePageIndex++;renderPortfolioPage()});

  function populateSizeOptions(){
    const options=state.mode==="portfolio"?PORTFOLIO_SIZES:BOARD_SIZES,preferred=state.mode==="portfolio"?"A4":"A2";setup.size.innerHTML="";
    options.forEach(v=>{const o=document.createElement("option");o.value=v;o.textContent=v;setup.size.append(o)});setup.size.value=preferred;
  }
  function setMode(mode,initial=false){
    if(!["board","portfolio"].includes(mode))return;if(!initial)saveCurrentDocumentState();state.mode=mode;board.dataset.mode=mode;
    $$(".mode-switch button").forEach(b=>{const active=b.dataset.mode===mode;b.classList.toggle("active",active);b.setAttribute("aria-selected",String(active))});
    const portfolio=mode==="portfolio";$("#pageManagerPanel").hidden=!portfolio;$("#setupTitle").textContent=portfolio?"Portfolio setup":"Board setup";$("#sizeLabel").textContent=portfolio?"Page size":"Paper size";
    $("#templateSectionNumber").textContent=portfolio?"03":"02";$("#templateSectionTitle").textContent=portfolio?"Page templates":"Layout library";$("#moduleSectionNumber").textContent=portfolio?"04":"03";$("#exportSectionNumber").textContent=portfolio?"05":"04";
    $("#workspaceLabel").textContent=portfolio?"LIVE PORTFOLIO PAGE":"LIVE PRESENTATION BOARD";$("#statusModeHelp").textContent=portfolio?"Each portfolio page is independently editable.":"Drag modules to reposition on the 12 × 16 snap grid.";$("#print").textContent=portfolio?"Print all pages / Save PDF":"Print / Save PDF";
    populateSizeOptions();if(portfolio){setup.orientation.value="portrait";setup.theme.value="minimal";setup.margin.value="42";setup.gap.value="10";ensurePortfolioPages()}else{setup.orientation.value="landscape";setup.theme.value="landscape";setup.margin.value="42";setup.gap.value="12"}
    buildTemplateLibrary();updateSetup();
    if(portfolio)renderPortfolioPage();else{content.innerHTML="";if(state.boardModules.length){state.boardModules.forEach(model=>{const copy=structuredClone(model),el=createModule(copy.type,copy);el._m.id=copy.id;el.dataset.id=copy.id;renderModule(el);content.append(el)})}else applyTemplate(state.boardTemplate,false);markActiveTemplate()}
    requestAnimationFrame(()=>requestAnimationFrame(fitBoard));
  }
  $$(".mode-switch button").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.mode)));

  function updateSetup(){
    board.dataset.size=setup.size.value;board.dataset.orientation=setup.orientation.value;const cls=["board",`theme-${setup.theme.value}`];if($("#guides").checked)cls.push("guides");if($("#grid").checked)cls.push("show-grid");board.className=cls.join(" ");
    document.documentElement.style.setProperty("--guide-cols",setup.guideColumns.value);document.documentElement.style.setProperty("--board-margin",`${setup.margin.value}px`);document.documentElement.style.setProperty("--board-gap",`${setup.gap.value}px`);document.documentElement.style.setProperty("--accent",setup.accent.value);document.documentElement.style.setProperty("--board-bg",state.boardBg);requestAnimationFrame(updateShellSize);
  }
  [setup.size,setup.orientation,setup.guideColumns,setup.theme].forEach(el=>el.addEventListener("change",updateSetup));[setup.margin,setup.gap,setup.accent].forEach(el=>el.addEventListener("input",updateSetup));$("#grid").addEventListener("change",updateSetup);$("#guides").addEventListener("change",updateSetup);
  $$(".swatch").forEach(b=>b.addEventListener("click",()=>{$$(".swatch").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.boardBg=b.dataset.bg;if(state.boardBg==="#17211d")setup.theme.value="dark";updateSetup()}));

  function setZoom(value,keepCenter=true){
    const old=state.zoom,cx=stage.scrollLeft+stage.clientWidth/2,cy=stage.scrollTop+stage.clientHeight/2;state.zoom=clamp(value,.18,1.6);document.documentElement.style.setProperty("--zoom",state.zoom);$("#zoomText").textContent=`${Math.round(state.zoom*100)}%`;updateShellSize();
    if(keepCenter&&old>0){const ratio=state.zoom/old;requestAnimationFrame(()=>{stage.scrollLeft=Math.max(0,cx*ratio-stage.clientWidth/2);stage.scrollTop=Math.max(0,cy*ratio-stage.clientHeight/2)})}
  }
  function updateShellSize(){boardShell.style.width=`${board.offsetWidth*state.zoom}px`;boardShell.style.height=`${board.offsetHeight*state.zoom}px`}
  function fitBoard(){const aw=Math.max(200,stage.clientWidth-110),ah=Math.max(200,stage.clientHeight-110),z=Math.min(aw/board.offsetWidth,ah/board.offsetHeight,1);setZoom(z,false);requestAnimationFrame(()=>{stage.scrollLeft=0;stage.scrollTop=0})}
  $("#plus").addEventListener("click",()=>setZoom(state.zoom+.08));$("#minus").addEventListener("click",()=>setZoom(state.zoom-.08));$("#fitBoard").addEventListener("click",fitBoard);$("#actualSize").addEventListener("click",()=>setZoom(1));
  stage.addEventListener("wheel",e=>{if(!e.ctrlKey)return;e.preventDefault();setZoom(state.zoom+(e.deltaY<0?.06:-.06))},{passive:false});window.addEventListener("resize",()=>requestAnimationFrame(updateShellSize));if("ResizeObserver"in window)new ResizeObserver(updateShellSize).observe(board);

  $("#reset").addEventListener("click",()=>{
    if(!confirm(state.mode==="portfolio"?"Reset the entire portfolio to the starter pages?":"Reset BoardLab to the default presentation board?"))return;
    setup.guideColumns.value="8";setup.margin.value="42";setup.accent.value="#4c6d5d";state.boardBg="#f3f0e8";$("#grid").checked=false;$("#guides").checked=true;$$(".swatch").forEach(b=>b.classList.toggle("active",b.dataset.bg===state.boardBg));
    if(state.mode==="portfolio"){setup.size.value="A4";setup.orientation.value="portrait";setup.gap.value="10";setup.theme.value="minimal";state.portfolioPages=[];state.activePageIndex=0;ensurePortfolioPages();state.portfolioTemplate="cover";renderPortfolioPage()}
    else{setup.size.value="A2";setup.orientation.value="landscape";setup.gap.value="12";setup.theme.value="landscape";state.boardModules=[];state.boardTemplate="balanced";applyTemplate("balanced",false)}
    updateSetup();fitBoard();
  });

  $("#png").addEventListener("click",async()=>{
    if(!window.html2canvas){showToast("PNG export library did not load. Use Print / Save PDF.");return}saveCurrentDocumentState();const selected=getSelected(),hadGuides=board.classList.contains("guides"),hadGrid=board.classList.contains("show-grid");selected?.classList.remove("selected");board.classList.remove("guides","show-grid");showToast("Rendering high-resolution PNG…");
    try{const canvas=await html2canvas(board,{scale:Number($("#exportScale").value),backgroundColor:getComputedStyle(board).backgroundColor,useCORS:true,logging:false});const a=document.createElement("a");a.download=state.mode==="portfolio"?`boardlab-portfolio-page-${String(state.activePageIndex+1).padStart(2,"0")}.png`:"boardlab-presentation.png";a.href=canvas.toDataURL("image/png",1);a.click();showToast("PNG exported")}catch(err){console.error(err);showToast("PNG export failed. Try Print / Save PDF.")}
    if(hadGuides)board.classList.add("guides");if(hadGrid)board.classList.add("show-grid");selected?.classList.add("selected");
  });

  function sizeForPrint(){const s=setup.size.value,o=setup.orientation.value;if(["A0","A1","A2","A3","A4"].includes(s))return`${s} ${o}`;if(s==="Square")return"210mm 210mm";return o==="landscape"?"320mm 180mm":"180mm 320mm"}
  function renderStaticPage(modules,index){
    const page=document.createElement("section");page.className=`print-page theme-${setup.theme.value}`;page.style.setProperty("--page-bg",state.boardBg);page.style.background=state.boardBg;
    const wrap=document.createElement("div");wrap.className="board-content";modules.forEach(model=>{const copy=structuredClone(model),el=createModule(copy.type,copy);el._m.id=copy.id;el.dataset.id=copy.id;if(copy.type==="pagenumber"){const old=state.activePageIndex;state.activePageIndex=index;renderModule(el);state.activePageIndex=old}el.classList.remove("selected");wrap.append(el)});page.append(wrap);return page;
  }
  function preparePrintPages(){saveCurrentDocumentState();printPages.innerHTML="";if(state.mode==="portfolio")state.portfolioPages.forEach((p,i)=>printPages.append(renderStaticPage(p.modules,i)));else printPages.append(renderStaticPage(state.boardModules,0))}
  $("#print").addEventListener("click",()=>{preparePrintPages();$("#pageStyle").textContent=`@page{size:${sizeForPrint()};margin:0;}`;setTimeout(()=>window.print(),100)});

  $("#save").addEventListener("click",()=>{
    saveCurrentDocumentState();const project={version:4,mode:state.mode,setup:{size:setup.size.value,orientation:setup.orientation.value,guideColumns:setup.guideColumns.value,margin:setup.margin.value,gap:setup.gap.value,theme:setup.theme.value,accent:setup.accent.value,boardBg:state.boardBg},board:{template:state.boardTemplate,modules:state.boardModules},portfolio:{activePageIndex:state.activePageIndex,template:state.portfolioTemplate,pages:state.portfolioPages}};
    const blob=new Blob([JSON.stringify(project,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=state.mode==="portfolio"?"boardlab-portfolio-project.json":"boardlab-board-project.json";a.click();URL.revokeObjectURL(url);showToast("Editable project saved");
  });
  $("#load").addEventListener("change",async e=>{const file=e.target.files?.[0];if(!file)return;try{loadProject(JSON.parse(await file.text()));showToast("Project loaded")}catch(err){console.error(err);showToast("Could not load project")}e.target.value=""});
  function loadProject(p){
    if(!p||typeof p!=="object")throw new Error("Invalid project");
    if(p.version===3&&p.setup&&Array.isArray(p.modules)){state.boardTemplate=p.setup.template||"balanced";state.boardModules=p.modules;setMode("board",true);setup.size.value=p.setup.size||"A2";setup.orientation.value=p.setup.orientation||"landscape";setup.guideColumns.value=p.setup.guideColumns||"8";setup.margin.value=p.setup.margin||"42";setup.gap.value=p.setup.gap||"12";setup.theme.value=p.setup.theme||"landscape";setup.accent.value=p.setup.accent||"#4c6d5d";state.boardBg=p.setup.boardBg||"#f3f0e8";updateSetup();setMode("board",true);requestAnimationFrame(fitBoard);return}
    if(p.version!==4)throw new Error("Unsupported project version");
    state.boardTemplate=p.board?.template||"balanced";state.boardModules=p.board?.modules||[];state.portfolioPages=p.portfolio?.pages||[];state.activePageIndex=Math.min(Math.max(0,p.portfolio?.activePageIndex||0),Math.max(0,state.portfolioPages.length-1));state.portfolioTemplate=p.portfolio?.template||"projectOverview";
    setMode(p.mode||"board",true);
    if(p.setup){setup.size.value=p.setup.size|| (state.mode==="portfolio"?"A4":"A2");setup.orientation.value=p.setup.orientation||(state.mode==="portfolio"?"portrait":"landscape");setup.guideColumns.value=p.setup.guideColumns||"8";setup.margin.value=p.setup.margin||"42";setup.gap.value=p.setup.gap||(state.mode==="portfolio"?"10":"12");setup.theme.value=p.setup.theme||(state.mode==="portfolio"?"minimal":"landscape");setup.accent.value=p.setup.accent||"#4c6d5d";state.boardBg=p.setup.boardBg||"#f3f0e8"}
    updateSetup();if(state.mode==="portfolio")renderPortfolioPage();else{content.innerHTML="";state.boardModules.forEach(model=>{const copy=structuredClone(model),el=createModule(copy.type,copy);el._m.id=copy.id;el.dataset.id=copy.id;renderModule(el);content.append(el)});markActiveTemplate()}requestAnimationFrame(fitBoard);
  }

  function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove("show"),1800)}

  buildModuleLibrary();populateSizeOptions();buildTemplateLibrary();setup.size.value="A2";setup.orientation.value="landscape";updateSetup();applyTemplate("balanced",false);requestAnimationFrame(()=>requestAnimationFrame(fitBoard));
})();
