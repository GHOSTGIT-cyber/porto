// Génère sitemap.xml à partir des pages HTML réellement indexables.
// Usage : npm run sitemap
//
// Règles :
//  - une page entre au sitemap si elle est en HTML, à la racine, dans blog/ ou Projets/,
//    et qu'elle ne porte ni <meta name="robots" content="noindex"> ni de canonical vers une autre URL ;
//  - <lastmod> = date du dernier commit git qui a touché le fichier (pas la date système,
//    qui change à chaque clone). Un fichier jamais commité prend la date du jour ;
//  - pas de <priority> ni <changefreq> : Google les ignore, autant ne pas les inventer.
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const ORIGIN = 'https://bakabi.fr';
const DIRS = ['', 'blog', 'Projets'];

function lastmod(file) {
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${file}"`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim();
    if (iso) return iso.slice(0, 10);
  } catch (e) { /* pas de git : on retombe sur la date du jour */ }
  return new Date().toISOString().slice(0, 10);
}

function indexable(file) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)) return false;
  const url = ORIGIN + '/' + (file === 'index.html' ? '' : file.replace(/\\/g, '/'));
  const canon = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i) || [])[1];
  // une page dont le canonical pointe ailleurs est un doublon assumé : hors sitemap
  if (canon && canon.replace(/\/$/, '') !== url.replace(/\/$/, '')) return false;
  return true;
}

const pages = [];
for (const dir of DIRS) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) continue;
  for (const name of fs.readdirSync(full)) {
    if (!name.endsWith('.html')) continue;
    const file = dir ? `${dir}/${name}` : name;
    if (indexable(file)) pages.push(file);
  }
}
// l'accueil d'abord, puis par ordre alphabétique : lisible dans un diff
pages.sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b)));

const xml = ['<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
for (const file of pages) {
  const loc = ORIGIN + '/' + (file === 'index.html' ? '' : file);
  xml.push('  <url>', `    <loc>${loc}</loc>`, `    <lastmod>${lastmod(file)}</lastmod>`, '  </url>');
}
xml.push('</urlset>', '');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml.join('\n'));
console.log(`sitemap.xml : ${pages.length} URL indexables`);
for (const f of pages) console.log(`  ${lastmod(f)}  /${f === 'index.html' ? '' : f}`);
