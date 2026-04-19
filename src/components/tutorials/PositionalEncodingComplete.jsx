import { useState, useEffect } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Container from '@cloudscape-design/components/container'
import Box from '@cloudscape-design/components/box'
import Alert from '@cloudscape-design/components/alert'
import Table from '@cloudscape-design/components/table'
import Header from '@cloudscape-design/components/header'
import { StepContainer } from '../interactive/StepContainer'
import { StudentNote } from '../interactive/StudentNote'
import { TryYourself } from '../interactive/TryYourself'
import { InteractiveInput } from '../interactive/InterativeInput'


export function PositionalEncodingComplete({ onStepChange }) {
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


// ─────────────────────────────────────────────────────────────────────────────
// Step 0 — Introduction: The Order Problem
// ─────────────────────────────────────────────────────────────────────────────
function Step0({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={1}
      title="The Order Problem — Why Transformers Go Blind to Position"
      onNext={onNext}
      onPrevious={onPrevious}
      isFirst={true}
    >
      <SpaceBetween size="m">

        <StudentNote title="Dear Student — What Problem Are We Solving?">
          Read these two sentences:<br /><br />
          &nbsp;&nbsp;"<strong>I ate the apple</strong>"<br />
          &nbsp;&nbsp;"<strong>The apple ate I</strong>"<br /><br />
          The second sentence is grammatically nonsense — but it contains <em>exactly the same four words</em>.
          Self-attention (the tutorial you just completed) would produce <strong>identical Q, K, and V vectors</strong> for
          both sentences, because it multiplies the same embeddings by the same weight matrices.<br /><br />
          Without knowing word <em>order</em>, the transformer cannot tell these sentences apart.
          <strong> That is the problem positional encoding solves.</strong><br /><br />
          We solve it by adding a unique numerical "position fingerprint" to each word's embedding
          <em>before</em> self-attention runs — so position 0 ("I") always looks different from
          position 2 ("apple"), even if they had the same original embedding.
        </StudentNote>

        <Container header={<Header variant="h3">🗺️ Your 9-Step Roadmap</Header>}>
          <Table
            columnDefinitions={[
              { id: 'step', header: 'Step', cell: item => item.step },
              { id: 'name', header: 'What We Do', cell: item => item.name },
              { id: 'output', header: 'Output', cell: item => item.output },
            ]}
            items={[
              { step: '1 (this page)', name: 'Understand the order problem + set up data', output: 'Word embeddings for "I bought apple to eat"' },
              { step: '2', name: 'The sinusoidal formula', output: 'PE(pos, 2i) = sin / cos rule explained' },
              { step: '3', name: 'Frequency denominators', output: '10000^(2i/d) = 1.0 and 100.0' },
              { step: '4', name: 'PE for positions 0 and 1', output: '[0,1,0,1] and [0.841, 0.540, 0.010, 1.000]' },
              { step: '5', name: 'PE for position 2 — "apple" (full worked)', output: '[0.909, −0.416, 0.020, 1.000]' },
              { step: '6', name: 'All 5 PE vectors + pattern observations', output: 'Complete PE table for all 5 positions' },
              { step: '7', name: 'Add PE to embeddings (focus: apple)', output: 'X + PE step-by-step → [1.509, −0.016, 1.020, 1.200]' },
              { step: '8', name: 'Complete position-aware embeddings', output: 'All 5 words with positions baked in' },
              { step: '9', name: 'Why sinusoidal? + where PE fits', output: '3 properties + full transformer data flow' },
            ]}
            variant="embedded"
          />
        </Container>

        <Container header={<Header variant="h3">🔑 The Core Intuition: Two Clocks</Header>}>
          <SpaceBetween size="s">
            <Box variant="p">
              Before touching any numbers, here is the mental model to carry through all 9 steps:
            </Box>
            <div style={{ background: '#e8f0fe', padding: '20px', borderRadius: '8px', border: '1px solid #4a90d9' }}>
              <strong>Imagine a clock with two pairs of hands.</strong><br /><br />
              • The <strong>first pair</strong> (hour + minute) moves <em>fast</em> — it completes a full rotation every ~6 positions.<br />
              • The <strong>second pair</strong> moves <em>100× slower</em> — it takes ~628 positions for one full rotation.<br /><br />
              Each position gives a unique combination of fast-hand angle and slow-hand angle.
              No two positions ever show the same clock face.<br /><br />
              In positional encoding:<br />
              &nbsp;&nbsp;<strong>Dimensions 0 and 1</strong> = the fast clock pair (sin and cos at high frequency)<br />
              &nbsp;&nbsp;<strong>Dimensions 2 and 3</strong> = the slow clock pair (sin and cos at low frequency)<br /><br />
              Together, 4 numbers uniquely fingerprint any position from 0 to thousands.
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
          <strong>Your focus word:</strong> We will track{' '}
          <span style={{ background: '#ffebee', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
            "apple"
          </span>{' '}
          at <strong>position 2</strong> (0-indexed) throughout all 9 steps.
          By the end, you will see exactly how "apple" gets a unique position fingerprint added to its embedding.
        </StudentNote>

        <Box variant="h3">Word Embeddings (4-dimensional, same as the Self-Attention tutorial)</Box>
        <StudentNote title="Why the Same Embeddings?">
          Positional encoding happens <em>before</em> self-attention, on the same raw word embeddings.
          If you completed the Self-Attention tutorial, these are the exact same starting vectors.
          We use 4 dimensions so you can track every number by hand.<br /><br />
          In real transformers (GPT-2, BERT) the embedding dimension is 768 or 1024 — but the
          positional encoding formula works identically; there are just more dimension pairs.
        </StudentNote>

        <Table
          columnDefinitions={[
            { id: 'position', header: 'Position (pos)', cell: item => item.position },
            { id: 'word', header: 'Word', cell: item => item.word },
            { id: 'embedding', header: 'Original Embedding [dim0, dim1, dim2, dim3]', cell: item => item.embedding }
          ]}
          items={[
            { position: 'pos = 0', word: 'I', embedding: '[1.000, 0.200, 0.500, 0.300]' },
            { position: 'pos = 1', word: 'bought', embedding: '[0.800, 1.000, 0.300, 0.600]' },
            { position: 'pos = 2', word: '🍎 apple', embedding: '[0.600, 0.400, 1.000, 0.200] ← YOUR FOCUS WORD' },
            { position: 'pos = 3', word: 'to', embedding: '[0.300, 0.700, 0.200, 0.800]' },
            { position: 'pos = 4', word: 'eat', embedding: '[0.900, 0.600, 0.400, 1.000]' }
          ]}
          variant="embedded"
        />

        <StudentNote title="What Is Position 0-Indexed?">
          Computers count from 0. The first word "I" is at position 0, "bought" at position 1, and so on.
          This matches how the original "Attention Is All You Need" paper defines positions.
          We will plug these numbers (0, 1, 2, 3, 4) directly into the formula on the next step.
        </StudentNote>

      </SpaceBetween>
    </StepContainer>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — The Sinusoidal Formula
// ─────────────────────────────────────────────────────────────────────────────
function Step1({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={2}
      title="The Sinusoidal Formula"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">

        <StudentNote title="What Is Positional Encoding?">
          A positional encoding (PE) is a 4-dimensional vector — one per word — computed
          purely from the word's position number. It contains no information about what the word
          <em> means</em>; it only encodes <em>where</em> the word sits in the sentence.<br /><br />
          We add this vector to the word's embedding. The result is still a 4D vector, but now
          it carries both "meaning" and "position" information blended together.
        </StudentNote>

        <Container header={<Header variant="h3">📐 The Formula (from "Attention Is All You Need", 2017)</Header>}>
          <div style={{
            background: '#f8f9fa',
            padding: '24px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '15px',
            lineHeight: '2.2',
            textAlign: 'center',
            border: '2px solid #667eea'
          }}>
            <strong>For even dimensions (0, 2, 4, ...):</strong><br />
            PE(pos, 2i) = sin( pos / 10000<sup>2i / d_model</sup> )<br /><br />
            <strong>For odd dimensions (1, 3, 5, ...):</strong><br />
            PE(pos, 2i+1) = cos( pos / 10000<sup>2i / d_model</sup> )
          </div>
        </Container>

        <Container header={<Header variant="h3">🔤 Symbol Guide — What Every Letter Means</Header>}>
          <Table
            columnDefinitions={[
              { id: 'symbol', header: 'Symbol', cell: item => item.symbol },
              { id: 'meaning', header: 'Meaning', cell: item => item.meaning },
              { id: 'value', header: 'Value in Our Example', cell: item => item.value },
            ]}
            items={[
              { symbol: 'pos', meaning: 'Position of the word in the sentence (0-indexed)', value: '0, 1, 2, 3, or 4' },
              { symbol: 'i', meaning: 'Dimension pair index — pairs of (sin, cos) dimensions', value: '0 for dims (0,1) / 1 for dims (2,3)' },
              { symbol: 'd_model', meaning: 'Total embedding dimension', value: '4 in this tutorial; 768 in BERT' },
              { symbol: '10000', meaning: 'Scaling constant chosen by the paper authors', value: '10000 (always)' },
              { symbol: '2i', meaning: 'Even dimension index (0, 2, 4, ...)', value: '0 for pair 0 / 2 for pair 1' },
              { symbol: '2i+1', meaning: 'Odd dimension index (1, 3, 5, ...)', value: '1 for pair 0 / 3 for pair 1' },
            ]}
            variant="embedded"
          />
        </Container>

        <Container header={<Header variant="h3">🎯 The Even / Odd Dimension Rule</Header>}>
          <div style={{ background: '#fff8e1', padding: '20px', borderRadius: '8px', border: '1px solid #f9a825' }}>
            <strong>The key rule to memorise:</strong><br /><br />
            &nbsp;&nbsp;• <strong>Even dimensions (0, 2)</strong> always use <strong>sin( )</strong><br />
            &nbsp;&nbsp;• <strong>Odd dimensions (1, 3)</strong> always use <strong>cos( )</strong><br /><br />
            With d_model = 4 we have exactly <strong>2 dimension pairs</strong>:<br /><br />
            <div style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '2', marginLeft: '16px' }}>
              Pair i=0 → covers <strong>dim 0</strong> (sin) and <strong>dim 1</strong> (cos)<br />
              Pair i=1 → covers <strong>dim 2</strong> (sin) and <strong>dim 3</strong> (cos)
            </div>
            <br />
            Both dimensions in a pair use the <em>same denominator</em> (10000^(2i/d_model)),
            but one applies sin and the other applies cos. This pairs them on a unit circle,
            giving each position a geometric identity rather than just a number.
          </div>
        </Container>

        <Container header={<Header variant="h3">📋 Expanding the Formula for Our 4 Dimensions</Header>}>
          <div style={{
            background: '#e8f5e8',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #27ae60',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '2.2'
          }}>
            <strong>Plugging in d_model = 4:</strong><br /><br />
            Dim 0 (even, i=0): &nbsp;PE(pos, 0) = sin( pos / 10000<sup>0/4</sup> ) = sin( pos / 10000<sup>0</sup> ) = sin( pos / <strong>1.000</strong> )<br />
            Dim 1 (odd,  i=0): &nbsp;PE(pos, 1) = cos( pos / 10000<sup>0/4</sup> ) = cos( pos / 10000<sup>0</sup> ) = cos( pos / <strong>1.000</strong> )<br />
            Dim 2 (even, i=1): &nbsp;PE(pos, 2) = sin( pos / 10000<sup>2/4</sup> ) = sin( pos / 10000<sup>0.5</sup> ) = sin( pos / <strong>100.0</strong> )<br />
            Dim 3 (odd,  i=1): &nbsp;PE(pos, 3) = cos( pos / 10000<sup>2/4</sup> ) = cos( pos / 10000<sup>0.5</sup> ) = cos( pos / <strong>100.0</strong> )
          </div>
          <StudentNote>
            The two denominators are <strong>1.0</strong> and <strong>100.0</strong>. We will derive these step by step on the next page, but notice already: dims 0 and 1 divide by 1 (full speed), dims 2 and 3 divide by 100 (1/100 speed).
          </StudentNote>
        </Container>

        <StudentNote title="Why Sin and Cosine? Why Not Just the Position Number?">
          Great question. Three reasons:<br /><br />
          1. <strong>Bounded range:</strong> sin and cos always stay between −1 and +1.
             Embedding values typically live in this range too — adding large position numbers
             (e.g. 512) would swamp the word meaning completely.<br /><br />
          2. <strong>Smooth and periodic:</strong> Nearby positions get similar encodings.
             The model can generalise "position +1 means next word" from the smooth gradient.<br /><br />
          3. <strong>Relative positions are learnable:</strong> The transformer can express
             "the word 2 positions ago" as a linear transformation of the current PE —
             a mathematical property unique to sinusoids.
        </StudentNote>

      </SpaceBetween>
    </StepContainer>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Frequency Denominators
// ─────────────────────────────────────────────────────────────────────────────
function Step2({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={3}
      title="Computing the Frequency Denominators"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">

        <StudentNote title="What Is a Frequency Denominator?">
          Before we can compute any PE value, we need to know what number to
          <em> divide the position by</em> for each dimension pair.<br /><br />
          That number is 10000^(2i/d_model). It controls how fast or slow the sine/cosine
          wave oscillates as position increases. A small denominator → divide by a small
          number → the angle grows quickly → high frequency.
          A large denominator → the angle grows slowly → low frequency.
        </StudentNote>

        <Container header={<Header variant="h3">🔢 Computing Each Denominator (d_model = 4)</Header>}>
          <SpaceBetween size="s">

            <div style={{
              background: '#e8f0fe',
              padding: '20px',
              borderRadius: '8px',
              border: '2px solid #4a90d9',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '2.5'
            }}>
              <strong>Pair i = 0 (covers dims 0 and 1):</strong><br />
              &nbsp;&nbsp;exponent = 2 × 0 / 4 = 0<br />
              &nbsp;&nbsp;denominator = 10000<sup>0</sup> = <strong style={{ fontSize: '16px', color: '#1565c0' }}>1.000</strong><br />
              &nbsp;&nbsp;→ Dims 0 and 1 divide position by <strong>1.000</strong> (no scaling)<br /><br />

              <strong>Pair i = 1 (covers dims 2 and 3):</strong><br />
              &nbsp;&nbsp;exponent = 2 × 1 / 4 = 0.5<br />
              &nbsp;&nbsp;denominator = 10000<sup>0.5</sup> = √10000 = <strong style={{ fontSize: '16px', color: '#1565c0' }}>100.000</strong><br />
              &nbsp;&nbsp;→ Dims 2 and 3 divide position by <strong>100.000</strong>
            </div>

            <StudentNote title="How to Read 10000^0.5">
              10000^0.5 means "10000 to the power of 0.5", which is the same as √10000 (square root of 10000).<br /><br />
              √10000 = 100, because 100 × 100 = 10000. No calculator needed for this step!<br /><br />
              In general: 10000^(0) = 1, 10000^(0.25) ≈ 10, 10000^(0.5) = 100,
              10000^(0.75) ≈ 1000, 10000^(1) = 10000. The exponent grows from 0 to 1 across the dimension pairs.
            </StudentNote>

          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h3">⏱️ The Two-Clock Analogy — Fast and Slow Oscillators</Header>}>
          <SpaceBetween size="s">
            <div style={{ background: '#fff8e1', padding: '20px', borderRadius: '8px', border: '1px solid #f9a825' }}>
              <strong>Fast clock (dims 0 and 1) — denominator = 1.0:</strong><br />
              When position increases by 1, the angle increases by 1 radian (≈ 57°).
              A full cycle (360° = 2π radians) completes in just ~6.28 positions.
              These dimensions can clearly distinguish close positions like 0, 1, 2, 3.<br /><br />

              <strong>Slow clock (dims 2 and 3) — denominator = 100.0:</strong><br />
              When position increases by 1, the angle increases by only 0.01 radians (≈ 0.57°).
              A full cycle takes ~628 positions.
              These dimensions change so slowly they encode global position across very long documents.
            </div>

            <Table
              columnDefinitions={[
                { id: 'pair', header: 'Dimension Pair', cell: item => item.pair },
                { id: 'denom', header: 'Denominator', cell: item => item.denom },
                { id: 'speed', header: 'Angle per step', cell: item => item.speed },
                { id: 'cycle', header: 'Full cycle every', cell: item => item.cycle },
                { id: 'good', header: 'Best for distinguishing', cell: item => item.good },
              ]}
              items={[
                { pair: 'i=0 (dims 0, 1)', denom: '1.000', speed: '+1.000 rad', cycle: '~6 positions', good: 'Adjacent words (local)' },
                { pair: 'i=1 (dims 2, 3)', denom: '100.000', speed: '+0.010 rad', cycle: '~628 positions', good: 'Distant sections (global)' },
              ]}
              variant="embedded"
            />
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h3">📐 The Angles We Will Use for "apple" (pos = 2)</Header>}>
          <div style={{
            background: '#ffebee',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '2.2'
          }}>
            <strong>🍎 Apple is at pos = 2. What angle does each dimension use?</strong><br /><br />
            Dim 0 (sin, denom=1.0):   angle = 2 / 1.0 &nbsp;= <strong>2.000 radians</strong><br />
            Dim 1 (cos, denom=1.0):   angle = 2 / 1.0 &nbsp;= <strong>2.000 radians</strong><br />
            Dim 2 (sin, denom=100.0): angle = 2 / 100.0 = <strong>0.020 radians</strong><br />
            Dim 3 (cos, denom=100.0): angle = 2 / 100.0 = <strong>0.020 radians</strong><br /><br />
            Both dims in a pair share the same angle — but one applies sin and the other cos.
          </div>
        </Container>

        <TryYourself>
          <Box variant="h4">Try It Yourself — Apple's Dim 2 Angle</Box>
          <Box variant="p">
            Apple is at pos = 2. The denominator for pair i=1 is 100.0.<br />
            What is the angle? → pos / denominator = 2 / 100 = ?
          </Box>
          <InteractiveInput
            label="Your answer (in radians):"
            correctAnswer={0.020}
            hint="2 ÷ 100 = 0.020. This tiny angle (less than 1°) is why the slow clock barely moves per step."
            tolerance={0.001}
          />
        </TryYourself>

        <StudentNote title="Summary So Far">
          We now know everything needed to compute PE values:<br /><br />
          &nbsp;&nbsp;• Dim 0: <strong>sin(pos / 1.0)</strong><br />
          &nbsp;&nbsp;• Dim 1: <strong>cos(pos / 1.0)</strong><br />
          &nbsp;&nbsp;• Dim 2: <strong>sin(pos / 100.0)</strong><br />
          &nbsp;&nbsp;• Dim 3: <strong>cos(pos / 100.0)</strong><br /><br />
          Plug in the position number, evaluate sin or cos, and you have the PE value for that dimension.
          Let's compute the actual values now, starting with position 0.
        </StudentNote>

      </SpaceBetween>
    </StepContainer>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — PE for Positions 0 and 1
// ─────────────────────────────────────────────────────────────────────────────
function Step3({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={4}
      title='PE for Position 0 ("I") and Position 1 ("bought")'
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">

        <StudentNote title="Reading Sin and Cos Values">
          We now plug position numbers into sin( ) and cos( ) to get actual PE values.
          All angles are in <strong>radians</strong> (not degrees).<br /><br />
          Useful reference values:<br />
          &nbsp;&nbsp;sin(0) = 0.000 &nbsp;|&nbsp; cos(0) = 1.000<br />
          &nbsp;&nbsp;sin(1) = 0.841 &nbsp;|&nbsp; cos(1) = 0.540<br />
          &nbsp;&nbsp;sin(2) = 0.909 &nbsp;|&nbsp; cos(2) = −0.416<br />
          &nbsp;&nbsp;sin(3) = 0.141 &nbsp;|&nbsp; cos(3) = −0.990<br />
          &nbsp;&nbsp;sin(4) = −0.757 &nbsp;|&nbsp; cos(4) = −0.654<br /><br />
          These come from a calculator or Python's math library.
          You don't need to derive them — just look them up and substitute.
        </StudentNote>

        <Container header={<Header variant="h3">Position 0 — "I" (First Word)</Header>}>
          <div style={{
            background: '#f0f4ff',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #667eea',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '2.2'
          }}>
            <strong>All four dimensions for pos = 0:</strong><br /><br />
            Dim 0 (sin): PE(0, dim0) = sin(0 / 1.0)   = sin(<strong>0.000</strong>) = <strong>0.000</strong><br />
            Dim 1 (cos): PE(0, dim1) = cos(0 / 1.0)   = cos(<strong>0.000</strong>) = <strong>1.000</strong><br />
            Dim 2 (sin): PE(0, dim2) = sin(0 / 100.0) = sin(<strong>0.000</strong>) = <strong>0.000</strong><br />
            Dim 3 (cos): PE(0, dim3) = cos(0 / 100.0) = cos(<strong>0.000</strong>) = <strong>1.000</strong><br /><br />
            <div style={{ background: '#c5cae9', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
              <strong>PE(pos=0) = [0.000, 1.000, 0.000, 1.000]</strong>
            </div>
          </div>

          <StudentNote title="Why Is Position 0 Always [0, 1, 0, 1]?">
            Because <strong>sin(0) = 0</strong> and <strong>cos(0) = 1</strong> for <em>any</em> denominator —
            zero divided by anything is still zero, and sin(0) is always 0, cos(0) is always 1.<br /><br />
            This means the first word in <em>every sentence</em> always gets the same positional encoding
            [0, 1, 0, 1]. Its position-aware embedding = original embedding + [0, 1, 0, 1].
          </StudentNote>
        </Container>

        <Container header={<Header variant="h3">Position 1 — "bought" (Second Word)</Header>}>
          <div style={{
            background: '#f0f4ff',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #667eea',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '2.2'
          }}>
            <strong>All four dimensions for pos = 1:</strong><br /><br />
            Dim 0 (sin): PE(1, dim0) = sin(1 / 1.0)   = sin(<strong>1.000</strong>) = <strong>0.841</strong><br />
            Dim 1 (cos): PE(1, dim1) = cos(1 / 1.0)   = cos(<strong>1.000</strong>) = <strong>0.540</strong><br />
            Dim 2 (sin): PE(1, dim2) = sin(1 / 100.0) = sin(<strong>0.010</strong>) = <strong>0.010</strong><br />
            Dim 3 (cos): PE(1, dim3) = cos(1 / 100.0) = cos(<strong>0.010</strong>) = <strong>1.000</strong><br /><br />
            <div style={{ background: '#c5cae9', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
              <strong>PE(pos=1) = [0.841, 0.540, 0.010, 1.000]</strong>
            </div>
          </div>

          <StudentNote title="Key Observation — Fast vs Slow Clocks in Action">
            Compare position 0 and position 1 side by side:<br /><br />
            <div style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '2' }}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dim 0 &nbsp;&nbsp;&nbsp;Dim 1 &nbsp;&nbsp;&nbsp;Dim 2 &nbsp;&nbsp;&nbsp;Dim 3<br />
              Pos 0: &nbsp;&nbsp;&nbsp;&nbsp;[0.000, &nbsp;1.000, &nbsp;0.000, &nbsp;1.000]<br />
              Pos 1: &nbsp;&nbsp;&nbsp;&nbsp;[0.841, &nbsp;0.540, &nbsp;0.010, &nbsp;1.000]<br />
              Change: &nbsp;&nbsp;[+0.841, −0.460, +0.010, +0.000]
            </div>
            <br />
            Dims 0 and 1 changed by <strong>0.841 and −0.460</strong> — large changes, easy to distinguish.<br />
            Dim 2 changed by only <strong>0.010</strong> — tiny.<br />
            Dim 3 changed by <strong>0.000</strong> (at 3 decimal places) — effectively zero!<br /><br />
            The slow clock (dims 2, 3) barely moved. It reserves its precision for distinguishing
            positions hundreds of steps apart — where the fast clock has looped around many times
            and can no longer be trusted alone.
          </StudentNote>
        </Container>

        <TryYourself>
          <Box variant="h4">Verify "bought" — PE(1, dim 1)</Box>
          <Box variant="p">
            PE(1, dim 1) = cos(1 / 1.0) = cos(1.000) = ?<br />
            Use the reference table at the top of this step.
          </Box>
          <InteractiveInput
            label="Your answer:"
            correctAnswer={0.540}
            hint="cos(1 radian) = 0.5403. We round to 0.540. Note: this is NOT cos(1°) — it is cos(1 radian) ≈ cos(57.3°)."
            tolerance={0.01}
          />
        </TryYourself>

      </SpaceBetween>
    </StepContainer>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Step 4 — PE for Position 2 ("apple") — Full Worked Example
// ─────────────────────────────────────────────────────────────────────────────
function Step4({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={5}
      title='PE for Position 2 — "apple" (Full Worked Example)'
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">

        <StudentNote title="Apple Gets Its Position Fingerprint">
          "Apple" sits at position 2. We now compute all four PE components
          that will be added to apple's embedding.<br /><br />
          Pay close attention to <strong>dim 1: it will be negative!</strong>
          That is not an error — negative PE values are what distinguish position 2
          from position 0 (which had cos(0) = +1.000 in dim 1).
          The sign flip is a feature, not a bug.
        </StudentNote>

        <Container header={<Header variant="h3">🍎 Apple's Positional Encoding — All 4 Dimensions</Header>}>
          <div style={{
            background: '#ffebee',
            padding: '24px',
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '2.5'
          }}>
            <strong>pos = 2 | d_model = 4 | denominators: 1.0 (pair 0) and 100.0 (pair 1)</strong><br /><br />

            <strong>Dim 0 — sin (pair i=0):</strong><br />
            &nbsp;&nbsp;angle = pos / denominator = 2 / 1.0 = 2.000 radians<br />
            &nbsp;&nbsp;PE(2, dim0) = sin(2.000) = <strong style={{ fontSize: '16px', color: '#27ae60' }}>0.909</strong><br /><br />

            <strong>Dim 1 — cos (pair i=0):</strong><br />
            &nbsp;&nbsp;angle = pos / denominator = 2 / 1.0 = 2.000 radians<br />
            &nbsp;&nbsp;PE(2, dim1) = cos(2.000) = <strong style={{ fontSize: '16px', color: '#e74c3c' }}>−0.416</strong> &nbsp;⚠️ NEGATIVE!<br /><br />

            <strong>Dim 2 — sin (pair i=1):</strong><br />
            &nbsp;&nbsp;angle = pos / denominator = 2 / 100.0 = 0.020 radians<br />
            &nbsp;&nbsp;PE(2, dim2) = sin(0.020) ≈ <strong style={{ fontSize: '16px', color: '#27ae60' }}>0.020</strong> &nbsp;(tiny — slow clock)<br /><br />

            <strong>Dim 3 — cos (pair i=1):</strong><br />
            &nbsp;&nbsp;angle = pos / denominator = 2 / 100.0 = 0.020 radians<br />
            &nbsp;&nbsp;PE(2, dim3) = cos(0.020) = 0.99980 ≈ <strong style={{ fontSize: '16px', color: '#27ae60' }}>1.000</strong><br /><br />

            <div style={{ background: '#ffcdd2', padding: '12px', borderRadius: '4px', textAlign: 'center', fontSize: '16px' }}>
              <strong>PE(pos=2) = [0.909, −0.416, 0.020, 1.000]</strong>
            </div>
          </div>
        </Container>

        <Container header={<Header variant="h3">⚠️ Why Is cos(2) Negative?</Header>}>
          <SpaceBetween size="s">
            <Box variant="p">
              The cosine function starts at +1 (at 0 radians), crosses zero at π/2 ≈ 1.57 radians,
              and reaches its minimum at π ≈ 3.14 radians. Position 2 is at 2.0 radians —
              past the zero crossing, so cos(2) = −0.416.
            </Box>
            <div style={{ background: '#fff8e1', padding: '16px', borderRadius: '8px', border: '1px solid #f9a825', fontFamily: 'monospace', fontSize: '13px', lineHeight: '2' }}>
              <strong>Cosine values at key positions:</strong><br />
              pos 0: cos(0.0) = +1.000 &nbsp;(start of cycle — maximum)<br />
              pos 1: cos(1.0) = +0.540 &nbsp;(still positive, heading down)<br />
              pos 2: cos(2.0) = −0.416 &nbsp;← apple (past the zero crossing!)<br />
              pos 3: cos(3.0) = −0.990 &nbsp;(near the minimum)<br />
              pos 4: cos(4.0) = −0.654 &nbsp;(heading back up)
            </div>
            <StudentNote title="This Negative Value Is Important">
              If cos were always positive, positions 0 and ~4.7 (which has cos ≈ 0) would be hard
              to distinguish from each other using dim 1 alone. The negative range effectively
              doubles the discriminative power of each cosine dimension.
              The model learns to interpret both positive and negative PE components as part of the position signal.
            </StudentNote>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h3">📏 Small-Angle Approximation — Why sin(0.02) ≈ 0.020</Header>}>
          <div style={{ background: '#f0f4ff', padding: '16px', borderRadius: '8px', border: '1px solid #c5cae9' }}>
            For very small angles (close to 0 radians), sin(x) ≈ x. This is the small-angle approximation.<br /><br />
            sin(0.020) = 0.019999 ≈ 0.020 ✓<br />
            sin(0.030) = 0.029996 ≈ 0.030 ✓<br />
            sin(0.010) = 0.009999 ≈ 0.010 ✓<br /><br />
            This means dims 2 and 3 (the slow clock) are nearly linear in position for short sequences.
            The PE value in dim 2 essentially tells you "approximately how far into the sequence this word is"
            — a very clean position number, before any oscillation kicks in.
          </div>
        </Container>

        <TryYourself>
          <Box variant="h4">Verify Apple's PE — Dim 0</Box>
          <Box variant="p">
            PE(2, dim 0) = sin(2 / 1.0) = sin(2.000) = ?<br />
            Hint: use the reference table from Step 4 (sin and cos values for integers 0–4).
          </Box>
          <InteractiveInput
            label="Your answer:"
            correctAnswer={0.909}
            hint="sin(2 radians) = 0.9093. We round to 0.909. Remember: 2 radians ≈ 114.6°, and sin(114.6°) = 0.909."
            tolerance={0.005}
          />
        </TryYourself>

        <StudentNote title="Apple's Positional Fingerprint — Interpretation">
          <strong>PE(pos=2) = [0.909, −0.416, 0.020, 1.000]</strong><br /><br />
          Read it as: "I am at position 2 in the sentence."<br /><br />
          &nbsp;&nbsp;• <strong>Dim 0 (+0.909):</strong> Fast clock is near its peak — we are about 1/3 of the way through a fast cycle.<br />
          &nbsp;&nbsp;• <strong>Dim 1 (−0.416):</strong> Fast clock has passed the zero crossing — negative range, position &gt; 1.57.<br />
          &nbsp;&nbsp;• <strong>Dim 2 (+0.020):</strong> Slow clock has barely moved — only 0.020 radians from start.<br />
          &nbsp;&nbsp;• <strong>Dim 3 (+1.000):</strong> Slow clock is essentially still at the beginning (cos ≈ 1).<br /><br />
          No other position from 0 to thousands will produce this exact four-number combination.
        </StudentNote>

      </SpaceBetween>
    </StepContainer>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Step 5 — All 5 PE Vectors
// ─────────────────────────────────────────────────────────────────────────────
function Step5({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={6}
      title="All 5 PE Vectors — The Complete Table"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">

        <StudentNote title="Building the Full PE Table">
          We now compute the remaining two positions (3 and 4) and assemble all 5 PE vectors
          into a single table. After this step you will see the patterns clearly — which
          dimensions change rapidly and which barely move.
        </StudentNote>

        <Container header={<Header variant="h3">Positions 3 and 4 — Calculation Summary</Header>}>
          <div style={{
            background: '#f0f4ff',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #667eea',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '2.2'
          }}>
            <strong>pos = 3 ("to"):</strong><br />
            &nbsp;&nbsp;Dim 0: sin(3 / 1.0)   = sin(3.000) = <strong>0.141</strong><br />
            &nbsp;&nbsp;Dim 1: cos(3 / 1.0)   = cos(3.000) = <strong>−0.990</strong><br />
            &nbsp;&nbsp;Dim 2: sin(3 / 100.0) = sin(0.030) = <strong>0.030</strong><br />
            &nbsp;&nbsp;Dim 3: cos(3 / 100.0) = cos(0.030) = <strong>1.000</strong> (= 0.99955, rounds to 1.000)<br />
            <div style={{ background: '#c5cae9', padding: '6px 10px', borderRadius: '4px', marginTop: '8px' }}>
              PE(3) = [0.141, −0.990, 0.030, 1.000]
            </div>
            <br />
            <strong>pos = 4 ("eat"):</strong><br />
            &nbsp;&nbsp;Dim 0: sin(4 / 1.0)   = sin(4.000) = <strong>−0.757</strong><br />
            &nbsp;&nbsp;Dim 1: cos(4 / 1.0)   = cos(4.000) = <strong>−0.654</strong><br />
            &nbsp;&nbsp;Dim 2: sin(4 / 100.0) = sin(0.040) = <strong>0.040</strong><br />
            &nbsp;&nbsp;Dim 3: cos(4 / 100.0) = cos(0.040) = <strong>0.999</strong> (= 0.99920)<br />
            <div style={{ background: '#c5cae9', padding: '6px 10px', borderRadius: '4px', marginTop: '8px' }}>
              PE(4) = [−0.757, −0.654, 0.040, 0.999]
            </div>
          </div>
        </Container>

        <Container header={<Header variant="h3">📊 Complete PE Table — All 5 Positions</Header>}>
          <Table
            columnDefinitions={[
              { id: 'pos', header: 'pos', cell: item => item.pos },
              { id: 'word', header: 'Word', cell: item => item.word },
              { id: 'd0', header: 'Dim 0 (sin fast)', cell: item => item.d0 },
              { id: 'd1', header: 'Dim 1 (cos fast)', cell: item => item.d1 },
              { id: 'd2', header: 'Dim 2 (sin slow)', cell: item => item.d2 },
              { id: 'd3', header: 'Dim 3 (cos slow)', cell: item => item.d3 },
            ]}
            items={[
              { pos: '0', word: 'I', d0: '0.000', d1: '1.000', d2: '0.000', d3: '1.000' },
              { pos: '1', word: 'bought', d0: '0.841', d1: '0.540', d2: '0.010', d3: '1.000' },
              { pos: '2', word: '🍎 apple', d0: '0.909', d1: '−0.416', d2: '0.020', d3: '1.000' },
              { pos: '3', word: 'to', d0: '0.141', d1: '−0.990', d2: '0.030', d3: '1.000' },
              { pos: '4', word: 'eat', d0: '−0.757', d1: '−0.654', d2: '0.040', d3: '0.999' },
            ]}
            variant="embedded"
          />
        </Container>

        <Container header={<Header variant="h3">🔍 Pattern Observations</Header>}>
          <SpaceBetween size="s">

            <div style={{ background: '#e8f5e8', padding: '16px', borderRadius: '8px', border: '2px solid #27ae60' }}>
              <strong>Observation 1 — Dims 0 and 1 change wildly (fast clock):</strong><br />
              0.000 → 0.841 → 0.909 → 0.141 → −0.757 (dim 0)<br />
              The values are large, oscillate freely, and include negative numbers.
              These dimensions are highly sensitive to small position differences.
              They distinguish adjacent words clearly.
            </div>

            <div style={{ background: '#e8f0fe', padding: '16px', borderRadius: '8px', border: '2px solid #4a90d9' }}>
              <strong>Observation 2 — Dims 2 and 3 barely move (slow clock):</strong><br />
              Dim 2: 0.000 → 0.010 → 0.020 → 0.030 → 0.040 (increases by exactly 0.010 per step!)<br />
              Dim 3: 1.000 → 1.000 → 1.000 → 1.000 → 0.999 (virtually constant over 5 positions)<br />
              For our 5-word sentence, the slow clock contributes almost no discriminating information.
              It becomes crucial for sentences of hundreds or thousands of tokens.
            </div>

            <div style={{ background: '#fff8e1', padding: '16px', borderRadius: '8px', border: '1px solid #f9a825' }}>
              <strong>Observation 3 — All 5 rows are unique:</strong><br />
              Even though dims 2 and 3 look nearly identical, no two rows are the same vector.
              The combination of all 4 values is unique per position — that is the guarantee we need.
            </div>

            <div style={{ background: '#fce4ec', padding: '16px', borderRadius: '8px', border: '1px solid #f06292' }}>
              <strong>Observation 4 — Negatives appear:</strong><br />
              Positions 2, 3, 4 all have at least one negative PE value in dims 0 or 1.
              This is expected — sine and cosine range from −1 to +1.
              The model has no problem with negative values; it learns from sign patterns too.
            </div>

          </SpaceBetween>
        </Container>

        <TryYourself>
          <Box variant="h4">Verify Position 3 — "to" — Dim 0</Box>
          <Box variant="p">
            PE(3, dim 0) = sin(3 / 1.0) = sin(3.000) = ?<br />
            Use the reference table: sin(3) = 0.1411.
          </Box>
          <InteractiveInput
            label="Your answer:"
            correctAnswer={0.141}
            hint="sin(3 radians) = 0.1411. We round to 0.141. Note: at 3 radians (≈171.9°) we are almost back to zero — the fast clock is about to complete its first half-cycle."
            tolerance={0.01}
          />
        </TryYourself>

        <Alert type="success" header="✅ All 5 PE Vectors Computed">
          We now have a unique 4-dimensional position fingerprint for every word.
          Next step: we add each PE vector to its word's original embedding.
          That simple addition is all it takes to make the transformer position-aware.
        </Alert>

      </SpaceBetween>
    </StepContainer>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Step 6 — The Addition: X + PE for "apple"
// ─────────────────────────────────────────────────────────────────────────────
function Step6({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={7}
      title='The Addition — X + PE for "apple"'
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">

        <StudentNote title="The Simplest Operation in the Whole Transformer">
          After all that formula work, the actual operation is just:<br /><br />
          <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
            position-aware embedding = original embedding + PE vector
          </div>
          <br />
          Component by component. No matrix multiplication, no dot products — just element-wise addition.
          Each of the 4 numbers in the PE adds directly to the corresponding number in the embedding.
        </StudentNote>

        <Container header={<Header variant="h3">🍎 Apple's Full Addition — Step by Step</Header>}>
          <div style={{
            background: '#ffebee',
            padding: '24px',
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '2.5'
          }}>
            <strong>apple original embedding (pos=2): [0.600, 0.400, 1.000, 0.200]</strong><br />
            <strong>apple PE (pos=2):                   [0.909, −0.416, 0.020, 1.000]</strong><br />
            <br />
            <strong>Dim 0:</strong> 0.600 + 0.909 = <strong style={{ fontSize: '16px', color: '#27ae60' }}>1.509</strong><br />
            <strong>Dim 1:</strong> 0.400 + (−0.416) = 0.400 − 0.416 = <strong style={{ fontSize: '16px', color: '#e74c3c' }}>−0.016</strong> &nbsp;⚠️ NEGATIVE result!<br />
            <strong>Dim 2:</strong> 1.000 + 0.020 = <strong style={{ fontSize: '16px', color: '#27ae60' }}>1.020</strong><br />
            <strong>Dim 3:</strong> 0.200 + 1.000 = <strong style={{ fontSize: '16px', color: '#27ae60' }}>1.200</strong><br /><br />

            <div style={{ background: '#ffcdd2', padding: '12px', borderRadius: '4px', textAlign: 'center', fontSize: '16px' }}>
              <strong>Apple position-aware embedding = [1.509, −0.016, 1.020, 1.200]</strong>
            </div>
          </div>
        </Container>

        <Container header={<Header variant="h3">⚠️ Dim 1 Went Negative — Is That a Problem?</Header>}>
          <SpaceBetween size="s">
            <Box variant="p">
              Apple's original dim 1 was +0.400. After adding PE (−0.416), the result is −0.016.
            </Box>
            <div style={{ background: '#fff8e1', padding: '16px', borderRadius: '8px', border: '1px solid #f9a825' }}>
              <strong>This is completely fine, and here is why:</strong><br /><br />
              1. The transformer's weight matrices (W_Q, W_K, W_V) are learned on position-aware
                 embeddings from the start of training. They have never seen raw embeddings without PE,
                 so they are calibrated to handle both positive and negative input values.<br /><br />
              2. The negative value is <em>informative</em>: it signals "I am at a position where
                 the fast cosine clock has crossed zero and gone negative." That is useful information.<br /><br />
              3. Compare: if we had used position 0 ("I"), dim 1 would be 0.200 + 1.000 = +1.200 — positive.
                 The sign difference between +1.200 and −0.016 is exactly how the model tells "I" and "apple" apart.
            </div>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h3">📋 The Addition Visualised</Header>}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#667eea', color: 'white' }}>
                  <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Component</th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Original embedding</th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>+ PE value</th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>= Position-aware value</th>
                  <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>What changed</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { comp: 'Dim 0 (sin fast)', orig: '0.600', pe: '+0.909', result: '1.509', note: 'Pushed higher — fast sin at its peak' },
                  { comp: 'Dim 1 (cos fast)', orig: '0.400', pe: '−0.416', result: '−0.016', note: '⚠️ Sign flip — fast cos past zero crossing', red: true },
                  { comp: 'Dim 2 (sin slow)', orig: '1.000', pe: '+0.020', result: '1.020', note: 'Barely changed — slow clock' },
                  { comp: 'Dim 3 (cos slow)', orig: '0.200', pe: '+1.000', result: '1.200', note: 'Pushed up by +1 from slow cos start' },
                ].map((row, i) => (
                  <tr key={i} style={{ background: row.red ? '#ffebee' : '#f8f9fa' }}>
                    <td style={{ padding: '8px 10px', border: '1px solid #ddd', fontWeight: 'bold' }}>{row.comp}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', border: '1px solid #ddd' }}>{row.orig}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', border: '1px solid #ddd' }}>{row.pe}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', border: '1px solid #ddd', fontWeight: 'bold' }}>{row.result}</td>
                    <td style={{ padding: '8px 10px', border: '1px solid #ddd', fontSize: '12px' }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>

        <TryYourself>
          <Box variant="h4">Verify Apple's New Dim 3</Box>
          <Box variant="p">
            Apple original dim 3 = 0.200. PE(2, dim 3) = cos(0.02) ≈ 1.000.<br />
            New dim 3 = 0.200 + 1.000 = ?
          </Box>
          <InteractiveInput
            label="Your answer:"
            correctAnswer={1.200}
            hint="0.200 + 1.000 = 1.200. The slow cosine clock starts near 1.0 for all positions in our short sentence, so it adds approximately 1 to every word's dim 3."
            tolerance={0.005}
          />
        </TryYourself>

        <StudentNote title="A Key Property — The Operation Is Reversible">
          Since we are doing simple addition, subtraction retrieves the original embedding:<br /><br />
          <div style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '2', padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>
            [1.509, −0.016, 1.020, 1.200] − [0.909, −0.416, 0.020, 1.000] = [0.600, 0.400, 1.000, 0.200] ✓
          </div>
          <br />
          In theory, the model can always "undo" the position to recover the pure meaning.
          In practice, the transformer learns to fuse them — the multi-layer architecture
          extracts position and meaning together through self-attention.
        </StudentNote>

      </SpaceBetween>
    </StepContainer>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Step 7 — Complete Position-Aware Embeddings for All 5 Words
// ─────────────────────────────────────────────────────────────────────────────
function Step7({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={8}
      title="Complete Position-Aware Embeddings for All 5 Words"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">

        <StudentNote title="Applying X + PE to Every Word">
          We repeat the same element-wise addition for all 5 words.
          Each word gets its own PE vector (based on its position), so each word
          is modified differently. By the end of this step, all 5 words will carry
          both their meaning and their position — ready to feed into self-attention.
        </StudentNote>

        <Container header={<Header variant="h3">➕ Addition for All 5 Words</Header>}>
          <SpaceBetween size="s">

            <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px', border: '1px solid #c5cae9', fontFamily: 'monospace', fontSize: '13px', lineHeight: '2' }}>
              <strong>Word "I" (pos=0):</strong><br />
              Original: &nbsp;[1.000, &nbsp;0.200, &nbsp;0.500, &nbsp;0.300]<br />
              + PE(0):  &nbsp;&nbsp;[0.000, &nbsp;1.000, &nbsp;0.000, &nbsp;1.000]<br />
              = New: &nbsp;&nbsp;&nbsp;&nbsp;<strong>[1.000, &nbsp;1.200, &nbsp;0.500, &nbsp;1.300]</strong>
            </div>

            <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px', border: '1px solid #c5cae9', fontFamily: 'monospace', fontSize: '13px', lineHeight: '2' }}>
              <strong>Word "bought" (pos=1):</strong><br />
              Original: &nbsp;[0.800, &nbsp;1.000, &nbsp;0.300, &nbsp;0.600]<br />
              + PE(1):  &nbsp;&nbsp;[0.841, &nbsp;0.540, &nbsp;0.010, &nbsp;1.000]<br />
              = New: &nbsp;&nbsp;&nbsp;&nbsp;<strong>[1.641, &nbsp;1.540, &nbsp;0.310, &nbsp;1.600]</strong>
            </div>

            <div style={{ background: '#ffebee', padding: '15px', borderRadius: '8px', border: '2px solid #e74c3c', fontFamily: 'monospace', fontSize: '13px', lineHeight: '2' }}>
              <strong>🍎 Word "apple" (pos=2) — YOUR FOCUS WORD:</strong><br />
              Original: &nbsp;[0.600, &nbsp;&nbsp;0.400, &nbsp;1.000, &nbsp;0.200]<br />
              + PE(2):  &nbsp;&nbsp;[0.909, &nbsp;−0.416, &nbsp;0.020, &nbsp;1.000]<br />
              = New: &nbsp;&nbsp;&nbsp;&nbsp;<strong>[1.509, &nbsp;−0.016, &nbsp;1.020, &nbsp;1.200]</strong>
            </div>

            <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px', border: '1px solid #c5cae9', fontFamily: 'monospace', fontSize: '13px', lineHeight: '2' }}>
              <strong>Word "to" (pos=3):</strong><br />
              Original: &nbsp;[0.300, &nbsp;&nbsp;0.700, &nbsp;0.200, &nbsp;0.800]<br />
              + PE(3):  &nbsp;&nbsp;[0.141, &nbsp;−0.990, &nbsp;0.030, &nbsp;1.000]<br />
              = New: &nbsp;&nbsp;&nbsp;&nbsp;<strong>[0.441, &nbsp;−0.290, &nbsp;0.230, &nbsp;1.800]</strong>
            </div>

            <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px', border: '1px solid #c5cae9', fontFamily: 'monospace', fontSize: '13px', lineHeight: '2' }}>
              <strong>Word "eat" (pos=4):</strong><br />
              Original: &nbsp;[0.900, &nbsp;&nbsp;0.600, &nbsp;0.400, &nbsp;1.000]<br />
              + PE(4):  &nbsp;&nbsp;[−0.757, &nbsp;−0.654, &nbsp;0.040, &nbsp;0.999]<br />
              = New: &nbsp;&nbsp;&nbsp;&nbsp;<strong>[0.143, &nbsp;−0.054, &nbsp;0.440, &nbsp;1.999]</strong>
            </div>

          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h3">📊 Complete Summary Table</Header>}>
          <Table
            columnDefinitions={[
              { id: 'word', header: 'Word', cell: item => item.word },
              { id: 'orig', header: 'Original Embedding', cell: item => item.orig },
              { id: 'pe', header: 'PE Vector', cell: item => item.pe },
              { id: 'new', header: 'Position-Aware Embedding', cell: item => item.new },
            ]}
            items={[
              { word: 'I (pos 0)', orig: '[1.000, 0.200, 0.500, 0.300]', pe: '[0.000, 1.000, 0.000, 1.000]', new: '[1.000, 1.200, 0.500, 1.300]' },
              { word: 'bought (pos 1)', orig: '[0.800, 1.000, 0.300, 0.600]', pe: '[0.841, 0.540, 0.010, 1.000]', new: '[1.641, 1.540, 0.310, 1.600]' },
              { word: '🍎 apple (pos 2)', orig: '[0.600, 0.400, 1.000, 0.200]', pe: '[0.909, −0.416, 0.020, 1.000]', new: '[1.509, −0.016, 1.020, 1.200]' },
              { word: 'to (pos 3)', orig: '[0.300, 0.700, 0.200, 0.800]', pe: '[0.141, −0.990, 0.030, 1.000]', new: '[0.441, −0.290, 0.230, 1.800]' },
              { word: 'eat (pos 4)', orig: '[0.900, 0.600, 0.400, 1.000]', pe: '[−0.757, −0.654, 0.040, 0.999]', new: '[0.143, −0.054, 0.440, 1.999]' },
            ]}
            variant="embedded"
          />
        </Container>

        <TryYourself>
          <Box variant="h4">Verify "to" — Position-Aware Dim 3</Box>
          <Box variant="p">
            "to" original dim 3 = 0.800. PE(3, dim 3) = cos(0.030) ≈ 1.000.<br />
            New dim 3 = 0.800 + 1.000 = ?
          </Box>
          <InteractiveInput
            label="Your answer:"
            correctAnswer={1.800}
            hint="0.800 + 1.000 = 1.800. This is the highest dim 3 value in the table — 'to' at position 3 contributes a larger original value (0.800) while the slow PE is still ≈ 1.000."
            tolerance={0.005}
          />
        </TryYourself>

        <Container header={<Header variant="h3">🔄 Before vs After — Apple's Transformation</Header>}>
          <Table
            columnDefinitions={[
              { id: 'label', header: '', cell: item => item.label },
              { id: 'c0', header: 'Dim 0', cell: item => item.c0 },
              { id: 'c1', header: 'Dim 1', cell: item => item.c1 },
              { id: 'c2', header: 'Dim 2', cell: item => item.c2 },
              { id: 'c3', header: 'Dim 3', cell: item => item.c3 },
            ]}
            items={[
              { label: 'Original embedding', c0: '0.600', c1: '0.400', c2: '1.000', c3: '0.200' },
              { label: 'PE added (pos=2)', c0: '+0.909', c1: '−0.416', c2: '+0.020', c3: '+1.000' },
              { label: 'Position-aware result', c0: '1.509', c1: '−0.016', c2: '1.020', c3: '1.200' },
            ]}
            variant="embedded"
          />
          <StudentNote title="Reading the Change">
            <strong>Dim 0 (+0.909):</strong> Large positive shift — the fast sin clock is near its peak at position 2.<br />
            <strong>Dim 1 (−0.416):</strong> Negative shift pulled the value below zero — fast cos has crossed zero.<br />
            <strong>Dim 2 (+0.020):</strong> Tiny shift — slow sin barely moved from position 0.<br />
            <strong>Dim 3 (+1.000):</strong> Large positive shift — slow cos starts at 1.0 for all early positions.<br /><br />
            After the addition, apple's vector is [1.509, −0.016, 1.020, 1.200].
            This is the vector that flows into the Q, K, V weight matrices in self-attention.
          </StudentNote>
        </Container>

      </SpaceBetween>
    </StepContainer>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Step 8 — Why Sinusoidal + Where PE Fits in the Transformer
// ─────────────────────────────────────────────────────────────────────────────
function Step8({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={9}
      title="Why Sinusoidal? + Where PE Fits in the Transformer"
      onNext={onNext}
      onPrevious={onPrevious}
      isLast={true}
    >
      <SpaceBetween size="m">

        <StudentNote title="Three Mathematical Guarantees of Sinusoidal PE">
          The original "Attention Is All You Need" paper chose sinusoids for three specific reasons.
          Let us verify each one with the numbers we just computed.
        </StudentNote>

        {/* Property 1 */}
        <Container header={<Header variant="h3">Property 1 — Uniqueness: Every Position Has a Distinct Encoding</Header>}>
          <SpaceBetween size="s">
            <Box variant="p">
              No two positions in our table share the same PE vector. Even when dims 2 and 3 look
              nearly identical, the fast clock (dims 0 and 1) ensures the full 4D vector is distinct:
            </Box>
            <div style={{
              background: '#f8f9fa',
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '13px',
              lineHeight: '2'
            }}>
              PE(0) = [ 0.000, &nbsp;1.000, &nbsp;0.000, &nbsp;1.000]<br />
              PE(1) = [ 0.841, &nbsp;0.540, &nbsp;0.010, &nbsp;1.000]<br />
              PE(2) = [ 0.909, −0.416, &nbsp;0.020, &nbsp;1.000] &nbsp;← apple<br />
              PE(3) = [ 0.141, −0.990, &nbsp;0.030, &nbsp;1.000]<br />
              PE(4) = [−0.757, −0.654, &nbsp;0.040, &nbsp;0.999]
            </div>
            <Box variant="p">
              This uniqueness extends to any position value, not just 0–4. The sinusoid formula
              generates a unique encoding for position 512, position 10000, or any integer value —
              as long as the sentence length does not exceed half the wavelength of the slowest
              dimension pair.
            </Box>
          </SpaceBetween>
        </Container>

        {/* Property 2 */}
        <Container header={<Header variant="h3">Property 2 — Relative Distances: Adjacent Positions Are Equally Spaced</Header>}>
          <SpaceBetween size="s">
            <Box variant="p">
              The "distance" between consecutive PE vectors is approximately constant regardless
              of where in the sentence you are. Let us check dim 0:
            </Box>
            <div style={{
              background: '#e8f5e8',
              padding: '16px',
              borderRadius: '8px',
              border: '2px solid #27ae60',
              fontFamily: 'monospace',
              fontSize: '13px',
              lineHeight: '2'
            }}>
              |PE(1, dim0) − PE(0, dim0)| = |0.841 − 0.000| = 0.841<br />
              |PE(2, dim0) − PE(1, dim0)| = |0.909 − 0.841| = 0.068<br />
              |PE(3, dim0) − PE(2, dim0)| = |0.141 − 0.909| = 0.768<br />
              |PE(4, dim0) − PE(3, dim0)| = |−0.757 − 0.141| = 0.898
            </div>
            <StudentNote title="Wait — These Are Not Equal!">
              You are right — in a single dimension they are not equal, because a single sin wave
              has varying slope. But across <em>all dimensions together</em> (the full 4D vector),
              the Euclidean distances are much more uniform.<br /><br />
              More importantly, the relationship between PE vectors at relative offset +k is a
              <strong> fixed linear transformation</strong> — the same rotation matrix that maps
              PE(pos) to PE(pos+1) also maps PE(pos+2) to PE(pos+3). The model can learn
              "one step forward" as a single learned weight, and that weight works everywhere.
              That is the property that matters for generalisation.
            </StudentNote>
          </SpaceBetween>
        </Container>

        {/* Property 3 */}
        <Container header={<Header variant="h3">Property 3 — Generalisation: Works for Any Sequence Length</Header>}>
          <div style={{ background: '#fff8e1', padding: '20px', borderRadius: '8px', border: '1px solid #f9a825' }}>
            <strong>Learned PE (BERT, GPT-2) vs Sinusoidal PE (original Transformer):</strong><br /><br />
            <strong>Learned:</strong> Each position 0, 1, 2, ..., 512 gets a trainable embedding vector
            that is updated during gradient descent. Highly expressive — but if a sentence has 600 tokens,
            you cannot look up position 513 in the table: it was never seen during training.<br /><br />
            <strong>Sinusoidal:</strong> The formula works for <em>any</em> integer position, even positions
            never seen during training. A model trained on 512-token sequences can still assign
            a valid PE to position 1000 at inference time. This makes sinusoidal PE better for
            tasks where you need to process documents longer than the training window.
          </div>
        </Container>

        {/* The Binary Clock Analogy */}
        <Container header={<Header variant="h3">💡 The Binary Counter Analogy</Header>}>
          <SpaceBetween size="s">
            <Box variant="p">
              There is a beautiful analogy to binary counting that explains why multiple frequencies work:
            </Box>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '13px', width: '100%' }}>
                <thead>
                  <tr style={{ background: '#667eea', color: 'white' }}>
                    <th style={{ padding: '8px 12px', border: '1px solid #ddd' }}>Position</th>
                    <th style={{ padding: '8px 12px', border: '1px solid #ddd' }}>Binary (bit 1, bit 0)</th>
                    <th style={{ padding: '8px 12px', border: '1px solid #ddd' }}>Bit 0 flips</th>
                    <th style={{ padding: '8px 12px', border: '1px solid #ddd' }}>Bit 1 flips</th>
                    <th style={{ padding: '8px 12px', border: '1px solid #ddd' }}>PE dim 0 (fast)</th>
                    <th style={{ padding: '8px 12px', border: '1px solid #ddd' }}>PE dim 2 (slow)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { pos: 0, bin: '00', b0: 'every step', b1: 'every 2 steps', d0: '0.000', d2: '0.000' },
                    { pos: 1, bin: '01', b0: '↑ flipped', b1: '—', d0: '0.841', d2: '0.010' },
                    { pos: 2, bin: '10', b0: '↑ flipped', b1: '↑ flipped', d0: '0.909', d2: '0.020' },
                    { pos: 3, bin: '11', b0: '↑ flipped', b1: '—', d0: '0.141', d2: '0.030' },
                    { pos: 4, bin: '100', b0: '↑ flipped', b1: '↑ flipped', d0: '-0.757', d2: '0.040' },
                  ].map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#f8f9fa' : 'white' }}>
                      <td style={{ padding: '8px 12px', textAlign: 'center', border: '1px solid #ddd' }}>{row.pos}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'center', border: '1px solid #ddd' }}>{row.bin}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'center', border: '1px solid #ddd' }}>{row.b0}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'center', border: '1px solid #ddd' }}>{row.b1}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'center', border: '1px solid #ddd', fontWeight: 'bold' }}>{row.d0}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'center', border: '1px solid #ddd', fontWeight: 'bold' }}>{row.d2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <StudentNote title="What the Table Shows">
              In binary: the rightmost bit flips every step (high frequency). Leftward bits flip at
              decreasing frequencies. PE does the same thing with sine waves: dim 0 is the "rightmost bit"
              (oscillates fast), dim 2 is a "leftward bit" (oscillates slowly).<br /><br />
              Just as binary uses n bits to represent 2^n unique numbers, sinusoidal PE uses d_model/2
              frequency pairs to represent an exponentially large number of unique positions.
              With just 4 dimensions we can cleanly encode thousands of distinct positions.
            </StudentNote>
          </SpaceBetween>
        </Container>

        {/* Where PE fits */}
        <Container header={<Header variant="h3">🗺️ Where Positional Encoding Fits in the Full Transformer</Header>}>
          <SpaceBetween size="s">
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '13px',
              lineHeight: '2.5',
              border: '2px solid #667eea'
            }}>
              <strong>Input sentence:</strong> "I bought apple to eat"<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ Lookup table<br />
              <strong>Word embeddings X:</strong> 5 × 4 matrix (5 words, 4 dims)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>Add positional encoding &nbsp;← YOU ARE HERE</span><br />
              <strong>Position-aware embeddings X':</strong> X + PE (same shape: 5 × 4)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ Multiply by W_Q, W_K, W_V<br />
              <strong>Q, K, V matrices:</strong> position-aware queries, keys, values<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ Self-Attention (the previous tutorial)<br />
              <strong>Context-aware embeddings:</strong> each word enriched with neighbour context<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ Feed-Forward layers, residual connections, layer norm<br />
              <strong>Transformer layer output</strong> (repeated N times)
            </div>

            <StudentNote title="PE Happens Once — At the Very Beginning">
              Positional encoding is applied <strong>exactly once</strong>, to the raw word embeddings,
              before the first transformer layer. After X + PE, every operation (self-attention,
              feed-forward, layer norm) works on position-aware vectors.<br /><br />
              The self-attention mechanism never explicitly receives the position number —
              it only sees the blended embedding. But because position is baked in, the Q and K
              dot products are influenced by position: "apple at position 2" produces a different
              Q vector than "apple at position 7" would. Self-attention therefore naturally
              weights words differently based on their relative positions.
            </StudentNote>
          </SpaceBetween>
        </Container>

        {/* Final Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <Box variant="h2" color="inherit">🏆 Apple's Position Is Encoded!</Box>
          <div style={{ marginTop: '16px', fontFamily: 'monospace', fontSize: '15px', lineHeight: '2.5' }}>
            Raw embedding (no position) &nbsp;→&nbsp; [0.600, &nbsp;0.400, &nbsp;1.000, &nbsp;0.200]<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ + PE(pos=2)<br />
            Position-aware embedding &nbsp;&nbsp;&nbsp;→&nbsp; [1.509, −0.016, &nbsp;1.020, &nbsp;1.200]<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ self-attention (with position baked in)<br />
            Context-aware embedding &nbsp;&nbsp;&nbsp;&nbsp;→&nbsp; [1.443, &nbsp;1.010, &nbsp;0.956, &nbsp;1.265]
          </div>
        </div>

        {/* Summary */}
        <StudentNote title="Complete Summary — What You Mastered">
          <ol style={{ lineHeight: '2' }}>
            <li><strong>The problem:</strong> Self-attention is order-blind — positional encoding adds order information.</li>
            <li><strong>The formula:</strong> PE(pos, 2i) = sin(pos/10000^(2i/d)) for even dims; cos for odd dims.</li>
            <li><strong>Two frequency tiers:</strong> Fast clock (dims 0,1 / denom=1.0) and slow clock (dims 2,3 / denom=100).</li>
            <li><strong>PE for apple (pos=2):</strong> [0.909, −0.416, 0.020, 1.000] — unique to position 2.</li>
            <li><strong>The addition:</strong> X + PE element-wise → apple becomes [1.509, −0.016, 1.020, 1.200].</li>
            <li><strong>Three properties:</strong> Unique per position, relative distances preserved, generalises to any length.</li>
            <li><strong>Where it fits:</strong> Added once at input, then self-attention takes it from there.</li>
          </ol>
        </StudentNote>

        <div style={{ background: '#e8f5e8', padding: '20px', borderRadius: '8px', border: '2px solid #27ae60' }}>
          <Box variant="h3">🎉 What's Next?</Box>
          <Box variant="p">
            You now understand the two most fundamental components of a transformer encoder:
            <strong> positional encoding</strong> (this tutorial) and <strong>self-attention</strong>.
            Together, they explain how a transformer reads a sentence with full awareness of
            both word meaning and word order.<br /><br />
            The natural next step is <strong>Multi-Head Attention</strong> — where self-attention
            runs 8 times in parallel (with different weight matrices), each head learning a
            different type of relationship (semantic, syntactic, long-range dependencies, etc.).
          </Box>
        </div>

      </SpaceBetween>
    </StepContainer>
  )
}


export default PositionalEncodingComplete
