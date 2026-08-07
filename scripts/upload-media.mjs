/**
 * 코드가 실제로 참조하는 영상만 S3 에 올린다.
 * (미참조 파일까지 올리면 용량만 먹고 검증 대상도 흐려진다)
 *
 *   node --env-file=.env scripts/upload-media.mjs [--force]
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { listObjects, uploadObject } from '../server/src/s3.js';

const FORCE = process.argv.includes('--force');
const PRODUCTS = ['302', '702'];
const MEDIA_DIR = path.resolve('media-source');
const ASSET_PATH_CALL = /assetPath\(\s*['"`]([^'"`]+)['"`]\s*\)/g;

const CONTENT_TYPES = {
  '.mp4': 'video/mp4',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

const collectSources = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await collectSources(full));
    else if (/\.(js|jsx)$/.test(entry.name)) files.push(full);
  }
  return files;
};

// 이미 올라간 파일은 크기가 같으면 건너뛴다.
const existing = new Map();
for (const item of await listObjects('media/')) {
  existing.set(item.key, item.size);
}
console.log(`S3 기존 자산 ${existing.size}개\n`);

let uploaded = 0;
let skipped = 0;
const missing = [];

for (const product of PRODUCTS) {
  const referenced = new Set();
  for (const file of await collectSources(path.resolve(`client-${product}/src`))) {
    const source = await readFile(file, 'utf8');
    for (const match of source.matchAll(ASSET_PATH_CALL)) {
      const media = match[1].match(/(?:^|\/)((?:video|images)\/.+)$/);
      if (media) referenced.add(media[1]);
    }
  }

  for (const relPath of [...referenced].sort()) {
    const localPath = path.join(MEDIA_DIR, product, relPath);
    let info;
    try {
      info = await stat(localPath);
    } catch {
      missing.push(`${product}/${relPath}`);
      continue;
    }

    const key = `cushlite-showcase/prd/media/${product}/${relPath}`;
    if (!FORCE && existing.get(key) === info.size) {
      skipped += 1;
      continue;
    }

    const body = await readFile(localPath);
    await uploadObject(`media/${product}/${relPath}`, body, CONTENT_TYPES[path.extname(relPath).toLowerCase()] ?? 'application/octet-stream');
    uploaded += 1;
    console.log(`  ↑ ${product}/${relPath} (${(info.size / 1024).toFixed(0)} KB)`);
  }
}

console.log(`\n업로드 ${uploaded}개 · 건너뜀 ${skipped}개`);

if (missing.length) {
  console.error(`\n❌ 참조되지만 로컬에 없는 영상 ${missing.length}개:`);
  for (const item of missing) console.error(`  ${item}`);
  process.exit(1);
}
