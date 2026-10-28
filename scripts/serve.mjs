import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Local tooling only; production serves static files from dist/.
const root = path.resolve(fileURLToPath(new URL(Bun.argv.includes('--dist') ? '../dist/' : '../public/', import.meta.url)));
const server = Bun.serve({
  hostname: Bun.env.HOST || '127.0.0.1',
  port: Number(Bun.env.PORT || 4173),
  async fetch(request) {
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    try {
      let pathname = decodeURIComponent(new URL(request.url).pathname);
      if (pathname.includes('\0')) return new Response('Bad request', { status: 400 });
      const base = path.resolve(root, '.' + pathname);
      if (base !== root && !base.startsWith(root + path.sep)) return new Response('Forbidden', { status: 403 });
      const candidates = [base, base + '.html', path.join(base, 'index.html')];
      let filename;
      for (const candidate of candidates) {
        try { if ((await stat(candidate)).isFile()) { filename = candidate; break; } }
        catch (error) { if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error; }
      }
      if (!filename) return new Response('Not found', { status: 404 });
      const file = Bun.file(filename);
      return new Response(request.method === 'HEAD' ? null : file, {
        headers: {
          'Content-Type': file.type,
          'Content-Length': String(file.size),
          'Cache-Control': 'no-cache',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    } catch (error) {
      const status = error instanceof URIError ? 400 : ['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : 500;
      return new Response(status === 400 ? 'Bad request' : status === 404 ? 'Not found' : 'Server error', { status });
    }
  },
});
console.log(`Website preview: ${server.url}`);
