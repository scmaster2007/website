// Layout for app

// Styling for buttons in the corner.
const iconBtnStyle = (ink, paper) => ({
  width: 36, height: 36, padding: 0,
  borderRadius: '50%',
  border: `1px solid ${ink}30`,
  background: paper,
  color: ink,
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 0.25s ease, color 0.25s ease, border-color 0.25s ease',
  textDecoration: 'none',
});

const SunIcon = () => (
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
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 21 12.8 A 9 9 0 1 1 11.2 3 a 7 7 0 0 0 9.8 9.8 Z"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.78-.25.78-.55v-2c-3.2.69-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.19-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.73.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const NavButtons = ({ isDark, onToggle, ink, paper, github, twitter }) => (
  <div style={{
    position: 'fixed', top: 14, right: 14, zIndex: 100,
    display: 'flex', gap: 8,
  }}>
    {github && (
      <a href={github} target="_blank" rel="noreferrer"
         aria-label="GitHub" title="GitHub"
         style={iconBtnStyle(ink, paper)}>
        <GithubIcon />
      </a>
    )}
    {twitter && (
      <a href={twitter} target="_blank" rel="noreferrer"
         aria-label="X / Twitter" title="X / Twitter"
         style={iconBtnStyle(ink, paper)}>
        <XIcon />
      </a>
    )}
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'switch to light' : 'switch to dark'}
      style={iconBtnStyle(ink, paper)}>
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  </div>
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
    // Default theme is light for everyone; OS preference is ignored. The
    // user's last toggle (if any) is restored from localStorage.
    let paperId = 'bone';
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') paperId = 'dark';
      else if (saved === 'light') paperId = 'bone';
    } catch (e) {}
    return { ...TWEAK_DEFAULTS, paperId };
  });
  const [viewportWidth, setViewportWidth] = React.useState(() => window.innerWidth);

  const isDark = state.paperId === 'dark';
  const toggleTheme = React.useCallback(() => {
    setState(s => ({ ...s, paperId: s.paperId === 'dark' ? 'bone' : 'dark' }));
  }, []);

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
  // Softer blue in dark mode
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

  const { Section, About, Now, Research, FunFacts, Blog, BlogSeeAll, Quote, Contact, Identity, Portrait, PhilosophersStone } = window;

  // Contact Card
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

  // assemble columns based on count, flex columns.
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
      <Section title="Blog" grow scroll boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}
        footer={<BlogSeeAll accent={accentValue} ink={ink} />}>
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
            <Section title="Blog" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}
              footer={<BlogSeeAll accent={accentValue} ink={ink} />}>
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
        <Section title="Blog" boxStyle={state.boxStyle} accent={accentValue} ink={ink} paper={paper.paper}
          footer={<BlogSeeAll accent={accentValue} ink={ink} />}>
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
      <NavButtons
        isDark={isDark}
        onToggle={toggleTheme}
        ink={ink}
        paper={paper.paper}
        github={window.CONTENT.github}
        twitter={window.CONTENT.twitter}
      />
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
