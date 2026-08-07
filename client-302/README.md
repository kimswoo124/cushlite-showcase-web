# CUSHLITE 302 Showcase

SERGIO TACCHINI CUSHLITE 302의 로컬 인터랙티브 제품 쇼케이스입니다. 기존 `SHOWCASE`의 CUSHLITE 702 프로젝트와 분리되어 있습니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5302`을 엽니다.

프로덕션 빌드 확인:

```bash
npm run build
npm run preview
```

## 구조

- `src/App.jsx`: 장면 구성, 최초 자동 재생, 스크롤 스크럽, 화살표 이동
- `src/data.js`: 기능 설명, 가격 비교, 콜아웃 위치
- `src/styles.css`: 반응형 레이아웃과 모션 스타일
- `public/processed/video`: 크롭 및 재인코딩한 웹 영상
- `public/processed/images`: 포스터, 배경 분리 제품 컷, 소재 사진

이번 버전에는 DCS 배포 설정과 단일 HTML 패키징이 포함되지 않습니다.
