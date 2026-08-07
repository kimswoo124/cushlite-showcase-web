/**
 * 빌드 산출물이 참조하는 모든 자산 경로가 실제로 200/206 을 주는지 전수 확인한다.
 * 배포 전후로 돌려 "링크 경로 때문에 조용히 깨지는" 상황을 잡아낸다.
 *
 *   node scripts/verify-media.mjs [baseUrl]
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = (process.argv[2] || process.env.VERIFY_BASE_URL || 'http://localhost:3311').replace(/\/$/, '');
const PRODUCTS = ['302', '702'];

// assetPath() 는 URL 을 런타임에 조합하므로 빌드 산출물에는 완전한 경로가 남지 않는다.
// 따라서 소스의 assetPath('...') 인자를 읽어 실제 요청될 URL 을 그대로 재구성한다.
const ASSET_PATH_CALL = /assetPath\(\s*['"`]([^'"`]+)['"`]\s*\)/g;

// assetPath 인자 → 브라우저가 실제로 요청하는 URL
const toRequestUrl = (product, assetArg) => {
  const normalized = assetArg.replace(/^\/+/, '');
  const media = normalized.match(/(?:^|\/)(video|images)\/(.+)$/);
  return media ? `/api/media/${product}/${media[1]}/${media[2]}` : `/${product}/${normalized}`;
};

// dist 안에 리터럴로 박혀 있는 경로(HTML/CSS 등)는 별도로 훑는다.
const REFERENCE_PATTERNS = [
  /["'`](\/api\/media\/(?:302|702)\/[a-z0-9-]+\.mp4)["'`]/g,
  /["'`](\/(?:302|702)\/[^"'`\s)]+\.(?:webp|jpg|jpeg|png|svg|woff2|mp4))["'`]/g,
  /url\((?:"|')?(\/(?:302|702)\/[^)'"\s]+\.(?:webp|jpg|jpeg|png|svg|woff2))(?:"|')?\)/g,
];

const collectFiles = async (dir, filter = /\.(js|css|html)$/) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(full, filter));
    else if (filter.test(entry.name)) files.push(full);
  }
  return files;
};

const references = new Set();
for (const product of PRODUCTS) {
  // 1) 소스의 assetPath() 인자 — 런타임에 조합되는 경로 (영상 포함)
  const srcDir = path.resolve(`client-${product}/src`);
  for (const file of await collectFiles(srcDir, /\.(js|jsx)$/)) {
    const source = await readFile(file, 'utf8');
    for (const match of source.matchAll(ASSET_PATH_CALL)) {
      references.add(toRequestUrl(product, match[1]));
    }
  }

  // 2) 빌드 산출물에 리터럴로 남은 경로
  const distDir = path.resolve(`client-${product}/dist`);
  for (const file of await collectFiles(distDir)) {
    const source = await readFile(file, 'utf8');
    for (const pattern of REFERENCE_PATTERNS) {
      for (const match of source.matchAll(pattern)) references.add(match[1]);
    }
  }
}

const targets = [...references].sort();
console.log(`검증 대상 ${targets.length}개 · base=${BASE_URL}\n`);

const failures = [];
let videoCount = 0;
let imageCount = 0;

for (const target of targets) {
  // Range 206 은 영상에만 요구한다. 이미지는 200 이 정상.
  const isVideo = target.startsWith('/api/media/') && target.endsWith('.mp4');
  if (isVideo) videoCount += 1;
  else if (target.startsWith('/api/media/')) imageCount += 1;

  try {
    const response = await fetch(`${BASE_URL}${target}`, {
      headers: isVideo ? { Range: 'bytes=0-1023' } : {},
    });
    if (isVideo) {
      if (response.status !== 206) {
        failures.push({ target, status: response.status, reason: 'Range 206 아님 (스크러빙 불가)' });
      } else if (!response.headers.get('content-range')) {
        failures.push({ target, status: response.status, reason: 'Content-Range 헤더 없음' });
      }
    } else if (!response.ok) {
      failures.push({ target, status: response.status, reason: 'not ok' });
    }
  } catch (error) {
    failures.push({ target, status: 'ERR', reason: error.message });
  }
}

console.log(`영상 ${videoCount}개 / 이미지 ${imageCount}개 / 정적 자산 ${targets.length - videoCount - imageCount}개`);

if (failures.length) {
  console.error(`\n❌ 실패 ${failures.length}건:`);
  for (const failure of failures) {
    console.error(`  [${failure.status}] ${failure.target} — ${failure.reason}`);
  }
  process.exit(1);
}

console.log('\n✅ 전부 정상 — 깨진 경로 없음');
