const MEDIA_ORIGIN = (import.meta.env.VITE_MEDIA_ORIGIN || '').replace(/\/$/, '');
export const assetPath = (path) => `${MEDIA_ORIGIN}/api/media/lowprofile/${path}`;

/**
 * @typedef {Object} ProductColorway
 * @property {'mary-jane'|'trainer'} style
 * @property {string} color
 * @property {string} studio
 * @property {string} onFoot
 * @property {number} price
 * @property {string} styling
 */

/** @type {ProductColorway[]} */
export const PRODUCT_COLORWAYS = [
  {
    style: 'mary-jane',
    color: 'Ivory',
    studio: assetPath('images/generated/studio/mary-jane-ivory.webp'),
    onFoot: assetPath('images/generated/on-foot/mary-jane-ivory.webp'),
    price: 129000,
    styling: '파우더 블루 시어 삭스와 탑뷰 시팅',
  },
  {
    style: 'mary-jane',
    color: 'Mist Blue',
    studio: assetPath('images/generated/studio/mary-jane-mist-blue.webp'),
    onFoot: assetPath('images/generated/on-foot/mary-jane-mist-blue.webp'),
    price: 129000,
    styling: '아이보리 플루이드 팬츠와 낮은 플로어 포즈',
  },
  {
    style: 'mary-jane',
    color: 'Rose',
    studio: assetPath('images/generated/studio/mary-jane-rose.webp'),
    onFoot: assetPath('images/generated/on-foot/mary-jane-rose-v2.webp'),
    price: 129000,
    styling: '연청 롤업 데님과 아이보리 시어 삭스',
  },
  {
    style: 'mary-jane',
    color: 'Black',
    studio: assetPath('images/generated/studio/mary-jane-black.webp'),
    onFoot: assetPath('images/generated/on-foot/mary-jane-black.webp'),
    price: 129000,
    styling: '그레이 시어 삭스와 모노톤 시팅',
  },
  {
    style: 'trainer',
    color: 'Sand',
    studio: assetPath('images/generated/studio/trainer-sand.webp'),
    onFoot: assetPath('images/generated/on-foot/trainer-sand.webp'),
    price: 139000,
    styling: '화이트 슬라우치 삭스와 교차된 다리',
  },
  {
    style: 'trainer',
    color: 'Black',
    studio: assetPath('images/generated/studio/trainer-black.webp'),
    onFoot: assetPath('images/generated/on-foot/trainer-black.webp'),
    price: 139000,
    styling: '그레이 시어 니삭스와 블랙 새틴',
  },
  {
    style: 'trainer',
    color: 'Cocoa',
    studio: assetPath('images/generated/studio/trainer-cocoa.webp'),
    onFoot: assetPath('images/generated/on-foot/trainer-cocoa.webp'),
    price: 139000,
    styling: '크림 삭스와 낮게 앉은 조정 동작',
  },
  {
    style: 'trainer',
    color: 'Butter',
    studio: assetPath('images/generated/studio/trainer-butter.webp'),
    onFoot: assetPath('images/generated/on-foot/trainer-butter.webp'),
    price: 139000,
    styling: '레이어드 화이트 삭스와 소프트 시팅',
  },
];

export const STYLE_ANALYSIS = {
  'mary-jane': {
    label: 'Low Profile Mary Jane',
    shortLabel: 'Mary Jane',
    price: 129000,
    role: 'Trend entry',
    consumer: '25-39세, 발레코어를 일상복에 가볍게 적용하고 싶은 패션 관여 여성',
    purchaseJob: '플랫보다 스포티하고 일반 스니커즈보다 페미닌한 한 켤레',
    occasions: ['출근과 통학', '카페와 쇼핑', '주말 여행', '양말 중심 스타일링'],
    directSet: ['PUMA Speedcat Ballet Satin', 'NEW BALANCE Flat Breeze', 'ADIDAS Taekwondo Mei', 'NIKE Air Rift', 'MATIN KIM Sporty Mary Jane'],
    ladder: [
      { brand: 'PUMA', product: 'Speedcat Ballet Satin', price: 119000, read: '실버 새틴 · 트렌드 입구' },
      { brand: 'SERGIO TACCHINI', product: 'Low Profile Mary Jane', price: 129000, read: '예상 소비자가 · 페미닌 웰니스' },
      { brand: 'NEW BALANCE', product: 'Flat Breeze', price: 139000, read: '실버 소재 · 스포티 플랫' },
      { brand: 'ADIDAS', product: 'Taekwondo Mei', price: 139000, read: '가장 직접적인 가격 기준' },
      { brand: 'NIKE', product: 'Air Rift', price: 149000, read: '기능 아이콘 프리미엄' },
      { brand: 'MATIN KIM', product: 'Sporty Mary Jane', price: 168000, read: '국내 패션 프리미엄' },
      { brand: 'REIKE NEN', product: 'Shirring Mary Jane', price: 364000, read: '디자이너 페미닌 상단' },
    ],
    conclusion: 'New Balance Flat Breeze·Adidas Taekwondo Mei보다 ₩10,000 낮은 예상 소비자가로 테니스 헤리티지와 페미닌 웰니스를 제시한다.',
  },
  trainer: {
    label: 'Low Profile Trainer',
    shortLabel: 'Trainer',
    price: 139000,
    role: 'Core volume',
    consumer: '25-44세, 레트로 러너보다 슬림하고 세련된 일상 워킹화를 찾는 웰니스 지향 여성',
    purchaseJob: '출근부터 가벼운 워킹까지 이어지는 낮고 편안한 데일리 스니커즈',
    occasions: ['도심 출근', '가벼운 워킹', '여행 이동', '스튜디오 투 스트리트'],
    directSet: ['NIKE Moon Shoe OG W', 'ADIDAS Samba OG', 'PUMA Speedcat OG', 'ONITSUKA TIGER Mexico 66', 'ALO Sunset'],
    ladder: [
      { brand: 'SERGIO TACCHINI', product: 'Low Profile Trainer', price: 139000, read: '예상 소비자가 · 코트 웰니스' },
      { brand: 'NIKE', product: 'Moon Shoe OG W', price: 139000, read: '초기 러닝 헤리티지 · 동일가' },
      { brand: 'ADIDAS', product: 'Samba OG', price: 149000, read: '₩10,000 상단 · 테라스 헤리티지' },
      { brand: 'PUMA', product: 'Speedcat OG', price: 149000, read: '₩10,000 상단 · 모터스포츠 슬림' },
      { brand: 'ONITSUKA TIGER', product: 'Mexico 66', price: 196000, read: '슬림 헤리티지 프리미엄' },
      { brand: 'ALO', product: 'Sunset', price: 318000, read: '스튜디오 투 스트리트 상단' },
    ],
    conclusion: 'Nike Moon Shoe와 같은 ₩139,000에서 코트 웰니스로 차별화하고, Samba·Speedcat보다 ₩10,000, Onitsuka보다 ₩57,000 낮다.',
  },
};

export const MARKET_INSIGHTS = {
  'ALO Sunset': { fit: 'Trainer', consumerValue: '낮은 실루엣과 스튜디오 투 스트리트', implication: '웰니스 장면을 제품보다 먼저 제시' },
  'PUMA Speedcat Ballet Satin': { fit: 'Mary Jane', consumerValue: '실버 새틴과 밴드 디테일의 발레코어', implication: '₩10,000 높은 가격에 코트 헤리티지를 추가' },
  'NEW BALANCE Flat Breeze': { fit: 'Mary Jane', consumerValue: '실버 소재와 리본 디테일의 스포티 플랫', implication: '₩10,000 낮은 가격과 코트 헤리티지로 차별' },
  'ADIDAS Taekwondo Mei': { fit: 'Mary Jane', consumerValue: '무술화 헤리티지와 슬림 실루엣', implication: '₩10,000 낮은 가격과 코트 웰니스로 차별' },
  'ADIDAS Samba OG': { fit: 'Trainer', consumerValue: '대중성이 검증된 테라스 헤리티지', implication: '₩10,000 낮은 가격과 웰니스 착장으로 차별' },
  'PUMA Speedcat OG': { fit: 'Trainer', consumerValue: '모터스포츠 기반의 대표 슬림 스니커즈', implication: '₩10,000 낮은 가격과 편안한 일상성 강조' },
  'NIKE Moon Shoe OG W': { fit: 'Trainer', consumerValue: '초기 러닝화 아카이브와 슬림 와플솔', implication: '동일 가격에서 여성 웰니스 착장과 코트 서사로 차별' },
  'NIKE Air Rift': { fit: 'Mary Jane', consumerValue: '기능적 아이콘과 독특한 발 모양', implication: '보편적 착화와 양말 스타일로 대응' },
  'ONITSUKA TIGER Mexico 66': { fit: 'Trainer', consumerValue: '검증된 슬림 헤리티지 아이콘', implication: '₩47,000 낮은 접근성 강조' },
  'MATIN KIM Sporty Mary Jane': { fit: 'Mary Jane', consumerValue: '국내 패션 브랜드의 트렌드 신뢰', implication: '₩39,000 낮고 스포츠 정통성 우위' },
  'REIKE NEN Shirring Mary Jane': { fit: 'Mary Jane', consumerValue: '디자이너 페미닌 디테일', implication: '대체재가 아닌 상단 가격 기준' },
  'MIU MIU Tyre Ballerina': { fit: 'Mary Jane', consumerValue: '테크니컬 소재와 넓은 벨크로 스트랩의 스포티 발레리나', implication: '코트 헤리티지를 여성형 스트랩 구조로 번역하는 소재 기준' },
  'BOTTEGA VENETA Orbit Flash Mary Jane': { fit: 'Mary Jane', consumerValue: '메시·메탈릭 오버레이와 낮은 러버솔의 조합', implication: '기능 소재를 하이엔드 페미닌 실루엣으로 정제하는 기준' },
  'LOEWE Pebble Soft Ballerina': { fit: 'Mary Jane', consumerValue: '라미네이티드 램스킨과 유연한 페탈 토 실루엣', implication: '부드러운 착화 구조와 메탈릭 컬러의 라이프스타일 기준' },
  'MIU MIU Plume': { fit: 'Trainer', consumerValue: '초경량 디컨스트럭티드 실루엣', implication: '얇은 구조와 소재 대비를 참고' },
  'PRADA Collapse': { fit: 'Trainer', consumerValue: '낮은 구조와 럭셔리 소재', implication: '시장 컨텍스트로만 활용' },
  'BOTTEGA VENETA Orbit Flash': { fit: 'Trainer', consumerValue: '스웨이드 로우탑과 유기적 패널', implication: '토널 소재와 유연한 패널링 참고' },
  'CELINE Racer': { fit: 'Trainer', consumerValue: '1970년대 레이서와 10mm 힐', implication: '테니스 헤리티지의 슬림 비율 강화' },
};

/**
 * @typedef {Object} CompetitorItem
 * @property {string} segment
 * @property {string} brand
 * @property {string} product
 * @property {number} price
 * @property {number=} priceMax
 * @property {string} currency
 * @property {string} officialUrl
 * @property {string=} image
 * @property {string} checkedAt
 * @property {string} role
 */

/** @type {CompetitorItem[]} */
export const COMPETITORS = [
  {
    segment: 'wellness', brand: 'ALO', product: 'Sunset', price: 318000, currency: 'KRW',
    officialUrl: 'https://www.aloyoga.com/ko-kr/products/a0891u-alo-sunset-sneaker-sandstone-ivory',
    image: assetPath('images/competitors/alo-sunset.webp'), checkedAt: '2026.08.10',
    role: '로우 프로파일과 스튜디오 투 스트리트',
  },
  {
    segment: 'feminine', brand: 'PUMA', product: 'Speedcat Ballet Satin', price: 119000, currency: 'KRW',
    officialUrl: 'https://www.musinsa.com/products/5168188',
    image: assetPath('images/competitors/puma-speedcat-ballet-satin.webp'), checkedAt: '2026.08.10',
    role: '모터스포츠 실루엣을 실버 새틴 발레 플랫으로 전환',
  },
  {
    segment: 'feminine', brand: 'NEW BALANCE', product: 'Flat Breeze', price: 139000, currency: 'KRW',
    officialUrl: 'https://www.musinsa.com/products/6347008',
    image: assetPath('images/competitors/new-balance-flat-breeze.webp'), checkedAt: '2026.08.10',
    role: '실버 소재와 리본 디테일을 결합한 스포티 메리제인',
  },
  {
    segment: 'feminine', brand: 'ADIDAS', product: 'Taekwondo Mei', price: 139000, currency: 'KRW',
    officialUrl: 'https://www.adidas.co.kr/%ED%83%9C%EA%B6%8C%EB%8F%84-%EB%A9%94%EC%9D%B4/JQ0669.html',
    image: assetPath('images/competitors/adidas-taekwondo-mei.webp'), checkedAt: '2026.08.10',
    role: '낮고 슬림한 무술화 기반 스타일',
  },
  {
    segment: 'heritage', brand: 'ADIDAS', product: 'Samba OG', price: 149000, currency: 'KRW',
    officialUrl: 'https://www.adidas.co.kr/%EC%82%BC%EB%B0%94-og/IH6844.html',
    image: assetPath('images/competitors/adidas-samba-og.webp'), checkedAt: '2026.08.10',
    role: '풋볼 트레이닝화에서 확장된 테라스 아이콘',
  },
  {
    segment: 'heritage', brand: 'PUMA', product: 'Speedcat OG', price: 149000, currency: 'KRW',
    officialUrl: 'https://kr.puma.com/kr/ko/pd/%EC%8A%A4%ED%94%BC%EB%93%9C%EC%BA%A3-og-%3Cbr%3Espeedcat-og/398846.html?dwvar_398846_color=01',
    image: assetPath('images/competitors/puma-speedcat-og.webp'), checkedAt: '2026.08.10',
    role: '모터스포츠 기반의 대표 로우 프로파일 스니커즈',
  },
  {
    segment: 'feminine', brand: 'NIKE', product: 'Air Rift', price: 149000, currency: 'KRW',
    officialUrl: 'https://www.nike.com/kr/t/%EC%97%90%EC%96%B4-%EB%A6%AC%ED%94%84%ED%8A%B8-%EC%97%AC%EC%84%B1-%EC%8B%A0%EB%B0%9C-Vby1SJwl',
    image: assetPath('images/competitors/nike-air-rift.webp'), checkedAt: '2026.08.10',
    role: '스포츠 기능과 여성 라이프스타일의 결합',
  },
  {
    segment: 'heritage', brand: 'NIKE', product: 'Moon Shoe OG W', price: 139000, currency: 'KRW',
    officialUrl: 'https://www.musinsa.com/products/6718924',
    image: assetPath('images/competitors/nike-moon-shoe-og-w.webp'), checkedAt: '2026.08.10',
    role: '초기 러닝 아카이브를 복원한 슬림 와플솔 트레이너',
  },
  {
    segment: 'heritage', brand: 'ONITSUKA TIGER', product: 'Mexico 66', price: 196000, currency: 'KRW',
    officialUrl: 'https://www.onitsukatiger.com/kr/ko-kr/product/mexico-66/1183b511.200',
    image: assetPath('images/competitors/onitsuka-mexico-66.webp'), checkedAt: '2026.08.10',
    role: '대표적인 슬림 헤리티지 스니커즈',
  },
  {
    segment: 'korean', brand: 'MATIN KIM', product: 'Sporty Mary Jane', price: 168000, currency: 'KRW',
    officialUrl: 'https://matinkim.com/product/detail.html?cate_no=64&display_group=1&product_no=8944',
    image: assetPath('images/competitors/matin-kim-mary-jane.webp'), checkedAt: '2026.08.10',
    role: '국내 패션 브랜드의 스포츠 메리제인',
  },
  {
    segment: 'korean', brand: 'REIKE NEN', product: 'Shirring Mary Jane', price: 364000, currency: 'KRW',
    officialUrl: 'https://reikenen.com/product/shirring-maryjane-pink/175/display/1/',
    image: assetPath('images/competitors/reike-nen-mary-jane.webp'), checkedAt: '2026.08.10',
    role: '디자이너 페미닌 스타일',
  },
  {
    segment: 'luxury', brand: 'MIU MIU', product: 'Plume', price: 1380000, currency: 'KRW',
    officialUrl: 'https://www.miumiu.com/kr/ko/p/plume-technical-fabric-and-suede-sneakers/5E114E_D7C_F0038_F_D005',
    image: assetPath('images/competitors/miu-miu-plume.webp'), checkedAt: '2026.08.10',
    role: '초경량 디컨스트럭티드 로우 프로파일',
  },
  {
    segment: 'luxury', brand: 'PRADA', product: 'Collapse', price: 1490000, currency: 'KRW',
    officialUrl: 'https://www.prada.com/kr/en/womens/shoes/collapse/c/10694KR',
    image: assetPath('images/competitors/prada-collapse.webp'), checkedAt: '2026.08.10',
    role: '구조적으로 낮은 패션 스니커즈',
  },
  {
    segment: 'luxury', brand: 'BOTTEGA VENETA', product: 'Orbit Flash', price: 1470000, currency: 'KRW',
    officialUrl: 'https://www.bottegaveneta.com/ko-kr/%EC%98%A4%EB%A5%B4%EB%B9%97-%ED%94%8C%EB%9E%98%EC%8B%9C-%EC%8A%A4%EB%8B%88%EC%BB%A4%EC%A6%88-%ED%8F%B0%EB%8B%A8%ED%8A%B8-851623V3MS02113.html',
    image: assetPath('images/competitors/bottega-orbit-flash.jpg'), checkedAt: '2026.08.10',
    role: '스웨이드 로우탑과 유기적 오버레이',
  },
  {
    segment: 'luxury', brand: 'CELINE', product: 'Racer', price: 1250000, currency: 'KRW',
    officialUrl: 'https://www.celine.com/ko-kr/%EC%97%AC%EC%84%B1/%EC%8A%88%EC%A6%88/%EC%8A%A4%EB%8B%88%EC%BB%A4%EC%A6%88/',
    image: assetPath('images/competitors/celine-racer.jpg'), checkedAt: '2026.08.10',
    role: '1970년대 레이서 비율과 10mm 힐',
  },
  {
    segment: 'luxury', brand: 'MIU MIU', product: 'Tyre Ballerina', price: 1440000, currency: 'KRW',
    officialUrl: 'https://www.miumiu.com/kr/ko/p/%ED%83%80%EC%9D%B4%EC%96%B4-%ED%85%8C%ED%81%AC%EB%8B%88%EC%BB%AC-%EC%86%8C%EC%9E%AC-%EB%B0%8F-%EC%8A%A4%EC%9B%A8%EC%9D%B4%EB%93%9C-%EB%B0%9C%EB%A0%88%EB%A6%AC%EB%82%98/5F416E_D7C_F0424_F_005',
    image: assetPath('images/competitors/miu-miu-tyre-ballerina.webp'), checkedAt: '2026.08.10',
    role: '테크니컬 소재와 스웨이드, 넓은 벨크로 스트랩을 결합한 스포티 발레리나',
  },
  {
    segment: 'luxury', brand: 'BOTTEGA VENETA', product: 'Orbit Flash Mary Jane', price: 1510000, currency: 'KRW',
    officialUrl: 'https://www.bottegaveneta.com/ko-kr/%EC%98%A4%EB%A5%B4%EB%B9%97-%ED%94%8C%EB%9E%98%EC%8B%9C-%EB%A9%94%EB%A6%AC-%EC%A0%9C%EC%9D%B8-%EC%8A%A4%EB%8B%88%EC%BB%A4%EC%A6%88-%EC%8B%A4%EB%B2%84-%ED%99%94%EC%9D%B4%ED%8A%B8-%EC%98%B5%ED%8B%B1-%ED%99%94%EC%9D%B4%ED%8A%B8-814087676.html',
    image: assetPath('images/competitors/bottega-orbit-flash-mary-jane.webp'), checkedAt: '2026.08.10',
    role: '가벼운 메시와 메탈릭 오버레이를 낮은 메리제인 스니커즈로 정제',
  },
  {
    segment: 'luxury', brand: 'LOEWE', product: 'Pebble Soft Ballerina', price: 1150, currency: 'USD',
    officialUrl: 'https://www.loewe.com/int/en/women/shoes/flats/pebble-soft-ballerina-in-laminated-nappa-lambskin/LLPF466X01-1160.html',
    image: assetPath('images/competitors/loewe-pebble-soft-ballerina.webp'), checkedAt: '2026.08.10',
    role: '라미네이티드 나파 램스킨과 유연한 페탈 토를 결합한 소프트 발레리나',
  },
];

/**
 * @typedef {Object} PositionPoint
 * @property {string} brand
 * @property {number} x
 * @property {number} y
 * @property {number} price
 * @property {string} category
 */

/** @type {PositionPoint[]} */
export const POSITION_POINTS = [
  { brand: 'Alo Sunset', x: 88, y: 88, price: 318000, category: 'wellness' },
  { brand: 'Sergio Target', x: 68, y: 75, price: 139000, category: 'target' },
  { brand: 'Adidas', x: 36, y: 43, price: 139000, category: 'sport' },
  { brand: 'Onitsuka', x: 42, y: 34, price: 196000, category: 'sport' },
  { brand: 'Korean Fashion', x: 75, y: 42, price: 258000, category: 'fashion' },
  { brand: 'Luxury Context', x: 90, y: 24, price: 1425000, category: 'luxury' },
];

export const formatPrice = (price) => `₩${new Intl.NumberFormat('ko-KR').format(price)}`;
