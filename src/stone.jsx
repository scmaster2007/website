// Philosopher's Alchemical Stone in the bottom..
// Hebrew characters / zoom
// Tree of Life from the Kabbalah. Very similar to a NN!

(function () {
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const track = (v, lo, hi) => clamp((v - lo) / (hi - lo), 0, 1);
  const mapRange = (v, lo, hi, outLo, outHi) => lerp(outLo, outHi, track(v, lo, hi));
  const easeIn = (t) => t * t;
  const easeOut = (t) => 1 - (1 - t) * (1 - t);
  const lerpColor = (c1, c2, t) =>
    'rgb(' +
    Math.round(lerp(c1[0], c2[0], t)) + ', ' +
    Math.round(lerp(c1[1], c2[1], t)) + ', ' +
    Math.round(lerp(c1[2], c2[2], t)) + ')';

  const CREAM = [253, 252, 248];
  const VOID = [8, 6, 5];
  const LUM  = [250, 250, 246]; 
  const INK_DARK = [20, 19, 22];
  const EMBLEM_CENTER = 200;
  const EMBLEM_DOT_CY = 215;
  const EMBLEM_SIZE_VMIN = 76;

  const hexToRgb = (h) => {
    if (typeof h !== 'string') return null;
    const m = h.replace('#', '').match(/^([0-9a-f]{6})$/i);
    if (!m) return null;
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };

  // --- Tree of Life: 10 sephirot, 22 connecting paths ---
  const SEPHIROT = [
    [100, 26],   [156, 72],  [44, 72],
    [156, 142],  [44, 142],  [100, 157],
    [156, 212],  [44, 212],  [100, 248],
    [100, 292],
  ];
  const PATHS = [
    [0,1],[0,2],[0,5],
    [1,2],[1,5],[1,3],
    [2,5],[2,4],
    [3,4],[3,5],[3,6],
    [4,5],[4,7],
    [5,6],[5,7],[5,8],
    [6,7],[6,8],[6,9],
    [7,8],[7,9],
    [8,9],
  ];

  // Tree of Life rendered as a small neural network — memoized so it never
  // re-renders during scroll
  const TreeOfLife = React.memo(function TreeOfLife() {
    return (
      <svg viewBox="0 0 200 318" width="100%" height="100%"
           preserveAspectRatio="xMidYMid meet"
           style={{ display: 'block', overflow: 'visible' }}>
        {PATHS.map(function (pair, i) {
          const a = SEPHIROT[pair[0]];
          const b = SEPHIROT[pair[1]];
          return (
            <line key={'e' + i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
                  className="tol-edge"
                  style={{ animationDelay: (i * 0.12) + 's' }} />
          );
        })}
        {SEPHIROT.map(function (p, i) {
          return (
            <circle key={'h' + i} cx={p[0]} cy={p[1]} r="12"
                    className="tol-halo"
                    style={{ animationDelay: (i * 0.2) + 's' }} />
          );
        })}
        {SEPHIROT.map(function (p, i) {
          return (
            <circle key={'c' + i} cx={p[0]} cy={p[1]} r="5.6"
                    className="tol-core"
                    style={{ animationDelay: (i * 0.2) + 's' }} />
          );
        })}
      </svg>
    );
  });

  // The squared-circle
  // Uses currentColor so the wrapper can tint it without re-rendering.
  const StoneEmblem = React.memo(function StoneEmblem() {
    return (
      <svg viewBox="0 0 400 400" width="100%" height="100%"
           style={{ display: 'block', overflow: 'visible' }}>
        <g fill="none" stroke="currentColor" strokeWidth="2.2"
           strokeLinejoin="round">
          <circle cx="200" cy="200" r="190" />
          <polygon points="200,10 364.5,295 35.5,295" />
          {/* inner circle = triangle's incircle (tangent to all 3 triangle sides) */}
          <circle cx="200" cy="215" r="70" />
          {/* small square floating in the center, touching nothing */}
          <rect x="130" y="145" width="140" height="140" />
        </g>
        <circle cx="200" cy={EMBLEM_DOT_CY} r="2.6" fill="currentColor" />
      </svg>
    );
  });

  // The stone itself: a translucent gold/red gem.
  const StoneGem = React.memo(function StoneGem() {
    return (
      <div className="stone-breathe" style={{
        position: 'relative',
        width: '60vmin', maxWidth: 300,
        height: '74vmin', maxHeight: 372,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          clipPath: 'polygon(50% 0%, 100% 26%, 100% 74%, 50% 100%, 0% 74%, 0% 26%)',
          background:
            'radial-gradient(ellipse at 50% 42%, rgba(255,221,150,0.62) 0%, ' +
            'rgba(226,108,58,0.52) 46%, rgba(150,34,32,0.44) 78%, ' +
            'rgba(92,20,22,0.4) 100%)',
          overflow: 'hidden',
        }}>
          {/* facet highlights */}
          <div style={{
            position: 'absolute', inset: 0,
            background:
              'linear-gradient(135deg, rgba(255,240,210,0.22) 0%, transparent 42%), ' +
              'linear-gradient(305deg, rgba(255,205,150,0.16) 0%, transparent 40%)',
          }} />
          {/* shimmer sweep */}
          <div className="stone-sweep" style={{
            position: 'absolute', top: '-40%', left: 0,
            width: '46%', height: '180%',
            background:
              'linear-gradient(90deg, transparent, rgba(255,243,214,0.5), transparent)',
          }} />
          {/* tree of life inside */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%', height: '80%',
          }}>
            <TreeOfLife />
          </div>
        </div>
      </div>
    );
  });

  const FinalQuote = React.memo(function FinalQuote({ isDark }) {
    return (
      <div style={{
        textAlign: 'center',
        color: isDark ? '#3a2418' : '#e8dabe',
        fontStyle: 'italic',
        fontSize: '1.2em',
        letterSpacing: '0.015em',
        textShadow: isDark ? 'none' : '0 0 20px rgba(230,150,70,0.45)',
      }}>
        as above, so below
      </div>
    );
  });

  const KEYFRAMES = `
    @keyframes tol-flow { to { stroke-dashoffset: -24; } }
    @keyframes tol-corepulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
    @keyframes tol-halopulse { 0%,100% { opacity: .1; } 50% { opacity: .42; } }
    @keyframes stone-breathe {
      0%,100% { filter: drop-shadow(0 0 26px rgba(224,134,60,.45))
                        drop-shadow(0 0 64px rgba(176,42,40,.32)); }
      50%     { filter: drop-shadow(0 0 44px rgba(244,176,92,.7))
                        drop-shadow(0 0 112px rgba(202,60,48,.52)); }
    }
    @keyframes stone-sweep {
      0%   { transform: translateX(-170%) rotate(22deg); }
      100% { transform: translateX(250%) rotate(22deg); }
    }
    .tol-edge {
      stroke: #d99249; stroke-width: 1.6; stroke-linecap: round;
      stroke-dasharray: 4 7;
      animation: tol-flow 1.9s linear infinite;
    }
    .tol-core {
      fill: #ffcc7a;
      filter: drop-shadow(0 0 3px rgba(255,170,80,.95));
      animation: tol-corepulse 3.1s ease-in-out infinite;
    }
    .tol-halo {
      fill: #e08a3c;
      filter: blur(3px);
      animation: tol-halopulse 3.1s ease-in-out infinite;
    }
    .stone-breathe { animation: stone-breathe 5.2s ease-in-out infinite; }
    .stone-sweep { animation: stone-sweep 4.8s ease-in-out infinite; }
  `;

  // ----- Matrix-style rain of Hebrew letters -----
  const HEBREW = 'אבגדהוזחטיכלמנסעפצקרשת';

  const HebrewRain = React.memo(function HebrewRain({ isDark }) {
    const canvasRef = React.useRef(null);
    const darkRef = React.useRef(!!isDark);
    React.useEffect(function () { darkRef.current = !!isDark; }, [isDark]);

    React.useEffect(function () {
      const canvas = canvasRef.current;
      if (!canvas) return undefined;
      const ctx = canvas.getContext('2d');
      const fontSize = 18;
      let columns = 0;
      let drops = [];
      let raf = 0;

      function resize() {
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        canvas.width = Math.max(1, Math.floor(w * dpr));
        canvas.height = Math.max(1, Math.floor(h * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        columns = Math.max(1, Math.floor(w / fontSize));
        drops = new Array(columns).fill(0).map(function () {
          return Math.random() * -h;
        });
      }

      function frame() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const dark = darkRef.current;

        ctx.fillStyle = dark ? 'rgba(250, 250, 246, 0.07)' : 'rgba(7, 6, 5, 0.07)';
        ctx.fillRect(0, 0, w, h);

        ctx.font = fontSize + 'px "Source Serif 4", serif';
        ctx.textBaseline = 'top';
        ctx.fillStyle = dark ? 'rgba(120, 60, 18, 0.55)' : 'rgba(220, 184, 110, 0.55)';

        for (let i = 0; i < columns; i++) {
          const ch = HEBREW.charAt(Math.floor(Math.random() * HEBREW.length));
          const x = i * fontSize;
          const y = drops[i];
          ctx.fillText(ch, x, y);

          if (y > h && Math.random() > 0.975) {
            drops[i] = -fontSize;
          }
          drops[i] += fontSize * 0.2; // fall speed (lower = slower)
        }

        raf = requestAnimationFrame(frame);
      }

      resize();
      window.addEventListener('resize', resize);
      frame();

      return function () {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          display: 'block',
        }}
      />
    );
  });

  const PhilosophersStone = ({ paper, ink, isDark }) => {
    const startBg  = hexToRgb(paper) || CREAM;
    const startInk = hexToRgb(ink)   || INK_DARK;
    // "As above, so below" — the descent's destination mirrors the entry.
    const destRGB = isDark ? LUM : VOID;
    const destHex = isDark ? '#fafaf6' : '#070605';
    const vignetteColor = isDark ? 'rgba(250,250,246,0.85)' : 'rgba(0,0,0,0.85)';
    const sectionRef = React.useRef(null);
    const progressRef = React.useRef(0);
    const targetProgressRef = React.useRef(0);
    const [progress, setProgress] = React.useState(0);
    const [reduced, setReduced] = React.useState(false);

    React.useEffect(function () {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const apply = function () { setReduced(mq.matches); };
      apply();
      mq.addEventListener('change', apply);
      return function () { mq.removeEventListener('change', apply); };
    }, []);

    React.useEffect(function () {
      if (reduced) return undefined;
      let raf = 0;
      let initialized = false;

      const measureProgress = function () {
        const el = sectionRef.current;
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        return travel > 0 ? clamp(-rect.top / travel, 0, 1) : 0;
      };

      const step = function () {
        const current = progressRef.current;
        const target = targetProgressRef.current;
        const next = Math.abs(target - current) < 0.0004
          ? target
          : lerp(current, target, 0.18);

        progressRef.current = next;
        setProgress(next);

        if (next !== target) {
          raf = requestAnimationFrame(step);
        } else {
          raf = 0;
        }
      };

      const updateTarget = function () {
        targetProgressRef.current = measureProgress();
        if (!initialized) {
          initialized = true;
          progressRef.current = targetProgressRef.current;
          setProgress(targetProgressRef.current);
          return;
        }
        if (!raf) raf = requestAnimationFrame(step);
      };

      updateTarget();
      window.addEventListener('scroll', updateTarget, { passive: true });
      window.addEventListener('resize', updateTarget);
      return function () {
        cancelAnimationFrame(raf);
        window.removeEventListener('scroll', updateTarget);
        window.removeEventListener('resize', updateTarget);
      };
    }, [reduced]);

    // Reduced motion: a calm, static stacked version — no scroll-jacking.
    if (reduced) {
      return (
        <section style={{
          background: destHex,
          color: isDark ? '#3a2418' : '#e8dabe',
          padding: '90px 22px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 44,
        }}>
          <style>{KEYFRAMES}</style>
          <div style={{ width: '40vmin', maxWidth: 200, color: '#d4af5a', opacity: 0.55 }}>
            <StoneEmblem />
          </div>
          <StoneGem />
          <FinalQuote isDark={isDark} />
        </section>
      );
    }

    // 0–0.20: the emblem just sits there (hold).
    // 0.20–0.62: it zooms, eased so the onset is gentle rather than abrupt.
    const emblemScale = lerp(1, 12, easeIn(track(progress, 0.20, 0.62)));
    const emblemDotOffsetVmin = ((EMBLEM_DOT_CY - EMBLEM_CENTER) / 400) * EMBLEM_SIZE_VMIN;
    // The dot sits lower in the resting emblem; counter that offset during zoom
    // so the enlarged dot still cross-fades into the centered stone.
    const emblemDotCompensation = emblemDotOffsetVmin * emblemScale * easeOut(track(progress, 0.22, 0.48));
    const emblemOpacity = 1 - track(progress, 0.48, 0.66);
    const emblemColor = lerpColor(startInk, [212, 175, 90], track(progress, 0.20, 0.50));
    const bg = lerpColor(startBg, destRGB, track(progress, 0.24, 0.58));
    const vignette = track(progress, 0.40, 0.66);
    // golden centre dot cross-fades straight into the stone — no empty gap.
    const stoneOpacity = track(progress, 0.46, 0.74);
    const stoneScale = lerp(0.4, 1, easeOut(track(progress, 0.46, 0.88)));
    const quoteOpacity = track(progress, 0.86, 1);
    const quoteShift = mapRange(progress, 0.86, 1, 18, 0);

    return (
      <section ref={sectionRef} style={{
        position: 'relative', height: '1000vh', background: destHex,
      }}>
        <style>{KEYFRAMES}</style>
        <div style={{
          position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
          background: bg,
        }}>
          {/* zooming emblem */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            width: EMBLEM_SIZE_VMIN + 'vmin', height: EMBLEM_SIZE_VMIN + 'vmin',
            color: emblemColor,
            opacity: emblemOpacity,
            transform: 'translate(-50%, -50%)',
            willChange: 'opacity',
            pointerEvents: 'none',
          }}>
            <div style={{
              width: '100%', height: '100%',
              transform: 'translateY(-' + emblemDotCompensation + 'vmin)',
              willChange: 'transform',
            }}>
              <div style={{
                width: '100%', height: '100%',
                transform: 'scale(' + emblemScale + ')',
                transformOrigin: 'center center',
                willChange: 'transform',
              }}>
                <StoneEmblem />
              </div>
            </div>
          </div>

          {/* faint rain of ancient hebrew letters. */}
          <div style={{
            position: 'absolute', inset: 0,
            opacity: track(progress, 0.30, 0.55) * 0.55,
            pointerEvents: 'none',
            WebkitMaskImage:
              'radial-gradient(60vmin 75vmin at center, transparent 0%, transparent 68%, black 100%)',
            maskImage:
              'radial-gradient(60vmin 75vmin at center, transparent 0%, transparent 68%, black 100%)',
          }}>
            <HebrewRain isDark={isDark} />
          </div>

          {/* vignette closes inward — matches the destination (void or lum) */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at 50% 48%, transparent 36%, ' + vignetteColor + ' 100%)',
            opacity: vignette,
          }} />

          {/* ambient aura behind the stone */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            width: '50vmin', height: '50vmin',
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(circle, rgba(222,120,52,0.24) 0%, transparent 62%)',
            opacity: stoneOpacity,
            pointerEvents: 'none',
          }} />

          {/* the stone + tree */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            opacity: stoneOpacity,
            transform: 'translate(-50%, -50%) scale(' + stoneScale + ')',
            willChange: 'transform, opacity',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <StoneGem />
          </div>

          {/* final quote */}
          <div style={{
            position: 'absolute', left: '50%',
            top: 'calc(50% + min(37vmin, 186px) + 40px)',
            width: 'min(92vw, 520px)',
            opacity: quoteOpacity,
            transform: 'translate(-50%, ' + quoteShift + 'px)',
            willChange: 'transform, opacity',
            pointerEvents: 'none',
          }}>
            <FinalQuote isDark={isDark} />
          </div>
        </div>
      </section>
    );
  };

  window.PhilosophersStone = PhilosophersStone;
})();
