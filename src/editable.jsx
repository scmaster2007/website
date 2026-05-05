// Read-only text primitives kept for consistent rendering across sections.

const identity = (value) => value;

const getStorage = () => {
  try {
    return window.localStorage;
  } catch (error) {
    return null;
  }
};

const useStored = (key, initial, normalize = identity) => {
  const resolveInitial = () => normalize(typeof initial === 'function' ? initial() : initial);

  const [val, setVal] = React.useState(() => {
    const storage = getStorage();
    if (storage) {
      try {
        const stored = storage.getItem(key);
        if (stored !== null) return normalize(JSON.parse(stored));
      } catch (error) {}
    }
    return resolveInitial();
  });

  const set = (next) => {
    setVal((prev) => {
      const resolved = normalize(typeof next === 'function' ? next(prev) : next);
      const storage = getStorage();
      if (storage) {
        try {
          storage.setItem(key, JSON.stringify(resolved));
        } catch (error) {}
      }
      return resolved;
    });
  };

  return [val, set];
};

const Editable = ({ multiline = false, placeholder = '', style = {}, as = 'span', value }) => {
  const displayValue = value ?? '';

  const Tag = as;
  return (
    <Tag
      style={{
        whiteSpace: multiline ? 'pre-wrap' : 'normal',
        display: as === 'div' ? 'block' : 'inline',
        ...style,
      }}
    >
      {displayValue || <span style={{ opacity: 0.4 }}>{placeholder}</span>}
    </Tag>
  );
};

const EditableList = ({ items }) => {
  return (
    <ul style={{ margin: 0, paddingLeft: '1.1em' }}>
      {items.map((it, i) => (
        <li key={i} style={{ marginBottom: '0.45em', lineHeight: 1.45 }}>
          <Editable value={it} multiline />
        </li>
      ))}
    </ul>
  );
};

window.Editable = Editable;
window.EditableList = EditableList;
window.useStored = useStored;
