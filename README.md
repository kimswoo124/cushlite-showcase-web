# CUSHLITE Showcase — app

Sergio Tacchini CUSHLITE 302 / 702 쇼케이스. 배포 소스.

- 전체 폴더 구조·자산 흐름: 상위 `../README.md`
- 배포 절차·이력: 상위 `../DEPLOY.md`

```bash
npm install
npm start                                   # S3 모드
MEDIA_LOCAL_DIR=$PWD/media-source npm start # 로컬 미디어 모드
npm run media:verify                        # 경로 전수 검증
npm run media:upload                        # S3 업로드
```

영상·이미지는 저장소에 두지 않는다. S3 에 올리고 서버가 중계한다.
