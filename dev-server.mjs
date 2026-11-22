import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { POST, GET } from './api/contact.js';

const root = resolve('dist');
const port = Number(process.env.PORT || 4173);
const types = {
  '.css':'text/css; charset=utf-8', '.html':'text/html; charset=utf-8',
  '.ico':'image/x-icon', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.png':'image/png', '.svg':'image/svg+xml', '.txt':'text/plain; charset=utf-8',
  '.webp':'image/webp', '.xml':'application/xml; charset=utf-8'
};

createServer(async (incoming, outgoing) => {
  const url = new URL(incoming.url, `http://${incoming.headers.host || 'localhost'}`);
  outgoing.setHeader('Cache-Control', 'no-store');
  if (url.pathname === '/api/contact') {
    try {
      const headers = new Headers();
      for (const name of ['content-type','content-length','referer','origin']) {
        if (incoming.headers[name]) headers.set(name, incoming.headers[name]);
      }
      const body = incoming.method === 'POST' ? incoming : undefined;
      const request = new Request(url, {method:incoming.method, headers, body, duplex:body ? 'half' : undefined});
      const response = await (incoming.method === 'POST' ? POST(request) : GET());
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      outgoing.end(Buffer.from(await response.arrayBuffer()));
    } catch {
      outgoing.writeHead(500, {'Content-Type':'application/json; charset=utf-8'});
      outgoing.end(JSON.stringify({success:false,message:'The local form service encountered an error.'}));
    }
    return;
  }
  if (incoming.method !== 'GET' && incoming.method !== 'HEAD') {
    outgoing.writeHead(405); outgoing.end(); return;
  }
  let file;
  try { file = resolve(root, '.' + decodeURIComponent(url.pathname)); }
  catch { outgoing.writeHead(400); outgoing.end(); return; }
  if (file !== root && !file.startsWith(root + sep)) {
    outgoing.writeHead(403); outgoing.end(); return;
  }
  try {
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const extension = file.slice(file.lastIndexOf('.'));
    const data = await readFile(file);
    outgoing.writeHead(200, {'Content-Type':types[extension] || 'application/octet-stream'});
    outgoing.end(incoming.method === 'HEAD' ? undefined : data);
  } catch {
    outgoing.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
    outgoing.end('Not found');
  }
}).listen(port, () => console.log(`Preview ready at http://localhost:${port}/`));
