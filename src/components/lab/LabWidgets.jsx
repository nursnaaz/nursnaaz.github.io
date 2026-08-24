import { useState } from 'react'
import Alert from '@cloudscape-design/components/alert'
import Button from '@cloudscape-design/components/button'
import Input from '@cloudscape-design/components/input'
import { StudentNote } from '../interactive/StudentNote'
import { TryYourself } from '../interactive/TryYourself'
import { accent } from './labTheme'

export function Insight({ title = 'Key Insight', children }) {
  return <StudentNote title={title}>{children}</StudentNote>
}

export function Warn({ title = 'Watch out', children }) {
  return (
    <Alert type="warning" header={title}>
      {children}
    </Alert>
  )
}

export function ChoiceExercise({ question, options, answer, onPass }) {
  const [selected, setSelected] = useState(null)
  const [done, setDone] = useState(false)

  const pick = (opt) => {
    if (done) return
    setSelected(opt)
    if (opt === answer) {
      setDone(true)
      onPass?.()
    }
  }

  return (
    <TryYourself>
      <div style={{ marginBottom: 12 }}>{question}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {options.map((opt) => {
          const isCorrect = done && opt === answer
          const isWrong = selected === opt && opt !== answer
          return (
            <Button
              key={opt}
              variant={isCorrect ? 'primary' : 'normal'}
              disabled={done && !isCorrect}
              onClick={() => pick(opt)}
            >
              {isWrong ? `✗ ${opt}` : opt}
            </Button>
          )
        })}
      </div>
      {done && <div style={{ marginTop: 10 }}>That is right.</div>}
      {selected && !done && selected !== answer && (
        <div style={{ marginTop: 8 }}>Not quite. Try another option.</div>
      )}
    </TryYourself>
  )
}

export function TextExercise({ question, check, hint, onPass }) {
  const [val, setVal] = useState('')
  const [state, setState] = useState('idle')
  const [tries, setTries] = useState(0)

  const handleCheck = () => {
    setTries((n) => n + 1)
    if (check(val.trim())) {
      setState('correct')
      onPass?.()
    } else {
      setState('wrong')
    }
  }

  return (
    <TryYourself>
      <div style={{ marginBottom: 12, whiteSpace: 'pre-line' }}>{question}</div>
      {state !== 'correct' ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Input
            value={val}
            onChange={({ detail }) => {
              setVal(detail.value)
              setState('idle')
            }}
            placeholder="Your answer..."
            onKeyDown={({ detail }) => detail.key === 'Enter' && handleCheck()}
          />
          <Button variant="primary" onClick={handleCheck}>Check</Button>
        </div>
      ) : (
        <div>Correct.</div>
      )}
      {state === 'wrong' && (
        <div style={{ marginTop: 8 }}>{tries >= 2 ? `Hint: ${hint}` : 'Try again.'}</div>
      )}
    </TryYourself>
  )
}

export function BarChart({ items, max }) {
  const m = max || Math.max(...items.map((i) => i.value), 0.001)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item) => {
        const n = item.value
        const label = typeof n === 'number' && Number.isInteger(n) ? String(n) : typeof n === 'number' ? n.toFixed(3) : n
        return (
          <div key={item.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 3 }}>
              <span style={{ fontFamily: 'monospace' }}>{item.label}</span>
              <span>{label}</span>
            </div>
            <div style={{ background: accent.track, borderRadius: 4, height: 10, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.max(2, (item.value / m) * 100)}%`,
                  height: '100%',
                  background: item.color || accent.bar,
                  transition: 'width 0.35s ease',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function CourseLink({ children }) {
  return (
    <Alert type="success" header="In the course notebooks">
      {children}
    </Alert>
  )
}
