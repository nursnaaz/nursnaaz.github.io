import { useMemo, useState } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import Table from '@cloudscape-design/components/table'
import Slider from '@cloudscape-design/components/slider'
import { LabShell } from '../lab/LabShell'
import { calloutBox } from '../lab/labTheme'
import { Insight, Warn, ChoiceExercise, CourseLink } from '../lab/LabWidgets'
import { StudentNote } from '../interactive/StudentNote'
import { InteractiveInput } from '../interactive/InterativeInput'
import { Stage, ChunkPaint } from '../lab/Viz'

const POLICY =
  'Northwind Gym membership. Unused class packs may be refunded within fourteen days of purchase if no class was attended. Guest passes are fifteen dollars and are never refunded. The sauna closes every Tuesday for maintenance. Personal training expires six months after the first session. We do not provide medical diagnoses.'

const WORDS = POLICY.split(/\s+/)

function chunkFixed(text, size, overlap) {
  const words = text.split(/\s+/)
  const cap = Math.min(overlap, Math.max(0, size - 1))
  const out = []
  let i = 0
  while (i < words.length) {
    out.push(words.slice(i, i + size).join(' '))
    i += Math.max(1, size - cap)
  }
  return out
}

const TITLES = [
  'A PDF is not one embedding',
  'Your 7-step roadmap',
  'The handbook paragraph',
  'Too small: “fourteen days” splits',
  'Too large: every topic in one vector',
  'Overlap stitches the cut',
  'A default you can defend',
]

export function ChunkingIntuition({ onStepChange }) {
  return (
    <LabShell titles={TITLES} onStepChange={onStepChange}>
      {({ step }) => <Steps step={step} />}
    </LabShell>
  )
}

function Steps({ step }) {
  const [size, setSize] = useState(12)
  const [overlap, setOverlap] = useState(3)
  const cappedOverlap = Math.min(overlap, Math.max(0, size - 1))
  const chunks = useMemo(() => chunkFixed(POLICY, size, overlap), [size, overlap])
  const tiny = useMemo(() => chunkFixed(POLICY, 5, 0), [])

  if (step === 0) {
    return (
      <SpaceBetween size="m">
        <Stage eyebrow="Drag the sliders. Colours are chunks. Dark orange is overlap.">
          <Box>Chunk size (words): <strong>{size}</strong></Box>
          <Slider value={size} min={6} max={28} onChange={({ detail }) => setSize(detail.value)} />
          <Box>Overlap: requested {overlap}, applied <strong>{cappedOverlap}</strong></Box>
          <Slider value={overlap} min={0} max={12} onChange={({ detail }) => setOverlap(detail.value)} />
          <ChunkPaint text={POLICY} size={size} overlap={cappedOverlap} />
          <Box variant="small">{chunks.length} chunks. Step = {Math.max(1, size - cappedOverlap)} words.</Box>
        </Stage>
        <StudentNote title="A PDF is not one embedding">
          Retrieval cannot lift the Tuesday sauna rule out of one giant vector. Chunking cuts
          the book into passages a retriever can pick. Too small splits “fourteen days”. Too
          large dilutes the match. Move the sliders until you see both failures.
        </StudentNote>
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
              { s: '1 (this page)', w: 'Why we split at all', o: 'The retrieval unit' },
              { s: '2', w: 'Roadmap', o: 'Where this lab is going' },
              { s: '3', w: 'Count words in the policy', o: 'A frozen corpus' },
              { s: '4', w: 'Size = 5, overlap = 0', o: 'The fourteen-days split' },
              { s: '5', w: 'One chunk = whole paragraph', o: 'Dilution, in words' },
              { s: '6', w: 'Live size + overlap (capped)', o: 'Boundary protection vs cost' },
              { s: '7', w: 'A starting recipe', o: 'What to measure later' },
            ]}
          />
        </Container>
        <ChoiceExercise
          question="Main reason to chunk?"
          options={['Make PDFs prettier', 'Give retrieval a right-sized passage', 'Reduce Python imports']}
          answer="Give retrieval a right-sized passage"
        />
      </SpaceBetween>
    )
  }

  if (step === 2) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="We keep this paragraph frozen">
          {WORDS.length} words. In class you will split PDFs with LangChain. Here the “document”
          is already one policy block so every later cut is comparable.
        </StudentNote>
        <Container header={<Header variant="h3">Northwind gym policy</Header>}>
          <Box variant="p">{POLICY}</Box>
        </Container>
        <InteractiveInput
          label={`How many whitespace-split words are in the paragraph?`}
          correctAnswer={WORDS.length}
          hint="Split on spaces. Count every token including “diagnoses.”"
        />
      </SpaceBetween>
    )
  }

  if (step === 3) {
    const splitRow = tiny.findIndex((c) => /\bfourteen\b/i.test(c) && !/\bdays\b/i.test(c))
    return (
      <SpaceBetween size="m">
        <StudentNote title="Size 5, overlap 0. facts split in half">
          Fixed-size chunking walks a window of N words and jumps N words (when overlap is 0).
          A phrase like <code>fourteen days</code> can sit on the window edge. Retrieval then
          returns a chunk that says “fourteen” without “days”, or the reverse.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'id', header: 'Chunk', cell: (i) => i.id },
            { id: 'text', header: 'Words', cell: (i) => i.text },
            { id: 'flag', header: 'Fourteen / days?', cell: (i) => i.flag },
          ]}
          items={tiny.map((c, i) => ({
            id: `c${i + 1}`,
            text: c,
            flag:
              /\bfourteen\b/i.test(c) && /\bdays\b/i.test(c)
                ? 'Both. lucky'
                : /\bfourteen\b/i.test(c)
                  ? 'fourteen only'
                  : /\bdays\b/i.test(c)
                    ? 'days only'
                    : ': ',
          }))}
        />
        <Warn title="Worked split">
          Look for the row marked “fourteen only” or “days only”. That is the bug. Query
          “refund within fourteen days” may miss half the legal phrase.
          {splitRow >= 0 ? ` In this cut, c${splitRow + 1} holds “fourteen” without “days”.` : ''}
        </Warn>
        <ChoiceExercise
          question="Too-small chunks typically…?"
          options={['Improve citations automatically', 'Lose surrounding rules', 'Use fewer embeddings always in a good way']}
          answer="Lose surrounding rules"
        />
      </SpaceBetween>
    )
  }

  if (step === 4) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="One chunk = the whole handbook">
          The opposite failure: embed the entire paragraph as a single vector. Sauna + refunds
          + medicine get averaged. A query about Tuesday maintenance is a small tilt on a
          giant average. and you still spend the whole paragraph in the prompt even when the
          question was about guest passes.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'k', header: 'Topic in the same vector', cell: (i) => i.k },
            { id: 'w', header: 'Why that hurts retrieval', cell: (i) => i.w },
          ]}
          items={[
            { k: 'Refunds / fourteen days', w: 'Diluted by sauna and PT expiry' },
            { k: 'Guest passes never refunded', w: 'Competes with the unused-pack rule' },
            { k: 'Sauna Tuesday', w: 'A short query is a rounding error' },
            { k: 'No medical diagnoses', w: 'Safety line buried in membership copy' },
          ]}
        />
        <ChoiceExercise
          question="Too-large chunks typically…?"
          options={['Always retrieve perfectly', 'Dilute the match and waste prompt tokens', 'Delete stopwords']}
          answer="Dilute the match and waste prompt tokens"
        />
      </SpaceBetween>
    )
  }

  if (step === 5) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Overlap copies the boundary">
          Overlap must stay <strong>strictly less than chunk size</strong> or the window never
          advances. This page caps overlap at <code>size - 1</code>. You pay extra tokens
          (duplicated words) to keep “fourteen days” together more often.
        </StudentNote>
        <Box>Chunk size (words): <strong>{size}</strong></Box>
        <Slider value={size} min={6} max={28} onChange={({ detail }) => setSize(detail.value)} />
        <Box>
          Overlap (words): requested {overlap}, applied <strong>{cappedOverlap}</strong> (capped
          below size)
        </Box>
        <Slider
          value={overlap}
          min={0}
          max={12}
          onChange={({ detail }) => setOverlap(detail.value)}
        />
        <Stage eyebrow="Paint the paragraph. Move the sliders.">
          <ChunkPaint text={POLICY} size={size} overlap={cappedOverlap} />
        </Stage>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'id', header: '#', cell: (i) => i.id },
            { id: 'n', header: 'Word count', cell: (i) => i.n },
            { id: 'text', header: 'Chunk', cell: (i) => i.text },
          ]}
          items={chunks.map((c, i) => ({
            id: i + 1,
            n: c.split(/\s+/).length,
            text: c,
          }))}
        />
        <Box variant="small">
          Step size = {size} - {cappedOverlap} = {Math.max(1, size - cappedOverlap)} words.
          Chunk count = {chunks.length}.
        </Box>
        <Insight>
          Overlap duplicates tokens (cost) to protect sentences that sat on the cut. Measure
          both: missed phrases vs extra prompt size.
        </Insight>
      </SpaceBetween>
    )
  }

  return (
    <SpaceBetween size="m">
      <StudentNote title="Start here, then measure">
        For FAQ and policy text, a common starting point is roughly 150–400 tokens (or 300–800
        characters) with 10–20% overlap, then sentence-aware or recursive splitters in
        LangChain. The number that matters is: on real questions, does the retrieved chunk
        contain the full rule?
      </StudentNote>
      <ChoiceExercise
        question="How do you know your sizes are good?"
        options={[
          'They look neat',
          'Spot-check retrieved chunks on real questions (then RAGAS later)',
          'Always 512 because of BERT',
        ]}
        answer="Spot-check retrieved chunks on real questions (then RAGAS later)"
      />
      <CourseLink>
        Session notebooks replace this word window with LangChain recursive splitters and page
        metadata. Keep the “fourteen days” test as a unit test for your splitter.
      </CourseLink>
    </SpaceBetween>
  )
}
