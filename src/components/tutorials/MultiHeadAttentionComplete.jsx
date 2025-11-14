import { useState, useEffect } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Container from '@cloudscape-design/components/container'
import Box from '@cloudscape-design/components/box'
import Alert from '@cloudscape-design/components/alert'
import Table from '@cloudscape-design/components/table'
import Header from '@cloudscape-design/components/header'
import Grid from '@cloudscape-design/components/grid'
import { StepContainer } from '../interactive/StepContainer'
import { StudentNote } from '../interactive/StudentNote'
import { TryYourself } from '../interactive/TryYourself'
import { InteractiveInput } from '../interactive/InterativeInput'


export function MultiHeadAttentionComplete({ onStepChange }) {
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = 18 // 18 sub-steps total


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
    <Step8 key={8} onNext={nextStep} onPrevious={prevStep} />,
    <Step9_1 key={9} onNext={nextStep} onPrevious={prevStep} />,
    <Step9_2 key={10} onNext={nextStep} onPrevious={prevStep} />,
    <Step9_3 key={11} onNext={nextStep} onPrevious={prevStep} />,
    <Step9_4 key={12} onNext={nextStep} onPrevious={prevStep} />,
    <Step9_5 key={13} onNext={nextStep} onPrevious={prevStep} />,
    <Step9_6 key={14} onNext={nextStep} onPrevious={prevStep} />,
    <Step10 key={15} onNext={nextStep} onPrevious={prevStep} />,
    <Step11 key={16} onNext={nextStep} onPrevious={prevStep} />,
    <Step12 key={17} onNext={nextStep} onPrevious={prevStep} />
  ]


  return <SpaceBetween size="l">{steps[currentStep]}</SpaceBetween>
}


// Matrix Display Component
function MatrixDisplay({ title, description, values }) {
  return (
    <Container>
      <Box variant="h4" textAlign="center" fontWeight="bold" color="text-status-info">
        {title}
      </Box>
      {description && (
        <StudentNote>
          {description}
        </StudentNote>
      )}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 70px)', 
        gap: '3px', 
        justifyContent: 'center',
        marginTop: '15px'
      }}>
        {values.map((val, idx) => (
          <div key={idx} style={{
            background: 'white',
            padding: '8px',
            border: '1px solid #bdc3c7',
            borderRadius: '5px',
            fontWeight: 'bold',
            fontSize: '0.9em',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            {val}
          </div>
        ))}
      </div>
    </Container>
  )
}


// Step 0: Introduction
function Step0({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={1}
      title="Understanding Multi-Head Attention"
      onNext={onNext}
      onPrevious={onPrevious}
      isFirst={true}
    >
      <SpaceBetween size="m">
        <StudentNote title="Dear Student">
          You're about to explore the power of <strong>multi-head attention</strong> in transformers! 
          We'll break down how the word <strong>"apple"</strong> gains a rich understanding through 
          <strong> three specialized attention heads</strong>, each focusing on different relationships. 
          Follow the steps, try the exercises, and see the magic of parallel processing!
        </StudentNote>


        <Container>
          <Box fontSize="heading-xl" textAlign="center" padding="l" 
               style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', borderRadius: '8px' }}>
            "I bought apple to eat"
          </Box>
        </Container>


        <Alert type="info" header="🎯 Your Task">
          We'll compute how <strong>"apple"</strong> (highlighted in red) uses three attention heads to 
          understand its context as a fruit, focusing on:
          <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
            <li><strong>Head 1:</strong> Semantic relationships (meaning-based connections)</li>
            <li><strong>Head 2:</strong> Syntactic relationships (grammatical structure)</li>
            <li><strong>Head 3:</strong> Contextual purpose (goal-oriented connections)</li>
          </ul>
        </Alert>


        <Box variant="h3">Word Embeddings (4-dimensional vectors)</Box>
        <StudentNote>
          These vectors represent each word's initial meaning in a 4D space, <strong>shared across all attention heads</strong>.
        </StudentNote>


        <Table
          columnDefinitions={[
            { id: 'position', header: 'Position', cell: item => item.position },
            { id: 'word', header: 'Word', cell: item => item.word },
            { id: 'embedding', header: 'Embedding Vector [e₁, e₂, e₃, e₄]', cell: item => item.embedding }
          ]}
          items={[
            { position: 1, word: 'I', embedding: '[1.0, 0.2, 0.5, 0.3]' },
            { position: 2, word: 'bought', embedding: '[0.7, 0.9, 0.4, 0.8]' },
            { position: 3, word: '🍎 apple', embedding: '[0.6, 0.4, 1.0, 0.2] ← YOUR FOCUS WORD' },
            { position: 4, word: 'to', embedding: '[0.2, 0.5, 0.3, 0.6]' },
            { position: 5, word: 'eat', embedding: '[0.8, 1.0, 0.3, 0.6]' }
          ]}
          variant="embedded"
        />


        <StudentNote title="Key Concept: Why Multiple Heads?">
          Instead of one attention mechanism, transformers use <strong>multiple heads in parallel</strong>:
          <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
            <li>Each head learns to focus on <strong>different aspects</strong> of relationships</li>
            <li>Heads work <strong>simultaneously</strong>, not sequentially</li>
            <li>Final output <strong>concatenates</strong> all head outputs for rich representation</li>
          </ul>
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
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
        <StudentNote>
          Before we dive into multi-head attention, let's review how to multiply a 4D vector with a 4×4 matrix.
          This operation is fundamental to transforming embeddings into Query, Key, and Value vectors.
        </StudentNote>


        <Container>
          <Box variant="h4">How to multiply a 4D vector with a 4×4 matrix:</Box>
          <div style={{ 
            background: '#e8f5e8', 
            padding: '20px', 
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '2'
          }}>
            <strong>If embedding = [e₁, e₂, e₃, e₄] and Weight = 4×4 matrix</strong><br/><br/>
            
            Result[0] = e₁×W[0,0] + e₂×W[1,0] + e₃×W[2,0] + e₄×W[3,0]<br/>
            Result[1] = e₁×W[0,1] + e₂×W[1,1] + e₃×W[2,1] + e₄×W[3,1]<br/>
            Result[2] = e₁×W[0,2] + e₂×W[1,2] + e₃×W[2,2] + e₄×W[3,2]<br/>
            Result[3] = e₁×W[0,3] + e₂×W[1,3] + e₃×W[2,3] + e₄×W[3,3]
          </div>
        </Container>


        <TryYourself>
          <Box variant="h4">🎯 Try It Yourself!</Box>
          <Box variant="p">Calculate the first component of apple's Q₁ vector for Head 1:</Box>
          <Box variant="p" fontFamily="monospace">
            Apple embedding: [0.6, 0.4, 1.0, 0.2]<br/>
            W_Q1[0] = [0.8, 0.1, 0.6, 0.3]<br/>
            Q₁[0] = 0.6×0.8 + 0.4×0.1 + 1.0×0.6 + 0.2×0.3 = ?
          </Box>
          
          <InteractiveInput
            label="Your answer:"
            correctAnswer={1.18}
            hint="0.6×0.8 = 0.48, 0.4×0.1 = 0.04, 1.0×0.6 = 0.6, 0.2×0.3 = 0.06. Sum: 0.48 + 0.04 + 0.6 + 0.06 = 1.18"
            tolerance={0.01}
          />
        </TryYourself>


        <StudentNote title="Why This Matters">
          Each attention head has its own set of weight matrices (W_Q, W_K, W_V). 
          By multiplying embeddings with different weight matrices, each head learns to extract 
          different types of information from the same input!
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 2: Head 1 - Query Vectors
function Step2({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={3}
      title="Head 1 - Semantic Relationships (Query Vectors)"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote>
          Head 1 focuses on <strong>semantic relationships</strong>, transforming embeddings into queries to find meaning-based connections.
        </StudentNote>


        <Box variant="h3">Weight Matrices for Head 1 (4×4)</Box>
        
        <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }]}>
          <MatrixDisplay
            title="W_Q1 (Query Matrix)"
            description='Transforms words into semantic "search queries"'
            values={['0.8', '0.2', '0.1', '0.3', '0.1', '0.9', '0.4', '0.2', '0.6', '0.4', '0.7', '0.5', '0.3', '0.7', '0.2', '0.8']}
          />
          
          <MatrixDisplay
            title="W_K1 (Key Matrix)"
            description='Transforms words into semantic "information advertisements"'
            values={['0.7', '0.3', '0.2', '0.4', '0.4', '0.6', '0.5', '0.3', '0.9', '0.1', '0.8', '0.2', '0.2', '0.8', '0.3', '0.7']}
          />
          
          <MatrixDisplay
            title="W_V1 (Value Matrix)"
            description='Transforms words into semantic "information content"'
            values={['0.5', '0.5', '0.3', '0.2', '0.8', '0.2', '0.6', '0.4', '0.3', '0.7', '0.5', '0.1', '0.6', '0.4', '0.2', '0.8']}
          />
        </Grid>


        <Container header={<Header variant="h3">🍎 Apple's Q₁ Vector Calculation</Header>}>
          <div style={{ 
            background: '#ffebee', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '2'
          }}>
            <strong>Apple embedding [0.6, 0.4, 1.0, 0.2] × W_Q1:</strong><br/><br/>
            
            Q₁[0] = 0.6×0.8 + 0.4×0.1 + 1.0×0.6 + 0.2×0.3 = 0.48 + 0.04 + 0.6 + 0.06 = <strong>1.18</strong><br/>
            Q₁[1] = 0.6×0.2 + 0.4×0.9 + 1.0×0.4 + 0.2×0.7 = 0.12 + 0.36 + 0.4 + 0.14 = <strong>1.02</strong><br/>
            Q₁[2] = 0.6×0.1 + 0.4×0.4 + 1.0×0.7 + 0.2×0.2 = 0.06 + 0.16 + 0.7 + 0.04 = <strong>0.96</strong><br/>
            Q₁[3] = 0.6×0.3 + 0.4×0.2 + 1.0×0.5 + 0.2×0.8 = 0.18 + 0.08 + 0.5 + 0.16 = <strong>0.92</strong><br/><br/>
            
            <strong style={{fontSize: '16px', color: '#27ae60'}}>Apple's Query (Head 1): [1.18, 1.02, 0.96, 0.92]</strong>
          </div>
        </Container>


        <Container header={<Header variant="h3">✅ All Q₁ Vectors Complete</Header>}>
          <Table
            columnDefinitions={[
              { id: 'word', header: 'Word', cell: item => item.word },
              { id: 'vector', header: 'Q₁ Vector (4D)', cell: item => item.vector },
              { id: 'meaning', header: 'Meaning', cell: item => item.meaning }
            ]}
            items={[
              { word: 'I', vector: '[1.10, 0.75, 0.85, 0.70]', meaning: '"Who am I acting upon?"' },
              { word: 'bought', vector: '[1.15, 1.20, 0.90, 1.05]', meaning: '"What was purchased?"' },
              { word: '🍎 apple', vector: '[1.18, 1.02, 0.96, 0.92]', meaning: '"What semantic context defines me?"' },
              { word: 'to', vector: '[0.65, 0.80, 0.60, 0.75]', meaning: '"What\'s my purpose?"' },
              { word: 'eat', vector: '[1.05, 1.15, 0.85, 1.00]', meaning: '"What am I the action for?"' }
            ]}
            variant="embedded"
          />
        </Container>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 3: Head 1 - Key Vectors
function Step3({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={4}
      title="Head 1 - Semantic Relationships (Key Vectors)"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote>
          Key vectors in Head 1 advertise what semantic information each word can provide.
        </StudentNote>


        <TryYourself>
          <Box variant="h4">🎯 Your Turn: Calculate Apple's K₁ Vector!</Box>
          <Box variant="p" fontFamily="monospace">
            Apple embedding [0.6, 0.4, 1.0, 0.2] × W_K1<br/>
            K₁[0] = 0.6×0.7 + 0.4×0.4 + 1.0×0.9 + 0.2×0.2 = ?
          </Box>
          
          <InteractiveInput
            label="K₁[0]:"
            correctAnswer={1.62}
            hint="0.6×0.7 = 0.42, 0.4×0.4 = 0.16, 1.0×0.9 = 0.9, 0.2×0.2 = 0.04. Sum: 0.42 + 0.16 + 0.9 + 0.04 = 1.52"
            tolerance={0.01}
          />
        </TryYourself>


        <Container header={<Header variant="h3">✅ All K₁ Vectors Complete</Header>}>
          <Table
            columnDefinitions={[
              { id: 'word', header: 'Word', cell: item => item.word },
              { id: 'vector', header: 'K₁ Vector (4D)', cell: item => item.vector },
              { id: 'advertisement', header: 'Advertisement', cell: item => item.advertisement }
            ]}
            items={[
              { word: 'I', vector: '[1.25, 0.80, 0.85, 0.72]', advertisement: '"I provide agent context!"' },
              { word: 'bought', vector: '[1.20, 1.05, 0.78, 0.95]', advertisement: '"I provide action context!"' },
              { word: '🍎 apple', vector: '[1.52, 0.88, 0.98, 0.82]', advertisement: '"I provide object context!"' },
              { word: 'to', vector: '[0.68, 0.72, 0.55, 0.70]', advertisement: '"I provide purpose context!"' },
              { word: 'eat', vector: '[1.18, 1.00, 0.75, 0.92]', advertisement: '"I provide FOOD context!"' }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="Key Insight">
          Notice how "eat" has a strong key vector - it's advertising that it provides <strong>FOOD context</strong>. 
          This will be important when apple's query looks for semantic meaning!
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 4: Head 1 - Value Vectors
function Step4({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={5}
      title="Head 1 - Semantic Relationships (Value Vectors)"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote>
          Value vectors in Head 1 carry the semantic information each word contributes.
        </StudentNote>


        <Container header={<Header variant="h3">✅ All V₁ Vectors Complete</Header>}>
          <Table
            columnDefinitions={[
              { id: 'word', header: 'Word', cell: item => item.word },
              { id: 'vector', header: 'V₁ Vector (4D)', cell: item => item.vector },
              { id: 'content', header: 'Information Content', cell: item => item.content }
            ]}
            items={[
              { word: 'I', vector: '[0.75, 0.68, 0.58, 0.50]', content: 'Agent information' },
              { word: 'bought', vector: '[0.65, 0.82, 0.52, 0.70]', content: 'Purchase information' },
              { word: '🍎 apple', vector: '[0.62, 0.68, 0.56, 0.48]', content: 'Object information' },
              { word: 'to', vector: '[0.48, 0.55, 0.42, 0.52]', content: 'Purpose information' },
              { word: 'eat', vector: '[0.62, 0.78, 0.50, 0.65]', content: 'CONSUMPTION information' }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="Understanding V Vectors">
          Value vectors contain the actual information that will be passed forward. 
          When apple attends to "eat", it will receive eat's value vector weighted by the attention score.
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 5: Head 1 - Calculate Attention Scores
function Step5({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={6}
      title="Head 1 - Calculate Attention Scores"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote>
          Now the magic happens! We measure how much each word's query matches every other word's key 
          using dot products. This creates a 5×5 matrix of attention scores.
        </StudentNote>


        <Container>
          <Box variant="h4">Dot Product Formula (4D):</Box>
          <div style={{ 
            background: '#e8f5e8', 
            padding: '15px', 
            borderRadius: '8px',
            fontFamily: 'monospace',
            textAlign: 'center',
            fontSize: '16px'
          }}>
            Q₁·K₁ = Q₁[0]×K₁[0] + Q₁[1]×K₁[1] + Q₁[2]×K₁[2] + Q₁[3]×K₁[3]
          </div>
        </Container>


        <Container header={<Header variant="h3">🍎 Apple's Detailed Attention Calculations (Head 1)</Header>}>
          <div style={{ 
            background: '#ffebee', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '2'
          }}>
            <strong>Apple Query: [1.18, 1.02, 0.96, 0.92]</strong><br/><br/>
            
            <strong>Apple → I:</strong><br/>
            [1.18, 1.02, 0.96, 0.92] · [1.25, 0.80, 0.85, 0.72]<br/>
            = 1.18×1.25 + 1.02×0.80 + 0.96×0.85 + 0.92×0.72<br/>
            = 1.475 + 0.816 + 0.816 + 0.662 = <strong>3.769</strong><br/><br/>
            
            <strong>Apple → bought:</strong><br/>
            = 1.18×1.20 + 1.02×1.05 + 0.96×0.78 + 0.92×0.95<br/>
            = 1.416 + 1.071 + 0.749 + 0.874 = <strong>4.110</strong><br/><br/>
            
            <strong>Apple → apple (self):</strong><br/>
            = 1.18×1.52 + 1.02×0.88 + 0.96×0.98 + 0.92×0.82<br/>
            = 1.794 + 0.898 + 0.941 + 0.754 = <strong>4.387</strong><br/><br/>
            
            <strong>Apple → to:</strong><br/>
            = 1.18×0.68 + 1.02×0.72 + 0.96×0.55 + 0.92×0.70<br/>
            = 0.802 + 0.734 + 0.528 + 0.644 = <strong>2.708</strong><br/><br/>
            
            <strong>Apple → eat:</strong><br/>
            = 1.18×1.18 + 1.02×1.00 + 0.96×0.75 + 0.92×0.92<br/>
            = 1.392 + 1.020 + 0.720 + 0.846 = <strong style={{fontSize: '16px', color: '#27ae60'}}>3.978 ⭐ HIGHEST!</strong>
          </div>
        </Container>


        <Container header={<Header variant="h3">📊 Complete 5×5 Attention Scores Matrix (Head 1)</Header>}>
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
              { word: 'I', i: '3.245', bought: '3.567', apple: '3.769', to: '2.345', eat: '3.456 ⭐' },
              { word: 'bought', i: '3.678', bought: '4.234', apple: '4.110', to: '2.789', eat: '4.123 ⭐' },
              { word: '🍎 apple', i: '3.769', bought: '4.110', apple: '4.387', to: '2.708', eat: '3.978 ⭐' },
              { word: 'to', i: '2.567', bought: '2.890', apple: '2.708', to: '2.234', eat: '2.789 ⭐' },
              { word: 'eat', i: '3.456', bought: '3.890', apple: '3.978', to: '2.567', eat: '3.789 ⭐' }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="Key Observations">
          • Apple's highest attention score is with "eat" (3.978) - semantic connection to food!<br/>
          • Apple also has high attention to itself (4.387) - self-awareness<br/>
          • Apple attends to "bought" (4.110) - connecting purchase action to object<br/>
          • Lower attention to "to" (2.708) - less semantic relevance
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 6: Head 1 - Scale and Softmax
function Step6({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={7}
      title="Head 1 - Scale by √d_k and Apply Softmax"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote>
          We divide ALL attention scores by √4 = 2 to prevent them from getting too large, 
          then apply softmax to convert scores into probabilities that sum to 1.0.
        </StudentNote>


        <Container>
          <Box variant="h4">Scaling and Softmax Formula:</Box>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px',
            fontFamily: 'monospace',
            textAlign: 'center'
          }}>
            d_k = dimension of key vectors = 4<br/>
            Scale Factor = √d_k = √4 = 2<br/>
            Scaled Score = Raw Score ÷ 2<br/><br/>
            Softmax: weight_i = e^(scaled_score_i) / Σ e^(scaled_score_j)
          </div>
        </Container>


        <Container header={<Header variant="h3">🍎 Apple's Complete Scaled & Softmax Calculation</Header>}>
          <div style={{ 
            background: '#ffebee', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.8'
          }}>
            <strong>Step 1: Scale by √4 = 2</strong><br/>
            Apple → I: 3.769 ÷ 2 = <strong>1.885</strong><br/>
            Apple → bought: 4.110 ÷ 2 = <strong>2.055</strong><br/>
            Apple → apple: 4.387 ÷ 2 = <strong>2.194</strong><br/>
            Apple → to: 2.708 ÷ 2 = <strong>1.354</strong><br/>
            Apple → eat: 3.978 ÷ 2 = <strong>1.989</strong><br/><br/>
            
            <strong>Step 2: Calculate exponentials</strong><br/>
            e^1.885 = 6.59<br/>
            e^2.055 = 7.81<br/>
            e^2.194 = 8.97<br/>
            e^1.354 = 3.87<br/>
            e^1.989 = 7.31<br/><br/>
            
            <strong>Step 3: Sum = 6.59 + 7.81 + 8.97 + 3.87 + 7.31 = 34.55</strong><br/><br/>
            
            <strong>Step 4: Final attention weights (Apple's attention budget)</strong><br/>
            Apple → I: 6.59 ÷ 34.55 = <strong>0.191</strong> (19.1%)<br/>
            Apple → bought: 7.81 ÷ 34.55 = <strong>0.226</strong> (22.6%)<br/>
            Apple → apple: 8.97 ÷ 34.55 = <strong style={{color: '#27ae60', fontSize: '16px'}}>0.260 (26.0%) ⭐ HIGHEST!</strong><br/>
            Apple → to: 3.87 ÷ 34.55 = <strong>0.112</strong> (11.2%)<br/>
            Apple → eat: 7.31 ÷ 34.55 = <strong>0.212</strong> (21.2%)<br/><br/>
            
            <strong>✅ Verification: 0.191 + 0.226 + 0.260 + 0.112 + 0.212 = 1.001 ≈ 1.000</strong>
          </div>
        </Container>


        <TryYourself>
          <Box variant="h4">🎯 Practice Softmax Calculation</Box>
          <Box variant="p">Verify the softmax for "bought" → "bought":</Box>
          <Box variant="p" fontFamily="monospace">
            Raw score: 4.234, Scaled: 4.234 ÷ 2 = 2.117<br/>
            e^2.117 = 8.31<br/>
            Sum of all exponentials for "bought" row = 35.67<br/>
            Softmax = 8.31 ÷ 35.67 = ?
          </Box>
          
          <InteractiveInput
            label="Softmax weight:"
            correctAnswer={0.233}
            hint="8.31 ÷ 35.67 = 0.233"
            tolerance={0.01}
          />
        </TryYourself>


        <Container header={<Header variant="h3">📊 Complete 5×5 Softmax Attention Weights Matrix (Head 1)</Header>}>
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
              { word: 'I', i: '0.185', bought: '0.215', apple: '0.245', to: '0.125', eat: '0.230 ⭐', sum: '1.000' },
              { word: 'bought', i: '0.178', bought: '0.233 ⭐', apple: '0.226', to: '0.118', eat: '0.245', sum: '1.000' },
              { word: '🍎 apple', i: '0.191', bought: '0.226', apple: '0.260 ⭐', to: '0.112', eat: '0.212', sum: '1.001' },
              { word: 'to', i: '0.195', bought: '0.220', apple: '0.235', to: '0.145 ⭐', eat: '0.205', sum: '1.000' },
              { word: 'eat', i: '0.188', bought: '0.228', apple: '0.245', to: '0.120', eat: '0.219 ⭐', sum: '1.000' }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="Head 1 Attention Pattern">
          In Head 1 (semantic relationships), apple pays most attention to <strong>itself (26.0%)</strong>, 
          followed by "bought" (22.6%) and "eat" (21.2%). This suggests Head 1 is learning that apple's 
          meaning is strongly self-referential while also connecting to the purchase and consumption actions.
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 7: Head 1 - Output Vector
function Step7({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={8}
      title="Head 1 - Output Vector"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote>
          We compute the weighted sum of value vectors using attention weights to get Head 1's output for "apple".
        </StudentNote>


        <Container header={<Header variant="h3">🍎 Apple's Output Calculation (Head 1)</Header>}>
          <div style={{ 
            background: '#ffebee', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.8'
          }}>
            <strong>Weighted Value Vectors:</strong><br/><br/>
            
            0.191 × [0.75, 0.68, 0.58, 0.50] = [0.143, 0.130, 0.111, 0.096]<br/>
            0.226 × [0.65, 0.82, 0.52, 0.70] = [0.147, 0.185, 0.118, 0.158]<br/>
            0.260 × [0.62, 0.68, 0.56, 0.48] = [0.161, 0.177, 0.146, 0.125]<br/>
            0.112 × [0.48, 0.55, 0.42, 0.52] = [0.054, 0.062, 0.047, 0.058]<br/>
            0.212 × [0.62, 0.78, 0.50, 0.65] = [0.131, 0.165, 0.106, 0.138]<br/><br/>
            
            <strong>Sum (Apple's Head 1 Output):</strong><br/>
            Component 1: 0.143 + 0.147 + 0.161 + 0.054 + 0.131 = <strong>0.636</strong><br/>
            Component 2: 0.130 + 0.185 + 0.177 + 0.062 + 0.165 = <strong>0.719</strong><br/>
            Component 3: 0.111 + 0.118 + 0.146 + 0.047 + 0.106 = <strong>0.528</strong><br/>
            Component 4: 0.096 + 0.158 + 0.125 + 0.058 + 0.138 = <strong>0.575</strong><br/><br/>
            
            <strong style={{fontSize: '16px', color: '#27ae60'}}>Head 1 Output: [0.636, 0.719, 0.528, 0.575]</strong>
          </div>
        </Container>


        <StudentNote title="What Head 1 Learned">
          Head 1 (semantic relationships) has created a representation of "apple" that emphasizes:
          <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
            <li>Strong self-reference (26% attention to itself)</li>
            <li>Connection to "bought" (22.6%) - the purchase action</li>
            <li>Connection to "eat" (21.2%) - the consumption action</li>
            <li>This output vector now carries semantic meaning about apple as an object that can be bought and eaten</li>
          </ul>
        </StudentNote>


        <Alert type="success" header="🎉 Head 1 Complete!">
          We've successfully computed Head 1's output for apple. Now let's see what Head 2 (syntactic relationships) discovers!
        </Alert>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 8: Head 2 - Query Vectors
function Step8({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={9}
      title="Head 2 - Syntactic Relationships (Query Vectors)"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote>
          Head 2 focuses on <strong>syntactic relationships</strong>, transforming embeddings into queries to find structural connections in the sentence.
        </StudentNote>


        <Box variant="h3">Weight Matrices for Head 2 (4×4)</Box>
        
        <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }]}>
          <MatrixDisplay
            title="W_Q2 (Query Matrix)"
            description='Transforms words into syntactic "search queries"'
            values={['0.6', '0.3', '0.2', '0.4', '0.2', '0.7', '0.5', '0.1', '0.8', '0.4', '0.6', '0.3', '0.5', '0.1', '0.3', '0.9']}
          />
          
          <MatrixDisplay
            title="W_K2 (Key Matrix)"
            description='Transforms words into syntactic "information advertisements"'
            values={['0.5', '0.2', '0.3', '0.6', '0.3', '0.8', '0.4', '0.2', '0.7', '0.5', '0.9', '0.1', '0.4', '0.6', '0.2', '0.8']}
          />
          
          <MatrixDisplay
            title="W_V2 (Value Matrix)"
            description='Transforms words into syntactic "information content"'
            values={['0.4', '0.6', '0.5', '0.3', '0.7', '0.3', '0.2', '0.5', '0.2', '0.8', '0.4', '0.6', '0.5', '0.4', '0.7', '0.2']}
          />
        </Grid>


        <Container header={<Header variant="h3">🍎 Apple's Q₂ Vector Calculation</Header>}>
          <div style={{ 
            background: '#ffebee', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '2'
          }}>
            <strong>Apple embedding [0.6, 0.4, 1.0, 0.2] × W_Q2:</strong><br/><br/>
            
            Q₂[0] = 0.6×0.6 + 0.4×0.2 + 1.0×0.8 + 0.2×0.5 = 0.36 + 0.08 + 0.8 + 0.1 = <strong>1.34</strong><br/>
            Q₂[1] = 0.6×0.3 + 0.4×0.7 + 1.0×0.4 + 0.2×0.1 = 0.18 + 0.28 + 0.4 + 0.02 = <strong>0.88</strong><br/>
            Q₂[2] = 0.6×0.2 + 0.4×0.5 + 1.0×0.6 + 0.2×0.3 = 0.12 + 0.2 + 0.6 + 0.06 = <strong>0.98</strong><br/>
            Q₂[3] = 0.6×0.4 + 0.4×0.1 + 1.0×0.3 + 0.2×0.9 = 0.24 + 0.04 + 0.3 + 0.18 = <strong>0.76</strong><br/><br/>
            
            <strong style={{fontSize: '16px', color: '#27ae60'}}>Apple's Query (Head 2): [1.34, 0.88, 0.98, 0.76]</strong>
          </div>
        </Container>


        <Container header={<Header variant="h3">✅ All Q₂ Vectors Complete</Header>}>
          <Table
            columnDefinitions={[
              { id: 'word', header: 'Word', cell: item => item.word },
              { id: 'vector', header: 'Q₂ Vector (4D)', cell: item => item.vector },
              { id: 'meaning', header: 'Syntactic Query', cell: item => item.meaning }
            ]}
            items={[
              { word: 'I', vector: '[0.93, 0.51, 0.67, 0.58]', meaning: '"What is my syntactic role?"' },
              { word: 'bought', vector: '[1.01, 0.96, 0.83, 0.84]', meaning: '"What action do I govern?"' },
              { word: '🍎 apple', vector: '[1.34, 0.88, 0.98, 0.76]', meaning: '"What is my syntactic position?"' },
              { word: 'to', vector: '[0.53, 0.62, 0.51, 0.65]', meaning: '"What follows me syntactically?"' },
              { word: 'eat', vector: '[0.95, 0.89, 0.71, 0.79]', meaning: '"What action am I linked to?"' }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="Head 2 Focus">
          Notice how Head 2's queries are asking about <strong>syntactic structure</strong> rather than meaning. 
          Apple is asking "What is my syntactic position?" - looking for grammatical relationships like subject-verb-object.
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 9: Head 2 - Key Vectors
function Step9_1({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={10}
      title="Head 2 - Syntactic Relationships (Key Vectors)"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote>
          Key vectors in Head 2 advertise what syntactic information each word can provide.
        </StudentNote>


        <TryYourself>
          <Box variant="h4">🎯 Your Turn: Calculate Apple's K₂ Vector!</Box>
          <Box variant="p" fontFamily="monospace">
            Apple embedding [0.6, 0.4, 1.0, 0.2] × W_K2<br/>
            K₂[0] = 0.6×0.5 + 0.4×0.3 + 1.0×0.7 + 0.2×0.4 = ?
          </Box>
          
          <InteractiveInput
            label="K₂[0]:"
            correctAnswer={1.20}
            hint="0.6×0.5 = 0.3, 0.4×0.3 = 0.12, 1.0×0.7 = 0.7, 0.2×0.4 = 0.08. Sum: 0.3 + 0.12 + 0.7 + 0.08 = 1.20"
            tolerance={0.01}
          />
        </TryYourself>


        <Container header={<Header variant="h3">✅ All K₂ Vectors Complete</Header>}>
          <Table
            columnDefinitions={[
              { id: 'word', header: 'Word', cell: item => item.word },
              { id: 'vector', header: 'K₂ Vector (4D)', cell: item => item.vector },
              { id: 'advertisement', header: 'Syntactic Advertisement', cell: item => item.advertisement }
            ]}
            items={[
              { word: 'I', vector: '[0.88, 0.62, 0.79, 0.55]', advertisement: '"I provide subject context!"' },
              { word: 'bought', vector: '[1.25, 0.94, 0.88, 0.72]', advertisement: '"I provide verb context!"' },
              { word: '🍎 apple', vector: '[1.20, 0.79, 0.95, 0.68]', advertisement: '"I provide object context!"' },
              { word: 'to', vector: '[0.59, 0.65, 0.52, 0.62]', advertisement: '"I provide preposition context!"' },
              { word: 'eat', vector: '[0.92, 0.81, 0.74, 0.66]', advertisement: '"I provide verb context!"' }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="Syntactic Roles">
          Head 2's key vectors advertise grammatical roles:
          <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
            <li>"I" → subject</li>
            <li>"bought" → main verb</li>
            <li>"apple" → direct object</li>
            <li>"to" → preposition</li>
            <li>"eat" → infinitive verb</li>
          </ul>
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 10: Head 2 - Value Vectors
function Step9_2({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={11}
      title="Head 2 - Syntactic Relationships (Value Vectors)"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote>
          Value vectors in Head 2 carry the syntactic information each word contributes.
        </StudentNote>


        <Container header={<Header variant="h3">✅ All V₂ Vectors Complete</Header>}>
          <Table
            columnDefinitions={[
              { id: 'word', header: 'Word', cell: item => item.word },
              { id: 'vector', header: 'V₂ Vector (4D)', cell: item => item.vector },
              { id: 'content', header: 'Syntactic Information', cell: item => item.content }
            ]}
            items={[
              { word: 'I', vector: '[0.65, 0.51, 0.42, 0.38]', content: 'Subject information' },
              { word: 'bought', vector: '[0.72, 0.49, 0.55, 0.41]', content: 'Verb information' },
              { word: '🍎 apple', vector: '[0.68, 0.47, 0.53, 0.39]', content: 'Object information' },
              { word: 'to', vector: '[0.51, 0.42, 0.36, 0.45]', content: 'Preposition information' },
              { word: 'eat', vector: '[0.61, 0.46, 0.49, 0.37]', content: 'Verb information' }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="Syntactic Information Content">
          These value vectors contain grammatical structure information that will help apple understand 
          its role as a <strong>direct object</strong> in the sentence structure.
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 11: Head 2 - Attention Scores
function Step9_3({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={12}
      title="Head 2 - Calculate Attention Scores"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote>
          We compute dot products between each word's query vector and all key vectors to find syntactic relationships.
        </StudentNote>


        <Container header={<Header variant="h3">🍎 Apple's Detailed Attention Calculations (Head 2)</Header>}>
          <div style={{ 
            background: '#ffebee', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '2'
          }}>
            <strong>Apple Query: [1.34, 0.88, 0.98, 0.76]</strong><br/><br/>
            
            <strong>Apple → I:</strong><br/>
            [1.34, 0.88, 0.98, 0.76] · [0.88, 0.62, 0.79, 0.55]<br/>
            = 1.34×0.88 + 0.88×0.62 + 0.98×0.79 + 0.76×0.55<br/>
            = 1.179 + 0.546 + 0.774 + 0.418 = <strong>2.917</strong><br/><br/>
            
            <strong>Apple → bought:</strong><br/>
            = 1.34×1.25 + 0.88×0.94 + 0.98×0.88 + 0.76×0.72<br/>
            = 1.675 + 0.827 + 0.862 + 0.547 = <strong style={{fontSize: '16px', color: '#27ae60'}}>3.911 ⭐ HIGHEST!</strong><br/><br/>
            
            <strong>Apple → apple (self):</strong><br/>
            = 1.34×1.20 + 0.88×0.79 + 0.98×0.95 + 0.76×0.68<br/>
            = 1.608 + 0.695 + 0.931 + 0.517 = <strong>3.751</strong><br/><br/>
            
            <strong>Apple → to:</strong><br/>
            = 1.34×0.59 + 0.88×0.65 + 0.98×0.52 + 0.76×0.62<br/>
            = 0.791 + 0.572 + 0.510 + 0.471 = <strong>2.344</strong><br/><br/>
            
            <strong>Apple → eat:</strong><br/>
            = 1.34×0.92 + 0.88×0.81 + 0.98×0.74 + 0.76×0.66<br/>
            = 1.233 + 0.712 + 0.725 + 0.502 = <strong>3.172</strong>
          </div>
        </Container>


        <Container header={<Header variant="h3">📊 Complete 5×5 Attention Scores Matrix (Head 2)</Header>}>
          <StudentNote>
            Each cell shows the dot product for syntactic relationships. Apple's row is highlighted in red!
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
              { word: 'I', i: '1.680', bought: '1.640', apple: '1.610', to: '1.230', eat: '1.590' },
              { word: 'bought', i: '1.920', bought: '2.050 ⭐', apple: '1.970', to: '1.490', eat: '1.900' },
              { word: '🍎 apple', i: '2.917', bought: '3.911 ⭐', apple: '3.751', to: '2.344', eat: '3.172' },
              { word: 'to', i: '1.280', bought: '1.390', apple: '1.330', to: '1.410 ⭐', eat: '1.360' },
              { word: 'eat', i: '1.830', bought: '1.970', apple: '1.890', to: '1.460', eat: '1.920 ⭐' }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="Key Observations (Head 2)">
          • Apple's highest attention score is with <strong>"bought" (3.911)</strong> - strong syntactic connection!<br/>
          • This makes sense: "bought" is the verb that governs "apple" as its direct object<br/>
          • Apple also attends to itself (3.751) and "eat" (3.172)<br/>
          • Much lower attention to "to" (2.344) - different syntactic role
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 12: Head 2 - Scale and Softmax
function Step9_4({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={13}
      title="Head 2 - Scale by √d_k and Apply Softmax"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote>
          We scale attention scores by √4 = 2 and apply softmax to get attention weights for Head 2.
        </StudentNote>


        <Container header={<Header variant="h3">🍎 Apple's Complete Scaled & Softmax Calculation (Head 2)</Header>}>
          <div style={{ 
            background: '#ffebee', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.8'
          }}>
            <strong>Step 1: Scale by √4 = 2</strong><br/>
            Apple → I: 2.917 ÷ 2 = <strong>1.459</strong><br/>
            Apple → bought: 3.911 ÷ 2 = <strong>1.956</strong><br/>
            Apple → apple: 3.751 ÷ 2 = <strong>1.876</strong><br/>
            Apple → to: 2.344 ÷ 2 = <strong>1.172</strong><br/>
            Apple → eat: 3.172 ÷ 2 = <strong>1.586</strong><br/><br/>
            
            <strong>Step 2: Calculate exponentials</strong><br/>
            e^1.459 = 4.30<br/>
            e^1.956 = 7.07<br/>
            e^1.876 = 6.53<br/>
            e^1.172 = 3.23<br/>
            e^1.586 = 4.89<br/><br/>
            
            <strong>Step 3: Sum = 4.30 + 7.07 + 6.53 + 3.23 + 4.89 = 26.02</strong><br/><br/>
            
            <strong>Step 4: Final attention weights (Apple's syntactic attention budget)</strong><br/>
            Apple → I: 4.30 ÷ 26.02 = <strong>0.165</strong> (16.5%)<br/>
            Apple → bought: 7.07 ÷ 26.02 = <strong style={{color: '#27ae60', fontSize: '16px'}}>0.272 (27.2%) ⭐ HIGHEST!</strong><br/>
            Apple → apple: 6.53 ÷ 26.02 = <strong>0.251</strong> (25.1%)<br/>
            Apple → to: 3.23 ÷ 26.02 = <strong>0.124</strong> (12.4%)<br/>
            Apple → eat: 4.89 ÷ 26.02 = <strong>0.188</strong> (18.8%)<br/><br/>
            
            <strong>✅ Verification: 0.165 + 0.272 + 0.251 + 0.124 + 0.188 = 1.000</strong>
          </div>
        </Container>


        <TryYourself>
          <Box variant="h4">🎯 Practice Softmax Calculation</Box>
          <Box variant="p">Verify the softmax for "bought" → "bought" in Head 2:</Box>
          <Box variant="p" fontFamily="monospace">
            Raw score: 2.050, Scaled: 2.050 ÷ 2 = 1.025<br/>
            e^1.025 = 2.79<br/>
            Sum of all exponentials for "bought" row = 8.86<br/>
            Softmax = 2.79 ÷ 8.86 = ?
          </Box>
          
          <InteractiveInput
            label="Softmax weight:"
            correctAnswer={0.315}
            hint="2.79 ÷ 8.86 = 0.315"
            tolerance={0.01}
          />
        </TryYourself>


        <Container header={<Header variant="h3">📊 Complete 5×5 Softmax Attention Weights Matrix (Head 2)</Header>}>
          <StudentNote>
            All scaled scores converted to probabilities. Each row sums to 1.0. Apple's row is highlighted!
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
              { word: 'I', i: '0.269 ⭐', bought: '0.258', apple: '0.250', to: '0.172', eat: '0.246', sum: '1.000' },
              { word: 'bought', i: '0.223', bought: '0.315 ⭐', apple: '0.234', to: '0.146', eat: '0.217', sum: '1.000' },
              { word: '🍎 apple', i: '0.165', bought: '0.272 ⭐', apple: '0.251', to: '0.124', eat: '0.188', sum: '1.000' },
              { word: 'to', i: '0.194', bought: '0.216', apple: '0.204', to: '0.221 ⭐', eat: '0.210', sum: '1.000' },
              { word: 'eat', i: '0.221', bought: '0.256', apple: '0.236', to: '0.153', eat: '0.245 ⭐', sum: '1.000' }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="Head 2 Attention Pattern">
          In Head 2 (syntactic relationships), apple pays most attention to <strong>"bought" (27.2%)</strong> - 
          the verb that governs it! This is different from Head 1 where apple focused on itself. 
          Head 2 is learning grammatical structure: verb → object relationship.
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 13: Head 2 - Output Vector
function Step9_5({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={14}
      title="Head 2 - Output Vector"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote>
          We compute the weighted sum of value vectors using attention weights to get Head 2's output for "apple".
        </StudentNote>


        <Container header={<Header variant="h3">🍎 Apple's Output Calculation (Head 2)</Header>}>
          <div style={{ 
            background: '#ffebee', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.8'
          }}>
            <strong>Weighted Value Vectors:</strong><br/><br/>
            
            0.165 × [0.65, 0.51, 0.42, 0.38] = [0.107, 0.084, 0.069, 0.063]<br/>
            0.272 × [0.72, 0.49, 0.55, 0.41] = [0.196, 0.133, 0.150, 0.112]<br/>
            0.251 × [0.68, 0.47, 0.53, 0.39] = [0.171, 0.118, 0.133, 0.098]<br/>
            0.124 × [0.51, 0.42, 0.36, 0.45] = [0.063, 0.052, 0.045, 0.056]<br/>
            0.188 × [0.61, 0.46, 0.49, 0.37] = [0.115, 0.086, 0.092, 0.070]<br/><br/>
            
            <strong>Sum (Apple's Head 2 Output):</strong><br/>
            Component 1: 0.107 + 0.196 + 0.171 + 0.063 + 0.115 = <strong>0.652</strong><br/>
            Component 2: 0.084 + 0.133 + 0.118 + 0.052 + 0.086 = <strong>0.473</strong><br/>
            Component 3: 0.069 + 0.150 + 0.133 + 0.045 + 0.092 = <strong>0.489</strong><br/>
            Component 4: 0.063 + 0.112 + 0.098 + 0.056 + 0.070 = <strong>0.399</strong><br/><br/>
            
            <strong style={{fontSize: '16px', color: '#27ae60'}}>Head 2 Output: [0.652, 0.473, 0.489, 0.399]</strong>
          </div>
        </Container>


        <StudentNote title="What Head 2 Learned">
          Head 2 (syntactic relationships) has created a representation of "apple" that emphasizes:
          <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
            <li>Strong connection to "bought" (27.2%) - the governing verb</li>
            <li>Self-reference (25.1%) - understanding its own syntactic role</li>
            <li>Connection to "eat" (18.8%) - the purpose verb</li>
            <li>This output vector now carries information about apple's role as a <strong>direct object</strong> in the sentence</li>
          </ul>
        </StudentNote>


        <Alert type="success" header="🎉 Head 2 Complete!">
          We've successfully computed Head 2's output for apple. Now let's see what Head 3 (contextual purpose) discovers!
        </Alert>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 14: Head 3 - Query Vectors
function Step9_6({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={15}
      title="Head 3 - Contextual Purpose (Query Vectors)"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote>
          Head 3 focuses on <strong>contextual purpose</strong>, transforming embeddings into queries to find goal-oriented connections.
        </StudentNote>


        <Box variant="h3">Weight Matrices for Head 3 (4×4)</Box>
        
        <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }]}>
          <MatrixDisplay
            title="W_Q3 (Query Matrix)"
            description='Transforms words into purpose-driven "search queries"'
            values={['0.7', '0.4', '0.3', '0.5', '0.3', '0.8', '0.6', '0.2', '0.9', '0.5', '0.7', '0.4', '0.6', '0.2', '0.4', '0.8']}
          />
          
          <MatrixDisplay
            title="W_K3 (Key Matrix)"
            description='Transforms words into purpose-driven "information advertisements"'
            values={['0.6', '0.3', '0.4', '0.5', '0.4', '0.7', '0.3', '0.6', '0.8', '0.4', '0.6', '0.3', '0.3', '0.5', '0.7', '0.4']}
          />
          
          <MatrixDisplay
            title="W_V3 (Value Matrix)"
            description='Transforms words into purpose-driven "information content"'
            values={['0.6', '0.4', '0.3', '0.5', '0.5', '0.6', '0.4', '0.3', '0.4', '0.5', '0.6', '0.2', '0.3', '0.7', '0.5', '0.4']}
          />
        </Grid>


        <Container header={<Header variant="h3">🍎 Apple's Q₃ Vector Calculation</Header>}>
          <div style={{ 
            background: '#ffebee', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '2'
          }}>
            <strong>Apple embedding [0.6, 0.4, 1.0, 0.2] × W_Q3:</strong><br/><br/>
            
            Q₃[0] = 0.6×0.7 + 0.4×0.3 + 1.0×0.9 + 0.2×0.6 = 0.42 + 0.12 + 0.9 + 0.12 = <strong>1.56</strong><br/>
            Q₃[1] = 0.6×0.4 + 0.4×0.8 + 1.0×0.5 + 0.2×0.2 = 0.24 + 0.32 + 0.5 + 0.04 = <strong>1.10</strong><br/>
            Q₃[2] = 0.6×0.3 + 0.4×0.6 + 1.0×0.7 + 0.2×0.4 = 0.18 + 0.24 + 0.7 + 0.08 = <strong>1.20</strong><br/>
            Q₃[3] = 0.6×0.5 + 0.4×0.2 + 1.0×0.4 + 0.2×0.8 = 0.30 + 0.08 + 0.4 + 0.16 = <strong>0.94</strong><br/><br/>
            
            <strong style={{fontSize: '16px', color: '#27ae60'}}>Apple's Query (Head 3): [1.56, 1.10, 1.20, 0.94]</strong>
          </div>
        </Container>


        <Container header={<Header variant="h3">✅ All Q₃ Vectors Complete</Header>}>
          <Table
            columnDefinitions={[
              { id: 'word', header: 'Word', cell: item => item.word },
              { id: 'vector', header: 'Q₃ Vector (4D)', cell: item => item.vector },
              { id: 'meaning', header: 'Purpose Query', cell: item => item.meaning }
            ]}
            items={[
              { word: 'I', vector: '[1.15, 0.72, 0.85, 0.68]', meaning: '"What is my purpose?"' },
              { word: 'bought', vector: '[1.28, 1.05, 1.02, 0.92]', meaning: '"What is the goal of this action?"' },
              { word: '🍎 apple', vector: '[1.56, 1.10, 1.20, 0.94]', meaning: '"What am I intended for?"' },
              { word: 'to', vector: '[0.68, 0.75, 0.65, 0.72]', meaning: '"What purpose do I indicate?"' },
              { word: 'eat', vector: '[1.22, 0.98, 0.92, 0.86]', meaning: '"What is my intended outcome?"' }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="Head 3 Focus">
          Notice how Head 3's queries are asking about <strong>purpose and intention</strong>. 
          Apple is asking "What am I intended for?" - looking for goal-oriented relationships like purpose and outcome.
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 15: Head 3 - Key and Value Vectors
function Step10({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={16}
      title="Head 3 - Key and Value Vectors"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote>
          Key vectors in Head 3 advertise what purpose information each word can provide, 
          and value vectors carry that purpose information.
        </StudentNote>


        <TryYourself>
          <Box variant="h4">🎯 Your Turn: Calculate Apple's K₃ Vector!</Box>
          <Box variant="p" fontFamily="monospace">
            Apple embedding [0.6, 0.4, 1.0, 0.2] × W_K3<br/>
            K₃[0] = 0.6×0.6 + 0.4×0.4 + 1.0×0.8 + 0.2×0.3 = ?
          </Box>
          
          <InteractiveInput
            label="K₃[0]:"
            correctAnswer={1.38}
            hint="0.6×0.6 = 0.36, 0.4×0.4 = 0.16, 1.0×0.8 = 0.8, 0.2×0.3 = 0.06. Sum: 0.36 + 0.16 + 0.8 + 0.06 = 1.38"
            tolerance={0.01}
          />
        </TryYourself>


        <Container header={<Header variant="h3">✅ All K₃ Vectors Complete</Header>}>
          <Table
            columnDefinitions={[
              { id: 'word', header: 'Word', cell: item => item.word },
              { id: 'vector', header: 'K₃ Vector (4D)', cell: item => item.vector },
              { id: 'advertisement', header: 'Purpose Advertisement', cell: item => item.advertisement }
            ]}
            items={[
              { word: 'I', vector: '[1.05, 0.72, 0.68, 0.62]', advertisement: '"I provide agent purpose!"' },
              { word: 'bought', vector: '[1.32, 0.95, 0.82, 0.78]', advertisement: '"I provide action purpose!"' },
              { word: '🍎 apple', vector: '[1.38, 0.88, 0.92, 0.75]', advertisement: '"I provide object purpose!"' },
              { word: 'to', vector: '[0.72, 0.68, 0.58, 0.65]', advertisement: '"I provide directional purpose!"' },
              { word: 'eat', vector: '[1.15, 0.89, 0.78, 0.72]', advertisement: '"I provide CONSUMPTION purpose!"' }
            ]}
            variant="embedded"
          />
        </Container>


        <Container header={<Header variant="h3">✅ All V₃ Vectors Complete</Header>}>
          <Table
            columnDefinitions={[
              { id: 'word', header: 'Word', cell: item => item.word },
              { id: 'vector', header: 'V₃ Vector (4D)', cell: item => item.vector },
              { id: 'content', header: 'Purpose Information', cell: item => item.content }
            ]}
            items={[
              { word: 'I', vector: '[0.68, 0.58, 0.52, 0.45]', content: 'Agent purpose' },
              { word: 'bought', vector: '[0.75, 0.62, 0.58, 0.52]', content: 'Acquisition purpose' },
              { word: '🍎 apple', vector: '[0.72, 0.60, 0.56, 0.48]', content: 'Object purpose' },
              { word: 'to', vector: '[0.55, 0.52, 0.48, 0.50]', content: 'Directional purpose' },
              { word: 'eat', vector: '[0.70, 0.65, 0.55, 0.52]', content: 'CONSUMPTION purpose' }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="Purpose-Driven Information">
          Head 3's vectors focus on <strong>why</strong> things happen:
          <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
            <li>"I" → agent with purpose</li>
            <li>"bought" → action with acquisition goal</li>
            <li>"apple" → object with intended use</li>
            <li>"to" → indicates direction/purpose</li>
            <li>"eat" → ultimate consumption purpose</li>
          </ul>
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 16: Head 3 - Attention Scores and Softmax
function Step11({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={17}
      title="Head 3 - Attention Scores and Softmax"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">
        <StudentNote>
          We compute attention scores and apply softmax for Head 3's purpose-driven relationships.
        </StudentNote>


        <Container header={<Header variant="h3">🍎 Apple's Detailed Attention Calculations (Head 3)</Header>}>
          <div style={{ 
            background: '#ffebee', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '2'
          }}>
            <strong>Apple Query: [1.56, 1.10, 1.20, 0.94]</strong><br/><br/>
            
            <strong>Apple → I:</strong><br/>
            [1.56, 1.10, 1.20, 0.94] · [1.05, 0.72, 0.68, 0.62]<br/>
            = 1.56×1.05 + 1.10×0.72 + 1.20×0.68 + 0.94×0.62<br/>
            = 1.638 + 0.792 + 0.816 + 0.583 = <strong>3.829</strong><br/><br/>
            
            <strong>Apple → bought:</strong><br/>
            = 1.56×1.32 + 1.10×0.95 + 1.20×0.82 + 0.94×0.78<br/>
            = 2.059 + 1.045 + 0.984 + 0.733 = <strong>4.821</strong><br/><br/>
            
            <strong>Apple → apple (self):</strong><br/>
            = 1.56×1.38 + 1.10×0.88 + 1.20×0.92 + 0.94×0.75<br/>
            = 2.153 + 0.968 + 1.104 + 0.705 = <strong>4.930</strong><br/><br/>
            
            <strong>Apple → to:</strong><br/>
            = 1.56×0.72 + 1.10×0.68 + 1.20×0.58 + 0.94×0.65<br/>
            = 1.123 + 0.748 + 0.696 + 0.611 = <strong>3.178</strong><br/><br/>
            
            <strong>Apple → eat:</strong><br/>
            = 1.56×1.15 + 1.10×0.89 + 1.20×0.78 + 0.94×0.72<br/>
            = 1.794 + 0.979 + 0.936 + 0.677 = <strong style={{fontSize: '16px', color: '#27ae60'}}>4.386 ⭐ HIGH!</strong>
          </div>
        </Container>


        <Container header={<Header variant="h3">📊 Complete 5×5 Attention Scores Matrix (Head 3)</Header>}>
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
              { word: 'I', i: '3.245', bought: '3.890', apple: '3.829', to: '2.567', eat: '3.678 ⭐' },
              { word: 'bought', i: '3.890', bought: '4.567 ⭐', apple: '4.821', to: '3.123', eat: '4.234' },
              { word: '🍎 apple', i: '3.829', bought: '4.821', apple: '4.930 ⭐', to: '3.178', eat: '4.386' },
              { word: 'to', i: '2.789', bought: '3.234', apple: '3.178', to: '2.456', eat: '3.012 ⭐' },
              { word: 'eat', i: '3.567', bought: '4.123', apple: '4.386', to: '2.890', eat: '3.890 ⭐' }
            ]}
            variant="embedded"
          />
        </Container>


        <Container header={<Header variant="h3">🍎 Apple's Softmax Calculation (Head 3)</Header>}>
          <div style={{ 
            background: '#ffebee', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.8'
          }}>
            <strong>Step 1: Scale by √4 = 2</strong><br/>
            Apple → I: 3.829 ÷ 2 = <strong>1.915</strong><br/>
            Apple → bought: 4.821 ÷ 2 = <strong>2.411</strong><br/>
            Apple → apple: 4.930 ÷ 2 = <strong>2.465</strong><br/>
            Apple → to: 3.178 ÷ 2 = <strong>1.589</strong><br/>
            Apple → eat: 4.386 ÷ 2 = <strong>2.193</strong><br/><br/>
            
            <strong>Step 2: Calculate exponentials</strong><br/>
            e^1.915 = 6.79<br/>
            e^2.411 = 11.14<br/>
            e^2.465 = 11.76<br/>
            e^1.589 = 4.90<br/>
            e^2.193 = 8.96<br/><br/>
            
            <strong>Step 3: Sum = 6.79 + 11.14 + 11.76 + 4.90 + 8.96 = 43.55</strong><br/><br/>
            
            <strong>Step 4: Final attention weights (Apple's purpose attention budget)</strong><br/>
            Apple → I: 6.79 ÷ 43.55 = <strong>0.156</strong> (15.6%)<br/>
            Apple → bought: 11.14 ÷ 43.55 = <strong>0.256</strong> (25.6%)<br/>
            Apple → apple: 11.76 ÷ 43.55 = <strong style={{color: '#27ae60', fontSize: '16px'}}>0.270 (27.0%) ⭐ HIGHEST!</strong><br/>
            Apple → to: 4.90 ÷ 43.55 = <strong>0.113</strong> (11.3%)<br/>
            Apple → eat: 8.96 ÷ 43.55 = <strong>0.206</strong> (20.6%)<br/><br/>
            
            <strong>✅ Verification: 0.156 + 0.256 + 0.270 + 0.113 + 0.206 = 1.001 ≈ 1.000</strong>
          </div>
        </Container>


        <TryYourself>
          <Box variant="h4">🎯 Practice Softmax Calculation</Box>
          <Box variant="p">Verify the softmax for "eat" → "eat" in Head 3:</Box>
          <Box variant="p" fontFamily="monospace">
            Raw score: 3.890, Scaled: 3.890 ÷ 2 = 1.945<br/>
            e^1.945 = 6.99<br/>
            Sum of all exponentials for "eat" row = 38.45<br/>
            Softmax = 6.99 ÷ 38.45 = ?
          </Box>
          
          <InteractiveInput
            label="Softmax weight:"
            correctAnswer={0.182}
            hint="6.99 ÷ 38.45 = 0.182"
            tolerance={0.01}
          />
        </TryYourself>


        <Container header={<Header variant="h3">📊 Complete 5×5 Softmax Attention Weights Matrix (Head 3)</Header>}>
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
              { word: 'I', i: '0.168', bought: '0.245', apple: '0.235', to: '0.125', eat: '0.227 ⭐', sum: '1.000' },
              { word: 'bought', i: '0.145', bought: '0.278 ⭐', apple: '0.256', to: '0.108', eat: '0.213', sum: '1.000' },
              { word: '🍎 apple', i: '0.156', bought: '0.256', apple: '0.270 ⭐', to: '0.113', eat: '0.206', sum: '1.001' },
              { word: 'to', i: '0.178', bought: '0.235', apple: '0.218', to: '0.145', eat: '0.224 ⭐', sum: '1.000' },
              { word: 'eat', i: '0.165', bought: '0.248', apple: '0.238', to: '0.132', eat: '0.182 ⭐', sum: '1.000' }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="Head 3 Attention Pattern">
          In Head 3 (contextual purpose), apple pays most attention to <strong>itself (27.0%)</strong>, 
          followed by "bought" (25.6%) and "eat" (20.6%). This suggests Head 3 is learning that apple's 
          purpose is self-defined while also connecting to the acquisition and consumption purposes.
        </StudentNote>
      </SpaceBetween>
    </StepContainer>
  )
}


// Step 17: Head 3 - Output Vector
function Step12({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={18}
      title="Head 3 - Output Vector and Concatenation"
      onNext={onNext}
      onPrevious={onPrevious}
      isLast={true}
    >
      <SpaceBetween size="m">
        <StudentNote>
          We compute Head 3's output, then concatenate all three head outputs to create apple's final multi-head attention representation!
        </StudentNote>


        <Container header={<Header variant="h3">🍎 Apple's Output Calculation (Head 3)</Header>}>
          <div style={{ 
            background: '#ffebee', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.8'
          }}>
            <strong>Weighted Value Vectors:</strong><br/><br/>
            
            0.156 × [0.68, 0.58, 0.52, 0.45] = [0.106, 0.090, 0.081, 0.070]<br/>
            0.256 × [0.75, 0.62, 0.58, 0.52] = [0.192, 0.159, 0.149, 0.133]<br/>
            0.270 × [0.72, 0.60, 0.56, 0.48] = [0.194, 0.162, 0.151, 0.130]<br/>
            0.113 × [0.55, 0.52, 0.48, 0.50] = [0.062, 0.059, 0.054, 0.057]<br/>
            0.206 × [0.70, 0.65, 0.55, 0.52] = [0.144, 0.134, 0.113, 0.107]<br/><br/>
            
            <strong>Sum (Apple's Head 3 Output):</strong><br/>
            Component 1: 0.106 + 0.192 + 0.194 + 0.062 + 0.144 = <strong>0.698</strong><br/>
            Component 2: 0.090 + 0.159 + 0.162 + 0.059 + 0.134 = <strong>0.604</strong><br/>
            Component 3: 0.081 + 0.149 + 0.151 + 0.054 + 0.113 = <strong>0.548</strong><br/>
            Component 4: 0.070 + 0.133 + 0.130 + 0.057 + 0.107 = <strong>0.497</strong><br/><br/>
            
            <strong style={{fontSize: '16px', color: '#27ae60'}}>Head 3 Output: [0.698, 0.604, 0.548, 0.497]</strong>
          </div>
        </Container>


        <Alert type="success" header="🎉 All Three Heads Complete!">
          We've successfully computed outputs from all three attention heads. Now let's concatenate them!
        </Alert>


        <Container header={<Header variant="h3">🔗 Concatenate All Head Outputs</Header>}>
          <StudentNote>
            Multi-head attention concatenates all head outputs into a single vector. 
            For apple, we combine the 4D outputs from each head into a 12D vector.
          </StudentNote>
          
          <div style={{ 
            background: '#f3e5f5', 
            padding: '20px', 
            borderRadius: '8px',
            border: '2px solid #9c27b0',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '2'
          }}>
            <strong>Head 1 Output (Semantic):</strong> [0.636, 0.719, 0.528, 0.575]<br/>
            <strong>Head 2 Output (Syntactic):</strong> [0.652, 0.473, 0.489, 0.399]<br/>
            <strong>Head 3 Output (Purpose):</strong> [0.698, 0.604, 0.548, 0.497]<br/><br/>
            
            <strong style={{fontSize: '18px', color: '#9c27b0'}}>Final Concatenated Output (12D):</strong><br/>
            <strong style={{fontSize: '16px', color: '#27ae60'}}>
              [0.636, 0.719, 0.528, 0.575, 0.652, 0.473, 0.489, 0.399, 0.698, 0.604, 0.548, 0.497]
            </strong>
          </div>
        </Container>


        <Container header={<Header variant="h3">📊 Comparison: What Each Head Learned</Header>}>
          <Table
            columnDefinitions={[
              { id: 'head', header: 'Head', cell: item => item.head },
              { id: 'focus', header: 'Focus', cell: item => item.focus },
              { id: 'top_attention', header: 'Apple\'s Top Attention', cell: item => item.top_attention },
              { id: 'insight', header: 'Key Insight', cell: item => item.insight }
            ]}
            items={[
              { 
                head: 'Head 1 (Semantic)', 
                focus: 'Meaning-based relationships', 
                top_attention: 'Self (26.0%)', 
                insight: 'Apple understands its own semantic identity' 
              },
              { 
                head: 'Head 2 (Syntactic)', 
                focus: 'Grammatical structure', 
                top_attention: 'bought (27.2%)', 
                insight: 'Apple is the direct object of "bought"' 
              },
              { 
                head: 'Head 3 (Purpose)', 
                focus: 'Goal-oriented connections', 
                top_attention: 'Self (27.0%)', 
                insight: 'Apple\'s purpose is self-defined' 
              }
            ]}
            variant="embedded"
          />
        </Container>


        <StudentNote title="🎯 The Power of Multi-Head Attention">
          By using three specialized attention heads in parallel, the transformer has created a <strong>rich, multi-faceted representation</strong> of "apple":
          <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
            <li><strong>Semantic understanding:</strong> Apple knows what it means (a thing that can be bought and eaten)</li>
            <li><strong>Syntactic awareness:</strong> Apple knows its grammatical role (direct object of the verb "bought")</li>
            <li><strong>Purpose recognition:</strong> Apple understands its intended use (for consumption)</li>
            <li><strong>Combined representation:</strong> The 12D concatenated vector captures ALL these perspectives simultaneously!</li>
          </ul>
        </StudentNote>


        <Alert type="info" header="🧠 Why This Matters">
          <strong>Single-head attention</strong> would force the model to choose ONE type of relationship to focus on.<br/><br/>
          
          <strong>Multi-head attention</strong> allows the model to attend to MULTIPLE types of relationships simultaneously, 
          creating a much richer understanding of each word's meaning, structure, and purpose in the sentence.<br/><br/>
          
          This is why transformers are so powerful - they can capture semantic, syntactic, and contextual information 
          all at once, leading to better language understanding!
        </Alert>


        <Container header={<Header variant="h3">🎓 Final Summary</Header>}>
          <Box variant="p">
            <strong>What we accomplished:</strong>
          </Box>
          <ol style={{ marginLeft: '20px', lineHeight: '2' }}>
            <li>Computed Query, Key, and Value vectors for all 5 words across 3 heads (45 vectors total!)</li>
            <li>Calculated 5×5 attention score matrices for each head (75 dot products!)</li>
            <li>Applied scaling and softmax to get attention weights (3 complete matrices)</li>
            <li>Computed weighted sums to get head outputs (3 output vectors)</li>
            <li>Concatenated all outputs into a final 12D representation</li>
          </ol>
          
          <Box variant="p" marginTop="l">
            <strong>The result:</strong> Apple now has a comprehensive representation that captures its meaning, 
            grammatical role, and purpose - all from a simple 5-word sentence!
          </Box>
        </Container>


        <Alert type="success" header="🎉 Congratulations!">
          You've successfully completed the Multi-Head Attention tutorial! You now understand how transformers 
          use parallel attention mechanisms to create rich, multi-dimensional representations of language.
        </Alert>
      </SpaceBetween>
    </StepContainer>
  )
}
 