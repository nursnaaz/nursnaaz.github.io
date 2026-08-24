import { useEffect, useState } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import Button from '@cloudscape-design/components/button'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import Table from '@cloudscape-design/components/table'
import { LabShell } from '../lab/LabShell'
import { codeBox } from '../lab/labTheme'
import { Insight, ChoiceExercise, CourseLink } from '../lab/LabWidgets'
import { StudentNote } from '../interactive/StudentNote'
import { TryYourself } from '../interactive/TryYourself'
import { InteractiveInput } from '../interactive/InterativeInput'

const REPLY = 'The pizza is in the oven for 12 minutes at 220°C. Let it rest 2 minutes, then slice.'
const REPLY_CHARS = REPLY.length
const SYSTEM = 'You are a concise cooking coach.'
const USER = 'How do I finish a margherita?'

const TITLES = [
  'It is just a generate call',
  'You send a list of messages',
  'Three roles, one table',
  'A full request you can audit',
  'Streaming is the same call, drip by drip',
  'Three settings that actually matter',
  'Copy this shape (with import os)',
  'What you can now explain',
]

export function FirstLlmCall({ onStepChange }) {
  return (
    <LabShell titles={TITLES} onStepChange={onStepChange}>
      {({ step }) => <Steps step={step} />}
    </LabShell>
  )
}

function Steps({ step }) {
  const [n, setN] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    if (n >= REPLY.length) {
      setRunning(false)
      return
    }
    const t = setTimeout(() => setN((x) => x + 1), 18)
    return () => clearTimeout(t)
  }, [running, n])

  if (step === 0) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Dear Student: What Problem Are We Solving?">
          RAG, agents, memory, MCP. every later module still ends in the same action: you send
          text to a model, it returns more text. If that call is fuzzy, the rest of the course
          is wrappers around a mystery.
          <br />
          <br />
          We freeze one request: a cooking coach finishing a margherita. You will see the
          <strong> three roles</strong>, a <strong>fake stream</strong> (no API key on this
          website), and the Python shape you paste in Colab. including <code>import os</code>.
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
              { s: '1 (this page)', w: 'Name the primitive: generate', o: 'Everything later wraps this' },
              { s: '2', w: 'The payload is a message list', o: 'Not a magic chat room' },
              { s: '3', w: 'system / user / assistant', o: 'A three-row table' },
              { s: '4', w: 'Worked character counts', o: 'A bill you can estimate' },
              { s: '5', w: 'Fake streaming', o: 'Why UIs drip tokens' },
              { s: '6', w: 'temperature, max tokens, system', o: 'Three knobs, not thirty' },
              { s: '7', w: 'Python with import os', o: 'A copy-paste skeleton' },
              { s: '8', w: 'Recap', o: 'One paragraph you could teach' },
            ]}
          />
        </Container>

        <div style={{ background: '#e8f0fe', padding: 20, borderRadius: 8, border: '1px solid #4a90d9' }}>
          Analogy: a restaurant ticket. The kitchen (the model) does not remember yesterday.
          The ticket must list standing rules (system), the guest’s order (user), and any
          previous replies you want it to continue from (assistant).
        </div>
      </SpaceBetween>
    )
  }

  if (step === 1) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="There is no secret diary">
          HTTP is request/response. The provider does not keep your café conversation unless
          you send previous turns back. LangChain “memory” is just code that rebuilds this list.
        </StudentNote>
        <pre style={codeBox}>{`chat([
  { role: "system", content: "${SYSTEM}" },
  { role: "user",   content: "${USER}" }
])`}</pre>
        <Insight title="No API key on this page">
          The stream later is simulated so the public site stays safe. In Colab you load the
          key from the environment, never from JavaScript on GitHub Pages.
        </Insight>
        <ChoiceExercise
          question="Where should secrets live?"
          options={[
            'Inside this website’s JavaScript',
            'In .env / Colab secrets, never committed',
            'In the system prompt',
          ]}
          answer="In .env / Colab secrets, never committed"
        />
      </SpaceBetween>
    )
  }

  if (step === 2) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Three roles. that is the whole vocabulary">
          Providers disagree on field names (<code>system_instruction</code> vs a system
          message), but the jobs are the same. Memorise the jobs, not the SDK.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'r', header: 'Role', cell: (i) => i.r },
            { id: 'j', header: 'Job', cell: (i) => i.j },
            { id: 'e', header: 'This tutorial’s example', cell: (i) => i.e },
          ]}
          items={[
            {
              r: 'system',
              j: 'Standing instructions: persona, refusals, output format. Almost never drop this.',
              e: SYSTEM,
            },
            {
              r: 'user',
              j: 'What the human just said (and earlier human turns you still need).',
              e: USER,
            },
            {
              r: 'assistant',
              j: 'What the model said last time. You resend it so the next call has context.',
              e: '(empty on the first turn)',
            },
          ]}
        />
        <ChoiceExercise
          question="If you omit previous assistant messages, what happens?"
          options={[
            'The model still has a private diary',
            'The model only sees this request',
            'The system prompt is ignored',
          ]}
          answer="The model only sees this request"
        />
      </SpaceBetween>
    )
  }

  if (step === 3) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Count the characters so billing is not abstract">
          Rough classroom rule: tokens ≈ characters / 4. This is not tiktoken. It is a sanity
          check so you notice when a “short” prompt is actually long.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'r', header: 'Role', cell: (i) => i.r },
            { id: 'c', header: 'Characters', cell: (i) => i.c },
            { id: 't', header: '≈ ceil(chars/4)', cell: (i) => i.t },
          ]}
          items={[
            { r: 'system', c: String(SYSTEM.length), t: String(Math.ceil(SYSTEM.length / 4)) },
            { r: 'user', c: String(USER.length), t: String(Math.ceil(USER.length / 4)) },
            { r: 'assistant (streamed reply)', c: String(REPLY_CHARS), t: String(Math.ceil(REPLY_CHARS / 4)) },
          ]}
        />
        <div
          style={{
            background: '#ffebee',
            padding: 20,
            borderRadius: 8,
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            lineHeight: 1.9,
          }}
        >
          system length = {SYSTEM.length}
          <br />
          user length = {USER.length}
          <br />
          reply length = {REPLY_CHARS}
          <br />
          ≈ input tokens = ceil({SYSTEM.length}/4) + ceil({USER.length}/4) ={' '}
          {Math.ceil(SYSTEM.length / 4) + Math.ceil(USER.length / 4)}
        </div>
        <TryYourself>
          <Box variant="h4">How many characters is the simulated reply?</Box>
          <InteractiveInput
            label="Character count of the reply"
            correctAnswer={REPLY_CHARS}
            hint={`The reply is: “${REPLY}”`}
            tolerance={0.5}
          />
        </TryYourself>
      </SpaceBetween>
    )
  }

  if (step === 4) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Users hate a blank box">
          The model still generates one token at a time. Streaming means the HTTP response
          arrives in chunks so the first words paint immediately. This button does not call
          Gemini. it types a canned sentence so you see the UX, not a secret key.
        </StudentNote>
        <Button
          variant="primary"
          onClick={() => {
            setN(0)
            setRunning(true)
          }}
        >
          Simulate stream
        </Button>
        <pre style={codeBox}>
          {REPLY.slice(0, n)}
          {running ? '▌' : ''}
        </pre>
        <Box variant="small">
          Characters shown: {n} / {REPLY_CHARS}
        </Box>
        <Insight>
          Production code uses a stream iterator. The message list is identical; only the
          transport is chunked.
        </Insight>
      </SpaceBetween>
    )
  }

  if (step === 5) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Ignore the 40-parameter SDK for a week">
          Three settings change student demos more than the rest combined.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'k', header: 'Knob', cell: (i) => i.k },
            { id: 'd', header: 'What it does', cell: (i) => i.d },
            { id: 'c', header: 'Café default', cell: (i) => i.c },
          ]}
          items={[
            {
              k: 'temperature',
              d: 'How peaked the next-token distribution is (see the sampling lab).',
              c: '0.2–0.4 for recipes; higher for brainstorming names',
            },
            {
              k: 'max output tokens',
              d: 'Hard cap so a reply cannot run forever (and cannot empty your quota).',
              c: '256 is plenty for “finish the pizza”',
            },
            {
              k: 'system instruction',
              d: 'Persona, “if unknown say unknown”, never invent oven times from rumours.',
              c: 'Concise cooking coach; numbers only if given',
            },
          ]}
        />
        <ChoiceExercise
          question="A support bot starts inventing refunds. What do you tighten first?"
          options={['Only max tokens', 'System instruction and lower temperature', 'Add “please” to the user prompt']}
          answer="System instruction and lower temperature"
        />
      </SpaceBetween>
    )
  }

  if (step === 6) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="The skeleton you will type in Colab">
          <code>import os</code> is not decoration. It is how the key stays out of git.
          <code>os.environ[&quot;GEMINI_API_KEY&quot;]</code> fails loudly if you forgot to set
          it. that is better than shipping a leaked string.
        </StudentNote>
        <pre style={codeBox}>{`import os
from google import genai

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="How do I finish a margherita?",
)
print(response.text)`}</pre>
        <div style={{ background: '#fff8e1', padding: 16, borderRadius: 8, border: '1px solid #f9a825' }}>
          Later you will pass a list of roles instead of a single string. The client call is
          still this shape. LangChain / LangGraph still end in a model call like this.
        </div>
        <ChoiceExercise
          question="LangChain and LangGraph still end in…?"
          options={['A model call like this', 'A different kind of computer that skips the model']}
          answer="A model call like this"
        />
      </SpaceBetween>
    )
  }

  return (
    <SpaceBetween size="m">
      <StudentNote title="Say this out loud">
        An LLM call is a list of messages with three roles. The model has no diary unless you
        resend history. Streaming is UX, not a different algorithm. Keys live in the
        environment. Temperature, max tokens, and the system text are the first three knobs.
      </StudentNote>
      <CourseLink>
        Start with one provider in the API notebook, then the unified chat() wrapper. Do not
        skip import os.
      </CourseLink>
    </SpaceBetween>
  )
}
