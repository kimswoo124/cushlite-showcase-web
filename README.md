# CUSHLITE Showcase — app

Sergio Tacchini CUSHLITE 302 / 702 개별 쇼케이스와 두 제품을 나란히 보여주는 라인업 쇼케이스 소스.

- `/302/`: CUSHLITE 302
- `/702/`: CUSHLITE 702
- `/lineup/`: CUSHLITE 302 × 702 통합 라인업

- 전체 폴더 구조·자산 흐름: 상위 `../README.md`
- 배포 절차·이력: 상위 `../DEPLOY.md`

```bash
npm install
npm start                                   # S3 모드
MEDIA_LOCAL_DIR=$PWD/media-source npm start # 로컬 미디어 모드
npm run dev -w client-lineup                # 통합본 단독 Vite, localhost:5400
npm run media:verify                        # 경로 전수 검증
npm run media:upload                        # S3 업로드
```

영상·이미지는 저장소에 두지 않는다. S3 에 올리고 서버가 중계한다.
