# CUSHLITE Showcase — app

Sergio Tacchini CUSHLITE 302 / 702 개별 쇼케이스와 두 제품을 나란히 보여주는 라인업 쇼케이스 소스.

- `/302/`: CUSHLITE 302
- `/702/`: CUSHLITE 702
- `/lineup/`: CUSHLITE 302 × 702 통합 라인업

- 전체 폴더 구조·자산 흐름: 상위 `../README.md`
- 배포 절차·이력: 상위 `../DEPLOY.md`

```bash
npm install
npm run dev:local                           # 기본 개발 모드: 로컬 media-source 사용
npm run media:verify:local                  # 로컬 영상·이미지 경로 전수 확인
npm start                                   # S3 모드: 배포 환경 점검용, 일상 개발에는 사용하지 않음
npm run dev -w client-lineup                # 통합본 단독 Vite, localhost:5400
npm run media:verify                        # S3 배포 경로 전수 검증
npm run media:upload                        # 승인 후에만 S3 업로드
```

영상·이미지는 저장소에 두지 않는다. 로컬 검수 중에는 `media-source/`에서
직접 서빙하고, 승인된 자산만 S3 에 올린 뒤 배포 서버가 중계한다.

작업 순서는 반드시 [`../WORKFLOW.md`](../WORKFLOW.md)를 따른다.
