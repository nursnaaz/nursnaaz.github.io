import { useState, useEffect } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Container from '@cloudscape-design/components/container'
import Box from '@cloudscape-design/components/box'
import Button from '@cloudscape-design/components/button'
import Alert from '@cloudscape-design/components/alert'
import Table from '@cloudscape-design/components/table'
import Header from '@cloudscape-design/components/header'
import { StepContainer } from '../interactive/StepContainer'
import { StudentNote } from '../interactive/StudentNote'
import { TryYourself } from '../interactive/TryYourself'
import { InteractiveInput } from '../interactive/InterativeInput'


export function SelfAttentionTutorialComplete({ onStepChange }) {
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = 9


  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep, totalSteps)
    }
    if (window.MathJax) {
      window.MathJax.typesetPromise?.()
    }
  }, [currentStep, onStepChange])


  const nextStep = () => setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1))
  const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1))


  const steps = [
    <Step0 key={0} onNext={nextStep} onPrevious={prevStep} />,
    <Step1 key={1} onNext={nextStep} onPrevious={prevStep} />,
    <Step2 key={2} onNext={nextStep} onPrevious={prevStep} />,
    <Step3 key={3} onNext={nextStep} onPrevious={prevStep} />,
    <Step4 key={4} onNext={nextStep} onPrevious={prevStep} />,
    <Step5 key={5} onNext={nextStep} onPrevious={prevStep} />,
    <Step6 key={6} onNext={nextStep} onPrevious={prevStep} />,
    <Step7 key={7} onNext={nextStep} onPrevious={prevStep} />,
    <Step8 key={8} onNext={nextStep} onPrevious={prevStep} />
  ]


  return <SpaceBetween size="l">{steps[currentStep]}</SpaceBetween>
}


// Step 0: Introduction
function Step0({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={1}
      title="Understanding Your Data"
      onNext={onNext}
      onPrevious={onPrevious}
      isFirst={true}
    >
      <SpaceBetween size="m">
        <StudentNote title="Dear Student — What Problem Are We Solving?">
          Read these two sentences:<br/><br/>
          &nbsp;&nbsp;"I bought <strong>apple</strong> to eat."<br/>
          &nbsp;&nbsp;"I bought <strong>Apple</strong> stock to sell."<br/><br/>
          The word "apple" is spelled identically, but means something completely different.
          A simple dictionary look-up would give it the same representation in both sentences.
          <strong>That's the problem self-attention solves.</strong><br/><br/>
          Self-attention lets each word look at every other word in the sentence and ask:
          "Given my neighbours, which meaning should I carry right now?"<br/><br/>
          In this tutorial we'll compute self-attention <strong>by hand, number by number</strong>,
          so you understand exactly what happens inside a transformer.
        </StudentNote>

        <Container header={<Header variant="h3">🗺️ Your 9-Step Roadmap</Header>}>
          <Table
            columnDefinitions={[
              { id: 'step', header: 'Step', cell: item => item.step },
              { id: 'name', header: 'What We Do', cell: item => item.name },
              { id: 'output', header: 'Output', cell: item => item.output },
            ]}
            items={[
              { step: '1 (this page)', name: 'Set up data — embeddings & weight matrices', output: 'X, W_Q, W_K, W_V' },
              { step: '2', name: 'Learn matrix multiplication rule', output: 'The formula for embedding × matrix' },
              { step: '3', name: 'Compute Q vectors (Queries)', output: 'What each word is searching for' },
              { step: '4', name: 'Compute K vectors (Keys)', output: 'What each word advertises about itself' },
              { step: '5', name: 'Compute V vectors (Values)', output: 'What each word actually contributes' },
              { step: '6', name: 'Dot product Q · K → raw attention scores', output: '5×5 score matrix' },
              { step: '7', name: 'Scale scores by √d_k', output: '5×5 scaled matrix' },
              { step: '8', name: 'Softmax → attention weights', output: '5×5 probability matrix (rows sum to 1)' },
              { step: '9', name: 'Weighted sum of V vectors → new embedding', output: "Apple's new context-aware 4D vector" },
            ]}
            variant="embedded"
          />
        </Container>

        <Container header={<Header variant="h3">🔑 The Core Intuition: Library Search Analogy</Header>}>
          <SpaceBetween size="s">
            <Box variant="p">
              Before we touch any numbers, here is the intuition you should hold in your head throughout all 9 steps:
            </Box>
            <div style={{ background: '#e8f0fe', padding: '20px', borderRadius: '8px', border: '1px solid #4a90d9' }}>
              <strong>Imagine a library.</strong><br/><br/>
              • You walk in with a <strong>search query</strong> — what you're looking for.<br/>
              • Every book on the shelf has an <strong>index tag (key)</strong> — what it's about.<br/>
              • Every book also has <strong>actual content (value)</strong> — what it says inside.<br/><br/>
              You compare your query against every book's index tag to get a relevance score.
              Then you read each book proportionally to how relevant it is.<br/><br/>
              In self-attention:<br/>
              &nbsp;&nbsp;<strong>Query (Q)</strong> = what "apple" is searching for in this sentence<br/>
              &nbsp;&nbsp;<strong>Key (K)</strong> = the index tag each word broadcasts about itself<br/>
              &nbsp;&nbsp;<strong>Value (V)</strong> = the actual information each word contributes<br/>
            </div>
          </SpaceBetween>
        </Container>

        <Container>
          <Box fontSize="heading-xl" textAlign="center" padding="l"
               style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', borderRadius: '8px' }}>
            "I bought apple to eat"
          </Box>
        </Container>

        <StudentNote>
          <strong>Your focus word:</strong> We'll track <span style={{background: '#ffebee', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold'}}>"apple"</span> (position 3) throughout all 9 steps.
          By the end, you'll see exactly how "apple" absorbs context from "eat" and "bought" to understand it's a fruit.
        </StudentNote>

        <Box variant="h3">Word Embeddings (4-dimensional vectors)</Box>
        <StudentNote title="What Is a Word Embedding?">
          A computer can't process the word "apple" directly — it needs numbers.
          A word embedding converts each word into a list of numbers (a vector).<br/><br/>
          In real transformers these vectors have 512 or 768 dimensions, learned during training.
          We use <strong>4 dimensions</strong> here so you can follow every calculation by hand.<br/><br/>
          Think of each dimension as a dial measuring some abstract feature of the word.
          The exact meaning of each dimension isn't human-readable — the model learns what to
          encode. What matters is that similar words end up with similar vectors.
        </StudentNote>


        <Table
          columnDefinitions={[
            { id: 'position', header: 'Position', cell: item => item.position },
            { id: 'word', header: 'Word', cell: item => item.word },
            { id: 'embedding', header: 'Embedding Vector [e₁, e₂, e₃, e₄]', cell: item => item.embedding }
          ]}
          items={[
            { position: 1, word: 'I', embedding: '[1.0, 0.2, 0.5, 0.3]' },
            { position: 2, word: 'bought', embedding: '[0.8, 1.0, 0.3, 0.6]' },
            { position: 3, word: '🍎 apple', embedding: '[0.6, 0.4, 1.0, 0.2] ← YOUR FOCUS WORD' },
            { position: 4, word: 'to', embedding: '[0.3, 0.7, 0.2, 0.8]' },
            { position: 5, word: 'eat', embedding: '[0.9, 0.6, 0.4, 1.0]' }
          ]}
          variant="embedded"
        />


        <Box variant="h3">Weight Matrices (4×4 each)</Box>
        <StudentNote title="What Are Weight Matrices?">
          We need three different "lenses" to look at each word — one for querying (W_Q),
          one for advertising (W_K), and one for content (W_V).<br/><br/>
          Each matrix transforms a word's raw embedding into a specialised vector for that role.
          The same word produces a different Q, K, and V — because each role asks a different question.<br/><br/>
          <strong>Important:</strong> In a real transformer, these matrices are <em>learned during training</em>
          on billions of sentences. The model adjusts W_Q, W_K, W_V until the attention mechanism
          correctly understands context. Here we use fixed numbers so you can verify every step by hand.
          Hover over any cell in the matrices below to highlight it.
        </StudentNote>


        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <MatrixDisplay 
            title="W_Q (Query Matrix)" 
            subtitle="Transforms words into 'search queries'"
            values={[
              [0.5, 0.3, 0.1, 0.2],
              [0.2, 0.8, 0.4, 0.1],
              [0.7, 0.1, 0.6, 0.3],
              [0.4, 0.6, 0.2, 0.8]
            ]}
          />
          <MatrixDisplay 
            title="W_K (Key Matrix)" 
            subtitle="Transforms words into 'information advertisements'"
            values={[
              [0.6, 0.4, 0.2, 0.3],
              [0.3, 0.9, 0.1, 0.5],
              [0.8, 0.2, 0.7, 0.4],
              [0.1, 0.7, 0.3, 0.9]
            ]}
          />
          <MatrixDisplay 
            title="W_V (Value Matrix)" 
            subtitle="Transforms words into 'information content'"
            values={[
              [0.9, 0.1, 0.3, 0.4],
              [0.4, 0.6, 0.2, 0.7],
              [0.2, 0.8, 0.5, 0.1],
              [0.7, 0.3, 0.6, 0.8]
            ]}
          />
        </div>
      </SpaceBetween>
    </StepContainer>
  )
}


// Matrix Display Component
function MatrixDisplay({ title, subtitle, values }) {
  return (
    <Container>
      <SpaceBetween size="xs">
        <Box variant="h4" textAlign="center">{title}</Box>
        <Box variant="small" textAlign="center" color="text-body-secondary">{subtitle}</Box>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 60px)', 
          gap: '4px',
          justifyContent: 'center',
          padding: '10px'
        }}>
          {values.flat().map((val, idx) => (
            <div key={idx} style={{
              background: 'white',
              padding: '8px',
              border: '1px solid #d5dbdb',
              borderRadius: '4px',
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#667eea'
              e.target.style.color = 'white'
              e.target.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white'
              e.target.style.color = 'inherit'
              e.target.style.transform = 'scale(1)'
            }}>
              {val}
            </div>
          ))}
        </div>
      </SpaceBetween>
    </Container>
  )
}


// Step 1: Matrix Multiplication Rules
function Step1({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={2}
      title="Matrix Multiplication Rules"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">

        <StudentNote title="Why Do We Need Matrix Multiplication?">
          We can't use raw embeddings as Queries, Keys, and Values directly.
          The model needs to <em>transform</em> each embedding into a role-specific representation.
          Matrix multiplication is how that transformation happens.<br/><br/>
          Think of it like this: the same person (embedding) might be a "customer" (Query) when
          searching for help, but a "resource" (Key/Value) when helping someone else.
          The weight matrix is the role-transformation rule.
        </StudentNote>

        <Container>
          <Box variant="h3">How to multiply a 4D vector with a 4×4 matrix:</Box>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.8'
          }}>
            If embedding = [e₁, e₂, e₃, e₄] and Weight = 4×4 matrix<br/><br/>
            <strong>To get Result[0]: use COLUMN 0 of the matrix</strong><br/>
            Result[0] = e₁×W[0,0] + e₂×W[1,0] + e₃×W[2,0] + e₄×W[3,0]<br/><br/>
            <strong>To get Result[1]: use COLUMN 1 of the matrix</strong><br/>
            Result[1] = e₁×W[0,1] + e₂×W[1,1] + e₃×W[2,1] + e₄×W[3,1]<br/><br/>
            <strong>To get Result[2]: use COLUMN 2 of the matrix</strong><br/>
            Result[2] = e₁×W[0,2] + e₂×W[1,2] + e₃×W[2,2] + e₄×W[3,2]<br/><br/>
            <strong>To get Result[3]: use COLUMN 3 of the matrix</strong><br/>
            Result[3] = e₁×W[0,3] + e₂×W[1,3] + e₃×W[2,3] + e₄×W[3,3]
          </div>
        </Container>

        <Container header={<Header variant="h3">📌 Key Pattern to Remember</Header>}>
          <div style={{ background: '#fff8e1', padding: '16px', borderRadius: '8px', border: '1px solid #f9a825' }}>
            Each output component = <strong>dot product of the embedding with one COLUMN of the weight matrix</strong>.<br/><br/>
            W_Q has 4 columns → you get 4 output components → a 4D Query vector.<br/>
            Same rule applies for W_K (→ Key vector) and W_V (→ Value vector).<br/><br/>
            <strong>The same embedding, three different matrices → three different vectors (Q, K, V).</strong><br/>
            That's why one word can play three different roles simultaneously.
          </div>
        </Container>

        <TryYourself>
          <Box variant="h4">Try It Yourself — Apple's Q[0]</Box>
          <Box variant="p">Apple embedding: [0.6, 0.4, 1.0, 0.2] &nbsp;|&nbsp; W_Q column 0: [0.5, 0.2, 0.7, 0.4]</Box>
          <Box variant="p">Q[0] = 0.6×0.5 + 0.4×0.2 + 1.0×0.7 + 0.2×0.4 = ?</Box>

          <InteractiveInput
            label="Your answer:"
            correctAnswer={1.160}
            hint="0.6×0.5=0.300, 0.4×0.2=0.080, 1.0×0.7=0.700, 0.2×0.4=0.080 → sum = 1.160"
            tolerance={0.01}
          />
        </TryYourself>

        <StudentNote>
          <strong>Pattern check:</strong><br/>
          • Result[0] uses column 0 of W_Q: values [0.5, 0.2, 0.7, 0.4] (read top to bottom)<br/>
          • Result[1] uses column 1 of W_Q: values [0.3, 0.8, 0.1, 0.6]<br/>
          • Result[2] uses column 2 of W_Q: values [0.1, 0.4, 0.6, 0.2]<br/>
          • Result[3] uses column 3 of W_Q: values [0.2, 0.1, 0.3, 0.8]<br/><br/>
          In the next step we'll compute all 4 components of apple's Q vector.
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 2: Calculate Q Vectors
function Step2({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={3}
      title="Calculate Q Vectors (Query)"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote title="What Is a Query Vector?">
          A Query vector is what a word uses to "search" the sentence for relevant context.<br/><br/>
          We compute it by multiplying the word's raw embedding by W_Q.<br/>
          This transforms the embedding from "what I mean in isolation" into "what I'm looking for."<br/><br/>
          For apple: its Query vector asks — <em>"Which words in this sentence will help me know
          whether I'm a fruit or a company?"</em><br/><br/>
          Every word gets its own Q vector. We compute all 5 now.
        </StudentNote>

        <Container header={<Header variant="h3">🍎 Apple's Q Vector Calculation (Full Worked Example)</Header>}>
          <div style={{ 
            background: '#ffebee', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #e74c3c'
          }}>
            <Box variant="p" fontWeight="bold">Apple embedding [0.6, 0.4, 1.0, 0.2] × W_Q:</Box>
            <div style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '2', marginTop: '10px' }}>
              Q[0] = 0.6×0.5 + 0.4×0.2 + 1.0×0.7 + 0.2×0.4 = 0.3 + 0.08 + 0.7 + 0.08 = <strong>1.160</strong><br/>
              Q[1] = 0.6×0.3 + 0.4×0.8 + 1.0×0.1 + 0.2×0.6 = 0.18 + 0.32 + 0.1 + 0.12 = <strong>0.720</strong><br/>
              Q[2] = 0.6×0.1 + 0.4×0.4 + 1.0×0.6 + 0.2×0.2 = 0.06 + 0.16 + 0.6 + 0.04 = <strong>0.860</strong><br/>
              Q[3] = 0.6×0.2 + 0.4×0.1 + 1.0×0.3 + 0.2×0.8 = 0.12 + 0.04 + 0.3 + 0.16 = <strong>0.620</strong>
            </div>
            <Box variant="h4" marginTop="l" textAlign="center">
              Apple's Query: [1.160, 0.720, 0.860, 0.620]
            </Box>
          </div>
        </Container>


        <Container header={<Header variant="h3">✅ All Q Vectors Complete</Header>}>
          <Table
            columnDefinitions={[
              { id: 'word', header: 'Word', cell: item => item.word },
              { id: 'qvector', header: 'Q Vector (4D)', cell: item => item.qvector },
              { id: 'meaning', header: 'Meaning', cell: item => item.meaning }
            ]}
            items={[
              { word: 'I', qvector: '[1.010, 0.690, 0.540, 0.610]', meaning: '"Who am I acting upon?"' },
              { word: 'bought', qvector: '[1.050, 1.430, 0.780, 0.830]', meaning: '"What was purchased?"' },
              { word: '🍎 apple', qvector: '[1.160, 0.720, 0.860, 0.620]', meaning: '"What context defines me?"' },
              { word: 'to', qvector: '[0.750, 1.150, 0.590, 0.830]', meaning: '"What\'s my purpose?"' },
              { word: 'eat', qvector: '[1.250, 1.390, 0.770, 1.160]', meaning: '"What am I the action for?"' }
            ]}
            variant="embedded"
          />
        </Container>
      </SpaceBetween>
    </StepContainer>
  )
}


// Continue with remaining steps...
// Due to length, I'll create the remaining steps in a follow-up


export default SelfAttentionTutorialComplete


// Step 3: Calculate K Vectors
function Step3({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={4}
      title="Calculate K Vectors (Keys)"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote title="What Is a Key Vector?">
          A Key vector is what a word <em>broadcasts</em> to other words — "here's what I'm about."<br/><br/>
          We compute it by multiplying the embedding by W_K.<br/>
          Q and K are produced from the same raw embedding but through different matrices,
          so they serve different roles:<br/><br/>
          &nbsp;&nbsp;<strong>Q</strong> = the question apple is asking<br/>
          &nbsp;&nbsp;<strong>K</strong> = the answer tag that "eat", "bought", etc. hang on themselves<br/><br/>
          When we later compute Q · K (dot product), we're measuring:
          <em>"How well does apple's question match this word's self-description?"</em>
        </StudentNote>

        <Container header={<Header variant="h3">🍎 Apple's K Vector — Full Worked Calculation</Header>}>
          <div style={{
            background: '#ffebee', padding: '20px', borderRadius: '8px',
            border: '2px solid #e74c3c', fontFamily: 'monospace', fontSize: '14px', lineHeight: '2'
          }}>
            <Box variant="p" fontWeight="bold">Apple embedding [0.6, 0.4, 1.0, 0.2] × W_K:</Box>
            K[0] = 0.6×0.6 + 0.4×0.3 + 1.0×0.8 + 0.2×0.1 = 0.360 + 0.120 + 0.800 + 0.020 = <strong>1.300</strong><br/>
            K[1] = 0.6×0.4 + 0.4×0.9 + 1.0×0.2 + 0.2×0.7 = 0.240 + 0.360 + 0.200 + 0.140 = <strong>0.940</strong><br/>
            K[2] = 0.6×0.2 + 0.4×0.1 + 1.0×0.7 + 0.2×0.3 = 0.120 + 0.040 + 0.700 + 0.060 = <strong>0.920</strong><br/>
            K[3] = 0.6×0.3 + 0.4×0.5 + 1.0×0.4 + 0.2×0.9 = 0.180 + 0.200 + 0.400 + 0.180 = <strong>0.960</strong>
            <Box variant="h4" marginTop="l" textAlign="center">Apple's Key: [1.300, 0.940, 0.920, 0.960]</Box>
          </div>
        </Container>

        <TryYourself>
          <Box variant="h4">Your Turn: Verify Apple's K[1]</Box>
          <Box variant="p">Apple embedding [0.6, 0.4, 1.0, 0.2] × W_K column 1: [0.4, 0.9, 0.2, 0.7]</Box>
          <Box variant="p">K[1] = 0.6×0.4 + 0.4×0.9 + 1.0×0.2 + 0.2×0.7 = ?</Box>

          <InteractiveInput
            label="Calculate K[1]:"
            correctAnswer={0.940}
            hint="0.240 + 0.360 + 0.200 + 0.140 = 0.940"
            tolerance={0.01}
          />
        </TryYourself>

        <Container header={<Header variant="h3">✅ All K Vectors Complete</Header>}>
          <Table
            columnDefinitions={[
              { id: 'word', header: 'Word', cell: item => item.word },
              { id: 'kvector', header: 'K Vector (4D)', cell: item => item.kvector },
              { id: 'advertisement', header: 'Advertisement', cell: item => item.advertisement }
            ]}
            items={[
              { word: 'I', kvector: '[1.090, 0.890, 0.660, 0.870]', advertisement: '"I provide agent context!"' },
              { word: 'bought', kvector: '[1.080, 1.700, 0.650, 1.400]', advertisement: '"I provide action context!"' },
              { word: '🍎 apple', kvector: '[1.300, 0.940, 0.920, 0.960]', advertisement: '"I provide object context!"' },
              { word: 'to', kvector: '[0.630, 1.350, 0.510, 1.240]', advertisement: '"I provide purpose context!"' },
              { word: 'eat', kvector: '[1.140, 1.680, 0.820, 1.630]', advertisement: '"I provide FOOD context!"' }
            ]}
            variant="embedded"
          />
        </Container>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 4: Calculate V Vectors
function Step4({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={5}
      title="Calculate V Vectors (Values)"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote title="What Is a Value Vector? How Is It Different from Q and K?">
          Think of Q and K as the <em>matchmaking</em> system — they decide who talks to whom.<br/>
          V is the <em>actual message</em> that gets passed once a connection is made.<br/><br/>
          <strong>Q and K are used only to compute attention weights (Steps 6–8).</strong><br/>
          <strong>V is used only in the final weighted sum (Step 9).</strong><br/><br/>
          Why separate them? Because how relevant a word is (Q·K similarity) and what
          information it should share (V) are two different things. A word could be highly
          relevant to a query but only need to contribute a small slice of its information.
          W_V controls exactly what gets passed.
        </StudentNote>

        <Container header={<Header variant="h3">🍎 Apple's V Vector — Full Worked Calculation</Header>}>
          <div style={{
            background: '#ffebee', padding: '20px', borderRadius: '8px',
            border: '2px solid #e74c3c', fontFamily: 'monospace', fontSize: '14px', lineHeight: '2'
          }}>
            <Box variant="p" fontWeight="bold">Apple embedding [0.6, 0.4, 1.0, 0.2] × W_V:</Box>
            V[0] = 0.6×0.9 + 0.4×0.4 + 1.0×0.2 + 0.2×0.7 = 0.540 + 0.160 + 0.200 + 0.140 = <strong>1.040</strong><br/>
            V[1] = 0.6×0.1 + 0.4×0.6 + 1.0×0.8 + 0.2×0.3 = 0.060 + 0.240 + 0.800 + 0.060 = <strong>1.160</strong><br/>
            V[2] = 0.6×0.3 + 0.4×0.2 + 1.0×0.5 + 0.2×0.6 = 0.180 + 0.080 + 0.500 + 0.120 = <strong>0.880</strong><br/>
            V[3] = 0.6×0.4 + 0.4×0.7 + 1.0×0.1 + 0.2×0.8 = 0.240 + 0.280 + 0.100 + 0.160 = <strong>0.780</strong>
            <Box variant="h4" marginTop="l" textAlign="center">Apple's Value: [1.040, 1.160, 0.880, 0.780]</Box>
          </div>
        </Container>

        <TryYourself>
          <Box variant="h4">Your Turn: Verify Apple's V[2]</Box>
          <Box variant="p">Apple embedding [0.6, 0.4, 1.0, 0.2] × W_V column 2: [0.3, 0.2, 0.5, 0.6]</Box>
          <Box variant="p">V[2] = 0.6×0.3 + 0.4×0.2 + 1.0×0.5 + 0.2×0.6 = ?</Box>

          <InteractiveInput
            label="Calculate V[2]:"
            correctAnswer={0.880}
            hint="0.180 + 0.080 + 0.500 + 0.120 = 0.880"
            tolerance={0.01}
          />
        </TryYourself>

        <Container header={<Header variant="h3">✅ All V Vectors Complete</Header>}>
          <Table
            columnDefinitions={[
              { id: 'word', header: 'Word', cell: item => item.word },
              { id: 'vvector', header: 'V Vector (4D)', cell: item => item.vvector },
              { id: 'content', header: 'Information Content', cell: item => item.content }
            ]}
            items={[
              { word: 'I', vvector: '[1.290, 0.710, 0.770, 0.830]', content: 'Agent information' },
              { word: 'bought', vvector: '[1.600, 1.100, 0.950, 1.530]', content: 'Purchase information' },
              { word: '🍎 apple', vvector: '[1.040, 1.160, 0.880, 0.780]', content: 'Object information' },
              { word: 'to', vvector: '[1.150, 0.850, 0.810, 1.270]', content: 'Purpose information' },
              { word: 'eat', vvector: '[1.830, 1.070, 1.190, 1.620]', content: 'CONSUMPTION information' }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="Key Insight">
          Notice how "eat" has the highest values in its V vector - it carries the most important 
          information about the sentence context (consumption/food).
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 5: Calculate Attention Scores
function Step5({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={6}
      title="Calculate Attention Scores"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote title="What Are Attention Scores?">
          We now compute a score for every (query word, key word) pair — 5 words × 5 words = 25 scores.<br/><br/>
          The score answers: <em>"How relevant is word B to word A's query?"</em><br/>
          A high score means A should pay a lot of attention to B.
          A low score means B is not very relevant to A's current search.
        </StudentNote>

        <Container>
          <Box variant="h4">Dot Product Formula (4D) — and Why It Measures Similarity:</Box>
          <div style={{
            background: '#e8f5e8',
            padding: '15px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            textAlign: 'center',
            fontSize: '16px'
          }}>
            Q·K = Q[0]×K[0] + Q[1]×K[1] + Q[2]×K[2] + Q[3]×K[3]
          </div>
          <div style={{ marginTop: '12px', padding: '12px', background: '#fff8e1', borderRadius: '8px' }}>
            <strong>Why does a high dot product mean "more similar"?</strong><br/>
            If Q and K point in the same direction — their corresponding components are both large
            together — the products Q[i]×K[i] are all large, so the sum is large.<br/>
            If they point in opposite directions, some products cancel out, giving a small or
            negative sum. The dot product is therefore a natural measure of "alignment."
          </div>
        </Container>


        <StudentNote title="Reminder - All Q and K Vectors">
          <div style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.8' }}>
            <strong>Q Vectors:</strong><br/>
            • I: [1.010, 0.690, 0.540, 0.610]<br/>
            • bought: [1.050, 1.430, 0.780, 0.830]<br/>
            • apple: [1.160, 0.720, 0.860, 0.620]<br/>
            • to: [0.750, 1.150, 0.590, 0.830]<br/>
            • eat: [1.250, 1.390, 0.770, 1.160]<br/><br/>

            <strong>K Vectors:</strong><br/>
            • I: [1.090, 0.890, 0.660, 0.870]<br/>
            • bought: [1.080, 1.700, 0.650, 1.400]<br/>
            • apple: [1.300, 0.940, 0.920, 0.960]<br/>
            • to: [0.630, 1.350, 0.510, 1.240]<br/>
            • eat: [1.140, 1.680, 0.820, 1.630]
          </div>
        </StudentNote>


        <Container header={<Header variant="h3">🍎 Apple's Detailed Attention Calculations</Header>}>
          <div style={{ 
            background: '#ffebee', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '2'
          }}>
            <strong>Apple Query: [1.160, 0.720, 0.860, 0.620]</strong><br/><br/>
            
            <strong>Apple → eat:</strong><br/>
            [1.160, 0.720, 0.860, 0.620] · [1.140, 1.680, 0.820, 1.630]<br/>
            = 1.160×1.140 + 0.720×1.680 + 0.860×0.820 + 0.620×1.630<br/>
            = 1.322 + 1.210 + 0.705 + 1.011 = <strong style={{fontSize: '16px', color: '#27ae60'}}>4.248 ⭐ HIGHEST!</strong><br/><br/>

            <strong>Apple → bought:</strong><br/>
            = 1.160×1.080 + 0.720×1.700 + 0.860×0.650 + 0.620×1.400<br/>
            = 1.253 + 1.224 + 0.559 + 0.868 = <strong>3.904</strong><br/><br/>

            <strong>Apple → apple (self):</strong><br/>
            = 1.160×1.300 + 0.720×0.940 + 0.860×0.920 + 0.620×0.960<br/>
            = 1.508 + 0.677 + 0.791 + 0.595 = <strong>3.571</strong><br/><br/>

            <strong>Apple → I:</strong><br/>
            = 1.160×1.090 + 0.720×0.890 + 0.860×0.660 + 0.620×0.870<br/>
            = 1.264 + 0.641 + 0.568 + 0.539 = <strong>3.012</strong><br/><br/>

            <strong>Apple → to:</strong><br/>
            = 1.160×0.630 + 0.720×1.350 + 0.860×0.510 + 0.620×1.240<br/>
            = 0.731 + 0.972 + 0.439 + 0.769 = <strong>2.910</strong>
          </div>
        </Container>


        <TryYourself>
          <Box variant="h4">🎯 Verify a Calculation: "I" → "bought"</Box>
          <Box variant="p">I_query · bought_key = [1.010, 0.690, 0.540, 0.610] · [1.080, 1.700, 0.650, 1.400]</Box>
          <Box variant="p">= 1.010×1.080 + 0.690×1.700 + 0.540×0.650 + 0.610×1.400 = ?</Box>

          <InteractiveInput
            label="Your answer:"
            correctAnswer={3.469}
            hint="1.091 + 1.173 + 0.351 + 0.854 = 3.469"
            tolerance={0.01}
          />
        </TryYourself>


        <Container header={<Header variant="h3">📊 Complete 5×5 Raw Attention Scores Matrix</Header>}>
          <StudentNote>
            Each cell shows the dot product between the row word's Query vector and the column word's Key vector. 
            Apple's row is highlighted in red!
          </StudentNote>
          <Table
            columnDefinitions={[
              { id: 'word', header: 'Query → / Key ↓', cell: item => item.word, width: 100 },
              { id: 'i', header: 'I', cell: item => item.i },
              { id: 'bought', header: 'bought', cell: item => item.bought },
              { id: 'apple', header: 'apple', cell: item => item.apple },
              { id: 'to', header: 'to', cell: item => item.to },
              { id: 'eat', header: 'eat', cell: item => item.eat }
            ]}
            items={[
              { word: 'I', i: '2.602', bought: '3.469', apple: '3.044', to: '2.600', eat: '3.748 ⭐' },
              { word: 'bought', i: '3.654', bought: '5.234', apple: '4.224', to: '4.019', eat: '5.592 ⭐' },
              { word: '🍎 apple', i: '3.012', bought: '3.904', apple: '3.571', to: '2.910', eat: '4.248 ⭐' },
              { word: 'to', i: '2.953', bought: '4.311', apple: '3.396', to: '3.355', eat: '4.624 ⭐' },
              { word: 'eat', i: '4.117', bought: '5.838', apple: '4.754', to: '4.495', eat: '6.282 ⭐' }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="Key Observations">
          • Every word attends most strongly to "eat" (see the green ⭐ in the last column)<br/>
          • This makes sense — "eat" is the most semantically decisive word in the sentence<br/>
          • "eat" also has the highest self-attention (6.282), showing it's very certain of its own meaning<br/>
          • Apple's second-highest score is with "bought" (3.904), connecting the purchase action to the object<br/><br/>
          <strong>🔲 About the diagonal (self-attention scores):</strong><br/>
          The diagonal of the matrix — I→I (2.602), bought→bought (5.234), apple→apple (3.571), etc. —
          represents each word attending to <em>itself</em>. This is allowed and important:
          it ensures the word retains some of its own original meaning in the final output,
          not just borrowed meaning from neighbours. Notice apple's self-score (3.571) is in the middle —
          it keeps part of its identity while blending in context from other words.
        </StudentNote>


        <Alert type="success" header="🔍 What This Means">
          Apple's highest attention score is with "eat" (4.248). This strongly suggests that
          "apple" is being understood in the context of food/consumption - it's the fruit, not the company!
        </Alert>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 6: Scale by √d_k
function Step6({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={7}
      title="Scale by √d_k"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote title="Why Do We Need to Scale?">
          Dot products grow with the number of dimensions. With 4D vectors the scores are
          moderate, but in real transformers with 64 or 512 dimensions the dot products
          can become very large (e.g. 50–200).<br/><br/>
          When you feed very large numbers into softmax, the exponential function
          makes one score <em>enormously</em> larger than the others. The softmax output
          collapses to one weight near 1.0 and all others near 0.0 — a near-hard choice.
          This causes gradients to vanish during training and the model stops learning.<br/><br/>
          Dividing by √d_k keeps the scores in a range where softmax produces
          smooth, spread-out probabilities — better for learning.
        </StudentNote>

        <Container>
          <Box variant="h4">Scaling Formula:</Box>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px',
            fontFamily: 'monospace',
            textAlign: 'center'
          }}>
            d_k = dimension of key vectors = 4<br/>
            Scale Factor = √d_k = √4 = 2<br/>
            Scaled Score = Raw Score ÷ 2
          </div>
        </Container>


        <Container header={<Header variant="h3">🍎 Apple's Complete Scaled Scores</Header>}>
          <div style={{ 
            background: '#ffebee', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace'
          }}>
            <strong>Apple's raw scores → scaled scores:</strong><br/>
            Apple → I: 3.012 ÷ 2 = <strong>1.506</strong><br/>
            Apple → bought: 3.904 ÷ 2 = <strong>1.952</strong><br/>
            Apple → apple: 3.571 ÷ 2 = <strong>1.786</strong><br/>
            Apple → to: 2.910 ÷ 2 = <strong>1.455</strong><br/>
            Apple → eat: 4.248 ÷ 2 = <strong style={{color: '#27ae60'}}>2.124 ⭐ Still highest!</strong>
          </div>
        </Container>


        <TryYourself>
          <Box variant="h4">🎯 Practice Scaling</Box>
          <Box variant="p">Scale "bought" → "bought": 5.234 ÷ 2 = ?</Box>

          <InteractiveInput
            label="Scaled score:"
            correctAnswer={2.617}
            hint="Simply divide by 2: 5.234 ÷ 2 = 2.617"
            tolerance={0.01}
          />
        </TryYourself>


        <Container header={<Header variant="h3">📊 Complete 5×5 Scaled Scores Matrix</Header>}>
          <StudentNote>
            All raw attention scores divided by √4 = 2. Notice how all values are now smaller and more manageable. 
            Apple's row is highlighted in red!
          </StudentNote>
          <Table
            columnDefinitions={[
              { id: 'word', header: 'Query → / Key ↓', cell: item => item.word, width: 100 },
              { id: 'i', header: 'I', cell: item => item.i },
              { id: 'bought', header: 'bought', cell: item => item.bought },
              { id: 'apple', header: 'apple', cell: item => item.apple },
              { id: 'to', header: 'to', cell: item => item.to },
              { id: 'eat', header: 'eat', cell: item => item.eat }
            ]}
            items={[
              { word: 'I', i: '1.301', bought: '1.734', apple: '1.522', to: '1.300', eat: '1.874 ⭐' },
              { word: 'bought', i: '1.827', bought: '2.617', apple: '2.112', to: '2.010', eat: '2.796 ⭐' },
              { word: '🍎 apple', i: '1.506', bought: '1.952', apple: '1.786', to: '1.455', eat: '2.124 ⭐' },
              { word: 'to', i: '1.476', bought: '2.155', apple: '1.698', to: '1.678', eat: '2.312 ⭐' },
              { word: 'eat', i: '2.058', bought: '2.919', apple: '2.377', to: '2.248', eat: '3.141 ⭐' }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="Why Scale? — Concrete Comparison">
          • <strong>Before scaling:</strong> Apple's scores = [3.012, 3.904, 3.571, 2.910, 4.248]<br/>
          • <strong>After scaling:</strong> Apple's scores = [1.506, 1.952, 1.786, 1.455, 2.124]<br/><br/>
          <strong>What softmax would do with UNSCALED scores:</strong><br/>
          &nbsp;&nbsp;→ max attention weight = <strong>0.361</strong> (36.1% to "eat") — already quite peaky<br/><br/>
          <strong>What softmax does with SCALED scores:</strong><br/>
          &nbsp;&nbsp;→ max attention weight = <strong>0.277</strong> (27.7% to "eat") — more evenly spread<br/><br/>
          The difference is 8.4 percentage points. In 512-dimensional real transformers the
          difference is far more dramatic — unscaled softmax can produce 99%+ on one word.<br/>
          <strong>Pattern preserved:</strong> The relative ordering is identical — scaling never changes who ranks highest.
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 7: Apply Softmax
function Step7({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={8}
      title="Apply Softmax"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote title="What Is Softmax and Why Use Exponentials?">
          We could normalise scores by simply dividing each by their sum — but we don't.
          Instead we first apply e^ (Euler's number, ≈ 2.718, raised to the power of each score).<br/><br/>
          <strong>Why exponentials?</strong><br/>
          • e^ is always positive — no negative attention weights, ever.<br/>
          • e^ amplifies differences: a score of 2.1 vs 1.5 becomes e^2.1=8.2 vs e^1.5=4.5 —
            the higher score gets proportionally more weight.<br/>
          • e^ is differentiable everywhere — essential for backpropagation during training.<br/><br/>
          The result is a row of numbers that all sit between 0 and 1 and sum to exactly 1.0 —
          a proper probability distribution, like an "attention budget."
        </StudentNote>

        <Container>
          <Box variant="h4">Softmax Formula:</Box>
          <div style={{
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            textAlign: 'center'
          }}>
            weight_i = e^(score_i) / Σ e^(score_j) &nbsp;&nbsp; for all j in the row
          </div>
        </Container>

        <Container>
          <Box variant="h4">Softmax Steps for Each Row:</Box>
          <div style={{
            background: '#e8f5e8',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #27ae60'
          }}>
            <ol style={{ lineHeight: '2', margin: 0 }}>
              <li><strong>Take each scaled score in the row and compute e^(score)</strong></li>
              <li><strong>Add up all 5 exponentials → the row denominator</strong></li>
              <li><strong>Divide each individual exponential by that denominator</strong></li>
              <li><strong>Check: all 5 resulting weights must sum to exactly 1.0</strong></li>
            </ol>
          </div>
        </Container>


        <Container header={<Header variant="h3">🍎 Apple's Complete Softmax Calculation</Header>}>
          <div style={{ 
            background: '#ffebee', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.8'
          }}>
            <strong>Apple's scaled scores: [1.506, 1.952, 1.786, 1.455, 2.124]</strong><br/><br/>

            <strong>Step 1: Calculate exponentials</strong><br/>
            e^1.506 = 4.51<br/>
            e^1.952 = 7.04<br/>
            e^1.786 = 5.97<br/>
            e^1.455 = 4.28<br/>
            e^2.124 = 8.36<br/><br/>

            <strong>Step 2: Sum = 4.51 + 7.04 + 5.97 + 4.28 + 8.36 = 30.16</strong><br/><br/>

            <strong>Step 3: Final attention weights (Apple's attention budget)</strong><br/>
            Apple → I: 4.51 ÷ 30.16 = <strong>0.149</strong> (14.9%)<br/>
            Apple → bought: 7.04 ÷ 30.16 = <strong>0.233</strong> (23.3%)<br/>
            Apple → apple: 5.97 ÷ 30.16 = <strong>0.198</strong> (19.8%)<br/>
            Apple → to: 4.28 ÷ 30.16 = <strong>0.142</strong> (14.2%)<br/>
            Apple → eat: 8.36 ÷ 30.16 = <strong style={{color: '#27ae60', fontSize: '16px'}}>0.277 (27.7%) ⭐ WINNER!</strong><br/><br/>

            <strong>✅ Verification: 0.149 + 0.233 + 0.198 + 0.142 + 0.277 = 1.000</strong>
          </div>
        </Container>


        <TryYourself>
          <Box variant="h4">🎯 Attention Budget Verification</Box>
          <Box variant="p">Check that "bought" row sums to 1.0:</Box>
          <Box variant="p">0.120 + 0.263 + 0.159 + 0.143 + 0.315 = ?</Box>

          <InteractiveInput
            label="Sum:"
            correctAnswer={1.000}
            hint="Add all five weights: 0.120 + 0.263 + 0.159 + 0.143 + 0.315 = 1.000"
            tolerance={0.01}
          />
        </TryYourself>


        <Container header={<Header variant="h3">📊 Complete 5×5 Softmax Attention Weights Matrix</Header>}>
          <StudentNote>
            All scaled scores converted to probabilities using softmax. Each row sums to 1.0 (100% attention budget). 
            Apple's row is highlighted in red!
          </StudentNote>
          <Table
            columnDefinitions={[
              { id: 'word', header: 'Query → / Key ↓', cell: item => item.word, width: 100 },
              { id: 'i', header: 'I', cell: item => item.i },
              { id: 'bought', header: 'bought', cell: item => item.bought },
              { id: 'apple', header: 'apple', cell: item => item.apple },
              { id: 'to', header: 'to', cell: item => item.to },
              { id: 'eat', header: 'eat', cell: item => item.eat },
              { id: 'sum', header: 'Row Sum', cell: item => item.sum }
            ]}
            items={[
              { word: 'I', i: '0.152', bought: '0.235', apple: '0.190', to: '0.152', eat: '0.270 ⭐', sum: '1.000' },
              { word: 'bought', i: '0.120', bought: '0.263', apple: '0.159', to: '0.143', eat: '0.315 ⭐', sum: '1.000' },
              { word: '🍎 apple', i: '0.149', bought: '0.233', apple: '0.198', to: '0.142', eat: '0.277 ⭐', sum: '1.000' },
              { word: 'to', i: '0.129', bought: '0.254', apple: '0.161', to: '0.158', eat: '0.298 ⭐', sum: '1.000' },
              { word: 'eat', i: '0.112', bought: '0.266', apple: '0.154', to: '0.136', eat: '0.332 ⭐', sum: '1.000' }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="All Words' Attention Patterns">
          • <strong>"I" pays most attention to "eat" (27.0%)</strong> - The subject focuses on the action<br/>
          • <strong>"bought" pays most attention to "eat" (31.5%)</strong> - The purchase action connects to consumption<br/>
          • <strong>"apple" pays most attention to "eat" (27.7%)</strong> - The object understands it's food<br/>
          • <strong>"to" pays most attention to "eat" (29.8%)</strong> - The preposition links to the purpose<br/>
          • <strong>"eat" pays most attention to itself (33.2%)</strong> - High self-confidence as the key action<br/><br/>
          
          <strong>🎯 Universal Pattern:</strong> Every word in this sentence realizes that "eat" is the most important context!
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 8: Final Contextual Vector
function Step8({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={9}
      title="Final Contextual Vector — Building Apple's New Meaning"
      onNext={onNext}
      onPrevious={onPrevious}
      isLast={true}
    >
      <SpaceBetween size="m">

        {/* ── 1. Big picture analogy ── */}
        <StudentNote title="Dear Student — What's About to Happen">
          We have two ingredients we computed in earlier steps:<br/><br/>
          <strong>Ingredient 1 — Attention weights</strong> (from Step 8, the softmax output):<br/>
          These tell us <em>how much</em> apple should listen to each word.<br/>
          Think of them as "mixing ratios" — like a recipe saying "27.7% eat, 23.3% bought, …"<br/><br/>
          <strong>Ingredient 2 — V vectors</strong> (from Step 5, X × W_V):<br/>
          These are the actual <em>information payload</em> each word carries.<br/>
          Each V vector is a 4D package of meaning for that word.<br/><br/>
          <strong>What we do now:</strong> Multiply each word's attention weight × its V vector,
          then add all 5 results together. The sum is apple's brand-new 4D meaning — one that
          now contains a blend of information from every word in the sentence.
        </StudentNote>

        {/* ── 2. Recap: the two inputs side by side ── */}
        <Container header={<Header variant="h3">📋 Step 1 — Recall Your Two Ingredients</Header>}>
          <SpaceBetween size="s">
            <Box variant="p">
              These values come directly from the two previous steps. Nothing new is being computed here yet — just gathering what you already know.
            </Box>
            <Table
              columnDefinitions={[
                { id: 'word', header: 'Word', cell: item => item.word },
                { id: 'weight', header: 'Attention Weight (from Step 8)', cell: item => item.weight },
                { id: 'pct', header: '% of Apple\'s Budget', cell: item => item.pct },
                { id: 'vvec', header: 'V Vector (from Step 5)', cell: item => item.vvec },
              ]}
              items={[
                { word: 'I',         weight: '0.149', pct: '14.9%', vvec: '[1.290, 0.710, 0.770, 0.830]' },
                { word: 'bought',    weight: '0.233', pct: '23.3%', vvec: '[1.600, 1.100, 0.950, 1.530]' },
                { word: '🍎 apple',  weight: '0.198', pct: '19.8%', vvec: '[1.040, 1.160, 0.880, 0.780]' },
                { word: 'to',        weight: '0.142', pct: '14.2%', vvec: '[1.150, 0.850, 0.810, 1.270]' },
                { word: 'eat ⭐',    weight: '0.277', pct: '27.7%', vvec: '[1.830, 1.070, 1.190, 1.620]' },
              ]}
              variant="embedded"
            />
            <StudentNote>
              Notice: the attention weights sum to exactly 1.0 (0.149 + 0.233 + 0.198 + 0.142 + 0.277 = 1.000).
              They act like percentages — apple is distributing 100% of its "attention budget" across all five words.
            </StudentNote>
          </SpaceBetween>
        </Container>

        {/* ── 3. The formula explained ── */}
        <Container header={<Header variant="h3">📐 Step 2 — The Formula</Header>}>
          <SpaceBetween size="s">
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', fontFamily: 'monospace', textAlign: 'center', fontSize: '15px', lineHeight: '2' }}>
              Apple_output = (w_I × V_I) + (w_bought × V_bought) + (w_apple × V_apple) + (w_to × V_to) + (w_eat × V_eat)
            </div>
            <StudentNote>
              <strong>Why multiply weight × V vector?</strong><br/>
              Multiplying scales the V vector up or down based on how relevant that word is.
              A word with weight 0.277 contributes almost twice as much as a word with weight 0.142.
              It's like mixing paint — more of the "eat" colour goes into the final blend.
            </StudentNote>
          </SpaceBetween>
        </Container>

        {/* ── 4. Word-by-word multiplication ── */}
        <Container header={<Header variant="h3">🔢 Step 3 — Multiply Each Word's Weight × V Vector</Header>}>
          <SpaceBetween size="s">
            <Box variant="p">
              For each word: multiply the attention weight (a single number) by every element of its V vector.
              This gives us 5 separate "contribution vectors" — one per word.
            </Box>

            {/* I */}
            <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px', border: '1px solid #c5cae9', fontFamily: 'monospace', fontSize: '13px', lineHeight: '2' }}>
              <strong>Word "I" — contributes 14.9% of its information:</strong><br/>
              weight = 0.149 &nbsp;|&nbsp; V_I = [1.290, 0.710, 0.770, 0.830]<br/>
              0.149 × 1.290 = <strong>0.193</strong> &nbsp; (component 1)<br/>
              0.149 × 0.710 = <strong>0.106</strong> &nbsp; (component 2)<br/>
              0.149 × 0.770 = <strong>0.115</strong> &nbsp; (component 3)<br/>
              0.149 × 0.830 = <strong>0.124</strong> &nbsp; (component 4)<br/>
              → Contribution from "I": <strong>[0.193, 0.106, 0.115, 0.124]</strong>
            </div>

            {/* bought */}
            <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px', border: '1px solid #c5cae9', fontFamily: 'monospace', fontSize: '13px', lineHeight: '2' }}>
              <strong>Word "bought" — contributes 23.3% of its information:</strong><br/>
              weight = 0.233 &nbsp;|&nbsp; V_bought = [1.600, 1.100, 0.950, 1.530]<br/>
              0.233 × 1.600 = <strong>0.374</strong> &nbsp; (component 1)<br/>
              0.233 × 1.100 = <strong>0.257</strong> &nbsp; (component 2)<br/>
              0.233 × 0.950 = <strong>0.222</strong> &nbsp; (component 3)<br/>
              0.233 × 1.530 = <strong>0.357</strong> &nbsp; (component 4)<br/>
              → Contribution from "bought": <strong>[0.374, 0.257, 0.222, 0.357]</strong>
            </div>

            {/* apple self */}
            <div style={{ background: '#ffebee', padding: '15px', borderRadius: '8px', border: '2px solid #e74c3c', fontFamily: 'monospace', fontSize: '13px', lineHeight: '2' }}>
              <strong>🍎 Word "apple" — contributes 19.8% of its OWN original information (self-attention):</strong><br/>
              weight = 0.198 &nbsp;|&nbsp; V_apple = [1.040, 1.160, 0.880, 0.780]<br/>
              0.198 × 1.040 = <strong>0.206</strong> &nbsp; (component 1)<br/>
              0.198 × 1.160 = <strong>0.229</strong> &nbsp; (component 2)<br/>
              0.198 × 0.880 = <strong>0.174</strong> &nbsp; (component 3)<br/>
              0.198 × 0.780 = <strong>0.154</strong> &nbsp; (component 4)<br/>
              → Contribution from "apple": <strong>[0.206, 0.229, 0.174, 0.154]</strong><br/>
              <em style={{color: '#c0392b'}}>← This is apple reading its own V vector — it keeps some of its original identity.</em>
            </div>

            {/* to */}
            <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px', border: '1px solid #c5cae9', fontFamily: 'monospace', fontSize: '13px', lineHeight: '2' }}>
              <strong>Word "to" — contributes 14.2% of its information:</strong><br/>
              weight = 0.142 &nbsp;|&nbsp; V_to = [1.150, 0.850, 0.810, 1.270]<br/>
              0.142 × 1.150 = <strong>0.163</strong> &nbsp; (component 1)<br/>
              0.142 × 0.850 = <strong>0.121</strong> &nbsp; (component 2)<br/>
              0.142 × 0.810 = <strong>0.115</strong> &nbsp; (component 3)<br/>
              0.142 × 1.270 = <strong>0.180</strong> &nbsp; (component 4)<br/>
              → Contribution from "to": <strong>[0.163, 0.121, 0.115, 0.180]</strong>
            </div>

            {/* eat */}
            <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px', border: '2px solid #27ae60', fontFamily: 'monospace', fontSize: '13px', lineHeight: '2' }}>
              <strong>Word "eat" ⭐ — contributes the MOST: 27.7% of its information:</strong><br/>
              weight = 0.277 &nbsp;|&nbsp; V_eat = [1.830, 1.070, 1.190, 1.620]<br/>
              0.277 × 1.830 = <strong>0.507</strong> &nbsp; (component 1)<br/>
              0.277 × 1.070 = <strong>0.297</strong> &nbsp; (component 2)<br/>
              0.277 × 1.190 = <strong>0.330</strong> &nbsp; (component 3)<br/>
              0.277 × 1.620 = <strong>0.449</strong> &nbsp; (component 4)<br/>
              → Contribution from "eat": <strong>[0.507, 0.297, 0.330, 0.449]</strong><br/>
              <em style={{color: '#27ae60'}}>← Largest contribution in all 4 components — "eat" dominates apple's new meaning.</em>
            </div>
          </SpaceBetween>
        </Container>

        {/* ── 5. Interactive exercise ── */}
        <TryYourself>
          <Box variant="h4">🎯 Try It Yourself — Verify "eat" component 1</Box>
          <Box variant="p">We said: 0.277 × 1.830 = ?</Box>
          <Box variant="p">This is the single biggest contributor to apple's new component 1.</Box>
          <InteractiveInput
            label="Your answer:"
            correctAnswer={0.507}
            hint="0.277 × 1.830 = 0.50691, rounds to 0.507"
            tolerance={0.005}
          />
        </TryYourself>

        {/* ── 6. Column-by-column summation ── */}
        <Container header={<Header variant="h3">➕ Step 4 — Add All Contributions Column by Column</Header>}>
          <SpaceBetween size="s">
            <StudentNote>
              Now stack the 5 contribution vectors and add them down each column.
              Each column gives you one component of apple's new 4D vector.
            </StudentNote>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#667eea', color: 'white' }}>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Source word</th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Component 1</th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Component 2</th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Component 3</th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Component 4</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { word: 'I (14.9%)',       c: ['0.193', '0.106', '0.115', '0.124'], bg: '#f0f4ff' },
                    { word: 'bought (23.3%)',   c: ['0.374', '0.257', '0.222', '0.357'], bg: '#f0f4ff' },
                    { word: '🍎 apple (19.8%)', c: ['0.206', '0.229', '0.174', '0.154'], bg: '#ffebee' },
                    { word: 'to (14.2%)',       c: ['0.163', '0.121', '0.115', '0.180'], bg: '#f0f4ff' },
                    { word: 'eat (27.7%) ⭐',   c: ['0.507', '0.297', '0.330', '0.449'], bg: '#e8f5e8' },
                  ].map((row, i) => (
                    <tr key={i} style={{ background: row.bg }}>
                      <td style={{ padding: '8px 10px', border: '1px solid #ddd', fontWeight: 'bold' }}>{row.word}</td>
                      {row.c.map((v, j) => (
                        <td key={j} style={{ padding: '8px 10px', textAlign: 'center', border: '1px solid #ddd' }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                  <tr style={{ background: '#ffd700', fontWeight: 'bold', fontSize: '14px' }}>
                    <td style={{ padding: '10px', border: '2px solid #333' }}>⬇ SUM (Apple's new vector)</td>
                    <td style={{ padding: '10px', textAlign: 'center', border: '2px solid #333' }}>0.193+0.374+0.206+0.163+0.507<br/><strong>= 1.443</strong></td>
                    <td style={{ padding: '10px', textAlign: 'center', border: '2px solid #333' }}>0.106+0.257+0.229+0.121+0.297<br/><strong>= 1.010</strong></td>
                    <td style={{ padding: '10px', textAlign: 'center', border: '2px solid #333' }}>0.115+0.222+0.174+0.115+0.330<br/><strong>= 0.956</strong></td>
                    <td style={{ padding: '10px', textAlign: 'center', border: '2px solid #333' }}>0.124+0.357+0.154+0.180+0.449<br/><strong>= 1.265</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SpaceBetween>
        </Container>

        {/* ── 7. Before vs After ── */}
        <Container header={<Header variant="h3">🔄 Step 5 — Before vs After: How Did Apple Change?</Header>}>
          <SpaceBetween size="s">
            <StudentNote>
              Compare apple's original embedding (from Step 1) with its new contextual vector.
              These are two very different things — here's what changed and why it matters.
            </StudentNote>
            <Table
              columnDefinitions={[
                { id: 'label', header: '', cell: item => item.label },
                { id: 'c1', header: 'Component 1', cell: item => item.c1 },
                { id: 'c2', header: 'Component 2', cell: item => item.c2 },
                { id: 'c3', header: 'Component 3', cell: item => item.c3 },
                { id: 'c4', header: 'Component 4', cell: item => item.c4 },
              ]}
              items={[
                { label: 'Original embedding (Step 1)',   c1: '0.600', c2: '0.400', c3: '1.000', c4: '0.200' },
                { label: 'New contextual vector (Step 9)', c1: '1.443', c2: '1.010', c3: '0.956', c4: '1.265' },
                { label: 'Change (Δ)',                     c1: '+0.843 ↑', c2: '+0.610 ↑', c3: '-0.044 ↓', c4: '+1.065 ↑' },
              ]}
              variant="embedded"
            />
            <StudentNote title="What Does the Change Mean?">
              <strong>Components 1, 2, 4 all increased significantly.</strong><br/>
              This is because words like "eat" and "bought" have high values in those dimensions,
              and their contributions were added into apple's representation.<br/><br/>
              <strong>Component 3 barely changed (−0.044).</strong><br/>
              Apple originally had the highest value there (1.000). After blending,
              it dropped slightly to 0.956 — the context from other words slightly diluted it.<br/><br/>
              <strong>Component 4 grew the most (+1.065).</strong><br/>
              "eat" (V[3]=1.620) and "bought" (V[3]=1.530) both have large 4th components,
              and since they hold the two biggest attention weights (27.7% + 23.3%), their
              information flooded into apple's 4th dimension — embedding the food/purchase context.
            </StudentNote>
          </SpaceBetween>
        </Container>

        {/* ── 8. Final result banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <Box variant="h2" color="inherit">🏆 Apple's Journey is Complete!</Box>
          <div style={{ marginTop: '16px', fontFamily: 'monospace', fontSize: '16px', lineHeight: '2.2' }}>
            Original embedding &nbsp;&nbsp;→&nbsp;&nbsp; [0.600, 0.400, 1.000, 0.200]<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ self-attention blending<br/>
            New contextual vector &nbsp;→&nbsp;&nbsp; [1.443, 1.010, 0.956, 1.265]
          </div>
        </div>

        {/* ── 9. The verdict ── */}
        <Container header={<Header variant="h3">🔍 What You Discovered</Header>}>
          <SpaceBetween size="m">
            <Box variant="p"><strong>Apple's attention budget was distributed as:</strong></Box>
            <ul style={{lineHeight: '1.8'}}>
              <li><strong>"eat" got 27.7%</strong> — Highest! Signals food/consumption context 🍽️</li>
              <li><strong>"bought" got 23.3%</strong> — Signals purchase/object context 💰</li>
              <li><strong>apple itself got 19.8%</strong> — Keeps some original identity 🔄</li>
              <li><strong>"I" got 14.9%</strong> — Agent context 👤</li>
              <li><strong>"to" got 14.2%</strong> — Purpose link context 📍</li>
            </ul>

            <Alert type="success" header="🎯 The Verdict — Apple Is a Fruit">
              The new vector [1.443, 1.010, 0.956, 1.265] is no longer just "apple in isolation."
              It is <strong>"apple as understood in the sentence I bought apple to eat."</strong><br/><br/>
              The 27.7% contribution from "eat" and 23.3% from "bought" have injected
              food-and-purchase meaning directly into apple's representation.
              If the sentence had been "I bought Apple stock to sell", the attention weights would
              be completely different, producing a different output vector — the company, not the fruit.
              <strong> That is the entire point of self-attention.</strong>
            </Alert>
          </SpaceBetween>
        </Container>

        {/* ── 10. Key takeaways ── */}
        <StudentNote title="Key Takeaways — The Full Picture">
          <ol style={{ lineHeight: '2' }}>
            <li><strong>Step 1:</strong> Word embeddings — raw 4D vectors, no context</li>
            <li><strong>Steps 2–4:</strong> Multiply by W_Q, W_K, W_V → Query, Key, Value vectors for every word</li>
            <li><strong>Step 5:</strong> Dot product Q·K → how much each pair of words relate to each other</li>
            <li><strong>Step 6:</strong> Divide by √d_k → prevent scores from exploding</li>
            <li><strong>Step 7:</strong> Softmax → convert scores into probabilities (attention weights, sum = 1)</li>
            <li><strong>Step 8 (this step):</strong> Weighted sum of V vectors → new context-aware embedding</li>
          </ol>
          This entire pipeline runs <strong>in parallel for all 5 words simultaneously</strong> — every word gets its own new contextual vector in a single pass.
        </StudentNote>

        <div style={{ background: '#e8f5e8', padding: '20px', borderRadius: '8px', border: '2px solid #27ae60' }}>
          <Box variant="h3">🎉 You completed the full self-attention walkthrough!</Box>
          <Box variant="p">
            You just calculated, from scratch, exactly how a transformer reads a sentence.
            Ready for the next challenge? Check out <strong>Multi-Head Attention</strong> — where this entire
            process runs 8 times in parallel, each head learning a different type of relationship.
          </Box>
        </div>

      </SpaceBetween>
    </StepContainer>
  )
}
