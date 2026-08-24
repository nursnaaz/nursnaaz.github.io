import { useState } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import Button from '@cloudscape-design/components/button'
import Input from '@cloudscape-design/components/input'
import ColumnLayout from '@cloudscape-design/components/column-layout'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import Table from '@cloudscape-design/components/table'
import { LabShell } from '../lab/LabShell'
import { codeBox } from '../lab/labTheme'
import { Insight, Warn, ChoiceExercise, CourseLink } from '../lab/LabWidgets'
import { StudentNote } from '../interactive/StudentNote'
import { TryYourself } from '../interactive/TryYourself'
import { InteractiveInput } from '../interactive/InterativeInput'
import { Stage, TokenMeter } from '../lab/Viz'

const SYSTEM = 'You are a café helper. Remember the guest name if they give it.'
const DRINK_USER = 'I like iced lattes.'
const DRINK_ASST = 'Noted: iced latte.'
const LONG_USER =
  'Also tell me about seasonal specials in great detail, beans and origin stories please.'

function tokensFor(text) {
  return Math.ceil(text.length / 4)
}

const TITLES = [
  'The model has no diary',
  'Each call is a new intern',
  'Save the drink, then ask',
  'The list is the memory',
  'Tokens grow. chars / 4',
  'Keep the last N turns',
  'This is still not your PDF',
  'What you can now explain',
]

export function ChatbotsForget({ onStepChange }) {
  return (
    <LabShell titles={TITLES} onStepChange={onStepChange}>
      {({ step }) => <Steps step={step} />}
    </LabShell>
  )
}

function Steps({ step }) {
  const [name, setName] = useState('Amina')
  const [history, setHistory] = useState([{ role: 'system', content: SYSTEM }])
  const [stateless, setStateless] = useState('')
  const [stateful, setStateful] = useState('')
  const tokenGuess = history.reduce((n, m) => n + tokensFor(m.content), 0)

  const baseMessages = [
    { role: 'system', content: SYSTEM },
    { role: 'user', content: DRINK_USER },
    { role: 'assistant', content: DRINK_ASST },
  ]
  const baseTokens = baseMessages.reduce((n, m) => n + tokensFor(m.content), 0)

  if (step === 0) {
    return (
      <SpaceBetween size="m">
        <Stage eyebrow="Without a list the intern is empty. Grow the meter.">
          <TokenMeter used={tokenGuess} limit={512} />
          <Box padding={{ top: 's' }}>Guest name</Box>
          <Input value={name} onChange={({ detail }) => setName(detail.value)} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
            <Button
              onClick={() =>
                setStateless("I don't know your name or your drink. I only see this one message.")
              }
            >
              Ask with no history
            </Button>
            <Button
              onClick={() =>
                setHistory((h) => [
                  ...h,
                  { role: 'user', content: `${name}: ${DRINK_USER}` },
                  { role: 'assistant', content: DRINK_ASST },
                ])
              }
            >
              Append drink turn
            </Button>
            <Button onClick={() => setHistory([{ role: 'system', content: SYSTEM }])}>Reset list</Button>
          </div>
          <Box padding={{ top: 's' }}>{stateless}</Box>
          <Box variant="small">{history.length} messages in the list you would send.</Box>
        </Stage>
        <StudentNote title="The model has no diary">
          HTTP is stateless. The model does not know the guest is {name} unless that fact is
          sitting in the messages you send this time. Memory is a list. Tokens are chars / 4.
          Click append and watch the meter.
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
              { s: '1 (this page)', w: 'Name the amnesia problem', o: 'No private diary' },
              { s: '2', w: 'Intern analogy', o: 'You hand over the notes' },
              { s: '3', w: 'Two counters: drink then ask', o: 'History vs no history' },
              { s: '4', w: 'Inspect the JSON list', o: 'Roles you already know' },
              { s: '5', w: 'Token estimate chars/4', o: 'A number you type' },
              { s: '6', w: 'Sliding window', o: 'What you must not drop' },
              { s: '7', w: 'Chat ≠ handbook', o: 'Why RAG is next' },
              { s: '8', w: 'Recap', o: 'One paragraph you could teach' },
            ]}
          />
        </Container>

        <ChoiceExercise
          question="Where does conversation memory live by default?"
          options={[
            'Inside the GPU',
            'In the messages you resend each call',
            'Always in a private cloud diary',
          ]}
          answer="In the messages you resend each call"
        />
      </SpaceBetween>
    )
  }

  if (step === 1) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Picture the new intern">
          Every generate call hires someone who was not in the room yesterday. If you do not pass
          the notepad, they cannot know the iced latte. That notepad is the message list.
        </StudentNote>
        <div style={{ background: '#e8f0fe', padding: 20, borderRadius: 8, border: '1px solid #4a90d9' }}>
          System prompt = the employee handbook page you photocopy every shift.
          <br />
          User/assistant turns = today’s notepad.
          <br />
          Drop the notepad → “I don’t know your drink.”
        </div>
        <Insight title="Picture this">Each call is a new intern unless you hand them the notes.</Insight>
      </SpaceBetween>
    )
  }

  if (step === 2) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Do this in order on the right column">
          Type a guest name. On the right: first save the drink, then ask what they liked. On
          the left: ask with no list. the intern has an empty clipboard.
        </StudentNote>
        <Box>Guest name</Box>
        <Input value={name} onChange={({ detail }) => setName(detail.value)} />
        <ColumnLayout columns={2} minColumnWidth={220}>
          <div>
            <Box variant="h3">Without history</Box>
            <Button
              onClick={() =>
                setStateless("I don't know your name or your drink. I only see this one message.")
              }
            >
              Ask without history
            </Button>
            <Box>{stateless || ': '}</Box>
          </div>
          <div>
            <Box variant="h3">With a list</Box>
            <SpaceBetween size="xs">
              <Button
                onClick={() =>
                  setHistory((h) => [
                    ...h,
                    { role: 'user', content: DRINK_USER },
                    { role: 'assistant', content: DRINK_ASST },
                  ])
                }
              >
                First turn: save the drink
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const remembered = history.some((m) => m.content.toLowerCase().includes('latte'))
                  setStateful(
                    remembered
                      ? `You are ${name}. You asked for an iced latte last turn.`
                      : `Nice to meet you, ${name}. Click “save the drink” first, then ask again.`
                  )
                }}
              >
                Then ask: what did I like?
              </Button>
            </SpaceBetween>
            <Box>{stateful || ': '}</Box>
          </div>
        </ColumnLayout>
      </SpaceBetween>
    )
  }

  if (step === 3) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="This JSON is the entire memory">
          After you saved the drink, the next API call should look like this (system + the pair).
          If a line is missing, the intern never heard it.
        </StudentNote>
        <pre style={{ ...codeBox, maxHeight: 280, overflow: 'auto' }}>
          {JSON.stringify(history, null, 2)}
        </pre>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'r', header: 'Role', cell: (i) => i.r },
            { id: 'n', header: 'Characters', cell: (i) => i.n },
            { id: 't', header: 'ceil(chars/4)', cell: (i) => i.t },
          ]}
          items={history.map((m, i) => ({
            r: `${i}: ${m.role}`,
            n: m.content.length,
            t: tokensFor(m.content),
          }))}
        />
      </SpaceBetween>
    )
  }

  if (step === 4) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="The bill grows even if the next message is “ok”">
          Classroom estimate: tokens ≈ characters / 4. Real apps use the provider counter. Live
          total for the list on this page: <strong>~{tokenGuess}</strong>.
        </StudentNote>
        <Box fontSize="display-l">~{tokenGuess} tokens</Box>
        <Stage eyebrow="Context filling up">
          <TokenMeter used={tokenGuess} limit={512} />
        </Stage>
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
          system ({SYSTEM.length} chars) → {tokensFor(SYSTEM)}
          <br />
          user drink ({DRINK_USER.length}) → {tokensFor(DRINK_USER)}
          <br />
          assistant ({DRINK_ASST.length}) → {tokensFor(DRINK_ASST)}
          <br />
          If those three are present, sum = {baseTokens}
        </div>
        <Button onClick={() => setHistory((h) => [...h, { role: 'user', content: LONG_USER }])}>
          Append a long user turn
        </Button>
        <Warn>Appending seasonal-specials text increases the estimate even before the model replies.</Warn>
        <TryYourself>
          <Box variant="h4">Token guess for system + drink user + drink assistant</Box>
          <Box variant="p">
            Use ceil(len/4) on each of the three strings, then add. Do not include the long
            seasonal message.
          </Box>
          <InteractiveInput
            label="Sum of three ceil(chars/4)"
            correctAnswer={baseTokens}
            hint={`${tokensFor(SYSTEM)} + ${tokensFor(DRINK_USER)} + ${tokensFor(DRINK_ASST)} = ${baseTokens}`}
            tolerance={0.5}
          />
        </TryYourself>
      </SpaceBetween>
    )
  }

  if (step === 5) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Sliding window">
          Keep the system prompt and the last N user/assistant pairs. Drop the rest. You may
          forget the latte if it aged out of the window. That is the trade: cost vs recall.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'k', header: 'Keep', cell: (i) => i.k },
            { id: 'w', header: 'Why', cell: (i) => i.w },
          ]}
          items={[
            { k: 'System prompt', w: 'Persona and refusals. Almost never drop.' },
            { k: 'Last N pairs', w: 'Recent drink, name, complaint.' },
            { k: 'Summary of the rest', w: 'Optional: extra model call to compress old turns.' },
          ]}
        />
        <ChoiceExercise
          question="What should you almost never drop?"
          options={['The latest user message', 'The system prompt', 'Tool results from this turn']}
          answer="The system prompt"
        />
      </SpaceBetween>
    )
  }

  if (step === 6) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="The list only contains what was said">
          A 200-page refund policy is not in the chat unless someone pasted it. “What’s our
          refund window?” needs retrieval over your docs. that gap is RAG.
        </StudentNote>
        <div style={{ background: '#fff8e1', padding: 16, borderRadius: 8, border: '1px solid #f9a825' }}>
          Memory = past messages.
          <br />
          Knowledge = documents you did not type in this café chat.
          <br />
          Do not paste the whole handbook into the system prompt “just in case”.
        </div>
        <ChoiceExercise
          question="“What’s our refund window?” is not in the chat. What do you need?"
          options={[
            'Paste the whole handbook into the system prompt',
            'Retrieval over your docs (RAG)',
            'Higher temperature',
          ]}
          answer="Retrieval over your docs (RAG)"
        />
      </SpaceBetween>
    )
  }

  return (
    <SpaceBetween size="m">
      <StudentNote title="Say this out loud">
        The model forgets between calls. You resend a message list. Tokens grow roughly as
        characters/4. Trim old turns; keep the system prompt. Chat history is not your PDF
        library.
      </StudentNote>
      <CourseLink>The long version lives in the chatbot memory notebook. This page is the short version.</CourseLink>
    </SpaceBetween>
  )
}
