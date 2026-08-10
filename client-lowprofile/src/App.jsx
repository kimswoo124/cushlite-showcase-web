import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, SealCheck } from '@phosphor-icons/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  COMPETITORS,
  PRODUCT_COLORWAYS,
  STYLE_ANALYSIS,
  formatPrice,
} from './data';

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  ['price', 'Position'],
  ['market', 'Market'],
  ['trainer', 'Trainer'],
  ['mary-jane', 'Mary Jane'],
  ['decision', 'Decision'],
];

function SafeImage({ src, alt, className = '', loading = 'lazy' }) {
  const [status, setStatus] = useState('loading');

  return (
    <span className={`image-frame ${className} is-${status}`}>
      {status === 'loading' && <span className="image-skeleton" aria-hidden="true" />}
      {status === 'error' ? (
        <span className="image-fallback" role="img" aria-label={alt}>
          <b>IMAGE RECHECK</b><small>{alt}</small>
        </span>
      ) : (
        <img src={src} alt={alt} loading={loading} onLoad={() => setStatus('loaded')} onError={() => setStatus('error')} />
      )}
    </span>
  );
}

function BrandMark() {
  return (
    <span className="brand-lockup" aria-label="Sergio Tacchini">
      <img src={`${import.meta.env.BASE_URL}sergio-tacchini-mark.svg`} alt="" aria-hidden="true" />
      <span>SERGIO TACCHINI</span>
    </span>
  );
}

function Header() {
  const [active, setActive] = useState('price');

  useEffect(() => {
    const sections = NAV_ITEMS.map(([id]) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-20% 0px -65%', threshold: [0, 0.15, 0.4] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <a href="#top" className="header-brand"><BrandMark /></a>
      <nav aria-label="쇼케이스 주요 섹션">
        {NAV_ITEMS.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{label}</a>
        ))}
      </nav>
      <span className="header-note">INTERNAL · 2026.08.10</span>
    </header>
  );
}

function Hero() {
  const trainer = PRODUCT_COLORWAYS.find((item) => item.style === 'trainer' && item.color === 'Sand');
  const maryJane = PRODUCT_COLORWAYS.find((item) => item.style === 'mary-jane' && item.color === 'Ivory');

  return (
    <section className="hero" id="top">
      <div className="hero-background" aria-hidden="true">
        <SafeImage src={trainer.onFoot} alt="Sand Trainer 여성 착화" loading="eager" />
        <SafeImage src={maryJane.onFoot} alt="Ivory Mary Jane 여성 착화" loading="eager" />
      </div>
      <div className="hero-wash" aria-hidden="true" />
      <svg className="hero-filter-defs" aria-hidden="true">
        <defs>
          <filter id="heroTextRefraction" x="-4%" y="-20%" width="108%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.003 0.025" numOctaves="2" seed="11" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <h1 className="hero-refraction-title" aria-label="Sergio Tacchini Lifestyle">
        <span className="hero-refraction-line hero-refraction-brand" data-text="SERGIO TACCHINI">SERGIO TACCHINI</span>
        <span className="hero-refraction-line hero-refraction-lifestyle" data-text="LIFESTYLE">LIFESTYLE</span>
      </h1>
      <div className="hero-copy">
        <p className="hero-eyebrow">WOMEN'S LOW PROFILE · 2026 PROPOSAL</p>
        <div className="hero-caption">
          <strong>WELLNESS IN MOTION.</strong>
          <p>테니스 헤리티지를 걷기, 휴식, 스타일링이 이어지는 여성 웰니스 루틴으로 확장합니다.</p>
        </div>
      </div>
      <div className="hero-style-notes">
        <a href="#trainer"><span>01 · Core volume</span><b>Trainer</b><strong><small>예상 소비자가</small>{formatPrice(139000)}</strong></a>
        <a href="#mary-jane"><span>02 · Trend entry</span><b>Mary Jane</b><strong><small>예상 소비자가</small>{formatPrice(129000)}</strong></a>
      </div>
      <a className="hero-scroll" href="#price">SCROLL TO EXPLORE <ArrowRight /></a>
    </section>
  );
}

function PriceLadder({ style }) {
  const analysis = STYLE_ANALYSIS[style];
  const heroItem = PRODUCT_COLORWAYS.find((item) => item.style === style);
  const minPrice = 80000;
  const maxPrice = 400000;
  const toPosition = (price) => Math.min(100, Math.max(0, ((price - minPrice) / (maxPrice - minPrice)) * 100));

  return (
    <article className={`price-lane price-lane-${style} reveal`}>
      <div className="price-lane-visual">
        <SafeImage src={heroItem.onFoot} alt={`${analysis.shortLabel} 대표 여성 착화 스타일`} />
        <span>{analysis.role}</span>
      </div>
      <div className="price-lane-body">
        <header className="lane-head">
          <div><span>{analysis.role}</span><h3>{analysis.shortLabel}</h3></div>
          <strong><small>예상 소비자가</small>{formatPrice(analysis.price)}</strong>
        </header>
        <div className="consumer-brief">
          <div><span>Core consumer</span><p>{analysis.consumer}</p></div>
          <div><span>Purchase job</span><p>{analysis.purchaseJob}</p></div>
        </div>
        <div className="occasion-list">{analysis.occasions.map((occasion) => <span key={occasion}>{occasion}</span>)}</div>
        <div className="ladder-axis"><span>₩80K</span><span>₩160K</span><span>₩240K</span><span>₩320K</span><span>₩400K</span></div>
        <div className="ladder-rows">
          {analysis.ladder.map((item) => {
            const isSergio = item.brand === 'SERGIO TACCHINI';
            const competitor = COMPETITORS.find((entry) => entry.brand === item.brand && entry.product === item.product);
            const thumbnail = isSergio ? heroItem.studio : competitor?.image;
            return (
              <div className={`ladder-row ${isSergio ? 'is-sergio' : ''}`} key={`${item.brand}-${item.product}`}>
                <div className="ladder-label">
                  {thumbnail && <SafeImage className="ladder-thumb" src={thumbnail} alt={`${item.brand} ${item.product} 상품 이미지`} />}
                  <div><b>{item.brand}</b><span>{item.product}</span></div>
                </div>
                <div className="ladder-track"><i style={{ '--price-x': `${toPosition(item.price)}%` }} /><span style={{ '--price-x': `${toPosition(item.price)}%` }}>{formatPrice(item.price)}</span></div>
                <small>{item.read}</small>
              </div>
            );
          })}
        </div>
        <p className="lane-conclusion"><SealCheck /> {analysis.conclusion}</p>
      </div>
    </article>
  );
}

function PricePositioning() {
  return (
    <section className="section price-positioning" id="price">
      <div className="section-head reveal">
        <div><span>01 · Style price positioning</span><h2>로우 스니커즈와<br />메리제인.</h2></div>
        <p>두 제품은 같은 경쟁군이 아닙니다. Trainer는 헤리티지와 웰니스 스니커즈, Mary Jane은 발레코어와 패션 플랫 안에서 예상 소비자가의 의미를 판단합니다.</p>
      </div>
      <div className="price-lanes">
        <PriceLadder style="trainer" />
        <PriceLadder style="mary-jane" />
      </div>
      <div className="premium-context reveal">
        <div><span>Premium wellness</span><strong>Alo Sunset ₩318K</strong><p>웰니스 장면은 가져오되 가격 장벽은 낮춥니다.</p></div>
        <div><span>Direct sport</span><strong>₩119-196K</strong><p>정상가 안에서 디자인과 테니스 정통성으로 차이를 만듭니다.</p></div>
        <div className="capture-zone"><span>Sergio expected retail</span><strong>₩129-139K</strong><p>접근 가능한 프리미엄 웰니스 구간을 선점합니다.</p></div>
      </div>
    </section>
  );
}

const competitorByName = (brand, product) => COMPETITORS.find((item) => item.brand === brand && item.product === product);
const formatMarketPrice = (item) => item.currency === 'USD'
  ? `US$${new Intl.NumberFormat('en-US').format(item.price)}`
  : formatPrice(item.price);

function SpectrumCard({ item, className = '' }) {
  const Card = item.officialUrl ? 'a' : 'article';
  const cardProps = item.officialUrl
    ? { href: item.officialUrl, target: '_blank', rel: 'noreferrer', 'aria-label': `${item.brand} ${item.product} 공식 페이지` }
    : {};

  return (
    <Card className={`spectrum-card ${item.estimated ? 'is-sergio' : ''} ${className}`} {...cardProps}>
      <SafeImage src={item.image} alt={`${item.brand} ${item.product} 상품 이미지`} />
      <div className="spectrum-card-copy">
        <span>{item.tier}</span>
        <h3>{item.product}</h3>
        <p>{item.brand}</p>
        <strong>{item.estimated && <small>예상 소비자가</small>}{formatMarketPrice(item)}</strong>
      </div>
      {item.officialUrl && <ArrowUpRight aria-hidden="true" />}
    </Card>
  );
}

function MarketSpectrum() {
  const trainer = PRODUCT_COLORWAYS.find((item) => item.style === 'trainer' && item.color === 'Sand');
  const maryJane = PRODUCT_COLORWAYS.find((item) => item.style === 'mary-jane' && item.color === 'Ivory');
  const sportWellness = [
    { brand: 'SERGIO TACCHINI', product: 'Low Profile Trainer', price: 139000, image: trainer.studio, tier: 'Target · Court wellness', estimated: true },
    { ...competitorByName('NIKE', 'Moon Shoe OG W'), tier: 'Running heritage' },
    { ...competitorByName('ADIDAS', 'Samba OG'), tier: 'General sport' },
    { ...competitorByName('PUMA', 'Speedcat OG'), tier: 'General sport' },
    { ...competitorByName('ONITSUKA TIGER', 'Mexico 66'), tier: 'Heritage sport' },
    { ...competitorByName('ALO', 'Sunset'), tier: 'Wellness premium' },
  ];
  const luxury = [
    { ...competitorByName('CELINE', 'Racer'), tier: 'Luxury context' },
    { ...competitorByName('MIU MIU', 'Plume'), tier: 'Luxury context' },
    { ...competitorByName('BOTTEGA VENETA', 'Orbit Flash'), tier: 'Luxury context' },
    { ...competitorByName('PRADA', 'Collapse'), tier: 'Luxury context' },
  ];
  const maryJaneSet = [
    { ...competitorByName('PUMA', 'Speedcat Ballet Satin'), tier: 'Feminine sport' },
    { brand: 'SERGIO TACCHINI', product: 'Low Profile Mary Jane', price: 129000, image: maryJane.studio, tier: 'Target · Feminine wellness', estimated: true },
    { ...competitorByName('NEW BALANCE', 'Flat Breeze'), tier: 'Feminine sport' },
    { ...competitorByName('ADIDAS', 'Taekwondo Mei'), tier: 'Feminine sport' },
    { ...competitorByName('NIKE', 'Air Rift'), tier: 'Feminine sport' },
    { ...competitorByName('MATIN KIM', 'Sporty Mary Jane'), tier: 'Korean fashion' },
    { ...competitorByName('REIKE NEN', 'Shirring Mary Jane'), tier: 'Designer fashion' },
  ];
  const maryJaneLuxury = [
    { ...competitorByName('MIU MIU', 'Tyre Ballerina'), tier: 'High-end Mary Jane' },
    { ...competitorByName('BOTTEGA VENETA', 'Orbit Flash Mary Jane'), tier: 'High-end Mary Jane' },
    { ...competitorByName('LOEWE', 'Pebble Soft Ballerina'), tier: 'High-end Mary Jane' },
  ];

  return (
    <section className="section market-spectrum" id="market">
      <div className="spectrum-part spectrum-part-lowprofile">
        <div className="spectrum-part-head reveal">
          <div><span>02 · Low profile market spectrum</span><h2>로우 프로파일,<br />스포츠에서 하이엔드까지.</h2></div>
          <p>일반 스포츠의 슬림 헤리티지에서 웰니스 프리미엄, 하이엔드 실루엣까지 하나의 순서로 비교합니다. Sergio Trainer는 Nike Moon Shoe와 공동 최저 가격에 위치합니다.</p>
        </div>
        <div className="spectrum-band reveal">
          <header><div><span>01</span><h3>Sport & wellness</h3></div><strong>₩139K—318K</strong></header>
          <div className="spectrum-grid spectrum-grid-sport">
            {sportWellness.map((item) => <SpectrumCard item={item} key={`${item.brand}-${item.product}`} />)}
          </div>
        </div>
        <div className="spectrum-band reveal">
          <header><div><span>02</span><h3>Luxury context</h3></div><strong>₩1.25M—1.49M</strong></header>
          <div className="spectrum-grid spectrum-grid-luxury">
            {luxury.map((item) => <SpectrumCard item={item} className="is-luxury" key={`${item.brand}-${item.product}`} />)}
          </div>
        </div>
      </div>

      <div className="spectrum-part spectrum-part-mary-jane">
        <div className="spectrum-part-head reveal">
          <div><span>03 · Mary Jane</span><h2>메리제인.</h2></div>
          <p>페미닌 스포츠와 국내 패션 브랜드는 직접 가격 비교군으로, 하이엔드 브랜드는 메리제인 실루엣의 시장 확장성을 보여주는 별도 컨텍스트로 구분합니다.</p>
        </div>
        <div className="spectrum-band reveal">
          <header><div><span>01</span><h3>메리제인</h3></div><strong>₩119K—364K</strong></header>
          <div className="spectrum-grid spectrum-grid-mary-jane">
            {maryJaneSet.map((item) => <SpectrumCard item={item} key={`${item.brand}-${item.product}`} />)}
          </div>
        </div>
        <div className="spectrum-band reveal">
          <header><div><span>02</span><h3>High-end Mary Jane</h3></div><strong>₩1.44M—1.51M · US$1,150</strong></header>
          <div className="spectrum-grid spectrum-grid-mary-luxury">
            {maryJaneLuxury.map((item) => <SpectrumCard item={item} className="is-luxury" key={`${item.brand}-${item.product}`} />)}
          </div>
        </div>
      </div>
      <p className="source-caution">Sergio는 예상 소비자가 · 경쟁사는 정상가 기준 · 조회 2026.08.10 · 외부 공개 전 가격과 판매 상태 재확인</p>
    </section>
  );
}

function ColorStory({ style, number }) {
  const analysis = STYLE_ANALYSIS[style];
  const products = PRODUCT_COLORWAYS.filter((item) => item.style === style);
  const id = style === 'mary-jane' ? 'mary-jane' : 'trainer';

  return (
    <section className={`color-gallery color-gallery-${style}`} id={id}>
      <header className="color-gallery-head reveal">
        <div><span>{number} · {analysis.role}</span><h2>{analysis.shortLabel}</h2></div>
        <p>{analysis.purchaseJob}</p>
        <strong><small>예상 소비자가</small>{formatPrice(analysis.price)}</strong>
      </header>
      <div className="color-gallery-grid" aria-label={`${analysis.shortLabel} 4컬러 착장 목록`}>
        {products.map((item, index) => (
          <figure className="color-gallery-card" key={item.color}>
            <SafeImage className="gallery-look" src={item.onFoot} alt={`${item.color} ${analysis.shortLabel} 여성 착화 스타일링`} />
            <div className="gallery-shade" aria-hidden="true" />
            <div className="gallery-product"><SafeImage src={item.studio} alt={`${item.color} ${analysis.shortLabel} 정제 제품 이미지`} /></div>
            <figcaption><span>0{index + 1}</span><div><h3>{item.color}</h3><p>{item.styling}</p></div></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function DecisionBoard() {
  return (
    <section className="section decision" id="decision">
      <div className="section-kicker reveal"><span>06</span> Assortment decision</div>
      <div className="decision-layout">
        <div className="decision-title reveal"><span>Recommendation</span><h2>두 스타일 동시 전개.<br />역할은 명확하게.</h2><p>Trainer는 매출을 만드는 일상 착화 중심, Mary Jane은 캠페인의 스타일 신호입니다.</p></div>
        <div className="decision-table reveal">
          <div className="decision-row decision-row-head"><span>Style</span><span>Role</span><span>Hero color</span><span>예상 소비자가</span><span>Commercial reason</span></div>
          <div className="decision-row"><b>Trainer</b><span>Core volume</span><span>Sand</span><strong>{formatPrice(139000)}</strong><p>Nike Moon Shoe와 동일가, Samba·Speedcat보다 ₩10,000 낮음</p></div>
          <div className="decision-row"><b>Mary Jane</b><span>Trend entry</span><span>Ivory</span><strong>{formatPrice(129000)}</strong><p>New Balance·Adidas보다 ₩10,000 낮은 페미닌 웰니스 입구</p></div>
        </div>
      </div>
      <div className="final-verdict reveal">
        <div><SealCheck /><span>예상 소비자가 구성</span><strong>₩139K + ₩129K</strong></div>
        <div><Check /><span>Volume lead</span><strong>Trainer Sand</strong></div>
        <div><Check /><span>Campaign lead</span><strong>Mary Jane Ivory</strong></div>
        <p>GO</p>
      </div>
    </section>
  );
}

function Footer() {
  return <footer><BrandMark /><p>LOW PROFILE · WELLNESS IN MOTION</p><small>Sergio prices are expected retail. Competitor prices checked 2026.08.10. Reconfirm before external use.</small></footer>;
}

export default function App() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const context = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.fromTo(element, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 90%', once: true } });
      });

      gsap.to('.hero-background .image-frame:first-child img', { scale: 1.14, yPercent: 3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to('.hero-background .image-frame:last-child img', { scale: 1.1, yPercent: -2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to('.hero-refraction-title > span', { xPercent: -1.8, scale: 1.012, opacity: 0.48, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: 1 } });

      gsap.utils.toArray('.price-lane-visual').forEach((visual) => {
        gsap.fromTo(visual.querySelector('img'), { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
      });

      gsap.utils.toArray('.spectrum-card').forEach((card, index) => {
        gsap.fromTo(card, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, delay: (index % 4) * 0.04, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 94%', once: true } });
      });

      gsap.utils.toArray('.color-gallery-card').forEach((card, index) => {
        gsap.fromTo(card, { opacity: 0, y: 26 }, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          delay: (index % 4) * 0.07,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 93%', once: true },
        });
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh, { once: true });
    return () => { window.removeEventListener('load', refresh); context.revert(); };
  }, []);

  return (
    <div className="app-shell" ref={root}>
      <Header />
      <main>
        <Hero />
        <PricePositioning />
        <MarketSpectrum />
        <ColorStory style="trainer" number="04" />
        <ColorStory style="mary-jane" number="05" />
        <DecisionBoard />
      </main>
      <Footer />
    </div>
  );
}
