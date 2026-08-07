import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowSquareOut, ArrowUp, ArrowUpRight, Check } from '@phosphor-icons/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetPath, comparisonCriteria, priceBenchmarks, scenes } from './data';

gsap.registerPlugin(ScrollTrigger);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function createCopyTimeline(copyItems, variant = 'default') {
  const items = Array.from(copyItems);
  const timeline = gsap.timeline({ paused: true });
  const item = (index) => items[index];
  const has = (index) => Boolean(item(index));

  gsap.set(items, {
    opacity: 0,
    transformPerspective: 1100,
    transformOrigin: '50% 50%',
  });

  if (variant === 'hero') {
    if (has(0)) timeline.fromTo(item(0),
      { opacity: 0, x: -58, clipPath: 'inset(0 100% 0 0)' },
      { opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.72, ease: 'power3.out' }, 0);
    if (has(1)) timeline.fromTo(item(1),
      { opacity: 0, y: 78, scale: 0.88, rotateX: 13, clipPath: 'inset(100% 0 0 0)' },
      { opacity: 1, y: 0, scale: 1, rotateX: 0, clipPath: 'inset(0% 0 0 0)', duration: 1.08, ease: 'expo.out' }, 0.12);
    if (has(2)) timeline.fromTo(item(2),
      { opacity: 0, x: 96, clipPath: 'inset(0 0 0 100%)' },
      { opacity: 1, x: 0, clipPath: 'inset(0 0 0 0%)', duration: 0.76, ease: 'power4.out' }, 0.48);
    if (has(3)) timeline.fromTo(item(3),
      { opacity: 0, y: 64, scale: 0.92, rotateZ: 1.2, clipPath: 'inset(100% 0 0 0)' },
      { opacity: 1, y: 0, scale: 1, rotateZ: 0, clipPath: 'inset(0% 0 0 0)', duration: 0.78, ease: 'back.out(1.25)' }, 0.62);
    return timeline;
  }

  if (variant === 'product') {
    if (has(0)) timeline.fromTo(item(0),
      { opacity: 0, x: 74 },
      { opacity: 1, x: 0, duration: 0.58, ease: 'power3.out' }, 0);
    if (has(1)) timeline.fromTo(item(1),
      { opacity: 0, x: -92, scale: 0.94, clipPath: 'inset(0 100% 0 0)' },
      { opacity: 1, x: 0, scale: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.92, ease: 'expo.out' }, 0.12);
    if (has(2)) timeline.fromTo(item(2),
      { opacity: 0, y: 28, rotateX: -10 },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.68, ease: 'power3.out' }, 0.54);
    return timeline;
  }

  if (variant === 'cascade-left') {
    timeline.fromTo(items,
      { opacity: 0, x: (index) => -86 - index * 18, y: (index) => index * 10, clipPath: 'inset(0 100% 0 0)' },
      { opacity: 1, x: 0, y: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.78, stagger: 0.105, ease: 'power4.out' });
    return timeline;
  }

  if (variant === 'fold-up') {
    timeline.fromTo(items,
      { opacity: 0, y: (index) => 64 + index * 10, rotateX: 18, scale: 0.96, transformOrigin: '50% 100%' },
      { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.86, stagger: 0.095, ease: 'expo.out' });
    return timeline;
  }

  if (variant === 'pivot') {
    timeline.fromTo(items,
      { opacity: 0, x: (index) => (index % 2 === 0 ? -74 : 58), rotateY: (index) => (index % 2 === 0 ? -14 : 10), scale: 0.96 },
      { opacity: 1, x: 0, rotateY: 0, scale: 1, duration: 0.82, stagger: 0.11, ease: 'back.out(1.18)' });
    return timeline;
  }

  if (variant === 'alternating') {
    timeline.fromTo(items,
      {
        opacity: 0,
        x: (index) => (index % 2 === 0 ? -104 : 104),
        y: (index) => (index % 2 === 0 ? 12 : -12),
        clipPath: (index) => (index % 2 === 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)'),
      },
      { opacity: 1, x: 0, y: 0, clipPath: 'inset(0 0% 0 0%)', duration: 0.84, stagger: 0.09, ease: 'power4.out' });
    return timeline;
  }

  if (variant === 'diagonal') {
    timeline.fromTo(items,
      { opacity: 0, x: (index) => 58 - index * 14, y: (index) => -54 + index * 22, rotateZ: (index) => 1.8 - index * 0.7 },
      { opacity: 1, x: 0, y: 0, rotateZ: 0, duration: 0.8, stagger: 0.105, ease: 'power4.out' });
    return timeline;
  }

  if (variant === 'closing') {
    if (has(0)) timeline.fromTo(item(0),
      { opacity: 0, y: -32, rotateX: -12 },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.62, ease: 'power3.out' }, 0);
    if (has(1)) timeline.fromTo(item(1),
      { opacity: 0, y: 88, scale: 0.9, rotateX: 16, clipPath: 'inset(100% 0 0 0)' },
      { opacity: 1, y: 0, scale: 1, rotateX: 0, clipPath: 'inset(0% 0 0 0)', duration: 1.02, ease: 'expo.out' }, 0.12);
    if (has(2)) timeline.fromTo(item(2),
      { opacity: 0, x: -68, clipPath: 'inset(0 100% 0 0)' },
      { opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.74, ease: 'power3.out' }, 0.62);
    return timeline;
  }

  timeline.fromTo(items,
    { opacity: 0, y: 42, rotateX: 8 },
    { opacity: 1, y: 0, rotateX: 0, duration: 0.82, stagger: 0.075, ease: 'power3.out' });
  return timeline;
}

const SIBLING_SHOWCASE_URL = 'https://dcsai.fnf.co.kr/server/quick-dashboard/cushlite-702-showcase';

const sectionNavigation = [
  { id: 'overview', label: '제품 소개', shortLabel: '제품', href: '#top', from: 0, to: 1 },
  { id: 'comparison', label: '가격 비교', shortLabel: '가격', href: '#comparison', from: 2, to: 2 },
  { id: 'routine', label: '데일리 루틴', shortLabel: '루틴', href: '#routine', from: 3, to: 4 },
  { id: 'technology', label: '기술 설계', shortLabel: '기술', href: '#technology', from: 5, to: 9 },
  { id: 'colors', label: '컬러', shortLabel: '컬러', href: '#colors', from: 10, to: 10 },
];

function useScrollVideo(sectionRef, options = {}) {
  const {
    autoStart = false,
    rangeStart = 0,
    rangeEnd = 1,
    copyRevealDelay = 1,
    endSlowdown = false,
    lockInitialPlayback = false,
    replayOnNavigation = true,
    motionVariant = 'default',
  } = options;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = section?.querySelector('video');
    if (!section || !video) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const copyItems = section.querySelectorAll('.scene-reveal');
    const annotationOverlay = section.querySelector('.annotation-overlay');
    const annotationGroups = section.querySelectorAll('.annotation-callout');
    let playingInitial = false;
    let playedOnce = section.dataset.played === 'true';
    let copyHasRevealed = playedOnce;
    let annotationsHaveRevealed = playedOnce;
    let copyRevealTimer = 0;
    let playbackFrame = 0;
    let metadataHandler;
    let activationProgress = 0;

    const updatePlaybackRate = () => {
      if (!playingInitial || !endSlowdown || !Number.isFinite(video.duration)) {
        playbackFrame = 0;
        return;
      }

      const startAt = rangeStart * video.duration;
      const stopAt = rangeEnd * video.duration;
      const normalizedTime = clamp((video.currentTime - startAt) / (stopAt - startAt), 0, 1);
      const slowdownProgress = clamp((normalizedTime - 0.78) / 0.22, 0, 1);
      const easedProgress = slowdownProgress * slowdownProgress * (3 - 2 * slowdownProgress);
      video.playbackRate = 1 - easedProgress * 0.58;
      playbackFrame = window.requestAnimationFrame(updatePlaybackRate);
    };

    const annotationTimeline = gsap.timeline({ paused: true });
    annotationGroups.forEach((group, index) => {
      const dot = section.querySelector(`.annotation-point.annotation-${index + 1} .annotation-dot`);
      const line = group.querySelectorAll('.annotation-line');
      const label = section.querySelector(`.annotation-label.annotation-${index + 1}`);
      const characters = label?.querySelectorAll('.annotation-character') ?? [];
      const at = index * 0.62;

      annotationTimeline
        .fromTo(dot, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.16, ease: 'power2.out' }, at)
        .fromTo(line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.34, ease: 'power1.inOut' }, at + 0.14)
        .fromTo(label, { opacity: 0, y: 7 }, { opacity: 1, y: 0, duration: 0.08 }, at + 0.44)
        .fromTo(characters, { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: 0.012 }, at + 0.5);
    });

    const copyTimeline = createCopyTimeline(copyItems, motionVariant);
    if (annotationOverlay) gsap.set(annotationOverlay, { opacity: 0 });

    const revealCopy = (instant = false) => {
      if (copyHasRevealed && !instant) return;
      copyHasRevealed = true;
      if (instant) copyTimeline.progress(1).pause();
      else copyTimeline.restart();
    };

    const revealAnnotations = (instant = false) => {
      if (annotationOverlay) {
        if (annotationsHaveRevealed && !instant) return;
        annotationsHaveRevealed = true;
        gsap.set(annotationOverlay, { opacity: 1 });
        if (instant) annotationTimeline.progress(1).pause();
        else annotationTimeline.restart();
      }
    };

    const resetPresentation = () => {
      copyHasRevealed = false;
      annotationsHaveRevealed = false;
      copyTimeline.progress(0).pause();
      if (annotationOverlay) gsap.set(annotationOverlay, { opacity: 0 });
      annotationTimeline.progress(0).pause();
    };

    const setFinalFrame = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const target = clamp(rangeEnd * video.duration, 0, video.duration - 0.04);
      video.currentTime = target;
    };

    const setStartFrame = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      video.currentTime = clamp(rangeStart * video.duration, 0, video.duration - 0.04);
    };

    const resetForNextEntry = () => {
      if (playingInitial) return;
      video.pause();
      setStartFrame();
      resetPresentation();
    };

    const finishInitial = () => {
      if (!playingInitial && playedOnce) return;
      if (copyRevealTimer) window.clearTimeout(copyRevealTimer);
      copyRevealTimer = 0;
      playingInitial = false;
      playedOnce = true;
      section.dataset.played = 'true';
      video.pause();
      if (playbackFrame) window.cancelAnimationFrame(playbackFrame);
      playbackFrame = 0;
      video.playbackRate = 1;
      setFinalFrame();
      revealCopy(false);
      revealAnnotations(false);
    };

    const handInitialPlaybackToScroll = () => {
      if (!playingInitial) return;
      if (copyRevealTimer) window.clearTimeout(copyRevealTimer);
      copyRevealTimer = 0;
      playingInitial = false;
      playedOnce = true;
      section.dataset.played = 'true';
      video.pause();
      if (playbackFrame) window.cancelAnimationFrame(playbackFrame);
      playbackFrame = 0;
      video.playbackRate = 1;
    };

    const startInitial = (forceReplay = false) => {
      if (forceReplay && playingInitial) return;
      if (playedOnce && !forceReplay) {
        revealCopy(true);
        revealAnnotations(true);
        return;
      }
      if (reduceMotion) {
        playedOnce = true;
        section.dataset.played = 'true';
        setFinalFrame();
        revealCopy(true);
        revealAnnotations(true);
        return;
      }
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        metadataHandler = () => startInitial(forceReplay);
        video.addEventListener('loadedmetadata', metadataHandler, { once: true });
        return;
      }

      if (forceReplay) resetPresentation();
      playingInitial = true;
      video.playbackRate = 1;
      video.currentTime = clamp(rangeStart * video.duration, 0, video.duration - 0.04);
      if (copyRevealTimer) window.clearTimeout(copyRevealTimer);
      video.play()
        .then(() => {
          if (endSlowdown) {
            if (playbackFrame) window.cancelAnimationFrame(playbackFrame);
            playbackFrame = window.requestAnimationFrame(updatePlaybackRate);
          }
          copyRevealTimer = window.setTimeout(() => {
            if (playingInitial) revealCopy(false);
            copyRevealTimer = 0;
          }, copyRevealDelay * 1000);
        })
        .catch(() => {
          playingInitial = false;
          playedOnce = true;
          section.dataset.played = 'true';
          setFinalFrame();
          revealCopy(true);
          revealAnnotations(true);
        });
    };

    const onTimeUpdate = () => {
      if (!playingInitial || !Number.isFinite(video.duration)) return;
      const stopAt = rangeEnd * video.duration;
      const revealAt = Math.min(
        rangeStart * video.duration + copyRevealDelay,
        Math.max(rangeStart * video.duration, stopAt - 0.12),
      );
      if (video.currentTime >= revealAt) revealCopy(false);
      if (video.currentTime >= stopAt - 0.045) finishInitial();
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', finishInitial);
    const prepareStartFrame = () => {
      if (!playingInitial && !playedOnce) setStartFrame();
    };
    video.addEventListener('loadedmetadata', prepareStartFrame);
    if (video.readyState >= 1) prepareStartFrame();
    const activateFromNavigation = () => startInitial(replayOnNavigation);
    section.addEventListener('scene:activate', activateFromNavigation);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onEnter: (self) => {
        activationProgress = self.progress;
        startInitial();
      },
      onEnterBack: (self) => {
        activationProgress = self.progress;
        startInitial();
      },
      onUpdate: (self) => {
        if (
          playingInitial
          && !lockInitialPlayback
          && Math.abs(self.progress - activationProgress) > 0.002
        ) {
          handInitialPlaybackToScroll();
        }
        if (!playedOnce || playingInitial || reduceMotion || !Number.isFinite(video.duration)) return;
        const targetProgress = rangeStart + (rangeEnd - rangeStart) * self.progress;
        const targetTime = clamp(targetProgress * video.duration, 0, video.duration - 0.04);
        if (Math.abs(video.currentTime - targetTime) > 0.02) video.currentTime = targetTime;
        if (self.progress >= 0.12) revealCopy(false);
        if (self.progress >= 0.82 && !annotationsHaveRevealed) revealAnnotations(false);
      },
    });

    const visibilityTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onLeave: resetForNextEntry,
      onLeaveBack: resetForNextEntry,
    });

    if (autoStart) startInitial();

    return () => {
      trigger.kill();
      visibilityTrigger.kill();
      copyTimeline.kill();
      annotationTimeline.kill();
      video.pause();
      video.playbackRate = 1;
      if (playbackFrame) window.cancelAnimationFrame(playbackFrame);
      if (copyRevealTimer) window.clearTimeout(copyRevealTimer);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', finishInitial);
      video.removeEventListener('loadedmetadata', prepareStartFrame);
      section.removeEventListener('scene:activate', activateFromNavigation);
      if (metadataHandler) video.removeEventListener('loadedmetadata', metadataHandler);
    };
  }, [
    autoStart,
    copyRevealDelay,
    endSlowdown,
    lockInitialPlayback,
    motionVariant,
    rangeEnd,
    rangeStart,
    replayOnNavigation,
    sectionRef,
  ]);
}

function Navigation({ activeIndex }) {
  const activeSection = sectionNavigation.find(
    (section) => activeIndex >= section.from && activeIndex <= section.to,
  )?.id ?? sectionNavigation[0].id;

  return (
    <>
      <div className="progress-track" aria-hidden="true"><span /></div>
      <header className="site-nav">
        <div className="nav-left">
          <a className="wordmark" href="#top" aria-label="CUSHLITE 302 첫 화면으로 이동">
            <span className="brand-mark" aria-hidden="true">
              <img src={assetPath('sergio-tacchini-mark.svg')} alt="" />
            </span>
            <span>SERGIO TACCHINI</span>
          </a>
          <div className="product-switcher" role="group" aria-label="제품 쇼케이스 전환">
            <span className="switcher-current" aria-current="page">
              <span className="switcher-model">CUSHLITE </span>302
            </span>
            <a className="switcher-link" href={SIBLING_SHOWCASE_URL}>
              <span className="switcher-model">CUSHLITE </span>702
              <ArrowUpRight size={11} weight="bold" aria-hidden="true" />
              <span className="visually-hidden">쇼케이스로 이동</span>
            </a>
          </div>
        </div>
        <nav className="section-menu" aria-label="페이지 섹션 메뉴">
          {sectionNavigation.map((section) => (
            <a
              className={activeSection === section.id ? 'is-active' : ''}
              href={section.href}
              aria-current={activeSection === section.id ? 'location' : undefined}
              key={section.id}
            >
              <span className="section-label-full">{section.label}</span>
              <span className="section-label-short">{section.shortLabel}</span>
            </a>
          ))}
        </nav>
        <a className="nav-price" href="#comparison">₩169,000</a>
      </header>
    </>
  );
}

function Hero() {
  const ref = useRef(null);
  useScrollVideo(ref, {
    autoStart: true,
    rangeStart: 0,
    rangeEnd: 0.97,
    endSlowdown: true,
    motionVariant: 'hero',
  });

  return (
    <section className="media-section hero" id="top" ref={ref} data-scene-anchor>
      <div className="sticky-frame">
        <video muted playsInline preload="auto" poster={assetPath('processed/images/intro-poster.webp')}>
          <source src={assetPath('processed/video/intro.mp4')} type="video/mp4" />
        </video>
        <div className="media-wash hero-wash" />
        <div className="hero-lockup">
          <p className="scene-reveal hero-brand">SERGIO TACCHINI</p>
          <h1 className="scene-reveal">CUSHLITE <span>302</span></h1>
          <p className="scene-reveal hero-line">코트에서 시작해, 매일의 움직임으로.</p>
        </div>
        <aside className="hero-price scene-reveal">
          <span>제안 소비자가</span>
          <strong>₩169,000</strong>
          <p>출시 전 편집용 임시 가격</p>
        </aside>
      </div>
    </section>
  );
}

function ProductReveal() {
  const ref = useRef(null);
  useScrollVideo(ref, { rangeStart: 0, rangeEnd: 0.98, motionVariant: 'product' });

  return (
    <section className="media-section product-reveal" id="overview" ref={ref} data-scene-anchor>
      <div className="sticky-frame">
        <video muted playsInline preload="auto" poster={assetPath('processed/images/product-reveal-poster.webp')}>
          <source src={assetPath('processed/video/product-reveal.mp4')} type="video/mp4" />
        </video>
        <div className="media-wash reveal-wash" />
        <div className="reveal-copy">
          <p className="scene-reveal">CUSHLITE 302</p>
          <h2 className="scene-reveal">하루의 움직임을<br />하나의 신발로.</h2>
          <span className="scene-reveal">Easy entry. Stable motion. Daily comfort.</span>
        </div>
      </div>
    </section>
  );
}

function PriceComparison() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      const products = gsap.utils.toArray('.comparison-product');
      const productImages = gsap.utils.toArray('.comparison-product-image');
      const productImageAssets = gsap.utils.toArray('.comparison-product-image img');
      const productText = gsap.utils.toArray([
        '.comparison-product-meta',
        '.comparison-product h3',
        '.comparison-product > strong',
        '.comparison-product > small',
        '.comparison-product > a',
      ]);
      const rows = gsap.utils.toArray('.comparison-row');

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: section,
          start: 'top 62%',
          toggleActions: 'restart none restart reverse',
        },
      });

      timeline
        .fromTo('.section-intro h2',
          { opacity: 0, y: 92, scale: 0.92, rotateX: 13, clipPath: 'inset(100% 0 0 0)' },
          { opacity: 1, y: 0, scale: 1, rotateX: 0, clipPath: 'inset(0% 0 0 0)', duration: 1.08, ease: 'expo.out' })
        .fromTo('.section-intro > p',
          { opacity: 0, x: 96, clipPath: 'inset(0 0 0 100%)' },
          { opacity: 1, x: 0, clipPath: 'inset(0 0 0 0%)', duration: 0.78, ease: 'power4.out' }, '-=0.62')
        .fromTo('.comparison-axis-head',
          { opacity: 0, x: -54, rotateY: -9 },
          { opacity: 1, x: 0, rotateY: 0, duration: 0.68, ease: 'back.out(1.15)' }, '-=0.28')
        .fromTo(products,
          {
            opacity: 0,
            y: (index) => 76 + index * 12,
            rotateY: (index) => (index % 2 === 0 ? -5 : 5),
            transformPerspective: 1100,
          },
          { opacity: 1, y: 0, rotateY: 0, duration: 0.92, stagger: 0.09 }, '-=0.44')
        .fromTo(productImages,
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', duration: 0.72, stagger: 0.08 }, '-=0.88')
        .fromTo(productImageAssets,
          { scale: 1.16 },
          { scale: 1, duration: 1.05, stagger: 0.08, ease: 'power2.out' }, '<')
        .fromTo(productText,
          { opacity: 0, y: 24, x: (index) => (index % 2 === 0 ? -18 : 18), rotateX: 7 },
          { opacity: 1, y: 0, x: 0, rotateX: 0, duration: 0.48, stagger: 0.04 }, '-=0.52')
        .fromTo(rows,
          { opacity: 0, x: (index) => (index % 2 === 0 ? -32 : 32) },
          { opacity: 1, x: 0, duration: 0.54, stagger: 0.065 }, '-=0.18')
        .fromTo('.comparison-conclusion',
          { opacity: 0, y: 46, scale: 0.97, clipPath: 'inset(100% 0 0 0)' },
          { opacity: 1, y: 0, scale: 1, clipPath: 'inset(0% 0 0 0)', duration: 0.72 }, '-=0.16')
        .fromTo('.price-note',
          { opacity: 0 },
          { opacity: 1, duration: 0.4 }, '-=0.24');
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="price-section" id="comparison" ref={ref} data-scene-anchor>
      <div className="section-intro">
        <h2>경쟁사 동급 가격대,<br />무엇이 다른가.</h2>
        <p>국내 공식 소비자가를 기준으로 가격대를 비교하고, 각 제품이 우선하는 코트 용도, 지지 구조, 쿠셔닝과 일상 활용 범위를 함께 분석했습니다.</p>
      </div>
      <div className="comparison-scroll" role="region" aria-label="테니스화 소비자가와 기능 비교" tabIndex="0">
        <div className="comparison-board">
          <div className="comparison-product-row">
            <div className="comparison-axis-head">
              <span>비교 기준</span>
              <strong>정상가와<br />설계 방향</strong>
            </div>
            {priceBenchmarks.map((item) => (
              <article className={`comparison-product ${item.featured ? 'is-featured' : ''}`} key={item.model}>
                <div className="comparison-product-image">
                  <img src={item.image} alt={item.imageAlt} loading="lazy" decoding="async" />
                </div>
                <div className="comparison-product-meta">
                  <p>{item.brand}</p>
                  <span>{item.role}</span>
                </div>
                <h3>{item.model}</h3>
                <strong>{item.price}</strong>
                <small>{item.priceStatus}</small>
                {item.sourceUrl && (
                  <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                    {item.sourceLabel} <ArrowSquareOut size={14} weight="bold" />
                  </a>
                )}
                <dl className="mobile-comparison-details">
                  {comparisonCriteria.map(([key, label]) => (
                    <div key={`${item.model}-mobile-${key}`}>
                      <dt>{label}</dt>
                      <dd>{item[key]}</dd>
                    </div>
                  ))}
                  <div>
                    <dt>포지셔닝 해석</dt>
                    <dd>{item.analysis}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="comparison-details">
            {comparisonCriteria.map(([key, label]) => (
              <div className="comparison-row" key={key}>
                <div className="comparison-row-label">{label}</div>
                {priceBenchmarks.map((item) => (
                  <div className={`comparison-cell ${item.featured ? 'is-featured' : ''}`} key={`${item.model}-${key}`}>
                    {item[key]}
                  </div>
                ))}
              </div>
            ))}
            <div className="comparison-row comparison-analysis">
              <div className="comparison-row-label">포지셔닝 해석</div>
              {priceBenchmarks.map((item) => (
                <div className={`comparison-cell ${item.featured ? 'is-featured' : ''}`} key={`${item.model}-analysis`}>
                  {item.analysis}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="comparison-conclusion">
        <strong>CUSHLITE 302의 위치</strong>
        <p>임시 소비자가는 Vapor Pro 3보다 1만 원 높고, Barricade 14와 GEL-RESOLUTION X보다 1만 원 낮습니다. 차별점은 특정 경기 기능의 극대화보다 이지 엔트리와 일상 착화까지 이어지는 활용 범위입니다.</p>
      </div>
      <p className="price-note">2026년 8월 6일 한국 공식 정상가 기준. 할인 판매가는 제외했습니다. CUSHLITE 302 가격과 기능 정의는 출시 전 편집용 개발 기준입니다.</p>
    </section>
  );
}

function TypedText({ children }) {
  return Array.from(children).map((character, index) => (
    <span className="annotation-character" key={`${character}-${index}`}>
      {character === ' ' ? '\u00a0' : character}
    </span>
  ));
}

function Annotations({ scene }) {
  return (
    <div className="annotation-overlay" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        {scene.annotations.map((annotation, index) => (
          <g className={`annotation-callout annotation-${index + 1}`} key={annotation.code}>
            <polyline
              className="annotation-line"
              pathLength="1"
              points={`${annotation.anchor.join(',')} ${annotation.elbow.join(',')} ${annotation.labelPosition.join(',')}`}
            />
          </g>
        ))}
      </svg>
      {scene.annotations.map((annotation, index) => (
        <span
          className={`annotation-point annotation-${index + 1}`}
          key={`${annotation.code}-point`}
          style={{ '--x': `${annotation.anchor[0]}%`, '--y': `${annotation.anchor[1]}%` }}
        >
          <span className="annotation-dot" />
        </span>
      ))}
      {scene.annotations.map((annotation, index) => (
        <div
          className={`annotation-label align-${annotation.align} annotation-${index + 1}`}
          key={`${annotation.code}-label`}
          style={{ '--x': `${annotation.labelPosition[0]}%`, '--y': `${annotation.labelPosition[1]}%` }}
        >
          <span><TypedText>{annotation.code}</TypedText></span>
          <strong><TypedText>{annotation.label}</TypedText></strong>
          <small><TypedText>{annotation.detail}</TypedText></small>
        </div>
      ))}
    </div>
  );
}

function SceneNavigator({ activeIndex, total, onNavigate }) {
  return (
    <div className="scene-arrows" aria-label="전체 장면 이동">
      <button
        type="button"
        onClick={() => onNavigate(-1)}
        aria-label="이전 장면"
        disabled={activeIndex === 0}
      >
        <ArrowUp size={18} weight="bold" />
      </button>
      <button
        type="button"
        onClick={() => onNavigate(1)}
        aria-label="다음 장면"
        disabled={activeIndex === total - 1}
      >
        <ArrowDown size={18} weight="bold" />
      </button>
    </div>
  );
}

function FeatureScene({ scene, index }) {
  const ref = useRef(null);
  const motionVariants = {
    'easy-entry': 'cascade-left',
    cushioning: 'fold-up',
    'heel-clip': 'pivot',
    outsole: 'alternating',
    'toe-spring': 'diagonal',
  };
  useScrollVideo(ref, {
    rangeStart: 0,
    rangeEnd: scene.rangeEnd ?? 0.98,
    lockInitialPlayback: scene.id === 'outsole',
    motionVariant: motionVariants[scene.id] ?? 'default',
  });

  return (
    <section
      className="media-section feature-section"
      id={index === 0 ? 'technology' : undefined}
      ref={ref}
      data-feature={scene.id}
      data-scene-anchor
    >
      <div className="sticky-frame">
        <video
          muted
          playsInline
          preload={index < 2 ? 'auto' : 'metadata'}
          poster={scene.poster}
          style={{ objectPosition: scene.objectPosition }}
        >
          <source src={scene.video} type="video/mp4" />
        </video>
        <div className="media-wash feature-wash" />
        <Annotations scene={scene} />
        <article className={`feature-copy ${scene.position}`}>
          {scene.eyebrow && <p className="scene-reveal feature-eyebrow">{scene.eyebrow}</p>}
          <h2 className="scene-reveal">{scene.title}</h2>
          <p className="scene-reveal feature-body">{scene.body}</p>
          <ul className="scene-reveal feature-specs">
            {scene.specs.map((spec) => (
              <li key={spec}><Check size={14} weight="bold" />{spec}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

function useRoutinePlayback(sectionRef) {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const videos = Array.from(section?.querySelectorAll('video') ?? []);
    const panels = Array.from(section?.querySelectorAll('.routine-panel') ?? []);
    const revealItems = Array.from(section?.querySelectorAll('.routine-reveal') ?? []);
    if (!section || videos.length === 0) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const title = section.querySelector('.routine-story-header h2');
    const intro = section.querySelector('.routine-story-header p');
    const captions = Array.from(section.querySelectorAll('.routine-panel-caption'));
    let isActive = false;

    gsap.set(revealItems, {
      opacity: 0,
      transformPerspective: 1100,
      transformOrigin: '50% 100%',
    });
    gsap.set(panels, { opacity: 0 });

    const routineCopyTimeline = gsap.timeline({ paused: true });
    routineCopyTimeline
      .fromTo(title,
        { opacity: 0, x: -92, y: 38, scale: 0.94, rotateX: 12, clipPath: 'inset(0 100% 0 0)' },
        { opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'expo.out' },
        1,
      )
      .fromTo(intro,
        { opacity: 0, x: 86, clipPath: 'inset(0 0 0 100%)' },
        { opacity: 1, x: 0, clipPath: 'inset(0 0 0 0%)', duration: 0.72, ease: 'power4.out' },
        1.28,
      )
      .fromTo(captions,
        {
          opacity: 0,
          y: 42,
          x: (index) => (index - 1) * 22,
          rotateX: 12,
          clipPath: 'inset(100% 0 0 0)',
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          rotateX: 0,
          clipPath: 'inset(0% 0 0 0)',
          duration: 0.7,
          stagger: 0.13,
          ease: 'back.out(1.18)',
        },
        1.52,
      );

    const showCompleteState = (instant = false) => {
      if (instant) routineCopyTimeline.progress(1).pause();
      else routineCopyTimeline.restart();
    };

    const playRoutine = () => {
      if (isActive) return;
      isActive = true;

      if (reduceMotion) {
        videos.forEach((video) => {
          video.pause();
          video.currentTime = 0;
        });
        gsap.set(panels, { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' });
        showCompleteState(true);
        return;
      }

      routineCopyTimeline.progress(0).pause();
      gsap.fromTo(panels,
        {
          opacity: 0,
          y: (index) => 54 + index * 12,
          rotateY: (index) => (index - 1) * 5,
          clipPath: 'inset(100% 0 0 0)',
        },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          clipPath: 'inset(0% 0 0 0)',
          duration: 1,
          stagger: 0.12,
          ease: 'power4.out',
          overwrite: true,
        },
      );
      routineCopyTimeline.restart();

      videos.forEach((video) => {
        video.pause();
        video.currentTime = 0;
        video.loop = true;
        video.playbackRate = 1;
        video.play().catch(() => undefined);
      });
    };

    const stopRoutine = () => {
      if (!isActive) return;
      isActive = false;
      // revealItems(제목·본문·캡션)는 routineCopyTimeline이 관리한다.
      // 여기서 killTweensOf 하면 타임라인의 자식 트윈까지 사라져
      // 재진입 시 restart 해도 텍스트가 opacity 0 으로 남는다.
      gsap.killTweensOf(panels);
      routineCopyTimeline.progress(0).pause();
      videos.forEach((video) => {
        video.pause();
        video.currentTime = 0;
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 68%',
      end: 'bottom top',
      onEnter: playRoutine,
      onLeave: stopRoutine,
      onEnterBack: playRoutine,
      onLeaveBack: stopRoutine,
    });
    const activateFromNavigation = () => playRoutine();
    section.addEventListener('scene:activate', activateFromNavigation);

    return () => {
      trigger.kill();
      stopRoutine();
      routineCopyTimeline.kill();
      section.removeEventListener('scene:activate', activateFromNavigation);
      gsap.killTweensOf([...panels, ...revealItems]);
    };
  }, [sectionRef]);
}

function StoryIntro() {
  const ref = useRef(null);
  useRoutinePlayback(ref);

  const routineClips = [
    {
      time: '07:30',
      title: '아침의 워킹',
      detail: '몸의 리듬을 깨우는 첫 움직임',
      video: assetPath('processed/video/routine-walking.mp4'),
      poster: assetPath('processed/images/routine-walking-poster.jpg'),
    },
    {
      time: '13:10',
      title: '일상 속 리셋',
      detail: '코트와 하루 사이를 잇는 여유',
      video: assetPath('processed/video/routine-cafe.mp4'),
      poster: assetPath('processed/images/routine-cafe-poster.jpg'),
    },
    {
      time: '18:30',
      title: '코트로 향하는 순간',
      detail: '반복 가능한 루틴의 다음 스텝',
      video: assetPath('processed/video/routine-court.mp4'),
      poster: assetPath('processed/images/routine-court-poster.jpg'),
    },
  ];

  return (
    <section className="story-intro routine-story" id="routine" ref={ref} data-scene-anchor>
      <div className="routine-story-inner">
        <header className="routine-story-header">
          <h2 className="routine-reveal">매일 반복 가능한<br />몸 관리 루틴을 신는 신발.</h2>
          <p className="routine-reveal">아침의 워킹, 일상 속 짧은 리셋, 코트로 향하는 순간까지. CUSHLITE 302는 하루의 서로 다른 움직임을 하나의 리듬으로 이어갑니다.</p>
        </header>
        <div className="routine-triptych">
          {routineClips.map((clip) => (
            <article className="routine-panel" key={clip.time}>
              <video muted playsInline loop preload="metadata" poster={clip.poster}>
                <source src={clip.video} type="video/mp4" />
              </video>
              <div className="routine-panel-caption routine-reveal">
                <span>{clip.time}</span>
                <strong>{clip.title}</strong>
                <small>{clip.detail}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoutineFilm() {
  const ref = useRef(null);
  useScrollVideo(ref, {
    rangeStart: 0,
    rangeEnd: 0.94,
    lockInitialPlayback: true,
    replayOnNavigation: false,
    motionVariant: 'closing',
  });

  return (
    <section className="media-section closing routine-film" ref={ref} data-scene-anchor>
      <div className="sticky-frame">
        <video muted playsInline preload="metadata" poster={assetPath('processed/images/closing-poster.webp')}>
          <source src={assetPath('processed/video/closing-footwork.mp4')} type="video/mp4" />
        </video>
        <div className="media-wash closing-wash" />
        <div className="closing-copy">
          <p className="scene-reveal">ON-COURT ROUTINE</p>
          <h2 className="scene-reveal">일상의 리듬을<br />코트의 움직임으로.</h2>
          <p className="scene-reveal routine-film-copy">워밍업에서 첫 스텝, 반복되는 사이드 스텝까지. CUSHLITE 302는 매일 이어가는 움직임이 코트에서도 안정적인 리듬이 되도록 받쳐줍니다.</p>
        </div>
      </div>
    </section>
  );
}

function ColorVariations() {
  const ref = useRef(null);
  const colorways = [
    { name: 'Ivory', detail: '부드러운 뉴트럴 톤', color: '#dedbd1' },
    { name: 'Blue Grey', detail: '차분한 쿨 톤', color: '#9eabb0' },
    { name: 'Clean White', detail: '선명한 모노 톤', color: '#e9e9e4' },
    { name: 'Sage White', detail: '세이지 포인트 톤', color: '#b9cbb9' },
  ];

  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const copy = section.querySelectorAll('.color-reveal');
    const media = section.querySelector('.color-media');
    const image = section.querySelector('.color-media img');
    const options = section.querySelectorAll('.color-option');

    if (reduceMotion) {
      gsap.set([copy, media, image, options], { clearProps: 'all' });
      return undefined;
    }

    const timeline = gsap.timeline({ paused: true })
      .fromTo(copy[0],
        { opacity: 0, x: -94, y: 42, scale: 0.93, rotateX: 12, clipPath: 'inset(0 100% 0 0)' },
        { opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'expo.out' },
      )
      .fromTo(copy[1],
        { opacity: 0, x: 86, clipPath: 'inset(0 0 0 100%)' },
        { opacity: 1, x: 0, clipPath: 'inset(0 0 0 0%)', duration: 0.72, ease: 'power4.out' },
        0.28,
      )
      .fromTo(media,
        { opacity: 0, clipPath: 'inset(14% 0 14% 0)' },
        { opacity: 1, clipPath: 'inset(0% 0 0% 0)', duration: 1, ease: 'power3.inOut' },
        0.16,
      )
      .fromTo(image,
        { scale: 1.055 },
        { scale: 1, duration: 1.15, ease: 'power3.out' },
        0.16,
      )
      .fromTo(options,
        { opacity: 0, y: 34, x: (index) => (index % 2 === 0 ? -24 : 24), rotateX: 10, scale: 0.94 },
        { opacity: 1, y: 0, x: 0, rotateX: 0, scale: 1, duration: 0.64, stagger: 0.09, ease: 'back.out(1.2)' },
        0.72,
      );

    const reveal = () => timeline.restart();
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 68%',
      onEnter: reveal,
      onEnterBack: reveal,
    });
    section.addEventListener('scene:activate', reveal);

    return () => {
      trigger.kill();
      timeline.kill();
      section.removeEventListener('scene:activate', reveal);
    };
  }, []);

  return (
    <section className="color-variation" id="colors" ref={ref} data-scene-anchor>
      <div className="color-variation-inner">
        <header className="color-variation-header">
          <h2 className="color-reveal">하나의 설계,<br />네 가지 컬러.</h2>
          <p className="color-reveal">CUSHLITE 302의 동일한 구조를 아이보리, 블루 그레이, 클린 화이트와 세이지 화이트 조합으로 확장했습니다.</p>
        </header>
        <figure className="color-media">
          <img
            src={assetPath('processed/images/color-variations.jpg')}
            alt="아이보리, 블루 그레이, 클린 화이트, 세이지 화이트 컬러의 CUSHLITE 302 네 켤레"
          />
        </figure>
        <div className="color-options" aria-label="CUSHLITE 302 컬러 구성">
          {colorways.map((colorway) => (
            <div className="color-option" key={colorway.name}>
              <span className="color-swatch" style={{ '--swatch': colorway.color }} aria-hidden="true" />
              <div>
                <strong>{colorway.name}</strong>
                <small>{colorway.detail}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const appRef = useRef(null);
  const activeSceneRef = useRef(0);
  const navigationFrameRef = useRef(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const totalSceneCount = scenes.length + 6;

  const navigateToScene = useCallback((direction) => {
    const anchors = Array.from(document.querySelectorAll('[data-scene-anchor]'));
    const navigationGuide = 96;
    const currentIndex = anchors.reduce((resolvedIndex, anchor, index) => (
      anchor.getBoundingClientRect().top <= navigationGuide ? index : resolvedIndex
    ), 0);
    const targetIndex = clamp(currentIndex + direction, 0, anchors.length - 1);
    const target = anchors[targetIndex];
    if (!target || targetIndex === currentIndex) return;
    activeSceneRef.current = targetIndex;
    setActiveSceneIndex(targetIndex);
    if (navigationFrameRef.current) window.cancelAnimationFrame(navigationFrameRef.current);
    const targetTop = window.scrollY + target.getBoundingClientRect().top;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });

    const startedAt = window.performance.now();
    const activateAtDestination = () => {
      const arrived = Math.abs(target.getBoundingClientRect().top) <= 2;
      const timedOut = window.performance.now() - startedAt > 1600;
      if (arrived || timedOut) {
        navigationFrameRef.current = 0;
        target.dispatchEvent(new Event('scene:activate'));
        return;
      }
      navigationFrameRef.current = window.requestAnimationFrame(activateAtDestination);
    };
    navigationFrameRef.current = window.requestAnimationFrame(activateAtDestination);
  }, []);

  useLayoutEffect(() => {
    const progress = document.querySelector('.progress-track span');
    const updateProgress = (self) => gsap.set(progress, { scaleX: self.progress });
    const progressTrigger = ScrollTrigger.create({
      trigger: appRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: updateProgress,
    });

    const anchors = Array.from(document.querySelectorAll('[data-scene-anchor]'));
    const setCurrentScene = (index) => {
      activeSceneRef.current = index;
      setActiveSceneIndex(index);
    };
    const sceneTriggers = anchors.map((anchor, index) => ScrollTrigger.create({
      trigger: anchor,
      start: 'top 96px',
      end: 'bottom 96px',
      onEnter: () => setCurrentScene(index),
      onEnterBack: () => setCurrentScene(index),
    }));

    const handleKeyDown = (event) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
      event.preventDefault();
      navigateToScene(event.key === 'ArrowDown' ? 1 : -1);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      progressTrigger.kill();
      sceneTriggers.forEach((trigger) => trigger.kill());
      window.removeEventListener('keydown', handleKeyDown);
      if (navigationFrameRef.current) window.cancelAnimationFrame(navigationFrameRef.current);
    };
  }, [navigateToScene]);

  return (
    <main className="page" ref={appRef}>
      <Navigation activeIndex={activeSceneIndex} />
      <SceneNavigator activeIndex={activeSceneIndex} total={totalSceneCount} onNavigate={navigateToScene} />
      <Hero />
      <ProductReveal />
      <PriceComparison />
      <StoryIntro />
      <RoutineFilm />
      {scenes.map((scene, index) => (
        <FeatureScene key={scene.id} scene={scene} index={index} />
      ))}
      <ColorVariations />
    </main>
  );
}
