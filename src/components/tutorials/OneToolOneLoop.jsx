import { useState } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import Button from '@cloudscape-design/components/button'
import Input from '@cloudscape-design/components/input'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import Table from '@cloudscape-design/components/table'
import { LabShell } from '../lab/LabShell'
import { codeBox, pill } from '../lab/labTheme'
import { Insight, Warn, ChoiceExercise, CourseLink } from '../lab/LabWidgets'
import { StudentNote } from '../interactive/StudentNote'
import { TryYourself } from '../interactive/TryYourself'
import { InteractiveInput } from '../interactive/InterativeInput'

function calc(expr) {
  const m = expr.replace(/\s/g, '').match(/^(-?\d+(?:\.\d+)?)([+\-*/])(-?\d+(?:\.\d+)?)$/)
  if (!m) return { ok: false, error: 'Only one simple a+b, a-b, a*b, a/b expression.' }
  const a = Number(m[1])
  const op = m[2]
  const b = Number(m[3])
  if (op === '/' && b === 0) return { ok: false, error: 'Division by zero.' }
  const v = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b
  return { ok: true, value: v }
}

const TITLES = [
  'Chat guesses; tools measure',
  'ReAct is a loop, not a vibe',
  'Thought stays backstage',
  'Action. call the calculator',
  'Observation. read 893',
  'Final answer after the tool',
  'Stop rules that save you',
  'What you can now explain',
]

export function OneToolOneLoop({ onStepChange }) {
  return (
    <LabShell titles={TITLES} onStepChange={onStepChange}>
      {({ step }) => <Steps step={step} />}
    </LabShell>
  )
}

function Steps({ step }) {
  const [expr, setExpr] = useState('47*19')
  const [ran, setRan] = useState(false)
  const obs = calc(expr)

  if (step === 0) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Dear Student: What Problem Are We Solving?">
          Ask a chat model “what is 47 × 19?” and it might say 890, or 893, or a story about
          pizza. Multiplication is a tool skill. An <strong>agent</strong> may call a calculator,
          read the number, then speak.
          <br />
          <br />
          We freeze 47 × 19 = <strong>893</strong>. Thought, Action, and Observation get
          separate steps so you never mix “I will call” with “the tool returned”.
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
              { s: '1 (this page)', w: 'Why chat fails at arithmetic', o: 'Tools vs fluency' },
              { s: '2', w: 'Thought → Action → Observation', o: 'The ReAct loop' },
              { s: '3', w: 'Thought only', o: 'Guests should not see this' },
              { s: '4', w: 'Action only', o: 'calculator("47*19")' },
              { s: '5', w: 'Observation only', o: '893 from the tool' },
              { s: '6', w: 'Final sentence', o: 'Grounded in the observation' },
              { s: '7', w: 'Stop rules', o: 'max iterations, errors as observations' },
              { s: '8', w: 'Recap', o: 'One paragraph you could teach' },
            ]}
          />
        </Container>

        <div style={{ background: '#e8f0fe', padding: 20, borderRadius: 8, border: '1px solid #4a90d9' }}>
          Worked product: 47 × 19 = 47 × 20 − 47 = 940 − 47 = 893. The tool should return that
          exact integer. If the model said 890, the observation still wins.
        </div>
      </SpaceBetween>
    )
  }

  if (step === 1) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="ReAct">
          Thought (why a tool), Action (structured call), Observation (tool text back into the
          prompt). Then either another tool call or a final answer. That is the whole agent loop
          you will later see as LangGraph nodes.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'p', header: 'Phase', cell: (i) => i.p },
            { id: 'w', header: 'Who runs it', cell: (i) => i.w },
            { id: 'e', header: 'This example', cell: (i) => i.e },
          ]}
          items={[
            { p: 'Thought', w: 'Model', e: 'I might mis-multiply; use calculator.' },
            { p: 'Action', w: 'Model names the tool + args', e: 'calculator("47*19")' },
            { p: 'Observation', w: 'Your code / the tool', e: '893' },
            { p: 'Final', w: 'Model after reading observation', e: 'The exact value is 893.' },
          ]}
        />
        <ChoiceExercise
          question="Why not call a tool on every message?"
          options={[
            'Tools are free and infinite',
            'Each call costs time and can fail. Use them when the model is weak at the skill.',
            'Tools replace the LLM',
          ]}
          answer="Each call costs time and can fail. Use them when the model is weak at the skill."
        />
      </SpaceBetween>
    )
  }

  if (step === 2) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Thought is scratch paper">
          It helps the model pick a tool. It is usually not the café guest’s UI.
        </StudentNote>
        <pre style={codeBox}>{`Thought: Multiplication of 47 and 19 is easy to get wrong.
I will call calculator.`}</pre>
        <ChoiceExercise
          question="Should the café guest see the Thought line?"
          options={['Always, for transparency', 'Usually no. Show the final answer.', 'Thought replaces Action']}
          answer="Usually no. Show the final answer."
        />
      </SpaceBetween>
    )
  }

  if (step === 3) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Action is a function call, not the answer">
          Write an expression. Do not skip ahead: the next step is Observation. Default 47*19
          must yield 893 when the tool runs.
        </StudentNote>
        <Input
          value={expr}
          onChange={({ detail }) => {
            setExpr(detail.value)
            setRan(false)
          }}
        />
        <Box>
          <span style={pill('yellow')}>Action</span> calculator(&quot;{expr}&quot;)
        </Box>
        <Button variant="primary" onClick={() => setRan(true)}>
          Call the tool
        </Button>
        {ran && (
          <div style={{ background: '#fff8e1', padding: 16, borderRadius: 8, border: '1px solid #f9a825' }}>
            Tool invoked. The return value is not shown on this step on purpose. Go to
            Observation next.
          </div>
        )}
        <Insight>If you mix Action and Observation in one bubble, you cannot debug which side failed.</Insight>
      </SpaceBetween>
    )
  }

  if (step === 4) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Observation is whatever the tool printed">
          Your Python (or this JavaScript calculator) ran. The model did not think 893 into
          existence on this step. If the expression is invalid, the observation is an error
          string. still an observation, not a crash of the whole app.
        </StudentNote>
        <Box>
          <span style={pill('blue')}>Observation</span> {obs.ok ? String(obs.value) : obs.error}
        </Box>
        <TryYourself>
          <Box variant="h4">What does calculator(&quot;47*19&quot;) return?</Box>
          <InteractiveInput
            label="Integer result"
            correctAnswer={893}
            hint="47×20 = 940, minus 47 = 893."
            tolerance={0.1}
          />
        </TryYourself>
      </SpaceBetween>
    )
  }

  if (step === 5) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Only now does the model talk to the guest">
          The final sentence must be licensed by the observation. If the model had said 890 in
          Thought, we still report 893.
        </StudentNote>
        <Box>
          <span style={pill('green')}>Final</span>{' '}
          {obs.ok ? `The exact value is ${obs.value}.` : `I could not compute that: ${obs.error}`}
        </Box>
        <div
          style={{
            background: '#ffebee',
            padding: 20,
            borderRadius: 8,
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
          }}
        >
          47 * 19 = 893 (tool). Do not average with a guessed 890.
        </div>
        <Insight>If the model had said 890, the tool still saves you.</Insight>
      </SpaceBetween>
    )
  }

  if (step === 6) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Loops need brakes">
          Without stop rules, an agent will call calculator until your quota dies. LangGraph
          exists because this loop needs state, branches, and sometimes a human pause.
        </StudentNote>
        <ul>
          <li>max iterations (for example 6)</li>
          <li>tool errors become Observation, not a crash</li>
          <li>unknown tool name: do not invent arguments</li>
          <li>stop when the question is solved (final answer, not another Action)</li>
        </ul>
        <Warn>A missing max-iteration condition is how you get 40 calculator calls.</Warn>
        <ChoiceExercise
          question="An agent calls calculator 40 times. What was missing?"
          options={['More temperature', 'A max-iteration / stop condition', 'A bigger GPU']}
          answer="A max-iteration / stop condition"
        />
      </SpaceBetween>
    )
  }

  return (
    <SpaceBetween size="m">
      <StudentNote title="Say this out loud">
        An agent loop is Thought, Action, Observation. Keep Action and Observation on separate
        steps. 47 × 19 is 893 from the tool. Stop with a max iteration count; turn tool failures
        into observations.
      </StudentNote>
      <CourseLink>You now have the loop in your head before ToolNode.</CourseLink>
    </SpaceBetween>
  )
}
