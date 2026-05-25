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

// About
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

// Now
const Now = ({ accent, ink }) => {
  return <window.EditableList items={window.CONTENT.now} />;
};

// Research
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
        Names marked with * are my name!. 
      </div>
    </div>
  );
};

// Funfacts
const FunFacts = ({ accent, ink }) => {
  return <window.EditableList items={window.CONTENT.funFacts} />;
};

// Blog
const LockIcon = ({ ink }) => (
  <svg
    width="10"
    height="12"
    viewBox="0 0 10 12"
    xmlns="http://www.w3.org/2000/svg"
    style={{ verticalAlign: '-1px', color: ink + 'aa' }}
    aria-label="password protected"
  >
    <path
      d="M 3 5 V 3.5 a 2 2 0 0 1 4 0 V 5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <rect x="1.5" y="5" width="7" height="6" rx="0.5" fill="currentColor" />
  </svg>
);

const Blog = ({ accent, ink }) => {
  const items = window.CONTENT.blog || [];

  if (items.length === 0) {
    return (
      <div style={{ fontSize: '0.92em', color: ink + 'a0' }}>No posts yet.</div>
    );
  }

  return (
    <ul style={{
      margin: 0,
      paddingLeft: '1.1em',
    }}>
      {items.map((post, i) => {
        const isLocked = !!post.locked;
        const titleNode = <em><window.Editable value={post.title} /></em>;
        const href = post.slug
          ? 'post.html?slug=' + encodeURIComponent(post.slug) + (isLocked ? '&locked=1' : '')
          : null;

        const linked = href ? (
          <a
            href={href}
            style={{
              color: accent,
              textDecoration: 'underline',
              textDecorationThickness: '0.5px',
              textUnderlineOffset: '2px',
            }}
          >
            {titleNode}
          </a>
        ) : titleNode;

        const prefix = isLocked ? (
          <span
            title="Password protected"
            style={{
              marginRight: 8,
              display: 'inline-flex',
              alignItems: 'center',
              minWidth: 90,
            }}
          >
            <LockIcon ink={ink} />
          </span>
        ) : (
          <span style={{
            color: ink + '88',
            marginRight: 8,
            fontVariantNumeric: 'tabular-nums',
            fontSize: '0.9em',
            minWidth: 90,
            display: 'inline-block',
          }}>
            <window.Editable value={post.date} />
          </span>
        );

        return (
          <li key={i} style={{ marginBottom: '0.55em', lineHeight: 1.45 }}>
            {prefix}
            {linked}
          </li>
        );
      })}
    </ul>
  );
};


// Contact
const Contact = ({ accent, ink }) => {
  const C = window.CONTENT;
  const address = C.address;

  const linkStyle = {
    color: accent,
    textDecoration: 'underline',
    textDecorationThickness: '0.5px',
    textUnderlineOffset: '2px',
  };

  return (
    <div style={{ textAlign: 'center', fontSize: '0.92em', lineHeight: 1.5 }}>
      {address.map((l, i) => (
        <div key={i}>
          <window.Editable value={l} />
        </div>
      ))}
      <div style={{ height: 10 }}/>
      {C.phone && <div><window.Editable value={C.phone} /></div>}
      {C.email && (
        <div><window.Editable value={C.email} style={linkStyle} /></div>
      )}
      {C.emailAlt && (
        <div style={{ fontSize: '0.85em', color: ink + '88' }}>
          <window.Editable value={C.emailAlt} style={linkStyle} />
        </div>
      )}
      {C.cv && (
        <div style={{ marginTop: 8, fontStyle: 'italic' }}>
          <a
            href={C.cv}
            target="_blank"
            rel="noreferrer"
            style={linkStyle}
          >
            CV
          </a>
        </div>
      )}
    </div>
  );
};

// Identity
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

// Quote
const Quote = ({ accent, ink }) => {
  const q = window.CONTENT.quote;
  if (!q || (!q.text && !q.author && !q.imageLeft && !q.imageRight)) return null;

  const imgStyle = {
    width: 140,
    height: 140,
    objectFit: 'cover',
    flex: '0 0 auto',
    opacity: 0.92,
  };

  return (
    <div style={{
      maxWidth: 1000,
      margin: '40px auto 0',
      padding: '28px 16px 8px',
      borderTop: `1px solid ${ink}25`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 28,
    }}>
      {q.imageLeft && (
        <img className="quote-flank" src={q.imageLeft} alt="" style={imgStyle} />
      )}

      <div style={{
        flex: '0 1 560px',
        minWidth: 240,
        textAlign: 'center',
      }}>
        {q.text && (
          <div style={{
            fontStyle: 'italic',
            fontSize: '1.05em',
            lineHeight: 1.6,
            marginBottom: 10,
          }}>
            “<window.Editable value={q.text} />”
          </div>
        )}
        {q.author && (
          <div style={{
            fontSize: '0.9em',
            color: ink + '99',
          }}>
            — <window.Editable value={q.author} />
          </div>
        )}
      </div>

      {q.imageRight && (
        <img className="quote-flank" src={q.imageRight} alt="" style={imgStyle} />
      )}
    </div>
  );
};

Object.assign(window, { About, Now, Research, FunFacts, Blog, Quote, Contact, Identity, A });
