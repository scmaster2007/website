//Boxstyle

const SectionHeader = ({ title, boxStyle, accent, ink, mono, collapsed, onToggle, collapsible }) => {
  const handleClick = collapsible ? onToggle : undefined;
  const cursor = collapsible ? 'pointer' : 'default';
  const interactiveProps = collapsible ? {
    role: 'button',
    tabIndex: 0,
    'aria-expanded': !collapsed,
    onKeyDown: (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onToggle();
      }
    },
  } : {};

  if (boxStyle === 'mono') {
    return (
      <div
        onClick={handleClick}
        {...interactiveProps}
        style={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: '0.78em',
          letterSpacing: '0.05em',
          textAlign: 'left',
          padding: '0 0 0.6em 0',
          color: ink,
          cursor,
          userSelect: 'none',
        }}
      >
        <span style={{ color: accent }}>{'>>'}</span>{' '}
        {title.toLowerCase().replace(/\s+/g, '_')}
        {collapsible && (
          <span style={{ float: 'right', opacity: 0.5 }}>
            [{collapsed ? '+' : '-'}]
          </span>
        )}
      </div>
    );
  }

  if (boxStyle === 'underlined') {
    return (
      <div
        onClick={handleClick}
        {...interactiveProps}
        style={{
          fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit',
          fontStyle: 'italic',
          fontSize: '1em',
          textAlign: 'left',
          paddingBottom: '0.35em',
          marginBottom: '0.9em',
          borderBottom: `1px solid ${ink}`,
          color: ink,
          cursor,
          userSelect: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <span>{title}</span>
        {collapsible && (
          <span style={{ fontStyle: 'normal', opacity: 0.4, fontSize: '0.85em' }}>
            {collapsed ? '＋' : '－'}
          </span>
        )}
      </div>
    );
  }

  // framed + card share the em-dash header
  return (
    <div
      onClick={handleClick}
      {...interactiveProps}
      style={{
        textAlign: 'center',
        fontStyle: 'italic',
        fontSize: '0.95em',
        marginBottom: '0.9em',
        color: ink,
        cursor,
        userSelect: 'none',
        position: 'relative',
      }}
    >
      — {title} —
      {collapsible && (
        <span style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          fontStyle: 'normal',
          opacity: 0.4,
          fontSize: '0.85em',
        }}>
          {collapsed ? '＋' : '－'}
        </span>
      )}
    </div>
  );
};

const Section = ({ title, children, boxStyle, accent, ink, paper, collapsible = true, grow = false, scroll = false, footer = null }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const contentRef = React.useRef(null);
  const [contentHeight, setContentHeight] = React.useState(0);

  React.useEffect(() => {
    const node = contentRef.current;
    if (!node) return undefined;

    const measure = () => setContentHeight(node.scrollHeight);
    measure();

    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(measure);
      observer.observe(node);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  let wrap = {
    padding: '14px 18px 16px',
    marginBottom: 12,
    background: paper,
  };

  if (boxStyle === 'framed') {
    wrap.border = `1px solid ${ink}`;
  } else if (boxStyle === 'card') {
    wrap.border = `1px solid ${ink}15`;
    wrap.boxShadow = `0 1px 0 ${ink}10, 0 8px 24px -16px ${ink}40`;
    wrap.borderRadius = 2;
    wrap.background = '#ffffff';
  } else if (boxStyle === 'underlined') {
    wrap.padding = '0 0 18px 0';
    wrap.borderBottom = `1px dashed ${ink}30`;
    wrap.background = 'transparent';
  } else if (boxStyle === 'mono') {
    wrap.border = `1px solid ${ink}40`;
    wrap.padding = '10px 14px 12px';
    wrap.background = 'transparent';
  }

  // `grow`: stretch this box to fill remaining vertical space in a flex column.
  if (grow) {
    // Two flavors:
    //   grow         → fill remaining column space, contributing the section's
    //                  content size to the column's intrinsic height (Contact, Now).
    //   grow + scroll → fill remaining column space, but DON'T contribute content
    //                   size (Blog) — so the column can stay short and the
    //                   internal list scrolls when posts overflow.
    if (scroll) {
      wrap.flex = '1 1 0';        // basis 0 — section's content doesn't bloat the column
      wrap.overflow = 'hidden';   // clip; the inner div handles the scroll
    } else {
      wrap.flex = '1 1 auto';     // basis auto — content sizes the section naturally
    }
    wrap.display = 'flex';
    wrap.flexDirection = 'column';
    wrap.marginBottom = 0;
    wrap.minHeight = 0;

    return (
      <div style={wrap}>
        <SectionHeader
          title={title}
          boxStyle={boxStyle}
          accent={accent}
          ink={ink}
          mono={boxStyle === 'mono'}
          collapsible={false}
        />
        <div style={{
          flex: 1,
          minHeight: 0,
          overflowY: scroll ? 'auto' : 'visible',
        }}>
          {children}
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div style={wrap}>
      <SectionHeader
        title={title}
        boxStyle={boxStyle}
        accent={accent}
        ink={ink}
        mono={boxStyle === 'mono'}
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        collapsible={collapsible}
      />
      <div
        style={{
          maxHeight: collapsible ? (collapsed ? 0 : Math.max(contentHeight, 1)) : 'none',
          overflow: 'hidden',
          transition: 'max-height 320ms ease',
        }}
        aria-hidden={collapsible ? collapsed : undefined}
      >
        <div ref={contentRef}>{children}</div>
      </div>
      {footer}
    </div>
  );
};

window.Section = Section;
