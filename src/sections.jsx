// Section content components.

const isDraftResearch = (item) =>
  /in preparation/i.test(item.venue) || item.links.some(([, href]) => href === '#');

const A = ({ href, children, accent }) => {
  const isPlaceholderLink = href === '#';
  const isExternalLink = /^https?:\/\//i.test(href);

  return (
    <a
      href={isPlaceholderLink ? undefined : href}
      target={isExternalLink ? '_blank' : undefined}
      rel={isExternalLink ? 'noreferrer' : undefined}
      aria-disabled={isPlaceholderLink || undefined}
      style={{
        color: accent,
        textDecoration: 'underline',
        textDecorationThickness: '0.5px',
        textUnderlineOffset: '2px',
        opacity: isPlaceholderLink ? 0.75 : 1,
      }}
      onClick={(event) => {
        if (isPlaceholderLink) event.preventDefault();
      }}
      onMouseEnter={e => { e.currentTarget.style.background = accent + '18'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </a>
  );
};

// ---------- About / Info ----------
const About = ({ accent, ink }) => {
  const paras = window.CONTENT.about;

  return (
    <div>
      {paras.map((p, i) => (
        <div key={i} style={{ marginBottom: '0.7em' }}>
          <window.Editable value={p} multiline as="div" />
        </div>
      ))}
    </div>
  );
};

// ---------- Now ----------
const Now = ({ accent, ink }) => {
  return <window.EditableList items={window.CONTENT.now} />;
};

// ---------- Research ----------
const Research = ({ accent, ink }) => {
  const items = window.CONTENT.research;

  return (
    <div>
      <ul style={{ margin: 0, paddingLeft: '1.1em' }}>
        {items.map((r, i) => (
          <li key={i} style={{ marginBottom: '0.85em', lineHeight: 1.45 }}>
            {isDraftResearch(r) && (
              <span
                title="work in progress"
                style={{
                  display: 'inline-block',
                  width: 7,
                  height: 7,
                  marginRight: 6,
                  background: accent,
                  verticalAlign: 'middle',
                }}
              />
            )}
            <window.Editable value={r.authors} />.{' '}
            <em>
              <window.Editable value={r.title} />
            </em>.{' '}
            <window.Editable value={r.venue} />.{' '}
            {r.links.map(([label, href], j) => (
              <React.Fragment key={j}>
                [<A href={href} accent={accent}>{label}</A>]
                {j < r.links.length - 1 && ' '}
              </React.Fragment>
            ))}
          </li>
        ))}
      </ul>
      <div style={{
        marginTop: 8, fontSize: '0.88em', color: ink + '88',
      }}>
        Note: works in progress marked with <span style={{ display: 'inline-block', width: 8, height: 8, background: accent }}/> are unpublished drafts.
      </div>
    </div>
  );
};

// ---------- Fun Facts ----------
const FunFacts = ({ accent, ink }) => {
  return <window.EditableList items={window.CONTENT.funFacts} />;
};

// ---------- Contact ----------
const Contact = ({ accent, ink }) => {
  const C = window.CONTENT;
  const address = C.address;

  return (
    <div style={{ textAlign: 'center', fontSize: '0.92em', lineHeight: 1.5 }}>
      {address.map((l, i) => (
        <div key={i}>
          <window.Editable value={l} />
        </div>
      ))}
      <div style={{ height: 10 }}/>
      <div><window.Editable value={C.phone} /></div>
      <div><window.Editable value={C.email} style={{ color: accent, textDecoration: 'underline', textDecorationThickness: '0.5px', textUnderlineOffset: '2px' }} /></div>
      <div style={{ fontSize: '0.85em', color: ink + '88' }}>
        <window.Editable value={C.emailAlt} style={{ color: accent, textDecoration: 'underline', textDecorationThickness: '0.5px', textUnderlineOffset: '2px' }} />
      </div>
    </div>
  );
};

// ---------- Identity ----------
const Identity = ({ accent, ink }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontStyle: 'italic', fontSize: '1.05em', marginBottom: 4 }}>
        — <window.Editable value={window.CONTENT.name} /> —
      </div>
      <div style={{ fontSize: '0.88em', color: ink + 'b0' }}>
        <window.Editable value={window.CONTENT.role} />
      </div>
    </div>
  );
};

Object.assign(window, { About, Now, Research, FunFacts, Contact, Identity, A });
