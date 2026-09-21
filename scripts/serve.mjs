import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.webp':'image/webp','.jpeg':'image/jpeg','.jpg':'image/jpeg','.png':'image/png','.pdf':'application/pdf','.svg':'image/svg+xml','.json':'application/json'};
http.createServer(async(req,res)=>{try{let relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=path.resolve(root,'.'+relative);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);return res.end();}const stat=await fs.stat(file);if(stat.isDirectory()){if(!relative.endsWith('/')){res.writeHead(302,{Location:relative+'/'});return res.end();}file=path.join(file,'index.html');}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.end(await fs.readFile(file));}catch{res.writeHead(404);res.end('Not found');}}).listen(4174,'127.0.0.1',()=>console.log('Portfolio: http://127.0.0.1:4174'));
