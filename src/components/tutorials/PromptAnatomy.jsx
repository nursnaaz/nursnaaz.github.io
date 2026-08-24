import { useState } from 'react'
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

const REVIEW = '"The crust was cardboard but the staff were kind."'

const ZERO = `You are a café review classifier.

Task: classify the review as exactly one of: food / service / both / neither.
Constraints: reply with the label only, lowercase, no punctuation.

Review: ${REVIEW}
Label:`

const FEW = `You are a café review classifier.

Task: classify each review as exactly one of: food / service / both / neither.
Constraints: reply with the label only, lowercase.

Review: "Sauce was perfect, extra basil."
Label: food

Review: "Waited 40 minutes for a table."
Label: service

Review: "Parking was easy and the playlist was loud."
Label: neither

Review: ${REVIEW}
Label:`

const COT = `You are a café review classifier.

Task: classify as food / service / both / neither.
Think step by step:
1) Quote any food evidence (or write NONE).
2) Quote any service evidence (or write NONE).
3) Pick the label from the two quotes.
Keep the reasoning short.

Review: ${REVIEW}`

const COT_OUT = `1) Food evidence: "The crust was cardboard"
2) Service evidence: "the staff were kind"
3) Label: both`

const TITLES = [
  'Keep the café review frozen',
  'Four parts of every prompt',
  'Zero-shot. the full prompt',
  'Few-shot. the full prompt',
  'Chain of thought. the full prompt',
  'When to use which',
  'Count what you pay for',
  'What you can now explain',
]

export function PromptAnatomy({ onStepChange }) {
  return (
    <LabShell titles={TITLES} onStepChange={onStepChange}>
      {({ step }) => <Steps step={step} />}
    </LabShell>
  )
}

function Steps({ step }) {
  const [mode, setMode] = useState('zero')

  if (step === 0) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Dear Student: What Problem Are We Solving?">
          Students often change the task when they change the technique. Then they cannot tell
          whether few-shot helped or whether the new review was easier. We freeze one sentence
          for every method:
          <br />
          <br />
          <strong>{REVIEW}</strong>
          <br />
          <br />
          A prompt is not a spell. It is context that biases the next-token distribution toward
          a format you can parse. We will write the <strong>full</strong> zero-shot, few-shot,
          and chain-of-thought prompts. not slogans.
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
              { s: '1 (this page)', w: 'Lock the review', o: 'Fair comparison' },
              { s: '2', w: 'Role, task, constraints, input', o: 'A four-part checklist' },
              { s: '3', w: 'Zero-shot, full text', o: 'No labelled examples' },
              { s: '4', w: 'Few-shot, full text', o: 'Format taught by examples' },
              { s: '5', w: 'CoT, full text + worked output', o: 'Evidence then label' },
              { s: '6', w: 'Comparison table', o: 'When each method is worth it' },
              { s: '7', w: 'Token cost of CoT vs label-only', o: 'A number you compute' },
              { s: '8', w: 'Recap', o: 'One paragraph you could teach' },
            ]}
          />
        </Container>

        <ChoiceExercise
          question="Why keep the same review across techniques?"
          options={[
            'So we see the technique, not a new problem',
            'Because models hate new tasks',
            'Only to save tokens',
          ]}
          answer="So we see the technique, not a new problem"
        />
      </SpaceBetween>
    )
  }

  if (step === 1) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="If a part is missing, the model improvises">
          Improvisation is how you get “Sure! Here’s a haiku about crust.” Write all four parts
          on purpose.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'p', header: 'Part', cell: (i) => i.p },
            { id: 'q', header: 'Question it answers', cell: (i) => i.q },
            { id: 'e', header: 'Café example', cell: (i) => i.e },
          ]}
          items={[
            { p: 'Role', q: 'Who is speaking?', e: 'You are a café review classifier.' },
            { p: 'Task', q: 'What is the verb?', e: 'Classify as food / service / both / neither.' },
            { p: 'Constraints', q: 'What must the output look like?', e: 'Label only, lowercase.' },
            { p: 'Input', q: 'What is this instance?', e: REVIEW },
          ]}
        />
        <div style={{ background: '#e8f0fe', padding: 20, borderRadius: 8, border: '1px solid #4a90d9' }}>
          Role without constraints → chatty essays. Constraints without input → the model
          classifies a review you never sent.
        </div>
      </SpaceBetween>
    )
  }

  if (step === 2) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Zero-shot means zero labelled examples">
          You still have role, task, constraints, and input. “Zero” is about demonstrations, not
          about being vague.
        </StudentNote>
        <pre style={codeBox}>{ZERO}</pre>
        <Box>
          Simulated model: <strong>both</strong>
        </Box>
        <ChoiceExercise question="Does zero-shot include labelled examples?" options={['Yes', 'No']} answer="No" />
      </SpaceBetween>
    )
  }

  if (step === 3) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Few-shot teaches the shape louder than adjectives">
          “Be concise” is weak. Three lines that look like Label: food are strong. Two clean
          examples beat ten messy ones. We include a neither example so the model has seen that
          class, not only food and service.
        </StudentNote>
        <pre style={codeBox}>{FEW}</pre>
        <Insight>
          Examples teach format better than “be concise”. Match punctuation and casing exactly in
          the examples and in the live review.
        </Insight>
        <ChoiceExercise
          question="What should examples show besides the answer?"
          options={['Favourite quotes', 'The output shape you want', 'The training data']}
          answer="The output shape you want"
        />
        <TryYourself>
          <Box variant="h4">How many labelled demonstrations sit above the live review?</Box>
          <InteractiveInput
            label="Number of few-shot examples"
            correctAnswer={3}
            hint="food, service, and neither. three Review/Label pairs before the cardboard crust."
            tolerance={0.1}
          />
        </TryYourself>
      </SpaceBetween>
    )
  }

  if (step === 4) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Chain of thought asks for evidence before the label">
          For this review the evidence is short and checkable. CoT is not “write a novel”; it is
          “show the quotes that justify the enum”.
        </StudentNote>
        <pre style={codeBox}>{COT}</pre>
        <div
          style={{
            background: '#ffebee',
            padding: 20,
            borderRadius: 8,
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
          }}
        >
          Simulated model output:{'\n'}
          {COT_OUT}
        </div>
        <Insight>
          You pay for those extra thinking tokens. Use CoT when you need evidence, not for a 50ms
          classifier behind a button.
        </Insight>
        <ChoiceExercise
          question="Is chain of thought free?"
          options={['Yes', 'No: extra tokens, and the reasoning may leak']}
          answer="No: extra tokens, and the reasoning may leak"
        />
      </SpaceBetween>
    )
  }

  if (step === 5) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Pick the cheapest method that is reliable enough">
          Technique is a cost/accuracy trade. The table is the decision you will make in labs.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'm', header: 'Method', cell: (i) => i.m },
            { id: 'u', header: 'Use when', cell: (i) => i.u },
            { id: 'a', header: 'Avoid when', cell: (i) => i.a },
          ]}
          items={[
            {
              m: 'Zero-shot',
              u: 'The label set is obvious and you need speed / low cost.',
              a: 'The model keeps inventing extra labels or wrapping quotes.',
            },
            {
              m: 'Few-shot',
              u: 'You care about exact format, rare classes, or casing.',
              a: 'You dump 20 noisy examples and blow the context window.',
            },
            {
              m: 'Chain of thought',
              u: 'You need a quote, a calculation, or a multi-hop check.',
              a: 'High-QPS classification, or reasoning would leak to end users.',
            },
          ]}
        />
        <ChoiceExercise
          question="A dashboard needs one enum per review, 10,000 per hour. Start with?"
          options={['Always CoT', 'Zero-shot or few-shot label-only', 'A 2,000-word system essay']}
          answer="Zero-shot or few-shot label-only"
        />
      </SpaceBetween>
    )
  }

  if (step === 6) {
    const labelOnly = 'both'.length
    const cotChars = COT_OUT.length
    return (
      <SpaceBetween size="m">
        <StudentNote title="Same review, different bill">
          Label-only output is {labelOnly} characters. The CoT simulation is {cotChars}{' '}
          characters. Using chars/4: ceil({labelOnly}/4) vs ceil({cotChars}/4).
        </StudentNote>
        <div
          style={{
            background: '#fff8e1',
            padding: 16,
            borderRadius: 8,
            border: '1px solid #f9a825',
            fontFamily: 'monospace',
            lineHeight: 1.8,
          }}
        >
          label-only ≈ {Math.ceil(labelOnly / 4)} tokens
          <br />
          CoT output ≈ {Math.ceil(cotChars / 4)} tokens
          <br />
          ratio ≈ {(cotChars / labelOnly).toFixed(1)}× characters
        </div>
        <TryYourself>
          <Box variant="h4">Character count of the simulated CoT answer</Box>
          <InteractiveInput
            label="Length of the three-line CoT output"
            correctAnswer={cotChars}
            hint="Count the simulated model output block on the previous step (including newlines)."
            tolerance={2}
          />
        </TryYourself>
        <SpaceBetween direction="horizontal" size="s">
          {['zero', 'few', 'cot'].map((m) => (
            <Button key={m} variant={mode === m ? 'primary' : 'normal'} onClick={() => setMode(m)}>
              {m}
            </Button>
          ))}
        </SpaceBetween>
        <pre style={codeBox}>{mode === 'zero' ? ZERO : mode === 'few' ? FEW : COT}</pre>
      </SpaceBetween>
    )
  }

  return (
    <SpaceBetween size="m">
      <StudentNote title="Say this out loud">
        A prompt has role, task, constraints, and input. Zero-shot has no labelled examples.
        Few-shot teaches format. CoT buys evidence with extra tokens. Keep the task fixed when
        you compare techniques.
      </StudentNote>
      <CourseLink>Hand prompting first. Auto-prompt tools come later in class.</CourseLink>
    </SpaceBetween>
  )
}
