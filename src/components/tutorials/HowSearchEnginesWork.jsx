import { useState, useEffect, useCallback } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Button from '@cloudscape-design/components/button'
import Alert from '@cloudscape-design/components/alert'
import Input from '@cloudscape-design/components/input'

// ─────────────────────────────────────────────────────────────────────────────
// EXACT PIPELINE FROM NOTEBOOK (01_search_engine.ipynb)
// ─────────────────────────────────────────────────────────────────────────────

const DOCUMENTS = {
  S1:  'The best homemade pizza recipe for beginners',
  S2:  'How to make the best pizza dough from scratch recipe',
  S3:  'Top 10 tips for baking pizza at home for beginners',
  S4:  'Easy pasta recipes and Italian cooking techniques',
  S5:  'A guide to building your own outdoor pizza oven in summer',
  S6:  'The history of pizza from Naples to New York for foodies',
  S7:  'Healthy meal prep ideas and cooking tips for temperature control',
  S8:  'Best wood-fired pizza restaurants in the best cities',
  S9:  'How to choose the right flour for homemade bread and pizza',
  S10: 'Italian cheese varieties and their uses in traditional cooking',
  // Non-food documents — a real search engine must ignore these for food queries
  S11: 'Introduction to machine learning algorithms for beginners',
  S12: 'How blockchain technology works in decentralized networks',
  S13: 'The rise of remote work and digital nomad culture worldwide',
  S14: 'Electric vehicle adoption and battery technology advances',
  S15: 'Climate change solutions through renewable energy and solar innovation',
}

const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at',
  'to','for','of','is','it','from','how','your',
  'their','own','that','this',
])

// Rule-based stemmer — same as notebook STEM_RULES dict
const STEM_RULES = {
  recipes:'recip', recipe:'recip', baking:'bake',
  cooking:'cook', homemade:'homemad', beginners:'beginn',
  building:'build', cities:'citi', varieties:'varieti',
  ideas:'idea', techniques:'techniqu', traditional:'tradit',
  restaurants:'restaur', healthy:'healthi', uses:'use',
  tips:'tip', choose:'choos', fired:'fire',
  // S11–S15 vocabulary
  introduction:'introduct', machine:'machin', learning:'learn',
  algorithms:'algorithm', technology:'technolog', works:'work',
  decentralized:'decentral', networks:'network',
  remote:'remot', digital:'digit', culture:'cultur', worldwide:'worldwid',
  electric:'electr', vehicle:'vehicl', adoption:'adopt',
  battery:'batteri', advances:'advanc',
  climate:'climat', change:'chang', solutions:'solut',
  renewable:'renew', energy:'energi', innovation:'innov',
}

// Pipeline functions — JS equivalents of notebook Python
const tokenise        = text => text.toLowerCase().split(/\s+/)
const removeStopWords = tokens => tokens.filter(t => !STOP_WORDS.has(t))
const stem            = token => STEM_RULES[token] || token
const process         = text => tokenise(text).filter(t => !STOP_WORDS.has(t)).map(stem)

// Pre-compute all processed documents (same as notebook's `processed` dict)
const PROCESSED = Object.fromEntries(
  Object.entries(DOCUMENTS).map(([id, text]) => [id, process(text)])
)

// Build inverted index (same as notebook's defaultdict(set))
const INVERTED_INDEX = {}
Object.entries(PROCESSED).forEach(([docId, terms]) => {
  terms.forEach(term => {
    if (!INVERTED_INDEX[term]) INVERTED_INDEX[term] = []
    if (!INVERTED_INDEX[term].includes(docId)) INVERTED_INDEX[term].push(docId)
  })
})

// TF-IDF functions — exact match to notebook
function tf(term, docTerms) {
  return docTerms.filter(t => t === term).length / docTerms.length
}
function idf(term) {
  const df = Object.values(PROCESSED).filter(terms => terms.includes(term)).length
  const N  = Object.keys(PROCESSED).length  // total documents (dynamic — grows with corpus)
  return df > 0 ? Math.log(N / df) : 0
}
function runSearch(queryText) {
  const queryTerms = process(queryText)
  const candidates = new Set()
  queryTerms.forEach(t => (INVERTED_INDEX[t] || []).forEach(d => candidates.add(d)))
  const scores = {}
  candidates.forEach(docId => {
    scores[docId] = queryTerms.reduce((s, t) => s + tf(t, PROCESSED[docId]) * idf(t), 0)
  })
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([docId, score]) => ({ docId, score, text: DOCUMENTS[docId] }))
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML SAMPLE — what a web crawler downloads for S1
// ─────────────────────────────────────────────────────────────────────────────

const SAMPLE_HTML_S1 = `<!DOCTYPE html>
<html>
  <head>
    <title>FoodFind - Best Pizza Recipes</title>
    <meta name="keywords" content="pizza,homemade,beginner">
    <style>body { font-family: Arial; color: #333; }</style>
  </head>
  <body>
    <nav><a href="/">Home</a> | <a href="/recipes">Recipes</a></nav>
    <article>
      <h1>The best homemade pizza recipe for beginners</h1>
      <p class="summary">Learn to make authentic pizza from scratch!</p>
    </article>
    <footer>© FoodFind 2024. All rights reserved.</footer>
    <script>
      ga('send', 'pageview', '/recipe/pizza');
    </script>
  </body>
</html>`

// ─────────────────────────────────────────────────────────────────────────────
// BADGE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

const BADGES = [
  { id: 'mission',   emoji: '🎯', title: 'Mission Accepted',  xp: 5,  step: 0 },
  { id: 'explorer',  emoji: '👁️',  title: 'Data Explorer',     xp: 10, step: 1 },
  { id: 'tokenizer', emoji: '✂️',  title: 'Tokenizer',         xp: 20, step: 2 },
  { id: 'noise',     emoji: '🔇', title: 'Noise Canceller',   xp: 20, step: 3 },
  { id: 'stemmer',   emoji: '🌱', title: 'Stemmer',            xp: 20, step: 4 },
  { id: 'indexer',   emoji: '📚', title: 'Indexer',            xp: 30, step: 5 },
  { id: 'math',      emoji: '🧮', title: 'Math Wizard',        xp: 40, step: 6 },
  { id: 'engineer',  emoji: '🔍', title: 'Search Engineer',    xp: 50, step: 7 },
  { id: 'thinker',   emoji: '💡', title: 'Critical Thinker',   xp: 15, step: 8 },
  { id: 'master',    emoji: '🏆', title: 'Master Builder',     xp: 15, step: 9 },
]

// ─────────────────────────────────────────────────────────────────────────────
// SHARED STYLE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Amazon + Google Professional Color Palette
// Amazon: dark navy (#0D1117, #161B22) + orange (#FF9900)
// Google: Blue (#4285F4), Green (#34A853), Red (#EA4335), Yellow (#FBBC04)
const C = {
  bg0:     '#0D1117',  // code blocks / darkest
  bg1:     '#161B22',  // base card
  bg2:     '#1C2331',  // elevated card
  border1: '#21303F',  // default border
  border2: '#2D4460',  // highlighted border
  text1:   '#E6EDF3',  // primary text
  text2:   '#8B9AAB',  // secondary text
  text3:   '#4A6280',  // muted text
  orange:  '#FF9900',  // Amazon orange — badges, XP, section titles
  orange2: '#FFB347',  // lighter orange
  blue:    '#4285F4',  // Google Blue — primary interactive
  blue2:   '#7BAAFF',  // lighter blue
  green:   '#34A853',  // Google Green — success
  green2:  '#4ECC6F',  // lighter green
  red:     '#EA4335',  // Google Red — errors, stop words
  red2:    '#FF7B72',  // lighter red
  yellow:  '#FBBC04',  // Google Yellow — warning
  purple:  '#8B5CF6',  // purple — index, pipeline
  codeKw:  '#5BB8FF',  // code keywords (def, import)
  codeStr: '#4ECC6F',  // code strings
  codeCmt: '#4A6280',  // code comments
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
// EXERCISE: text input answer
// ─────────────────────────────────────────────────────────────────────────────

function Exercise({ question, check, hint, onPass }) {
  const [val, setVal] = useState('')
  const [state, setState] = useState('idle')
  const [tries, setTries] = useState(0)

  const handleCheck = () => {
    setTries(n => n + 1)
    if (check(val.trim())) {
      setState('correct')
      onPass()
    } else {
      setState('wrong')
    }
  }

  return (
    <div style={{ ...card(C.bg2, C.blue), marginTop: 8 }}>
      <div style={{ color: C.blue2, fontWeight: 'bold', marginBottom: 8 }}>✏️ Exercise</div>
      <div style={{ color: C.text1, marginBottom: 12, whiteSpace: 'pre-line' }}>{question}</div>
      {state !== 'correct' ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Input
            value={val}
            onChange={({ detail }) => { setVal(detail.value); setState('idle') }}
            placeholder="Your answer..."
            onKeyDown={({ detail }) => detail.key === 'Enter' && handleCheck()}
          />
          <Button variant="primary" onClick={handleCheck}>Check</Button>
        </div>
      ) : (
        <div style={{ color: C.green2, fontWeight: 'bold', fontSize: 15 }}>✅ Correct!</div>
      )}
      {state === 'wrong' && (
        <div style={{ color: C.red2, marginTop: 8, fontSize: 13 }}>
          ❌ {tries >= 2 ? `Hint: ${hint}` : 'Not quite — try again!'}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE: multiple choice
// ─────────────────────────────────────────────────────────────────────────────

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
          const isCorrect = done && opt === answer
          const isWrong = isSelected && opt !== answer
          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              style={{
                padding: '8px 18px', borderRadius: 6,
                cursor: done ? 'default' : 'pointer',
                border: `2px solid ${isCorrect ? C.green2 : isWrong ? C.red2 : isSelected ? C.blue : C.border1}`,
                background: isCorrect ? '#0A1F14' : isWrong ? '#1F0D0A' : isSelected ? '#0F1E3D' : C.bg2,
                color: C.text1, fontSize: 14, fontFamily: 'monospace', transition: 'all 0.15s',
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {done && <div style={{ color: C.green2, fontWeight: 'bold', marginTop: 10 }}>✅ Exactly right!</div>}
      {selected && !done && selected !== answer && (
        <div style={{ color: C.red2, marginTop: 8, fontSize: 13 }}>❌ Not quite — try again!</div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BADGE TOAST
// ─────────────────────────────────────────────────────────────────────────────

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

// ═════════════════════════════════════════════════════════════════════════════
// PIPELINE JOURNEY — shows S1 transforming through every step in real time
// ═════════════════════════════════════════════════════════════════════════════

function PipelineJourney({ step }) {
  const s1Raw      = tokenise(DOCUMENTS.S1)
  const s1Filtered = removeStopWords(s1Raw)
  const s1Stemmed  = PROCESSED.S1

  const stages = [
    {
      num: '① HTML → Text', color: C.purple, show: step >= 1,
      content: (
        <span style={{ color: C.blue2, fontFamily: 'monospace', fontSize: 12 }}>
          "The best homemade pizza recipe for beginners"
        </span>
      ),
    },
    {
      num: '② Tokenize', color: C.blue, show: step >= 2,
      content: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {s1Raw.map((t, i) => <span key={i} style={pill(C.blue)}>{t}</span>)}
          <span style={{ color: '#475569', fontSize: 11, alignSelf: 'center', marginLeft: 4 }}>→ {s1Raw.length} tokens</span>
        </div>
      ),
    },
    {
      num: '③ Stop Words', color: C.red, show: step >= 3,
      content: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {s1Raw.map((t, i) => (
            <span key={i} style={pill(STOP_WORDS.has(t) ? C.red : C.green)}>
              {STOP_WORDS.has(t) ? <s>{t}</s> : t}
            </span>
          ))}
          <span style={{ color: '#475569', fontSize: 11, alignSelf: 'center', marginLeft: 4 }}>→ {s1Filtered.length} remain</span>
        </div>
      ),
    },
    {
      num: '④ Stem', color: C.green, show: step >= 4,
      content: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {s1Stemmed.map((t, i) => <span key={i} style={pill(C.green)}>{t}</span>)}
        </div>
      ),
    },
    {
      num: '⑤ Inverted Index', color: C.purple, show: step >= 5,
      content: (
        <span style={{ color: C.blue2, fontFamily: 'monospace', fontSize: 12 }}>
          pizza→[S1,S2,S3,S5,S6,S8,S9] &nbsp; recip→[S1,S2,S4] &nbsp; best→[S1,S2,S8]
        </span>
      ),
    },
    {
      num: '⑥ TF-IDF Score', color: C.orange, show: step >= 6,
      content: (
        <span style={{ color: C.yellow, fontFamily: 'monospace', fontSize: 12 }}>
          S1 query="best pizza recipe": 0.3219 + 0.1524 + 0.3219 = <strong>0.7962</strong>
        </span>
      ),
    },
    {
      num: '⑦ Ranked Result', color: C.green2, show: step >= 7,
      content: (
        <span style={{ color: C.green2, fontFamily: 'monospace', fontSize: 12 }}>
          #1 S1 (0.7962) — "The best homemade pizza recipe for beginners" ✅
        </span>
      ),
    },
  ]

  const activeStages = stages.filter(s => s.show)
  if (activeStages.length === 0) return null

  return (
    <div style={{
      background: '#080f1e', border: '1px solid #1e293b',
      borderRadius: 8, padding: '10px 14px',
    }}>
      <div style={{ color: C.border1, fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        📍 Pipeline Journey — S1 transformation so far
      </div>
      {activeStages.map(({ num, color, content }) => (
        <div key={num} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
          <span style={{
            background: color + '15', color, border: `1px solid ${color}40`,
            borderRadius: 4, padding: '1px 8px', fontSize: 11, whiteSpace: 'nowrap',
            flexShrink: 0, minWidth: 130, textAlign: 'center',
          }}>
            {num}
          </span>
          <div style={{ flex: 1, paddingTop: 2 }}>{content}</div>
        </div>
      ))}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 0 — MISSION BRIEF
// ═════════════════════════════════════════════════════════════════════════════

function Step0({ onUnlock, onNext }) {
  const [accepted, setAccepted] = useState(false)
  return (
    <SpaceBetween size="m">
      <div style={{ ...card(C.bg2, C.border2), padding: '12px 18px', borderLeft: `3px solid ${C.orange}` }}>
        <span style={{ color: C.text3, fontSize: 13 }}>
          Google runs <strong style={{ color: C.orange }}>8.5 billion searches per day</strong> using
          the same 7-step pipeline you are about to build. Every search bar you have ever used works this way.
        </span>
      </div>

      <div style={{ ...card('#0B1C10', C.green), textAlign: 'center', padding: 32 }}>
        <div style={{ fontSize: 56 }}>🍕</div>
        <h2 style={{ color: C.green2, margin: '12px 0 6px' }}>FoodFind.com has hired you!</h2>
        <p style={{ color: C.green2, fontSize: 15, margin: 0 }}>
          You are their first <strong>Search Engineer</strong>.
        </p>
      </div>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>📋 Your Mission</div>
        <p style={{ color: C.text2, margin: '0 0 8px' }}>
          FoodFind has <strong style={{ color: C.text1 }}>15 articles</strong> in their database —
          10 food recipes and guides, plus 5 general-interest topics.
          Users type queries like <em style={{ color: C.codeKw }}>"best pizza recipe"</em> and expect
          ranked results — most relevant first, irrelevant ones filtered out.
        </p>
        <p style={{ color: C.text2, margin: 0 }}>
          Your job: build a <strong style={{ color: C.text1 }}>working search engine from scratch</strong>.
          No libraries. Just code. The same pipeline every real search engine uses.
        </p>
      </div>

      <div style={card()}>
        <div style={{ color: '#38bdf8', fontWeight: 'bold', marginBottom: 10 }}>🏗️ What you will build (6 components)</div>
        {[
          ['1', 'Tokenizer',       'Split sentences into individual words'],
          ['2', 'Stop Word Filter','Remove noise words like "the", "a", "for"'],
          ['3', 'Stemmer',         'Reduce "recipes" and "recipe" to the same root'],
          ['4', 'Inverted Index',  'Build a lookup table: word → documents'],
          ['5', 'TF-IDF Scorer',   'Give each document a relevance score'],
          ['6', 'Search Function', 'Put it all together into a ranked search'],
        ].map(([n, name, desc]) => (
          <div key={n} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
            <span style={{ ...pill(C.purple), minWidth: 22, textAlign: 'center', flexShrink: 0 }}>{n}</span>
            <span>
              <strong style={{ color: C.text1 }}>{name}</strong>
              <span style={{ color: C.text3 }}> — {desc}</span>
            </span>
          </div>
        ))}
      </div>

      {!accepted ? (
        <div style={{ textAlign: 'center' }}>
          <Button variant="primary" onClick={() => { setAccepted(true); onUnlock('mission') }}>
            Accept the Mission 🎯
          </Button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: C.green2, fontWeight: 'bold', marginBottom: 12 }}>
            🎯 Mission accepted — let's build.
          </div>
          <Button variant="primary" onClick={onNext}>See the Data →</Button>
        </div>
      )}
    </SpaceBetween>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 1 — HTML PARSING: FROM WEB PAGE TO PLAIN TEXT
// ═════════════════════════════════════════════════════════════════════════════

function Step1({ onUnlock, onNext }) {
  const [stripped, setStripped]     = useState(false)
  const [quizPassed, setQuizPassed] = useState(false)
  const [badgeDone, setBadgeDone]   = useState(false)

  const htmlLines = SAMPLE_HTML_S1.split('\n')

  const isContentLine  = line => line.includes('The best homemade pizza recipe for beginners')
  const isScriptBody   = line => line.trim().startsWith('ga(')
  const isScriptTag    = line => line.trim().startsWith('<script') || line.trim().startsWith('</script')
  const isStyleTag     = line => line.trim().startsWith('<style') || line.trim().startsWith('</style')
  const isTagLine      = line => line.trim().startsWith('<') && !isContentLine(line)

  return (
    <SpaceBetween size="m">
      <Alert type="info" header="Step 1 — HTML Parsing: From Web Page to Plain Text">
        FoodFind's 15 articles live on web pages as HTML. A search engine first crawls the web,
        downloads those HTML files, and <strong>extracts the plain text</strong>.
        HTML tags like <code>&lt;h1&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;script&gt;</code>
        are structure — not content. We strip them away before anything else.
      </Alert>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>
          🌐 What the web crawler downloads for S1 (raw HTML)
        </div>
        <div style={{ ...codeBox, fontSize: 12, lineHeight: 1.7 }}>
          {htmlLines.map((line, i) => (
            <div key={i} style={{
              color: isContentLine(line) ? C.green2
                   : isScriptBody(line)  ? C.red2
                   : isScriptTag(line)   ? '#fb923c'
                   : isStyleTag(line)    ? '#fb923c'
                   : isTagLine(line)     ? '#475569'
                   : C.text2,
              fontWeight: isContentLine(line) ? 'bold' : 'normal',
            }}>
              {line}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12 }}>
          <span><span style={{ color: C.green2 }}>■</span> Text content (keep this)</span>
          <span><span style={{ color: C.red2 }}>■</span> Script code (remove entirely)</span>
          <span><span style={{ color: '#475569' }}>■</span> HTML tags (strip away)</span>
        </div>
      </div>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>🔬 The Python Code: strip_html()</div>
        <div style={codeBox}>
          <span style={{ color: C.codeKw }}>import re</span>{'\n\n'}
          <span style={{ color: C.codeKw }}>def strip_html(html):</span>{'\n'}
          <span style={{ color: C.text3 }}>{'    # Step 1: delete <script>...</script> blocks entirely'}</span>{'\n'}
          <span style={{ color: C.text2 }}>{'    html = re.sub(r\'<script[\\s\\S]*?</script>\', \'\', html)'}</span>{'\n'}
          <span style={{ color: C.text3 }}>{'    # Step 2: delete <style>...</style> blocks'}</span>{'\n'}
          <span style={{ color: C.text2 }}>{'    html = re.sub(r\'<style[\\s\\S]*?</style>\', \'\', html)'}</span>{'\n'}
          <span style={{ color: C.text3 }}>{'    # Step 3: replace every remaining tag with a space'}</span>{'\n'}
          <span style={{ color: C.text2 }}>{"    html = re.sub(r'<[^>]+>', ' ', html)"}</span>{'\n'}
          <span style={{ color: C.text3 }}>{'    # Step 4: collapse whitespace → one clean string'}</span>{'\n'}
          <span style={{ color: C.text2 }}>{"    return ' '.join(html.split())"}</span>
        </div>
      </div>

      {!stripped ? (
        <div style={{ textAlign: 'center' }}>
          <Button variant="primary" onClick={() => setStripped(true)}>
            ▶ Run strip_html() on the S1 web page
          </Button>
        </div>
      ) : (
        <div style={card('#0B1C10', C.green)}>
          <div style={{ color: C.green2, fontWeight: 'bold', marginBottom: 8 }}>
            ✅ strip_html(S1_page) →
          </div>
          <div style={{
            fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8,
            background: '#091F12', borderRadius: 6, padding: '10px 14px',
          }}>
            <span style={{ color: C.text3 }}>"FoodFind - Best Pizza Recipes Home Recipes </span>
            <span style={{ color: C.green2, fontWeight: 'bold' }}>The best homemade pizza recipe for beginners</span>
            <span style={{ color: C.text3 }}> Learn to make authentic pizza from scratch! © FoodFind 2024."</span>
          </div>
          <div style={{ color: C.text3, fontSize: 12, marginTop: 10 }}>
            After deduplication and cleanup → our clean document S1:<br />
            <span style={{ color: C.green2, fontFamily: 'monospace', fontSize: 13 }}>
              "The best homemade pizza recipe for beginners"
            </span>
          </div>
        </div>
      )}

      {stripped && !quizPassed && (
        <ChoiceExercise
          question="strip_html() removes script blocks with a special rule. What does it do to the code INSIDE <script>...</script>?"
          options={[
            'It keeps the JavaScript code as text',
            'It removes the script tag AND everything inside it',
            'It replaces the script with a space',
            'It only removes the opening <script> tag',
          ]}
          answer="It removes the script tag AND everything inside it"
          onPass={() => {
            setQuizPassed(true)
            if (!badgeDone) { setBadgeDone(true); onUnlock('explorer') }
          }}
        />
      )}

      {quizPassed && (
        <>
          <div style={card()}>
            <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 12 }}>
              📄 FoodFind's 15 Articles — after running strip_html() on each page
            </div>
            <div style={{ color: C.text3, fontSize: 13, marginBottom: 10 }}>
              All 15 web pages have been parsed. This is the clean text we'll work with:
            </div>
            {Object.entries(DOCUMENTS).map(([id, text]) => (
              <div key={id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '7px 0', borderBottom: '1px solid #0f172a' }}>
                <span style={{ ...pill(C.blue), minWidth: 34, textAlign: 'center', flexShrink: 0 }}>{id}</span>
                <span style={{ color: C.text1, fontSize: 14 }}>{text}</span>
              </div>
            ))}
          </div>

          <div style={card('#12102A', C.purple)}>
            <div style={{ color: C.blue2, fontWeight: 'bold', marginBottom: 8 }}>
              🤔 Is plain text enough to search?
            </div>
            <p style={{ color: C.blue2, margin: '0 0 8px' }}>
              We have clean text — but searching it directly still has serious problems:
            </p>
            <ul style={{ color: C.blue2, margin: 0, paddingLeft: 20 }}>
              <li>"Recipe" and "recipe" won't match — uppercase vs lowercase</li>
              <li>"the", "a", "for" appear in <em>every</em> document — they're noise</li>
              <li>"recipes" and "recipe" are different strings but mean the same thing</li>
              <li>How do we rank S1 vs S2 when both contain "pizza recipe"?</li>
            </ul>
            <p style={{ color: C.blue2, margin: '8px 0 0', fontWeight: 'bold' }}>
              That's why we have 6 more pipeline steps. Let's build them one by one.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ color: C.green2, fontWeight: 'bold', marginBottom: 10 }}>
              👁️ Data Explorer badge earned! HTML stripped → clean text extracted.
            </div>
            <Button variant="primary" onClick={onNext}>
              Next: Step 2 — Tokenization →
            </Button>
          </div>
        </>
      )}
    </SpaceBetween>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 2 — TOKENIZATION
// ═════════════════════════════════════════════════════════════════════════════

function Step2({ onUnlock, onNext }) {
  const [passed, setPassed] = useState(false)

  const s1Tokens = tokenise(DOCUMENTS.S1)
  const s3Tokens = tokenise(DOCUMENTS.S3)

  return (
    <SpaceBetween size="m">
      <Alert type="info" header="Step 2: Tokenization — Break text into words">
        A computer can't search a sentence. It needs individual words — called <strong>tokens</strong>.
        We call the process of splitting a sentence into tokens: <strong>tokenization</strong>.
      </Alert>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>🔬 The Code</div>
        <div style={codeBox}>
          <span style={{ color: C.codeKw }}>def tokenise(text):</span>{'\n'}
          <span style={{ color: C.text2, paddingLeft: 20 }}>{'    return text.lower().split()'}</span>{'\n\n'}
          <span style={{ color: C.text3 }}># .lower()  → make everything lowercase so "Pizza" matches "pizza"</span>{'\n'}
          <span style={{ color: C.text3 }}># .split()  → slice on whitespace → list of words</span>
        </div>
      </div>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>🔍 Trace S1 through tokenization</div>
        <div style={{ color: C.text3, fontSize: 13, marginBottom: 4, fontFamily: 'monospace' }}>
          Input: <span style={{ color: C.text1 }}>"{DOCUMENTS.S1}"</span>
        </div>
        <div style={{ color: C.text3, fontSize: 13, marginBottom: 8, fontFamily: 'monospace' }}>
          tokenise(S1) →
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
          {s1Tokens.map((t, i) => <span key={i} style={pill(C.blue)}>{t}</span>)}
        </div>
        <div style={{ color: C.green2, fontWeight: 'bold' }}>= {s1Tokens.length} tokens</div>
      </div>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>
          📊 Token count for every document
        </div>
        {Object.entries(DOCUMENTS).map(([id, text]) => {
          const n = tokenise(text).length
          return (
            <div key={id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
              <span style={{ ...pill(C.blue), minWidth: 34, textAlign: 'center' }}>{id}</span>
              <div style={{ flex: 1, background: C.bg0, borderRadius: 4, height: 14 }}>
                <div style={{ width: `${(n / 12) * 100}%`, height: '100%', background: C.blue, borderRadius: 4 }} />
              </div>
              <span style={{ color: C.text2, fontSize: 13, minWidth: 18, textAlign: 'right' }}>{n}</span>
            </div>
          )
        })}
      </div>

      <Exercise
        question={`S3 = "${DOCUMENTS.S3}"\n\nHow many tokens does tokenise(S3) produce?`}
        check={v => v === '10'}
        hint="Count every word: Top 10 tips for baking pizza at home for beginners = 10 words"
        onPass={() => { if (!passed) { setPassed(true); onUnlock('tokenizer') } }}
      />

      {passed && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: C.green2, fontWeight: 'bold', marginBottom: 10 }}>
            ✂️ Tokenizer badge earned! S3 → exactly 10 tokens.
          </div>
          <Button variant="primary" onClick={onNext}>Next: Remove the Noise →</Button>
        </div>
      )}
    </SpaceBetween>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 3 — STOP WORD REMOVAL
// ═════════════════════════════════════════════════════════════════════════════

function Step3({ onUnlock, onNext }) {
  const [passed, setPassed] = useState(false)

  const s1Raw     = tokenise(DOCUMENTS.S1)       // 7 tokens
  const s1Filtered = removeStopWords(s1Raw)       // 5 tokens

  return (
    <SpaceBetween size="m">
      <Alert type="info" header="Step 3: Stop Word Removal — Filter out the noise">
        Words like "the", "a", "for", "it" appear in <em>every</em> document.
        They carry zero meaning for search. We remove them to keep only the signal.
      </Alert>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>📋 Our Stop Words (21 total)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {[...STOP_WORDS].sort().map(sw => <span key={sw} style={pill(C.red)}>{sw}</span>)}
        </div>
        <div style={{ color: C.text3, fontSize: 13, marginTop: 8 }}>
          These words will be filtered from every document and every user query.
        </div>
      </div>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>🔬 The Code</div>
        <div style={codeBox}>
          <span style={{ color: C.codeKw }}>def remove_stop_words(tokens):</span>{'\n'}
          <span style={{ color: C.text2 }}>{'    return [t for t in tokens if t not in STOP_WORDS]'}</span>
        </div>
      </div>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>
          🔍 Trace S1 — watch the stop words disappear
        </div>
        <div style={{ color: C.text3, fontSize: 12, marginBottom: 6 }}>
          Before ({s1Raw.length} tokens) — <span style={{ color: C.red2 }}>red = stop word (removed)</span>:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
          {s1Raw.map((t, i) => (
            <span key={i} style={pill(STOP_WORDS.has(t) ? C.red : C.blue)}>
              {STOP_WORDS.has(t) ? <s>{t}</s> : t}
            </span>
          ))}
        </div>
        <div style={{ color: C.text3, fontSize: 12, marginBottom: 6 }}>
          After ({s1Filtered.length} tokens):
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {s1Filtered.map((t, i) => <span key={i} style={pill(C.green)}>{t}</span>)}
        </div>
        <div style={{ color: C.green2, marginTop: 10, fontWeight: 'bold' }}>
          {s1Raw.length - s1Filtered.length} stop word(s) removed.
          Signal-to-noise ratio: improved.
        </div>
      </div>

      <Exercise
        question={`S1 = "${DOCUMENTS.S1}"\n\nAfter tokenization, S1 has 7 tokens.\nHow many tokens remain after removing stop words?`}
        check={v => v === '5'}
        hint="The stop words in S1 are: 'the' and 'for'. 7 − 2 = 5"
        onPass={() => { if (!passed) { setPassed(true); onUnlock('noise') } }}
      />

      {passed && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: C.green2, fontWeight: 'bold', marginBottom: 10 }}>
            🔇 Noise Canceller badge earned! S1: 7 → 5 tokens.
          </div>
          <Button variant="primary" onClick={onNext}>Next: Stemming →</Button>
        </div>
      )}
    </SpaceBetween>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 4 — STEMMING
// ═════════════════════════════════════════════════════════════════════════════

function Step4({ onUnlock, onNext }) {
  const [passed, setPassed] = useState(false)

  const pipeline = [
    { label: '1. tokenise(S1)',        tokens: tokenise(DOCUMENTS.S1),           color: C.text3 },
    { label: '2. remove_stop_words()', tokens: removeStopWords(tokenise(DOCUMENTS.S1)), color: C.blue },
    { label: '3. stem each token',     tokens: PROCESSED.S1,                     color: C.green },
  ]

  const examples = [
    ['recipes',     'recip'],
    ['recipe',      'recip'],
    ['baking',      'bake'],
    ['cooking',     'cook'],
    ['beginners',   'beginn'],
    ['restaurants', 'restaur'],
    ['healthy',     'healthi'],
    ['techniques',  'techniqu'],
  ]

  return (
    <SpaceBetween size="m">
      <Alert type="info" header="Step 4: Stemming — Reduce words to their root form">
        "recipe" and "recipes" mean the same thing. "baking" and "bake" mean the same.
        Stemming reduces all variants to a common root so they all match.
      </Alert>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>🔬 The Code</div>
        <div style={codeBox}>
          <span style={{ color: C.text2 }}>STEM_RULES = {'{'}</span>{'\n'}
          <span style={{ color: C.text2 }}>{'    \'recipes\': \'recip\', \'recipe\': \'recip\','}</span>{'\n'}
          <span style={{ color: C.text2 }}>{'    \'baking\': \'bake\',   \'cooking\': \'cook\','}</span>{'\n'}
          <span style={{ color: C.text2 }}>{'    \'beginners\': \'beginn\',  ... (18 rules)'}</span>{'\n'}
          <span style={{ color: C.text2 }}>{'}'}  </span>{'\n\n'}
          <span style={{ color: C.codeKw }}>def stem(token):</span>{'\n'}
          <span style={{ color: C.text2 }}>{'    return STEM_RULES.get(token, token)'}</span>{'\n'}
          <span style={{ color: C.text3 }}>{'    # if word is not in dict → return it unchanged'}</span>
        </div>
      </div>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>🌱 Stemming in action</div>
        {examples.map(([word, stemmed]) => (
          <div key={word} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <span style={{ ...pill(C.blue), minWidth: 100 }}>{word}</span>
            <span style={{ color: C.text3 }}>→</span>
            <span style={pill(C.green)}>{stemmed}</span>
          </div>
        ))}
        <div style={{ color: C.text3, fontSize: 12, marginTop: 8 }}>
          Note: "recip" isn't a real English word — that's fine. We apply the same rules to queries.
          When the user types "recipe" it also becomes "recip" → they match perfectly.
        </div>
      </div>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>
          🔍 Complete pipeline on S1 — all 3 steps
        </div>
        {pipeline.map(({ label, tokens, color }) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <div style={{ color: C.text3, fontSize: 12, marginBottom: 5 }}>{label}:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {tokens.map((t, i) => <span key={i} style={pill(color)}>{t}</span>)}
            </div>
          </div>
        ))}
        <div style={{ ...codeBox, marginTop: 4 }}>
          <span style={{ color: C.text3 }}># S1 final form (what gets stored and searched):</span>{'\n'}
          <span style={{ color: C.green2 }}>S1 = ['best', 'homemad', 'pizza', 'recip', 'beginn']</span>
        </div>
      </div>

      <ChoiceExercise
        question='What does stem("beginners") return?'
        options={['begin', 'beginn', 'beginner', 'beginning']}
        answer="beginn"
        onPass={() => { if (!passed) { setPassed(true); onUnlock('stemmer') } }}
      />

      {passed && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: C.green2, fontWeight: 'bold', marginBottom: 10 }}>
            🌱 Stemmer badge earned! "beginners" → "beginn" per STEM_RULES.
          </div>
          <Button variant="primary" onClick={onNext}>Next: Build the Index →</Button>
        </div>
      )}
    </SpaceBetween>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 5 — INVERTED INDEX
// ═════════════════════════════════════════════════════════════════════════════

function Step5({ onUnlock, onNext }) {
  const [query, setQuery] = useState('')
  const [passed, setPassed] = useState(false)

  const stemmedQuery  = query.trim() ? stem(query.toLowerCase().trim()) : ''
  const foundDocs     = stemmedQuery ? (INVERTED_INDEX[stemmedQuery] || []) : []

  const keyTerms = ['pizza', 'recip', 'best', 'cook', 'beginn', 'homemad', 'italian']

  return (
    <SpaceBetween size="m">
      <Alert type="info" header="Step 5: Inverted Index — The heart of search">
        An inverted index maps every term to the list of documents that contain it.
        When a user searches, we just do a single lookup — no scanning all documents.
        This is why search is fast even with billions of pages.
      </Alert>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>🔬 The Code</div>
        <div style={codeBox}>
          <span style={{ color: C.text2 }}>{'from collections import defaultdict'}</span>{'\n\n'}
          <span style={{ color: C.text2 }}>{'inverted_index = defaultdict(set)'}</span>{'\n\n'}
          <span style={{ color: C.codeKw }}>{'for doc_id, terms in processed.items():'}</span>{'\n'}
          <span style={{ color: C.text2 }}>{'    for term in terms:'}</span>{'\n'}
          <span style={{ color: C.text2 }}>{'        inverted_index[term].add(doc_id)'}</span>{'\n\n'}
          <span style={{ color: C.text3 }}># Result: "pizza" → {'{S1, S2, S3, S5, S6, S8, S9}'}</span>
        </div>
      </div>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>
          📚 The Index (7 key terms)
        </div>
        {keyTerms.map(term => (
          INVERTED_INDEX[term] ? (
            <div key={term} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #0f172a' }}>
              <span style={{ ...pill(C.purple), minWidth: 90, textAlign: 'center' }}>{term}</span>
              <span style={{ color: C.border1 }}>→</span>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {[...(INVERTED_INDEX[term])].sort().map(d => (
                  <span key={d} style={pill(C.blue)}>{d}</span>
                ))}
              </div>
            </div>
          ) : null
        ))}
      </div>

      <div style={card(C.bg2, C.blue)}>
        <div style={{ color: C.blue2, fontWeight: 'bold', marginBottom: 8 }}>
          🔎 Try the index — type any word to look it up
        </div>
        <Input
          value={query}
          onChange={({ detail }) => {
            setQuery(detail.value)
            if (!passed && detail.value.trim()) { setPassed(true); onUnlock('indexer') }
          }}
          placeholder="Try: pizza, recipe, cook, beginn, homemade..."
        />
        {stemmedQuery && (
          <div style={{ marginTop: 10 }}>
            <div style={{ color: C.text3, fontSize: 13, marginBottom: 6 }}>
              stem("<span style={{ color: C.text1 }}>{query.toLowerCase().trim()}</span>") → "
              <span style={{ color: C.green2 }}>{stemmedQuery}</span>" → found in:
            </div>
            {foundDocs.length > 0 ? (
              <>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                  {[...foundDocs].sort().map(d => <span key={d} style={pill(C.blue)}>{d}</span>)}
                </div>
                {[...foundDocs].sort().map(d => (
                  <div key={d} style={{ color: C.text2, fontSize: 13, marginBottom: 3 }}>
                    <span style={pill(C.blue)}>{d}</span> {DOCUMENTS[d]}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: C.red2, fontSize: 13 }}>
                "{stemmedQuery}" not in index. Try: pizza, recip, cook, best, beginn
              </div>
            )}
          </div>
        )}
      </div>

      {passed && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: C.green2, fontWeight: 'bold', marginBottom: 10 }}>
            📚 Indexer badge earned! Instant lookup — no document scanning needed.
          </div>
          <Button variant="primary" onClick={onNext}>Next: The Math Behind Ranking →</Button>
        </div>
      )}
    </SpaceBetween>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 6 — TF-IDF MATH
// ═════════════════════════════════════════════════════════════════════════════
//
// Verified values from notebook:
//   S1 processed → ['best', 'homemad', 'pizza', 'recip', 'beginn'] — 5 terms
//   TF("pizza", S1) = 1 / 5 = 0.2
//   "pizza" appears in S1,S2,S3,S5,S6,S8,S9 = 7 docs
//   IDF("pizza") = ln(15/7) ≈ 0.7621
//   TF-IDF = 0.2 × 0.7621 ≈ 0.1524
//
//   S8 processed → ['best', 'wood-fired', 'pizza', 'restaur', 'best', 'citi'] — 6 terms
//   TF("best", S8) = 2 / 6 ≈ 0.333
// ═════════════════════════════════════════════════════════════════════════════

function Step6({ onUnlock, onNext }) {
  const [passed, setPassed]       = useState(false)
  const [idfPassed, setIdfPassed] = useState(false)

  return (
    <SpaceBetween size="m">
      <Alert type="info" header="Step 6: TF-IDF — Score every (term, document) pair">
        We found candidate documents via the index. Now we need to <strong>rank</strong> them.
        TF-IDF gives each document a score for each query term. Higher score = more relevant.
      </Alert>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>
          📐 Part 1: TF — Term Frequency
        </div>
        <p style={{ color: C.text2, margin: '0 0 10px' }}>
          <em>How often does the term appear in this specific document?</em>
        </p>
        <div style={codeBox}>
          <span style={{ color: C.codeKw }}>{'def tf(term, doc_terms):'}</span>{'\n'}
          <span style={{ color: C.text2 }}>{'    """Term Frequency: count / total terms in doc"""'}</span>{'\n'}
          <span style={{ color: C.text2 }}>{'    return doc_terms.count(term) / len(doc_terms)'}</span>
        </div>
        <div style={{ ...card(C.bg0, C.border1), marginTop: 10 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: C.text2 }}>
            S1 = [<span style={{ color: C.green2 }}>'best'</span>, 'homemad',{' '}
            <span style={{ color: C.orange }}>'pizza'</span>, 'recip', 'beginn'] — 5 terms
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: C.text2, marginTop: 6 }}>
            tf("pizza", S1) = <span style={{ color: C.green2 }}>1</span> occurrence /{' '}
            <span style={{ color: C.green2 }}>5</span> terms ={' '}
            <span style={{ color: C.green2, fontSize: 18, fontWeight: 'bold' }}>0.2</span>
          </div>
        </div>
      </div>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>
          📐 Part 2: IDF — Inverse Document Frequency
        </div>
        <p style={{ color: C.text2, margin: '0 0 10px' }}>
          <em>How rare is this term across all 15 documents? Rare = more meaningful.</em>
        </p>
        <div style={codeBox}>
          <span style={{ color: C.codeKw }}>{'def idf(term, all_docs):'}</span>{'\n'}
          <span style={{ color: C.text2 }}>{'    """Inverse Document Frequency: log(N / df)"""'}</span>{'\n'}
          <span style={{ color: C.text2 }}>{'    N  = len(all_docs)                          # total documents'}</span>{'\n'}
          <span style={{ color: C.text2 }}>{'    df = count of docs containing term'}</span>{'\n'}
          <span style={{ color: C.text2 }}>{'    return math.log(N / df)                     # natural log'}</span>
        </div>
        <div style={{ ...card(C.bg0, C.border1), marginTop: 10 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: C.text2 }}>
            "pizza" appears in: S1, S2, S3, S5, S6, S8, S9 ={' '}
            <span style={{ color: C.text1, fontWeight: 'bold' }}>7 docs</span>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: C.text2, marginTop: 4 }}>
            idf("pizza") = ln(15 / 7) = ln(2.143) ={' '}
            <span style={{ color: C.green2, fontSize: 18, fontWeight: 'bold' }}>0.7621</span>
          </div>
          <div style={{ color: C.text3, fontSize: 12, marginTop: 6 }}>
            Moderate IDF — pizza appears in 7 of 15 docs, so it's somewhat discriminating.
            Compare: "homemad" only appears in S1, S9 → IDF = ln(15/2) = 2.015 — much higher!
          </div>
        </div>
      </div>

      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>
          🧮 TF × IDF = Final Score
        </div>
        <div style={{ ...card(C.bg0, C.border1), textAlign: 'center', padding: 20 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 16, color: C.text1 }}>
            tf_idf("pizza", S1) = 0.2 × 0.7621 ≈{' '}
            <span style={{ color: C.orange, fontSize: 22, fontWeight: 'bold' }}>0.1524</span>
          </div>
        </div>

        <div style={{ color: C.orange, fontWeight: 'bold', margin: '14px 0 8px' }}>
          📊 TF-IDF of "pizza" across all 15 docs (only docs containing "pizza" shown)
        </div>
        {Object.entries(PROCESSED)
          .filter(([, terms]) => terms.includes('pizza'))
          .map(([docId, terms]) => {
            const score = tf('pizza', terms) * idf('pizza')
            return (
              <div key={docId} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
                <span style={{ ...pill(C.blue), minWidth: 34, textAlign: 'center' }}>{docId}</span>
                <div style={{ flex: 1, background: C.bg0, borderRadius: 4, height: 14 }}>
                  <div style={{ width: `${(score / 0.25) * 100}%`, height: '100%', background: C.blue, borderRadius: 4 }} />
                </div>
                <span style={{ color: C.text2, fontSize: 13, minWidth: 60, textAlign: 'right', fontFamily: 'monospace' }}>
                  {score.toFixed(4)}
                </span>
              </div>
            )
          })}
        <div style={{ color: C.text3, fontSize: 12, marginTop: 6 }}>
          S1 scores highest for "pizza" because it has only 5 total terms — so pizza takes up 1/5 of it.
          Fewer terms = higher TF. The full query score will also factor in "best" and "recipe".
        </div>
      </div>

      <Exercise
        question={`S8 = "Best wood-fired pizza restaurants in the best cities"\nS8 processed: ['best', 'wood-fired', 'pizza', 'restaur', 'best', 'citi'] — 6 terms\n\n"best" appears TWICE in S8. What is tf("best", S8)?\nEnter as a decimal, 2 decimal places (e.g. 0.33)`}
        check={v => {
          const n = parseFloat(v)
          return Math.abs(n - 2 / 6) < 0.01 || v === '0.33' || v === '0.333'
        }}
        hint="TF = occurrences / total terms. 'best' appears 2 times in 6 total tokens. 2/6 = 0.333"
        onPass={() => { if (!passed) { setPassed(true); onUnlock('math') } }}
      />

      {passed && (
        <>
          <div style={card('#0D1F12', C.green)}>
            <div style={{ color: C.green2, fontWeight: 'bold', marginBottom: 4 }}>
              ✅ tf("best", S8) = 2/6 ≈ 0.333
            </div>
            <div style={{ color: C.green2, fontSize: 13 }}>
              Now let's test IDF — the other half of the formula.
            </div>
          </div>

          <div style={card()}>
            <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 10 }}>
              📊 IDF in action — compare two terms
            </div>
            <div style={{ ...codeBox, marginBottom: 10 }}>
              <div style={{ color: C.text3, marginBottom: 4 }}># "pizza" vs "homemad" — which has higher IDF and why?</div>
              <div style={{ color: C.text2 }}>
                "pizza"  → in <span style={{ color: C.red2 }}>7/15</span> docs → idf = ln(15/7) = <span style={{ color: C.red2 }}>0.7621</span>  (common → lower IDF){'\n'}
              </div>
              <div style={{ color: C.text2 }}>
                "homemad"→ in <span style={{ color: C.green2 }}>2/15</span> docs → idf = ln(15/2) = <span style={{ color: C.green2 }}>2.0149</span>  (rare → HIGH IDF)
              </div>
            </div>
            <div style={{ color: C.text3, fontSize: 13 }}>
              IDF tells you: "how <em>exclusive</em> is this term to certain documents?"
              If a term is everywhere, it tells you nothing. If it's rare, it's a strong signal.
            </div>
          </div>

          <ChoiceExercise
            question='"naples" appears in only 1 out of 15 documents (just S6). "pizza" appears in 7 out of 15. Which has a HIGHER IDF score?'
            options={[
              '"pizza" — it appears in more documents',
              '"naples" — it is rarer, so more discriminating',
              'Both have the same IDF',
              'Neither — common words always score zero',
            ]}
            answer='"naples" — it is rarer, so more discriminating'
            onPass={() => setIdfPassed(true)}
          />
        </>
      )}

      {idfPassed && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: C.green2, fontWeight: 'bold', marginBottom: 10 }}>
            🧮 Math Wizard badge earned! TF rewards frequency. IDF rewards rarity. TF×IDF = relevance.
          </div>
          <Button variant="primary" onClick={onNext}>Next: Run a Real Search →</Button>
        </div>
      )}
    </SpaceBetween>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 7 — LIVE SEARCH (Google-style UI)
// ═════════════════════════════════════════════════════════════════════════════

// Fake URL breadcrumbs — makes results feel like real web pages
const FAKE_URLS = {
  S1:  'foodfind.com › recipes › best-pizza-for-beginners',
  S2:  'foodfind.com › recipes › pizza-dough-from-scratch',
  S3:  'foodfind.com › guides › baking-pizza-at-home',
  S4:  'foodfind.com › recipes › pasta-and-italian-cooking',
  S5:  'foodfind.com › diy › build-your-own-pizza-oven',
  S6:  'foodfind.com › history › pizza-naples-to-new-york',
  S7:  'foodfind.com › health › healthy-meal-prep-tips',
  S8:  'foodfind.com › reviews › best-pizza-restaurants',
  S9:  'foodfind.com › guides › choosing-flour-bread-pizza',
  S10: 'foodfind.com › ingredients › italian-cheese-guide',
  S11: 'techlearn.io › ai › machine-learning-algorithms',
  S12: 'techlearn.io › blockchain › how-blockchain-works',
  S13: 'worklife.co › remote › digital-nomad-culture',
  S14: 'evreport.io › tech › electric-vehicle-adoption',
  S15: 'climatenow.org › solutions › renewable-energy',
}

// Domain favicon colours — makes each result feel distinct
const DOMAIN_COLORS = {
  'foodfind.com':   C.orange,
  'techlearn.io':   C.blue,
  'worklife.co':    C.purple,
  'evreport.io':    C.green,
  'climatenow.org': C.green2,
}

function getFavColor(docId) {
  const url = FAKE_URLS[docId] || ''
  const domain = url.split(' › ')[0]
  return DOMAIN_COLORS[domain] || C.text3
}

function Step7({ onUnlock, onNext }) {
  const [inputVal, setInputVal] = useState('')
  const [searchedQuery, setSearchedQuery] = useState(null)
  const [trace, setTrace]     = useState(null)
  const [results, setResults] = useState(null)
  const [passed, setPassed]   = useState(false)
  const [searchTime, setSearchTime] = useState(null)
  const [focused, setFocused] = useState(false)

  const handleSearch = (q) => {
    if (!q.trim()) return
    const t0 = performance.now()
    const tokens     = tokenise(q)
    const filtered   = removeStopWords(tokens)
    const stemmed    = filtered.map(stem)
    const candidates = [...new Set(stemmed.flatMap(t => INVERTED_INDEX[t] || []))].sort()
    const res        = runSearch(q)
    const t1         = performance.now()
    setSearchTime(((t1 - t0) / 1000).toFixed(3))
    setTrace({ tokens, filtered, stemmed, candidates })
    setResults(res)
    setSearchedQuery(q)
    setInputVal(q)
    if (!passed) { setPassed(true); onUnlock('engineer') }
  }

  const clearSearch = () => { setInputVal(''); setResults(null); setTrace(null); setSearchedQuery(null) }

  const presets = ['best pizza recipe', 'Italian cooking', 'homemade bread', 'healthy meal tips']
  const topScore = results?.[0]?.score || 1

  return (
    <SpaceBetween size="m">
      <Alert type="success" header="Step 7: Full Search — All 6 components working together">
        Every piece of the pipeline is connected. Watch your engine run exactly like a real search engine.
      </Alert>

      {/* ── Google-style search panel ── */}
      <div style={{
        background: C.bg1, border: `1px solid ${C.border1}`,
        borderRadius: 16, padding: '32px 24px 24px',
      }}>

        {/* FoodFind logo — Google colour sequence */}
        <div style={{ textAlign: 'center', marginBottom: 24, userSelect: 'none' }}>
          {[
            ['F', C.blue], ['o', C.red], ['o', C.yellow],
            ['d', C.blue], ['F', C.green], ['i', C.red],
            ['n', C.yellow], ['d', C.blue],
          ].map(([letter, color], i) => (
            <span key={i} style={{ fontSize: 36, fontWeight: 700, color, letterSpacing: '-1px' }}>
              {letter}
            </span>
          ))}
          <div style={{ color: C.text3, fontSize: 12, marginTop: 2, letterSpacing: '0.12em' }}>
            SEARCH ENGINE · BUILT BY YOU
          </div>
        </div>

        {/* Search bar */}
        <div style={{ maxWidth: 600, margin: '0 auto 16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            background: C.bg2,
            border: `1.5px solid ${focused ? C.blue : C.border2}`,
            borderRadius: 28, padding: '10px 16px 10px 20px',
            boxShadow: focused ? `0 0 0 3px ${C.blue}22` : '0 2px 6px rgba(0,0,0,0.35)',
            transition: 'all 0.2s',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginRight: 12 }}>
              <circle cx="11" cy="11" r="7" stroke={focused ? C.blue : C.text3} strokeWidth="2"/>
              <line x1="16.5" y1="16.5" x2="22" y2="22" stroke={focused ? C.blue : C.text3} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(inputVal)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search FoodFind..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: C.text1, fontSize: 16, fontFamily: 'inherit', caretColor: C.blue,
              }}
            />
            {inputVal && (
              <button onClick={clearSearch} style={{
                background: 'none', border: 'none', color: C.text3,
                cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 4px 0 8px',
              }}>×</button>
            )}
          </div>

          {/* Search button */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14 }}>
            <button
              onClick={() => handleSearch(inputVal)}
              disabled={!inputVal.trim()}
              style={{
                padding: '9px 20px', borderRadius: 6, fontSize: 14,
                background: inputVal.trim() ? `${C.blue}22` : C.bg0,
                border: `1px solid ${inputVal.trim() ? C.blue : C.border1}`,
                color: inputVal.trim() ? C.blue2 : C.text3,
                cursor: inputVal.trim() ? 'pointer' : 'default',
                transition: 'all 0.15s', fontFamily: 'inherit',
              }}
            >
              FoodFind Search
            </button>
            <button
              onClick={() => { if (inputVal.trim()) handleSearch(inputVal) }}
              disabled={!inputVal.trim()}
              style={{
                padding: '9px 20px', borderRadius: 6, fontSize: 14,
                background: inputVal.trim() ? `${C.orange}18` : C.bg0,
                border: `1px solid ${inputVal.trim() ? C.orange : C.border1}`,
                color: inputVal.trim() ? C.orange : C.text3,
                cursor: inputVal.trim() ? 'pointer' : 'default',
                transition: 'all 0.15s', fontFamily: 'inherit',
              }}
            >
              I'm Feeling Lucky
            </button>
          </div>
        </div>

        {/* Quick-search chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {presets.map(p => (
            <button key={p} onClick={() => handleSearch(p)} style={{
              padding: '5px 14px', borderRadius: 18, cursor: 'pointer', fontSize: 13,
              background: searchedQuery === p ? `${C.blue}25` : C.bg0,
              border: `1px solid ${searchedQuery === p ? C.blue : C.border1}`,
              color: searchedQuery === p ? C.blue2 : C.text2,
              transition: 'all 0.15s', fontFamily: 'inherit',
            }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Pipeline trace — compact developer panel ── */}
      {trace && (
        <div style={{ ...codeBox, padding: '10px 14px' }}>
          <div style={{ color: C.text3, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            ⚙ Engine internals — what ran under the hood
          </div>
          {[
            { label: 'tokenise()',      items: trace.tokens,     color: C.text2 },
            { label: 'stop words out', items: trace.filtered,   color: C.purple },
            { label: 'stemmed',        items: trace.stemmed,    color: C.green },
            { label: 'candidates',     items: trace.candidates, color: C.blue },
          ].map(({ label, items, color }) => (
            <div key={label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 5 }}>
              <span style={{ color: C.text3, fontSize: 11, minWidth: 110, paddingTop: 3, flexShrink: 0 }}>{label}</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {items.length > 0
                  ? items.map((t, i) => <span key={i} style={pill(color)}>{t}</span>)
                  : <span style={{ color: C.red2, fontSize: 12 }}>— none matched</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Google-style results ── */}
      {results && (
        <div style={{ padding: '0 4px' }}>

          {/* Result count bar */}
          <div style={{ color: C.text3, fontSize: 13, marginBottom: 16, borderBottom: `1px solid ${C.border1}`, paddingBottom: 10 }}>
            About{' '}
            <strong style={{ color: C.text2 }}>{results.length}</strong>
            {' '}result{results.length !== 1 ? 's' : ''} for{' '}
            <em style={{ color: C.text1 }}>"{searchedQuery}"</em>
            <span style={{ marginLeft: 8 }}>({searchTime}s)</span>
          </div>

          {results.length === 0 ? (
            <div>
              <div style={{ color: C.text1, fontSize: 20, marginBottom: 8 }}>
                No results for <strong>"{searchedQuery}"</strong>
              </div>
              <div style={{ color: C.text3, fontSize: 14, borderLeft: `3px solid ${C.border2}`, paddingLeft: 12 }}>
                Your search did not match any documents in the index.<br />
                <span style={{ color: C.text2 }}>Suggestions:</span> check the spelling, or try: pizza, recipe, Italian, bread, healthy
              </div>
            </div>
          ) : (
            results.map(({ docId, score, text }, i) => (
              <div key={docId} style={{
                padding: '14px 0 18px',
                borderBottom: `1px solid ${C.border1}`,
              }}>
                {/* Favicon + URL */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: getFavColor(docId) + '20',
                    border: `1.5px solid ${getFavColor(docId)}60`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: getFavColor(docId), fontWeight: 700, flexShrink: 0,
                  }}>
                    {FAKE_URLS[docId]?.split('.')[0]?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: C.text2, fontSize: 13 }}>
                      {FAKE_URLS[docId]?.split(' › ')[0]}
                    </div>
                    <div style={{ color: C.green, fontSize: 12 }}>
                      {FAKE_URLS[docId]}
                    </div>
                  </div>
                </div>

                {/* Title — blue link style */}
                <div style={{
                  color: '#8AB4F8', fontSize: 18, fontWeight: 400,
                  marginBottom: 6, cursor: 'default', lineHeight: 1.3,
                }}>
                  {text}
                </div>

                {/* Relevance bar + score */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{
                    flex: 1, background: C.bg0, borderRadius: 3, height: 3, maxWidth: 240,
                  }}>
                    <div style={{
                      width: `${Math.round((score / topScore) * 100)}%`,
                      height: '100%', borderRadius: 3,
                      background: i === 0 ? C.green : C.blue,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <span style={{
                    color: i === 0 ? C.green : C.text3,
                    fontSize: 12, fontFamily: 'monospace',
                  }}>
                    {score.toFixed(4)} {i === 0 ? '← top match' : ''}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {passed && (
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={{ color: C.green2, fontWeight: 'bold', marginBottom: 10 }}>
            🔍 Search Engineer badge earned! Your pipeline works end-to-end.
          </div>
          <Button variant="primary" onClick={onNext}>Next: Discover the Fatal Flaw →</Button>
        </div>
      )}
    </SpaceBetween>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 8 — FAILURE MODES
// ═════════════════════════════════════════════════════════════════════════════

function Step8({ onUnlock, onNext }) {
  const [revealed, setRevealed] = useState(0)
  const [searchedFlaw, setSearchedFlaw] = useState({})

  const doSearch = (flawIndex, q) => {
    setSearchedFlaw(prev => ({ ...prev, [flawIndex]: runSearch(q) }))
  }

  const flaws = [
    {
      title: 'Flaw 1: Synonyms — Same meaning, different word',
      problem: 'In Italy, pizza is sometimes called "pie". A user from Naples searches for "pie". Should they find S6 ("The history of pizza from Naples")?',
      query: 'pie',
      expectedMsg: 'S6 should appear — it\'s literally about the origin of pizza in Italy. But "pie" ≠ "pizza" in our vocabulary.',
      lesson: 'TF-IDF works with exact words (after stemming). It cannot understand that "pie" and "pizza" mean the same thing. No synonym support.',
    },
    {
      title: 'Flaw 2: Word order doesn\'t matter (bag of words)',
      problem: '"recipe best pizza" vs "best pizza recipe" — are these the same search?',
      query: 'recipe best pizza',
      expectedMsg: 'Try both. You\'ll get identical results. TF-IDF doesn\'t care about word order at all.',
      lesson: 'TF-IDF is a "bag of words" model. It counts tokens, not sequences. Good for search, but it can\'t distinguish "dog bites man" from "man bites dog".',
    },
    {
      title: 'Flaw 3: Vocabulary mismatch — User says "food", docs say "cooking"',
      problem: 'A user searches "Italian food". S4 and S10 are clearly about Italian cuisine. Will they appear?',
      query: 'Italian food',
      expectedMsg: 'S4 and S10 contain "italian" ✓. But "food" is not in any document — our articles use "cooking", "recipe", "meal". So the score is low.',
      lesson: 'TF-IDF requires the user to use the same vocabulary as the author. If you write "food" but the doc says "cooking" — no match. No semantic bridge exists.',
    },
  ]

  return (
    <SpaceBetween size="m">
      <Alert type="warning" header="Step 8: The Fatal Flaws — Where TF-IDF breaks">
        Your search engine works. But let's stress-test it. There are 3 fundamental limitations
        built into TF-IDF. Every major search engine hit these same walls.
      </Alert>

      {flaws.slice(0, revealed + 1).map((flaw, i) => (
        <div key={i} style={card('#1e1b2e', C.purple)}>
          <div style={{ color: C.blue2, fontWeight: 'bold', marginBottom: 8 }}>🚨 {flaw.title}</div>
          <p style={{ color: C.blue2, margin: '0 0 10px' }}>{flaw.problem}</p>

          <Button variant="normal" onClick={() => doSearch(i, flaw.query)}>
            Search for "{flaw.query}"
          </Button>

          {searchedFlaw[i] !== undefined && (
            <div style={{ marginTop: 10 }}>
              {searchedFlaw[i].length === 0 ? (
                <div style={{ color: C.red2, fontFamily: 'monospace', fontSize: 13 }}>
                  ❌ 0 results for "{flaw.query}"
                </div>
              ) : (
                searchedFlaw[i].slice(0, 3).map(({ docId, score, text }, j) => (
                  <div key={j} style={{ color: C.text2, fontSize: 13, marginBottom: 3 }}>
                    #{j + 1} <span style={pill(C.blue)}>{docId}</span>
                    <span style={{ fontFamily: 'monospace', color: C.text3 }}> ({score.toFixed(4)})</span>{' '}
                    {text}
                  </div>
                ))
              )}
              <div style={{ ...card(C.bg0, C.purple), marginTop: 10 }}>
                <div style={{ color: C.blue2, fontSize: 13, marginBottom: 6 }}>
                  <strong>What you expected:</strong> {flaw.expectedMsg}
                </div>
                <div style={{ color: C.blue2, fontSize: 13 }}>
                  <strong>Why it fails:</strong> {flaw.lesson}
                </div>
              </div>
            </div>
          )}

          {i === revealed && revealed < flaws.length - 1 && searchedFlaw[i] !== undefined && (
            <div style={{ marginTop: 12 }}>
              <Button onClick={() => setRevealed(r => r + 1)}>See Next Flaw →</Button>
            </div>
          )}
        </div>
      ))}

      {revealed === flaws.length - 1 && searchedFlaw[2] !== undefined && (
        <>
          <div style={card('#1e1b2e', '#8b5cf6')}>
            <div style={{ color: C.blue2, fontWeight: 'bold', marginBottom: 8 }}>
              💡 The Root Cause — And the Solution
            </div>
            <p style={{ color: C.blue2, margin: '0 0 8px' }}>
              All 3 flaws share the same root: TF-IDF understands <em>words</em>, not <em>meaning</em>.
              It has no knowledge of the world — just a frequency table.
            </p>
            <p style={{ color: C.blue2, margin: 0 }}>
              The fix? <strong style={{ color: C.blue2 }}>Word Embeddings and Semantic Search</strong> —
              convert every word into a vector in high-dimensional space, where "pizza" and "pie"
              sit close together. That's what you'll learn next.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button variant="primary" onClick={() => { onUnlock('thinker'); onNext() }}>
              Complete the Mission →
            </Button>
          </div>
        </>
      )}
    </SpaceBetween>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 9 — WHAT YOU BUILT TODAY
// ═════════════════════════════════════════════════════════════════════════════

const TUTORIAL_URL = 'https://nursnaaz.github.io/tutorial/how-search-engines-work'

const LINKEDIN_POST = `Every time you type in a search bar, 7 things happen before you see a single result.

I just built all 7 from scratch — and now I understand exactly why Google is fast.

The full pipeline, step by step:

① HTML parser → strips tags, extracts visible text
② Tokeniser → splits "Best Pizza Recipe" into ['best', 'pizza', 'recipe']
③ Stop word filter → drops 'the', 'a', 'for' — noise, not signal
④ Stemmer → 'recipes' and 'recipe' become the same root
⑤ Inverted index → maps each term to the docs that contain it
⑥ TF-IDF scorer → tf() × idf() gives every doc a relevance score
⑦ Search → rank by score, return results in order

The insight that surprised me most:

The inverted index is why search is fast at scale. Instead of scanning every document for every query, you do one lookup — "which docs contain this word?" — and only score those. O(1) instead of O(n). Google's index is just a massive version of this.

The limit I found:

"Pizza" and "pie" score zero similarity. TF-IDF sees exact words, not meaning. That gap is precisely why word embeddings and semantic search were invented.

If you have ever wondered what happens between typing and results, this is worth 45 minutes.

→ ${TUTORIAL_URL}

What is something you always assumed was magic — until you saw the math behind it?

#MachineLearning #NLP #AI #SearchEngines #TechEducation`

function Step9({ onUnlock, unlockedBadges, xp, onRestart }) {
  const [copied, setCopied]       = useState(false)
  const [linkedInReady, setLinkedInReady] = useState(false)

  useEffect(() => { onUnlock('master') }, [])

  const totalXP      = BADGES.reduce((s, b) => s + b.xp, 0)
  const earnedCount  = unlockedBadges.length
  const pct          = Math.round((xp / totalXP) * 100)

  const handleCopy = () => {
    navigator.clipboard.writeText(LINKEDIN_POST).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  // LinkedIn has no URL API to pre-fill post text.
  // Best UX: copy text to clipboard, then open the new-post composer — user just pastes.
  const handleLinkedIn = () => {
    navigator.clipboard.writeText(LINKEDIN_POST).then(() => {
      setLinkedInReady(true)
      setTimeout(() => setLinkedInReady(false), 6000)
      window.open('https://www.linkedin.com/feed/', '_blank', 'noopener,noreferrer')
    })
  }

  return (
    <SpaceBetween size="m">

      {/* ── Header ── */}
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
            <h2 style={{ color: C.text1, margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>
              What You Built Today
            </h2>
            <p style={{ color: C.text2, margin: 0, fontSize: 14 }}>
              A working TF-IDF search engine — the same pipeline used in production systems.
            </p>
          </div>
          <div style={{
            background: `${C.orange}18`, border: `1px solid ${C.orange}50`,
            borderRadius: 10, padding: '12px 20px', textAlign: 'center', flexShrink: 0,
          }}>
            <div style={{ color: C.text3, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Pipeline Coverage</div>
            <div style={{ color: C.orange, fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{pct}%</div>
            <div style={{ color: C.text3, fontSize: 11, marginTop: 3 }}>{xp} / {totalXP} XP earned</div>
            <div style={{ color: C.text3, fontSize: 11 }}>{earnedCount} of {BADGES.length} milestones</div>
          </div>
        </div>
      </div>

      {/* ── Functions implemented ── */}
      <div style={card()}>
        <div style={{ color: C.orange, fontWeight: 'bold', marginBottom: 14, fontSize: 14 }}>
          The Search Engine Pipeline — End to End
        </div>
        <div style={codeBox}>
          {[
            ['parse_html(html)',          '→ str',    'Strip tags, extract visible text'],
            ['tokenise(text)',            '→ list',   'text.lower().split()'],
            ['remove_stop_words(tokens)', '→ list',   'Filter "the", "a", "for" — noise'],
            ['stem(token)',               '→ str',    'STEM_RULES lookup: "recipes" → "recip"'],
            ['build_inverted_index(docs)','→ dict',   'term → [doc_id, ...]'],
            ['tf(term, doc)',             '→ float',  'count(term) / len(doc_terms)'],
            ['idf(term)',                 '→ float',  'ln(N / df)  — rewards rare terms'],
            ['search(query)',             '→ ranked', 'TF×IDF score → sorted results'],
          ].map(([fn, ret, desc]) => (
            <div key={fn} style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 7 }}>
              <span style={{ color: C.codeKw, fontFamily: 'monospace', fontSize: 12, minWidth: 210 }}>{fn}</span>
              <span style={{ color: C.codeStr, fontFamily: 'monospace', fontSize: 12, minWidth: 60 }}>{ret}</span>
              <span style={{ color: C.codeCmt, fontSize: 12 }}># {desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Key insight ── */}
      <div style={{ ...card(C.bg2, C.purple), borderLeft: `3px solid ${C.purple}` }}>
        <div style={{ color: C.purple, fontWeight: 'bold', marginBottom: 8, fontSize: 14 }}>
          The Core Insight — Why Inverted Index Matters
        </div>
        <p style={{ color: C.text2, margin: '0 0 8px', fontSize: 13, lineHeight: 1.6 }}>
          A naïve search engine scans every document for every query.
          With 15 docs it's fast — with 15 billion web pages it's impossible.
        </p>
        <p style={{ color: C.text2, margin: 0, fontSize: 13, lineHeight: 1.6 }}>
          The inverted index flips the lookup: instead of <em>"does doc X contain the word?"</em>
          you ask <em>"which docs contain this word?"</em> — and get the answer in O(1).
          Google's index is just a massive version of what you built.
        </p>
      </div>

      {/* ── What's next ── */}
      <div style={{ ...card('#0D1321', C.blue), borderLeft: `3px solid ${C.blue}` }}>
        <div style={{ color: C.blue, fontWeight: 'bold', marginBottom: 8, fontSize: 14 }}>
          The Limit You Found — What's Next
        </div>
        <p style={{ color: C.text2, margin: '0 0 8px', fontSize: 13, lineHeight: 1.6 }}>
          Your engine has no concept of meaning. "pizza" and "pie" are unrelated.
          Search "neapolitan" and you get nothing — even though it's exactly about pizza.
        </p>
        <p style={{ color: C.text2, margin: 0, fontSize: 13, lineHeight: 1.6 }}>
          <strong style={{ color: C.blue2 }}>Word Embeddings</strong> solve this: every word becomes
          a vector in 300-dimensional space. "pizza" and "pie" end up close together.
          That's the foundation of semantic search, BERT, and every modern LLM.
        </p>
      </div>

      {/* ── Run in Python ── */}
      <div style={{ ...card('#0D1321', C.border2), border: `1px solid ${C.border2}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <div>
            <div style={{ color: C.text1, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              Run the Real Code in Python
            </div>
            <div style={{ color: C.text3, fontSize: 12 }}>
              You understood the concepts — now run the same pipeline in a real notebook.
            </div>
          </div>
          <a
            href="https://github.com/nursnaaz/zero-to-genai-engineer/tree/main/00_search_engine"
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 6,
              border: `1px solid ${C.border2}`, background: C.bg1,
              color: C.text2, fontSize: 12, fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}
          >
            <span style={{ fontSize: 14 }}>⭐</span> View on GitHub
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {[
            {
              num: '01',
              title: 'Build the Search Engine',
              desc: 'Tokenisation → stop words → stemming → inverted index → TF-IDF ranking. Full pipeline from scratch.',
              time: '30 min',
              colab: 'https://colab.research.google.com/github/nursnaaz/zero-to-genai-engineer/blob/main/00_search_engine/notebooks/01_search_engine.ipynb',
              github: 'https://github.com/nursnaaz/zero-to-genai-engineer/blob/main/00_search_engine/notebooks/01_search_engine.ipynb',
            },
            {
              num: '02',
              title: 'TF-IDF Math Explained',
              desc: 'Step-by-step breakdown of the math — why naive counting fails and how TF × IDF combines to give relevance.',
              time: '45 min',
              colab: 'https://colab.research.google.com/github/nursnaaz/zero-to-genai-engineer/blob/main/00_search_engine/notebooks/02_tfidf_explained.ipynb',
              github: 'https://github.com/nursnaaz/zero-to-genai-engineer/blob/main/00_search_engine/notebooks/02_tfidf_explained.ipynb',
            },
          ].map(nb => (
            <div key={nb.num} style={{
              background: C.bg2, border: `1px solid ${C.border2}`,
              borderRadius: 8, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <span style={{ color: C.text3, fontFamily: 'monospace', fontSize: 11 }}>Notebook {nb.num}</span>
                <span style={{ color: C.text3, fontSize: 11 }}>⏱ {nb.time}</span>
              </div>
              <div style={{ color: C.text1, fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{nb.title}</div>
              <div style={{ color: C.text3, fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>{nb.desc}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={nb.colab}
                  target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '7px 0', borderRadius: 5, textDecoration: 'none', fontSize: 12, fontWeight: 600,
                    background: `${C.orange}22`, border: `1px solid ${C.orange}60`, color: C.orange }}
                >
                  <span>▶</span> Open in Colab
                </a>
                <a
                  href={nb.github}
                  target="_blank" rel="noopener noreferrer"
                  style={{ padding: '7px 12px', borderRadius: 5, textDecoration: 'none', fontSize: 12, fontWeight: 600,
                    background: C.bg1, border: `1px solid ${C.border2}`, color: C.text2 }}
                >
                  GitHub
                </a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6,
          background: `${C.green}10`, border: `1px solid ${C.green}30`,
          color: C.text3, fontSize: 12 }}>
          No API key needed — everything runs on pure Python (<code style={{ color: C.green2 }}>collections</code>, <code style={{ color: C.green2 }}>math</code>).
          Works in Google Colab or locally.
        </div>
      </div>

      {/* ── LinkedIn share ── */}
      <div style={{ ...card(C.bg2, C.border2), border: `1px solid ${C.border2}` }}>
        <div style={{ color: C.text1, fontWeight: 'bold', marginBottom: 6, fontSize: 14 }}>
          Show Your Network What You Now Understand
        </div>
        <p style={{ color: C.text3, fontSize: 13, margin: '0 0 14px', lineHeight: 1.5 }}>
          This post demonstrates real understanding — not "I finished a course."
          Add one personal insight before posting. Your version will always land better than a generic copy.
        </p>

        {/* Post preview */}
        <div style={{
          ...codeBox, fontSize: 12, lineHeight: 1.7, whiteSpace: 'pre-wrap',
          color: C.text2, marginBottom: 14, maxHeight: 220, overflowY: 'auto',
        }}>
          {LINKEDIN_POST}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={handleCopy}
            style={{
              padding: '9px 20px', borderRadius: 6, cursor: 'pointer',
              border: `1px solid ${copied ? C.green : C.border2}`,
              background: copied ? '#0A1F14' : C.bg1,
              color: copied ? C.green2 : C.text1,
              fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Copied' : 'Copy post text'}
          </button>
          <button
            onClick={handleLinkedIn}
            style={{
              padding: '9px 20px', borderRadius: 6, cursor: 'pointer',
              border: `1px solid ${C.blue}60`,
              background: `${C.blue}18`,
              color: C.blue2,
              fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
            }}
          >
            Copy &amp; Open LinkedIn →
          </button>
        </div>
        {linkedInReady && (
          <div style={{
            marginTop: 10, padding: '8px 14px', borderRadius: 6,
            background: `${C.blue}12`, border: `1px solid ${C.blue}40`,
            color: C.blue2, fontSize: 13,
          }}>
            Text copied — paste it in LinkedIn with <strong>Ctrl+V</strong> (or <strong>⌘V</strong> on Mac)
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

export function HowSearchEnginesWork({ onStepChange }) {
  const [step, setStep] = useState(0)
  const [xp, setXp] = useState(0)
  const [unlockedBadges, setUnlockedBadges] = useState([])
  const [toast, setToast] = useState(null)

  const TOTAL_STEPS = 10

  useEffect(() => {
    onStepChange?.(step, TOTAL_STEPS)
  }, [step, onStepChange])

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
    'Mission Brief', 'HTML Parsing', 'Tokenization',
    'Stop Words', 'Stemming', 'Inverted Index',
    'TF-IDF Math', 'Live Search', 'Fatal Flaws', 'What You Built',
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
    <Step8 onUnlock={unlock} onNext={next} />,
    <Step9 onUnlock={unlock} unlockedBadges={unlockedBadges} xp={xp} onRestart={restart} />,
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
                <span
                  key={b.id}
                  title={`${b.title} (+${b.xp} XP)`}
                  style={{ fontSize: 15, opacity: unlockedBadges.includes(b.id) ? 1 : 0.15, transition: 'opacity 0.3s' }}
                >
                  {b.emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: C.bg0, borderRadius: 4, height: 6 }}>
          <div style={{
            width: `${((step + 1) / TOTAL_STEPS) * 100}%`,
            height: '100%', background: `linear-gradient(90deg, ${C.blue} 0%, ${C.orange} 100%)`, borderRadius: 4,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      <PipelineJourney step={step} />

      {steps[step]}
    </SpaceBetween>
  )
}
