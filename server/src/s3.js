const S3_API_BASE_URL = process.env.S3_API_BASE_URL
  || 'https://aviyup1kyk.execute-api.ap-northeast-2.amazonaws.com/prod';
const S3_BUCKET = process.env.S3_BUCKET || 'svc-fnf-ax-platform-pub-s3';
const S3_API_KEY = process.env.S3_API_KEY;

const SERVICE_NAME = 'cushlite-showcase';
const ENV = process.env.NODE_ENV === 'production' ? 'prd' : 'dev';
export const KEY_PREFIX = `${SERVICE_NAME}/${ENV}/`;

export const buildKey = (path) => `${KEY_PREFIX}${path.replace(/^\/+/, '')}`;

// S3_KEY_PREFIX 밖의 키는 절대 서명하지 않는다 (경로 조작 차단).
const assertAllowedKey = (key) => {
  const allowed = process.env.S3_KEY_PREFIX || KEY_PREFIX;
  if (!key.startsWith(allowed)) {
    throw new Error(`[보안] 허용되지 않은 S3 경로 접근 시도: ${key}`);
  }
};

// presigned URL 은 유효시간이 짧다(5~15분). 매 Range 요청마다 발급하면
// 왕복이 과해지므로 만료 60초 전까지 재사용한다.
const signatureCache = new Map();
const SAFETY_WINDOW_MS = 60_000;

export async function getPresignedUrl(key, action = 'GET_OBJECT') {
  assertAllowedKey(key);
  if (!S3_API_KEY) throw new Error('S3_API_KEY 환경변수가 설정되지 않았습니다.');

  const cacheKey = `${action}:${key}`;
  const cached = signatureCache.get(cacheKey);
  if (cached && cached.expiresAt - SAFETY_WINDOW_MS > Date.now()) return cached.url;

  const response = await fetch(`${S3_API_BASE_URL}/sign`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': S3_API_KEY },
    body: JSON.stringify({ bucket: S3_BUCKET, key, action }),
  });

  if (!response.ok) {
    throw new Error(`Presigned URL 발급 실패 (${response.status}): ${key}`);
  }

  const data = await response.json();
  const expiresAt = data.expiresAt ? Date.parse(data.expiresAt) : Date.now() + 300_000;
  signatureCache.set(cacheKey, { url: data.url, expiresAt });
  return data.url;
}

export async function listObjects(prefix = '') {
  if (!S3_API_KEY) throw new Error('S3_API_KEY 환경변수가 설정되지 않았습니다.');
  const params = new URLSearchParams({
    bucket: S3_BUCKET,
    prefix: buildKey(prefix),
    maxKeys: '1000',
  });
  const response = await fetch(`${S3_API_BASE_URL}/list?${params}`, {
    headers: { 'x-api-key': S3_API_KEY },
  });
  if (!response.ok) throw new Error(`S3 목록 조회 실패 (${response.status})`);
  const data = await response.json();
  return data.items ?? [];
}

export async function uploadObject(path, body, contentType) {
  const key = buildKey(path);
  const url = await getPresignedUrl(key, 'PUT_OBJECT');
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body,
  });
  if (!response.ok) {
    throw new Error(`S3 업로드 실패 (${response.status}): ${key}`);
  }
  return key;
}
