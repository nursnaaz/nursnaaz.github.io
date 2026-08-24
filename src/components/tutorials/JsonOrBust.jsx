import { useMemo, useState } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import Button from '@cloudscape-design/components/button'
import Textarea from '@cloudscape-design/components/textarea'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import Table from '@cloudscape-design/components/table'
import { LabShell } from '../lab/LabShell'
import { codeBox } from '../lab/labTheme'
import { Insight, Warn, ChoiceExercise, CourseLink } from '../lab/LabWidgets'
import { StudentNote } from '../interactive/StudentNote'
import { TryYourself } from '../interactive/TryYourself'
import { InteractiveInput } from '../interactive/InterativeInput'

const SCHEMA = `{
  "sentiment": "negative | mixed | positive",
  "food": integer 1-5,
  "service": integer 1-5,
  "topics": string[]
}`

const MESSY = `I'd say mixed honestly food is a 2 service a 5 topics crust and staff`

const GOOD = `{
  "sentiment": "mixed",
  "food": 2,
  "service": 5,
  "topics": ["crust", "staff"]
}`

const BAD_JSON = `{
  "sentiment": "spicy",
  "food": 99,
  "service": 5,
  "topics": "crust"
}`

function parseThenValidate(text) {
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch (e) {
    return { stage: 'parse', ok: false, error: e.message, obj: null }
  }
  const errors = []
  if (!['negative', 'mixed', 'positive'].includes(parsed.sentiment)) {
    errors.push(`sentiment must be negative|mixed|positive, got ${JSON.stringify(parsed.sentiment)}`)
  }
  if (!Number.isInteger(parsed.food) || parsed.food < 1 || parsed.food > 5) {
    errors.push(`food must be an integer 1–5, got ${JSON.stringify(parsed.food)}`)
  }
  if (!Number.isInteger(parsed.service) || parsed.service < 1 || parsed.service > 5) {
    errors.push(`service must be an integer 1–5, got ${JSON.stringify(parsed.service)}`)
  }
  if (!Array.isArray(parsed.topics) || !parsed.topics.every((t) => typeof t === 'string')) {
    errors.push('topics must be an array of strings')
  }
  if (errors.length) return { stage: 'validate', ok: false, error: errors.join('; '), obj: parsed }
  return { stage: 'validate', ok: true, error: null, obj: parsed }
}

const TITLES = [
  'A dashboard cannot store a paragraph',
  'Write the schema first',
  'The messy world',
  'Parse, then validate',
  'Repair once in a loop',
  'Stop after two failures',
  'Pydantic is the same checklist',
  'What you can now explain',
]

export function JsonOrBust({ onStepChange }) {
  return (
    <LabShell titles={TITLES} onStepChange={onStepChange}>
      {({ step }) => <Steps step={step} />}
    </LabShell>
  )
}

function Steps({ step }) {
  const [draft, setDraft] = useState(MESSY)
  const result = useMemo(() => parseThenValidate(draft), [draft])
  const [attempt, setAttempt] = useState(0)
  const [log, setLog] = useState([])

  if (step === 0) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Dear Student: What Problem Are We Solving?">
          The café review feels like a paragraph. A ratings dashboard needs four fields:
          sentiment, food score, service score, topics. If the model returns English, your
          insert statement has nowhere to put “kinda mixed tbh”.
          <br />
          <br />
          Structured output is a contract. We will <strong>parse</strong> (is it JSON?) then
          <strong> validate</strong> (are integers 1–5?). Then we will <strong>retry</strong> with
          the error message. and stop, instead of inventing a 99.
        </StudentNote>

        <Container header={<Header variant="h3">Your 8-step roadmap</Header>}>
          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 's', header: 'Step', cell: (i) => i.s },
              { id: 'w', header: 'What we do', cell: (i) => i.w },
              { id: 'o', header: 'What you walk away with', cell: (i) => i.o },
            ]}
            items={[
              { s: '1 (this page)', w: 'Why JSON exists', o: 'Machines, not Slack' },
              { s: '2', w: 'Schema with 1–5 integers', o: 'The contract' },
              { s: '3', w: 'Paste messy model text', o: 'Parse failure you can see' },
              { s: '4', w: 'Valid JSON, invalid schema', o: 'Two different errors' },
              { s: '5', w: 'Retry loop with the error', o: 'One repair attempt' },
              { s: '6', w: 'Fail closed', o: 'Do not invent numbers' },
              { s: '7', w: 'Pydantic sketch', o: 'Same rules in Python' },
              { s: '8', w: 'Recap', o: 'Parse → validate → retry → stop' },
            ]}
          />
        </Container>

        <ChoiceExercise
          question="Who is JSON for?"
          options={['A human reading Slack', 'A function that inserts a database row', 'A blog post']}
          answer="A function that inserts a database row"
        />
      </SpaceBetween>
    )
  }

  if (step === 1) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Schema first, prompt second">
          The prompt is a way to fill this object. If you write the prompt first, you will accept
          whatever pretty paragraph arrives.
        </StudentNote>
        <pre style={codeBox}>{SCHEMA}</pre>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'f', header: 'Field', cell: (i) => i.f },
            { id: 'r', header: 'Rule', cell: (i) => i.r },
            { id: 'g', header: 'Gold for our review', cell: (i) => i.g },
          ]}
          items={[
            { f: 'sentiment', r: 'enum: negative | mixed | positive', g: 'mixed' },
            { f: 'food', r: 'integer 1–5 inclusive', g: '2' },
            { f: 'service', r: 'integer 1–5 inclusive', g: '5' },
            { f: 'topics', r: 'array of strings', g: '["crust", "staff"]' },
          ]}
        />
        <TryYourself>
          <Box variant="h4">Gold food score for “crust was cardboard”</Box>
          <InteractiveInput
            label="food (1–5)"
            correctAnswer={2}
            hint="Cardboard crust is a 2 in our gold JSON, not 1 and not 99."
            tolerance={0.1}
          />
        </TryYourself>
      </SpaceBetween>
    )
  }

  if (step === 2) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="This is what models often emit">
          Edit the box. Load valid JSON when you want to see success. Real models also wrap JSON
          in markdown fences. strip those before JSON.parse.
        </StudentNote>
        <Textarea value={draft} onChange={({ detail }) => setDraft(detail.value)} rows={10} />
        <Box color={result.ok ? 'text-status-success' : 'text-status-error'}>
          {result.ok
            ? `Schema OK. food=${result.obj.food}, service=${result.obj.service}`
            : `${result.stage} failed: ${result.error}`}
        </Box>
        <SpaceBetween direction="horizontal" size="s">
          <Button onClick={() => setDraft(MESSY)}>Load messy English</Button>
          <Button onClick={() => setDraft(BAD_JSON)}>Load parseable-but-wrong</Button>
          <Button variant="primary" onClick={() => setDraft(GOOD)}>
            Load valid JSON
          </Button>
        </SpaceBetween>
        <Warn>Fences like ```json … ``` are not part of JSON. Strip them.</Warn>
      </SpaceBetween>
    )
  }

  if (step === 3) {
    const parsedBad = parseThenValidate(BAD_JSON)
    return (
      <SpaceBetween size="m">
        <StudentNote title="JSON.parse succeeding is not the finish line">
          spicy is a string. 99 is a number. topics as a string still parses. None of that
          matches the schema.
        </StudentNote>
        <pre style={codeBox}>{BAD_JSON}</pre>
        <div
          style={{
            background: '#ffebee',
            padding: 20,
            borderRadius: 8,
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            lineHeight: 1.8,
          }}
        >
          Stage 1 parse: success (it is JSON).
          <br />
          Stage 2 validate: {parsedBad.error}
        </div>
        <ChoiceExercise
          question="If JSON.parse succeeds, are you done?"
          options={['Yes', 'No: check fields against a schema']}
          answer="No: check fields against a schema"
        />
      </SpaceBetween>
    )
  }

  if (step === 4) {
    const runRetry = () => {
      const first = parseThenValidate(MESSY)
      const second = parseThenValidate(GOOD)
      setAttempt(2)
      setLog([
        `Attempt 1: ${first.stage} failed. ${first.error}`,
        'Sent error back to the model: “Return only JSON matching the schema.”',
        `Attempt 2: ${second.ok ? 'validate OK' : second.error}`,
      ])
    }
    return (
      <SpaceBetween size="m">
        <StudentNote title="Retry is a second generate call, not a hope">
          You call the model with the schema. You parse and validate. If invalid, you send the
          validator error back once. That is the loop.
        </StudentNote>
        <ol>
          <li>Call with the schema in the prompt (or JSON mode).</li>
          <li>Parse, then validate integers 1–5 and the sentiment enum.</li>
          <li>If invalid, send the error back once or twice.</li>
          <li>If still invalid, fail the request. Do not invent numbers.</li>
        </ol>
        <Button variant="primary" onClick={runRetry}>
          Simulate: messy → error → gold JSON
        </Button>
        {log.map((line) => (
          <Box key={line}>{line}</Box>
        ))}
        {attempt >= 2 && (
          <Insight>Attempt 2 loaded the gold object: food=2, service=5, topics crust and staff.</Insight>
        )}
      </SpaceBetween>
    )
  }

  if (step === 5) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Fail closed">
          After two failed repairs, a pipeline that silently writes 0 into the database is worse
          than an error. A human or a dead-letter queue is the correct next node.
        </StudentNote>
        <div style={{ background: '#fff8e1', padding: 16, borderRadius: 8, border: '1px solid #f9a825' }}>
          max_retries = 2
          <br />
          if still invalid: raise / flag
          <br />
          never: food = 0 “just to keep the chart working”
        </div>
        <ChoiceExercise
          question="After two failed repairs, what should a pipeline do?"
          options={['Silently use 0 for every field', 'Raise / flag for a human', 'Set temperature to 2']}
          answer="Raise / flag for a human"
        />
        <TryYourself>
          <Box variant="h4">Gold service score</Box>
          <InteractiveInput
            label="service (1–5)"
            correctAnswer={5}
            hint="“staff were kind” maps to 5 in the gold JSON."
            tolerance={0.1}
          />
        </TryYourself>
      </SpaceBetween>
    )
  }

  if (step === 6) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Pydantic is the schema in Python">
          The Field bounds are the same 1–5 integers. model_validate_json is parse + validate in
          one call. still two logical stages.
        </StudentNote>
        <pre style={codeBox}>{`from typing import Literal
from pydantic import BaseModel, Field

class Review(BaseModel):
    sentiment: Literal["negative", "mixed", "positive"]
    food: int = Field(ge=1, le=5)
    service: int = Field(ge=1, le=5)
    topics: list[str]`}</pre>
        <ChoiceExercise
          question="Schema first or prompt first?"
          options={['Prompt first always', 'Schema first: the prompt fills the schema', 'Neither']}
          answer="Schema first: the prompt fills the schema"
        />
      </SpaceBetween>
    )
  }

  return (
    <SpaceBetween size="m">
      <StudentNote title="Say this out loud">
        Structured output is a contract: parse JSON, then check enums and 1–5 integers. Retry
        with the validator error. After two failures, stop. Never invent a score to keep a chart
        green.
      </StudentNote>
      <CourseLink>Practise the same Review schema in Python before any crew output models.</CourseLink>
    </SpaceBetween>
  )
}
