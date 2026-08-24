import { useMemo, useState } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import Button from '@cloudscape-design/components/button'
import Input from '@cloudscape-design/components/input'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import Table from '@cloudscape-design/components/table'
import { LabShell } from '../lab/LabShell'
import { calloutBox } from '../lab/labTheme'
import { Insight, ChoiceExercise, CourseLink, BarChart } from '../lab/LabWidgets'
import { StudentNote } from '../interactive/StudentNote'
import { InteractiveInput } from '../interactive/InterativeInput'
import { TryYourself } from '../interactive/TryYourself'
import { Stage, RankLanes } from '../lab/Viz'

const DOCS = [
  { id: 'A', text: 'Customers may request a refund within 14 days if the class pack is unused.' },
  { id: 'B', text: 'Oat milk latte is the default café drink.' },
  { id: 'C', text: 'Money-back period for unused packs is two weeks from purchase.' },
  { id: 'D', text: 'Use promo code GYM2026 at checkout for 10% off.' },
]

function tokenize(t) {
  return t
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

function bm25ish(q, doc) {
  const qt = tokenize(q)
  const dt = tokenize(doc.text)
  let s = 0
  qt.forEach((w) => {
    const tf = dt.filter((x) => x === w).length
    if (tf) s += 1 + Math.log(1 + tf)
  })
  return s
}

function cosineish(q, doc) {
  const syn = {
    refund: 'money',
    money: 'money',
    back: 'money',
    unused: 'unused',
    pack: 'pack',
    packs: 'pack',
    fourteen: '14',
    '14': '14',
    two: '14',
    weeks: '14',
    days: '14',
  }
  const norm = (t) => tokenize(t).map((w) => syn[w] || w)
  const a = new Set(norm(q))
  const b = new Set(norm(doc.text))
  let inter = 0
  a.forEach((x) => {
    if (b.has(x)) inter += 1
  })
  return inter / Math.sqrt((a.size || 1) * (b.size || 1))
}

function ranksFromScores(scores) {
  return [...scores]
    .map((s, i) => ({ i, s }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((row, rank) => ({ doc: DOCS[row.i], rank: rank + 1, s: row.s }))
}

function rrf(rankLists, k = 60) {
  const acc = {}
  rankLists.forEach((list) => {
    list.forEach(({ doc, rank }) => {
      acc[doc.id] = (acc[doc.id] || 0) + 1 / (k + rank)
    })
  })
  return Object.entries(acc)
    .map(([id, s]) => ({ id, s }))
    .sort((a, b) => b.s - a.s)
}

const Q_REFUND = 'how do I get a refund'
const Q_CODE = 'GYM2026'
const Q_SYN = 'money back unused pack'

const TITLES = [
  'Keywords miss meaning; vectors miss codes',
  'Four handbook snippets',
  'BM25 on GYM2026',
  'BM25 on “how do I get a refund”',
  'Vectors on a synonym query',
  'Worked RRF: 1 / (60 + rank)',
  'When to run both',
]

export function HybridSearchRrf({ onStepChange }) {
  return (
    <LabShell titles={TITLES} onStepChange={onStepChange}>
      {({ step }) => <Steps step={step} />}
    </LabShell>
  )
}

function Steps({ step }) {
  const [q, setQ] = useState(Q_SYN)
  const bm = useMemo(() => ranksFromScores(DOCS.map((d) => bm25ish(q, d))), [q])
  const vec = useMemo(() => ranksFromScores(DOCS.map((d) => cosineish(q, d))), [q])
  const fused = useMemo(() => rrf([bm, vec]), [bm, vec])

  const bmCode = useMemo(() => ranksFromScores(DOCS.map((d) => bm25ish(Q_CODE, d))), [])
  const bmRefund = useMemo(() => ranksFromScores(DOCS.map((d) => bm25ish(Q_REFUND, d))), [])
  const vecRefund = useMemo(() => ranksFromScores(DOCS.map((d) => cosineish(Q_REFUND, d))), [])
  const vecSyn = useMemo(() => ranksFromScores(DOCS.map((d) => cosineish(Q_SYN, d))), [])

  const demoBm = ranksFromScores(DOCS.map((d) => bm25ish(Q_REFUND, d)))
  const demoVec = ranksFromScores(DOCS.map((d) => cosineish(Q_SYN, d)))
  const aBm = demoBm.find((r) => r.doc.id === 'A')
  const cBm = demoBm.find((r) => r.doc.id === 'C')
  const aVec = demoVec.find((r) => r.doc.id === 'A')
  const cVec = demoVec.find((r) => r.doc.id === 'C')
  const rrfA =
    1 / (60 + (aBm?.rank || 99)) + 1 / (60 + (aVec?.rank || 99))
  const rrfC =
    1 / (60 + (cBm?.rank || 99)) + 1 / (60 + (cVec?.rank || 99))

  if (step === 0) {
    return (
      <SpaceBetween size="m">
        <Stage eyebrow="Type or tap a query. Watch keyword vs meaning vs fused ranks.">
          <Input value={q} onChange={({ detail }) => setQ(detail.value)} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '10px 0' }}>
            <Button onClick={() => setQ(Q_REFUND)}>Refund wording</Button>
            <Button onClick={() => setQ(Q_SYN)}>Paraphrase</Button>
            <Button onClick={() => setQ(Q_CODE)}>Promo code</Button>
          </div>
          <RankLanes
            left={bm.map((r) => ({ id: r.doc.id }))}
            right={vec.map((r) => ({ id: r.doc.id }))}
            fused={fused.map((r) => ({ id: r.id }))}
          />
        </Stage>
        <StudentNote title="Two different misses">
          Keywords win on GYM2026. Vectors win on “money back”. Hybrid fuses ranks with
          1/(60+rank). Tap the three queries and watch D, C, and A swap places.
        </StudentNote>
        <div style={calloutBox}>
          Two queries we will keep honest:
          <Box padding="s">
            <strong>{Q_CODE}</strong>. only D contains that token.
            <br />
            <strong>{Q_REFUND}</strong>. A says refund / 14 days. C says money-back / two weeks.
            BM25 should prefer A here. It is <em>not</em> “bad at C” in general; C would win a
            BM25 query that used C’s own words.
          </Box>
        </div>
        <ChoiceExercise
          question="Promo codes like GYM2026 are usually won by…?"
          options={['Dense vectors only', 'Keyword / BM25-style exact match', 'Higher temperature']}
          answer="Keyword / BM25-style exact match"
        />
      </SpaceBetween>
    )
  }

  if (step === 1) {
    return (
      <SpaceBetween size="m">
        <Container header={<Header variant="h3">Your 7-step roadmap</Header>}>
          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 's', header: 'Step', cell: (i) => i.s },
              { id: 'w', header: 'What we do', cell: (i) => i.w },
              { id: 'o', header: 'What you walk away with', cell: (i) => i.o },
            ]}
            items={[
              { s: '1', w: 'Two failure modes', o: 'Why hybrid exists' },
              { s: '2 (this page)', w: 'Four snippets A–D', o: 'Who owns which words' },
              { s: '3', w: 'BM25 on GYM2026', o: 'D wins on exact token' },
              { s: '4', w: 'BM25 on the refund question', o: 'A wins; C has no “refund”' },
              { s: '5', w: 'Toy semantic map', o: 'C rises on money-back' },
              { s: '6', w: 'RRF arithmetic', o: '1/(60+rank) you can audit' },
              { s: '7', w: 'Cheat sheet', o: 'When to fuse, then rerank' },
            ]}
          />
        </Container>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'id', header: 'Id', cell: (i) => i.id },
            { id: 'text', header: 'Text', cell: (i) => i.text },
            { id: 'hook', header: 'Distinctive words', cell: (i) => i.hook },
          ]}
          items={[
            { id: 'A', text: DOCS[0].text, hook: 'refund, 14, days' },
            { id: 'B', text: DOCS[1].text, hook: 'latte. distractor' },
            { id: 'C', text: DOCS[2].text, hook: 'money-back, two weeks' },
            { id: 'D', text: DOCS[3].text, hook: 'GYM2026' },
          ]}
        />
      </SpaceBetween>
    )
  }

  if (step === 2) {
    return (
      <SpaceBetween size="m">
        <StudentNote title={`Query: ${Q_CODE}`}>
          BM25-style score here is “how many query tokens appear in the doc”, with a small log
          boost for repeats. Only D contains <code>gym2026</code>. A, B, and C score 0.
        </StudentNote>
        <BarChart
          items={bmCode.map((r) => ({ label: `${r.doc.id} (rank ${r.rank})`, value: r.s }))}
        />
        <ChoiceExercise
          question="Winner for GYM2026 should be"
          options={['A', 'B', 'D']}
          answer="D"
        />
      </SpaceBetween>
    )
  }

  if (step === 3) {
    return (
      <SpaceBetween size="m">
        <StudentNote title={`Query: “${Q_REFUND}”`}>
          Token overlap with A: refund. Token overlap with C: none of money-back / two / weeks.
          So BM25 ranks <strong>A above C</strong> on this wording. That is correct BM25
          behaviour. not a bug in C. Ask “money-back two weeks” and C would jump.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'id', header: 'Doc', cell: (i) => i.id },
            { id: 'rank', header: 'BM25 rank', cell: (i) => i.rank },
            { id: 's', header: 'Toy score', cell: (i) => i.s.toFixed(3) },
            { id: 'why', header: 'Why', cell: (i) => i.why },
          ]}
          items={bmRefund.map((r) => ({
            id: r.doc.id,
            rank: r.rank,
            s: r.s,
            why:
              r.doc.id === 'A'
                ? 'Contains “refund”'
                : r.doc.id === 'C'
                  ? 'No query tokens (money-back ≠ refund)'
                  : r.s === 0
                    ? 'No overlap'
                    : 'Partial overlap',
          }))}
        />
        <ChoiceExercise
          question="For “how do I get a refund”, BM25 should prefer…"
          options={[
            'C, because it is also about refunds in English',
            'A, because it shares the word refund (C uses money-back / two weeks)',
            'D, because promo codes always win',
          ]}
          answer="A, because it shares the word refund (C uses money-back / two weeks)"
        />
      </SpaceBetween>
    )
  }

  if (step === 4) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Toy semantic map, not sentence-transformers">
          We remap refund/money/back → one bucket and 14/days/two/weeks → one bucket. Query
          “money back unused pack” now overlaps C even though BM25 on “refund” did not.
          In class this map is a 384-d embedding.
        </StudentNote>
        <TryYourself>
          <Box variant="p">Try a query. Default is the synonym phrasing.</Box>
          <Input value={q} onChange={({ detail }) => setQ(detail.value)} />
        </TryYourself>
        <BarChart items={vec.map((r) => ({ label: r.doc.id, value: r.s }))} />
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'q', header: 'Query', cell: (i) => i.q },
            { id: 'who', header: 'Semantic winner (toy)', cell: (i) => i.who },
          ]}
          items={[
            { q: Q_REFUND, who: vecRefund[0]?.doc.id },
            { q: Q_SYN, who: vecSyn[0]?.doc.id },
          ]}
        />
        <Insight>
          Pure keywords without “refund” in the query often rank C poorly. Add synonyms or
          vectors. Do not say “BM25 always hates C”. only when the query omitted C’s words.
        </Insight>
      </SpaceBetween>
    )
  }

  if (step === 5) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="RRF fuses ranks, not scores">
          BM25 log-tf and cosine live in different units. Reciprocal Rank Fusion ignores the
          units: each list contributes 1 / (k + rank) with k = 60.
        </StudentNote>
        <Container header={<Header variant="h3">Worked numbers (k = 60)</Header>}>
          <Box variant="p">
            List 1 = BM25 ranks for “{Q_REFUND}”. List 2 = semantic ranks for “{Q_SYN}”.
          </Box>
          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 'id', header: 'Doc', cell: (i) => i.id },
              { id: 'r1', header: 'BM25 rank', cell: (i) => i.r1 },
              { id: 't1', header: '1/(60+r1)', cell: (i) => i.t1 },
              { id: 'r2', header: 'Vec rank', cell: (i) => i.r2 },
              { id: 't2', header: '1/(60+r2)', cell: (i) => i.t2 },
              { id: 'sum', header: 'RRF sum', cell: (i) => i.sum },
            ]}
            items={['A', 'B', 'C', 'D'].map((id) => {
              const r1 = demoBm.find((x) => x.doc.id === id)?.rank
              const r2 = demoVec.find((x) => x.doc.id === id)?.rank
              const t1 = 1 / (60 + r1)
              const t2 = 1 / (60 + r2)
              return {
                id,
                r1,
                t1: t1.toFixed(5),
                r2,
                t2: t2.toFixed(5),
                sum: (t1 + t2).toFixed(5),
              }
            })}
          />
          <Box>
            A RRF ≈ {rrfA.toFixed(5)}. C RRF ≈ {rrfC.toFixed(5)}. Rank 1 on either list
            (1/61 ≈ 0.0164) beats rank 8 on both.
          </Box>
        </Container>
        <InteractiveInput
          label="What is 1 / (60 + 1) rounded to 5 decimals? (rank-1 contribution)"
          correctAnswer={1 / 61}
          tolerance={0.00002}
          hint="1 ÷ 61"
        />
        <ChoiceExercise
          question="RRF fuses…?"
          options={[
            'Raw scores from different spaces as if they were comparable',
            'Ranks, so BM25 and cosine do not need the same units',
            'Images',
          ]}
          answer="Ranks, so BM25 and cosine do not need the same units"
        />
      </SpaceBetween>
    )
  }

  return (
    <SpaceBetween size="m">
      <Input value={q} onChange={({ detail }) => setQ(detail.value)} />
      <Stage eyebrow="Two judges, one fused podium. Edit the query.">
        <RankLanes
          left={bm.map((r) => ({ id: r.doc.id }))}
          right={vec.map((r) => ({ id: r.doc.id }))}
          fused={fused.map((r) => ({ id: r.id }))}
        />
      </Stage>
      <ChoiceExercise
        question="Next upgrade after hybrid?"
        options={['Delete BM25', 'Rerank the top 20 with a cross-encoder', 'Train GPT-2']}
        answer="Rerank the top 20 with a cross-encoder"
      />
      <CourseLink>
        mini_hybrid_search in the curriculum is this picture with real BM25. Keep the two-query
        test: GYM2026 and a paraphrase of A vs C.
      </CourseLink>
    </SpaceBetween>
  )
}
