// Tweaks panel — bottom-right floating card.

const FONT_OPTIONS = [
  { id: 'source-serif', label: 'Source Serif 4', stack: '"Source Serif 4", "Source Serif Pro", Georgia, serif' },
  { id: 'eb-garamond',  label: 'EB Garamond',    stack: '"EB Garamond", Garamond, Georgia, serif' },
  { id: 'crimson',      label: 'Crimson Pro',    stack: '"Crimson Pro", "Crimson Text", Georgia, serif' },
  { id: 'newsreader',   label: 'Newsreader',     stack: '"Newsreader", Georgia, serif' },
  { id: 'jet-mono',     label: 'JetBrains Mono', stack: '"JetBrains Mono", ui-monospace, monospace' },
];

const PAPER_OPTIONS = [
  { id: 'white',  label: 'pure white',  paper: '#ffffff', ink: '#0e0e10' },
  { id: 'bone',   label: 'bone',        paper: '#fdfcf8', ink: '#1a1814' },
  { id: 'cream',  label: 'cream',       paper: '#f7f3ea', ink: '#1c1814' },
  { id: 'cool',   label: 'cool grey',   paper: '#f4f5f7', ink: '#101218' },
  { id: 'dark',   label: 'dark',        paper: '#0e0e10', ink: '#e8e6df' },
];

const ACCENT_OPTIONS = [
  { id: 'classic-blue', label: 'classic blue',   value: 'oklch(0.45 0.18 255)' },
  { id: 'ink-blue',     label: 'ink blue',       value: 'oklch(0.38 0.13 250)' },
  { id: 'oxblood',      label: 'oxblood',        value: 'oklch(0.42 0.15 25)' },
  { id: 'forest',       label: 'forest',         value: 'oklch(0.42 0.10 145)' },
  { id: 'plum',         label: 'plum',           value: 'oklch(0.42 0.13 320)' },
  { id: 'ink',          label: 'ink (no color)', value: 'currentColor' },
];

const BOX_OPTIONS = [
  { id: 'framed',     label: 'framed' },
  { id: 'underlined', label: 'underlined' },
  { id: 'card',       label: 'card' },
  { id: 'mono',       label: 'mono' },
];

const COLUMN_OPTIONS = [
  { id: 1, label: '1' },
  { id: 2, label: '2' },
  { id: 3, label: '3' },
];

const Tweaks = ({ visible, state, setState }) => {
  if (!visible) return null;

  const Row = ({ label, children }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#888',
        marginBottom: 4,
      }}>{label}</div>
      {children}
    </div>
  );

  const ChipRow = ({ options, value, onChange, render }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {options.map(o => {
        const sel = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={sel}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              padding: '4px 8px',
              border: `1px solid ${sel ? '#000' : '#ccc'}`,
              background: sel ? '#000' : '#fff',
              color: sel ? '#fff' : '#333',
              cursor: 'pointer',
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {render && render(o)}
            {o.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      bottom: 16,
      right: 16,
      left: 16,
      width: 'min(280px, calc(100vw - 32px))',
      maxHeight: 'calc(100vh - 32px)',
      overflowY: 'auto',
      background: '#fff',
      border: '1px solid #000',
      padding: '14px 14px 12px',
      zIndex: 1000,
      fontFamily: '"Source Serif 4", Georgia, serif',
      boxShadow: '0 12px 40px -12px #00000040',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottom: '1px solid #000',
      }}>
        <div style={{ fontStyle: 'italic' }}>— Tweaks —</div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9,
          color: '#888',
        }}>v1</div>
      </div>

      <Row label="paper">
        <ChipRow
          options={PAPER_OPTIONS}
          value={state.paperId}
          onChange={id => setState({ paperId: id })}
          render={o => <span style={{ width: 10, height: 10, background: o.paper, border: '1px solid #999', display: 'inline-block' }}/>}
        />
      </Row>

      <Row label="accent">
        <ChipRow
          options={ACCENT_OPTIONS}
          value={state.accentId}
          onChange={id => setState({ accentId: id })}
          render={o => <span style={{ width: 10, height: 10, background: o.value === 'currentColor' ? '#000' : o.value, display: 'inline-block' }}/>}
        />
      </Row>

      <Row label="font">
        <ChipRow
          options={FONT_OPTIONS}
          value={state.fontId}
          onChange={id => setState({ fontId: id })}
        />
      </Row>

      <Row label="density">
        <input
          type="range"
          min={13} max={19} step={0.5}
          value={state.fontSize}
          onChange={e => setState({ fontSize: parseFloat(e.target.value) })}
          style={{ width: '100%' }}
        />
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#888' }}>
          {state.fontSize}px base
        </div>
      </Row>

      <Row label="columns">
        <ChipRow
          options={COLUMN_OPTIONS}
          value={state.columns}
          onChange={id => setState({ columns: id })}
        />
      </Row>

      <Row label="box style">
        <ChipRow
          options={BOX_OPTIONS}
          value={state.boxStyle}
          onChange={id => setState({ boxStyle: id })}
        />
      </Row>

      <div style={{
        marginTop: 12,
        paddingTop: 10,
        borderTop: '1px dashed #ccc',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9,
        color: '#999',
        lineHeight: 1.5,
      }}>
        Click any section header to collapse it.
        Toggle Tweaks off in toolbar to hide this panel.
      </div>
    </div>
  );
};

window.Tweaks = Tweaks;
window.FONT_OPTIONS = FONT_OPTIONS;
window.PAPER_OPTIONS = PAPER_OPTIONS;
window.ACCENT_OPTIONS = ACCENT_OPTIONS;
window.BOX_OPTIONS = BOX_OPTIONS;
