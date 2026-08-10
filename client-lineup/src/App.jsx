import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, Check } from '@phosphor-icons/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  closingScene,
  colorScene,
  competitors,
  dualScenes,
  heroScene,
  priceCards,
  routinePairs,
} from './data';
import dailyContinuityImage from './assets/usecases/daily-continuity.webp';
import courtCrossoverImage from './assets/usecases/court-crossover.webp';
import quickResponseImage from './assets/usecases/quick-response.webp';
import stableControlImage from './assets/usecases/stable-control.webp';
import matchPerformanceImage from './assets/usecases/match-performance.webp';

gsap.registerPlugin(ScrollTrigger);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const ratingAxes = [
  ['daily', '일상'],
  ['multi', '코트'],
  ['speed', '반응'],
  ['cushion', '완화'],
  ['support', '지지'],
  ['durability', '내구'],
];

const radarPoint = (index, value, radius = 58) => {
  const angle = ((index * 60) - 90) * (Math.PI / 180);
  const distance = radius * (value / 100);
  return [90 + Math.cos(angle) * distance, 90 + Math.sin(angle) * distance];
};

const radarPolygon = (value) => ratingAxes
  .map((_, index) => radarPoint(index, value).join(','))
  .join(' ');

function DesignRating({ item }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const activeAxis = ratingAxes[activeIndex];
  const activeValue = item.ratings[activeAxis[0]];
  const valuePoints = ratingAxes
    .map(([key], index) => radarPoint(index, item.ratings[key]).join(','))
    .join(' ');

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left - (bounds.width / 2);
    const y = event.clientY - bounds.top - (bounds.height / 2);
    const angle = ((Math.atan2(y, x) * 180 / Math.PI) + 450) % 360;
    setActiveIndex(Math.round(angle / 60) % 6);
    setTilt({
      x: clamp((x / bounds.width) * 8, -4, 4),
      y: clamp((-y / bounds.height) * 8, -4, 4),
    });
  };

  return (
    <div
      className={`design-rating brand-${item.brandKey}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ '--rating-tilt-x': `${tilt.y}deg`, '--rating-tilt-y': `${tilt.x}deg` }}
      aria-label={`${item.model} 공식 설명 기반 설계 강조도. ${ratingAxes.map(([key, label]) => `${label} ${item.ratings[key]}`).join(', ')}`}
    >
      <div className="design-rating-heading">
        <span>DESIGN LOADOUT</span>
        <small>상대 강조도</small>
      </div>
      <div className="rating-radar-wrap">
        <svg className="rating-radar" viewBox="0 0 180 180" aria-hidden="true">
          {[25, 50, 75, 100].map((level) => (
            <polygon className="rating-grid" points={radarPolygon(level)} key={level} />
          ))}
          {ratingAxes.map((_, index) => {
            const [x, y] = radarPoint(index, 100);
            return <line className="rating-axis" x1="90" y1="90" x2={x} y2={y} key={`axis-${index}`} />;
          })}
          <polygon className="rating-shape" points={valuePoints} />
          {ratingAxes.map(([key], index) => {
            const [x, y] = radarPoint(index, item.ratings[key]);
            return <circle className={`rating-node ${index === activeIndex ? 'is-active' : ''}`} cx={x} cy={y} r={index === activeIndex ? 4.5 : 2.7} key={key} />;
          })}
          {ratingAxes.map(([, label], index) => {
            const [x, y] = radarPoint(index, 124);
            return <text className={index === activeIndex ? 'is-active' : ''} x={x} y={y + 2.5} textAnchor="middle" key={label}>{label}</text>;
          })}
        </svg>
      </div>
      <div className="rating-readout" aria-hidden="true">
        <span>{activeAxis[1]}</span>
        <strong>{activeValue}</strong>
        <small>/ 100</small>
      </div>
    </div>
  );
}

function waitForMetadata(video) {
  if (Number.isFinite(video.duration) && video.duration > 0) return Promise.resolve();
  return new Promise((resolve) => {
    const finish = () => {
      video.removeEventListener('loadedmetadata', finish);
      video.removeEventListener('error', finish);
      resolve();
    };
    video.addEventListener('loadedmetadata', finish, { once: true });
    video.addEventListener('error', finish, { once: true });
    video.load();
  });
}

function setActiveClip(videos, activeIndex) {
  videos.forEach((video, index) => video?.classList.toggle('is-active', index === activeIndex));
}

function getPlaybackBounds(video) {
  const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 1;
  const requestedStart = Number.parseFloat(video.dataset.startTime || '0');
  const requestedEnd = Number.parseFloat(video.dataset.endTime || `${duration}`);
  const start = clamp(Number.isFinite(requestedStart) ? requestedStart : 0, 0, Math.max(0, duration - 0.04));
  const end = clamp(Number.isFinite(requestedEnd) ? requestedEnd : duration, start + 0.04, duration);
  return { start, end, duration: end - start };
}

async function playClip(video) {
  if (!video) return;
  await waitForMetadata(video);
  const bounds = getPlaybackBounds(video);
  video.pause();
  video.currentTime = bounds.start;
  return new Promise((resolve) => {
    const finish = () => {
      video.removeEventListener('ended', finish);
      video.removeEventListener('error', finish);
      video.removeEventListener('timeupdate', checkTime);
      video.pause();
      video.currentTime = Math.max(bounds.start, bounds.end - 0.025);
      resolve();
    };
    const checkTime = () => {
      if (video.currentTime >= bounds.end - 0.018) finish();
    };
    video.addEventListener('ended', finish, { once: true });
    video.addEventListener('error', finish, { once: true });
    video.addEventListener('timeupdate', checkTime);
    const playback = video.play();
    if (playback) playback.catch(finish);
  });
}

async function playSequence(videos) {
  for (let index = 0; index < videos.length; index += 1) {
    setActiveClip(videos, index);
    await playClip(videos[index]);
  }
}

function seekSequence(videos, progress) {
  const validVideos = videos.filter(Boolean);
  if (!validVideos.length) return;
  const bounds = validVideos.map((video) => getPlaybackBounds(video));
  const durations = bounds.map((item) => item.duration);
  const total = durations.reduce((sum, duration) => sum + duration, 0);
  const target = clamp(progress, 0, 1) * Math.max(total - 0.04, 0);
  let elapsed = 0;
  let activeIndex = validVideos.length - 1;
  let localTime = durations[activeIndex];

  for (let index = 0; index < durations.length; index += 1) {
    if (target <= elapsed + durations[index] || index === durations.length - 1) {
      activeIndex = index;
      localTime = target - elapsed;
      break;
    }
    elapsed += durations[index];
  }

  setActiveClip(validVideos, activeIndex);
  validVideos.forEach((video, index) => {
    video.pause();
    const desired = index < activeIndex
      ? Math.max(bounds[index].start, bounds[index].end - 0.025)
      : index > activeIndex
        ? bounds[index].start
        : bounds[index].start + clamp(localTime, 0, Math.max(0, durations[index] - 0.025));
    if (Math.abs(video.currentTime - desired) > 0.035) video.currentTime = desired;
  });
}

function mapCueProgress(progress, localCue, sharedCue) {
  const safeProgress = clamp(progress, 0, 1);
  if (safeProgress <= sharedCue) {
    return sharedCue > 0 ? (safeProgress / sharedCue) * localCue : localCue;
  }
  const tail = 1 - sharedCue;
  return localCue + (tail > 0 ? ((safeProgress - sharedCue) / tail) * (1 - localCue) : 0);
}

async function playCueSyncedPair(leftVideo, rightVideo, sync) {
  if (!leftVideo || !rightVideo) return;
  await Promise.all([waitForMetadata(leftVideo), waitForMetadata(rightVideo)]);

  const videos = [leftVideo, rightVideo];
  const localCues = [sync.leftCue, sync.rightCue];
  const sharedDuration = Math.max(leftVideo.duration, rightVideo.duration);
  const sharedCueTime = sharedDuration * sync.sharedCue;
  const remainingSharedTime = Math.max(0.05, sharedDuration - sharedCueTime);

  const trackers = videos.map((video) => {
    let finish;
    const promise = new Promise((resolve) => {
      finish = () => {
        video.removeEventListener('ended', finish);
        video.removeEventListener('error', finish);
        resolve();
      };
      video.addEventListener('ended', finish, { once: true });
      video.addEventListener('error', finish, { once: true });
    });
    return { promise, finish };
  });

  videos.forEach((video, index) => {
    video.pause();
    video.currentTime = 0;
    const cueTime = video.duration * localCues[index];
    video.playbackRate = clamp(cueTime / sharedCueTime, 0.25, 4);
    const playback = video.play();
    if (playback) playback.catch(trackers[index].finish);
  });

  await new Promise((resolve) => window.setTimeout(resolve, sharedCueTime * 1000));

  videos.forEach((video, index) => {
    if (video.ended) return;
    const cueTime = video.duration * localCues[index];
    video.currentTime = cueTime;
    video.playbackRate = clamp((video.duration - cueTime) / remainingSharedTime, 0.25, 4);
  });

  await Promise.all(trackers.map((tracker) => tracker.promise));
  videos.forEach((video) => {
    video.playbackRate = 1;
    if (Number.isFinite(video.duration)) video.currentTime = Math.max(0, video.duration - 0.025);
  });
}

function Logo() {
  return (
    <span className="brand-lockup">
      <span className="brand-mark" aria-hidden="true">
        <img src={`${import.meta.env.BASE_URL}sergio-tacchini-mark.svg`} alt="" />
      </span>
      <span>SERGIO TACCHINI</span>
    </span>
  );
}

const navItems = [
  ['top', 'Lineup'],
  ['positioning', 'Position'],
  ['routine', 'Routine'],
  ['technology', 'Technology'],
  ['colors', 'Colors'],
];

function Navigation({ activeSection, onHome }) {
  return (
    <header className="site-nav">
      <a className="wordmark" href="#top" onClick={onHome} aria-label="통합 라인업 처음으로 이동하고 첫 영상을 다시 재생"><Logo /></a>
      <nav aria-label="통합 라인업 섹션">
        {navItems.map(([id, label]) => (
          <a className={activeSection === id ? 'is-active' : ''} href={`#${id}`} key={id}>{label}</a>
        ))}
      </nav>
      <div className="lineup-models" aria-label="라인업 제품">
        <span className="model-302">302</span>
        <span className="model-separator">×</span>
        <span className="model-702">702</span>
      </div>
    </header>
  );
}

function SceneNavigator({ index, count, onNavigate }) {
  return (
    <nav className="scene-nav" aria-label="장면 이동">
      <span>{String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
      <button type="button" onClick={() => onNavigate(-1)} disabled={index === 0} aria-label="이전 장면">
        <ArrowUp size={18} weight="bold" />
      </button>
      <button type="button" onClick={() => onNavigate(1)} disabled={index === count - 1} aria-label="다음 장면">
        <ArrowDown size={18} weight="bold" />
      </button>
    </nav>
  );
}

function ClipStack({ clips, side, refs }) {
  const hasFramedMedia = clips.some((item) => item.framed);
  return (
    <div className={`clip-stack ${hasFramedMedia ? 'is-framed-stack' : ''}`} aria-hidden="true">
      <div
        className="clip-stack-backdrop"
        style={{
          backgroundImage: `url(${clips[0]?.poster})`,
          backgroundPosition: clips[0]?.objectPosition,
        }}
      />
      {clips.map((item, index) => (
        <video
          className={`${index === 0 ? 'is-active' : ''} ${item.framed ? 'is-framed-media' : ''}`.trim()}
          key={`${side}-${item.src}`}
          muted
          playsInline
          preload="metadata"
          poster={item.poster}
          data-start-time={item.startTime}
          data-end-time={item.endTime}
          ref={(node) => { refs.current[index] = node; }}
          style={{ objectPosition: item.objectPosition }}
        >
          <source src={item.src} type="video/mp4" />
        </video>
      ))}
    </div>
  );
}

function AnnotationLayer({ annotations = [], side }) {
  return (
    <div className={`annotation-layer annotation-${side}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        {annotations.map((item, index) => {
          const endX = item.labelPosition[0];
          const endY = item.labelPosition[1];
          const midX = item.align === 'right'
            ? Math.max(item.anchor[0] + 8, endX - 18)
            : Math.min(item.anchor[0] - 8, endX + 18);
          return (
            <polyline
              className="annotation-line"
              key={`${item.code}-line`}
              pathLength="1"
              points={`${item.anchor[0]},${item.anchor[1]} ${midX},${endY} ${endX},${endY}`}
              style={{ '--annotation-order': index }}
            />
          );
        })}
      </svg>
      {annotations.map((item, index) => (
        <div className="annotation-item" key={item.code} style={{ '--annotation-order': index }}>
          <span
            className="annotation-dot"
            style={{ left: `${item.anchor[0]}%`, top: `${item.anchor[1]}%` }}
          />
          <div
            className={`annotation-label align-${item.align}`}
            style={{ left: `${item.labelPosition[0]}%`, top: `${item.labelPosition[1]}%` }}
          >
            <small>{item.code}</small>
            <strong>{item.label}</strong>
            <span>{item.detail}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductCopy({ content, side, hero = false }) {
  return (
    <div className={`product-copy copy-${side} ${hero ? 'hero-product-copy' : ''}`}>
      <div className="product-meta">
        <span>{content.model}</span>
        <span>{content.role || content.eyebrow}</span>
      </div>
      <h2>{content.title}</h2>
      <p>{content.body}</p>
      {content.specs?.length ? (
        <div className="spec-row">
          {content.specs.map((spec) => <span key={spec}><Check size={12} weight="bold" />{spec}</span>)}
        </div>
      ) : null}
    </div>
  );
}

function DualVideoScene({ scene, hero = false, firstTechnology = false }) {
  const sectionRef = useRef(null);
  const leftRefs = useRef([]);
  const rightRefs = useRef([]);
  const startedRef = useRef(false);
  const readyRef = useRef(false);
  const progressRef = useRef(0);
  const lastScrollProgressRef = useRef(0);
  const sideProgressRef = useRef({ left: 0, right: 0 });

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let copyTimer;
    let settleTween;
    let wheelIdleTimer;
    let playbackRun = 0;

    const panels = {
      left: section.querySelector('.split-left'),
      right: section.querySelector('.split-right'),
    };

    const getMappedProgress = (side, progress) => {
      if (!scene.sync) return progress;
      return mapCueProgress(
        progress,
        side === 'left' ? scene.sync.leftCue : scene.sync.rightCue,
        scene.sync.sharedCue,
      );
    };

    const seekSide = (side, progress) => {
      const nextProgress = clamp(progress, 0, 1);
      sideProgressRef.current[side] = nextProgress;
      seekSequence(
        side === 'left' ? leftRefs.current : rightRefs.current,
        getMappedProgress(side, nextProgress),
      );
      panels[side]?.style.setProperty('--panel-scrub-progress', nextProgress);
    };

    const seekBoth = (progress) => {
      seekSide('left', progress);
      seekSide('right', progress);
    };

    const handlePanelWheel = (side) => (event) => {
      if (!readyRef.current || reduced) return;

      const directionDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX)
        ? event.deltaY
        : event.deltaX;
      if (!directionDelta) return;

      const deltaScale = event.deltaMode === 1
        ? 16
        : event.deltaMode === 2
          ? window.innerHeight
          : 1;
      const normalizedDelta = clamp(directionDelta * deltaScale, -180, 180);
      const currentProgress = sideProgressRef.current[side];
      const nextProgress = clamp(currentProgress + normalizedDelta * 0.00115, 0, 1);
      const movingPastStart = currentProgress <= 0.001 && normalizedDelta < 0;
      const movingPastEnd = currentProgress >= 0.999 && normalizedDelta > 0;

      if (movingPastStart || movingPastEnd) return;

      event.preventDefault();
      event.stopPropagation();
      settleTween?.kill();
      seekSide(side, nextProgress);

      const panel = panels[side];
      panel?.classList.add('is-wheel-scrubbing');
      window.clearTimeout(wheelIdleTimer);
      wheelIdleTimer = window.setTimeout(() => panel?.classList.remove('is-wheel-scrubbing'), 420);
    };

    const leftWheelHandler = handlePanelWheel('left');
    const rightWheelHandler = handlePanelWheel('right');
    if (scene.independentPanelScrub) {
      panels.left?.addEventListener('wheel', leftWheelHandler, { passive: false });
      panels.right?.addEventListener('wheel', rightWheelHandler, { passive: false });
    }

    const revealCopy = () => section.classList.add('is-copy-visible');
    const allVideos = () => [...leftRefs.current, ...rightRefs.current].filter(Boolean);
    const resumeLoopedPlayback = () => {
      if (!scene.loopWhileActive || !readyRef.current || reduced) return;
      allVideos().forEach((video) => {
        const bounds = getPlaybackBounds(video);
        video.loop = true;
        if (video.currentTime >= bounds.end - 0.04) video.currentTime = bounds.start;
        video.play().catch(() => {});
      });
    };
    const startPlayback = async () => {
      if (startedRef.current) {
        resumeLoopedPlayback();
        return;
      }
      const runId = ++playbackRun;
      startedRef.current = true;
      section.classList.add('is-playing');
      copyTimer = window.setTimeout(revealCopy, 1000);

      allVideos().forEach((video) => { video.loop = false; });

      if (reduced) {
        revealCopy();
        section.classList.add('is-ready');
        readyRef.current = true;
        return;
      }

      const leftVideos = leftRefs.current.filter(Boolean);
      const rightVideos = rightRefs.current.filter(Boolean);
      if (scene.sync && leftVideos.length === 1 && rightVideos.length === 1) {
        setActiveClip(leftVideos, 0);
        setActiveClip(rightVideos, 0);
        await playCueSyncedPair(leftVideos[0], rightVideos[0], scene.sync);
      } else {
        await Promise.all([
          playSequence(leftVideos),
          playSequence(rightVideos),
        ]);
      }

      if (runId !== playbackRun) return;

      section.classList.remove('is-playing');
      section.classList.add('is-ready');
      readyRef.current = true;

      if (scene.independentPanelScrub) {
        seekBoth(1);
        lastScrollProgressRef.current = progressRef.current;
        return;
      }

      if (scene.holdAfterFirstPlay) {
        seekBoth(1);
        lastScrollProgressRef.current = progressRef.current;
        return;
      }

      if (scene.loopWhileActive) {
        allVideos().forEach((video) => {
          const bounds = getPlaybackBounds(video);
          video.currentTime = bounds.start;
          video.loop = true;
          video.play().catch(() => {});
        });
        return;
      }

      const proxy = { progress: 1 };
      settleTween = gsap.to(proxy, {
        progress: progressRef.current,
        duration: 0.42,
        ease: 'power2.inOut',
        onUpdate: () => {
          seekBoth(proxy.progress);
        },
      });
    };

    const replayPlayback = () => {
      playbackRun += 1;
      window.clearTimeout(copyTimer);
      settleTween?.kill();
      allVideos().forEach((video) => {
        video.loop = false;
        video.pause();
      });

      startedRef.current = false;
      readyRef.current = false;
      progressRef.current = 0;
      lastScrollProgressRef.current = 0;
      sideProgressRef.current = { left: 0, right: 0 };

      section.classList.remove('is-ready', 'is-playing', 'is-copy-visible');
      seekBoth(0);
      window.requestAnimationFrame(startPlayback);
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onEnter: startPlayback,
      onEnterBack: startPlayback,
      onUpdate: (self) => {
        const scrollDelta = self.progress - lastScrollProgressRef.current;
        progressRef.current = self.progress;
        lastScrollProgressRef.current = self.progress;
        if (!readyRef.current || reduced) return;

        if (scene.independentPanelScrub || scene.loopWhileActive) return;

        if (scene.holdAfterFirstPlay) {
          seekSide('left', sideProgressRef.current.left + scrollDelta);
          seekSide('right', sideProgressRef.current.right + scrollDelta);
          return;
        }

        seekBoth(self.progress);
      },
      onLeave: () => {
        if (!readyRef.current) return;
        [...leftRefs.current, ...rightRefs.current].forEach((video) => video?.pause());
      },
      onLeaveBack: () => {
        if (!readyRef.current) return;
        [...leftRefs.current, ...rightRefs.current].forEach((video) => video?.pause());
      },
    });

    section.addEventListener('scene:activate', startPlayback);
    section.addEventListener('scene:replay', replayPlayback);
    if (reduced) startPlayback();

    return () => {
      playbackRun += 1;
      window.clearTimeout(copyTimer);
      window.clearTimeout(wheelIdleTimer);
      settleTween?.kill();
      trigger.kill();
      if (scene.independentPanelScrub) {
        panels.left?.removeEventListener('wheel', leftWheelHandler);
        panels.right?.removeEventListener('wheel', rightWheelHandler);
      }
      section.removeEventListener('scene:activate', startPlayback);
      section.removeEventListener('scene:replay', replayPlayback);
      [...leftRefs.current, ...rightRefs.current].forEach((video) => video?.pause());
    };
  }, []);

  return (
    <section
      className={`dual-scroll-scene ${hero ? 'hero-scene' : 'technology-scene'}`}
      id={hero ? 'top' : firstTechnology ? 'technology' : scene.id}
      ref={sectionRef}
      data-scene-anchor
      data-nav-section={hero ? 'top' : 'technology'}
    >
      <div className="dual-stage">
        <div className="split-panel split-left">
          <ClipStack clips={scene.left.clips} side="left" refs={leftRefs} />
          <div className="media-veil" />
          <div className="panel-scrub-indicator" aria-hidden="true"><span /></div>
          <ProductCopy content={scene.left} side="left" hero={hero} />
          {!hero ? <AnnotationLayer annotations={scene.left.annotations} side="left" /> : null}
        </div>
        <div className="split-panel split-right">
          <ClipStack clips={scene.right.clips} side="right" refs={rightRefs} />
          <div className="media-veil" />
          <div className="panel-scrub-indicator" aria-hidden="true"><span /></div>
          <ProductCopy content={scene.right} side="right" hero={hero} />
          {!hero ? <AnnotationLayer annotations={scene.right.annotations} side="right" /> : null}
        </div>
        <div className="center-spine" aria-hidden="true" />
        <div className="shared-scene-heading">
          {hero ? <p>{scene.kicker}</p> : <p>DUAL DESIGN STUDY · {scene.index}</p>}
          <h1>{hero ? scene.title.split('\n').map((line) => <span key={line}>{line}</span>) : scene.title}</h1>
        </div>
        <div className="playback-status" aria-hidden="true">
          <span />
          <p>FIRST PLAY · THEN SCROLL</p>
        </div>
      </div>
    </section>
  );
}

function PriceSection() {
  const ref = useRef(null);
  const spectrumPreviewRef = useRef(null);
  const [hoveredSpectrumItem, setHoveredSpectrumItem] = useState(null);

  const moveSpectrumPreview = useCallback((event) => {
    if (!spectrumPreviewRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = clamp(event.clientX - bounds.left + 22, 12, bounds.width - 258);
    const y = clamp(event.clientY - bounds.top + 18, 74, bounds.height - 112);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(spectrumPreviewRef.current, { x, y });
    } else {
      gsap.to(spectrumPreviewRef.current, {
        x,
        y,
        duration: 0.32,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  }, []);

  const marketMin = 140000;
  const marketMax = 260000;
  const pricePosition = (price) => `${((price - marketMin) / (marketMax - marketMin)) * 100}%`;
  const priceTicks = [140000, 170000, 200000, 230000, 260000];
  const tierRows = [
    {
      tier: 'daily', label: '일상 연속성', descriptor: 'DAILY CONTINUITY',
      image: dailyContinuityImage, alt: '일상 속에서 자연스럽게 걷는 테니스 라이프스타일',
    },
    {
      tier: 'crossover', label: '온·오프 코트', descriptor: 'COURT CROSSOVER',
      image: courtCrossoverImage, alt: '카페와 테니스 코트를 오가는 일상 착화 장면',
    },
    {
      tier: 'stability', label: '안정 제어', descriptor: 'STABLE CONTROL',
      image: stableControlImage, alt: '하드코트에서 측면 움직임을 안정적으로 멈추는 장면',
    },
    {
      tier: 'speed', label: '스피드', descriptor: 'QUICK RESPONSE',
      image: quickResponseImage, alt: '테니스 코트에서 빠르게 첫발을 내딛는 장면',
    },
    {
      tier: 'performance', label: '상위 경기', descriptor: 'MATCH PERFORMANCE',
      image: matchPerformanceImage, alt: '테니스 경기 중 다음 동작을 준비하는 장면',
    },
  ];
  const featureColumns = [
    ['daily', '일상 활용'],
    ['multi', '다목적 코트'],
    ['speed', '빠른 반응'],
    ['cushion', '충격 완화'],
    ['support', '측면 안정'],
    ['durability', '내구 설계'],
  ];
  const marketItemsSorted = [...competitors].sort((a, b) => a.priceValue - b.priceValue);
  const brandGroups = [...new Set(competitors.map((item) => item.brand))].map((brand) => ({
    brand,
    items: competitors.filter((item) => item.brand === brand),
  }));
  const sergioMatrixProducts = [
    {
      brand: 'SERGIO TACCHINI',
      model: 'CUSHLITE 302',
      price: '₩169,000',
      emphasis: ['daily', 'multi', 'cushion', 'support'],
      emphasisLabels: {
        daily: '데일리 착화',
        multi: '낮은 토 스프링',
        cushion: '미드솔 쿠션',
        support: '힐 지지 프레임',
      },
      signature: '일상 연속성 · 자연스러운 전족부 · 넓은 플랫폼',
      image: priceCards[0].image,
      source: '/302/',
      house: '302',
    },
    {
      brand: 'SERGIO TACCHINI',
      model: 'CUSHLITE 702',
      price: '₩189,000',
      emphasis: ['daily', 'multi', 'cushion', 'support'],
      emphasisLabels: {
        daily: '데일리 착화',
        multi: '파동형 러그',
        cushion: '미드솔 쿠션',
        support: '아치 서포트',
      },
      signature: '아치 하부 지지 · 반복 착지 · 방향 전환',
      image: priceCards[1].image,
      source: '/702/',
      house: '702',
    },
  ];
  const matrixProducts = [...sergioMatrixProducts, ...competitors];
  const positionProducts = [
    {
      brand: 'SERGIO TACCHINI', brandKey: 'sergio-302', model: 'CUSHLITE 302', price: '₩169,000',
      priceValue: 169000, tiers: ['daily', 'crossover'], tierOrder: { daily: 0, crossover: 0 },
      image: priceCards[0].image, source: '/302/', house: '302',
    },
    {
      brand: 'SERGIO TACCHINI', brandKey: 'sergio-702', model: 'CUSHLITE 702', price: '₩189,000',
      priceValue: 189000, tiers: ['crossover', 'stability'], tierOrder: { crossover: 1, stability: 1 },
      image: priceCards[1].image, source: '/702/', house: '702',
    },
    ...competitors,
  ];
  useLayoutEffect(() => {
    const section = ref.current;
    const context = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 72%', once: true },
      });
      timeline
        .fromTo('.price-intro > *', { opacity: 0, y: 70, clipPath: 'inset(100% 0 0 0)' }, {
          opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', stagger: 0.1, duration: 0.9, ease: 'expo.out',
        })
        .fromTo('[data-price-reveal]', { opacity: 0, y: 90, rotateX: 12, scale: 0.95 }, {
          opacity: 1, y: 0, rotateX: 0, scale: 1, stagger: 0.09, duration: 0.85, ease: 'power4.out',
        }, '-=0.42');

      gsap.utils.toArray('[data-market-reveal]').forEach((item, index) => {
        gsap.fromTo(item, {
          opacity: 0,
          y: 54,
          clipPath: index % 2 ? 'inset(0 0 0 14%)' : 'inset(12% 0 0 0)',
        }, {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0% 0 0 0)',
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: { trigger: item, start: 'top 88%', once: true },
        });
      });

      const mapTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.position-map', start: 'top 76%', once: true },
      });
      mapTimeline
        .fromTo('.position-map-header > *', { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.65, stagger: 0.09, ease: 'power3.out',
        })
        .fromTo('.usecase-photo img', { scale: 1.16, filter: 'saturate(.55) contrast(.9)' }, {
          scale: 1, filter: 'saturate(.82) contrast(1)', duration: 0.9, stagger: 0.07, ease: 'power3.out',
        }, '-=0.34')
        .fromTo('.usecase-column', { opacity: 0, y: 22 }, {
          opacity: 1, y: 0, duration: 0.58, stagger: 0.075, ease: 'power3.out',
        }, '-=0.5')
        .fromTo('.usecase-product-card', { opacity: 0, y: 16, scale: 0.9, rotateX: -10 }, {
          opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.7, stagger: 0.055,
          ease: 'back.out(1.45)', clearProps: 'transform',
        }, '-=0.34');

      const spectrumTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.price-spectrum', start: 'top 82%', once: true },
      });
      spectrumTimeline
        .fromTo('.spectrum-axis', { scaleX: 0, transformOrigin: 'left center' }, {
          scaleX: 1, duration: 0.8, ease: 'expo.inOut',
        })
        .fromTo('.spectrum-dot', { opacity: 0, y: -16, scale: 0.86 }, {
          opacity: 1, y: 0, scale: 1, duration: 0.62, stagger: 0.065,
          ease: 'back.out(1.5)', clearProps: 'transform',
        }, '-=0.38')
        .fromTo('.spectrum-shoe img', { opacity: 0, scale: 0.68, rotate: -7 }, {
          opacity: 1, scale: 1, rotate: 0, duration: 0.52, stagger: 0.05,
          ease: 'power3.out', clearProps: 'transform',
        }, '-=0.54');

      const rangeTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.brand-range', start: 'top 84%', once: true },
      });
      rangeTimeline
        .fromTo('.range-row', { opacity: 0, x: 18 }, {
          opacity: 1, x: 0, duration: 0.48, stagger: 0.1, ease: 'power3.out',
        })
        .fromTo('.range-line > span', { scaleX: 0, transformOrigin: 'left center' }, {
          scaleX: 1, duration: 0.72, stagger: 0.08, ease: 'expo.inOut',
        }, '-=0.38')
        .fromTo('.range-line > i', { opacity: 0, scale: 0 }, {
          opacity: 1, scale: 1, duration: 0.38, stagger: 0.055, ease: 'back.out(1.8)',
        }, '-=0.45');

      const matrixTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.feature-matrix', start: 'top 80%', once: true },
      });
      matrixTimeline
        .fromTo('.matrix-signatures > *', { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out',
        })
        .fromTo('.matrix-head > *', { opacity: 0, y: 12 }, {
          opacity: 1, y: 0, duration: 0.45, stagger: 0.045, ease: 'power2.out',
        }, '-=0.24')
        .fromTo('.matrix-row', { opacity: 0, y: 14 }, {
          opacity: 1, y: 0, duration: 0.44, stagger: 0.045, ease: 'power3.out',
        }, '-=0.18')
        .fromTo('.matrix-feature-cell.is-emphasized i', { scale: 0 }, {
          scale: 1, duration: 0.3, stagger: 0.025, ease: 'back.out(2)', clearProps: 'transform',
        }, '-=0.36');
    }, section);
    return () => context.revert();
  }, []);

  return (
    <section className="price-section" id="positioning" ref={ref} data-scene-anchor data-nav-section="positioning">
      <div className="price-intro">
        <p>LINEUP POSITIONING</p>
        <h2>움직임에 맞춘,<br />두 가지 기준.</h2>
        <span>302는 일상 연속성, 702는 코트 안정성에 집중합니다.</span>
      </div>
      <div className="product-price-grid">
        {priceCards.map((item) => (
          <article className={`product-price-card accent-${item.accent}`} data-price-reveal key={item.model}>
            <div>
              <p>{item.brand}</p>
              <h3>{item.model}</h3>
              <strong>{item.price}</strong>
              <small>출시 전 임시 소비자가</small>
            </div>
            <img src={item.image} alt={`${item.model} 컬러 라인업`} />
            <footer>
              <span>{item.role}</span>
              <p>{item.summary}</p>
            </footer>
          </article>
        ))}
      </div>
      <div className="market-analysis">
        <header className="market-heading" data-market-reveal>
          <div>
            <p>PRICE &amp; POSITION</p>
            <h3>가격대별,<br />용도와 설계.</h3>
          </div>
          <p>공식 가격과 제품 설명을 기준으로 용도와 설계 특징을 비교했습니다.</p>
        </header>

        <div className="market-summary-grid">
          <article
            className="price-spectrum"
            data-market-reveal
            onPointerMove={moveSpectrumPreview}
            onPointerLeave={() => setHoveredSpectrumItem(null)}
          >
            <header>
              <div><small>PRICE SPECTRUM</small><h4>₩149K — ₩259K</h4></div>
              <span>CUSHLITE 302 · 169K &nbsp; / &nbsp; 702 · 189K</span>
            </header>
            <div className="spectrum-track">
              <div className="spectrum-axis" />
              {priceTicks.map((tick) => (
                <span className="spectrum-tick" style={{ left: pricePosition(tick) }} key={tick}>
                  {Math.round(tick / 1000)}K
                </span>
              ))}
              {marketItemsSorted.map((item, index) => (
                <a
                  className={`spectrum-dot brand-${item.brandKey}`}
                  href={item.source}
                  target="_blank"
                  rel="noreferrer"
                  style={{ left: pricePosition(item.priceValue), '--dot-row': index % 7 }}
                  key={`${item.model}-dot`}
                  aria-label={`${item.brand} ${item.model} ${item.price}`}
                  onPointerEnter={() => setHoveredSpectrumItem(item)}
                  onFocus={() => setHoveredSpectrumItem(item)}
                  onBlur={() => setHoveredSpectrumItem(null)}
                >
                  <i className="spectrum-shoe"><img src={item.image} alt="" loading="lazy" /></i>
                  <span>{item.brand}</span>
                  <strong>{item.model.replace('THE ROGER ', '').replace('Adizero ', '')}</strong>
                </a>
              ))}
              <span className="sergio-reference ref-302" style={{ left: pricePosition(169000) }}>302 · 169K</span>
              <span className="sergio-reference ref-702" style={{ left: pricePosition(189000) }}>702 · 189K</span>
            </div>
            <div
              className={`spectrum-hover-preview ${hoveredSpectrumItem ? 'is-visible' : ''}`}
              ref={spectrumPreviewRef}
              aria-hidden="true"
            >
              <div className="spectrum-hover-card">
                <span><img src={(hoveredSpectrumItem || competitors[0]).image} alt="" /></span>
                <div>
                  <small>{(hoveredSpectrumItem || competitors[0]).brand}</small>
                  <strong>{(hoveredSpectrumItem || competitors[0]).model}</strong>
                  <em>{(hoveredSpectrumItem || competitors[0]).price}</em>
                </div>
              </div>
            </div>
          </article>

          <article className="brand-range" data-market-reveal>
            <header><small>BRAND PRICE RANGE</small><h4>브랜드별 가격 폭</h4></header>
            {brandGroups.map((group) => {
              const values = group.items.map((item) => item.priceValue);
              const min = Math.min(...values);
              const max = Math.max(...values);
              return (
                <div className="range-row" key={group.brand}>
                  <strong>{group.brand}</strong>
                  <div className="range-line">
                    <span style={{ left: pricePosition(min), width: `calc(${pricePosition(max)} - ${pricePosition(min)})` }} />
                    {values.map((value, index) => <i style={{ left: pricePosition(value) }} key={`${value}-${index}`} />)}
                  </div>
                  <em>{Math.round(min / 1000)}—{Math.round(max / 1000)}K</em>
                </div>
              );
            })}
          </article>
        </div>

        <article className="position-map" data-market-reveal>
          <header className="position-map-header">
            <div>
              <p>가격과 용도 지도</p>
              <h4>가격대별 설계 포지션.</h4>
            </div>
            <div className="position-map-key">
              <span><i className="key-302" />302 · 일상 연속성 + 온·오프 코트</span>
              <span><i className="key-702" />702 · 안정 제어 + 온·오프 코트</span>
              <span><i className="key-market" />경쟁 모델</span>
            </div>
          </header>
          <div className="usecase-grid">
            {tierRows.map(({ tier, label, descriptor, image, alt }, tierIndex) => {
              const tierItems = positionProducts
                .filter((item) => item.tier === tier || item.tiers?.includes(tier))
                .sort((a, b) => {
                  const orderFor = (item) => item.tierOrder?.[tier]
                    ?? (tier === 'stability' && item.model === 'GEL-RESOLUTION X' ? 0 : 2);
                  return orderFor(a) - orderFor(b) || a.priceValue - b.priceValue;
                });
              return (
                <article className={`usecase-column usecase-${tier}`} key={tier}>
                  <figure className="usecase-photo">
                    <img src={image} alt={alt} loading="lazy" />
                    <figcaption>
                      <span>{String(tierIndex + 1).padStart(2, '0')}</span>
                      <strong>{label}</strong>
                      <small>{descriptor}</small>
                    </figcaption>
                  </figure>
                  <div className="usecase-products">
                    {tierItems.map((item) => (
                      <a
                        href={item.source}
                        target={item.house ? undefined : '_blank'}
                        rel={item.house ? undefined : 'noreferrer'}
                        className={`usecase-product-card brand-${item.brandKey} ${item.house ? `is-house usecase-${item.house} bridge-${item.house}` : ''}`}
                        key={`${tier}-${item.model}`}
                      >
                        <span className="usecase-product-image"><img src={item.image} alt="" loading="lazy" /></span>
                        <span className="usecase-product-copy">
                          <small>{item.brand}</small>
                          <strong>{item.model.replace('THE ROGER ', '').replace('Adizero ', '')}</strong>
                          <em>{item.price}</em>
                        </span>
                      </a>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </article>

        <article className="feature-matrix" data-market-reveal>
          <header>
            <div>
              <small>COMPETITOR FEATURE READ</small>
              <h4>경쟁사 핵심 기능</h4>
              <p className="matrix-intro">각 브랜드가 공식 제품 설명에서 앞세운 기술과 구조를 비교합니다. 경쟁 모델의 핵심 키워드도 기본 상태에서 함께 표시합니다.</p>
            </div>
            <div className="matrix-legend">
              <span><i className="legend-emphasized" />기술·구조 키워드</span>
              <span><i className="legend-market" />우선 표기 없음</span>
            </div>
          </header>
          <div className="matrix-signatures">
            {sergioMatrixProducts.map((item) => (
              <a className={`signature-card signature-${item.house}`} href={item.source} key={`${item.model}-signature`}>
                <div>
                  <span>{item.house}</span>
                  <small>{item.price}</small>
                </div>
                <strong>{item.model}</strong>
                <p>{item.signature}</p>
                <div className="signature-axis" aria-hidden="true">
                  {featureColumns.map(([key, label]) => (
                    <i className={item.emphasis.includes(key) ? 'is-on' : ''} key={`${item.model}-${key}`} title={label} />
                  ))}
                </div>
              </a>
            ))}
          </div>
          <div className="matrix-scroll-shell" tabIndex="0" aria-label="경쟁사 핵심 기능 비교표">
            <div className="matrix-grid">
              <div className="matrix-head">
                <div className="matrix-corner">브랜드 / 모델 / 정상가</div>
                {featureColumns.map(([, label], index) => (
                  <div className="matrix-column" key={label}><span>{String(index + 1).padStart(2, '0')}</span>{label}</div>
                ))}
              </div>
              {matrixProducts.map((item) => (
                <div className={`matrix-row ${item.house ? `is-house row-${item.house}` : 'is-competitor'}`} key={`${item.model}-matrix`}>
                  <a className="matrix-product-cell" href={item.source} target={item.house ? undefined : '_blank'} rel={item.house ? undefined : 'noreferrer'}>
                    <span className="matrix-product-image">
                      <img src={item.image} alt={`${item.brand} ${item.model}`} loading="lazy" />
                      {!item.house && <i className={`matrix-brand-token brand-${item.brandKey}`}>{item.brand.slice(0, 2)}</i>}
                    </span>
                    <span className="matrix-product-name"><small>{item.brand}</small><strong>{item.model}</strong><em>{item.price}</em></span>
                  </a>
                  {featureColumns.map(([key, label]) => (
                    <span
                      className={`matrix-feature-cell ${item.emphasis.includes(key) ? 'is-emphasized' : ''}`}
                      key={`${item.model}-${label}`}
                      title={`${label}: ${item.emphasis.includes(key) ? (item.house ? 'CUSHLITE 내부 기획·구조 기준' : '브랜드 공식 제품 설명 기준') : '우선 표기 없음'}`}
                    >
                      <i />
                      <small>{item.emphasis.includes(key) ? item.emphasisLabels?.[key] : '—'}</small>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <p className="matrix-note"><strong>표 읽는 법</strong><span>채워진 원과 키워드는 해당 항목에 대응하는 대표 기술 또는 구조입니다. 빈 원은 기능 부재가 아니라 우선 표기가 없다는 뜻입니다. 경쟁 모델은 브랜드 공식 제품 설명 기준이며, CUSHLITE는 현재 내부 제품 기획·구조 기준입니다.</span></p>
        </article>

        <div className="competitor-catalog" data-market-reveal>
          <header className="competitor-catalog-heading">
            <div><p>SELECTED COMPETITOR MODELS</p><h3>브랜드별 대표 설계를 같은 기준으로.</h3></div>
            <span>{competitors.length} MODELS · {new Set(competitors.map((item) => item.brand)).size} BRANDS</span>
          </header>
          <div className="competitor-catalog-grid">
            {competitors.map((item) => (
              <a className="market-model-card" href={item.source} target="_blank" rel="noreferrer" key={item.model}>
                <div className="market-model-brandline"><strong>{item.brand}</strong><span>{item.role}</span></div>
                <div className="market-model-visual">
                  <div className="market-model-image"><img src={item.image} alt={`${item.brand} ${item.model}`} /></div>
                  <DesignRating item={item} />
                </div>
                <div className="market-model-copy">
                  <h4>{item.model}</h4>
                  <strong>{item.price}</strong>
                  <p>{item.feature}</p>
                  <ul>{item.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul>
                </div>
                <ArrowUpRight size={16} weight="bold" />
              </a>
            ))}
          </div>
        </div>
        <p className="rating-method-note"><strong>설계 강조도 읽는 법</strong><span>각 수치는 실험실 성능 점수가 아니라 공식 제품 설명에서 반복적으로 강조한 용도와 기능을 0–100 범위로 환산한 상대 지표입니다. 마우스를 그래프의 각 방향으로 움직이면 해당 축을 자세히 볼 수 있습니다.</span></p>
      </div>
      <p className="price-disclaimer">경쟁사 가격은 2026년 8월 10일 한국 공식 온라인 스토어 정상가 기준입니다. 프로모션 가격은 제외했으며 색상·재고에 따라 변동될 수 있습니다. 기술 비교는 각 브랜드가 공개한 설명을 요약했으며, 직접 착화 시험이나 성능 우열 평가가 아닙니다.</p>
    </section>
  );
}

function RoutineSection() {
  const sectionRef = useRef(null);
  const leftRefs = useRef([]);
  const rightRefs = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const videos = () => [...leftRefs.current, ...rightRefs.current].filter(Boolean);
    const playAll = () => {
      videos().forEach((video) => video.play().catch(() => {}));
    };
    const pauseAll = () => videos().forEach((video) => video.pause());

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: playAll,
      onEnterBack: playAll,
      onLeave: pauseAll,
      onLeaveBack: pauseAll,
    });
    section.addEventListener('scene:activate', playAll);

    return () => {
      trigger.kill();
      section.removeEventListener('scene:activate', playAll);
      pauseAll();
    };
  }, []);

  return (
    <section className="routine-section" id="routine" ref={sectionRef} data-scene-anchor data-nav-section="routine">
      <div className="routine-stage">
        <div className="routine-heading">
          <p>A DAY IN WELLNESS MOTION</p>
        </div>
        <div className="routine-panel routine-left">
          <div className="routine-mosaic">
            {routinePairs.map((pair, index) => (
              <article className={`routine-card routine-card-${index}`} key={pair.left.src}>
                <video
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  poster={pair.left.poster}
                  ref={(node) => { leftRefs.current[index] = node; }}
                >
                  <source src={pair.left.src} type="video/mp4" />
                </video>
                <div className="routine-card-caption">
                  <small><span>{pair.time}</span>{pair.leftCode}</small>
                  <h3>{pair.leftTitle}</h3>
                  <p>{pair.leftLabel}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="routine-panel routine-right">
          <div className="routine-mosaic">
            {routinePairs.map((pair, index) => (
              <article className={`routine-card routine-card-${index}`} key={pair.right.src}>
                <video
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  poster={pair.right.poster}
                  ref={(node) => { rightRefs.current[index] = node; }}
                >
                  <source src={pair.right.src} type="video/mp4" />
                </video>
                <div className="routine-card-caption">
                  <small><span>{pair.time}</span>{pair.rightCode}</small>
                  <h3>{pair.rightTitle}</h3>
                  <p>{pair.rightLabel}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ColorSection() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const section = ref.current;
    const images = section.querySelectorAll('img');
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 65%', once: true },
    });
    timeline
      .fromTo(images, { clipPath: 'inset(0 50% 0 50%)', scale: 1.12 }, {
        clipPath: 'inset(0 0% 0 0%)', scale: 1, duration: 1.2, stagger: 0.12, ease: 'expo.out',
      })
      .fromTo('.color-copy > *', { opacity: 0, y: 44 }, {
        opacity: 1, y: 0, stagger: 0.09, duration: 0.75, ease: 'power3.out',
      }, '-=0.7');
    return () => timeline.kill();
  }, []);

  return (
    <section className="color-section" id="colors" ref={ref} data-scene-anchor data-nav-section="colors">
      {['left', 'right'].map((side) => (
        <article className={`color-panel color-${side}`} key={side}>
          <img src={colorScene[side].image} alt={`${colorScene[side].model} 네 가지 컬러`} />
          <div className="color-copy">
            <small>{colorScene[side].eyebrow}</small>
            <h2>{colorScene[side].title}</h2>
            <span>{colorScene[side].model}</span>
          </div>
        </article>
      ))}
      <div className="center-spine" aria-hidden="true" />
    </section>
  );
}

function ClosingSection() {
  const ref = useRef(null);
  const videos = useRef([]);

  useLayoutEffect(() => {
    const section = ref.current;
    const play = () => videos.current.forEach((video) => video?.play().catch(() => {}));
    const pause = () => videos.current.forEach((video) => video?.pause());
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      end: 'bottom top',
      onEnter: play,
      onEnterBack: play,
      onLeave: pause,
      onLeaveBack: pause,
    });
    return () => { trigger.kill(); pause(); };
  }, []);

  return (
    <footer className="closing-section" ref={ref} data-scene-anchor data-nav-section="colors">
      {['left', 'right'].map((side, index) => (
        <div className={`closing-panel closing-${side}`} key={side}>
          <video
            muted
            playsInline
            loop
            preload="metadata"
            poster={closingScene[side].clips[0].poster}
            ref={(node) => { videos.current[index] = node; }}
          >
            <source src={closingScene[side].clips[0].src} type="video/mp4" />
          </video>
          <div><small>{closingScene[side].model}</small><p>{closingScene[side].label}</p></div>
        </div>
      ))}
      <div className="closing-message">
        <p>302 × 702</p>
        <h2>절제된 루틴이 만드는 우아한 삶.</h2>
        <Logo />
      </div>
    </footer>
  );
}

function DesktopNotice() {
  return (
    <div className="desktop-notice">
      <Logo />
      <h1>두 제품을 나란히 보는<br />데스크톱 쇼케이스입니다.</h1>
      <p>1280px 이상의 화면에서 확인해 주세요.</p>
    </div>
  );
}

export default function App() {
  const appRef = useRef(null);
  const [activeScene, setActiveScene] = useState(0);
  const [activeSection, setActiveSection] = useState('top');
  const sceneCount = dualScenes.length + 5;

  const returnToHero = useCallback((event) => {
    event.preventDefault();
    const target = document.getElementById('top');
    if (!target) return;

    const targetTop = window.scrollY + target.getBoundingClientRect().top;
    window.history.replaceState(null, '', '#top');
    window.scrollTo({ top: targetTop, behavior: 'smooth' });

    const startedAt = window.performance.now();
    const replayOnArrival = () => {
      const arrived = Math.abs(window.scrollY - targetTop) < 3;
      const timedOut = window.performance.now() - startedAt > 1800;
      if (arrived || timedOut) {
        target.dispatchEvent(new Event('scene:replay'));
        return;
      }
      window.requestAnimationFrame(replayOnArrival);
    };

    window.requestAnimationFrame(replayOnArrival);
  }, []);

  const navigate = useCallback((direction) => {
    const anchors = Array.from(document.querySelectorAll('[data-scene-anchor]'));
    const current = anchors.reduce((resolved, anchor, index) => (
      anchor.getBoundingClientRect().top <= 100 ? index : resolved
    ), 0);
    const next = clamp(current + direction, 0, anchors.length - 1);
    const target = anchors[next];
    if (!target || next === current) return;
    const top = window.scrollY + target.getBoundingClientRect().top;

    // A downward arrow visit is an intentional re-entry: let the destination
    // restart its one-time playback when ScrollTrigger reaches its anchor.
    if (direction > 0) target.dataset.replayOnEntry = 'true';
    window.scrollTo({ top, behavior: 'smooth' });
    window.setTimeout(() => {
      if (target.dataset.replayOnEntry === 'true') {
        delete target.dataset.replayOnEntry;
        target.dispatchEvent(new Event('scene:replay'));
        return;
      }
      target.dispatchEvent(new Event('scene:activate'));
    }, 1100);
  }, []);

  useLayoutEffect(() => {
    const anchors = Array.from(document.querySelectorAll('[data-scene-anchor]'));
    const activateAnchor = (anchor, index) => {
      setActiveScene(index);
      setActiveSection(anchor.dataset.navSection || 'technology');
      const shouldReplay = anchor.dataset.replayOnEntry === 'true';
      if (shouldReplay) delete anchor.dataset.replayOnEntry;
      anchor.dispatchEvent(new Event(shouldReplay ? 'scene:replay' : 'scene:activate'));
    };
    const triggers = anchors.map((anchor, index) => ScrollTrigger.create({
      trigger: anchor,
      start: 'top 102px',
      end: 'bottom 102px',
      onEnter: () => activateAnchor(anchor, index),
      onEnterBack: () => activateAnchor(anchor, index),
    }));
    const keyboard = (event) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      navigate(event.key === 'ArrowDown' ? 1 : -1);
    };
    window.addEventListener('keydown', keyboard);
    window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const initialAnchor = window.location.hash.slice(1);
      if (initialAnchor) {
        const target = document.getElementById(initialAnchor);
        if (target) {
          target.scrollIntoView({ behavior: 'auto', block: 'start' });
          ScrollTrigger.update();
          target.dispatchEvent(new Event('scene:activate'));
        }
      }
    });
    return () => {
      triggers.forEach((trigger) => trigger.kill());
      window.removeEventListener('keydown', keyboard);
    };
  }, [navigate]);

  return (
    <>
      <DesktopNotice />
      <main className="lineup-page" ref={appRef}>
        <Navigation activeSection={activeSection} onHome={returnToHero} />
        <SceneNavigator index={activeScene} count={sceneCount} onNavigate={navigate} />
        <DualVideoScene scene={heroScene} hero />
        <PriceSection />
        <RoutineSection />
        {dualScenes.map((scene, index) => (
          <DualVideoScene scene={scene} firstTechnology={index === 0} key={scene.id} />
        ))}
        <ColorSection />
        <ClosingSection />
      </main>
    </>
  );
}
