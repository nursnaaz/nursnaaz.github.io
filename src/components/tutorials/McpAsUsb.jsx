import SpaceBetween from '@cloudscape-design/components/space-between'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import Table from '@cloudscape-design/components/table'
import { LabShell } from '../lab/LabShell'
import { calloutBox } from '../lab/labTheme'
import { Insight, Warn, ChoiceExercise, CourseLink } from '../lab/LabWidgets'
import { StudentNote } from '../interactive/StudentNote'

const TITLES = [
  'One protocol instead of a drawer of cables',
  'Your 7-step roadmap',
  'Host, Client, Server',
  'Tools, resources, prompts',
  'What you write in FastMCP',
  'Transports in one sentence',
  'Why the class cares',
]

export function McpAsUsb({ onStepChange }) {
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
        <StudentNote title="Dear Student: The USB story (once)">
          Before USB, printers, cameras, and phones each needed a special cable. MCP is the
          same idea for model tools: one protocol so Claude Desktop, Cursor, or your own
          agent can plug into the <em>same</em> server.<br /><br />
          CrewAI and LangGraph can both call functions. MCP is how those functions get
          standardised across products so you do not rewrite a CRM lookup for every host.
          We will use the USB analogy on this page only, then speak in Host / Client / Server.
        </StudentNote>
        <ChoiceExercise
          question="MCP’s pitch is…?"
          options={[
            'A new LLM',
            'A standard way to expose tools/resources/prompts to any host',
            'A vector database',
          ]}
          answer="A standard way to expose tools/resources/prompts to any host"
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
              { s: '1', w: 'Why a standard', o: 'Stop rewriting adapters' },
              { s: '2 (this page)', w: 'Roadmap', o: 'The path' },
              { s: '3', w: 'Three roles', o: 'Host / Client / Server' },
              { s: '4', w: 'Three primitives', o: 'Tools, resources, prompts' },
              { s: '5', w: 'FastMCP', o: 'You write the server' },
              { s: '6', w: 'stdio vs SSE', o: 'How the bytes move' },
              { s: '7', w: 'Security pointer', o: 'Same as any tool API' },
            ]}
          />
        </Container>
      </SpaceBetween>
    )
  }

  if (step === 2) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Three seats at the table">
          Do not mix these up in a design review. The human uses a Host. Inside that app, a
          Client speaks JSON-RPC to one or more Servers. You usually write Server code.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'r', header: 'Role', cell: (i) => i.r },
            { id: 'd', header: 'What it is', cell: (i) => i.d },
            { id: 'ex', header: 'Example', cell: (i) => i.ex },
          ]}
          items={[
            { r: 'Host', d: 'The app the human sits in', ex: 'Claude Desktop, Cursor, your Streamlit' },
            { r: 'Client', d: 'The MCP speaker inside the host', ex: 'The library that opens the connection' },
            { r: 'Server', d: 'Your process that offers capabilities', ex: 'CRM lookup, files, guarded SQL' },
          ]}
        />
        <ChoiceExercise
          question="You write FastMCP code for…?"
          options={['The Host', 'The Server', 'The GPU driver']}
          answer="The Server"
        />
      </SpaceBetween>
    )
  }

  if (step === 3) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="Three primitives">
          Tools are verbs. Resources are nouns you can read. Prompts are reusable recipes the
          host can offer the user. A gym handbook is a resource (and maybe a search tool), not
          a temperature knob.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'p', header: 'Primitive', cell: (i) => i.p },
            { id: 'job', header: 'Job', cell: (i) => i.job },
            { id: 'ex', header: 'Gym example', cell: (i) => i.ex },
          ]}
          items={[
            { p: 'Tools', job: 'Side-effecting or computed actions', ex: 'create_ticket, get_order' },
            { p: 'Resources', job: 'Readable data at a URI', ex: 'file://policy.md' },
            { p: 'Prompts', job: 'Named templates the host can start', ex: '“Draft a refund reply”' },
          ]}
        />
        <ChoiceExercise
          question="A PDF handbook is best exposed as…?"
          options={[
            'A tool that always hallucinates',
            'A resource (and maybe a search tool)',
            'A temperature setting',
          ]}
          answer="A resource (and maybe a search tool)"
        />
      </SpaceBetween>
    )
  }

  if (step === 4) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="FastMCP is server-side">
          Decorators turn Python functions into tools, resource URIs, and prompt templates.
          The Host never imports your business logic directly. Capability negotiation happens
          at connect time: the client asks what you offer.
        </StudentNote>
        <div style={calloutBox}>
          Docstrings and type hints are the schema. A vague tool description is how models
          call <code>refund()</code> with the wrong order id.
        </div>
        <Insight>
          One server can serve many hosts. That is the point of the standard. we already
          used the cable analogy on step 1.
        </Insight>
      </SpaceBetween>
    )
  }

  if (step === 5) {
    return (
      <SpaceBetween size="m">
        <StudentNote title="How the bytes move">
          Desktop apps often spawn your server over <strong>stdio</strong> (stdin/stdout).
          Notebooks and remote hosts often use <strong>SSE</strong> (or streamable HTTP) so
          the server is a long-lived process. Same primitives, different pipe.
        </StudentNote>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 't', header: 'Transport', cell: (i) => i.t },
            { id: 'when', header: 'Typical when', cell: (i) => i.when },
          ]}
          items={[
            { t: 'stdio', when: 'Claude Desktop / Cursor launching a local process' },
            { t: 'SSE / HTTP', when: 'A server you already started; notebooks via subprocess' },
          ]}
        />
      </SpaceBetween>
    )
  }

  return (
    <SpaceBetween size="m">
      <StudentNote title="Same security as any tool API">
        A server that can read files or run SQL is a privilege boundary. Path traversal,
        injection, and leaked API keys are M10 production topics. and they apply the moment
        a Host can call your tool.
      </StudentNote>
      <Warn>
        Do not let retrieved documents (or MCP resources from the public web) rewrite the
        system prompt. That is the next lab if you came from RAG.
      </Warn>
      <CourseLink>
        M10 builds a File Manager server and a business MCP server. This page is only the
        vocabulary: Host / Client / Server and tools / resources / prompts.
      </CourseLink>
    </SpaceBetween>
  )
}
