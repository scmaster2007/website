// Main app — assembles the layout.

// Small floating toggle in the top-right of the page.
// Shows the icon of the mode it will SWITCH TO (moon when light, sun when dark).
const ThemeToggle = ({ isDark, onToggle, ink, paper }) => (
  <button
    onClick={onToggle}
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    title={isDark ? 'switch to light' : 'switch to dark'}
    style={{
      position: 'fixed',
      top: 14, right: 14, zIndex: 100,
      width: 36, height: 36, padding: 0,
      borderRadius: '50%',
      border: `1px solid ${ink}30`,
      background: paper,
      color: ink,
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.25s ease, color 0.25s ease, border-color 0.25s ease',
    }}
  >
    {isDark ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="12" cy="12" r="4"/>
        <line x1="12" y1="3"  x2="12" y2="6"/>
        <line x1="12" y1="18" x2="12" y2="21"/>
        <line x1="3"  y1="12" x2="6"  y2="12"/>
        <line x1="18" y1="12" x2="21" y2="12"/>
        <line x1="5.6"  y1="5.6"  x2="7.8"  y2="7.8"/>
        <line x1="16.2" y1="16.2" x2="18.4" y2="18.4"/>
        <line x1="5.6"  y1="18.4" x2="7.8"  y2="16.2"/>
        <line x1="16.2" y1="7.8"  x2="18.4" y2="5.6"/>
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 21 12.8 A 9 9 0 1 1 11.2 3 a 7 7 0 0 0 9.8 9.8 Z"/>
      </svg>
    )}
  </button>
);

const App = () => {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "paperId": "bone",
    "accentId": "classic-blue",
    "fontId": "source-serif",
    "fontSize": 15,
    "columns": 3,
    "boxStyle": "framed"
  }/*EDITMODE-END*/;

  const [state, setState] = React.useState(() => {
    // Initial theme: saved preference > OS preference > TWEAK_DEFAULTS
    let paperId = TWEAK_DEFAULTS.paperId;
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') paperId = 'dark';
      else if (saved === 'light') paperId = 'bone';
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) paperId = 'dark';
    } catch (e) {}
    return { ...TWEAK_DEFAULTS, paperId };
  });
  const [viewportWidth, setViewportWidth] = React.useState(() => window.innerWidth);

  const isDark = state.paperId === 'dark';
  const toggleTheme = React.useCallback(() => {
    setState(s => ({ ...s, paperId: s.paperId === 'dark' ? 'bone' : 'dark' }));
  }, []);

  // Keep <html data-theme="..."> and localStorage in sync with the chosen paper.
  React.useEffect(() => {
    const theme = state.paperId === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }, [state.paperId]);

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
  // In dark mode, use a softer blue that reads cleanly on the dark paper.
  // (The configured accent — usually classic-blue — is too dark for dark mode.)
  const accentValue = isDark
    ? '#8ab4f8'
    : (accent.value === 'currentColor' ? ink : accent.value);
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

  const { Section, About, Now, Research, FunFacts, Blog, Quote, Contact, Identity, Portrait, PhilosophersStone } = window;

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

  // assemble columns based on count.
  // Each column is a flex column so the last section can `grow` to fill
  // the remaining height — making all column bottoms line up.
  const colStyle = { display: 'flex', flexDirection: 'column' };

  const portraitCol = (
    <div style={colStyle}>
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
      <Section title="Contact" grow boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
        <Contact accent={accentValue} ink={ink} />
      </Section>
    </div>
  );

  const middleCol = (
    <div style={colStyle}>
      <Section title="Info" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
        <About accent={accentValue} ink={ink} />
      </Section>
      <Section title="Now" grow boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
        <Now accent={accentValue} ink={ink} />
      </Section>
    </div>
  );

  const rightCol = (
    <div style={colStyle}>
      <Section title="Research" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
        <Research accent={accentValue} ink={ink} />
      </Section>
      <Section title="Fun Facts" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
        <FunFacts accent={accentValue} ink={ink} />
      </Section>
      <Section title="Blog" grow boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
        <Blog accent={accentValue} ink={ink} />
      </Section>
    </div>
  );

  // column layouts
  let layout;
  if (effectiveColumns === 3) {
    layout = (
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 20px 60px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(200px, 220px) minmax(0, 1fr) minmax(0, 1.4fr)',
          gap: 18,
          alignItems: 'stretch',
        }}>
          {portraitCol}
          {middleCol}
          {rightCol}
        </div>
        <Quote accent={accentValue} ink={ink} />
      </div>
    );
  } else if (effectiveColumns === 2) {
    layout = (
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '24px 20px 60px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 260px) minmax(0, 1fr)',
          gap: 22,
          alignItems: 'stretch',
        }}>
          {portraitCol}
          <div style={colStyle}>
            <Section title="Info" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
              <About accent={accentValue} ink={ink} />
            </Section>
            <Section title="Research" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
              <Research accent={accentValue} ink={ink} />
            </Section>
            <Section title="Fun Facts" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
              <FunFacts accent={accentValue} ink={ink} />
            </Section>
            <Section title="Blog" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
              <Blog accent={accentValue} ink={ink} />
            </Section>
            <Section title="Now" grow boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
              <Now accent={accentValue} ink={ink} />
            </Section>
          </div>
        </div>
        <Quote accent={accentValue} ink={ink} />
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
        <Section title="Blog" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
          <Blog accent={accentValue} ink={ink} />
        </Section>
        <Section title="Contact" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}>
          <Contact accent={accentValue} ink={ink} />
        </Section>
        <Quote accent={accentValue} ink={ink} />
      </div>
    );
  }

  return (
    <div data-screen-label="Personal Site" style={{ minHeight: '100vh', background: paper.paper, color: ink }}>
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} ink={ink} paper={paper.paper} />
      {layout}
      {PhilosophersStone && <PhilosophersStone paper={paper.paper} ink={ink} isDark={isDark} />}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
