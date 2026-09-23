import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {projects} from '../src/projects.mjs';
const base=process.argv[2]||'https://cahilfilozof.github.io/';
const html=fs.readFileSync('index.html','utf8');
const entry=html.match(/src="(release\/main\.([a-f0-9]+)\.mjs)"/);
const files=['index.html',...projects.map(p=>p.route+'index.html'),...['assembly','boxes','studio','refinements','editorial-motion'].map(n=>n+'.css'),...['gsap.min.js','ScrollTrigger.min.js','lenis.min.js'].map(n=>'vendor/'+n),...fs.readdirSync('release').filter(n=>n.endsWith('.'+entry[2]+'.mjs')).map(n=>'release/'+n)];
const hash=b=>createHash('sha256').update(b.toString().replace(/\r\n/g,'\n')).digest('hex');
let failures=0;
for(let i=0;i<files.length;i+=4){await Promise.all(files.slice(i,i+4).map(async file=>{try{const response=await fetch(new URL(file+(file.endsWith('.css')?'?v='+entry[2]:''),base),{signal:AbortSignal.timeout(20000)});const body=Buffer.from(await response.arrayBuffer());const matches=response.ok&&hash(body)===hash(fs.readFileSync(file));if(!matches)failures++;console.log(JSON.stringify({file,status:response.status,matches,type:response.headers.get('content-type'),bytes:body.length}));}catch(error){failures++;console.log(JSON.stringify({file,error:error.message}));}}));}
console.log(JSON.stringify({checked:files.length,failures}));process.exitCode=failures?1:0;
