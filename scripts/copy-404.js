import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, '../docs');
const indexHtml = path.join(docsDir, 'index.html');
const notFoundHtml = path.join(docsDir, '404.html');

console.log('Creating 404.html from index.html...');

try {
  if (fs.existsSync(indexHtml)) {
    fs.copyFileSync(indexHtml, notFoundHtml);
    console.log('Successfully created 404.html');
  } else {
    console.error('Error: index.html not found in docs directory. Make sure to run build first.');
    process.exit(1);
  }
} catch (err) {
  console.error('Error creating 404.html:', err);
  process.exit(1);
}
