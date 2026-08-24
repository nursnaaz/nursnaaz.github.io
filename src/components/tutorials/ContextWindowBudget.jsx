import { useState } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import Slider from '@cloudscape-design/components/slider'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import Table from '@cloudscape-design/components/table'
import { LabShell } from '../lab/LabShell'
import { calloutBox } from '../lab/labTheme'
import { Insight, ChoiceExercise, CourseLink, BarChart } from '../lab/LabWidgets'
import { StudentNote } from '../interactive/StudentNote'
import { InteractiveInput } from '../interactive/InterativeInput'

const TITLES = [
  'The window is finite',
  'Your 7-step roadmap',
  'Every tenant shares the van',
  'Slack = room left, honestly',
  'Worked numbers',
  'Lost in the middle',
  'What to drop first',
]

export function ContextWindowBudget({ onStepChange }) {
  return (
    <LabShell titles={TITLES} onStepChange={onStepChange}>
      {({ step }) => <Steps step={step} />}
    </LabShell>
  )
}

function Steps({ step }) {
  const [limit, setLimit] = useState(8000)
  const [sys, setSys] = useState(400)
  const [hist, setHist] = useState(2500)
  const [rag, setRag] = useState(3000)
  const [out, setOut] = useState(800)
  const slack = limit - sys - hist - rag - out

  if (step === 0) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Dear Student: Context is a moving van">
          Every model has a maximum number of tokens it can see at once. System prompt +
          chat history + retrieved chunks + the tokens you reserve for the reply all share
          that van. Overflow is not “it thinks harder”. it is truncation or an API error.
          <br /><br />
          If you stuff 40 PDF pages into the prompt you may evict the question, pay for
          noise, or leave no room to write an answer.
        </StudentNote>
        <ChoiceExercise
          question="If you stuff 40 PDF pages into the prompt…?"
          options={[
            'Quality always goes up',
            'You may evict the question or pay a fortune for noise',
            'Context becomes infinite',
          ]}
          answer="You may evict the question or pay a fortune for noise"
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
              { s: '1', w: 'Finite window', o: 'Overflow is truncation' },
              { s: '2 (this page)', w: 'Roadmap', o: 'The path' },
              { s: '3', w: 'Name the buckets', o: 'sys, hist, rag, out' },
              { s: '4', w: 'Live sliders', o: 'slack = room left' },
              { s: '5', w: 'Arithmetic', o: 'A number you can check' },
              { s: '6', w: 'Lost-in-the-middle', o: 'Where facts hide' },
              { s: '7', w: 'What to drop', o: 'History vs RAG vs output' },
            ]}
          />
        </Container>
      </SpaceBetween>
    )
  }

  if (step === 2) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Four tenants, one limit">
          We budget five numbers: the model limit, then four claims on it. Slack is whatever
          is left after those claims. That leftover is room for the current user message and
          any packing error. it is <strong>not</strong> a dedicated “question bucket” with
          its own product name. If slack is negative, you already overbooked the van.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'b', header: 'Symbol', cell: (i) => i.b },
            { id: 'm', header: 'Meaning', cell: (i) => i.m },
          ]}
          items={[
            { b: 'limit', m: 'Model context window (e.g. 8k, 32k, 128k)' },
            { b: 'sys', m: 'System prompt + tool schemas' },
            { b: 'hist', m: 'Prior turns you still send' },
            { b: 'rag', m: 'Retrieved chunks this turn' },
            { b: 'out', m: 'Tokens reserved so the model can reply' },
            { b: 'slack', m: 'limit − sys − hist − rag − out  (room left)' },
          ]}
        />
        <Insight>
          Always reserve output. An 8k window with 7.9k already used cannot write a useful
          answer even if slack for “the question” looks like a marketing term.
        </Insight>
      </SpaceBetween>
    )
  }

  if (step === 3) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Slide the claims">
          Slack is labelled <strong>room left</strong>. Negative means you must drop history,
          drop RAG, shorten the system prompt, or pick a larger window.
        </StudentNote>
        {[
          ['Window (limit)', limit, setLimit, 2000, 32000],
          ['System (sys)', sys, setSys, 50, 2000],
          ['History (hist)', hist, setHist, 0, 20000],
          ['RAG chunks (rag)', rag, setRag, 0, 20000],
          ['Reserved output (out)', out, setOut, 64, 4000],
        ].map(([label, val, set, min, max]) => (
          <div key={label}>
            <Box>
              {label}: <strong>{val}</strong>
            </Box>
            <Slider
              value={val}
              min={min}
              max={max}
              step={label.includes('Window') ? 100 : 50}
              onChange={({ detail }) => set(detail.value)}
            />
          </div>
        ))}
        <BarChart
          items={[
            { label: 'sys', value: sys },
            { label: 'hist', value: hist },
            { label: 'rag', value: rag },
            { label: 'out', value: out },
            { label: slack >= 0 ? 'room left' : 'overbooked', value: Math.abs(slack) },
          ]}
        />
        <Box variant="h3">
          slack = {limit} − {sys} − {hist} − {rag} − {out} = {slack} tokens of room left
        </Box>
      </SpaceBetween>
    )
  }

  if (step === 4) {
    const example = 8000 - 400 - 2500 - 3000 - 800
    return (
      <SpaceBetween size="m">
        <StudentNote title="Worked example (defaults)">
          limit = 8000, sys = 400, hist = 2500, rag = 3000, out = 800.
        </StudentNote>
        <div style={calloutBox}>
          slack = 8000 − 400 − 2500 − 3000 − 800 = <strong>{example}</strong> tokens of room
          left (for the current question and packing slop). Not a fifth billed product called
          “the question bucket”.
        </div>
        <InteractiveInput
          label="Compute slack for those defaults"
          correctAnswer={example}
          hint="8000 − 400 − 2500 − 3000 − 800"
        />
      </SpaceBetween>
    )
  }

  if (step === 5) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Models skim the middle">
          Lost-in-the-middle research: facts buried in a long context get missed more often
          than facts at the start or end. Put the user question last. Keep chunk count small.
          After rerank, put the most relevant passage first among the RAG block.
        </StudentNote>
        <ChoiceExercise
          question="If you must keep 20 chunks, a safer layout is…?"
          options={[
            'Dump them in random PDF order',
            'Rerank, put the best first, question last',
            'Hide the question in the middle of the PDF',
          ]}
          answer="Rerank, put the best first, question last"
        />
      </SpaceBetween>
    )
  }

  return (
    <SpaceBetween size="m">
      <StudentNote title="What to drop when slack is negative">
        Cut oldest history (or summarise it). Retrieve fewer / shorter chunks. Shrink tool
        JSON. Do not steal the reserved output first. a model that cannot write is useless.
        A sliding window or a summary memory strategy is the M04 answer when hist is the
        villain.
      </StudentNote>
      <CourseLink>
        M01 context-window notes use the same arithmetic. Label slack as room left so nobody
        budgets a fictional fifth bucket.
      </CourseLink>
    </SpaceBetween>
  )
}
