import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {projects} from '../src/projects.mjs';
import {edge, piecePath, topology, closeEnough} from '../src/geometry.mjs';
import {home,caseStudy,esc} from '../src/render.mjs';

test('opposite shared edges describe the same jigsaw boundary',()=>{
  // Compare the cubic control points in reverse order, including tab depth.
  for(const [dx,dy] of [[180,0],[0,170],[-180,0],[0,-170]]){
    const parse=s=>[...s.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map(m=>[+m[1],+m[2]]);
    for(const sign of [-1,1]){
      const forward=parse(edge(200,220,dx,dy,sign));
      const backward=parse(edge(200+dx,220+dy,-dx,-dy,-sign));
      assert.deepEqual(forward.slice(0,-1),backward.slice(0,-1).reverse());
    }
  }
});
test('responsive topology is intentionally smaller and snapping is radial',()=>{
  assert.deepEqual(topology(390,8),{cols:2,rows:2});
  assert.deepEqual(topology(820,8),{cols:3,rows:2});
  assert.deepEqual(topology(1440,8),{cols:4,rows:2});
  assert.equal(closeEnough(24,32,40),true);
  assert.equal(closeEnough(32,32,40),false);
  assert.match(piecePath(0,0,3,2,600,400),/^M0,0L200,0/);
});
test('all seven projects have complete real assets and static direct routes',()=>{
  assert.equal(projects.length,7);assert.equal(new Set(projects.map(p=>p.id)).size,7);
  for(const p of projects){
    for(const file of [p.image,p.puzzleImage,`${p.route}index.html`,...p.pages.flatMap(n=>[`assets/boards/page-${n}.webp`,`assets/boards/page-${n}-small.webp`])]) assert.ok(fs.statSync(file).size>0,file);
    for(const lang of ['tr','en']){
      const html=caseStudy(p,lang);
      assert.ok(html.includes(esc(p.title[lang==='tr'?0:1])));
      assert.equal((html.match(/class="board-figure"/g)||[]).length,p.pages.length);
      assert.ok(!html.includes('undefined'));
    }
  }
});
test('every generated HTML local link and asset resolves; local tools stay unlinked',()=>{
  for(const file of ['index.html',...projects.map(p=>`${p.route}index.html`)]){
    const html=fs.readFileSync(file,'utf8');
    assert.ok(!/boardlab|landscape-toolkit/i.test(html));
    for(const [,url] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
      if(/^(?:https?:|mailto:|tel:|#)/.test(url))continue;
      assert.ok(fs.existsSync(path.resolve(path.dirname(file),url.split('#')[0])),`${file}: ${url}`);
    }
  }
  for(const lang of ['en','tr'])assert.equal((home(lang).match(/class="project-package"/g)||[]).length,7);
});

test('every project offers direct exploration and optional replay, with real chapter destinations',()=>{
  for(const lang of ['tr','en']){
    const html=home(lang);
    assert.equal((html.match(/package-action-primary/g)||[]).length,7);
    assert.equal((html.match(/data-replay="true"/g)||[]).length,7);
    for(const p of projects){
      const page=caseStudy(p,lang);
      for(const id of ['approach','visualization','drawings']){
        assert.ok(page.includes(`href="#${id}"`));
        assert.ok(page.includes(`id="${id}"`));
      }
    }
  }
});
