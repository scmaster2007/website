// Neural network portrait — animated MLP with weights lighting up on activation.
// A small fully-connected net (4 layers). Input "spikes" propagate forward,
// activating neurons and lighting up their outgoing weights briefly.

const Portrait = ({ accent, paper, ink }) => {
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(0);
  const timeoutRef = React.useRef(0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    // ---- Network topology ----
    const layerSizes = [5, 8, 8, 6, 3];
    const layerOffsets = [];
    let totalEdges = 0;
    for (let l = 0; l < layerSizes.length - 1; l++) {
      layerOffsets.push(totalEdges);
      totalEdges += layerSizes[l] * layerSizes[l + 1];
    }

    const edgeWeights = Array.from({ length: totalEdges }, () => Math.random() * 2 - 1);
    let layers = []; // each: array of {x, y, act}
    let edges = []; // {from, to, fire}

    const buildGeometry = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      const W = canvas.width, H = canvas.height;
      const padX = W * 0.10;
      const padY = H * 0.08;

      layers = [];
      for (let l = 0; l < layerSizes.length; l++) {
        const n = layerSizes[l];
        const x = padX + (W - 2 * padX) * (l / (layerSizes.length - 1));
        const col = [];
        for (let i = 0; i < n; i++) {
          const y = n === 1 ? H / 2 : padY + (H - 2 * padY) * (i / (n - 1));
          col.push({ x, y, act: 0 });
        }
        layers.push(col);
      }

      edges = [];
      for (let l = 0; l < layers.length - 1; l++) {
        const outN = layerSizes[l + 1];
        const weightOffset = layerOffsets[l];
        for (let i = 0; i < layers[l].length; i++) {
          for (let j = 0; j < layers[l + 1].length; j++) {
            edges.push({
              from: layers[l][i],
              to: layers[l + 1][j],
              fire: 0,
            });
          }
        }
      }
    };

    buildGeometry();
    const onResize = () => buildGeometry();
    const container = canvas.parentElement;
    const resizeObserver = typeof ResizeObserver === 'function' && container
      ? new ResizeObserver(buildGeometry)
      : null;
    resizeObserver?.observe(container);
    window.addEventListener('resize', onResize);

    // ---- Forward-pass scheduling ----
    // A "wave" is a forward propagation. We schedule a new one every ~1.6s.
    // For each wave we precompute the firing pattern (which neurons activate at each layer).
    let waves = []; // each: {start, pattern: [activations per layer], hop}

    const scheduleWave = (now) => {
      // Random sparse activation in input layer.
      const pattern = layerSizes.map(n => new Array(n).fill(0));
      const inN = layerSizes[0];
      const numActive = 1 + Math.floor(Math.random() * Math.min(3, inN - 1));
      const idxs = new Set();
      while (idxs.size < numActive) idxs.add(Math.floor(Math.random() * inN));
      for (const i of idxs) pattern[0][i] = 0.7 + Math.random() * 0.3;

      // Forward propagate (toy): activation = tanh(sum(w * a))
      for (let l = 0; l < layers.length - 1; l++) {
        const inLayer = pattern[l];
        const outN = layerSizes[l + 1];
        const out = new Array(outN).fill(0);
        const weightOffset = layerOffsets[l];
        for (let i = 0; i < layerSizes[l]; i++) {
          for (let j = 0; j < outN; j++) {
            out[j] += inLayer[i] * edgeWeights[weightOffset + i * outN + j];
          }
        }
        // tanh + ReLU-ish gating
        for (let j = 0; j < outN; j++) {
          const a = Math.tanh(out[j]);
          out[j] = a > 0.15 ? Math.min(1, a) : 0;
        }
        pattern[l + 1] = out;
      }

      return {
        start: now,
        pattern,
        // duration of one layer-to-layer hop
        hop: hopDuration, // ms
      };
    };

    const hopDuration = prefersReducedMotion ? 360 : 280;
    let lastSpawn = 0;
    let nextSpawnDelay = prefersReducedMotion ? 2600 : 1500 + Math.random() * 800;
    const totalDuration = layerSizes.length * hopDuration + 600;

    const scheduleNextFrame = () => {
      if (prefersReducedMotion) {
        timeoutRef.current = window.setTimeout(() => {
          rafRef.current = requestAnimationFrame(draw);
        }, 120);
        return;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const draw = (now) => {
      if (!layers.length || !edges.length) {
        scheduleNextFrame();
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = canvas.width, H = canvas.height;
      // paper background, fully opaque (no trails)
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, W, H);

      // spawn waves
      if (now - lastSpawn > nextSpawnDelay) {
        waves.push(scheduleWave(now));
        lastSpawn = now;
        nextSpawnDelay = prefersReducedMotion ? 2600 : 1500 + Math.random() * 800;
      }
      // cull old waves
      waves = waves.filter(w => now - w.start < totalDuration);

      // reset transient activations for this frame
      for (const col of layers) for (const n of col) n.act *= 0.92; // gentle decay
      for (const e of edges) e.fire *= 0.88;

      // apply waves
      for (const wave of waves) {
        const elapsed = now - wave.start;
        const layerIdx = elapsed / wave.hop; // float
        // For each layer, fade in activations centered around when wave reaches it
        for (let l = 0; l < layers.length; l++) {
          const dist = layerIdx - l;
          // bell window: peaks at dist=0.2, fades 0..1.5
          const intensity =
            dist < -0.2 ? 0 :
            dist > 1.6 ? 0 :
            Math.max(0, 1 - Math.abs(dist - 0.3) * 1.4);
          if (intensity <= 0) continue;
          for (let i = 0; i < layers[l].length; i++) {
            const targetAct = wave.pattern[l][i] * intensity;
            if (targetAct > layers[l][i].act) layers[l][i].act = targetAct;
          }
        }
        // light up edges between layer l and l+1 while wave is between them
        for (let l = 0; l < layers.length - 1; l++) {
          const dist = layerIdx - l;
          if (dist < -0.1 || dist > 1.4) continue;
          // window peaks at dist=0.5 (mid-transit)
          const intensity = Math.max(0, 1 - Math.abs(dist - 0.5) * 1.8);
          if (intensity <= 0) continue;
          const edgeOffset = layerOffsets[l];
          const inN = layerSizes[l], outN = layerSizes[l + 1];
          for (let i = 0; i < inN; i++) {
            const aIn = wave.pattern[l][i];
            if (aIn < 0.05) continue;
            for (let j = 0; j < outN; j++) {
              const aOut = wave.pattern[l + 1][j];
              if (aOut < 0.05) continue;
              const e = edges[edgeOffset + i * outN + j];
              const f = aIn * aOut * intensity;
              if (f > e.fire) e.fire = f;
            }
          }
        }
      }

      // ---- Draw edges ----
      // base (cold) edges first
      ctx.lineWidth = 0.4 * dpr;
      for (const e of edges) {
        if (e.fire > 0.05) continue;
        ctx.strokeStyle = ink + '14';
        ctx.beginPath();
        ctx.moveTo(e.from.x, e.from.y);
        ctx.lineTo(e.to.x, e.to.y);
        ctx.stroke();
      }
      // hot edges
      for (const e of edges) {
        if (e.fire <= 0.05) continue;
        const alpha = Math.min(1, e.fire);
        const hex = Math.round(alpha * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = (0.6 + alpha * 1.6) * dpr;
        ctx.strokeStyle = accent + hex;
        ctx.shadowColor = accent;
        ctx.shadowBlur = 6 * dpr * alpha;
        ctx.beginPath();
        ctx.moveTo(e.from.x, e.from.y);
        ctx.lineTo(e.to.x, e.to.y);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // ---- Draw neurons ----
      for (const col of layers) {
        for (const n of col) {
          const a = Math.min(1, n.act);
          const r = (3.2 + a * 3.2) * dpr;
          // outer halo when active
          if (a > 0.1) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, r * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = accent + Math.round(a * 60).toString(16).padStart(2, '0');
            ctx.fill();
          }
          // body
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          // mix ink (cold) -> accent (hot) by activation
          ctx.fillStyle = a > 0.1 ? accent : paper;
          ctx.fill();
          ctx.lineWidth = 0.8 * dpr;
          ctx.strokeStyle = ink + 'aa';
          ctx.stroke();
        }
      }

      scheduleNextFrame();
    };

    scheduleNextFrame();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(timeoutRef.current);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [accent, paper, ink]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '3 / 4',
      overflow: 'hidden',
      background: paper,
    }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      <div style={{
        position: 'absolute',
        bottom: 6, right: 8,
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: 9,
        color: ink + '99',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
      </div>
    </div>
  );
};

window.Portrait = Portrait;
