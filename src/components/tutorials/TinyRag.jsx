import { useMemo, useState } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import Button from '@cloudscape-design/components/button'
import Input from '@cloudscape-design/components/input'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import Table from '@cloudscape-design/components/table'
import { LabShell } from '../lab/LabShell'
import { pill } from '../lab/labTheme'
import { Insight, Warn, ChoiceExercise, CourseLink } from '../lab/LabWidgets'
import { StudentNote } from '../interactive/StudentNote'
import { TryYourself } from '../interactive/TryYourself'
import { InteractiveInput } from '../interactive/InterativeInput'
import { Stage, HeatDocs, FlowStrip } from '../lab/Viz'

const DOCS = [
  { id: 'D1', text: 'Refunds: unused classes can be refunded within 14 days of purchase.' },
  { id: 'D2', text: 'The cafe latte uses oat milk by default. Dairy is available on request.' },
  { id: 'D3', text: 'Studio doors open at 07:00 on weekdays and 08:00 on weekends.' },
  { id: 'D4', text: 'Parking is free for 90 minutes in basement B2 with a validated ticket.' },
  { id: 'D5', text: 'Personal training packages expire 6 months after the first session.' },
  { id: 'D6', text: 'The sauna is closed every Tuesday for maintenance.' },
  { id: 'D7', text: 'Guest passes cost fifteen dollars and cannot be refunded.' },
  { id: 'D8', text: 'Lockers reset at 22:00. Do not store valuables overnight.' },
  { id: 'D9', text: 'Yoga intro course is 4 weeks, Tuesday 18:30, room Studio 2.' },
  { id: 'D10', text: 'We do not give medical advice. See a clinician for injuries.' },
]

const STOP = new Set('the a an and or but in on at to for of is it from how what why who are was were be been being this that with without can could would should our your their not'.split(' '))

function bag(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
}

function score(query, doc) {
  const q = [...new Set(bag(query))]
  const d = bag(doc.text)
  if (!q.length) return { s: 0, hits: [] }
  const hits = q.filter((w) => d.includes(w))
  return { s: hits.length / Math.sqrt(d.length || 1), hits, q, d }
}

function retrieve(query, k = 3) {
  return DOCS.map((doc) => ({ ...doc, ...score(query, doc) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
}

function answer(query, hits) {
  if (/diagnos|injur|medicine|pain|ibuprofen|prescribe/i.test(query)) {
    return { text: DOCS[9].text, cite: 'D10', refuse: true }
  }
  const top = hits[0]
  if (!top || top.s < 0.35) {
    return { text: "I don't know from the gym handbook. I will not invent a policy.", cite: null, refuse: true }
  }
  return { text: top.text, cite: top.id, refuse: false }
}

const Q_REFUND = 'How long do I have to refund a class pack?'
const TITLES = [
  'Why the model invents policies',
  'The six-stage pipeline',
  'A handbook of ten chunks',
  'Turn text into overlapping words',
  'Score every chunk',
  'Generate only from the winners',
  'Refuse when the score is weak',
  'What this toy still cannot do',
  'Recap',
]

export function TinyRag({ onStepChange }) {
  return (
    <LabShell titles={TITLES} onStepChange={onStepChange}>
      {({ step }) => <Steps step={step} />}
    </LabShell>
  )
}

function Steps({ step }) {
  const [q, setQ] = useState(Q_REFUND)
  const hits = useMemo(() => retrieve(q), [q])
  const detail = useMemo(() => DOCS.map((d) => ({ id: d.id, text: d.text, ...score(q, d) })), [q])
  const gen = useMemo(() => answer(q, hits), [q, hits])
  const qBag = bag(q)

  if (step === 0) {
    return (
      <SpaceBetween size="m">
        <Stage eyebrow="Type a question. Cards heat up. Click a card to steal its words.">
          <Input value={q} onChange={({ detail }) => setQ(detail.value)} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '10px 0' }}>
            <Button onClick={() => setQ(Q_REFUND)}>Refund pack</Button>
            <Button onClick={() => setQ('When is the sauna closed?')}>Sauna</Button>
            <Button onClick={() => setQ("What is the CEO's salary?")}>Unknown fact</Button>
          </div>
          <HeatDocs
            query={q}
            docs={detail.slice().sort((a, b) => b.s - a.s).map((d) => ({ id: d.id, text: d.text, score: d.s }))}
            onSelect={(d) => setQ(d.text)}
          />
          <Box padding={{ top: 's' }}>
            {gen.refuse ? 'Refuse / I do not know' : `Cite ${gen.cite}`}: {gen.text}
          </Box>
        </Stage>
        <StudentNote title="The model did not attend orientation">
          Ask a raw LLM a gym policy question and it often sounds sure while inventing a number.
          RAG finds the sentences that belong to you, then answers from those sentences. Heat
          is the retrieval score. Click cards.
        </StudentNote>
      </SpaceBetween>
    )
  }

  if (step === 1) {
    return (
      <SpaceBetween size="m">
        <StudentNote>
          Production RAG is six stages. This page implements a baby version of retrieve and generate
          so you can see the data move.
        </StudentNote>
        <Stage eyebrow="The path">
          <FlowStrip steps={['Load', 'Chunk', 'Embed', 'Store', 'Retrieve', 'Generate']} active={4} />
        </Stage>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'n', header: '#', cell: (i) => i.n },
            { id: 's', header: 'Stage', cell: (i) => i.s },
            { id: 'h', header: 'What happens', cell: (i) => i.h },
          ]}
          items={[
            { n: '1', s: 'Load', h: 'Read PDF / wiki / ticket dump' },
            { n: '2', s: 'Chunk', h: 'Cut into passages the retriever can lift' },
            { n: '3', s: 'Embed', h: 'Turn each passage into a vector (we fake this with word overlap)' },
            { n: '4', s: 'Store', h: 'Index in Chroma / FAISS (here: a JavaScript array)' },
            { n: '5', s: 'Retrieve', h: 'Score query vs every chunk, keep top-k' },
            { n: '6', s: 'Generate', h: 'LLM writes an answer using only those chunks + a citation' },
          ]}
        />
        <Insight>
          If you skip 5 and dump the whole PDF into the prompt, you waste tokens and the
          model still misses the sentence in the middle. Retrieval exists to pick.
        </Insight>
      </SpaceBetween>
    )
  }

  if (step === 2) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Each line is already a chunk">
          In class you will split PDFs with LangChain. Here every policy sentence is one
          chunk with an id. That id is what you will cite.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'id', header: 'Id', cell: (i) => i.id },
            { id: 'text', header: 'Chunk text', cell: (i) => i.text },
          ]}
          items={DOCS}
        />
        <ChoiceExercise
          question="If D1 and D7 both mention refunds, which one answers “guest pass”?"
          options={['Always D1', 'D7. guest passes are never refunded', 'Neither; invent a compromise']}
          answer="D7. guest passes are never refunded"
        />
      </SpaceBetween>
    )
  }

  if (step === 3) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Our toy “embedding” is just overlapping words">
          Real RAG uses sentence-transformers (384-dimensional vectors). You cannot ship
          a 400 MB model on GitHub Pages, so we keep words that are longer than 2 letters
          and not stop words. The <em>pipeline shape</em> is the same: query → numbers →
          nearest chunks.
        </StudentNote>
        <Box variant="p">Default question: <strong>{Q_REFUND}</strong></Box>
        <Box>
          Query bag:{' '}
          {qBag.map((w) => (
            <span key={w} style={pill('blue')}>{w}</span>
          ))}
        </Box>
        <Container header={<Header variant="h3">D1 bag (the refund policy)</Header>}>
          {bag(DOCS[0].text).map((w) => (
            <span key={w} style={pill(qBag.includes(w) ? 'green' : 'purple')}>{w}</span>
          ))}
        </Container>
        <Box variant="small">Green = also in the query. That overlap is the entire score.</Box>
      </SpaceBetween>
    )
  }

  if (step === 4) {
    const d1 = score(Q_REFUND, DOCS[0])
    return (
      <SpaceBetween size="m">
        <StudentNote title="Score = (how many query words hit) / √(chunk length)">
          We divide by √length so a long chunk that repeats “the” does not automatically
          win. This is a cousin of TF, not cosine on embeddings. but you can compute it
          with a pencil.
        </StudentNote>
        <div style={{ background: '#ffebee', padding: 20, borderRadius: 8, border: '2px solid #e74c3c', fontFamily: 'monospace', lineHeight: 1.9 }}>
          Query bag: {d1.q.join(', ')}<br />
          Hits on D1: {d1.hits.join(', ') || '(none)'} → {d1.hits.length} hits<br />
          D1 length (content words): {d1.d.length}<br />
          score(D1) = {d1.hits.length} / √{d1.d.length} = <strong>{d1.s.toFixed(3)}</strong>
        </div>
        <Input value={q} onChange={({ detail }) => setQ(detail.value)} />
        <Stage eyebrow="Heat = retrieval score. Type and watch the cards move.">
          <HeatDocs
            query={q}
            docs={detail.slice().sort((a, b) => b.s - a.s).map((d) => ({ id: d.id, text: d.text, score: d.s }))}
          />
        </Stage>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'id', header: 'Id', cell: (i) => i.id },
            { id: 's', header: 'Score', cell: (i) => i.s.toFixed(3) },
            { id: 'h', header: 'Hits', cell: (i) => i.hits.join(', ') || ': ' },
          ]}
          items={detail.slice().sort((a, b) => b.s - a.s)}
        />
        <TryYourself>
          <Box variant="h4">Verify D1’s score for the default question</Box>
          <InteractiveInput
            label="score(D1) to 3 decimals"
            correctAnswer={Number(score(Q_REFUND, DOCS[0]).s.toFixed(3))}
            hint="hits / sqrt(content words in D1)"
            tolerance={0.02}
          />
        </TryYourself>
      </SpaceBetween>
    )
  }

  if (step === 5) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="The generator is not allowed to be clever">
          We take the top chunk and quote it. We attach the id. That is the behaviour your
          group project will be graded on: <strong>no citation, no marks</strong>.
        </StudentNote>
        <Input value={q} onChange={({ detail }) => setQ(detail.value)} />
        <Box>
          {gen.text}
          {gen.cite && (
            <div style={{ marginTop: 8 }}>
              <span style={pill('green')}>cite {gen.cite}</span>
            </div>
          )}
        </Box>
        <ChoiceExercise
          question="For the default refund-pack question, the citation should be"
          options={['D6', 'D1', 'D2']}
          answer="D1"
        />
      </SpaceBetween>
    )
  }

  if (step === 6) {
    return (
      <SpaceBetween size="m">
        <StudentNote>
          If the best score is below 0.35, we refuse. Medical questions always route to D10
          even if some other chunk scored higher. that is a product rule, not a cosine rule.
        </StudentNote>
        <SpaceBetween direction="horizontal" size="s">
          <Button onClick={() => setQ("What is the CEO's salary?")}>Unknown fact</Button>
          <Button onClick={() => setQ('I have knee pain, what medicine?')}>Medical</Button>
          <Button onClick={() => setQ(Q_REFUND)}>Refund pack</Button>
        </SpaceBetween>
        <Box>{answer(q, retrieve(q)).text}</Box>
        <Box variant="small">Top score now: {retrieve(q)[0]?.s.toFixed(3)}</Box>
        <ChoiceExercise
          question="CEO salary is not in the handbook. Correct behaviour?"
          options={['Guess a typical CEO salary', "Say you do not know", 'Return D6 because Tuesday is a word']}
          answer="Say you do not know"
        />
      </SpaceBetween>
    )
  }

  if (step === 7) {
    return (
      <SpaceBetween size="m">
        <Warn title="Keyword overlap is not meaning">
          Query “money back period for unused packs” may miss D1 because D1 says “refunded”
          and “14 days”, not “money back”. That is why the next tutorial exists: hybrid
          search (BM25 + vectors) and RRF.
        </Warn>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'g', header: 'Gap', cell: (i) => i.g },
            { id: 'f', header: 'What class adds later', cell: (i) => i.f },
          ]}
          items={[
            { g: 'Synonyms', f: 'Dense embeddings / hybrid' },
            { g: 'Promo codes like GYM2026', f: 'BM25 exact match' },
            { g: 'PDF page numbers', f: 'Metadata filters' },
            { g: 'Measuring quality', f: 'RAGAS / a labelled eval set' },
          ]}
        />
      </SpaceBetween>
    )
  }

  return (
    <SpaceBetween size="m">
      <StudentNote title="Say this out loud">
        RAG retrieves private text, stuffs it into the prompt, and answers with citations.
        If retrieval is weak, you refuse. Fluency without a chunk id is not knowledge.
      </StudentNote>
      <CourseLink>
        The RAG weekend replaces this overlap score with embeddings and Chroma. Keep the
        citation and refusal habits; they are the part employers actually check.
      </CourseLink>
    </SpaceBetween>
  )
}
