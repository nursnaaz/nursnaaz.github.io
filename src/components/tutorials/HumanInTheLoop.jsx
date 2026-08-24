import { useState } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import Button from '@cloudscape-design/components/button'
import Textarea from '@cloudscape-design/components/textarea'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import Table from '@cloudscape-design/components/table'
import { LabShell } from '../lab/LabShell'
import { pill, calloutBox } from '../lab/labTheme'
import { Insight, ChoiceExercise, CourseLink } from '../lab/LabWidgets'
import { StudentNote } from '../interactive/StudentNote'

const LIE = 'Post: 50% off all memberships forever. Sign here.'
const FIXED = 'Post: 10% off new memberships this weekend only. Terms on the site.'

const TITLES = [
  'Some actions are irreversible',
  'Your 7-step roadmap',
  'What interrupt actually freezes',
  'Status starts interrupted',
  'Approve vs Fix the lie',
  'Resume from saved state',
  'thread_id is the customer',
]

export function HumanInTheLoop({ onStepChange }) {
  return (
    <LabShell titles={TITLES} onStepChange={onStepChange}>
      {({ step }) => <Steps step={step} />}
    </LabShell>
  )
}

function Steps({ step }) {
  const [status, setStatus] = useState('interrupted')
  const [draft, setDraft] = useState(LIE)
  const [final, setFinal] = useState('')

  if (step === 0) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Dear Student: HITL is how agents enter businesses">
          Sending email, issuing refunds, posting to a public channel. those writes cannot
          be undone by a better prompt. An agent should <strong>pause</strong>, show a human
          the proposed state, and only continue when someone approves or edits.<br /><br />
          LangGraph’s interrupt is this idea as an API: freeze graph state, display it, resume
          with a Command. Human-in-the-loop is not a failure of autonomy. It is the product.
        </StudentNote>
        <ChoiceExercise
          question="Best default before sending a customer email?"
          options={['Fire immediately', 'interrupt_before send + human approve', 'Increase max_iterations']}
          answer="interrupt_before send + human approve"
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
              { s: '1', w: 'Why pause', o: 'Irreversible side effects' },
              { s: '2 (this page)', w: 'Roadmap', o: 'The path' },
              { s: '3', w: 'Checkpointer + interrupt', o: 'What is frozen' },
              { s: '4', w: 'Paused draft (a lie)', o: 'Status = interrupted' },
              { s: '5', w: 'Approve or Fix the lie', o: 'You are a graph node' },
              { s: '6', w: 'Resume', o: 'Command(resume=…)' },
              { s: '7', w: 'thread_id', o: 'One customer, one thread' },
            ]}
          />
        </Container>
      </SpaceBetween>
    )
  }

  if (step === 2) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="interrupt without a checkpointer is theatre">
          The graph must store state (MemorySaver / SqliteSaver) keyed by <code>thread_id</code>.
          Interrupt stops before a dangerous node. The human sees <code>get_state</code>, maybe
          <code>update_state</code>, then resume. Without storage, “resume” is a new graph with
          empty memory.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'api', header: 'Piece', cell: (i) => i.api },
            { id: 'job', header: 'Job', cell: (i) => i.job },
          ]}
          items={[
            { api: 'interrupt()', job: 'Pause execution; wait for a human' },
            { api: 'MemorySaver', job: 'Persist the frozen state' },
            { api: 'thread_id', job: 'Isolate one run from another' },
            { api: 'Command(resume=…)', job: 'Continue with approval or an edit' },
          ]}
        />
        <ChoiceExercise
          question="Without a thread id / checkpointer, resume would…?"
          options={['Always work', 'Lose the frozen state', 'Train LoRA']}
          answer="Lose the frozen state"
        />
      </SpaceBetween>
    )
  }

  if (step === 3) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Graph status starts interrupted">
          You landed on the pause step. The agent already drafted a social post. It did
          <strong> not</strong> publish. Status is <code>interrupted</code> from the first
          render. not “running” while a lie sits in the buffer.
        </StudentNote>
        <Box>
          Status: <span style={pill('yellow')}>{status}</span>
        </Box>
        <Container header={<Header variant="h3">Proposed post (wrong on purpose)</Header>}>
          <Box variant="p">{draft}</Box>
        </Container>
        <Insight>
          “50% off forever” is a marketing hallucination. Next step: Approve as-is (bad) or
          Fix the lie.
        </Insight>
      </SpaceBetween>
    )
  }

  if (step === 4) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="You are the node named human">
          Approve copies the current draft into the published slot. Fix the lie replaces the
          draft with honest copy, sets status to edited, and still waits for you to Approve
          if you want it published.
        </StudentNote>
        <Textarea value={draft} onChange={({ detail }) => setDraft(detail.value)} rows={4} />
        <SpaceBetween direction="horizontal" size="xs">
          <Button
            variant="primary"
            onClick={() => {
              setStatus('approved')
              setFinal(draft)
            }}
          >
            Approve
          </Button>
          <Button
            onClick={() => {
              setDraft(FIXED)
              setStatus('edited')
            }}
          >
            Fix the lie
          </Button>
        </SpaceBetween>
        <Box>
          Status: <span style={pill(status === 'approved' ? 'green' : 'yellow')}>{status}</span>
        </Box>
      </SpaceBetween>
    )
  }

  if (step === 5) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Resume = continue from saved state">
          In LangGraph this is <code>Command(resume=...)</code> plus the checkpointer, not a
          new graph from scratch. This page shows whatever you approved on the previous step.
        </StudentNote>
        <div style={calloutBox}>
          Published copy:{' '}
          <strong>{final || '(approve on the previous step. nothing published yet)'}</strong>
        </div>
        <ChoiceExercise
          question="HITL state must be…?"
          options={['Stored (checkpointer) per thread', 'Kept only in React useState in production', 'Printed to stdout']}
          answer="Stored (checkpointer) per thread"
        />
      </SpaceBetween>
    )
  }

  return (
    <SpaceBetween size="m">
      <StudentNote title="thread_id keeps customers apart">
        Two people hitting “approve” at once must not share a draft. Production graphs key
        checkpoint state by thread. This browser lab uses React state, which is the
        storyboard. not the database.
      </StudentNote>
      <CourseLink>
        challenge_human_in_the_loop in M08 is the real interrupt() + Command(resume) lifecycle.
        Use Approve vs Fix the lie as the acceptance test for the UI around it.
      </CourseLink>
    </SpaceBetween>
  )
}
