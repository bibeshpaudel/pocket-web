import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mock the tools data since we can't import JSX/React components in Node directly without transpilation
// We'll just extract the paths we know exist or duplicate the data structure minimally for sitemap
const tools = [
  '/json-formatter',
  '/xml-formatter',
  '/qr-generator',
  '/image-compressor',
  '/password-generator',
  '/markdown-preview',
  '/base64-converter',
  '/svg-viewer',
  '/image-converter',
  '/syntax-highlighter',
  '/hash-generator',
  '/aes-encrypt',
  '/text-compare',
  '/url-encoder',
  '/case-converter',
  '/word-counter',
  '/lorem-ipsum',
  '/uuid-generator',
  '/unit-converter',
  '/timestamp-converter',
  '/timezone-converter',
  '/regex-tester',
  '/ip-lookup'
];

const BASE_URL = 'https://bibeshpaudel.github.io/pocket-web';

const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ${tools
    .map(
      (path) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const publicDir = path.join(__dirname, '../public');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
};

generateSitemap();
