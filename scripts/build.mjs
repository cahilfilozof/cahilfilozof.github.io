import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {projects} from '../src/projects.mjs';
import {home,caseStudy,esc,pick} from '../src/render.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
function document(body,project){const base=project?'../../':'';return `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${esc(project?pick(project.description):'Sevde Nur Fidan — Peyzaj mimarlığı portfolyosu.')}"/><title>${esc(project?pick(project.title)+' — Sevde Nur Fidan':'Sevde Nur Fidan — Peyzaj Mimarlığı')}</title><link rel="canonical" href="https://cahilfilozof.github.io/${project?project.route:''}"><meta name="theme-color" content="#f2eee6"><link rel="stylesheet" href="${base}assembly.css"><script src="${base}vendor/gsap.min.js" defer></script><script src="${base}vendor/ScrollTrigger.min.js" defer></script><script src="${base}vendor/lenis.min.js" defer></script><script type="module" src="${base}src/main.mjs"></script></head><body ${project?`data-project="${project.id}"`:''}><div id="app">${body}</div><noscript><p class="noscript">Projeleri doğrudan açabilirsiniz. / Direct project links remain available without JavaScript.</p></noscript></body></html>`;}
fs.writeFileSync(path.join(root,'index.html'),document(home()));
for(const project of projects){const target=path.join(root,project.route);fs.mkdirSync(target,{recursive:true});fs.writeFileSync(path.join(target,'index.html'),document(caseStudy(project),project));}
console.log(`Generated homepage and ${projects.length} static project routes.`);
