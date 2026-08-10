import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'client-lowprofile', 'dist-dcs');
const outputDir = path.join(projectRoot, 'client-lowprofile', 'dist-dcs-single');
const assetsDir = path.join(distDir, 'assets');

const assetFiles = fs.readdirSync(assetsDir);
const scriptFile = assetFiles.find((file) => /^index-.*\.js$/.test(file));
const styleFile = assetFiles.find((file) => /^index-.*\.css$/.test(file));

if (!scriptFile || !styleFile) {
  throw new Error('Dashboard JS or CSS bundle was not found. Build client-lowprofile first.');
}

let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
let script = fs.readFileSync(path.join(assetsDir, scriptFile), 'utf8');
let style = fs.readFileSync(path.join(assetsDir, styleFile), 'utf8');

style = style.replace(/url\((?:["']?)\.\/([^)'\"]+\.woff2)(?:["']?)\)/g, (_match, filename) => {
  const font = fs.readFileSync(path.join(assetsDir, filename)).toString('base64');
  return `url("data:font/woff2;base64,${font}")`;
});

const logo = fs.readFileSync(path.join(distDir, 'sergio-tacchini-mark.svg'), 'utf8');
const logoDataUrl = `data:image/svg+xml;base64,${Buffer.from(logo).toString('base64')}`;
script = script.replaceAll('./sergio-tacchini-mark.svg', logoDataUrl);

let embeddedImageCount = 0;
script = script.replace(
  /\b[A-Za-z_$][\w$]*\(`(images\/[A-Za-z0-9_./-]+\.(?:webp|jpg|jpeg|png))`\)/g,
  (_match, assetPath) => {
    const imagePath = path.join(projectRoot, 'media-source', 'lowprofile', assetPath);
    const extension = path.extname(assetPath).slice(1).toLowerCase();
    const mimeExtension = extension === 'jpg' ? 'jpeg' : extension;
    const image = fs.readFileSync(imagePath).toString('base64');
    embeddedImageCount += 1;
    return `\`data:image/${mimeExtension};base64,${image}\``;
  },
);

html = html
  .replace(
    /<script[^>]+src="\.\/assets\/[^"]+"><\/script>/,
    () => `<script type="module">${script}</script>`,
  )
  .replace(
    /<link[^>]+href="\.\/assets\/[^"]+"[^>]*>/,
    () => `<style>${style}</style>`,
  );

if (/\.\/assets\//.test(html) || /sergio-tacchini-mark\.svg/.test(html)) {
  throw new Error('The standalone dashboard still contains external build assets.');
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'index.html'), html);

const sizeMb = (Buffer.byteLength(html) / 1024 / 1024).toFixed(2);
console.log(
  `Created standalone dashboard: client-lowprofile/dist-dcs-single/index.html (${sizeMb} MB, ${embeddedImageCount} images)`,
);
