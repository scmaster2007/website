// Philosopher's Stone — a scroll-driven descent at the foot of the page.
// Scroll progress (0..1 through a tall sticky section) drives a zoom into
// the emblem's central circle, a fade to dark, and the reveal of the stone
// with the Tree of Life (as a neural network) shimmering inside it.

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
  // re-renders during scroll (its shimmer is pure CSS).
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

  // The squared-circle emblem (circle > triangle > square > circle).
  // Uses currentColor so the wrapper can tint it without re-rendering.
  const StoneEmblem = React.memo(function StoneEmblem() {
    return (
      <svg viewBox="0 0 400 400" width="100%" height="100%"
           style={{ display: 'block', overflow: 'visible' }}>
        <g fill="none" stroke="currentColor" strokeWidth="2.2"
           strokeLinejoin="round">
          <circle cx="200" cy="200" r="190" />
          <polygon points="200,10 364.5,295 35.5,295" />
          <rect x="133" y="133" width="134" height="134" />
          <circle cx="200" cy="200" r="67" />
        </g>
        <circle cx="200" cy="200" r="2.6" fill="currentColor" />
      </svg>
    );
  });

  // The stone itself: a translucent gold/red gem with the Tree inside.
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

  const FinalQuote = React.memo(function FinalQuote() {
    return (
      <div style={{
        textAlign: 'center',
        color: '#e8dabe',
        fontStyle: 'italic',
        fontSize: '1.2em',
        letterSpacing: '0.015em',
        textShadow: '0 0 20px rgba(230,150,70,0.45)',
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
      stroke: #e7a85a; stroke-width: 1.6; stroke-linecap: round;
      stroke-dasharray: 4 7;
      animation: tol-flow 1.9s linear infinite;
    }
    .tol-core {
      fill: #ffe7ad;
      filter: drop-shadow(0 0 3px rgba(255,205,120,.95));
      animation: tol-corepulse 3.1s ease-in-out infinite;
    }
    .tol-halo {
      fill: #f6b860;
      filter: blur(3px);
      animation: tol-halopulse 3.1s ease-in-out infinite;
    }
    .stone-breathe { animation: stone-breathe 5.2s ease-in-out infinite; }
    .stone-sweep { animation: stone-sweep 4.8s ease-in-out infinite; }
  `;

  const PhilosophersStone = () => {
    const sectionRef = React.useRef(null);
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
      const onScroll = function () {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          const el = sectionRef.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const travel = rect.height - window.innerHeight;
          setProgress(travel > 0 ? clamp(-rect.top / travel, 0, 1) : 0);
        });
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      return function () {
        cancelAnimationFrame(raf);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      };
    }, [reduced]);

    // Reduced motion: a calm, static stacked version — no scroll-jacking.
    if (reduced) {
      return (
        <section style={{
          background: '#070605', color: '#e8dabe',
          padding: '90px 22px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 44,
        }}>
          <style>{KEYFRAMES}</style>
          <div style={{ width: '40vmin', maxWidth: 200, color: '#d4af5a', opacity: 0.55 }}>
            <StoneEmblem />
          </div>
          <StoneGem />
          <FinalQuote />
        </section>
      );
    }

    // 0–0.20: the emblem just sits there (hold).
    // 0.20–0.62: it zooms, eased so the onset is gentle rather than abrupt.
    const emblemScale = lerp(1, 12, easeIn(track(progress, 0.20, 0.62)));
    const emblemOpacity = 1 - track(progress, 0.48, 0.66);
    const emblemColor = lerpColor([20, 19, 22], [212, 175, 90], track(progress, 0.20, 0.50));
    const bg = lerpColor(CREAM, VOID, track(progress, 0.24, 0.58));
    const vignette = track(progress, 0.40, 0.66);
    // Stone fades/grows in while the emblem is still fading out, so the
    // golden centre dot cross-fades straight into the stone — no empty gap.
    const stoneOpacity = track(progress, 0.46, 0.74);
    const stoneScale = lerp(0.4, 1, easeOut(track(progress, 0.46, 0.88)));
    const quoteOpacity = track(progress, 0.86, 1);
    const quoteShift = mapRange(progress, 0.86, 1, 18, 0);

    return (
      <section ref={sectionRef} style={{
        position: 'relative', height: '1000vh', background: '#070605',
      }}>
        <style>{KEYFRAMES}</style>
        <div style={{
          position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
          background: bg,
        }}>
          {/* zooming emblem */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            width: '76vmin', height: '76vmin',
            color: emblemColor,
            opacity: emblemOpacity,
            transform: 'translate(-50%, -50%) scale(' + emblemScale + ')',
            willChange: 'transform, opacity',
            pointerEvents: 'none',
          }}>
            <StoneEmblem />
          </div>

          {/* vignette deepens as we go inside */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at 50% 48%, transparent 36%, rgba(0,0,0,0.85) 100%)',
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

          {/* the stone + tree + final quote */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            opacity: stoneOpacity,
            transform: 'translate(-50%, -50%) scale(' + stoneScale + ')',
            willChange: 'transform, opacity',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <StoneGem />
            <div style={{
              marginTop: 40,
              opacity: quoteOpacity,
              transform: 'translateY(' + quoteShift + 'px)',
            }}>
              <FinalQuote />
            </div>
          </div>
        </div>
      </section>
    );
  };

  window.PhilosophersStone = PhilosophersStone;
})();
