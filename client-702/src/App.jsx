import { useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  CirclePlus,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetPath, colorways, features, priceBenchmarks } from './data';

gsap.registerPlugin(ScrollTrigger);

const SIBLING_SHOWCASE_URL = 'https://dcsai.fnf.co.kr/server/quick-dashboard/cushlite-302-showcase';

function Navigation({ progress }) {
  return (
    <>
      <div className="scroll-progress" style={{ '--progress': `${progress}%` }} />
      <header className="nav-shell">
        <div className="nav-left">
          <a className="wordmark" href="#top" aria-label="Sergio Tacchini 쇼케이스 처음으로">
            <span className="st-mark" aria-hidden="true">
              <img src={assetPath('sergio-tacchini-mark.svg')} alt="" />
            </span>
            <span>SERGIO TACCHINI</span>
          </a>
          <div className="product-switcher" role="group" aria-label="제품 쇼케이스 전환">
            <span className="switcher-current" aria-current="page">
              <span className="switcher-model">CUSHLITE </span>702
            </span>
            <a className="switcher-link" href={SIBLING_SHOWCASE_URL}>
              <span className="switcher-model">CUSHLITE </span>302
              <ArrowUpRight size={11} strokeWidth={2.5} aria-hidden="true" />
              <span className="visually-hidden">쇼케이스로 이동</span>
            </a>
          </div>
        </div>

        <nav className="desktop-nav" aria-label="제품 탐색">
          <a href="#price">Overview</a>
          <a href="#technology">Review</a>
          <a href="#colors">Colors</a>
        </nav>

        <div className="nav-actions">
          <a className="nav-price" href="#price">₩189,000</a>
        </div>
      </header>
    </>
  );
}

function Hero() {
  const [videoError, setVideoError] = useState(false);

  return (
    <section className="hero" id="top">
      <div className="hero-pin">
        <div className="hero-media" aria-hidden="true">
          {!videoError ? (
            <video
              muted
              playsInline
              preload="auto"
              poster={assetPath('assets/images/hero-poster.jpg')}
              onError={() => setVideoError(true)}
            >
              <source src={assetPath('assets/video/hero-turn.mp4')} type="video/mp4" />
            </video>
          ) : (
            <img src={assetPath('assets/images/IMG_5227-stage.webp')} alt="" />
          )}
          <div className="hero-wash" />
        </div>

        <div className="hero-copy">
          <p className="hero-kicker">NEW ON-COURT TENNIS SHOE</p>
          <h1>
            CUSHLITE <span>702</span>
          </h1>
          <p className="hero-deck">빠른 전환과 긴 랠리 사이, 코트 위 균형을 다시 설계했습니다.</p>
        </div>

        <div className="hero-price-panel" aria-live="polite">
          <span>제안 소비자가</span>
          <strong>₩189,000</strong>
          <p>동급 퍼포먼스 코트화 기준의 편집용 임시 가격</p>
          <a href="#price">
            가격대 비교 <ArrowRight size={17} />
          </a>
        </div>

        <a className="scroll-cue" href="#price">
          <span>SCROLL TO REVIEW</span>
          <ArrowDown size={18} />
        </a>
      </div>
    </section>
  );
}

function PriceSection() {
  return (
    <section className="price-section section-pad" id="price">
      <div className="section-heading price-heading">
        <p className="eyebrow">PRICE × FUNCTION</p>
        <h2>동급 소비자가에서,<br />기능의 우선순위가 갈린다.</h2>
        <p>
          주요 퍼포먼스 테니스화의 국내 참고 소비자가와 기능 성향을 함께 비교했습니다. 각 모델이 민첩성,
          안정성, 쿠셔닝 중 어디에 무게를 두는지 살펴보고 CUSHLITE 702의 균형형 포지션을 정리했습니다.
        </p>
      </div>

      <div className="price-comparison">
        {priceBenchmarks.map((item) => (
          <article className={`price-card ${item.featured ? 'featured' : ''}`} key={item.brand}>
            <div className="price-product-stage">
              <img
                className="price-product-image"
                src={item.image}
                alt={item.imageAlt}
                loading="lazy"
                decoding="async"
              />
              <span className="price-delta">{item.priceDelta}</span>
            </div>
            <div className="price-card-copy">
              <p className="price-brand">{item.brand}</p>
              <h3>{item.model}</h3>
              <div className="price-line">
                <strong>{item.price}</strong>
                <span>{item.segment}</span>
              </div>
              <ul className="price-feature-list">
                {item.functions.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <p className="price-verdict">{item.verdict}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="comparison-readout" aria-label="가격과 기능 비교 요약">
        <div>
          <span>PRICE BAND</span>
          <strong>₩159K—₩189K</strong>
          <p>비교군 상단 가격대는 안정성과 쿠셔닝이 강화된 모델이 형성합니다.</p>
        </div>
        <div>
          <span>CUSHLITE POSITION</span>
          <strong>Balance, not maximum</strong>
          <p>한 기능의 극대화보다 착지 완충, 측면 지지, 일상 활용의 균형을 선택합니다.</p>
        </div>
        <div>
          <span>FOR DAILY MOVERS</span>
          <strong>On-court ↔ Daily</strong>
          <p>코트 퍼포먼스와 매일 반복하는 몸 관리 루틴 사이를 자연스럽게 연결합니다.</p>
        </div>
      </div>
    </section>
  );
}

function TypedAnnotationText({ children }) {
  return Array.from(children).map((character, index) => (
    <span className="annotation-type-character" key={`${character}-${index}`}>
      {character === ' ' ? '\u00a0' : character}
    </span>
  ));
}

function PartAnnotations({ feature }) {
  if (!feature.annotations?.length) return null;

  const toPoints = (annotation, useMobile = false) => {
    const source = useMobile ? annotation.mobile : annotation;
    return [source.anchor, source.elbow, source.labelPosition]
      .map((point) => point.join(','))
      .join(' ');
  };

  return (
    <div className="part-annotations" aria-hidden="true">
      <svg className="part-callout-geometry" viewBox="0 0 100 100" preserveAspectRatio="none">
        {feature.annotations.map((annotation) => (
          <g className="part-callout" key={`${feature.id}-${annotation.code}`}>
            <polyline
              className="part-line annotation-desktop"
              pathLength="1"
              points={toPoints(annotation)}
            />
            <circle
              className="part-anchor annotation-desktop"
              cx={annotation.anchor[0]}
              cy={annotation.anchor[1]}
              r="0.42"
            />
            <polyline
              className="part-line annotation-mobile"
              pathLength="1"
              points={toPoints(annotation, true)}
            />
            <circle
              className="part-anchor annotation-mobile"
              cx={annotation.mobile.anchor[0]}
              cy={annotation.mobile.anchor[1]}
              r="0.6"
            />
          </g>
        ))}
      </svg>

      {feature.annotations.map((annotation) => (
        <div
          className={`part-label align-${annotation.align}`}
          key={`${feature.id}-${annotation.code}-label`}
          style={{
            '--label-x': `${annotation.labelPosition[0]}%`,
            '--label-y': `${annotation.labelPosition[1]}%`,
            '--mobile-label-x': `${annotation.mobile.labelPosition[0]}%`,
            '--mobile-label-y': `${annotation.mobile.labelPosition[1]}%`,
          }}
        >
          <span><TypedAnnotationText>{annotation.code}</TypedAnnotationText></span>
          <strong><TypedAnnotationText>{annotation.label}</TypedAnnotationText></strong>
          <small><TypedAnnotationText>{annotation.detail}</TypedAnnotationText></small>
        </div>
      ))}
    </div>
  );
}

function SceneNavigation({ activeIndex, onNavigate }) {
  const previousFeature = features[activeIndex - 1];
  const nextFeature = features[activeIndex + 1];
  const previousSceneLabel = previousFeature
    ? `이전 장면: ${previousFeature.name}`
    : '이전 장면: 리뷰 소개';
  const navigateOnPointerDown = (event) => {
    event.preventDefault();
    onNavigate(Number(event.currentTarget.dataset.targetIndex));
  };
  const navigateOnKeyboardClick = (event) => {
    if (event.detail !== 0) return;
    onNavigate(Number(event.currentTarget.dataset.targetIndex));
  };

  return (
    <nav className="scene-navigation" aria-label="리뷰 장면 이동">
      <button
        type="button"
        className="scene-navigation-button"
        data-target-index={activeIndex - 1}
        onPointerDown={navigateOnPointerDown}
        onClick={navigateOnKeyboardClick}
        aria-label={previousSceneLabel}
      >
        <ArrowUp size={18} />
      </button>
      <button
        type="button"
        className="scene-navigation-button"
        data-target-index={activeIndex + 1}
        onPointerDown={navigateOnPointerDown}
        onClick={navigateOnKeyboardClick}
        disabled={!nextFeature}
        aria-label={nextFeature ? `다음 장면: ${nextFeature.name}` : '마지막 장면입니다'}
      >
        <ArrowDown size={18} />
      </button>
    </nav>
  );
}

function FeatureStage({ activeIndex, onNavigate }) {
  return (
    <div className="feature-stage" aria-live="polite">
      {features.map((feature, index) => (
        <div
          className={`feature-media ${activeIndex === index ? 'is-active' : ''} tone-${feature.tone} ${feature.mediaType === 'video' ? 'is-video' : ''}`}
          key={feature.id}
          data-feature={feature.id}
          aria-hidden={activeIndex !== index}
        >
          {feature.mediaType === 'video' ? (
            <>
              <video
                muted
                playsInline
                preload="auto"
                poster={feature.poster}
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                  event.currentTarget.nextElementSibling?.classList.add('show-fallback');
                }}
              >
                <source src={feature.media} type="video/mp4" />
              </video>
              <img className="rubber-fallback" src={feature.fallback} alt="" />
            </>
          ) : (
            <img src={feature.media} alt="" />
          )}
          <PartAnnotations feature={feature} />
        </div>
      ))}

      <div className="stage-index">
        <span>{String(activeIndex + 1).padStart(2, '0')}</span>
        <i />
        <span>{String(features.length).padStart(2, '0')}</span>
      </div>
      <p className="stage-name">{features[activeIndex].name}</p>
      <SceneNavigation activeIndex={activeIndex} onNavigate={onNavigate} />
    </div>
  );
}

function DailyMovementCollage() {
  const collageRef = useRef(null);

  const clips = [
    {
      id: 'tennis',
      title: '코트의 템포',
      detail: '사이드 스텝과 빠른 방향 전환',
      video: assetPath('assets/video/702-tennis.mp4'),
      poster: assetPath('assets/images/702-tennis-poster.jpg'),
    },
    {
      id: 'cafe',
      title: '도시의 리셋',
      detail: '운동 뒤에도 이어지는 편안함',
      video: assetPath('assets/video/702-cafe.mp4'),
      poster: assetPath('assets/images/702-cafe-poster.jpg'),
    },
    {
      id: 'resort',
      title: '느린 회복',
      detail: '걷고 쉬는 시간까지 자연스럽게',
      video: assetPath('assets/video/702-resort.mp4'),
      poster: assetPath('assets/images/702-resort-poster.jpg'),
    },
  ];

  useLayoutEffect(() => {
    const collage = collageRef.current;
    if (!collage) return undefined;

    const videos = Array.from(collage.querySelectorAll('video'));
    const cards = Array.from(collage.querySelectorAll('.daily-movement-card'));
    const captions = Array.from(collage.querySelectorAll('.daily-movement-caption'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const playVideos = () => {
      if (reduceMotion) return;
      videos.forEach((video) => {
        video.loop = true;
        video.playbackRate = 1;
        video.play().catch(() => undefined);
      });
    };

    const pauseVideos = () => videos.forEach((video) => video.pause());

    const context = gsap.context(() => {
      const playbackTrigger = ScrollTrigger.create({
        trigger: collage,
        start: 'top 92%',
        end: 'bottom -8%',
        onEnter: playVideos,
        onEnterBack: playVideos,
        onLeave: pauseVideos,
        onLeaveBack: pauseVideos,
      });

      if (reduceMotion) {
        gsap.set([...cards, ...captions], { opacity: 1, clearProps: 'transform,clipPath' });
        return () => playbackTrigger.kill();
      }

      gsap.timeline({
        scrollTrigger: {
          trigger: collage,
          start: 'top 84%',
          toggleActions: 'play none none reverse',
        },
      })
        .fromTo(cards[0],
          { opacity: 0, y: 110, scale: 0.86, rotateZ: -2.4, clipPath: 'inset(18% 8% 12% 8% round 32px)' },
          { opacity: 1, y: 0, scale: 1, rotateZ: 0, clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.08, ease: 'expo.out' },
          0,
        )
        .fromTo(cards[1],
          { opacity: 0, x: 120, y: -34, scale: 0.8, rotateZ: 3.4, clipPath: 'inset(8% 22% 8% 22% round 32px)' },
          { opacity: 1, x: 0, y: 0, scale: 1, rotateZ: 0, clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1, ease: 'power4.out' },
          0.22,
        )
        .fromTo(cards[2],
          { opacity: 0, x: -96, y: 86, scale: 0.84, rotateZ: -3 },
          { opacity: 1, x: 0, y: 0, scale: 1, rotateZ: 0, duration: 0.96, ease: 'back.out(1.16)' },
          0.42,
        )
        .fromTo(captions,
          { opacity: 0, y: 32, clipPath: 'inset(100% 0 0 0)' },
          { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 0.64, stagger: 0.13, ease: 'power3.out' },
          0.76,
        );

      cards.forEach((card, index) => {
        const video = card.querySelector('video');
        gsap.fromTo(video,
          { scale: 1.12, yPercent: index === 1 ? -3 : 3 },
          {
            scale: 1.02,
            yPercent: index === 1 ? 4 : -4,
            ease: 'none',
            scrollTrigger: {
              trigger: collage,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        );
      });

      return () => playbackTrigger.kill();
    }, collage);

    return () => {
      pauseVideos();
      context.revert();
    };
  }, []);

  return (
    <div className="daily-movement-collage" ref={collageRef} aria-label="CUSHLITE 702의 코트와 일상 착화 장면">
      {clips.map((clip) => (
        <article className={`daily-movement-card daily-movement-${clip.id}`} key={clip.id}>
          <video muted playsInline loop preload="metadata" poster={clip.poster}>
            <source src={clip.video} type="video/mp4" />
          </video>
          <div className="daily-movement-shade" />
          <div className="daily-movement-caption">
            <strong>{clip.title}</strong>
            <span>{clip.detail}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function TechnologyStory({ activeIndex, setActiveIndex, onNavigate }) {
  const storyRef = useRef(null);

  useLayoutEffect(() => {
    const videoEventCleanups = [];
    const context = gsap.context(() => {
      const cards = gsap.utils.toArray('.feature-copy');
      cards.forEach((card, index) => {
        const content = card.querySelectorAll('.reveal-item');
        const label = card.querySelector('.feature-name');
        const title = card.querySelector('h3');
        const titleWords = card.querySelectorAll('.title-word');
        const body = card.querySelector('.feature-body');
        const specs = card.querySelector('.feature-specs');
        const specItems = card.querySelectorAll('.feature-specs li');
        const detailButton = card.querySelector('.detail-button');
        const featureMedia = storyRef.current?.querySelector(`.feature-media[data-feature="${features[index].id}"]`);
        const annotationOverlay = featureMedia?.querySelector('.part-annotations');
        const annotationGroups = featureMedia?.querySelectorAll('.part-callout');
        const annotationLines = featureMedia?.querySelectorAll('.part-line');
        const annotationDots = featureMedia?.querySelectorAll('.part-anchor');
        const annotationLabels = featureMedia?.querySelectorAll('.part-label');
        const video = storyRef.current?.querySelectorAll('.feature-media video')[index];
        const persistentReveal = Boolean(features[index].scrollVideo?.revealEnd);
        const keepNextMediaWhileReversing = features[index + 1]?.scrollVideo?.holdUntilEnd === true;
        let introPlaybackActive = false;
        let introCompletionTimer = null;
        const seekVideo = (progress) => {
          if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
          const holdStart = features[index].scrollVideo?.holdStart ?? 0.44;
          const holdFrame = features[index].scrollVideo?.holdFrame ?? 0.5;
          const holdEnd = features[index].scrollVideo?.holdUntilEnd
            ? 1
            : (features[index].scrollVideo?.holdEnd ?? 0.58);
          const endFrame = features[index].scrollVideo?.endFrame ?? 1;
          const alignedProgress = progress < holdStart
            ? (progress / holdStart) * holdFrame
            : progress <= holdEnd
              ? holdFrame
              : holdFrame + ((progress - holdEnd) / (1 - holdEnd)) * (endFrame - holdFrame);
          const targetTime = Math.min(video.duration - 0.04, Math.max(0, alignedProgress * (video.duration - 0.04)));
          if (Math.abs(video.currentTime - targetTime) > 0.015) video.currentTime = targetTime;
        };

        const annotationTimeline = annotationOverlay
          ? gsap.timeline({ paused: true })
          : null;

        if (annotationTimeline) {
          annotationTimeline.set(annotationOverlay, { opacity: 1 }, 0);
          let sequenceCursor = 0.04;

          Array.from(annotationGroups ?? []).forEach((annotationGroup, annotationIndex) => {
            const groupLines = annotationGroup.querySelectorAll('.part-line');
            const groupDots = annotationGroup.querySelectorAll('.part-anchor');
            const annotationLabel = annotationLabels?.[annotationIndex];
            const annotationCharacters = annotationLabel?.querySelectorAll('.annotation-type-character');
            const characterCount = annotationCharacters?.length ?? 0;
            const dotDuration = 0.14;
            const lineDuration = 0.34;
            const labelDuration = 0.06;
            const characterDuration = 0.02;
            const characterStagger = 0.018;

            annotationTimeline
              .fromTo(
                groupDots,
                { opacity: 0, scale: 0 },
                { opacity: 1, scale: 1, duration: dotDuration, ease: 'power2.out' },
                sequenceCursor,
              )
              .fromTo(
                groupLines,
                { strokeDashoffset: 1 },
                { strokeDashoffset: 0, duration: lineDuration, ease: 'power1.inOut' },
                sequenceCursor + dotDuration,
              )
              .fromTo(
                annotationLabel,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: labelDuration, ease: 'none' },
                sequenceCursor + dotDuration + lineDuration,
              )
              .fromTo(
                annotationCharacters,
                { opacity: 0, y: 3 },
                {
                  opacity: 1,
                  y: 0,
                  duration: characterDuration,
                  stagger: characterStagger,
                  ease: 'none',
                },
                sequenceCursor + dotDuration + lineDuration + labelDuration,
              );

            sequenceCursor += dotDuration
              + lineDuration
              + labelDuration
              + Math.max(characterDuration, characterCount * characterStagger)
              + 0.16;
          });
        }

        const resetAnnotations = () => {
          annotationTimeline?.pause(0);
          if (!annotationOverlay) return;
          gsap.set(annotationOverlay, { opacity: 0 });
          gsap.set(annotationDots, { opacity: 0, scale: 0 });
          gsap.set(annotationLines, { strokeDashoffset: 1 });
          gsap.set(annotationLabels, { opacity: 0, y: 0 });
        };

        const revealAnnotations = (instant = false) => {
          if (!annotationTimeline) return;
          if (instant) {
            annotationTimeline.progress(1).pause();
            return;
          }
          gsap.set(annotationOverlay, { opacity: 1 });
          annotationTimeline.pause(0).play();
        };

        const finishIntroPlayback = () => {
          if (!introPlaybackActive) return;
          if (introCompletionTimer) {
            window.clearTimeout(introCompletionTimer);
            introCompletionTimer = null;
          }
          introPlaybackActive = false;
          revealAnnotations();
        };

        const detectIntroPlaybackEnd = () => {
          if (
            !introPlaybackActive
            || !video
            || !Number.isFinite(video.duration)
            || video.duration <= 0
            || video.currentTime < video.duration - 0.06
          ) return;

          finishIntroPlayback();
        };

        if (video) {
          video.addEventListener('ended', finishIntroPlayback);
          video.addEventListener('timeupdate', detectIntroPlaybackEnd);
          videoEventCleanups.push(() => {
            if (introCompletionTimer) window.clearTimeout(introCompletionTimer);
            video.removeEventListener('ended', finishIntroPlayback);
            video.removeEventListener('timeupdate', detectIntroPlaybackEnd);
          });
        }

        const playIntroVideo = () => {
          resetAnnotations();

          if (!video) {
            revealAnnotations();
            return;
          }

          if (introCompletionTimer) {
            window.clearTimeout(introCompletionTimer);
            introCompletionTimer = null;
          }
          introPlaybackActive = true;

          const startPlayback = () => {
            if (!introPlaybackActive) return;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
              video.currentTime = Math.max(0, video.duration - 0.04);
              introPlaybackActive = false;
              revealAnnotations(true);
              return;
            }

            video.currentTime = 0;
            video.play()
              .then(() => {
                const remainingPlaybackMs = Math.max(
                  0,
                  (video.duration - video.currentTime) * 1000,
                );
                introCompletionTimer = window.setTimeout(() => {
                  if (
                    introPlaybackActive
                    && (video.ended || video.currentTime >= video.duration - 0.06)
                  ) finishIntroPlayback();
                }, remainingPlaybackMs + 100);
              })
              .catch(() => {
                introPlaybackActive = false;
                video.currentTime = Math.max(0, video.duration - 0.04);
                window.requestAnimationFrame(() => revealAnnotations());
              });
          };

          if (Number.isFinite(video.duration) && video.duration > 0) {
            startPlayback();
          } else {
            video.addEventListener('loadedmetadata', startPlayback, { once: true });
          }
        };

        resetAnnotations();

        const chapterTrigger = ScrollTrigger.create({
          trigger: card,
          start: 'top 76%',
          end: 'bottom 24%',
          onEnter: (self) => {
            setActiveIndex(index);
            playIntroVideo(self.progress);
          },
          onEnterBack: (self) => {
            if (!keepNextMediaWhileReversing) setActiveIndex(index);
            playIntroVideo(self.progress);
          },
          onLeaveBack: () => setActiveIndex(Math.max(0, index - 1)),
          onUpdate: (self) => {
            if (introPlaybackActive) {
              return;
            }
            seekVideo(self.progress);
          },
        });

        if (video) {
          video.pause();
          const refreshSeek = () => chapterTrigger.update();
          video.addEventListener('loadedmetadata', refreshSeek, { once: true });
        }

        const revealTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            end: features[index].scrollVideo?.revealEnd ?? 'bottom 18%',
            scrub: 0.55,
          },
        });

        if (index === 0) {
          revealTimeline
            .fromTo(label, { opacity: 0, x: -90 }, { opacity: 1, x: 0, duration: 0.2 }, 0)
            .fromTo(title, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.02)
            .fromTo(titleWords, { y: 92, rotateX: -72, transformOrigin: 'center bottom' }, { y: 0, rotateX: 0, stagger: 0.045, duration: 0.25 }, 0.04)
            .fromTo(body, { opacity: 0, x: 70 }, { opacity: 1, x: 0, duration: 0.22 }, 0.19)
            .fromTo(specItems, { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: 0.035, duration: 0.16 }, 0.25)
            .fromTo(detailButton, { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0.33);
        } else if (index === 1) {
          revealTimeline
            .fromTo(label, { opacity: 0, y: -48 }, { opacity: 1, y: 0, duration: 0.18 }, 0)
            .fromTo(title, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.02)
            .fromTo(titleWords, { y: 120, x: (wordIndex) => (wordIndex % 2 ? 36 : -36), rotate: (wordIndex) => (wordIndex % 2 ? 5 : -5) }, { y: 0, x: 0, rotate: 0, stagger: 0.055, duration: 0.27 }, 0.04)
            .fromTo(body, { opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.22 }, 0.19)
            .fromTo([specs, detailButton], { opacity: 0, x: 55 }, { opacity: 1, x: 0, stagger: 0.06, duration: 0.18 }, 0.27);
        } else if (index === 2) {
          revealTimeline
            .fromTo(label, { opacity: 0, scaleX: 0, transformOrigin: 'left center' }, { opacity: 1, scaleX: 1, duration: 0.2 }, 0)
            .fromTo(title, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.02)
            .fromTo(titleWords, { opacity: 0, x: (wordIndex) => [-150, 120, -80, 160][wordIndex % 4], y: (wordIndex) => [70, -95, 110, -60][wordIndex % 4], scale: 0.58, rotate: (wordIndex) => [-8, 6, -4, 9][wordIndex % 4] }, { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, stagger: 0.04, duration: 0.3 }, 0.04)
            .fromTo(body, { opacity: 0, y: 56 }, { opacity: 1, y: 0, duration: 0.2 }, 0.21)
            .fromTo(specItems, { opacity: 0, scale: 0.75 }, { opacity: 1, scale: 1, stagger: 0.045, duration: 0.16 }, 0.27)
            .fromTo(detailButton, { opacity: 0, rotate: -12 }, { opacity: 1, rotate: 0, duration: 0.15 }, 0.35);
        } else if (index === 3) {
          revealTimeline
            .fromTo(label, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.18 }, 0)
            .fromTo(title, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.02)
            .fromTo(titleWords, { x: -130, skewY: 9, opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { x: 0, skewY: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', stagger: 0.05, duration: 0.29 }, 0.04)
            .fromTo(body, { opacity: 0, x: -70 }, { opacity: 1, x: 0, duration: 0.22 }, 0.2)
            .fromTo([specs, detailButton], { opacity: 0, y: -24 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.18 }, 0.28);
        } else if (index === 4) {
          revealTimeline
            .fromTo(label, { opacity: 0, letterSpacing: '0.6em' }, { opacity: 1, letterSpacing: '0.18em', duration: 0.24 }, 0)
            .fromTo(title, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.02)
            .fromTo(titleWords, { y: (wordIndex) => (wordIndex % 2 ? 95 : -95), x: (wordIndex) => (wordIndex % 2 ? -48 : 48), opacity: 0, letterSpacing: '0.08em' }, { y: 0, x: 0, opacity: 1, letterSpacing: '-0.065em', stagger: 0.05, duration: 0.3 }, 0.04)
            .fromTo(body, { opacity: 0, filter: 'blur(12px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.22 }, 0.21)
            .fromTo(specItems, { opacity: 0, x: (itemIndex) => (itemIndex % 2 ? 45 : -45) }, { opacity: 1, x: 0, stagger: 0.04, duration: 0.18 }, 0.28)
            .fromTo(detailButton, { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1, duration: 0.15 }, 0.36);
        } else if (index === 5) {
          revealTimeline
            .fromTo(label, { opacity: 0, x: -64, y: 24 }, { opacity: 1, x: 0, y: 0, duration: 0.2 }, 0)
            .fromTo(title, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.02)
            .fromTo(titleWords, { opacity: 0, y: -76, rotateX: 68, transformOrigin: 'center top' }, { opacity: 1, y: 0, rotateX: 0, stagger: 0.045, duration: 0.28 }, 0.04)
            .fromTo(body, { opacity: 0, x: -48, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.22 }, 0.2)
            .fromTo(specItems, { opacity: 0, y: 28 }, { opacity: 1, y: 0, stagger: 0.045, duration: 0.17 }, 0.27)
            .fromTo(detailButton, { opacity: 0, x: 32 }, { opacity: 1, x: 0, duration: 0.15 }, 0.35);
        } else {
          revealTimeline
            .fromTo(label, { opacity: 0, x: 72, y: -26 }, { opacity: 1, x: 0, y: 0, duration: 0.2 }, 0)
            .fromTo(title, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.02)
            .fromTo(
              titleWords,
              { opacity: 0, x: 96, rotateY: -64, transformOrigin: 'right center' },
              { opacity: 1, x: 0, rotateY: 0, stagger: { each: 0.045, from: 'end' }, duration: 0.28 },
              0.04,
            )
            .fromTo(body, { opacity: 0, x: 52, clipPath: 'inset(0 0 0 100%)' }, { opacity: 1, x: 0, clipPath: 'inset(0 0 0 0%)', duration: 0.22 }, 0.2)
            .fromTo(specItems, { opacity: 0, y: 24, x: 18 }, { opacity: 1, y: 0, x: 0, stagger: { each: 0.045, from: 'end' }, duration: 0.17 }, 0.27)
            .fromTo(detailButton, { opacity: 0, x: -34 }, { opacity: 1, x: 0, duration: 0.15 }, 0.35);
        }

        revealTimeline.to(content, { opacity: 1, duration: 0.32 }, 0.42);
        if (!persistentReveal) {
          revealTimeline.to(content, { opacity: 0, duration: 0.2, stagger: 0.018 }, 0.8);
        }
      });
    }, storyRef);

    return () => {
      videoEventCleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, [setActiveIndex]);

  return (
    <section className="technology" id="technology" ref={storyRef}>
      <div className="technology-header section-pad">
        <p className="eyebrow">DAILY MOVEMENT</p>
        <h2>매일 반복 가능한 몸 관리 루틴을 신는 신발.</h2>
        <p>아침의 가벼운 워킹부터 코트 위 움직임, 운동 뒤 회복의 시간까지. CUSHLITE 702는 한 순간의 퍼포먼스보다 매일 같은 시간에 몸을 움직이는 리듬을 편안하고 안정적으로 이어가도록 설계했습니다.</p>
      </div>

      <DailyMovementCollage />

      <div className="feature-story">
        <div className="feature-stage-column">
          <FeatureStage activeIndex={activeIndex} onNavigate={onNavigate} />
        </div>

        <div className="feature-copy-column">
          {features.map((feature, index) => (
            <article className={`feature-copy motion-variant-${index + 1}`} key={feature.id} data-feature={feature.id}>
              <p className="feature-name reveal-item">{feature.name}</p>
              <h3 className="reveal-item feature-title" aria-label={feature.korean}>
                {feature.korean.split(' ').map((word, wordIndex) => (
                  <span className="title-word" aria-hidden="true" key={`${feature.id}-${wordIndex}`}>
                    {word}
                  </span>
                ))}
              </h3>
              <p className="feature-body reveal-item">{feature.body}</p>
              <ul className="feature-specs reveal-item">
                {feature.specs.map((spec) => (
                  <li key={spec}>
                    <Check size={16} /> {spec}
                  </li>
                ))}
              </ul>
              <button className="detail-button reveal-item" type="button">
                구조 자세히 보기 <CirclePlus size={20} />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ColorSection() {
  return (
    <section className="colors section-pad" id="colors">
      <div className="color-showcase">
        <header className="colors-heading">
          <p className="eyebrow">FOUR COLORWAYS</p>
          <h2>같은 구조,<br />서로 다른 네 가지 온도.</h2>
          <p>
            화이트를 중심으로 아이스 블루, 소프트 라임, 코트 핑크를 더했습니다. 코트웨어부터 매일의
            웰니스 룩까지 자연스럽게 이어지는 컬러 구성입니다.
          </p>
        </header>

        <figure className="color-family">
          <div className="color-family-image">
            <img
              src={assetPath('assets/images/price/court-linea-colors.webp')}
              alt="화이트, 아이스 블루, 소프트 라임, 코트 핑크 네 가지 컬러의 CUSHLITE 702"
              loading="lazy"
              decoding="async"
            />
            <span className="color-family-index">04 / COLOR SYSTEM</span>
          </div>
          <figcaption>
            {colorways.map((color, index) => (
              <div className="color-swatch" key={color.name}>
                <span className="color-swatch-dot" style={{ '--swatch': color.bg }} />
                <span className="color-swatch-code">{String(index + 1).padStart(2, '0')}</span>
                <strong>{color.name}</strong>
              </div>
            ))}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <footer className="closing">
      <div className="footer-bottom">
        <span>SERGIO TACCHINI</span>
        <p>Concept showcase · Prices and specifications are temporary editorial content.</p>
        <span>2027 SS</span>
      </div>
    </footer>
  );
}

export default function App() {
  const appRef = useRef(null);
  const sceneScrollSettleTimer = useRef(null);
  const sceneScrollBehavior = useRef(null);
  const [progress, setProgress] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  const restoreSceneScrollBehavior = () => {
    if (sceneScrollBehavior.current === null) return;
    document.documentElement.style.scrollBehavior = sceneScrollBehavior.current;
    sceneScrollBehavior.current = null;
  };

  const scrollToFeature = (targetIndex) => {
    const isReviewIntro = targetIndex === -1;
    if (targetIndex < -1 || targetIndex >= features.length) return;

    const target = isReviewIntro
      ? document.querySelector('.technology-header')
      : document.querySelector(`.feature-copy[data-feature="${features[targetIndex].id}"]`);
    if (!target) return;

    if (sceneScrollSettleTimer.current) window.clearTimeout(sceneScrollSettleTimer.current);
    restoreSceneScrollBehavior();

    if (!isReviewIntro) setActiveFeature(targetIndex);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const resolveDestination = () => {
      const targetBounds = target.getBoundingClientRect();
      const liveTargetTop = targetBounds.top + window.scrollY;
      const liveMaxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const navigationAnchor = isReviewIntro
        ? 0
        : features[targetIndex].scrollVideo?.navigationAnchor ?? 0.5;
      const desiredScroll = isReviewIntro
        ? liveTargetTop - window.innerHeight * 0.1
        : liveTargetTop + targetBounds.height * navigationAnchor - window.innerHeight / 2;
      return Math.round(Math.max(0, Math.min(liveMaxScroll, desiredScroll)));
    };
    const destination = resolveDestination();
    const start = window.scrollY;
    const distance = destination - start;
    sceneScrollBehavior.current = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';

    const settlePassDelays = [260, 360];
    const completeNavigation = (passIndex = 0) => {
      if (sceneScrollSettleTimer.current) window.clearTimeout(sceneScrollSettleTimer.current);
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo({ top: window.scrollY, behavior: 'auto' });
      ScrollTrigger.update();
      const resolvedDestination = resolveDestination();
      window.scrollTo(0, resolvedDestination);

      if (passIndex < settlePassDelays.length) {
        sceneScrollSettleTimer.current = window.setTimeout(
          () => completeNavigation(passIndex + 1),
          settlePassDelays[passIndex],
        );
        return;
      }

      sceneScrollSettleTimer.current = null;
      ScrollTrigger.update();
      if (!isReviewIntro) setActiveFeature(targetIndex);
      restoreSceneScrollBehavior();
    };

    if (reduceMotion || Math.abs(distance) < 2) {
      completeNavigation(settlePassDelays.length);
      return;
    }

    const duration = Math.min(1100, Math.max(520, Math.abs(distance) * 0.28));
    window.scrollTo({ top: destination, behavior: 'smooth' });
    sceneScrollSettleTimer.current = window.setTimeout(completeNavigation, duration + 160);
  };

  useLayoutEffect(() => () => {
    if (sceneScrollSettleTimer.current) window.clearTimeout(sceneScrollSettleTimer.current);
    restoreSceneScrollBehavior();
  }, []);

  useLayoutEffect(() => {
    const effectCleanups = [];

    const context = gsap.context(() => {
      const heroVideo = appRef.current?.querySelector('.hero-media video');
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let heroPlaybackMode = reduceMotion ? 'scroll' : 'auto';
      let heroTakeoverStartedAt = 0;
      let heroPin;

      const seekHero = (progressValue, smooth = false) => {
        if (!heroVideo || !Number.isFinite(heroVideo.duration) || heroVideo.duration <= 0) return;
        const targetTime = Math.min(
          heroVideo.duration - 0.04,
          Math.max(0, progressValue * (heroVideo.duration - 0.04)),
        );
        if (Math.abs(heroVideo.currentTime - targetTime) <= 0.015) return;

        if (smooth) {
          gsap.to(heroVideo, {
            currentTime: targetTime,
            duration: 0.32,
            ease: 'power2.out',
            overwrite: true,
          });
          return;
        }

        heroVideo.currentTime = targetTime;
      };

      const handHeroToScroll = () => {
        if (!heroVideo || heroPlaybackMode === 'scroll') return;
        heroPlaybackMode = 'scroll';
        heroTakeoverStartedAt = performance.now();
        heroVideo.pause();
        seekHero(heroPin?.progress ?? 0, true);
      };

      heroPin = ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: 'bottom bottom',
        pin: '.hero-pin',
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (heroPlaybackMode === 'auto' && self.progress > 0.001) handHeroToScroll();
          if (heroPlaybackMode !== 'scroll') return;

          const isTakeoverTransition = performance.now() - heroTakeoverStartedAt < 420;
          seekHero(self.progress, isTakeoverTransition);
        },
      });

      if (heroVideo) {
        const beginHeroAutoplay = () => {
          heroPin.update();

          if (reduceMotion || heroPin.progress > 0.001 || window.scrollY > 2) {
            heroPlaybackMode = 'scroll';
            heroVideo.pause();
            seekHero(heroPin.progress);
            return;
          }

          heroVideo.currentTime = 0;
          const playAttempt = heroVideo.play();
          playAttempt?.catch(() => {
            heroPlaybackMode = 'scroll';
            seekHero(heroPin.progress);
          });
        };

        const holdHeroEndFrame = () => {
          if (heroPlaybackMode === 'auto') heroPlaybackMode = 'held';
        };
        const scrollKeys = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']);
        const handleScrollKey = (event) => {
          if (scrollKeys.has(event.key)) handHeroToScroll();
        };

        window.addEventListener('wheel', handHeroToScroll, { passive: true, capture: true });
        window.addEventListener('touchmove', handHeroToScroll, { passive: true, capture: true });
        window.addEventListener('keydown', handleScrollKey, { capture: true });
        heroVideo.addEventListener('ended', holdHeroEndFrame);

        if (heroVideo.readyState >= 2) beginHeroAutoplay();
        else heroVideo.addEventListener('canplay', beginHeroAutoplay, { once: true });

        effectCleanups.push(() => {
          window.removeEventListener('wheel', handHeroToScroll, { capture: true });
          window.removeEventListener('touchmove', handHeroToScroll, { capture: true });
          window.removeEventListener('keydown', handleScrollKey, { capture: true });
          heroVideo.removeEventListener('canplay', beginHeroAutoplay);
          heroVideo.removeEventListener('ended', holdHeroEndFrame);
          heroVideo.pause();
        });
      }

      const heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.45,
        },
      });

      heroTimeline
        .fromTo('.hero-media', { scale: 1.04 }, { scale: 1, duration: 0.35, ease: 'none' }, 0)
        .fromTo('.hero-copy', { yPercent: 0 }, { yPercent: -10, duration: 0.38, ease: 'none' }, 0.18)
        .fromTo(['.hero-kicker', '.hero-deck'], { opacity: 1 }, { opacity: 0, duration: 0.24, ease: 'none' }, 0.18)
        .fromTo('.hero h1', { opacity: 1 }, { opacity: 0.9, duration: 0.3, ease: 'none' }, 0.28)
        .fromTo('.hero-price-panel', { y: 72, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.28, ease: 'none' }, 0.48)
        .fromTo('.scroll-cue', { opacity: 1, y: 0 }, { opacity: 0, y: 18, duration: 0.16, ease: 'none' }, 0);

      const priceCards = gsap.utils.toArray('.price-card, .comparison-readout > div');
      gsap.fromTo(
        priceCards,
        { scale: 0.88, opacity: 0.08, y: 100 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
          trigger: '.price-comparison',
            start: 'top 88%',
            end: 'top 42%',
            scrub: 0.55,
          },
        },
      );

      gsap.utils
        .toArray('.section-heading, .technology-header, .colors-heading')
        .forEach((heading) => {
          gsap.fromTo(
            heading.children,
            { y: 70, opacity: 0.08 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.05,
              ease: 'none',
              scrollTrigger: {
                trigger: heading,
                start: 'top 88%',
                end: 'top 52%',
                scrub: 0.65,
              },
            },
          );
        });

      gsap.utils.toArray('.color-family').forEach((block) => {
        gsap.fromTo(
          block,
          { y: 90, scale: 0.92, opacity: 0.12 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: block,
              start: 'top 92%',
              end: 'top 46%',
              scrub: 0.7,
            },
          },
        );
      });

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => setProgress(self.progress * 100),
      });
    }, appRef);

    return () => {
      effectCleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, []);

  return (
    <main ref={appRef} className="page-shell">
      <Navigation progress={progress} />
      <Hero />
      <PriceSection />
      <TechnologyStory activeIndex={activeFeature} setActiveIndex={setActiveFeature} onNavigate={scrollToFeature} />
      <ColorSection />
      <Closing />
    </main>
  );
}
