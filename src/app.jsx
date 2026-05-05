// Main app — assembles the layout.

const App = () => {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "paperId": "bone",
    "accentId": "classic-blue",
    "fontId": "source-serif",
    "fontSize": 15,
    "columns": 3,
    "boxStyle": "framed"
  }/*EDITMODE-END*/;

  const [state] = React.useState(TWEAK_DEFAULTS);
  const [viewportWidth, setViewportWidth] = React.useState(() => window.innerWidth);

  React.useEffect(() => {
    let rafId = 0;
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setViewportWidth(window.innerWidth));
    };

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const paper  = window.PAPER_OPTIONS.find(o => o.id === state.paperId)  || window.PAPER_OPTIONS[0];
  const accent = window.ACCENT_OPTIONS.find(o => o.id === state.accentId) || window.ACCENT_OPTIONS[0];
  const font   = window.FONT_OPTIONS.find(o => o.id === state.fontId)    || window.FONT_OPTIONS[0];

  const ink = paper.ink;
  const accentValue = accent.value === 'currentColor' ? ink : accent.value;
  const effectiveColumns =
    viewportWidth < 760 ? 1 :
    viewportWidth < 1040 ? Math.min(state.columns, 2) :
    state.columns;

  React.useEffect(() => {
    document.body.style.background = paper.paper;
    document.body.style.color = ink;
    document.body.style.fontFamily = font.stack;
    document.body.style.fontSize = state.fontSize + 'px';
  }, [paper.paper, ink, font.stack, state.fontSize]);

  const { Section, About, Now, Research, FunFacts, Contact, Identity, Portrait } = window;

  // identity card (always under portrait)
  const IdentityCard = () => (
    <div style={{
      padding: '14px 14px 16px',
      border: state.boxStyle === 'framed' ? `1px solid ${ink}` :
              state.boxStyle === 'card'   ? `1px solid ${ink}15` :
              state.boxStyle === 'mono'   ? `1px solid ${ink}40` : 'none',
      borderTop: state.boxStyle === 'framed' ? 'none' : undefined,
      background: state.boxStyle === 'card' ? '#fff' : 'transparent',
      boxShadow: state.boxStyle === 'card' ? `0 1px 0 ${ink}10, 0 8px 24px -16px ${ink}40` : 'none',
      marginTop: state.boxStyle === 'underlined' ? 8 : 0,
      marginBottom: 12,
    }}>
      <Identity accent={accentValue} ink={ink} boxStyle={state.boxStyle} />
    </div>
  );

  // assemble columns based on count
  const portraitCol = (
    <div>
      <div style={{
        border: state.boxStyle === 'framed' ? `1px solid ${ink}` :
                state.boxStyle === 'card' ? `1px solid ${ink}15` :
                state.boxStyle === 'mono' ? `1px solid ${ink}40` : 'none',
        borderBottom: state.boxStyle === 'framed' ? 'none' : undefined,
        background: state.boxStyle === 'card' ? '#fff' : 'transparent',
        padding: state.boxStyle === 'underlined' ? 0 : 0,
        boxShadow: state.boxStyle === 'card' ? `0 -8px 24px -16px ${ink}40` : 'none',
      }}>
        <Portrait accent={accentValue} paper={paper.paper} ink={ink} />
      </div>
      <IdentityCard />
      <Section title="Contact" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
        <Contact accent={accentValue} ink={ink} />
      </Section>
      <Section title="Fun Facts" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
        <FunFacts accent={accentValue} ink={ink} />
      </Section>
    </div>
  );

  const middleCol = (
    <div>
      <Section title="Info" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
        <About accent={accentValue} ink={ink} />
      </Section>
      <Section title="Now" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
        <Now accent={accentValue} ink={ink} />
      </Section>
    </div>
  );

  const rightCol = (
    <div>
      <Section title="Research" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
        <Research accent={accentValue} ink={ink} />
      </Section>
    </div>
  );

  // column layouts
  let layout;
  if (effectiveColumns === 3) {
    layout = (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(200px, 220px) minmax(0, 1fr) minmax(0, 1.4fr)',
        gap: 18,
        maxWidth: 1180,
        margin: '0 auto',
        padding: '24px 20px 60px',
      }}>
        {portraitCol}
        {middleCol}
        {rightCol}
      </div>
    );
  } else if (effectiveColumns === 2) {
    layout = (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 260px) minmax(0, 1fr)',
        gap: 22,
        maxWidth: 980,
        margin: '0 auto',
        padding: '24px 20px 60px',
      }}>
        {portraitCol}
        <div>
          <Section title="Info" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
            <About accent={accentValue} ink={ink} />
          </Section>
          <Section title="Research" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
            <Research accent={accentValue} ink={ink} />
          </Section>
          <Section title="Now" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
            <Now accent={accentValue} ink={ink} />
          </Section>
        </div>
      </div>
    );
  } else {
    layout = (
      <div style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: '24px 20px 60px',
      }}>
        <div style={{ maxWidth: 280, margin: '0 auto 12px' }}>
          <Portrait accent={accentValue} paper={paper.paper} ink={ink} />
        </div>
        <div style={{ marginTop: 8, marginBottom: 18 }}>
          <Identity accent={accentValue} ink={ink} boxStyle={state.boxStyle} />
        </div>
        <Section title="Info" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
          <About accent={accentValue} ink={ink} />
        </Section>
        <Section title="Research" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
          <Research accent={accentValue} ink={ink} />
        </Section>
        <Section title="Now" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
          <Now accent={accentValue} ink={ink} />
        </Section>
        <Section title="Fun Facts" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
          <FunFacts accent={accentValue} ink={ink} />
        </Section>
        <Section title="Contact" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
          <Contact accent={accentValue} ink={ink} />
        </Section>
      </div>
    );
  }

  return (
    <div data-screen-label="Personal Site" style={{ minHeight: '100vh', background: paper.paper, color: ink }}>
      {layout}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
