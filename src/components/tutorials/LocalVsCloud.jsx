import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import Table from '@cloudscape-design/components/table'
import { LabShell } from '../lab/LabShell'
import { calloutBox } from '../lab/labTheme'
import { Insight, ChoiceExercise, CourseLink } from '../lab/LabWidgets'
import { StudentNote } from '../interactive/StudentNote'

const TITLES = [
  'Four pains of a cloud API',
  'Your 7-step roadmap',
  'What “local” actually means',
  'RAM table: 8 / 16 / 32 GB',
  'Quantization is a memory trade',
  'A simple routing rule',
  'Write the decision down',
]

export function LocalVsCloud({ onStepChange }) {
  return (
    <LabShell titles={TITLES} onStepChange={onStepChange}>
      {({ step }) => <Steps step={step} />}
    </LabShell>
  )
}

function Steps({ step }) {
  if (step === 0) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Dear Student: Cloud is wonderful until it is not">
          Hosted APIs give you frontier quality and zero GPU ops. Four practical pains show up
          the first week you ship something real: the meter, the data-leaving-the-building
          policy, someone else’s outage, and a rate limit in the middle of a live demo.<br /><br />
          Local models (Ollama on a laptop) invert those four. You pay in RAM, quality, and
          the time you spend running a server. This lab is a decision table, not a loyalty test.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'p', header: 'Pain', cell: (i) => i.p },
            { id: 'cloud', header: 'Cloud API', cell: (i) => i.cloud },
            { id: 'local', header: 'Local (Ollama)', cell: (i) => i.local },
          ]}
          items={[
            { p: '1. Meter', cloud: 'Per-token invoice, always on', local: 'Electricity + your time' },
            { p: '2. Secrets / HR data', cloud: 'Prompts hit a vendor', local: 'Weights and prompts stay on disk' },
            { p: '3. Availability', cloud: 'Their outage is your incident', local: 'Works on a plane if the model is pulled' },
            { p: '4. Rate limits', cloud: '429 in a classroom demo', local: 'Your fan is the limit' },
          ]}
        />
        <ChoiceExercise
          question="Local LLMs shine first for…?"
          options={['Training GPT-4', 'Private iteration and demos without a bill', 'Hosting TikTok']}
          answer="Private iteration and demos without a bill"
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
              { s: '1', w: 'Four cloud pains', o: 'The complaint list' },
              { s: '2 (this page)', w: 'Roadmap', o: 'Where we are going' },
              { s: '3', w: 'Ollama as a local server', o: 'Same chat() shape, different URL' },
              { s: '4', w: 'RAM tiers', o: 'What fits on 8 / 16 / 32 GB' },
              { s: '5', w: 'Q4 vs FP16', o: 'Why 7B Q4 is the class default' },
              { s: '6', w: 'Route easy jobs locally', o: 'A rule you can implement' },
              { s: '7', w: 'Decision table', o: 'Pick without ideology' },
            ]}
          />
        </Container>
      </SpaceBetween>
    )
  }

  if (step === 2) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Ollama is a server on localhost">
          You pull a GGUF-quantized model once. Then Python talks to{' '}
          <code>http://localhost:11434</code> with a chat payload that looks like OpenAI.
          Same wrapper function; different <code>base_url</code>. You are not training a
          foundation model. You are running someone else’s weights on your RAM.
        </StudentNote>
        <div style={calloutBox}>
          Quality: a 7B–14B local model is enough for classification, rewriting, and many RAG
          answers. Frontier cloud models still win at hard reasoning, vision, and polished
          customer copy.
        </div>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'k', header: 'Dimension', cell: (i) => i.k },
            { id: 'local', header: 'Local', cell: (i) => i.local },
            { id: 'cloud', header: 'Cloud', cell: (i) => i.cloud },
          ]}
          items={[
            { k: 'Internet', local: 'Works offline after pull', cloud: 'Needs the provider' },
            { k: 'Ops', local: 'You run Ollama', cloud: 'They run GPUs' },
            { k: 'Cost', local: 'Hardware you already own', cloud: 'Invoice follows usage' },
          ]}
        />
      </SpaceBetween>
    )
  }

  if (step === 3) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Pick a model like you pick RAM, not like a brand">
          The weights must fit in memory with room for the KV cache. These are classroom
          rules of thumb for 4-bit (Q4) GGUF, not a vendor SLA.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'ram', header: 'Machine RAM', cell: (i) => i.ram },
            { id: 'fit', header: 'What usually fits (Q4)', cell: (i) => i.fit },
            { id: 'use', header: 'Honest use', cell: (i) => i.use },
          ]}
          items={[
            { ram: '8 GB', fit: 'Tiny / 1–3B quantized', use: 'Learning the API only. expect slow, shallow answers' },
            { ram: '16 GB', fit: '7B Q4. the class default', use: 'Daily labs, RAG drafts, routing easy jobs' },
            { ram: '32 GB+', fit: '14B happier; 32B if you wait', use: 'Stronger local quality; still not a 70B workstation' },
          ]}
        />
        <Insight>
          70B at decent speed is a workstation or a cloud GPU story. Do not promise it on a
          16 GB laptop.
        </Insight>
      </SpaceBetween>
    )
  }

  if (step === 4) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Quantization">
          FP16 7B is roughly 14 GB of weights. Q4_K_M is roughly 4–5 GB. You trade numerical
          precision (and a bit of quality) for the ability to load the model. That is why the
          16 GB row in the previous table says 7B Q4, not 7B FP16.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'fmt', header: 'Format', cell: (i) => i.fmt },
            { id: 'bits', header: 'Approx bits / weight', cell: (i) => i.bits },
            { id: 'n', header: '7B footprint (order of mag.)', cell: (i) => i.n },
          ]}
          items={[
            { fmt: 'FP16', bits: '16', n: '~14 GB' },
            { fmt: 'Q8', bits: '8', n: '~7 GB' },
            { fmt: 'Q4_K_M', bits: '~4–5', n: '~4–5 GB' },
          ]}
        />
        <ChoiceExercise
          question="Quantization mainly trades…?"
          options={['Disk color vs RAM color', 'Precision / quality vs memory', 'JSON vs XML']}
          answer="Precision / quality vs memory"
        />
      </SpaceBetween>
    )
  }

  if (step === 5) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Route the easy jobs">
          Classification, summarising meeting notes, rewriting an email, extracting JSON from
          a known schema → local 7B is often enough. Hard multi-step reasoning, vision, or
          customer-facing polish → cloud. Implement this as an if-statement on task type, not
          as a personality quiz.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 't', header: 'Task', cell: (i) => i.t },
            { id: 'r', header: 'First try', cell: (i) => i.r },
          ]}
          items={[
            { t: 'Label a ticket urgent / not', r: 'Local' },
            { t: 'Rewrite notes into bullets', r: 'Local' },
            { t: 'Legal-grade contract risk', r: 'Cloud + human review' },
            { t: 'Screenshot / invoice vision', r: 'Cloud vision model' },
          ]}
        />
        <ChoiceExercise
          question="A smart default for private HR notes is…?"
          options={['Always the biggest cloud model', 'Local first if quality is enough', 'Paste into a public chatbot']}
          answer="Local first if quality is enough"
        />
      </SpaceBetween>
    )
  }

  return (
    <SpaceBetween size="m">
      <StudentNote title="Write the decision down">
        For each product surface, record: data sensitivity, quality bar, expected tokens /
        day, and whether a 16 GB laptop is in the loop. Then pick local, cloud, or both
        (router). Change the row when the facts change. not when a blog post is exciting.
      </StudentNote>
      <Box variant="p">
        Same <code>chat()</code> wrapper, different base URL, is the engineering habit. The
        product habit is knowing which of the four cloud pains you are buying your way out of.
      </Box>
      <CourseLink>
        M02 notebooks are local-only (Ollama cannot run in Colab). Pull a 7B Q4 if you have
        16 GB RAM; use tiny models on 8 GB.
      </CourseLink>
    </SpaceBetween>
  )
}
