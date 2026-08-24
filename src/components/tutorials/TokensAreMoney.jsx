import { useMemo, useState } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import Button from '@cloudscape-design/components/button'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import Table from '@cloudscape-design/components/table'
import { LabShell } from '../lab/LabShell'
import { calloutBox, pill, codeBox } from '../lab/labTheme'
import { Insight, ChoiceExercise, CourseLink, BarChart } from '../lab/LabWidgets'
import { StudentNote } from '../interactive/StudentNote'
import { TryYourself } from '../interactive/TryYourself'
import { InteractiveInput } from '../interactive/InterativeInput'
import { Stage, FlowStrip, TokenRow } from '../lab/Viz'

const WORDS = ['low', 'lower', 'newest', 'wide', 'wider', 'newest']

function wordChars(word) {
  return word.split('')
}

function pairCountsPerWord(wordsTokens) {
  const counts = {}
  wordsTokens.forEach((toks) => {
    for (let i = 0; i < toks.length - 1; i++) {
      const key = `${toks[i]}+${toks[i + 1]}`
      counts[key] = (counts[key] || 0) + 1
    }
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

function mergeOnce(wordsTokens, pairLabel) {
  const [a, b] = pairLabel.split('+')
  return wordsTokens.map((toks) => {
    const out = []
    for (let i = 0; i < toks.length; i++) {
      if (i < toks.length - 1 && toks[i] === a && toks[i + 1] === b) {
        out.push(a + b)
        i++
      } else out.push(toks[i])
    }
    return out
  })
}

const TITLES = [
  'The problem: APIs do not sell words',
  'What a token actually is',
  'Split into characters',
  'Count every neighbour pair',
  'Merge #1. full worked example',
  'Keep merging (watch the vocabulary grow)',
  'The cost formula, number by number',
  'A real prompt budget',
  'What you can now explain',
]

export function TokensAreMoney({ onStepChange }) {
  return (
    <LabShell titles={TITLES} onStepChange={onStepChange}>
      {({ step, go }) => <Steps step={step} go={go} />}
    </LabShell>
  )
}

function Steps({ step, go }) {
  const [merges, setMerges] = useState(0)
  const initial = WORDS.map(wordChars)
  const state = useMemo(() => {
    let wordsTokens = initial.map((t) => [...t])
    const history = []
    for (let i = 0; i < merges; i++) {
      const pairs = pairCountsPerWord(wordsTokens)
      if (!pairs.length || pairs[0][1] < 2) break
      history.push({ pair: pairs[0][0], count: pairs[0][1] })
      wordsTokens = mergeOnce(wordsTokens, pairs[0][0])
    }
    return { wordsTokens, pairs: pairCountsPerWord(wordsTokens), history }
  }, [merges])

  if (step === 0) {
    const winner = state.pairs[0]
    return (
      <SpaceBetween size="m">
        <Stage eyebrow="Click. Watch tokens glue together">
          <FlowStrip
            steps={['characters', 'count pairs', 'glue winner', 'repeat', 'bill']}
            active={Math.min(4, merges)}
            onSelect={(i) => go?.(i === 0 ? 0 : i + 1)}
          />
          <Box variant="p" padding={{ top: 's', bottom: 's' }}>
            APIs bill <strong>tokens</strong>, not English words. Click merge: the most common
            neighbour pair becomes one chip. That is BPE.
          </Box>
          <SpaceBetween size="s">
            {state.wordsTokens.map((toks, wi) => (
              <div key={wi} style={{ marginBottom: 8 }}>
                <Box variant="small" color="text-body-secondary">{WORDS[wi]}</Box>
                <TokenRow tokens={toks} highlightPair={winner ? winner[0].split('+') : null} />
              </div>
            ))}
          </SpaceBetween>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
            <Button
              variant="primary"
              onClick={() => setMerges((m) => m + 1)}
              disabled={!winner || winner[1] < 2}
            >
              Merge “{winner ? winner[0].replace('+', ' + ') : '—'}” ({winner ? winner[1] : 0}×)
            </Button>
            <Button onClick={() => setMerges(0)}>Reset to letters</Button>
          </div>
          <Box variant="small" padding={{ top: 's' }}>
            Top pairs right now: {state.pairs.slice(0, 4).map(([p, c]) => `${p} (${c})`).join(' · ') || 'done'}
          </Box>
        </Stage>
        <StudentNote title="The bill is not per English word">
          Hosts charge per <em>token</em>. Work the rest of the steps for the pair table, the
          dollar formula, and a 4k budget. The board above is the same algorithm.
        </StudentNote>
        <Container header={<Header variant="h3">Your 9-step roadmap</Header>}>
          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 's', header: 'Step', cell: (i) => i.s },
              { id: 'w', header: 'What we do', cell: (i) => i.w },
              { id: 'o', header: 'What you walk away with', cell: (i) => i.o },
            ]}
            items={[
              { s: '1 (this page)', w: 'Why words ≠ tokens', o: 'The billing unit' },
              { s: '2', w: 'Token vs character vs word', o: 'A precise definition' },
              { s: '3', w: 'Start BPE: characters only', o: 'The initial vocabulary' },
              { s: '4', w: 'Count neighbour pairs', o: 'A frequency table you can audit' },
              { s: '5', w: 'Merge the winner once', o: 'A worked numerical example' },
              { s: '6', w: 'Repeat merges live', o: 'A growing vocabulary in the browser' },
              { s: '7', w: 'Cost = in + out', o: 'A formula you can compute' },
              { s: '8', w: 'Budget a 4k-token window', o: 'Where history and RAG compete' },
              { s: '9', w: 'Recap', o: 'One paragraph you could teach' },
            ]}
          />
        </Container>

        <Container header={<Header variant="h3">Running example</Header>}>
          <div style={calloutBox}>
            Corpus (6 words, two of them repeated. that repetition is the whole trick):
            <Box variant="h2" textAlign="center" padding="s">
              low &nbsp; lower &nbsp; newest &nbsp; wide &nbsp; wider &nbsp; newest
            </Box>
            We keep this corpus frozen for every step, exactly the way the self-attention
            tutorial keeps “I bought apple to eat”.
          </div>
        </Container>
      </SpaceBetween>
    )
  }

  if (step === 1) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="What is a token?">
          A token is a <strong>chunk of text from a fixed vocabulary</strong> that the model
          was trained to read. The vocabulary is built before training. At inference time the
          tokenizer can only emit ids from that list.<br /><br />
          Three different lengths people mix up:
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'u', header: 'Unit', cell: (i) => i.u },
            { id: 'e', header: 'Example', cell: (i) => i.e },
            { id: 'n', header: 'Why it misleads you', cell: (i) => i.n },
          ]}
          items={[
            { u: 'Character', e: 'l, o, w', n: 'Too small. A 1000-character email is not 1000 “ideas”.' },
            { u: 'Word', e: 'lower', n: 'English-centric. “unhappiness” and “😀” break the rule.' },
            { u: 'Token (BPE)', e: 'low, er', n: 'This is what GPT-style models actually count.' },
          ]}
        />
        <Container header={<Header variant="h3">A word that is not one token</Header>}>
          <Box variant="p">
            GPT-2 / tiktoken style tokenizers often split <code>unhappiness</code> into pieces
            such as <code>un</code> + <code>happiness</code>, or even smaller bits depending on
            the vocabulary. The model never sees the string “unhappiness” as a single id unless
            that exact piece was common enough to earn a slot.
          </Box>
        </Container>
        <ChoiceExercise
          question="An API invoice of 800 tokens for a short email most likely means…"
          options={[
            'The email had 800 English words',
            'The tokenizer produced 800 vocabulary pieces (input + output combined, depending on the line item)',
            'The GPU ran for 800 milliseconds',
          ]}
          answer="The tokenizer produced 800 vocabulary pieces (input + output combined, depending on the line item)"
        />
      </SpaceBetween>
    )
  }

  if (step === 2) {
    const rows = WORDS.map((w) => ({
      word: w,
      chars: wordChars(w).join(' · '),
      n: wordChars(w).length,
    }))
    const totalChars = rows.reduce((s, r) => s + r.n, 0)
    return (
      <SpaceBetween size="m">
        <StudentNote title="BPE begins poorer than English">
          Before any merge, the vocabulary is just the alphabet. <code>lower</code> is five
          tokens: l, o, w, e, r. That feels wasteful. The algorithm’s job is to steal
          frequent pairs until common words (and common pieces of words) become single tokens.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'word', header: 'Word', cell: (i) => i.word },
            { id: 'chars', header: 'Character tokens', cell: (i) => i.chars },
            { id: 'n', header: 'Count', cell: (i) => i.n },
          ]}
          items={rows}
        />
        <Box>
          Total character tokens in the corpus: <strong>{totalChars}</strong>. Word count is only{' '}
          <strong>{WORDS.length}</strong>. Already you see why “1 token ≈ 0.75 words” is a
          rumour, not a law: it depends on language, code, and whitespace.
        </Box>
        <div>
          {WORDS.map((w, wi) => (
            <div key={wi} style={{ marginBottom: 8 }}>
              {wordChars(w).map((ch, i) => (
                <span key={i} style={pill('blue')}>{ch}</span>
              ))}
            </div>
          ))}
        </div>
        <StudentNote>
          <strong>Rule we will obey:</strong> pairs are counted <em>inside a word</em>, never
          across the space between <code>low</code> and <code>lower</code>. Real BPE on bytes
          can merge spaces too; we keep words separate so the table stays readable.
        </StudentNote>
      </SpaceBetween>
    )
  }

  if (step === 3) {
    const pairs = pairCountsPerWord(initial)
    return (
      <SpaceBetween size="m">
        <StudentNote title="The entire algorithm is this sentence">
          Look at every two neighbours. Count them. Glue the pair with the highest count.
          That new glued string is added to the vocabulary. Repeat.
        </StudentNote>
        <Container header={<Header variant="h3">Every pair in the corpus (before any merge)</Header>}>
          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 'p', header: 'Pair', cell: (i) => i.p },
              { id: 'c', header: 'Count', cell: (i) => i.c },
              { id: 'w', header: 'Where it appears', cell: (i) => i.w },
            ]}
            items={[
              { p: 'w + e', c: 3, w: 'lower; newest; newest' },
              { p: 'l + o', c: 2, w: 'low; lower' },
              { p: 'o + w', c: 2, w: 'low; lower' },
              { p: 'e + r', c: 2, w: 'lower; wider' },
              { p: 'n + e', c: 2, w: 'newest; newest' },
              { p: 'e + w', c: 2, w: 'newest; newest' },
              { p: 'e + s', c: 2, w: 'newest; newest' },
              { p: 's + t', c: 2, w: 'newest; newest' },
              { p: 'w + i', c: 2, w: 'wide; wider' },
              { p: 'i + d', c: 2, w: 'wide; wider' },
              { p: 'd + e', c: 2, w: 'wide; wider' },
            ]}
          />
        </Container>
        <BarChart items={pairs.map(([label, value]) => ({ label: label.replace('+', ' + '), value }))} />
        <TryYourself>
          <Box variant="h4">Count it yourself</Box>
          <Box variant="p">
            How many times does the pair <strong>w + e</strong> occur in the six words?
            (Look at lower, newest, newest.)
          </Box>
          <InteractiveInput
            label="Count of w+e"
            correctAnswer={3}
            hint="lower has w-e once. Each newest has w-e once. Two copies of newest → 1+1+1 = 3."
            tolerance={0.1}
          />
        </TryYourself>
      </SpaceBetween>
    )
  }

  if (step === 4) {
    const after = mergeOnce(initial, 'w+e')
    return (
      <SpaceBetween size="m">
        <StudentNote title="Merge #1, written out">
          Winner: <strong>w+e</strong> with count 3. Every time we see those two characters in
          order, we replace them with a single token <code>we</code>.
        </StudentNote>
        <div style={{ background: '#ffebee', padding: 20, borderRadius: 8, border: '2px solid #e74c3c', fontFamily: 'monospace', lineHeight: 1.9 }}>
          lower &nbsp;: l o <strong>w e</strong> r &nbsp;→&nbsp; l o <strong>we</strong> r<br />
          newest : n e <strong>w e</strong> s t → n e <strong>we</strong> s t &nbsp;(twice in the corpus)<br />
          wide / wider / low : no <code>we</code> substring in that order, so they stay as characters.
        </div>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'word', header: 'Word', cell: (i) => i.word },
            { id: 'before', header: 'Before', cell: (i) => i.before },
            { id: 'after', header: 'After merge we', cell: (i) => i.after },
          ]}
          items={WORDS.map((w, i) => ({
            word: w,
            before: wordChars(w).join(' '),
            after: after[i].join(' '),
          }))}
        />
        <Insight title="Why this pair?">
          <code>we</code> is not an English word here. It is just a frequent chunk. BPE does
          not know linguistics. Frequency is the only vote.
        </Insight>
      </SpaceBetween>
    )
  }

  if (step === 5) {
    const canMerge = state.pairs[0] && state.pairs[0][1] >= 2
    return (
      <SpaceBetween size="m">
        <StudentNote>
          Each extra merge is the same rule. Use the buttons. Green chips are already merged
          chunks. that is a baby vocabulary.
        </StudentNote>
        <SpaceBetween direction="horizontal" size="s">
          <Button variant="primary" disabled={!canMerge} onClick={() => setMerges((m) => m + 1)}>
            Run one more merge
          </Button>
          <Button onClick={() => setMerges(1)}>Reset to after merge #1</Button>
        </SpaceBetween>
        <Box>
          Merges applied after the initial character split: <strong>{state.history.length}</strong>
          {state.history.length > 0 && (
            <> (last winner: <code>{state.history[state.history.length - 1].pair}</code>)</>
          )}
        </Box>
        <Stage eyebrow="Live vocabulary">
          {state.wordsTokens.map((toks, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{WORDS[i]}</div>
              <TokenRow tokens={toks} highlightPair={state.pairs[0]?.[0]?.split('+')} />
            </div>
          ))}
        </Stage>
        <BarChart
          items={state.pairs.slice(0, 8).map(([label, value]) => ({
            label: label.replace('+', ' + '),
            value,
          }))}
        />
      </SpaceBetween>
    )
  }

  if (step === 6) {
    const pin = 180
    const pout = 420
    const priceIn = 0.15
    const priceOut = 0.6
    const cost = (pin * priceIn + pout * priceOut) / 1e6
    return (
      <SpaceBetween size="m">
        <StudentNote title="The invoice has two lines">
          <strong>Input tokens</strong> = everything you send (system + history + user).<br />
          <strong>Output tokens</strong> = everything the model writes back.<br /><br />
          Output is usually priced higher because generation is the expensive part of the GPU.
        </StudentNote>
        <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, fontFamily: 'monospace', lineHeight: 1.9 }}>
          cost = (prompt_tokens × price_in + completion_tokens × price_out) / 1,000,000<br /><br />
          Illustrative prices (per million tokens): input ${priceIn.toFixed(2)}, output ${priceOut.toFixed(2)}<br />
          prompt_tokens = {pin}<br />
          completion_tokens = {pout}<br />
          cost = ({pin}×{priceIn} + {pout}×{priceOut}) / 1e6 = <strong>${cost.toFixed(6)}</strong>
        </div>
        <TryYourself>
          <Box variant="h4">Compute the dollar cost</Box>
          <Box variant="p">
            Same numbers: 180 input, 420 output, $0.15 / $0.60 per million. What is the cost in dollars?
            Enter 0.000279 if you got 2.79×10⁻⁴.
          </Box>
          <InteractiveInput
            label="Cost in dollars"
            correctAnswer={0.000279}
            hint="(180×0.15 + 420×0.60) = 27 + 252 = 279. Divide by 1,000,000 → 0.000279"
            tolerance={0.000001}
          />
        </TryYourself>
        <Insight>
          One reply is cheap. A chatbot that resends 8,000 tokens of history on every “ok”
          is not. Tokens are money because they compound.
        </Insight>
      </SpaceBetween>
    )
  }

  if (step === 7) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="A 8,192-token window is a budget, not a warehouse">
          System prompt, chat history, retrieved handbook chunks, and the model’s answer
          <strong> share the same van</strong>. If you fill 8,000 tokens with PDFs, there is
          no room left to write a useful reply.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'b', header: 'Bucket', cell: (i) => i.b },
            { id: 't', header: 'Example tokens', cell: (i) => i.t },
            { id: 'n', header: 'What happens if it grows', cell: (i) => i.n },
          ]}
          items={[
            { b: 'System rules', t: '400', n: 'Safety text you should almost never drop' },
            { b: 'Chat history', t: '2,500', n: 'Trim or summarise old turns' },
            { b: 'Retrieved chunks', t: '3,000', n: 'Fewer, better chunks beat more junk' },
            { b: 'Reserved output', t: '800', n: 'If you forget this, generation hits the wall' },
            { b: 'Slack', t: '1,492', n: 'Room for the current question' },
          ]}
        />
        <TryYourself>
          <Box variant="h4">Remaining budget</Box>
          <Box variant="p">8192 − 400 − 2500 − 3000 − 800 = ?</Box>
          <InteractiveInput label="Tokens of slack" correctAnswer={1492} hint="8192 − 6700 = 1492" tolerance={0.5} />
        </TryYourself>
      </SpaceBetween>
    )
  }

  return (
    <SpaceBetween size="m">
      <StudentNote title="Say this out loud">
        BPE starts with characters and repeatedly glues the most common neighbour pair.
        The resulting pieces are tokens. Models read tokens. APIs bill tokens. A long
        prompt with the same meaning as a short prompt costs more. even if a human
        thinks they “said the same thing”.
      </StudentNote>
      <ChoiceExercise
        question="Is one English word always one token?"
        options={['Yes', 'No']}
        answer="No"
      />
      <pre style={codeBox}>{`# Later, in Python (class notebook):
import tiktoken
enc = tiktoken.get_encoding("cl100k_base")
ids = enc.encode("unhappiness")
print(len(ids), enc.decode(ids))`}</pre>
      <CourseLink>
        Next: the sampling tutorial (temperature, top-k, top-p) uses the tokens you just
        defined. Then the live API notebook counts them with tiktoken.
      </CourseLink>
    </SpaceBetween>
  )
}
