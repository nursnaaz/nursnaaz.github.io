import { useMemo, useState } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import Input from '@cloudscape-design/components/input'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import Table from '@cloudscape-design/components/table'
import { LabShell } from '../lab/LabShell'
import { pill, calloutBox } from '../lab/labTheme'
import { Insight, Warn, ChoiceExercise, CourseLink } from '../lab/LabWidgets'
import { StudentNote } from '../interactive/StudentNote'
import { TryYourself } from '../interactive/TryYourself'

const SNIPPETS = [
  { id: 'P1', text: 'Refunds within 14 days if unused.' },
  { id: 'P2', text: 'Guest passes are never refunded.' },
  { id: 'P3', text: 'We do not provide medical diagnoses. See a clinician.' },
]

const DEFAULT_Q = 'Can I refund a guest pass?'

function retrieve(q) {
  const s = q.toLowerCase()
  if (/diagnos|ibuprofen|prescribe|injur|medicine/.test(s)) return SNIPPETS[2]
  if (s.includes('guest')) return SNIPPETS[1]
  if (s.includes('refund') || s.includes('unused')) return SNIPPETS[0]
  return null
}

function answerCard(q) {
  const medical = /diagnos|ibuprofen|prescribe|injur|medicine/.test(q.toLowerCase())
  const hit = retrieve(q)
  if (medical) {
    return {
      text: 'We do not diagnose or prescribe. See a clinician. We will not invent a dose.',
      cite: 'P3',
      refuse: true,
    }
  }
  if (!hit) {
    return {
      text: "I don't know from the retrieved snippets. I will not invent a policy.",
      cite: null,
      refuse: true,
    }
  }
  return { text: hit.text, cite: hit.id, refuse: false }
}

const TITLES = [
  'Fluency without a source is a fail',
  'Your 7-step roadmap',
  'Two refund rules that disagree',
  'The answer card (default: guest pass)',
  'Must-refuse: medical asks',
  'Refuse when nothing retrieved',
  'Grade the habit',
]

export function CitationsAndRefusals({ onStepChange }) {
  return (
    <LabShell titles={TITLES} onStepChange={onStepChange}>
      {({ step }) => <Steps step={step} />}
    </LabShell>
  )
}

function Steps({ step }) {
  const [q, setQ] = useState(DEFAULT_Q)
  const card = useMemo(() => answerCard(q), [q])
  const hit = useMemo(() => retrieve(q), [q])

  if (step === 0) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Dear Student: Why citations">
          A bot that sounds sure while quoting no page is how people get the wrong refund : 
          or the wrong medical advice. A citation is the <strong>chunk id you actually
          retrieved</strong> for this answer, not a URL the model dreamed.<br /><br />
          A refusal is also a product feature: if retrieval is empty or the ask is out of
          policy, say you do not know. Pretty paragraphs without an id fail the brief.
        </StudentNote>
        <Insight>
          Default question on this lab is “Can I refund a guest pass?”. P1 is the 14-day
          unused-pack rule. P2 is never-refunded guest passes. The right cite is P2.
        </Insight>
        <ChoiceExercise
          question="A citation must point to…?"
          options={['Any policy-shaped sentence', 'The retrieved evidence used for this answer', 'Wikipedia']}
          answer="The retrieved evidence used for this answer"
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
              { s: '1', w: 'Why citations', o: 'Evidence, not vibe' },
              { s: '2 (this page)', w: 'Roadmap', o: 'The path' },
              { s: '3', w: 'P1 vs P2', o: 'Guest pass ≠ class pack' },
              { s: '4', w: 'Live answer card', o: 'Default query hits P2' },
              { s: '5', w: 'Medical refuse', o: 'P3 + no dose' },
              { s: '6', w: 'Empty retrieval', o: 'Honest “I don’t know”' },
              { s: '7', w: 'Recap', o: 'A checklist' },
            ]}
          />
        </Container>
      </SpaceBetween>
    )
  }

  if (step === 2) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Same word, two policies">
          Both snippets mention refunds. Keyword overlap is not enough. “Guest pass” must
          retrieve P2. Answering 14 days from P1 is a <em>wrong grounded</em> answer. it
          cited something, just the wrong chunk.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'id', header: 'Id', cell: (i) => i.id },
            { id: 'text', header: 'Snippet', cell: (i) => i.text },
          ]}
          items={SNIPPETS}
        />
        <ChoiceExercise
          question="Guest pass refund?"
          options={['14 days', 'Never, cite P2', 'Ask the model to be nice']}
          answer="Never, cite P2"
        />
      </SpaceBetween>
    )
  }

  if (step === 3) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Emit a card: answer + source id">
          Default query is already a guest-pass question, so P2 should light up without you
          typing. Change the box to “unused class pack” and watch P1.
        </StudentNote>
        <TryYourself>
          <Input value={q} onChange={({ detail }) => setQ(detail.value)} />
        </TryYourself>
        <Container header={<Header variant="h3">Answer card</Header>}>
          <Box variant="p">{card.text}</Box>
          {card.cite ? (
            <span style={pill('green')}>source {card.cite}</span>
          ) : (
            <span style={pill('yellow')}>no source</span>
          )}
        </Container>
        <Box variant="small">
          Retriever picked: {hit ? hit.id : 'nothing'}. Refuse flag: {String(card.refuse)}.
        </Box>
      </SpaceBetween>
    )
  }

  if (step === 4) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Healthcare line in the gym handbook">
          Even if a refund snippet is nearby, a diagnosis request must refuse. Try “prescribe
          ibuprofen for my knee”.
        </StudentNote>
        <TryYourself>
          <Input value={q} onChange={({ detail }) => setQ(detail.value)} />
        </TryYourself>
        <div style={calloutBox}>
          {card.refuse && card.cite === 'P3'
            ? card.text
            : 'Not classified as medical yet. type a diagnosis / prescribe request.'}
        </div>
        <Warn>Refusal is a product requirement. Write it in the system prompt and test it.</Warn>
        <ChoiceExercise
          question="User: “prescribe ibuprofen for my knee”."
          options={['Suggest a dose', 'Refuse + point to a clinician', 'Search StackOverflow']}
          answer="Refuse + point to a clinician"
        />
      </SpaceBetween>
    )
  }

  if (step === 5) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Empty retrieval">
          Try “What time does the rooftop close?”. No snippet matches. The correct card is
          a refusal without a fake id.
        </StudentNote>
        <TryYourself>
          <Input value={q} onChange={({ detail }) => setQ(detail.value)} />
        </TryYourself>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'f', header: 'Field', cell: (i) => i.f },
            { id: 'v', header: 'Value', cell: (i) => i.v },
          ]}
          items={[
            { f: 'Answer', v: card.text },
            { f: 'Citation', v: card.cite || '(none)' },
            { f: 'Refuse', v: String(card.refuse) },
          ]}
        />
      </SpaceBetween>
    )
  }

  return (
    <SpaceBetween size="m">
      <StudentNote title="Grade yourself">
        Every student answer in the RAG weekend needs (1) text grounded in a retrieved
        chunk, (2) that chunk’s id, (3) a refusal path for empty retrieval and for medical
        asks. Default guest-pass query → P2, never 14 days.
      </StudentNote>
      <CourseLink>
        Production RAG apps show page numbers next to the quote. Keep the same card shape:
        claim, cite, or refuse.
      </CourseLink>
    </SpaceBetween>
  )
}
