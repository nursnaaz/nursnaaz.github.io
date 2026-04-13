import { useState, useEffect, useCallback, useMemo } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Button from '@cloudscape-design/components/button'
import Alert from '@cloudscape-design/components/alert'
import Input from '@cloudscape-design/components/input'

// ─────────────────────────────────────────────────────────────────────────────
// MOVIE CORPUS — 12 movies with rich text for BoW / TF-IDF computation
// ─────────────────────────────────────────────────────────────────────────────

const MOVIES = [
  { id: 'M1',  title: 'The Dark Knight',           genre: 'Action',    year: 2008,
    text: 'batman joker gotham crime chaos criminal mastermind terror police city hero dark knight villain psychopath' },
  { id: 'M2',  title: 'Inception',                  genre: 'Sci-Fi',    year: 2010,
    text: 'dream thief steals secrets subconscious mind layers reality bending heist architecture dream within dream memory' },
  { id: 'M3',  title: 'Interstellar',               genre: 'Sci-Fi',    year: 2014,
    text: 'astronaut space wormhole galaxy time dilation black hole gravity humanity extinction survival cosmos exploration' },
  { id: 'M4',  title: 'The Shawshank Redemption',   genre: 'Drama',     year: 1994,
    text: 'prison inmate friendship hope freedom innocence banker wrongly convicted escape redemption justice brotherhood survival' },
  { id: 'M5',  title: 'Forrest Gump',               genre: 'Drama',     year: 1994,
    text: 'simple man historic moments love life journey destiny kindness vietnam war running friendship comedy heartwarming' },
  { id: 'M6',  title: 'The Godfather',              genre: 'Crime',     year: 1972,
    text: 'mafia family power corruption murder loyalty betrayal crime boss dynasty italian organized crime saga patriarch violence' },
  { id: 'M7',  title: 'Pulp Fiction',               genre: 'Crime',     year: 1994,
    text: 'hitmen crime stories gangster redemption violence dark humor nonlinear narrative intersecting crime fiction los angeles' },
  { id: 'M8',  title: 'Toy Story',                  genre: 'Animation', year: 1995,
    text: 'toys cowboy space ranger friendship jealousy adventure animated comedy family children imagination play heartwarming' },
  { id: 'M9',  title: 'Finding Nemo',               genre: 'Animation', year: 2003,
    text: 'clownfish ocean journey father son reef kidnapped sydney animated comedy adventure family underwater friendship loyalty' },
  { id: 'M10', title: 'The Lion King',              genre: 'Animation', year: 1994,
    text: 'lion cub king pride betrayal uncle murder savanna africa circle life hakuna matata animated musical family' },
  { id: 'M11', title: 'The Avengers',               genre: 'Action',    year: 2012,
    text: 'superhero team iron man thor captain america hulk shield alien invasion earth save action marvel hero battle' },
  { id: 'M12', title: 'The Matrix',                 genre: 'Sci-Fi',    year: 1999,
    text: 'hacker reality simulation machine control chosen liberation red blue pill virtual world science fiction action dystopia' },
]

// ─────────────────────────────────────────────────────────────────────────────
// PRE-DEFINED SEMANTIC VECTORS (8 dimensions each)
// Dimensions: [dark/crime, sci-fi/tech, animation/family, drama/emotion,
//              action/hero, complex-plot, comedy/humor, redemption/hope]
// These represent what neural embedding models learn — semantic coordinates in vector space.
// ─────────────────────────────────────────────────────────────────────────────

const W2V_VECS = {
  M1:  [0.90, 0.10, 0.00, 0.35, 0.80, 0.70, 0.00, 0.20],
  M2:  [0.20, 0.80, 0.00, 0.20, 0.40, 0.95, 0.00, 0.10],
  M3:  [0.10, 0.95, 0.00, 0.45, 0.25, 0.70, 0.00, 0.30],
  M4:  [0.30, 0.00, 0.00, 0.95, 0.05, 0.30, 0.10, 0.95],
  M5:  [0.10, 0.00, 0.15, 0.80, 0.15, 0.20, 0.60, 0.50],
  M6:  [0.95, 0.00, 0.00, 0.70, 0.50, 0.60, 0.00, 0.15],
  M7:  [0.85, 0.00, 0.00, 0.35, 0.50, 0.90, 0.35, 0.30],
  M8:  [0.00, 0.10, 0.95, 0.30, 0.30, 0.20, 0.85, 0.25],
  M9:  [0.00, 0.00, 0.95, 0.50, 0.40, 0.20, 0.70, 0.40],
  M10: [0.25, 0.00, 0.90, 0.65, 0.40, 0.30, 0.30, 0.80],
  M11: [0.20, 0.20, 0.00, 0.10, 0.95, 0.35, 0.35, 0.10],
  M12: [0.35, 0.90, 0.00, 0.20, 0.75, 0.85, 0.00, 0.20],
}

// GloVe — captures global co-occurrence, slightly different semantic weights
const GLOVE_VECS = {
  M1:  [0.88, 0.08, 0.02, 0.40, 0.75, 0.65, 0.05, 0.25],
  M2:  [0.18, 0.75, 0.02, 0.25, 0.45, 0.92, 0.05, 0.12],
  M3:  [0.08, 0.92, 0.02, 0.50, 0.20, 0.68, 0.02, 0.35],
  M4:  [0.28, 0.02, 0.05, 0.92, 0.08, 0.28, 0.15, 0.92],
  M5:  [0.12, 0.02, 0.18, 0.82, 0.18, 0.18, 0.58, 0.52],
  M6:  [0.92, 0.02, 0.02, 0.68, 0.48, 0.58, 0.02, 0.18],
  M7:  [0.82, 0.02, 0.02, 0.38, 0.48, 0.88, 0.38, 0.32],
  M8:  [0.02, 0.08, 0.92, 0.32, 0.28, 0.18, 0.82, 0.28],
  M9:  [0.02, 0.02, 0.92, 0.52, 0.38, 0.18, 0.68, 0.42],
  M10: [0.22, 0.02, 0.88, 0.68, 0.38, 0.28, 0.28, 0.78],
  M11: [0.18, 0.18, 0.02, 0.12, 0.92, 0.32, 0.32, 0.12],
  M12: [0.32, 0.88, 0.02, 0.22, 0.72, 0.82, 0.02, 0.22],
}

// FastText — character n-grams, handles morphology better, smoother genre boundaries
const FT_VECS = {
  M1:  [0.87, 0.12, 0.03, 0.38, 0.82, 0.68, 0.03, 0.22],
  M2:  [0.22, 0.82, 0.03, 0.22, 0.42, 0.93, 0.03, 0.12],
  M3:  [0.12, 0.93, 0.03, 0.42, 0.22, 0.72, 0.03, 0.28],
  M4:  [0.32, 0.03, 0.03, 0.93, 0.07, 0.32, 0.12, 0.93],
  M5:  [0.12, 0.03, 0.18, 0.82, 0.18, 0.22, 0.62, 0.52],
  M6:  [0.93, 0.03, 0.03, 0.72, 0.52, 0.62, 0.03, 0.18],
  M7:  [0.83, 0.03, 0.03, 0.38, 0.52, 0.88, 0.38, 0.32],
  M8:  [0.03, 0.12, 0.93, 0.32, 0.32, 0.22, 0.83, 0.27],
  M9:  [0.03, 0.03, 0.93, 0.52, 0.42, 0.22, 0.72, 0.42],
  M10: [0.23, 0.03, 0.88, 0.67, 0.42, 0.32, 0.32, 0.78],
  M11: [0.22, 0.22, 0.03, 0.12, 0.93, 0.38, 0.37, 0.12],
  M12: [0.37, 0.88, 0.03, 0.22, 0.77, 0.83, 0.03, 0.22],
}

// ─────────────────────────────────────────────────────────────────────────────
// BADGE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

const BADGES = [
  { id: 'problem',    emoji: '🎯', title: 'Problem Solver',   xp: 5,  step: 0 },
  { id: 'vector',     emoji: '📐', title: 'Vectorizer',       xp: 15, step: 1 },
  { id: 'euclidean',  emoji: '📏', title: 'Distance Expert',  xp: 20, step: 2 },
  { id: 'cosine',     emoji: '🔄', title: 'Cosine Master',    xp: 25, step: 3 },
  { id: 'methods',    emoji: '🧠', title: 'Method Expert',    xp: 20, step: 4 },
  { id: 'recommender',emoji: '🎬', title: 'ML Engineer',      xp: 40, step: 5 },
  { id: 'analyst',    emoji: '🔬', title: 'Analyst',          xp: 20, step: 6 },
  { id: 'coder',      emoji: '💻', title: 'Python Coder',     xp: 10, step: 7 },
  { id: 'amplifier',  emoji: '📢', title: 'Knowledge Sharer', xp: 10, step: 8 },
]

// ─────────────────────────────────────────────────────────────────────────────
// SHARED STYLE HELPERS — Amazon + Google professional palette
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  bg0:     '#0D1117',
  bg1:     '#161B22',
  bg2:     '#1C2331',
  border1: '#21303F',
  border2: '#2D4460',
  text1:   '#F0F6FA',  // primary text — near white
  text2:   '#D8E8F0',  // body text — bright, high contrast on dark bg
  text3:   '#B0CCDA',  // muted text — clearly readable even in sunlight
  orange:  '#FF9900',
  orange2: '#FFB347',
  blue:    '#4285F4',
  blue2:   '#7BAAFF',
  green:   '#34A853',
  green2:  '#4ECC6F',
  red:     '#EA4335',
  red2:    '#FF7B72',
  yellow:  '#FBBC04',
  purple:  '#8B5CF6',
  codeKw:  '#5BB8FF',
  codeStr: '#4ECC6F',
  codeCmt: '#94B8C8',  // code comments — clearly readable in dark code blocks
}

const card = (bg = C.bg1, border = C.border1) => ({
  background: bg, border: `1px solid ${border}`,
  borderRadius: 10, padding: 16, marginBottom: 4,
  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
})

const codeBox = {
  background: C.bg0, border: `1px solid ${C.border1}`,
  borderRadius: 8, padding: '14px 16px',
  fontFamily: '"Fira Code", "Courier New", monospace', fontSize: 13,
  color: C.text2, lineHeight: 1.6,
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
}

const pill = (color = C.blue) => ({
  display: 'inline-block', background: color + '25',
  color: color, border: `1px solid ${color}60`,
  borderRadius: 5, padding: '2px 9px', margin: '2px',
  fontFamily: 'monospace', fontSize: 13, fontWeight: 500,
})

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Exercise({ question, check, hint, onPass }) {
  const [val, setVal] = useState('')
  const [state, setState] = useState('idle')
  const [tries, setTries] = useState(0)

  const handleCheck = () => {
    setTries(n => n + 1)
    if (check(val.trim())) { setState('correct'); onPass() }
    else setState('wrong')
  }

  return (
    <div style={{ ...card(C.bg2, C.blue), marginTop: 8 }}>
      <div style={{ color: C.blue2, fontWeight: 'bold', marginBottom: 8 }}>✏️ Exercise</div>
      <div style={{ color: C.text1, marginBottom: 12, whiteSpace: 'pre-line' }}>{question}</div>
      {state !== 'correct' ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Input value={val} onChange={({ detail }) => { setVal(detail.value); setState('idle') }}
            placeholder="Your answer..." onKeyDown={({ detail }) => detail.key === 'Enter' && handleCheck()} />
          <Button variant="primary" onClick={handleCheck}>Check</Button>
        </div>
      ) : (
        <div style={{ color: C.green2, fontWeight: 'bold', fontSize: 15 }}>✅ Correct!</div>
      )}
      {state === 'wrong' && (
        <div style={{ color: C.red2, marginTop: 8, fontSize: 13 }}>
          ❌ {tries >= 2 ? `Hint: ${hint}` : 'Not quite, try again!'}
        </div>
      )}
    </div>
  )
}

function ChoiceExercise({ question, options, answer, onPass }) {
  const [selected, setSelected] = useState(null)
  const [done, setDone] = useState(false)

  const pick = opt => {
    if (done) return
    setSelected(opt)
    if (opt === answer) { setDone(true); onPass() }
  }

  return (
    <div style={{ ...card(C.bg2, C.blue), marginTop: 8 }}>
      <div style={{ color: C.blue2, fontWeight: 'bold', marginBottom: 8 }}>🎯 Quiz</div>
      <div style={{ color: C.text1, marginBottom: 12 }}>{question}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {options.map(opt => {
          const isSelected = selected === opt
          const isCorrect  = done && opt === answer
          const isWrong    = isSelected && opt !== answer
          return (
            <button key={opt} onClick={() => pick(opt)} style={{
              padding: '8px 18px', borderRadius: 6, cursor: done ? 'default' : 'pointer',
              border: `2px solid ${isCorrect ? C.green2 : isWrong ? C.red2 : isSelected ? C.blue : C.border1}`,
              background: isCorrect ? '#0A1F14' : isWrong ? '#1F0D0A' : isSelected ? '#0F1E3D' : C.bg2,
              color: C.text1, fontSize: 14, fontFamily: 'monospace', transition: 'all 0.15s',
            }}>
              {opt}
            </button>
          )
        })}
      </div>
      {done && <div style={{ color: C.green2, fontWeight: 'bold', marginTop: 10 }}>✅ Exactly right!</div>}
      {selected && !done && selected !== answer && (
        <div style={{ color: C.red2, marginTop: 8, fontSize: 13 }}>❌ Not quite. Try another option!</div>
      )}
    </div>
  )
}

function Toast({ badge, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t) }, [onDone])
  return (
    <div style={{
      position: 'fixed', top: 80, right: 24, zIndex: 9999,
      background: C.bg2, border: `2px solid ${C.orange}`, borderRadius: 12,
      padding: '14px 22px', boxShadow: `0 8px 32px ${C.orange}55`,
      animation: 'toastIn 0.3s ease', minWidth: 180, textAlign: 'center',
    }}>
      <div style={{ fontSize: 32 }}>{badge.emoji}</div>
      <div style={{ color: C.orange, fontWeight: 'bold' }}>Badge Unlocked!</div>
      <div style={{ color: C.text1, fontSize: 14 }}>{badge.title}</div>
      <div style={{ color: C.green2, fontSize: 13 }}>+{badge.xp} XP</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MATH UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','is','it',
  'are','was','by','from','with','who','his','her','their','that','this','be',
  'have','has','had','not','as','up','when','into','he','she','they','we',
])

function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t))
}

function cosineSim(a, b) {
  const dot  = a.reduce((s, ai, i) => s + ai * b[i], 0)
  const magA = Math.sqrt(a.reduce((s, ai) => s + ai * ai, 0))
  const magB = Math.sqrt(b.reduce((s, bi) => s + bi * bi, 0))
  return magA === 0 || magB === 0 ? 0 : dot / (magA * magB)
}

function euclideanDist(a, b) {
  return Math.sqrt(a.reduce((s, ai, i) => s + (ai - b[i]) ** 2, 0))
}

// Build full vocabulary from all movies
function buildVocab(movies) {
  const vocab = new Set()
  movies.forEach(m => tokenize(m.text).forEach(t => vocab.add(t)))
  return [...vocab].sort()
}

// BoW vector (raw term counts)
function bowVec(text, vocab) {
  const tokens = tokenize(text)
  const counts = {}
  tokens.forEach(t => { counts[t] = (counts[t] || 0) + 1 })
  return vocab.map(term => counts[term] || 0)
}

// TF-IDF vector
function buildTfidfVecs(movies, vocab) {
  const tokenized = movies.map(m => tokenize(m.text))
  const N = movies.length
  const idf = vocab.map(term => {
    const df = tokenized.filter(toks => toks.includes(term)).length
    return df > 0 ? Math.log(N / df) : 0
  })
  return tokenized.map(toks => vocab.map((term, vi) => {
    const tf = toks.filter(t => t === term).length / (toks.length || 1)
    return tf * idf[vi]
  }))
}

// Pre-compute everything once (outside component to avoid re-computation)
const VOCAB       = buildVocab(MOVIES)
const BOW_VECS    = MOVIES.map(m => bowVec(m.text, VOCAB))
const TFIDF_VECS  = buildTfidfVecs(MOVIES, VOCAB)

function getRecommendations(queryIdx, method) {
  return MOVIES.map((m, i) => {
    if (i === queryIdx) return null
    let sim
    if (method === 'bow')      sim = cosineSim(BOW_VECS[queryIdx],   BOW_VECS[i])
    if (method === 'tfidf')    sim = cosineSim(TFIDF_VECS[queryIdx], TFIDF_VECS[i])
    if (method === 'word2vec') sim = cosineSim(Object.values(W2V_VECS)[queryIdx],   Object.values(W2V_VECS)[i])
    if (method === 'glove')    sim = cosineSim(Object.values(GLOVE_VECS)[queryIdx], Object.values(GLOVE_VECS)[i])
    if (method === 'fasttext') sim = cosineSim(Object.values(FT_VECS)[queryIdx],    Object.values(FT_VECS)[i])
    return { movie: m, sim: Math.round(sim * 100) / 100 }
  }).filter(Boolean).sort((a, b) => b.sim - a.sim)
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 0 — THE PROBLEM
// ─────────────────────────────────────────────────────────────────────────────

function Step0({ onUnlock, onNext }) {
  const [accepted, setAccepted] = useState(false)

  return (
    <SpaceBetween size="m">
      <div style={{ ...card(C.bg2, C.border2), padding: '12px 18px', borderLeft: `3px solid ${C.orange}` }}>
        <span style={{ color: C.text3, fontSize: 13 }}>
          Netflix, Spotify, and Amazon all solve the same problem:
          <strong style={{ color: C.orange }}> How do you find what a user wants when they can't perfectly describe it?</strong>
          {' '}The answer is text similarity. This tutorial shows you exactly how it works.
        </span>
      </div>

      <div style={{ ...card('#0B1521', C.blue), textAlign: 'center', padding: 32 }}>
        <div style={{ fontSize: 56 }}>🎬</div>
        <h2 style={{ color: C.blue2, margin: '12px 0 6px' }}>You are building a movie recommender</h2>
        <p style={{ color: C.text2, fontSize: 15, margin: 0 }}>
          Using <strong style={{ color: C.text1 }}>5 different ways</strong> to turn text into numbers, and understanding
          why one metric measures similarity better than any other.
        </p>
      </div>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>📋 What you will master</div>
        {[
          ['📐', 'Text as Vectors',         'Every document becomes a point in high-dimensional space'],
          ['📏', 'Euclidean vs Cosine',     'Why distance fails and what angle measures instead'],
          ['🔄', 'Cosine Similarity',        'The formula that powers every recommendation engine'],
          ['🧠', '5 Embedding Methods',      'BoW → TF-IDF → Word2Vec → GloVe → FastText (1954–2016)'],
          ['🎬', 'Live Movie Recommender',   'See all 5 methods give different results, right in your browser'],
        ].map(([icon, name, desc]) => (
          <div key={name} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span>
            <span>
              <strong style={{ color: C.text1 }}>{name}</strong>
              <span style={{ color: C.text3 }}>: {desc}</span>
            </span>
          </div>
        ))}
      </div>

      <div style={{ ...card('#0B1521', C.border2), padding: '14px 16px' }}>
        <div style={{ color: C.text2, fontSize: 13, lineHeight: 1.7 }}>
          <strong style={{ color: C.yellow }}>💡 The key question this tutorial answers:</strong>
          <br />
          Two documents can be identical in meaning but very different in length.
          A 10-word tweet and a 1,000-word essay about the same topic. How do you know they are similar?
          <br /><br />
          <strong style={{ color: C.text1 }}>Euclidean distance gets this wrong. Cosine similarity gets it right.</strong>
          {' '}You will prove this yourself in Step 2.
        </div>
      </div>

      {!accepted ? (
        <div style={{ textAlign: 'center' }}>
          <Button variant="primary" onClick={() => { setAccepted(true); onUnlock('problem') }}>
            Start the Tutorial 🎯
          </Button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: C.green2, fontWeight: 'bold', marginBottom: 12 }}>🎯 Let's go. Building your intuition now.</div>
          <Button variant="primary" onClick={onNext}>Text as Vectors →</Button>
        </div>
      )}
    </SpaceBetween>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — TEXT AS VECTORS (BAG OF WORDS DEMO)
// ─────────────────────────────────────────────────────────────────────────────

function Step1({ onUnlock, onNext }) {
  const [revealed, setRevealed] = useState(false)
  const [quizPassed, setQuizPassed] = useState(false)

  // Show a tiny 3-movie, 4-term example
  const DEMO_MOVIES = [
    { title: 'The Dark Knight', tokens: ['batman', 'joker', 'crime', 'gotham'] },
    { title: 'The Avengers',    tokens: ['superhero', 'hero', 'action', 'battle'] },
    { title: 'Toy Story',       tokens: ['toys', 'cowboy', 'friendship', 'comedy'] },
  ]
  const DEMO_VOCAB = ['action', 'batman', 'battle', 'comedy', 'cowboy', 'crime', 'friendship', 'gotham', 'hero', 'joker', 'superhero', 'toys']

  return (
    <SpaceBetween size="m">
      <Alert type="info" header="Step 1: Text as Vectors">
        A computer cannot read. It only understands numbers. The simplest way to turn text into numbers
        is to count how many times each word appears. That count becomes a vector, a list of numbers.
      </Alert>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>
          The "Bag of Words" model (1954)
        </div>
        <p style={{ color: C.text2, margin: '0 0 10px', fontSize: 13, lineHeight: 1.6 }}>
          Think of shaking a document until all the words fall out into a bag. You lose the order,
          but you can count how many of each word you have. That count is your vector.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              step: 1,
              label: 'Build vocabulary from ALL documents',
              lines: [
                { code: 'vocab = ["action", "batman", "crime", "hero", "joker", ...]', note: 'N unique words across every document' },
              ],
            },
            {
              step: 2,
              label: 'For each document, count each vocab word',
              lines: [
                { code: 'dark_knight = [0, 1, 1, 0, 1, ...]', note: 'one number per vocab word' },
                { code: 'toy_story   = [0, 0, 0, 0, 0, ...]', note: 'different position in space' },
              ],
            },
            {
              step: 3,
              label: 'Each document is now a vector, a point in N-dimensional space',
              lines: [
                { code: 'len(dark_knight) == len(toy_story) == len(vocab)', note: 'every movie lives in the same space' },
              ],
            },
          ].map(({ step, label, lines }) => (
            <div key={step} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                minWidth: 24, height: 24, borderRadius: '50%',
                background: C.orange, color: '#000',
                fontWeight: 'bold', fontSize: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: 2, flexShrink: 0,
              }}>{step}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.text1, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{label}</div>
                {lines.map(({ code, note }) => (
                  <div key={code} style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                    <code style={{
                      background: C.bg0, color: C.codeKw,
                      padding: '2px 8px', borderRadius: 4,
                      fontSize: 12, fontFamily: 'monospace', whiteSpace: 'nowrap',
                    }}>{code}</code>
                    <span style={{ color: C.text3, fontSize: 12 }}>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={card()}>
        <div style={{ color: C.blue2, fontWeight: 'bold', marginBottom: 12 }}>
          BoW Matrix: 3 movies × 12 words
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 12, width: '100%' }}>
            <thead>
              <tr>
                <th style={{ color: C.text3, padding: '4px 10px', textAlign: 'left', borderBottom: `1px solid ${C.border1}` }}>Movie</th>
                {DEMO_VOCAB.map(w => (
                  <th key={w} style={{ color: C.text3, padding: '4px 8px', textAlign: 'center', borderBottom: `1px solid ${C.border1}`, whiteSpace: 'nowrap' }}>{w}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_MOVIES.map(m => (
                <tr key={m.title}>
                  <td style={{ color: C.text2, padding: '4px 10px', borderBottom: `1px solid ${C.border1}40`, whiteSpace: 'nowrap', fontSize: 11 }}>{m.title}</td>
                  {DEMO_VOCAB.map(w => {
                    const count = m.tokens.filter(t => t === w).length
                    return (
                      <td key={w} style={{
                        padding: '4px 8px', textAlign: 'center',
                        borderBottom: `1px solid ${C.border1}40`,
                        color: count > 0 ? C.orange : C.text3,
                        fontWeight: count > 0 ? 'bold' : 'normal',
                      }}>
                        {count}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 10, color: C.text3, fontSize: 12 }}>
          Each row is now a <strong style={{ color: C.blue2 }}>vector</strong>, a point in 12-dimensional space.
          Movies that share words are nearby. Movies that share no words are far apart.
        </div>
      </div>

      {!revealed ? (
        <div style={{ textAlign: 'center' }}>
          <Button onClick={() => setRevealed(true)}>See the Coordinate View →</Button>
        </div>
      ) : (
        <div style={card()}>
          <div style={{ color: C.green2, fontWeight: 'bold', marginBottom: 10 }}>
            Each movie is now a point in vocabulary-dimensional space
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {DEMO_MOVIES.map((m, i) => {
              const colors = [C.orange, C.blue, C.green]
              return (
                <div key={m.title} style={{
                  background: C.bg0, border: `1px solid ${colors[i]}40`,
                  borderRadius: 8, padding: '10px 14px', flex: '1 1 200px',
                }}>
                  <div style={{ color: colors[i], fontWeight: 'bold', marginBottom: 6, fontSize: 12 }}>{m.title}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: C.text3, lineHeight: 1.8 }}>
                    {'{' + m.tokens.map(t => `${t}: 1`).join(', ') + '}'}
                  </div>
                  <div style={{ color: C.text3, fontSize: 11, marginTop: 6 }}>
                    Vector: [{m.tokens.map(() => '1').join(', ')}, 0, 0, 0, ...]
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <ChoiceExercise
        question="What is the biggest weakness of Bag of Words?"
        options={['Too slow to compute', 'Loses word order and meaning', 'Requires a GPU', 'Only works in English']}
        answer="Loses word order and meaning"
        onPass={() => { onUnlock('vector'); setQuizPassed(true) }}
      />

      {quizPassed && (
        <div style={{ textAlign: 'center' }}>
          <Button variant="primary" onClick={onNext}>The Length Problem →</Button>
        </div>
      )}
    </SpaceBetween>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — THE LENGTH PROBLEM: EUCLIDEAN vs COSINE
// ─────────────────────────────────────────────────────────────────────────────

function Step2({ onUnlock, onNext }) {
  const [showEuclid, setShowEuclid] = useState(false)
  const [showCosine, setShowCosine] = useState(false)
  const [quizPassed, setQuizPassed] = useState(false)

  // Classic example: same content, different length
  // Vocab = [i, love, pizza] (after stop word removal → [love, pizza])
  // Doc A: "I love pizza"        → [1, 1]   (love=1, pizza=1)
  // Doc B: "I love pizza I love pizza I love pizza" → [3, 3]
  // Query: "pizza"               → [0, 1]
  const A = [1, 1], B = [3, 3], Q = [0, 1]
  const eucA = euclideanDist(A, Q).toFixed(3)  // 1.000
  const eucB = euclideanDist(B, Q).toFixed(3)  // 2.828
  const cosA = cosineSim(A, Q).toFixed(3)      // 0.707
  const cosB = cosineSim(B, Q).toFixed(3)      // 0.707

  return (
    <SpaceBetween size="m">
      <Alert type="warning" header="Step 2: Why Euclidean Distance Fails">
        Copy-paste a document twice. It is twice as long but means the same thing.
        Euclidean distance says it is a completely different document. Cosine similarity says: identical.
        Which one is right for measuring meaning?
      </Alert>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>The Setup</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { label: 'Doc A (short)', text: '"I love pizza"',          vec: '[1, 1]', color: C.blue },
            { label: 'Doc B (long)',  text: '"I love pizza" × 3',       vec: '[3, 3]', color: C.green },
            { label: 'Query',         text: '"pizza"',                  vec: '[0, 1]', color: C.orange },
          ].map(d => (
            <div key={d.label} style={{ background: C.bg0, border: `1px solid ${d.color}40`, borderRadius: 8, padding: 12 }}>
              <div style={{ color: d.color, fontWeight: 'bold', fontSize: 12, marginBottom: 6 }}>{d.label}</div>
              <div style={{ color: C.text2, fontFamily: 'monospace', fontSize: 13, marginBottom: 4 }}>{d.text}</div>
              <div style={{ color: C.text3, fontFamily: 'monospace', fontSize: 12 }}>
                vocab: [love, pizza]<br />
                vector: <span style={{ color: d.color }}>{d.vec}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, color: C.text3, fontSize: 12 }}>
          Doc A and Doc B have identical meaning. Only the length differs.
          A good similarity measure must score them equally against the query.
        </div>
      </div>

      {!showEuclid ? (
        <div style={{ textAlign: 'center' }}>
          <Button onClick={() => setShowEuclid(true)}>Compute Euclidean Distance →</Button>
        </div>
      ) : (
        <div style={{ ...card(C.bg2, C.red), borderLeft: `3px solid ${C.red}` }}>
          <div style={{ color: C.red2, fontWeight: 'bold', marginBottom: 10 }}>📏 Euclidean Distance (straight-line distance)</div>
          <div style={{ ...codeBox, fontSize: 12 }}>
            <span style={{ color: C.codeCmt }}># dist(A, B) = √(Σ(ai − bi)²)</span>{'\n\n'}
            <span style={{ color: C.codeKw }}>dist(Doc A, Query)</span>{' = √((1−0)² + (1−1)²) = √1 = '}<span style={{ color: C.orange }}>{eucA}</span>{'\n'}
            <span style={{ color: C.codeKw }}>dist(Doc B, Query)</span>{' = √((3−0)² + (3−1)²) = √13 = '}<span style={{ color: C.red2 }}>{eucB}</span>
          </div>
          <div style={{ marginTop: 10, padding: '8px 12px', background: `${C.red}15`, borderRadius: 6, color: C.red2, fontSize: 13 }}>
            ❌ Euclidean says Doc A ({eucA}) is much closer to "pizza" than Doc B ({eucB}).<br />
            <strong>But Doc A and Doc B have identical content!</strong> This is wrong.
          </div>
        </div>
      )}

      {showEuclid && !showCosine && (
        <div style={{ textAlign: 'center' }}>
          <Button onClick={() => setShowCosine(true)}>Now Try Cosine Similarity →</Button>
        </div>
      )}

      {showCosine && (
        <div style={{ ...card(C.bg2, C.green), borderLeft: `3px solid ${C.green}` }}>
          <div style={{ color: C.green2, fontWeight: 'bold', marginBottom: 10 }}>🔄 Cosine Similarity (angle between vectors)</div>
          <div style={{ ...codeBox, fontSize: 12 }}>
            <span style={{ color: C.codeCmt }}># cosine(A, B) = (A · B) / (|A| × |B|)</span>{'\n\n'}
            <span style={{ color: C.codeKw }}>cosine(Doc A, Query)</span>{' = (1×0 + 1×1) / (√2 × √1) = 1/√2 = '}<span style={{ color: C.green2 }}>{cosA}</span>{'\n'}
            <span style={{ color: C.codeKw }}>cosine(Doc B, Query)</span>{' = (3×0 + 3×1) / (√18 × √1) = 3/(3√2) = 1/√2 = '}<span style={{ color: C.green2 }}>{cosB}</span>
          </div>
          <div style={{ marginTop: 10, padding: '8px 12px', background: `${C.green}15`, borderRadius: 6, color: C.green2, fontSize: 13 }}>
            ✅ Cosine gives Doc A and Doc B the <strong>exact same score ({cosA})</strong> because they point in the same direction.
            Magnitude (length) cancels out. Only the angle matters.
          </div>
        </div>
      )}

      {showCosine && (
        <>
          <div style={{ ...card('#0B1521', C.purple), borderLeft: `3px solid ${C.purple}` }}>
            <div style={{ color: C.purple, fontWeight: 'bold', marginBottom: 8 }}>💡 The Core Insight</div>
            <p style={{ color: C.text2, margin: 0, fontSize: 13, lineHeight: 1.7 }}>
              Cosine similarity measures the <strong style={{ color: C.text1 }}>angle</strong> between two vectors,
              not the distance between their tips. Two vectors pointing in the same direction have cosine = 1 (identical meaning).
              Two vectors pointing in opposite directions have cosine = −1 (opposite meaning).
              <br /><br />
              <strong style={{ color: C.yellow }}>Why this matters for text:</strong> A short tweet and a long essay about
              the same topic point in the same direction in word-space. Their angle is small. Cosine catches this.
              Euclidean distance just sees one vector is longer and says they are different.
            </p>
          </div>

          <ChoiceExercise
            question='A user searches "action heroes". You have: Doc A = "Batman fights crime in Gotham" and Doc B = "Batman fights crime in Gotham Batman fights crime in Gotham Batman fights crime in Gotham". Which method gives them the same similarity score?'
            options={['Euclidean distance', 'Cosine similarity', 'Both give the same score', 'Neither works']}
            answer="Cosine similarity"
            onPass={() => { onUnlock('euclidean'); setQuizPassed(true) }}
          />
        </>
      )}

      {quizPassed && (
        <div style={{ textAlign: 'center' }}>
          <Button variant="primary" onClick={onNext}>The Cosine Formula →</Button>
        </div>
      )}
    </SpaceBetween>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — THE COSINE FORMULA + LIVE CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────

function Step3({ onUnlock, onNext }) {
  const [calcDone, setCalcDone] = useState(false)
  const [exercisePassed, setExercisePassed] = useState(false)

  // Manual step-by-step for two movie vectors (simplified 4D)
  // Inception vs Matrix — both mind-bending sci-fi
  // dims: [crime, scifi, animation, action]
  const inc = [0.2, 0.8, 0.0, 0.4]   // Inception
  const mat = [0.4, 0.9, 0.0, 0.8]   // Matrix
  const toy = [0.0, 0.1, 0.9, 0.3]   // Toy Story

  const dotIM  = inc.reduce((s, v, i) => s + v * mat[i], 0)
  const dotIT  = inc.reduce((s, v, i) => s + v * toy[i], 0)
  const magInc = Math.sqrt(inc.reduce((s, v) => s + v * v, 0))
  const magMat = Math.sqrt(mat.reduce((s, v) => s + v * v, 0))
  const magToy = Math.sqrt(toy.reduce((s, v) => s + v * v, 0))
  const cosIM  = (dotIM / (magInc * magMat)).toFixed(3)
  const cosIT  = (dotIT / (magInc * magToy)).toFixed(3)

  return (
    <SpaceBetween size="m">
      <Alert type="info" header="Step 3: The Cosine Formula">
        You now know WHY cosine similarity works. Let's look at exactly HOW the formula computes it —
        step by step, with real movie vectors.
      </Alert>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>The Formula</div>
        <div style={{ ...codeBox, textAlign: 'center', fontSize: 16, padding: '20px', lineHeight: 2.2 }}>
          <div style={{ color: C.text3, fontSize: 12, marginBottom: 8, textAlign: 'left' }}># cosine similarity between vectors A and B:</div>
          <span style={{ color: C.codeKw }}>cosine(A, B)</span>
          <span style={{ color: C.text2 }}> = </span>
          <span style={{ color: C.orange }}>A · B</span>
          <span style={{ color: C.text2 }}> / (</span>
          <span style={{ color: C.blue2 }}>|A|</span>
          <span style={{ color: C.text2 }}> × </span>
          <span style={{ color: C.blue2 }}>|B|</span>
          <span style={{ color: C.text2 }}>)</span>
          <div style={{ fontSize: 13, marginTop: 10, color: C.text3, textAlign: 'left' }}>
            <span style={{ color: C.orange }}>A · B</span> = dot product = Σ(aᵢ × bᵢ){'   '}
            <span style={{ color: C.blue2 }}>|A|</span> = magnitude = √(Σaᵢ²)
          </div>
        </div>
      </div>

      <div style={card()}>
        <div style={{ color: C.blue2, fontWeight: 'bold', marginBottom: 12 }}>
          Live Calculation: 4 semantic dimensions
        </div>
        <div style={{ color: C.text3, fontSize: 12, marginBottom: 10 }}>
          Dimensions: [crime/dark, sci-fi, animation, action] (simplified from the full 8D model)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }}>
          {[
            { title: 'Inception', vec: inc, color: C.blue },
            { title: 'The Matrix', vec: mat, color: C.green },
            { title: 'Toy Story', vec: toy, color: C.yellow },
          ].map(({ title, vec, color }) => (
            <div key={title} style={{ background: C.bg0, border: `1px solid ${color}30`, borderRadius: 8, padding: 10 }}>
              <div style={{ color: color, fontWeight: 'bold', fontSize: 12, marginBottom: 6 }}>{title}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 12, color: C.text2 }}>
                [{vec.map(v => v.toFixed(1)).join(', ')}]
              </div>
              <div style={{ marginTop: 6 }}>
                {['crime', 'sci-fi', 'anim', 'action'].map((dim, i) => (
                  <div key={dim} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ color: C.text3, fontSize: 10, width: 44 }}>{dim}</span>
                    <div style={{ flex: 1, background: C.bg2, borderRadius: 2, height: 6 }}>
                      <div style={{ width: `${vec[i] * 100}%`, height: '100%', background: color, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!calcDone ? (
          <div style={{ textAlign: 'center' }}>
            <Button onClick={() => setCalcDone(true)}>Compute Similarities →</Button>
          </div>
        ) : (
          <>
            <div style={{ ...codeBox, fontSize: 12 }}>
              <span style={{ color: C.codeCmt }}># Inception vs The Matrix</span>{'\n'}
              {'A · B   = '}{inc.map((v, i) => `${v}×${mat[i]}`).join(' + ')}{' = '}<span style={{ color: C.orange }}>{dotIM.toFixed(4)}</span>{'\n'}
              {'|A|     = √('}{inc.map(v => `${v}²`).join('+')}{')'}{' = '}<span style={{ color: C.blue2 }}>{magInc.toFixed(4)}</span>{'\n'}
              {'|B|     = √('}{mat.map(v => `${v}²`).join('+')}{')'}{' = '}<span style={{ color: C.blue2 }}>{magMat.toFixed(4)}</span>{'\n'}
              {'cosine  = '}{dotIM.toFixed(4)}{' / ('}{magInc.toFixed(4)}{' × '}{magMat.toFixed(4)}{')'}{' = '}<span style={{ color: C.green2, fontWeight: 'bold' }}>{cosIM}</span>{'\n\n'}
              <span style={{ color: C.codeCmt }}># Inception vs Toy Story</span>{'\n'}
              {'cosine  = '}<span style={{ color: C.red2, fontWeight: 'bold' }}>{cosIT}</span>
            </div>
            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ background: `${C.green}15`, border: `1px solid ${C.green}30`, borderRadius: 6, padding: 10 }}>
                <div style={{ color: C.green2, fontWeight: 'bold', fontSize: 13 }}>Inception ↔ Matrix: {cosIM}</div>
                <div style={{ color: C.text3, fontSize: 12 }}>Both mind-bending sci-fi → high similarity ✅</div>
              </div>
              <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}30`, borderRadius: 6, padding: 10 }}>
                <div style={{ color: C.red2, fontWeight: 'bold', fontSize: 13 }}>Inception ↔ Toy Story: {cosIT}</div>
                <div style={{ color: C.text3, fontSize: 12 }}>Completely different genres → low similarity ✅</div>
              </div>
            </div>
          </>
        )}
      </div>

      <Exercise
        question="The dot product of [1, 0, 1] and [1, 1, 0] is:"
        check={v => ['1', '1.0'].includes(v)}
        hint="multiply each pair: (1×1) + (0×1) + (1×0)"
        onPass={() => { onUnlock('cosine'); setExercisePassed(true) }}
      />

      {exercisePassed && (
        <div style={{ textAlign: 'center' }}>
          <Button variant="primary" onClick={onNext}>The 5 Embedding Methods →</Button>
        </div>
      )}
    </SpaceBetween>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — THE 5 EMBEDDING METHODS (TIMELINE)
// ─────────────────────────────────────────────────────────────────────────────

function Step4({ onUnlock, onNext }) {
  const [expanded, setExpanded] = useState(null)
  const [quizPassed, setQuizPassed] = useState(false)

  const METHODS = [
    {
      id: 'bow', year: '1954', name: 'Bag of Words', emoji: '🛍️', color: C.red,
      idea: 'Count how many times each word appears in a document.',
      strength: 'Simple, fast, no training needed',
      weakness: '"bank" (river) = "bank" (money). Loses meaning and word order.',
      example: '"The cat sat" → {cat:1, sat:1, the:1} → [0,1,0,0,1,0...]',
    },
    {
      id: 'tfidf', year: '1972', name: 'TF-IDF', emoji: '📊', color: C.yellow,
      idea: 'Words that appear often in this document but rarely elsewhere are more important.',
      strength: 'Weights rare, distinctive words higher, which helps find unique topics',
      weakness: 'Still a bag of words with no understanding of "car" meaning "automobile".',
      example: '"pizza" in a recipe blog: high IDF, rewarded. "the": near-zero.',
    },
    {
      id: 'w2v', year: '2013', name: 'Word2Vec', emoji: '🧠', color: C.blue,
      idea: 'Train a neural network to predict surrounding words. Words with similar contexts get similar vectors.',
      strength: 'king − man + woman ≈ queen. Captures meaning and analogies.',
      weakness: 'One fixed vector per word. "bank" gets the same vector regardless of context.',
      example: 'Trained on Google News: 3 million words, 300 dimensions each.',
    },
    {
      id: 'glove', year: '2014', name: 'GloVe', emoji: '🌐', color: C.purple,
      idea: 'Build a global word co-occurrence matrix first, then factorize it into vectors.',
      strength: 'Captures global statistics, which works better for thematic/genre similarity.',
      weakness: 'Still one fixed vector per word. Slower to train than Word2Vec.',
      example: 'Wikipedia + Gigaword: 6 billion tokens → 50/100/200/300d vectors.',
    },
    {
      id: 'ft', year: '2016', name: 'FastText', emoji: '⚡', color: C.green,
      idea: 'Break each word into character n-grams. "running" = "run" + "unn" + "nni" + "nin" + "ing".',
      strength: 'Handles typos, compound words, and words never seen during training.',
      weakness: 'Larger model size. Character noise can sometimes hurt accuracy.',
      example: '"covid" unseen at training time → still gets a vector from "cov"+"ovi"+"vid".',
    },
  ]

  return (
    <SpaceBetween size="m">
      <Alert type="info" header="Step 4: The 5 Methods (60 Years of Turning Text into Numbers)">
        Every method builds on the one before it. Each one was invented because the previous one had a critical flaw.
        Tap any card to expand the details.
      </Alert>

      {/* Timeline */}
      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 14 }}>Evolution of Text Embeddings</div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 38, top: 0, bottom: 0, width: 2, background: C.border1 }} />
          {METHODS.map((m, i) => (
            <div key={m.id} style={{ display: 'flex', gap: 14, marginBottom: 4 }}>
              <div style={{ flexShrink: 0, width: 78, textAlign: 'right', paddingTop: 12 }}>
                <span style={{ color: m.color, fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold' }}>{m.year}</span>
              </div>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', background: m.color,
                flexShrink: 0, marginTop: 14, zIndex: 1,
                boxShadow: `0 0 8px ${m.color}80`,
              }} />
              <div
                onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                style={{
                  flex: 1, background: expanded === m.id ? `${m.color}12` : C.bg2,
                  border: `1px solid ${expanded === m.id ? m.color + '60' : C.border1}`,
                  borderRadius: 8, padding: '10px 14px', cursor: 'pointer',
                  transition: 'all 0.2s', marginBottom: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{m.emoji}</span>
                  <span style={{ color: m.color, fontWeight: 'bold', fontSize: 14 }}>{m.name}</span>
                  <span style={{ color: C.text3, fontSize: 12, marginLeft: 'auto' }}>
                    {expanded === m.id ? '▲' : '▼'}
                  </span>
                </div>
                <div style={{ color: C.text3, fontSize: 12, marginTop: 4 }}>{m.idea}</div>
                {expanded === m.id && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                      <div style={{ background: `${C.green}10`, border: `1px solid ${C.green}30`, borderRadius: 6, padding: 8 }}>
                        <div style={{ color: C.green2, fontSize: 11, fontWeight: 'bold', marginBottom: 4 }}>✅ Strength</div>
                        <div style={{ color: C.text3, fontSize: 12 }}>{m.strength}</div>
                      </div>
                      <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}30`, borderRadius: 6, padding: 8 }}>
                        <div style={{ color: C.red2, fontSize: 11, fontWeight: 'bold', marginBottom: 4 }}>❌ Weakness</div>
                        <div style={{ color: C.text3, fontSize: 12 }}>{m.weakness}</div>
                      </div>
                    </div>
                    <div style={{ background: C.bg0, borderRadius: 6, padding: 8, fontFamily: 'monospace', fontSize: 11, color: C.text3 }}>
                      💡 {m.example}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ChoiceExercise
        question='A user types a word with a typo: "superheroe". Which method can still find a good vector for it?'
        options={['Bag of Words', 'TF-IDF', 'Word2Vec', 'FastText']}
        answer="FastText"
        onPass={() => { onUnlock('methods'); setQuizPassed(true) }}
      />

      {quizPassed && (
        <div style={{ textAlign: 'center' }}>
          <Button variant="primary" onClick={onNext}>Live Movie Recommender →</Button>
        </div>
      )}
    </SpaceBetween>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — LIVE MOVIE RECOMMENDER (all 5 methods)
// ─────────────────────────────────────────────────────────────────────────────

const METHOD_META = [
  { id: 'bow',      label: 'Bag of Words', color: C.red,    year: '1954' },
  { id: 'tfidf',    label: 'TF-IDF',       color: C.yellow, year: '1972' },
  { id: 'word2vec', label: 'Word2Vec',      color: C.blue,   year: '2013' },
  { id: 'glove',    label: 'GloVe',         color: C.purple, year: '2014' },
  { id: 'fasttext', label: 'FastText',      color: C.green,  year: '2016' },
]

function Step5({ onUnlock, onNext }) {
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [activeMethod, setActiveMethod] = useState('bow')
  const [tried, setTried] = useState(false)

  const recommendations = useMemo(() => {
    if (selectedIdx === null) return []
    return getRecommendations(selectedIdx, activeMethod)
  }, [selectedIdx, activeMethod])

  const handleSelect = idx => {
    setSelectedIdx(idx)
    if (!tried) { setTried(true); onUnlock('recommender') }
  }

  const genreColors = { 'Action': C.red, 'Sci-Fi': C.blue, 'Drama': C.yellow, 'Crime': C.orange, 'Animation': C.green }

  return (
    <SpaceBetween size="m">
      <Alert type="success" header="Step 5: Live Movie Recommender (All 5 Methods Side-by-Side)">
        Select any movie. See what each embedding method recommends. Notice how BoW/TF-IDF look for
        exact shared words, while Word2Vec/GloVe/FastText understand semantic meaning.
      </Alert>

      {/* Movie selector */}
      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>
          Select a movie to find similar films →
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {MOVIES.map((m, i) => {
            const gc = genreColors[m.genre] || C.text2
            return (
              <button
                key={m.id}
                onClick={() => handleSelect(i)}
                style={{
                  padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
                  border: `2px solid ${selectedIdx === i ? gc : C.border1}`,
                  background: selectedIdx === i ? `${gc}20` : C.bg2,
                  color: selectedIdx === i ? gc : C.text2,
                  fontSize: 12, fontWeight: selectedIdx === i ? 'bold' : 'normal',
                  transition: 'all 0.15s',
                }}
              >
                {m.title}
                <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 4 }}>({m.year})</span>
              </button>
            )
          })}
        </div>
      </div>

      {selectedIdx !== null && (
        <>
          {/* Method selector */}
          <div style={card()}>
            <div style={{ color: C.text3, fontSize: 12, marginBottom: 8 }}>Embedding method:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {METHOD_META.map(m => (
                <button
                  key={m.id}
                  onClick={() => setActiveMethod(m.id)}
                  style={{
                    padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
                    border: `2px solid ${activeMethod === m.id ? m.color : C.border1}`,
                    background: activeMethod === m.id ? `${m.color}20` : C.bg2,
                    color: activeMethod === m.id ? m.color : C.text3,
                    fontSize: 12, fontWeight: 'bold', transition: 'all 0.15s',
                  }}
                >
                  {m.label} <span style={{ fontWeight: 'normal', fontSize: 10 }}>{m.year}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected movie info */}
          <div style={{ ...card(C.bg2, C.border2), padding: '12px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ color: C.text1, fontWeight: 'bold', fontSize: 15 }}>
                  🎬 {MOVIES[selectedIdx].title}
                </div>
                <div style={{ color: C.text3, fontSize: 12, marginTop: 4 }}>
                  {MOVIES[selectedIdx].genre} · {MOVIES[selectedIdx].year}
                </div>
              </div>
              <div style={{ color: C.text3, fontSize: 11, fontFamily: 'monospace', maxWidth: 380, lineHeight: 1.5 }}>
                {MOVIES[selectedIdx].text.split(' ').slice(0, 8).join(', ')}...
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={card()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ color: METHOD_META.find(m => m.id === activeMethod).color, fontWeight: 'bold', fontSize: 14 }}>
                {METHOD_META.find(m => m.id === activeMethod).label} Recommendations
              </div>
              <div style={{ ...pill(METHOD_META.find(m => m.id === activeMethod).color), fontSize: 11 }}>
                {activeMethod === 'bow' && 'exact word overlap'}
                {activeMethod === 'tfidf' && 'weighted word overlap'}
                {activeMethod === 'word2vec' && 'neural context similarity'}
                {activeMethod === 'glove' && 'global co-occurrence'}
                {activeMethod === 'fasttext' && 'character-level similarity'}
              </div>
            </div>

            {recommendations.slice(0, 5).map((rec, rank) => {
              const mc = genreColors[rec.movie.genre] || C.text2
              const methodColor = METHOD_META.find(m => m.id === activeMethod).color
              const barWidth = Math.round(rec.sim * 100)
              return (
                <div key={rec.movie.id} style={{
                  background: C.bg2, border: `1px solid ${C.border1}`,
                  borderRadius: 8, padding: '10px 14px', marginBottom: 6,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ color: C.text3, fontFamily: 'monospace', fontSize: 12, minWidth: 20 }}>
                      #{rank + 1}
                    </span>
                    <span style={{ color: C.text1, fontWeight: 'bold', fontSize: 13, flex: 1 }}>
                      {rec.movie.title}
                    </span>
                    <span style={{ ...pill(mc), fontSize: 11 }}>{rec.movie.genre}</span>
                    <span style={{ color: methodColor, fontFamily: 'monospace', fontSize: 13, fontWeight: 'bold', minWidth: 48, textAlign: 'right' }}>
                      {rec.sim.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ background: C.bg0, borderRadius: 3, height: 5 }}>
                    <div style={{
                      width: `${barWidth}%`, height: '100%',
                      background: `linear-gradient(90deg, ${methodColor}80, ${methodColor})`,
                      borderRadius: 3, transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Insight callout */}
          <div style={{ ...card('#0B1521', C.blue), borderLeft: `3px solid ${C.blue}` }}>
            <div style={{ color: C.blue2, fontWeight: 'bold', marginBottom: 6, fontSize: 13 }}>💡 Try This</div>
            <p style={{ color: C.text2, margin: 0, fontSize: 13, lineHeight: 1.6 }}>
              Select <strong style={{ color: C.text1 }}>Inception</strong>, then compare all 5 methods.
              BoW and TF-IDF will find movies sharing exact words from its description.
              Word2Vec, GloVe, and FastText understand that Inception, The Matrix, and Interstellar
              all live in the same "mind-bending sci-fi" region of semantic space, even when
              they share few exact words.
            </p>
          </div>
        </>
      )}

      {tried && (
        <div style={{ textAlign: 'center' }}>
          <Button variant="primary" onClick={onNext}>Compare the Methods →</Button>
        </div>
      )}
    </SpaceBetween>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 — METHOD COMPARISON
// ─────────────────────────────────────────────────────────────────────────────

function Step6({ onUnlock, onNext }) {
  const [quizPassed, setQuizPassed] = useState(false)

  return (
    <SpaceBetween size="m">
      <Alert type="info" header="Step 6: When Each Method Wins">
        No embedding method is best in every situation. The right choice depends on your data,
        your query type, and whether you need to handle unseen words.
      </Alert>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 12 }}>Method Comparison Table</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: 'monospace', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border1}` }}>
                {['Method', 'Understands Meaning', 'Handles Unseen Words', 'Best For', 'Fails On'].map(h => (
                  <th key={h} style={{ color: C.text3, padding: '6px 10px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['🛍️ BoW',      '❌ No',  '❌ No',  'Simple text classification', '"car" ≠ "automobile"'],
                ['📊 TF-IDF',   '❌ No',  '❌ No',  'Search with exact keywords', 'Synonyms, paraphrasing'],
                ['🧠 Word2Vec', '✅ Yes', '❌ No',  'Semantic search, analogies', 'OOV words, short texts'],
                ['🌐 GloVe',    '✅ Yes', '❌ No',  'Genre/topic classification', 'OOV words, rare domains'],
                ['⚡ FastText',  '✅ Yes', '✅ Yes', 'Noisy text, social media, typos', 'Very large vocabularies'],
              ].map(([method, meaning, unseen, best, fails], i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border1}30` }}>
                  <td style={{ color: C.text1, padding: '8px 10px', fontWeight: 'bold' }}>{method}</td>
                  <td style={{ padding: '8px 10px', color: meaning.startsWith('✅') ? C.green2 : C.red2 }}>{meaning}</td>
                  <td style={{ padding: '8px 10px', color: unseen.startsWith('✅') ? C.green2 : C.red2 }}>{unseen}</td>
                  <td style={{ color: C.text2, padding: '8px 10px' }}>{best}</td>
                  <td style={{ color: C.text3, padding: '8px 10px' }}>{fails}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ ...card('#0B1521', C.purple), borderLeft: `3px solid ${C.purple}` }}>
        <div style={{ color: C.purple, fontWeight: 'bold', marginBottom: 8 }}>💡 What Comes After FastText?</div>
        <p style={{ color: C.text2, margin: 0, fontSize: 13, lineHeight: 1.6 }}>
          All five methods give each word <strong style={{ color: C.text1 }}>one fixed vector</strong>.
          The word "bank" always gets the same vector, whether it means a riverbank or a financial institution.
          <br /><br />
          This is exactly the gap the <strong style={{ color: C.yellow }}>Transformer architecture</strong> fills.
          Self-attention assigns different vectors to the same word based on its surrounding context.
          <em style={{ color: C.text3 }}> That is what the next session covers.</em>
        </p>
      </div>

      <ChoiceExercise
        question='A startup processes user-generated content: slang, abbreviations, typos ("gr8 movie!!"). Which embedding method handles this best?'
        options={['Bag of Words', 'TF-IDF', 'GloVe', 'FastText']}
        answer="FastText"
        onPass={() => { onUnlock('analyst'); setQuizPassed(true) }}
      />

      {quizPassed && (
        <div style={{ textAlign: 'center' }}>
          <Button variant="primary" onClick={onNext}>Python Code →</Button>
        </div>
      )}
    </SpaceBetween>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 7 — PYTHON CODE + GITHUB
// ─────────────────────────────────────────────────────────────────────────────

function Step7({ onUnlock, onNext }) {
  useEffect(() => { onUnlock('coder') }, [])

  const NOTEBOOKS = [
    {
      num: '01', title: 'Text to Numbers',
      desc: 'BoW → TF-IDF → Word2Vec → GloVe → FastText from scratch. Full implementations with cosine similarity.',
      time: '60 min',
      colab: 'https://colab.research.google.com/github/nursnaaz/zero-to-genai-engineer/blob/main/01_text_to_numbers/notebooks/01_text_to_numbers.ipynb',
      github: 'https://github.com/nursnaaz/zero-to-genai-engineer/blob/main/01_text_to_numbers/notebooks/01_text_to_numbers.ipynb',
    },
    {
      num: '02', title: 'Cosine Similarity',
      desc: 'Why cosine similarity works: geometric intuition, the length problem, and full implementation.',
      time: '30 min',
      colab: 'https://colab.research.google.com/github/nursnaaz/zero-to-genai-engineer/blob/main/01_text_to_numbers/notebooks/02_cosine_similarity.ipynb',
      github: 'https://github.com/nursnaaz/zero-to-genai-engineer/blob/main/01_text_to_numbers/notebooks/02_cosine_similarity.ipynb',
    },
  ]

  return (
    <SpaceBetween size="m">
      <Alert type="info" header="Step 7: Run It Yourself in Python">
        The interactive demo proved the concepts. Now run the real implementations —
        all 5 embedding methods with full cosine similarity math in Python.
      </Alert>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>Cosine Similarity: Pure Python (no libraries)</div>
        <div style={codeBox}>
          <span style={{ color: C.codeCmt }}># The exact formula from Step 3, runs anywhere</span>{'\n'}
          <span style={{ color: C.codeKw }}>import</span>{' math\n\n'}
          <span style={{ color: C.codeKw }}>def</span>{' '}<span style={{ color: C.codeStr }}>cosine_similarity</span>{'(a, b):\n'}
          {'    dot   = '}<span style={{ color: C.codeKw }}>sum</span>{'(ai * bi '}<span style={{ color: C.codeKw }}>for</span>{' ai, bi '}<span style={{ color: C.codeKw }}>in</span>{' '}<span style={{ color: C.codeKw }}>zip</span>{'(a, b))\n'}
          {'    mag_a = math.sqrt('}<span style={{ color: C.codeKw }}>sum</span>{'(ai**2 '}<span style={{ color: C.codeKw }}>for</span>{' ai '}<span style={{ color: C.codeKw }}>in</span>{' a))\n'}
          {'    mag_b = math.sqrt('}<span style={{ color: C.codeKw }}>sum</span>{'(bi**2 '}<span style={{ color: C.codeKw }}>for</span>{' bi '}<span style={{ color: C.codeKw }}>in</span>{' b))\n'}
          {'    '}<span style={{ color: C.codeKw }}>return</span>{' dot / (mag_a * mag_b) '}<span style={{ color: C.codeCmt }}># = cos(angle between A and B)</span>{'\n\n'}
          <span style={{ color: C.codeCmt }}># Example</span>{'\n'}
          <span style={{ color: C.codeKw }}>print</span>{'(cosine_similarity([1, 0, 1], [1, 1, 0]))  '}<span style={{ color: C.codeCmt }}># → 0.5</span>
        </div>
      </div>

      <div style={{ ...card('#0D1321', C.border2) }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <div>
            <div style={{ color: C.text1, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Run the Full Movie Recommender in Python</div>
            <div style={{ color: C.text3, fontSize: 12 }}>FastAPI backend + React frontend with all 5 embedding methods and real IMDB data.</div>
          </div>
          <a href="https://github.com/nursnaaz/zero-to-genai-engineer/tree/main/01_text_to_numbers"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 6,
              border: `1px solid ${C.border2}`, background: C.bg1,
              color: C.text2, fontSize: 12, fontWeight: 600, textDecoration: 'none', flexShrink: 0,
            }}>
            <span style={{ fontSize: 14 }}>⭐</span> View on GitHub
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {NOTEBOOKS.map(nb => (
            <div key={nb.num} style={{ background: C.bg2, border: `1px solid ${C.border2}`, borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <span style={{ color: C.text3, fontFamily: 'monospace', fontSize: 11 }}>Notebook {nb.num}</span>
                <span style={{ color: C.text3, fontSize: 11 }}>⏱ {nb.time}</span>
              </div>
              <div style={{ color: C.text1, fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{nb.title}</div>
              <div style={{ color: C.text3, fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>{nb.desc}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={nb.colab} target="_blank" rel="noopener noreferrer"
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '7px 0', borderRadius: 5, textDecoration: 'none', fontSize: 12, fontWeight: 600,
                    background: `${C.orange}22`, border: `1px solid ${C.orange}60`, color: C.orange,
                  }}>
                  <span>▶</span> Open in Colab
                </a>
                <a href={nb.github} target="_blank" rel="noopener noreferrer"
                  style={{
                    padding: '7px 12px', borderRadius: 5, textDecoration: 'none', fontSize: 12, fontWeight: 600,
                    background: C.bg1, border: `1px solid ${C.border2}`, color: C.text2,
                  }}>
                  GitHub
                </a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6,
          background: `${C.green}10`, border: `1px solid ${C.green}30`, color: C.text3, fontSize: 12 }}>
          No API key needed. Everything runs on Python, numpy, and gensim. Works in Google Colab or locally.
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Button variant="primary" onClick={onNext}>Share What You Learned →</Button>
      </div>
    </SpaceBetween>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LINKEDIN POST + TUTORIAL URL
// ─────────────────────────────────────────────────────────────────────────────

const TUTORIAL_URL = 'https://nursnaaz.github.io/tutorial/cosine-similarity-movie-recommender'

const LINKEDIN_POST = `I just learned something that changed how I think about NLP.

Why do we use cosine similarity instead of Euclidean distance for text?

Here's the key insight:

Copy-paste a document twice. It's now twice as long.
Euclidean distance says it's VERY different from the original.
Cosine similarity says they're IDENTICAL.

Which one is correct for meaning? Cosine. Always.

This led me to build a movie recommender that compares ALL 5 ways humans have turned text into numbers:

① Bag of Words (1954): counts words, loses all meaning and word order
② TF-IDF (1972): weights rare words higher, still misses synonyms
③ Word2Vec (2013): neural network learns that "king minus man plus woman equals queen"
④ GloVe (2014): global co-occurrence statistics capture topic and genre
⑤ FastText (2016): works on word fragments, handles typos and unseen words

Each method finds different "similar" movies for the same query. Now I understand exactly why.

The interactive demo runs in your browser with no signup and no install.

→ ${TUTORIAL_URL}

Full Python implementation (FastAPI + notebooks):
→ https://github.com/nursnaaz/zero-to-genai-engineer/tree/main/01_text_to_numbers

What concept in AI surprised you most when you finally understood the math behind it?

#MachineLearning #NLP #AI #TextEmbeddings #CosineSimilarity #MovieRecommender #GenAI #DataScience`

// ─────────────────────────────────────────────────────────────────────────────
// STEP 8 — SUMMARY + LINKEDIN
// ─────────────────────────────────────────────────────────────────────────────

function Step8({ onUnlock, unlockedBadges, xp, onRestart }) {
  const [copied, setCopied]             = useState(false)
  const [linkedInReady, setLinkedInReady] = useState(false)

  useEffect(() => { onUnlock('amplifier') }, [])

  const totalXP     = BADGES.reduce((s, b) => s + b.xp, 0)
  const earnedCount = unlockedBadges.length
  const pct         = Math.round((xp / totalXP) * 100)

  const handleCopy = () => {
    navigator.clipboard.writeText(LINKEDIN_POST).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  const handleLinkedIn = () => {
    navigator.clipboard.writeText(LINKEDIN_POST).then(() => {
      setLinkedInReady(true)
      setTimeout(() => setLinkedInReady(false), 6000)
      window.open('https://www.linkedin.com/feed/', '_blank', 'noopener,noreferrer')
    })
  }

  return (
    <SpaceBetween size="m">

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #0D1B2A 0%, #0B1F12 100%)`,
        border: `1px solid ${C.border2}`, borderRadius: 12, padding: '28px 24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ color: C.text3, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
              Tutorial Complete
            </div>
            <h2 style={{ color: C.text1, margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>What You Built Today</h2>
            <p style={{ color: C.text2, margin: 0, fontSize: 14 }}>
              A working movie recommender powered by all 5 text embedding methods.
            </p>
          </div>
          <div style={{
            background: C.bg2, border: `1px solid ${C.border2}`,
            borderRadius: 10, padding: '12px 20px', textAlign: 'center', flexShrink: 0,
          }}>
            <div style={{ color: C.text3, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Progress</div>
            <div style={{ color: C.orange, fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{pct}%</div>
            <div style={{ color: C.text3, fontSize: 11, marginTop: 3 }}>{xp} / {totalXP} XP earned</div>
            <div style={{ color: C.text3, fontSize: 11 }}>{earnedCount} of {BADGES.length} badges</div>
          </div>
        </div>
      </div>

      {/* What you can now explain */}
      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 14, fontSize: 14 }}>
          You can now explain all of this from first principles
        </div>
        <div style={codeBox}>
          {[
            ['bow_vec(text, vocab)',      '→ list[int]',  'Count each vocab word, O(n) per doc'],
            ['tfidf_vec(text, corpus)',   '→ list[float]','tf × log(N/df), rewards rare specific words'],
            ['word2vec(corpus)',          '→ 300d vectors','Local context window → learns analogies'],
            ['glove(corpus)',             '→ 50-300d',    'Global co-occurrence matrix factorization'],
            ['fasttext(corpus)',          '→ 300d vectors','Character n-grams → handles OOV words'],
            ['cosine_similarity(a, b)',   '→ float [0,1]','(a·b) / (|a||b|), angle not distance'],
          ].map(([fn, ret, desc]) => (
            <div key={fn} style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 7 }}>
              <span style={{ color: C.codeKw, fontFamily: 'monospace', fontSize: 12, minWidth: 220 }}>{fn}</span>
              <span style={{ color: C.codeStr, fontFamily: 'monospace', fontSize: 12, minWidth: 100 }}>{ret}</span>
              <span style={{ color: C.codeCmt, fontSize: 12 }}># {desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key insight recap */}
      <div style={{ ...card(C.bg2, C.purple), borderLeft: `3px solid ${C.purple}` }}>
        <div style={{ color: C.purple, fontWeight: 'bold', marginBottom: 8, fontSize: 14 }}>
          The Limit You Found: What Is Next
        </div>
        <p style={{ color: C.text2, margin: '0 0 8px', fontSize: 13, lineHeight: 1.6 }}>
          All five methods give each word <strong style={{ color: C.text1 }}>one fixed vector</strong>.
          "Bank" (river) and "bank" (finance) always get the same vector.
        </p>
        <p style={{ color: C.text2, margin: 0, fontSize: 13, lineHeight: 1.6 }}>
          The <strong style={{ color: C.yellow }}>Transformer attention mechanism</strong> solves this:
          the vector for "bank" changes based on the words around it.
          That context-dependence is the foundation of BERT, GPT, and every modern LLM.
        </p>
      </div>

      {/* LinkedIn post */}
      <div style={{ ...card(C.bg2, C.border2), border: `1px solid ${C.border2}` }}>
        <div style={{ color: C.text1, fontWeight: 'bold', marginBottom: 6, fontSize: 14 }}>
          Show Your Network What You Now Understand
        </div>
        <p style={{ color: C.text3, fontSize: 13, margin: '0 0 14px', lineHeight: 1.5 }}>
          This post demonstrates real understanding, not just "I finished a course."
          Add one personal insight before posting. Your version always lands better than a generic copy.
        </p>

        <div style={{
          ...codeBox, fontSize: 12, lineHeight: 1.7, whiteSpace: 'pre-wrap',
          color: C.text2, marginBottom: 14, maxHeight: 220, overflowY: 'auto',
        }}>
          {LINKEDIN_POST}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={handleCopy} style={{
            padding: '9px 20px', borderRadius: 6, cursor: 'pointer',
            border: `1px solid ${copied ? C.green : C.border2}`,
            background: copied ? '#0A1F14' : C.bg1,
            color: copied ? C.green2 : C.text1,
            fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
          }}>
            {copied ? '✓ Copied' : 'Copy post text'}
          </button>
          <button onClick={handleLinkedIn} style={{
            padding: '9px 20px', borderRadius: 6, cursor: 'pointer',
            border: `1px solid ${C.blue}60`,
            background: `${C.blue}18`, color: C.blue2,
            fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
          }}>
            Copy &amp; Open LinkedIn →
          </button>
        </div>

        {linkedInReady && (
          <div style={{
            marginTop: 10, padding: '8px 14px', borderRadius: 6,
            background: `${C.blue}12`, border: `1px solid ${C.blue}40`,
            color: C.blue2, fontSize: 13,
          }}>
            Text copied. Paste it in LinkedIn with <strong>Ctrl+V</strong> (or <strong>⌘V</strong> on Mac)
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', paddingTop: 4 }}>
        <Button onClick={onRestart}>Restart Tutorial</Button>
      </div>

      <style>{`
        @keyframes toastIn {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </SpaceBetween>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// ROOT COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

export function CosineSimilarityMovieRecommender({ onStepChange }) {
  const [step, setStep]                     = useState(0)
  const [xp, setXp]                         = useState(0)
  const [unlockedBadges, setUnlockedBadges] = useState([])
  const [toast, setToast]                   = useState(null)

  const TOTAL_STEPS = 9

  useEffect(() => { onStepChange?.(step, TOTAL_STEPS) }, [step, onStepChange])

  const unlock = useCallback((badgeId) => {
    setUnlockedBadges(prev => {
      if (prev.includes(badgeId)) return prev
      const badge = BADGES.find(b => b.id === badgeId)
      if (!badge) return prev
      setXp(x => x + badge.xp)
      setToast(badge)
      return [...prev, badgeId]
    })
  }, [])

  const next    = () => { setStep(s => Math.min(s + 1, TOTAL_STEPS - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const restart = () => { setStep(0); setXp(0); setUnlockedBadges([]); setToast(null) }

  const stepTitles = [
    'The Problem', 'Text as Vectors', 'The Length Problem',
    'Cosine Formula', '5 Methods', 'Live Recommender',
    'Method Comparison', 'Python Code', 'What You Built',
  ]

  const steps = [
    <Step0 onUnlock={unlock} onNext={next} />,
    <Step1 onUnlock={unlock} onNext={next} />,
    <Step2 onUnlock={unlock} onNext={next} />,
    <Step3 onUnlock={unlock} onNext={next} />,
    <Step4 onUnlock={unlock} onNext={next} />,
    <Step5 onUnlock={unlock} onNext={next} />,
    <Step6 onUnlock={unlock} onNext={next} />,
    <Step7 onUnlock={unlock} onNext={next} />,
    <Step8 onUnlock={unlock} unlockedBadges={unlockedBadges} xp={xp} onRestart={restart} />,
  ]

  return (
    <SpaceBetween size="m">
      {toast && <Toast badge={toast} onDone={() => setToast(null)} />}

      {/* Progress bar + XP + badge strip */}
      <div style={{
        background: `linear-gradient(135deg, ${C.bg2} 0%, #131B26 100%)`,
        border: `1px solid ${C.border2}`,
        borderRadius: 10, padding: '12px 16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ color: C.text2, fontSize: 13 }}>
            Step {step + 1} of {TOTAL_STEPS}{' '}
            <strong style={{ color: C.text1 }}>— {stepTitles[step]}</strong>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ color: C.orange, fontWeight: 'bold', fontSize: 14 }}>⚡ {xp} XP</span>
            <div style={{ display: 'flex', gap: 2 }}>
              {BADGES.map(b => (
                <span key={b.id} title={`${b.title} (+${b.xp} XP)`}
                  style={{ fontSize: 15, opacity: unlockedBadges.includes(b.id) ? 1 : 0.15, transition: 'opacity 0.3s' }}>
                  {b.emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: C.bg0, borderRadius: 4, height: 6 }}>
          <div style={{
            width: `${((step + 1) / TOTAL_STEPS) * 100}%`,
            height: '100%', background: `linear-gradient(90deg, ${C.blue} 0%, ${C.orange} 100%)`,
            borderRadius: 4, transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {steps[step]}
    </SpaceBetween>
  )
}
