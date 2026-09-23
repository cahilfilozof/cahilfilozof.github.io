import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {projects} from '../src/projects.mjs';
import {home,caseStudy,esc,pick} from '../src/render.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const modules=fs.readdirSync(path.join(root,'src')).filter(name=>name.endsWith('.mjs')).sort();
const styles=['assembly.css','refinements.css','studio.css','boxes.css','editorial-motion.css'];
const version=createHash('sha256').update([...modules.map(name=>fs.readFileSync(path.join(root,'src',name),'utf8').replace(/\r\n/g,'\n')),...styles.map(name=>fs.readFileSync(path.join(root,name),'utf8').replace(/\r\n/g,'\n'))].join('\n')).digest('hex').slice(0,12);
const releaseDir=path.join(root,'release');fs.mkdirSync(releaseDir,{recursive:true});
// Fingerprint every module, including transitive imports, so cached folder-era
// scripts cannot be combined with newly deployed box styles.
for(const name of modules){const source=fs.readFileSync(path.join(root,'src',name),'utf8').replace(/\r\n/g,'\n');fs.writeFileSync(path.join(releaseDir,name.replace('.mjs',`.${version}.mjs`)),source.replace(/(['"])\.\/([\w-]+)\.mjs\1/g,(_,quote,file)=>`${quote}./${file}.${version}.mjs${quote}`));}
function document(body,project){const base=project?'../../':'';return `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${esc(project?pick(project.description):'Sevde Nur Fidan — Peyzaj mimarlığı portfolyosu.')}"/><title>${esc(project?pick(project.title)+' — Sevde Nur Fidan':'Sevde Nur Fidan — Peyzaj Mimarlığı')}</title><link rel="canonical" href="https://cahilfilozof.github.io/${project?project.route:''}"><meta name="theme-color" content="#f2eee6"><link rel="stylesheet" href="${base}assembly.css"><link rel="stylesheet" href="${base}refinements.css"><link rel="stylesheet" href="${base}studio.css"><link rel="stylesheet" href="${base}boxes.css"><link rel="stylesheet" href="${base}editorial-motion.css"><script src="${base}vendor/gsap.min.js" defer></script><script src="${base}vendor/ScrollTrigger.min.js" defer></script><script src="${base}vendor/lenis.min.js" defer></script><script type="module" src="${base}src/main.mjs"></script></head><body ${project?`data-project="${project.id}"`:''}><div id="app">${body}</div><noscript><p class="noscript">Projeleri doğrudan açabilirsiniz. / Direct project links remain available without JavaScript.</p></noscript></body></html>`;}
function versionedDocument(body,project){return document(body,project).replace(/src\/main\.mjs/g,`release/main.${version}.mjs`).replace(/(href="[^"]+\.css)"/g,`$1?v=${version}"`);}
fs.writeFileSync(path.join(root,'index.html'),versionedDocument(home()));
for(const project of projects){const target=path.join(root,project.route);fs.mkdirSync(target,{recursive:true});fs.writeFileSync(path.join(target,'index.html'),versionedDocument(caseStudy(project),project));}
console.log(`Generated homepage and ${projects.length} static project routes.`);
