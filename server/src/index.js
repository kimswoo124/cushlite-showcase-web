import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { buildKey, getPresignedUrl } from './s3.js';

// MEDIA_LOCAL_DIR 이 설정되면 S3 대신 로컬 파일에서 서빙한다.
// S3 자격증명 없이 스크러빙 동작을 그대로 검증하기 위한 개발용 경로.
const MEDIA_LOCAL_DIR = process.env.MEDIA_LOCAL_DIR;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');
const PORT = process.env.PORT || 3000;

const app = express();
app.disable('x-powered-by');

const PRODUCTS = new Set(['302', '702']);
const SHOWCASES = ['302', '702', 'lineup'];

// 미디어 경로 화이트리스트 — 경로 조작(../)과 임의 키 서명 요청을 원천 차단한다.
// video/ 와 images/ 아래만 허용하고, 각 세그먼트는 영숫자로 시작해야 한다
// (따라서 '..' 세그먼트가 성립하지 않는다). 대문자·언더스코어를 포함한
// 실제 파일명(IMG_5227-stage.webp 등)도 통과해야 하므로 허용 문자에 포함한다.
const MEDIA_PATH = /^(video|images)\/(?:[A-Za-z0-9][A-Za-z0-9_-]*\/)*[A-Za-z0-9][A-Za-z0-9_-]*\.(mp4|webp|jpg|jpeg|png)$/;

const CONTENT_TYPES = {
  '.mp4': 'video/mp4',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

app.get('/healthz', (_req, res) => res.json({ ok: true, media: MEDIA_LOCAL_DIR ? 'local' : 's3' }));

// 로컬 파일을 Range 규약에 맞춰 서빙 (개발용 fallback).
function streamLocalFile(req, res, product, mediaPath) {
  const filePath = path.join(MEDIA_LOCAL_DIR, product, mediaPath);
  if (!filePath.startsWith(path.resolve(MEDIA_LOCAL_DIR))) {
    return res.status(400).json({ error: 'Invalid media path' });
  }

  let stat;
  try {
    stat = fs.statSync(filePath);
  } catch {
    return res.status(404).json({ error: 'Media not found', file: `${product}/${mediaPath}` });
  }

  res.setHeader('Content-Type', CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream');
  res.setHeader('Accept-Ranges', 'bytes');

  const range = req.headers.range;
  if (!range) {
    res.setHeader('Content-Length', stat.size);
    return fs.createReadStream(filePath).pipe(res);
  }

  const [startRaw, endRaw] = range.replace(/bytes=/, '').split('-');
  const start = Number.parseInt(startRaw, 10) || 0;
  const end = endRaw ? Number.parseInt(endRaw, 10) : stat.size - 1;
  if (start >= stat.size || end >= stat.size) {
    res.setHeader('Content-Range', `bytes */${stat.size}`);
    return res.status(416).end();
  }

  res.status(206);
  res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`);
  res.setHeader('Content-Length', end - start + 1);
  fs.createReadStream(filePath, { start, end }).pipe(res);
}

/**
 * 영상 스트리밍 프록시.
 * <video> 는 seek 할 때 Range 요청을 보내므로, 파일을 통째로 받아 넘기면
 * 스크롤 스크러빙이 동작하지 않는다. Range 헤더를 S3 로 그대로 전달하고
 * 206 응답 헤더(Content-Range 등)를 되돌려줘야 한다.
 */
app.get('/api/media/:product/*', async (req, res) => {
  const { product } = req.params;
  const mediaPath = req.params[0];

  if (!PRODUCTS.has(product) || !MEDIA_PATH.test(mediaPath)) {
    return res.status(400).json({ error: 'Invalid media path' });
  }

  if (MEDIA_LOCAL_DIR) return streamLocalFile(req, res, product, mediaPath);

  try {
    const key = buildKey(`media/${product}/${mediaPath}`);
    const signedUrl = await getPresignedUrl(key, 'GET_OBJECT');

    const upstream = await fetch(signedUrl, {
      headers: req.headers.range ? { Range: req.headers.range } : {},
    });

    if (!upstream.ok && upstream.status !== 206) {
      return res.status(upstream.status === 404 ? 404 : 502)
        .json({ error: `Upstream ${upstream.status}`, key });
    }

    res.status(upstream.status);
    for (const header of ['content-type', 'content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified']) {
      const value = upstream.headers.get(header);
      if (value) res.setHeader(header, value);
    }
    if (!upstream.headers.get('accept-ranges')) res.setHeader('Accept-Ranges', 'bytes');
    // 브라우저가 저장해두고 재요청을 줄이도록. presigned 만료와 무관하게 동작한다.
    res.setHeader('Cache-Control', 'private, max-age=3600');

    if (!upstream.body) return res.end();
    Readable.fromWeb(upstream.body).pipe(res);
  } catch (error) {
    console.error('[media] 스트리밍 실패:', error.message);
    res.status(500).json({ error: 'Media streaming failed' });
  }
});

// 각 쇼케이스의 빌드 산출물을 서브경로로 서빙한다.
for (const showcase of SHOWCASES) {
  app.use(`/${showcase}`, express.static(path.join(projectRoot, `client-${showcase}/dist`), {
    index: 'index.html',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
    },
  }));
}

app.get('/', (_req, res) => res.redirect(302, '302/'));

app.use((req, res) => {
  const match = req.path.match(/^\/(302|702|lineup)\//);
  if (match) {
    return res.sendFile(path.join(projectRoot, `client-${match[1]}/dist/index.html`));
  }
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CUSHLITE showcase server listening on ${PORT}`);
});
