import { useMemo, useState } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import Table from '@cloudscape-design/components/table'
import { LabShell } from '../lab/LabShell'
import { Insight, Warn, ChoiceExercise, BarChart, CourseLink } from '../lab/LabWidgets'
import { StudentNote } from '../interactive/StudentNote'
import { TryYourself } from '../interactive/TryYourself'
import { InteractiveInput } from '../interactive/InterativeInput'
import { pill } from '../lab/labTheme'
import { Stage, LiveBars, FlowStrip } from '../lab/Viz'

const LOGITS = [
  { label: 'delicious', z: 2.4 },
  { label: 'ready', z: 1.6 },
  { label: 'burning', z: 0.4 },
  { label: 'quietly', z: -0.3 },
  { label: 'purple', z: -1.2 },
]

function softmax(values, T) {
  const scaled = values.map((v) => v / Math.max(T, 0.05))
  const m = Math.max(...scaled)
  const exps = scaled.map((v) => Math.exp(v - m))
  const sum = exps.reduce((a, b) => a + b, 0)
  return { probs: exps.map((e) => e / sum), exps, sum, scaled }
}

function applyTopK(probs, k) {
  const indexed = probs.map((p, i) => ({ p, i })).sort((a, b) => b.p - a.p)
  const keep = new Set(indexed.slice(0, k).map((x) => x.i))
  const masked = probs.map((p, i) => (keep.has(i) ? p : 0))
  const s = masked.reduce((a, b) => a + b, 0) || 1
  return masked.map((p) => p / s)
}

function applyTopP(probs, pCut) {
  const indexed = probs.map((p, i) => ({ p, i })).sort((a, b) => b.p - a.p)
  let acc = 0
  const keep = new Set()
  for (const row of indexed) {
    keep.add(row.i)
    acc += row.p
    if (acc >= pCut) break
  }
  const masked = probs.map((p, i) => (keep.has(i) ? p : 0))
  const s = masked.reduce((a, b) => a + b, 0) || 1
  return { probs: masked.map((p) => p / s), keep }
}

const TITLES = [
  'Generation is one token at a time',
  'Logits are not probabilities',
  'Softmax. full arithmetic',
  'Temperature stretches the logits',
  'Top-k throws away the tail',
  'Top-p keeps a nucleus',
  'The production order',
  'What greedy vs random feels like',
  'Recap',
]

export function SamplingPlayground({ onStepChange }) {
  return (
    <LabShell titles={TITLES} onStepChange={onStepChange}>
      {({ step }) => <Steps step={step} />}
    </LabShell>
  )
}

function Steps({ step }) {
  const [T, setT] = useState(1)
  const [k, setK] = useState(3)
  const [p, setP] = useState(0.9)
  const zs = LOGITS.map((x) => x.z)
  const soft1 = useMemo(() => softmax(zs, 1), [])
  const softT = useMemo(() => softmax(zs, T), [T])
  const afterK = useMemo(() => applyTopK(softT.probs, k), [softT, k])
  const afterP = useMemo(() => applyTopP(softT.probs, p), [softT, p])

  if (step === 0) {
    return (
      <SpaceBetween size="m">
        <Stage eyebrow="The pizza is … click Draw">
          <div style={{ marginBottom: 12 }}>
            {['The', 'pizza', 'is', '???'].map((w) => (
              <span key={w} style={pill(w === '???' ? 'yellow' : 'blue')}>{w}</span>
            ))}
          </div>
          <Box>Temperature T = {T.toFixed(2)} (drag: peaky ↔ flat)</Box>
          <input type="range" min="0.2" max="2" step="0.05" value={T} onChange={(e) => setT(Number(e.target.value))} style={{ width: '100%' }} />
          <LiveBars items={LOGITS.map((x, i) => ({ label: x.label, value: softT.probs[i] }))} onSample={() => {}} />
        </Stage>
        <StudentNote title="The model does not write a paragraph">
          Read this prompt: <strong>“The pizza is”</strong>. A transformer scores every next
          token, turns scores into probabilities, <strong>samples one token</strong>, appends
          it, and repeats. Drag T and hit Draw so you feel the lottery, not a slogan.
        </StudentNote>
        <Container header={<Header variant="h3">Roadmap</Header>}>
          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 's', header: 'Step', cell: (i) => i.s },
              { id: 'w', header: 'Idea', cell: (i) => i.w },
            ]}
            items={[
              { s: '1', w: 'One token per step' },
              { s: '2', w: 'Logits (raw scores)' },
              { s: '3', w: 'Softmax arithmetic you can check' },
              { s: '4', w: 'Temperature' },
              { s: '5', w: 'Top-k' },
              { s: '6', w: 'Top-p' },
              { s: '7', w: 'Order of operations (this is a real production bug)' },
              { s: '8', w: 'Greedy vs sample' },
              { s: '9', w: 'Recap' },
            ]}
          />
        </Container>
        <Insight title="Tiny vocabulary on purpose">
          Real models have 30,000–100,000+ tokens. We keep five candidates so you can finish
          every sum by hand, the same way self-attention used 4 dimensions.
        </Insight>
      </SpaceBetween>
    )
  }

  if (step === 1) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="What is a logit?">
          After the last transformer block, each vocabulary item gets a raw score called a
          <strong> logit</strong>. It can be any real number: 2.4, −1.2, whatever the network
          outputs. It is <em>not</em> a probability yet. Negative logits are allowed. They
          just mean “this token is disfavoured”, not “impossible”.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 't', header: 'Candidate next token', cell: (i) => i.t },
            { id: 'z', header: 'Logit z', cell: (i) => i.z },
            { id: 'm', header: 'Plain-language read', cell: (i) => i.m },
          ]}
          items={[
            { t: 'delicious', z: '2.4', m: 'Strongly preferred' },
            { t: 'ready', z: '1.6', m: 'Also plausible' },
            { t: 'burning', z: '0.4', m: 'Possible, less likely' },
            { t: 'quietly', z: '−0.3', m: 'Odd in this sentence' },
            { t: 'purple', z: '−1.2', m: 'The model really does not want this' },
          ]}
        />
        <ChoiceExercise
          question="Can a token with a negative logit still be sampled?"
          options={['No, negative means probability 0', 'Yes, after softmax it still has a tiny probability', 'Only if temperature is 0']}
          answer="Yes, after softmax it still has a tiny probability"
        />
      </SpaceBetween>
    )
  }

  if (step === 2) {
    const { exps, sum, probs } = soft1
    return (
      <SpaceBetween size="m">
        <StudentNote title="Softmax, written like the attention tutorial">
          For each logit z we compute e<sup>z</sup>, then divide by the sum of those
          exponentials. Every probability is positive. They add up to 1. That is the whole
          conversion from “score” to “pie chart”.
        </StudentNote>
        <div style={{ background: '#ffebee', padding: 20, borderRadius: 8, border: '2px solid #e74c3c', fontFamily: 'monospace', lineHeight: 1.9 }}>
          For delicious: e<sup>2.4</sup> ≈ {exps[0].toFixed(4)}<br />
          For ready:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e<sup>1.6</sup> ≈ {exps[1].toFixed(4)}<br />
          For burning:&nbsp;&nbsp;e<sup>0.4</sup> ≈ {exps[2].toFixed(4)}<br />
          For quietly:&nbsp;&nbsp;e<sup>−0.3</sup> ≈ {exps[3].toFixed(4)}<br />
          For purple:&nbsp;&nbsp;&nbsp;e<sup>−1.2</sup> ≈ {exps[4].toFixed(4)}<br />
          Sum of exp = <strong>{sum.toFixed(4)}</strong><br /><br />
          P(delicious) = {exps[0].toFixed(4)} / {sum.toFixed(4)} = <strong>{probs[0].toFixed(3)}</strong>
        </div>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 't', header: 'Token', cell: (i) => i.t },
            { id: 'p', header: 'P at T=1', cell: (i) => i.p },
          ]}
          items={LOGITS.map((x, i) => ({ t: x.label, p: probs[i].toFixed(3) }))}
        />
        <Stage eyebrow="Draw like the model does">
          <LiveBars items={LOGITS.map((x, i) => ({ label: x.label, value: probs[i] }))} onSample={() => {}} />
        </Stage>
        <TryYourself>
          <Box variant="h4">Your turn: P(ready)</Box>
          <Box variant="p">
            e<sup>1.6</sup> ≈ {exps[1].toFixed(4)}, sum ≈ {sum.toFixed(4)}. What is P(ready)? Three decimal places.
          </Box>
          <InteractiveInput
            label="P(ready)"
            correctAnswer={Number(probs[1].toFixed(3))}
            hint={`${exps[1].toFixed(4)} / ${sum.toFixed(4)} ≈ ${probs[1].toFixed(3)}`}
            tolerance={0.01}
          />
        </TryYourself>
      </SpaceBetween>
    )
  }

  if (step === 3) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Temperature T">
          We divide every logit by T <em>before</em> softmax.<br />
          T → 0: the largest logit dominates (greedy, boring, stable).<br />
          T = 1: the raw model distribution.<br />
          T &gt; 1: the bars flatten. “purple” gets more chance. Creative, sometimes nonsense.
        </StudentNote>
        <Box>T = {T.toFixed(2)}</Box>
        <input type="range" min="0.2" max="2" step="0.05" value={T} onChange={(e) => setT(Number(e.target.value))} style={{ width: '100%' }} />
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 't', header: 'Token', cell: (i) => i.t },
            { id: 'z', header: 'z / T', cell: (i) => i.z },
            { id: 'p', header: 'P', cell: (i) => i.p },
          ]}
          items={LOGITS.map((x, i) => ({
            t: x.label,
            z: (x.z / T).toFixed(3),
            p: softT.probs[i].toFixed(3),
          }))}
        />
        <Stage eyebrow="Temperature live">
          <LiveBars items={LOGITS.map((x, i) => ({ label: x.label, value: softT.probs[i] }))} onSample={() => {}} />
        </Stage>
        <Warn title="Classroom order">Always apply temperature before top-k / top-p. Those filters run on the probabilities after T.</Warn>
      </SpaceBetween>
    )
  }

  if (step === 4) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Top-k">
          Sort tokens by probability. Keep the k largest. Set the rest to 0. Renormalise so
          the survivors still sum to 1.<br /><br />
          k = 1 is greedy decoding: always pick the argmax. k = 5 on this toy list keeps everyone.
        </StudentNote>
        <Box>k = {k}</Box>
        <input type="range" min="1" max="5" step="1" value={k} onChange={(e) => setK(Number(e.target.value))} style={{ width: '100%' }} />
        <BarChart items={LOGITS.map((x, i) => ({ label: x.label, value: afterK[i], color: afterK[i] === 0 ? '#c62828' : '#2e7d32' }))} />
        <TryYourself>
          <Box variant="h4">If k = 1, what is P(delicious)?</Box>
          <InteractiveInput label="P(delicious) when k=1" correctAnswer={1} hint="Only the top token survives, then we renormalise to 1." tolerance={0.01} />
        </TryYourself>
      </SpaceBetween>
    )
  }

  if (step === 5) {
    const { keep } = afterP
    return (
      <SpaceBetween size="m">
        <StudentNote title="Top-p (nucleus)">
          Sort descending. Walk down the list adding probabilities until the running sum
          ≥ p. Keep that smallest set. Unlike k, the set size <em>adapts</em>: if one token
          already has 0.95, the nucleus might be a single token.
        </StudentNote>
        <Box>
          This step uses temperature T={T.toFixed(2)} but <strong>not</strong> your top-k setting,
          so you can see nucleus sampling on its own.
        </Box>
        <Box>p = {p.toFixed(2)}</Box>
        <input type="range" min="0.3" max="1" step="0.05" value={p} onChange={(e) => setP(Number(e.target.value))} style={{ width: '100%' }} />
        <Box>
          Tokens inside the nucleus:{' '}
          {LOGITS.filter((_, i) => keep.has(i)).map((x) => x.label).join(', ')}
        </Box>
        <BarChart items={LOGITS.map((x, i) => ({ label: x.label, value: afterP.probs[i], color: afterP.probs[i] === 0 ? '#c62828' : '#5b21b6' }))} />
      </SpaceBetween>
    )
  }

  if (step === 6) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="If you swap these, you sample the wrong pie">
          Libraries sometimes expose all three knobs. The mathematically intended order is:
        </StudentNote>
        <Stage eyebrow="Always this order">
          <FlowStrip
            steps={['logits', '÷ T', 'softmax', 'top-k', 'top-p', 'sample']}
            active={5}
          />
        </Stage>
        <ChoiceExercise
          question="If you apply top-p before temperature, what goes wrong?"
          options={[
            'Nothing',
            'You filter a different distribution than the one you meant to sample',
            'Softmax becomes optional',
          ]}
          answer="You filter a different distribution than the one you meant to sample"
        />
      </SpaceBetween>
    )
  }

  if (step === 7) {
    return (
      <SpaceBetween size="m">
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'm', header: 'Setting', cell: (i) => i.m },
            { id: 'f', header: 'Feel of the text', cell: (i) => i.f },
            { id: 'r', header: 'Risk', cell: (i) => i.r },
          ]}
          items={[
            { m: 'T ≈ 0, k = 1', f: 'Same answer every time', r: 'Repetition, dull support bots' },
            { m: 'T ≈ 0.7, k = 40, p = 0.9', f: 'Typical chat default', r: 'Still can hallucinate facts' },
            { m: 'T ≥ 1.2, large k, p = 1', f: 'Surprising, poetic', r: 'Broken JSON, invented policies' },
          ]}
        />
        <Insight>
          For extraction and classification, stay cold. For brainstorming subject lines, warm up.
          Do not use “creative” sampling on a refund policy.
        </Insight>
      </SpaceBetween>
    )
  }

  return (
    <SpaceBetween size="m">
      <StudentNote title="Say this out loud">
        The model scores tokens (logits), divides by temperature, softmaxes, optionally
        cuts the tail with top-k and top-p, then samples one token. That loop is generation.
      </StudentNote>
      <CourseLink>
        The Excel sheet in the tokens/sampling weekend uses the same order. Then you turn
        the knobs on a live API call.
      </CourseLink>
    </SpaceBetween>
  )
}
