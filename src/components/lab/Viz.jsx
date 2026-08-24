import { useEffect, useState } from 'react'
import Button from '@cloudscape-design/components/button'

const ORANGE = '#e8820c'
const NAVY = '#1a1a2e'
const WARM = '#faf6f0'
const LINE = '#e8ddd0'

export function Stage({ eyebrow, children }) {
  return (
    <div
      style={{
        background: WARM,
        border: `1px solid ${LINE}`,
        borderRadius: 8,
        padding: '18px 20px',
        margin: '4px 0 12px',
      }}
    >
      {eyebrow && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            color: ORANGE,
            marginBottom: 12,
          }}
        >
          {eyebrow}
        </div>
      )}
      {children}
    </div>
  )
}

export function FlowStrip({ steps, active, onSelect }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
      {steps.map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            onClick={() => onSelect?.(i)}
            style={{
              padding: '10px 14px',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 700,
              cursor: onSelect ? 'pointer' : 'default',
              color: i === active ? '#fff' : NAVY,
              background: i === active ? ORANGE : '#fff',
              border: `2px solid ${i === active ? ORANGE : i < active ? '#3dba6c' : LINE}`,
              boxShadow: i === active ? `0 0 0 4px ${ORANGE}33` : 'none',
              transition: 'all 0.25s',
            }}
          >
            {label}
          </button>
          {i < steps.length - 1 && <span style={{ color: '#8a8a9a' }}>→</span>}
        </div>
      ))}
    </div>
  )
}

export function TokenRow({ tokens, highlightPair }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
      {tokens.map((t, i) => {
        const hot = highlightPair && (t === highlightPair[0] || t === highlightPair[1]) &&
          i < tokens.length - 1 && tokens[i] === highlightPair[0] && tokens[i + 1] === highlightPair[1]
        const hot2 = highlightPair && i > 0 && tokens[i - 1] === highlightPair[0] && tokens[i] === highlightPair[1]
        const on = hot || hot2
        return (
          <span
            key={`${t}-${i}`}
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 15,
              fontWeight: 700,
              padding: '6px 10px',
              borderRadius: 6,
              background: on ? ORANGE : '#fff',
              color: on ? '#fff' : NAVY,
              border: `1px solid ${on ? ORANGE : LINE}`,
              transform: on ? 'scale(1.08)' : 'scale(1)',
              transition: 'all 0.2s',
            }}
          >
            {t}
          </span>
        )
      })}
    </div>
  )
}

export function LiveBars({ items, onSample }) {
  const [picked, setPicked] = useState(null)
  const [rolling, setRolling] = useState(false)
  const max = Math.max(...items.map((i) => i.value), 0.001)

  const roll = () => {
    setRolling(true)
    let n = 0
    const id = setInterval(() => {
      setPicked(items[n % items.length].label)
      n++
      if (n > 12) {
        clearInterval(id)
        let r = Math.random()
        let choice = items[items.length - 1].label
        for (const it of items) {
          r -= it.value
          if (r <= 0) {
            choice = it.label
            break
          }
        }
        setPicked(choice)
        setRolling(false)
        onSample?.(choice)
      }
    }, 70)
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it) => {
          const win = picked === it.label
          return (
            <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 110, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, fontWeight: win ? 800 : 500, color: win ? ORANGE : NAVY }}>
                {it.label}
              </div>
              <div style={{ flex: 1, height: 22, background: '#efe8dc', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: 22,
                    width: `${(it.value / max) * 100}%`,
                    background: win ? ORANGE : '#5a9abf',
                    borderRadius: 4,
                    transition: 'width 0.35s ease, background 0.2s',
                  }}
                />
              </div>
              <div style={{ width: 52, textAlign: 'right', fontFamily: 'ui-monospace, Menlo, monospace', fontWeight: 700, fontSize: 13 }}>
                {(it.value * 100).toFixed(0)}%
              </div>
            </div>
          )
        })}
      </div>
      {onSample && (
        <div style={{ marginTop: 14 }}>
          <Button variant="primary" onClick={roll} disabled={rolling}>
            {rolling ? 'Sampling…' : 'Draw the next token'}
          </Button>
          {picked && !rolling && (
            <span style={{ marginLeft: 12, fontWeight: 800, color: ORANGE }}>drew “{picked}”</span>
          )}
        </div>
      )}
    </div>
  )
}

export function HeatDocs({ docs, query, onSelect }) {
  const max = Math.max(...docs.map((d) => d.score), 0.001)
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {docs.map((d) => {
        const t = d.score / max
        return (
          <div
            key={d.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect?.(d)}
            style={{
              padding: '12px 14px',
              borderRadius: 6,
              border: `1px solid ${t > 0.7 ? ORANGE : LINE}`,
              background: `rgba(232, 130, 12, ${0.06 + t * 0.28})`,
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              cursor: onSelect ? 'pointer' : 'default',
              transform: `scale(${0.97 + t * 0.03})`,
              transition: 'all 0.3s',
            }}
          >
            <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontWeight: 800, color: ORANGE, minWidth: 36 }}>{d.id}</div>
            <div style={{ flex: 1, fontSize: 14, color: NAVY }}>{d.text}</div>
            <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontWeight: 700, fontSize: 13 }}>{d.score.toFixed(2)}</div>
          </div>
        )
      })}
      {query && (
        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Query: {query}</div>
      )}
    </div>
  )
}

export function ChunkPaint({ text, size, overlap }) {
  const words = text.split(/\s+/)
  const colors = ['#ffe0c2', '#d4ecff', '#e4f5d9', '#f3e0ff', '#fff3c4']
  const spans = []
  let i = 0
  let c = 0
  const step = Math.max(1, size - overlap)
  while (i < words.length) {
    spans.push({ start: i, end: Math.min(words.length, i + size), color: colors[c % colors.length], n: c + 1 })
    i += step
    c++
    if (c > 40) break
  }
  return (
    <div style={{ fontSize: 16, lineHeight: 2.1 }}>
      {words.map((w, idx) => {
        const owners = spans.filter((s) => idx >= s.start && idx < s.end)
        const bg = owners.length > 1 ? '#ffd6a8' : owners[0]?.color || 'transparent'
        return (
          <span key={idx} style={{ background: bg, padding: '2px 3px', borderRadius: 3, marginRight: 3 }}>
            {w}
          </span>
        )
      })}
      <div style={{ marginTop: 10, fontSize: 12, color: '#666' }}>
        Each colour is a chunk. Overlap shows as the darker orange mix.
      </div>
    </div>
  )
}

export function RankLanes({ left, right, fused }) {
  const Lane = ({ title, rows, color }) => (
    <div style={{ flex: 1, minWidth: 160 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color, marginBottom: 8 }}>{title}</div>
      {rows.map((r, i) => (
        <div
          key={r.id}
          style={{
            padding: '8px 10px',
            marginBottom: 6,
            background: '#fff',
            border: `1px solid ${LINE}`,
            borderLeft: `3px solid ${i === 0 ? color : LINE}`,
            borderRadius: 4,
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: 13,
          }}
        >
          #{i + 1} {r.id}
        </div>
      ))}
    </div>
  )
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Lane title="KEYWORDS" rows={left} color="#5a9abf" />
      <Lane title="MEANING" rows={right} color="#7b61c4" />
      <Lane title="FUSED (RRF)" rows={fused} color={ORANGE} />
    </div>
  )
}

export function TokenMeter({ used, limit }) {
  const pct = Math.min(100, (used / limit) * 100)
  const over = used > limit
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, marginBottom: 6 }}>
        <span>{used} / {limit} tokens</span>
        <span style={{ color: over ? '#e05252' : ORANGE, fontWeight: 800 }}>{pct.toFixed(0)}%</span>
      </div>
      <div style={{ height: 14, background: '#efe8dc', borderRadius: 7, overflow: 'hidden' }}>
        <div
          style={{
            width: `${Math.min(100, pct)}%`,
            height: '100%',
            background: over ? '#e05252' : ORANGE,
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  )
}

export function PulseSample({ running }) {
  const [dots, setDots] = useState('')
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? '' : d + '.')), 280)
    return () => clearInterval(id)
  }, [running])
  return <span>{dots}</span>
}

export function useTicker(text, active) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) return
    setN(0)
    const id = setInterval(() => {
      setN((x) => {
        if (x >= text.length) {
          clearInterval(id)
          return x
        }
        return x + 1
      })
    }, 16)
    return () => clearInterval(id)
  }, [text, active])
  return text.slice(0, n)
}
