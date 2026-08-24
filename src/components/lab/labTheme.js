export const accent = {
  purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  callout: '#e8f0fe',
  calloutBorder: '#4a90d9',
  focus: '#ffebee',
  codeBg: '#f6f8fa',
  track: '#e8eaf6',
  bar: '#667eea',
  barHot: '#764ba2',
}

export const calloutBox = {
  background: accent.callout,
  padding: 20,
  borderRadius: 8,
  border: `1px solid ${accent.calloutBorder}`,
}

export const codeBox = {
  background: accent.codeBg,
  border: '1px solid #d1d5db',
  borderRadius: 8,
  padding: '14px 16px',
  fontFamily: '"Fira Code", "Courier New", monospace',
  fontSize: 13,
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  color: '#16191f',
}

export const pill = (kind = 'blue') => {
  const map = {
    blue: { background: '#e8f0fe', color: '#174ea6', border: '1px solid #4a90d9' },
    red: { background: '#ffebee', color: '#b71c1c', border: '1px solid #ef9a9a' },
    green: { background: '#e8f5e9', color: '#1b5e20', border: '1px solid #81c784' },
    purple: { background: '#f3e8ff', color: '#5b21b6', border: '1px solid #c4b5fd' },
    yellow: { background: '#fff8e1', color: '#8a5a00', border: '1px solid #ffcc80' },
  }
  const c = map[kind] || map.blue
  return {
    display: 'inline-block',
    ...c,
    borderRadius: 5,
    padding: '2px 9px',
    margin: '2px',
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 500,
  }
}
