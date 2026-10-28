import { cp, mkdir, rm } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
await rm(new URL('dist/', root), { recursive: true, force: true });
await mkdir(new URL('dist/', root), { recursive: true });
await cp(new URL('public/', root), new URL('dist/', root), { recursive: true });
console.log('Built dist/ — static files ready for deployment');

// Supply the actual production origin when it has been assigned.
if (process.env.SITE_URL) {
  const { readFile, writeFile } = await import('node:fs/promises');
  const origin = new URL(process.env.SITE_URL);
  if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) throw new Error('SITE_URL must be an HTTPS origin');
  for (const route of ['', 'terms', 'privacy']) {
    const filename = new URL(`../dist/${route || 'index'}.html`, import.meta.url);
    const url = origin.origin + '/' + route;
    const html = await readFile(filename, 'utf8');
    await writeFile(filename, html.replace('</head>', `<link rel="canonical" href="${url}"><meta property="og:url" content="${url}"></head>`));
  }
  await writeFile(new URL('../dist/sitemap.xml', import.meta.url), '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ['', 'terms', 'privacy'].map(route => `<url><loc>${origin.origin}/${route}</loc></url>`).join('') + '</urlset>');
  await writeFile(new URL('../dist/robots.txt', import.meta.url), `User-agent: *\nAllow: /\nSitemap: ${origin.origin}/sitemap.xml\n`);
}
