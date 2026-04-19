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
// Step 0 — The Problem
// ─────────────────────────────────────────────────────────────────────────────
function Step0({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={1}
      title="The Problem — Transformers Can't See Word Order"
      onNext={onNext}
      onPrevious={onPrevious}
      isFirst={true}
    >
      <SpaceBetween size="m">

        <StudentNote title="What Goes Wrong Without Positional Encoding?">
          In the Self-Attention tutorial, "apple" had the embedding <strong>[0.6, 0.4, 1.0, 0.2]</strong>.
          That number came from a lookup table — it represents the word's <em>meaning</em>.<br /><br />
          But what if "apple" appeared at position 0 instead of position 2?
          It would have <strong>exactly the same embedding</strong> — [0.6, 0.4, 1.0, 0.2] — because the lookup table
          doesn't know about position.<br /><br />
          Self-attention would produce the same Q, K, and V vectors for both.
          The model genuinely cannot tell whether "apple" is the first word or the third.
          <strong> That is the problem this tutorial solves.</strong>
        </StudentNote>

        {/* Side-by-side problem demonstration */}
        <Container header={<Header variant="h3">🔴 The Problem — Numbers Make It Concrete</Header>}>
          <SpaceBetween size="s">
            <Box variant="p">
              Imagine "apple" appeared as the <em>first</em> word in a different sentence.
              Here is what the transformer would see vs what it should see:
            </Box>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '240px', background: '#ffebee', padding: '16px', borderRadius: '8px', border: '2px solid #e74c3c', fontFamily: 'monospace', fontSize: '13px', lineHeight: '2' }}>
                <strong>Without PE:</strong><br />
                "apple" at position 0 → [0.6, 0.4, 1.0, 0.2]<br />
                "apple" at position 2 → [0.6, 0.4, 1.0, 0.2]<br /><br />
                <span style={{ color: '#e74c3c' }}>❌ Identical. Model is blind to order.</span>
              </div>
              <div style={{ flex: 1, minWidth: '240px', background: '#e8f5e8', padding: '16px', borderRadius: '8px', border: '2px solid #27ae60', fontFamily: 'monospace', fontSize: '13px', lineHeight: '2' }}>
                <strong>With PE:</strong><br />
                "apple" at position 0 → [0.60, 1.40, 1.00, 1.20]<br />
                "apple" at position 2 → [1.51, −0.02, 1.02, 1.20]<br /><br />
                <span style={{ color: '#27ae60' }}>✅ Different. Position is baked in.</span>
              </div>
            </div>
            <StudentNote title="This Is the Whole Tutorial in Two Boxes">
              Positional encoding adds a unique number pattern to each word's embedding based on
              its position. The rest of this tutorial answers one question:
              <strong> how exactly do we compute those numbers?</strong>
            </StudentNote>
          </SpaceBetween>
        </Container>

        {/* Roadmap — simple, no technical output values */}
        <Container header={<Header variant="h3">🗺️ Your 9-Step Plan</Header>}>
          <Table
            columnDefinitions={[
              { id: 'step', header: 'Step', cell: item => item.step },
              { id: 'name', header: 'What Happens', cell: item => item.name },
            ]}
            items={[
              { step: '1 (this page)', name: 'See the problem — two apples, identical to the model' },
              { step: '2', name: 'Learn the 4 rules that generate position numbers' },
              { step: '3', name: 'Understand why two different speeds are used' },
              { step: '4', name: 'Compute the position signal for "I" and "bought"' },
              { step: '5', name: 'Compute the full position signal for "apple" — by hand' },
              { step: '6', name: 'Compute position signals for all 5 words' },
              { step: '7', name: 'Add position signals to embeddings — the actual operation' },
              { step: '8', name: 'Confirm the fix worked — apple at pos 2 looks different now' },
              { step: '9', name: 'Where this fits in the full transformer' },
            ]}
            variant="embedded"
          />
        </Container>

        {/* The sentence and embeddings */}
        <Container>
          <Box fontSize="heading-xl" textAlign="center" padding="l"
            style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)', borderRadius: '8px' }}>
            "I bought apple to eat"
          </Box>
        </Container>

        <Box variant="h3">Starting Data — Word Embeddings (same as the Self-Attention tutorial)</Box>

        <Table
          columnDefinitions={[
            { id: 'pos', header: 'Position', cell: item => item.pos },
            { id: 'word', header: 'Word', cell: item => item.word },
            { id: 'emb', header: 'Embedding [dim0, dim1, dim2, dim3]', cell: item => item.emb }
          ]}
          items={[
            { pos: '0', word: 'I', emb: '[1.000, 0.200, 0.500, 0.300]' },
            { pos: '1', word: 'bought', emb: '[0.800, 1.000, 0.300, 0.600]' },
            { pos: '2', word: '🍎 apple', emb: '[0.600, 0.400, 1.000, 0.200]  ← focus word' },
            { pos: '3', word: 'to', emb: '[0.300, 0.700, 0.200, 0.800]' },
            { pos: '4', word: 'eat', emb: '[0.900, 0.600, 0.400, 1.000]' },
          ]}
          variant="embedded"
        />

        <StudentNote title="What We Are Going to Build">
          By step 7, every row in this table will have a unique position signal added to it.
          The word "apple" — currently a plain [0.6, 0.4, 1.0, 0.2] — will become
          <strong> [1.509, −0.016, 1.020, 1.200]</strong>. That new vector carries both the
          word's meaning <em>and</em> the fact that it sits at position 2. Let's build it.
        </StudentNote>

      </SpaceBetween>
    </StepContainer>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — The 4 Rules
// ─────────────────────────────────────────────────────────────────────────────
function Step1({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={2}
      title="The 4 Rules — How to Build a Position Signal"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">

        <StudentNote title="Start Simple: 4 Rules, Not One Big Formula">
          The official formula looks intimidating: <code>PE(pos, 2i) = sin(pos / 10000^(2i/d))</code>.
          Forget it for now. With our 4-dimensional embeddings, it simplifies into just 4 rules — one per dimension.
          Master these 4 rules and the big formula explains itself at the end.
        </StudentNote>

        <Container header={<Header variant="h3">📋 The 4 Rules (d_model = 4)</Header>}>
          <div style={{
            background: '#f8f9fa',
            padding: '24px',
            borderRadius: '8px',
            border: '2px solid #667eea',
            fontFamily: 'monospace',
            fontSize: '15px',
            lineHeight: '3'
          }}>
            Rule 1 — Dim 0: &nbsp;PE = <strong>sin( position ÷ 1.0 )</strong><br />
            Rule 2 — Dim 1: &nbsp;PE = <strong>cos( position ÷ 1.0 )</strong><br />
            Rule 3 — Dim 2: &nbsp;PE = <strong>sin( position ÷ 100.0 )</strong><br />
            Rule 4 — Dim 3: &nbsp;PE = <strong>cos( position ÷ 100.0 )</strong>
          </div>
        </Container>

        <Container header={<Header variant="h3">Two Things to Notice Right Away</Header>}>
          <SpaceBetween size="s">
            <div style={{ background: '#fff8e1', padding: '16px', borderRadius: '8px', border: '1px solid #f9a825' }}>
              <strong>Notice 1 — Even dims use sin, odd dims use cos:</strong><br />
              Dim 0 (even) → sin &nbsp;|&nbsp; Dim 1 (odd) → cos &nbsp;|&nbsp; Dim 2 (even) → sin &nbsp;|&nbsp; Dim 3 (odd) → cos<br /><br />
              Pairing sin with cos is intentional — together they describe a point on a circle.
              As position increases, that point moves smoothly around the circle, producing a gradual, unique signal.
            </div>
            <div style={{ background: '#fff8e1', padding: '16px', borderRadius: '8px', border: '1px solid #f9a825' }}>
              <strong>Notice 2 — Two different divisors:</strong><br />
              Dims 0 and 1 divide by <strong>1.0</strong> (small number → big change per step).<br />
              Dims 2 and 3 divide by <strong>100.0</strong> (big number → tiny change per step).<br /><br />
              We will dig into why on the next step. For now, just notice they are different.
            </div>
          </SpaceBetween>
        </Container>

        {/* Quick demo: apply the 4 rules to position 0 */}
        <Container header={<Header variant="h3">🧪 Quick Demo — Apply All 4 Rules to Position 0</Header>}>
          <div style={{
            background: '#e8f0fe',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #4a90d9',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '2.5'
          }}>
            <strong>Position = 0 (word "I"):</strong><br />
            Rule 1: sin( 0 ÷ 1.0 ) = sin(0) = <strong>0.000</strong><br />
            Rule 2: cos( 0 ÷ 1.0 ) = cos(0) = <strong>1.000</strong><br />
            Rule 3: sin( 0 ÷ 100.0 ) = sin(0) = <strong>0.000</strong><br />
            Rule 4: cos( 0 ÷ 100.0 ) = cos(0) = <strong>1.000</strong><br /><br />
            <div style={{ background: '#c5cae9', padding: '8px 12px', borderRadius: '4px', textAlign: 'center' }}>
              Position signal for "I" = <strong>[0.000, 1.000, 0.000, 1.000]</strong>
            </div>
          </div>
          <StudentNote title="Position 0 Is Always [0, 1, 0, 1]">
            sin(0) = 0 and cos(0) = 1, regardless of what you divide by.
            So the very first word in <em>any</em> sentence always gets [0, 1, 0, 1] as its position signal.
            That is the "starting point" — every other position diverges from here.
          </StudentNote>
        </Container>

        <TryYourself>
          <Box variant="h4">Apply Rule 1 to Position 2 ("apple")</Box>
          <Box variant="p">Rule 1: sin( position ÷ 1.0 )</Box>
          <Box variant="p">For apple at position 2: sin( 2 ÷ 1.0 ) = sin(2) = ?</Box>
          <Box variant="p">Useful values: sin(1) = 0.841, sin(2) = 0.909, sin(3) = 0.141</Box>
          <InteractiveInput
            label="Your answer:"
            correctAnswer={0.909}
            hint="2 ÷ 1.0 = 2.0. Then sin(2) = 0.9093 ≈ 0.909."
            tolerance={0.005}
          />
        </TryYourself>

        {/* Now reveal the full formula as "shorthand" */}
        <Container header={<Header variant="h3">📐 The Official Formula — It's Just Shorthand for the 4 Rules</Header>}>
          <div style={{ background: '#f0f4ff', padding: '16px', borderRadius: '8px', border: '1px solid #c5cae9' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '2', textAlign: 'center' }}>
              PE(pos, 2i) &nbsp;&nbsp;= sin( pos / 10000<sup>(2i / d_model)</sup> )<br />
              PE(pos, 2i+1) = cos( pos / 10000<sup>(2i / d_model)</sup> )
            </div>
          </div>
          <Box variant="p" padding={{ top: 's' }}>
            With d_model = 4 and i going from 0 to 1, this formula produces exactly our 4 rules:
          </Box>
          <div style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '2', padding: '12px', background: '#f8f9fa', borderRadius: '4px' }}>
            i=0 → 10000<sup>(0/4)</sup> = 10000<sup>0</sup> = <strong>1.0</strong> &nbsp;&nbsp;→ Rules 1 and 2<br />
            i=1 → 10000<sup>(2/4)</sup> = 10000<sup>0.5</sup> = √10000 = <strong>100.0</strong> &nbsp;→ Rules 3 and 4
          </div>
          <StudentNote title="You Don't Need to Memorise the Big Formula">
            Think of the 4 rules as the recipe. The big formula is just a compact way to write the same recipe
            for any d_model size. In production transformers with d_model = 768, there are 384 pairs — but
            it is still the same pattern: even dims use sin, odd use cos, and each pair divides by a larger number.
          </StudentNote>
        </Container>

      </SpaceBetween>
    </StepContainer>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Two Speeds: Why Different Divisors?
// ─────────────────────────────────────────────────────────────────────────────
function Step2({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={3}
      title="Two Speeds — Why Divide by Different Numbers?"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">

        <StudentNote title="The Core Question">
          Why do dims 0 and 1 divide by 1.0, while dims 2 and 3 divide by 100.0?
          The answer: to create two different "speeds" of change. Together they make a position signal
          that is both sensitive to tiny differences <em>and</em> stable over long distances.
        </StudentNote>

        {/* The clock analogy — simple, concrete */}
        <Container header={<Header variant="h3">⏱️ The Two-Speed Clock</Header>}>
          <SpaceBetween size="s">
            <Box variant="p">
              Think of a simple digital clock that shows two numbers: <strong>seconds</strong> and <strong>hours</strong>.
            </Box>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px', background: '#e8f0fe', padding: '16px', borderRadius: '8px', border: '2px solid #4a90d9' }}>
                <strong>Seconds (fast hand — dims 0, 1)</strong><br />
                Divisor = 1.0<br />
                Change per position: <strong>+1.0 radian</strong><br />
                Full cycle: ~6 positions<br /><br />
                Great for telling "is this position 2 or position 3?" — nearby positions look very different.
              </div>
              <div style={{ flex: 1, minWidth: '220px', background: '#fff8e1', padding: '16px', borderRadius: '8px', border: '1px solid #f9a825' }}>
                <strong>Hours (slow hand — dims 2, 3)</strong><br />
                Divisor = 100.0<br />
                Change per position: <strong>+0.01 radian</strong><br />
                Full cycle: ~628 positions<br /><br />
                Great for telling "is this early or late in a long document?" — stable over hundreds of positions.
              </div>
            </div>
            <StudentNote title="Why You Need Both">
              The seconds hand alone would loop back to the same reading at position 6 as at position 0 —
              you cannot tell them apart. The hours hand alone barely changes between positions 0 and 5 —
              not enough contrast. Together, the combination is unique. No two positions ever show
              the same (seconds reading, hours reading) pair.
            </StudentNote>
          </SpaceBetween>
        </Container>

        {/* Show the actual angles for apple */}
        <Container header={<Header variant="h3">🍎 What Angles Does "apple" (pos = 2) Use?</Header>}>
          <div style={{
            background: '#ffebee',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '2.5'
          }}>
            <strong>Step 1 — Compute the angle for each dimension pair:</strong><br />
            Fast pair (dims 0, 1): &nbsp;angle = pos ÷ 1.0 &nbsp;&nbsp;= 2 ÷ 1.0 &nbsp;&nbsp;= <strong>2.000 radians</strong> &nbsp;(big change)<br />
            Slow pair (dims 2, 3): &nbsp;angle = pos ÷ 100.0 = 2 ÷ 100.0 = <strong>0.020 radians</strong> &nbsp;(tiny change)<br /><br />
            <strong>Step 2 — Apply sin/cos:</strong><br />
            Dim 0: sin(2.000) = <strong>0.909</strong><br />
            Dim 1: cos(2.000) = <strong>−0.416</strong> &nbsp;⬅ negative! cos passes zero at 1.57 radians<br />
            Dim 2: sin(0.020) = <strong>0.020</strong><br />
            Dim 3: cos(0.020) = <strong>1.000</strong>
          </div>
        </Container>

        <TryYourself>
          <Box variant="h4">What Angle Does "apple" Use for the Slow Pair?</Box>
          <Box variant="p">Slow pair divisor = 100.0. Apple is at position 2.</Box>
          <Box variant="p">angle = position ÷ divisor = 2 ÷ 100 = ?</Box>
          <InteractiveInput
            label="Angle (in radians):"
            correctAnswer={0.020}
            hint="2 ÷ 100 = 0.020. This tiny angle is why the slow clock barely moves between adjacent words."
            tolerance={0.001}
          />
        </TryYourself>

        {/* Side-by-side comparison of what changes between positions */}
        <Container header={<Header variant="h3">📊 How Much Does Each Speed Change Per Step?</Header>}>
          <Table
            columnDefinitions={[
              { id: 'pos', header: 'Position', cell: item => item.pos },
              { id: 'word', header: 'Word', cell: item => item.word },
              { id: 'fast_angle', header: 'Fast angle (÷1.0)', cell: item => item.fast_angle },
              { id: 'd0', header: 'Dim 0 sin(fast)', cell: item => item.d0 },
              { id: 'slow_angle', header: 'Slow angle (÷100)', cell: item => item.slow_angle },
              { id: 'd2', header: 'Dim 2 sin(slow)', cell: item => item.d2 },
            ]}
            items={[
              { pos: '0', word: 'I', fast_angle: '0.000', d0: '0.000', slow_angle: '0.000', d2: '0.000' },
              { pos: '1', word: 'bought', fast_angle: '1.000', d0: '0.841', slow_angle: '0.010', d2: '0.010' },
              { pos: '2', word: '🍎 apple', fast_angle: '2.000', d0: '0.909', slow_angle: '0.020', d2: '0.020' },
              { pos: '3', word: 'to', fast_angle: '3.000', d0: '0.141', slow_angle: '0.030', d2: '0.030' },
              { pos: '4', word: 'eat', fast_angle: '4.000', d0: '−0.757', slow_angle: '0.040', d2: '0.040' },
            ]}
            variant="embedded"
          />
          <StudentNote title="The Pattern in the Table">
            Dim 0 jumps all over the place — large, varied values including negatives.
            Dim 2 ticks up by exactly 0.010 per step, almost like a counting number.
            Together, they create a two-layer fingerprint: the fast clock gives local contrast,
            the slow clock gives global position context.
          </StudentNote>
        </Container>

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
      title='Position Signals for "I" and "bought"'
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">

        <StudentNote title="Reference Values You Will Need">
          All angles are in radians. Use this table whenever you need a sin or cos value:<br /><br />
          <div style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '2' }}>
            sin(0) = 0.000 &nbsp;&nbsp;| cos(0) = 1.000<br />
            sin(1) = 0.841 &nbsp;&nbsp;| cos(1) = 0.540<br />
            sin(2) = 0.909 &nbsp;&nbsp;| cos(2) = −0.416<br />
            sin(3) = 0.141 &nbsp;&nbsp;| cos(3) = −0.990<br />
            sin(4) = −0.757 | cos(4) = −0.654
          </div>
        </StudentNote>

        {/* Position 0 */}
        <Container header={<Header variant="h3">Position 0 — "I"</Header>}>
          <div style={{
            background: '#f0f4ff',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #667eea',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '2.5'
          }}>
            Dim 0: sin( 0 ÷ 1.0 ) &nbsp;&nbsp;= sin(0.000) = <strong>0.000</strong><br />
            Dim 1: cos( 0 ÷ 1.0 ) &nbsp;&nbsp;= cos(0.000) = <strong>1.000</strong><br />
            Dim 2: sin( 0 ÷ 100.0 ) = sin(0.000) = <strong>0.000</strong><br />
            Dim 3: cos( 0 ÷ 100.0 ) = cos(0.000) = <strong>1.000</strong><br /><br />
            <div style={{ textAlign: 'center', background: '#c5cae9', padding: '8px', borderRadius: '4px' }}>
              PE(pos=0) = <strong>[0.000, 1.000, 0.000, 1.000]</strong>
            </div>
          </div>
        </Container>

        {/* Position 1 */}
        <Container header={<Header variant="h3">Position 1 — "bought"</Header>}>
          <div style={{
            background: '#f0f4ff',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #667eea',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '2.5'
          }}>
            Dim 0: sin( 1 ÷ 1.0 ) &nbsp;&nbsp;= sin(1.000) = <strong>0.841</strong><br />
            Dim 1: cos( 1 ÷ 1.0 ) &nbsp;&nbsp;= cos(1.000) = <strong>0.540</strong><br />
            Dim 2: sin( 1 ÷ 100.0 ) = sin(0.010) = <strong>0.010</strong><br />
            Dim 3: cos( 1 ÷ 100.0 ) = cos(0.010) = <strong>1.000</strong><br /><br />
            <div style={{ textAlign: 'center', background: '#c5cae9', padding: '8px', borderRadius: '4px' }}>
              PE(pos=1) = <strong>[0.841, 0.540, 0.010, 1.000]</strong>
            </div>
          </div>
        </Container>

        {/* Side-by-side comparison */}
        <Container header={<Header variant="h3">Comparing Positions 0 and 1</Header>}>
          <Table
            columnDefinitions={[
              { id: 'label', header: '', cell: item => item.label },
              { id: 'd0', header: 'Dim 0', cell: item => item.d0 },
              { id: 'd1', header: 'Dim 1', cell: item => item.d1 },
              { id: 'd2', header: 'Dim 2', cell: item => item.d2 },
              { id: 'd3', header: 'Dim 3', cell: item => item.d3 },
            ]}
            items={[
              { label: 'PE(pos=0)', d0: '0.000', d1: '1.000', d2: '0.000', d3: '1.000' },
              { label: 'PE(pos=1)', d0: '0.841', d1: '0.540', d2: '0.010', d3: '1.000' },
              { label: 'Difference', d0: '+0.841', d1: '−0.460', d2: '+0.010', d3: '0.000' },
            ]}
            variant="embedded"
          />
          <StudentNote title="Slow Clock Barely Moved">
            Dims 0 and 1 changed by 0.841 and −0.460 — large, visible changes.
            Dim 2 changed by only 0.010. Dim 3 didn't change at all (at 3 decimal places).
            The slow clock is saving its precision for distinguishing positions hundreds of steps apart.
          </StudentNote>
        </Container>

        <TryYourself>
          <Box variant="h4">Verify "bought" — Dim 1</Box>
          <Box variant="p">Dim 1 uses cos. Position 1, divisor 1.0.</Box>
          <Box variant="p">cos( 1 ÷ 1.0 ) = cos(1) = ?</Box>
          <InteractiveInput
            label="Your answer:"
            correctAnswer={0.540}
            hint="cos(1 radian) = 0.5403 ≈ 0.540. (Note: these are radians, not degrees. 1 radian ≈ 57.3°.)"
            tolerance={0.01}
          />
        </TryYourself>

      </SpaceBetween>
    </StepContainer>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Step 4 — PE for "apple" (Full Worked Example)
// ─────────────────────────────────────────────────────────────────────────────
function Step4({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={5}
      title='Position Signal for "apple" — Full Worked Example'
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">

        <StudentNote title="This Is the Most Important Step">
          "Apple" is at position 2 — our focus word throughout this tutorial.
          We compute all 4 dimensions of its position signal below.
          Pay attention to dim 1: the result will be <strong>negative</strong>.
          That negative value is key to distinguishing position 2 from positions 0 and 1.
        </StudentNote>

        {/* Full worked calculation */}
        <Container header={<Header variant="h3">🍎 All 4 Dimensions for Position 2</Header>}>
          <div style={{
            background: '#ffebee',
            padding: '24px',
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '3'
          }}>
            <strong>Dim 0 — Rule 1 (sin, fast):</strong><br />
            &nbsp;&nbsp;Angle = 2 ÷ 1.0 = 2.000 radians<br />
            &nbsp;&nbsp;PE = sin(2.000) = <strong style={{ fontSize: '16px', color: '#27ae60' }}>0.909</strong><br /><br />

            <strong>Dim 1 — Rule 2 (cos, fast):</strong><br />
            &nbsp;&nbsp;Angle = 2 ÷ 1.0 = 2.000 radians<br />
            &nbsp;&nbsp;PE = cos(2.000) = <strong style={{ fontSize: '16px', color: '#e74c3c' }}>−0.416</strong> &nbsp;← negative! cos crosses zero at 1.57 rad<br /><br />

            <strong>Dim 2 — Rule 3 (sin, slow):</strong><br />
            &nbsp;&nbsp;Angle = 2 ÷ 100.0 = 0.020 radians (tiny angle)<br />
            &nbsp;&nbsp;PE = sin(0.020) ≈ <strong style={{ fontSize: '16px', color: '#27ae60' }}>0.020</strong> &nbsp;← slow clock barely moved<br /><br />

            <strong>Dim 3 — Rule 4 (cos, slow):</strong><br />
            &nbsp;&nbsp;Angle = 2 ÷ 100.0 = 0.020 radians<br />
            &nbsp;&nbsp;PE = cos(0.020) = 0.99980 ≈ <strong style={{ fontSize: '16px', color: '#27ae60' }}>1.000</strong><br /><br />

            <div style={{ background: '#ffcdd2', padding: '12px', borderRadius: '4px', textAlign: 'center', fontSize: '16px' }}>
              <strong>Position signal for "apple" = [0.909, −0.416, 0.020, 1.000]</strong>
            </div>
          </div>
        </Container>

        {/* Why negative is fine */}
        <Container header={<Header variant="h3">Why Is Dim 1 Negative?</Header>}>
          <div style={{ background: '#fff8e1', padding: '16px', borderRadius: '8px', border: '1px solid #f9a825', fontFamily: 'monospace', fontSize: '13px', lineHeight: '2' }}>
            Cosine starts at +1.0 (at 0 radians), crosses zero at 1.57 radians, and goes negative from there.<br /><br />
            pos 0: cos(0.0) = +1.000 &nbsp;← starts positive<br />
            pos 1: cos(1.0) = +0.540 &nbsp;← still positive<br />
            pos 2: cos(2.0) = −0.416 &nbsp;← crossed zero, now negative &nbsp;← <strong>apple is here</strong><br />
            pos 3: cos(3.0) = −0.990 &nbsp;← near minimum<br />
            pos 4: cos(4.0) = −0.654 &nbsp;← heading back up
          </div>
          <StudentNote title="Negative Values Are a Feature, Not a Bug">
            The sign change is <em>exactly</em> what makes position 2 distinguishable from positions 0 and 1.
            The model learns from these signs — a positive dim 1 means "early in the sentence";
            negative means "past the midpoint of a fast cycle."
          </StudentNote>
        </Container>

        <TryYourself>
          <Box variant="h4">Verify Apple's Dim 0</Box>
          <Box variant="p">Dim 0 uses sin, fast divisor = 1.0. Apple is at position 2.</Box>
          <Box variant="p">sin( 2 ÷ 1.0 ) = sin(2) = ?</Box>
          <InteractiveInput
            label="Your answer:"
            correctAnswer={0.909}
            hint="sin(2 radians) = 0.9093 ≈ 0.909. Note: 2 radians is about 114.6°, well past 90° — that's why sin is still positive but near its peak."
            tolerance={0.005}
          />
        </TryYourself>

        <Alert type="success" header="Apple's Position Fingerprint Is Ready">
          [0.909, −0.416, 0.020, 1.000] — this 4-number combination belongs uniquely to position 2.
          No other position in any sentence will ever produce this exact vector.
          On the next step, we compute the same for the remaining two positions and assemble the full table.
        </Alert>

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
      title="Position Signals for All 5 Words"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">

        <StudentNote title="Completing the Table">
          We have positions 0, 1, and 2. We need positions 3 ("to") and 4 ("eat").
          The process is identical — apply the 4 rules, look up the sin/cos value.
        </StudentNote>

        {/* Positions 3 and 4 — quick */}
        <Container header={<Header variant="h3">Positions 3 and 4 — Quick Calculation</Header>}>
          <div style={{
            background: '#f0f4ff',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #667eea',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '2.5'
          }}>
            <strong>pos = 3 ("to"):</strong><br />
            &nbsp;&nbsp;Fast angle = 3 ÷ 1.0 = 3.000 &nbsp;→ sin(3) = 0.141, cos(3) = −0.990<br />
            &nbsp;&nbsp;Slow angle = 3 ÷ 100 = 0.030 &nbsp;→ sin(0.030) = 0.030, cos(0.030) = 1.000<br />
            &nbsp;&nbsp;PE(3) = <strong>[0.141, −0.990, 0.030, 1.000]</strong><br /><br />

            <strong>pos = 4 ("eat"):</strong><br />
            &nbsp;&nbsp;Fast angle = 4 ÷ 1.0 = 4.000 &nbsp;→ sin(4) = −0.757, cos(4) = −0.654<br />
            &nbsp;&nbsp;Slow angle = 4 ÷ 100 = 0.040 &nbsp;→ sin(0.040) = 0.040, cos(0.040) = 0.999<br />
            &nbsp;&nbsp;PE(4) = <strong>[−0.757, −0.654, 0.040, 0.999]</strong>
          </div>
        </Container>

        {/* Complete table */}
        <Container header={<Header variant="h3">📊 Complete Position Signal Table</Header>}>
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

        <Container header={<Header variant="h3">Three Things to See in This Table</Header>}>
          <SpaceBetween size="s">
            <div style={{ background: '#e8f5e8', padding: '14px', borderRadius: '8px', border: '1px solid #27ae60' }}>
              <strong>1. Every row is unique.</strong> No two positions have the same 4-number combination.
              Even though dims 2 and 3 look similar, dims 0 and 1 are always different enough to tell positions apart.
            </div>
            <div style={{ background: '#e8f5e8', padding: '14px', borderRadius: '8px', border: '1px solid #27ae60' }}>
              <strong>2. Dim 0 and Dim 1 have large, varied values — including negatives.</strong>
              The fast clock is doing its job: creating high contrast between positions.
            </div>
            <div style={{ background: '#e8f5e8', padding: '14px', borderRadius: '8px', border: '1px solid #27ae60' }}>
              <strong>3. Dim 2 increases by exactly 0.010 per step.</strong>
              At small angles, sin(x) ≈ x, so the slow clock is essentially a linear position counter
              for short sequences. This is a clean, direct measure of position.
            </div>
          </SpaceBetween>
        </Container>

        <TryYourself>
          <Box variant="h4">Verify "to" — Dim 0</Box>
          <Box variant="p">PE(pos=3, dim 0) = sin( 3 ÷ 1.0 ) = sin(3) = ?</Box>
          <InteractiveInput
            label="Your answer:"
            correctAnswer={0.141}
            hint="sin(3 radians) = 0.1411 ≈ 0.141. At 3 radians (≈171.9°) we are almost back to zero — the fast clock is near the end of its first half-cycle."
            tolerance={0.01}
          />
        </TryYourself>

      </SpaceBetween>
    </StepContainer>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Step 6 — Adding PE to Embeddings (All 5 Words)
// ─────────────────────────────────────────────────────────────────────────────
function Step6({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={7}
      title="Adding Position Signals to Embeddings"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">

        <StudentNote title="The Simplest Operation in the Whole Transformer">
          After all the calculation, the actual operation is just element-wise addition:<br /><br />
          <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
            position-aware embedding = original embedding + position signal (PE)
          </div>
          <br />
          No matrices, no dot products — just add the 4 numbers together, one by one.
        </StudentNote>

        {/* Apple's addition — focus word */}
        <Container header={<Header variant="h3">🍎 "apple" — Step-by-Step Addition (Focus Word)</Header>}>
          <div style={{
            background: '#ffebee',
            padding: '24px',
            borderRadius: '8px',
            border: '2px solid #e74c3c',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '2.5'
          }}>
            Original embedding: &nbsp;[0.600, &nbsp;0.400, 1.000, 0.200]<br />
            + Position signal:  &nbsp;&nbsp;&nbsp;[0.909, −0.416, 0.020, 1.000]<br />
            <div style={{ borderTop: '2px solid #e74c3c', margin: '8px 0' }} /><br />
            Dim 0: 0.600 + 0.909 = <strong style={{ color: '#27ae60' }}>1.509</strong><br />
            Dim 1: 0.400 + (−0.416) = 0.400 − 0.416 = <strong style={{ color: '#e74c3c' }}>−0.016</strong><br />
            Dim 2: 1.000 + 0.020 = <strong style={{ color: '#27ae60' }}>1.020</strong><br />
            Dim 3: 0.200 + 1.000 = <strong style={{ color: '#27ae60' }}>1.200</strong><br /><br />
            <div style={{ background: '#ffcdd2', padding: '12px', borderRadius: '4px', textAlign: 'center', fontSize: '16px' }}>
              Apple's position-aware embedding = <strong>[1.509, −0.016, 1.020, 1.200]</strong>
            </div>
          </div>
        </Container>

        <TryYourself>
          <Box variant="h4">Verify Apple — Dim 3</Box>
          <Box variant="p">Original dim 3 = 0.200. PE dim 3 = cos(0.02) ≈ 1.000.</Box>
          <Box variant="p">New dim 3 = 0.200 + 1.000 = ?</Box>
          <InteractiveInput
            label="Your answer:"
            correctAnswer={1.200}
            hint="0.200 + 1.000 = 1.200. The slow cosine starts near 1.0 for all early positions, so it adds roughly 1 to every word's dim 3."
            tolerance={0.005}
          />
        </TryYourself>

        {/* All 5 words */}
        <Container header={<Header variant="h3">Complete Addition for All 5 Words</Header>}>
          <SpaceBetween size="s">
            {[
              { word: '"I" (pos 0)', orig: '[1.000, 0.200, 0.500, 0.300]', pe: '[0.000, 1.000, 0.000, 1.000]', result: '[1.000, 1.200, 0.500, 1.300]', bg: '#f0f4ff', border: '#667eea' },
              { word: '"bought" (pos 1)', orig: '[0.800, 1.000, 0.300, 0.600]', pe: '[0.841, 0.540, 0.010, 1.000]', result: '[1.641, 1.540, 0.310, 1.600]', bg: '#f0f4ff', border: '#667eea' },
              { word: '🍎 "apple" (pos 2)', orig: '[0.600, 0.400, 1.000, 0.200]', pe: '[0.909, −0.416, 0.020, 1.000]', result: '[1.509, −0.016, 1.020, 1.200]', bg: '#ffebee', border: '#e74c3c' },
              { word: '"to" (pos 3)', orig: '[0.300, 0.700, 0.200, 0.800]', pe: '[0.141, −0.990, 0.030, 1.000]', result: '[0.441, −0.290, 0.230, 1.800]', bg: '#f0f4ff', border: '#667eea' },
              { word: '"eat" (pos 4)', orig: '[0.900, 0.600, 0.400, 1.000]', pe: '[−0.757, −0.654, 0.040, 0.999]', result: '[0.143, −0.054, 0.440, 1.999]', bg: '#f0f4ff', border: '#667eea' },
            ].map((row, i) => (
              <div key={i} style={{ background: row.bg, padding: '12px 16px', borderRadius: '8px', border: `1px solid ${row.border}`, fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.8' }}>
                <strong>{row.word}</strong><br />
                {row.orig}<br />
                + {row.pe}<br />
                = <strong>{row.result}</strong>
              </div>
            ))}
          </SpaceBetween>
        </Container>

      </SpaceBetween>
    </StepContainer>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Step 7 — The Payoff: Does It Actually Work?
// ─────────────────────────────────────────────────────────────────────────────
function Step7({ onNext, onPrevious }) {
  return (
    <StepContainer
      stepNumber={8}
      title="Does It Work? — Apple at Position 0 vs Position 2"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <SpaceBetween size="m">

        <StudentNote title="The Original Question — Answered">
          In Step 1, we established the problem: without PE, "apple" at position 0 and "apple"
          at position 2 feed <em>identical</em> vectors into self-attention.
          Now let's check: did positional encoding actually fix this?
        </StudentNote>

        {/* The comparison */}
        <Container header={<Header variant="h3">🔬 Comparing Two Apples — Same Word, Different Positions</Header>}>
          <SpaceBetween size="s">
            <Box variant="p">
              Suppose we had a different sentence where "apple" appeared at position 0.
              Its original embedding would still be [0.6, 0.4, 1.0, 0.2] — same word, same lookup table.
              But here is what happens after positional encoding:
            </Box>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '240px', background: '#e8f0fe', padding: '20px', borderRadius: '8px', border: '2px solid #4a90d9', fontFamily: 'monospace', fontSize: '13px', lineHeight: '2.2' }}>
                <strong>"apple" at position 0</strong><br />
                Original: [0.600, 0.400, 1.000, 0.200]<br />
                + PE(0): &nbsp;[0.000, 1.000, 0.000, 1.000]<br />
                = &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[<strong>0.600</strong>, <strong>1.400</strong>, <strong>1.000</strong>, <strong>1.200</strong>]
              </div>
              <div style={{ flex: 1, minWidth: '240px', background: '#ffebee', padding: '20px', borderRadius: '8px', border: '2px solid #e74c3c', fontFamily: 'monospace', fontSize: '13px', lineHeight: '2.2' }}>
                <strong>🍎 "apple" at position 2 (our sentence)</strong><br />
                Original: [0.600, 0.400, 1.000, 0.200]<br />
                + PE(2): &nbsp;[0.909, −0.416, 0.020, 1.000]<br />
                = &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[<strong>1.509</strong>, <strong>−0.016</strong>, <strong>1.020</strong>, <strong>1.200</strong>]
              </div>
            </div>
          </SpaceBetween>
        </Container>

        {/* Difference table */}
        <Container header={<Header variant="h3">📊 How Different Are They?</Header>}>
          <Table
            columnDefinitions={[
              { id: 'label', header: '', cell: item => item.label },
              { id: 'd0', header: 'Dim 0', cell: item => item.d0 },
              { id: 'd1', header: 'Dim 1', cell: item => item.d1 },
              { id: 'd2', header: 'Dim 2', cell: item => item.d2 },
              { id: 'd3', header: 'Dim 3', cell: item => item.d3 },
            ]}
            items={[
              { label: '"apple" at pos 0', d0: '0.600', d1: '1.400', d2: '1.000', d3: '1.200' },
              { label: '"apple" at pos 2', d0: '1.509', d1: '−0.016', d2: '1.020', d3: '1.200' },
              { label: 'Difference', d0: '−0.909', d1: '−1.416', d2: '−0.020', d3: '0.000' },
            ]}
            variant="embedded"
          />
          <StudentNote title="The Model Can Tell Them Apart Now">
            These two vectors — [0.600, 1.400, 1.000, 1.200] and [1.509, −0.016, 1.020, 1.200] —
            are significantly different, especially in dim 1 (1.400 vs −0.016).
            When self-attention computes Q = embedding × W_Q, it will produce different Query
            vectors for the two apples. They will attend differently. They will produce different outputs.
            <strong> Position is now encoded.</strong>
          </StudentNote>
        </Container>

        {/* The full journey in one place */}
        <Container header={<Header variant="h3">🍎 Apple's Full Journey</Header>}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(102,126,234,0.08) 0%, rgba(118,75,162,0.08) 100%)',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '2.5'
          }}>
            <strong>Step 1 — word embedding (meaning only, no position):</strong><br />
            &nbsp;&nbsp;[0.600, 0.400, 1.000, 0.200]<br /><br />
            <strong>Step 2 — position signal for pos 2 (position only, no meaning):</strong><br />
            &nbsp;&nbsp;[0.909, −0.416, 0.020, 1.000]<br /><br />
            <strong>Step 3 — add them (meaning + position together):</strong><br />
            &nbsp;&nbsp;[1.509, −0.016, 1.020, 1.200]<br /><br />
            <strong>Step 4 — this goes into self-attention (from the previous tutorial):</strong><br />
            &nbsp;&nbsp;→ Q = [1.509, −0.016, 1.020, 1.200] × W_Q → different from any other position's Q<br />
            &nbsp;&nbsp;→ K, V also different<br />
            &nbsp;&nbsp;→ self-attention output reflects position 2, not position 0
          </div>
        </Container>

        <Alert type="success" header="✅ Problem Solved">
          Without positional encoding, the transformer could not distinguish "apple" at position 0
          from "apple" at position 2. With it, the two vectors differ by 0.909 in dim 0 and 1.416
          in dim 1 — differences the self-attention mechanism will act on to produce different,
          position-aware outputs.
        </Alert>

      </SpaceBetween>
    </StepContainer>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
const PE_LINKEDIN_POST = `Self-attention has a blind spot. It literally cannot tell if two words are next to each other or ten positions apart.

I learned this by watching it fail.

Take "apple" at position 0 and "apple" at position 2 in the same sentence. Without positional encoding, self-attention gets identical Q, K, V vectors for both. No way to distinguish them. The math is the same. The output is the same.

Positional encoding fixes this with a formula, not a lookup table:

→ Even-numbered dimensions: sin(position / 10000^(2i/d))
→ Odd-numbered dimensions: cos(position / 10000^(2i/d))

For "apple" at position 2 (d_model=4):
  dim 0: sin(2/1.0) = +0.909
  dim 1: cos(2/1.0) = −0.416
  dim 2: sin(2/100) = +0.020
  dim 3: cos(2/100) = +1.000

Add those four numbers to apple's word embedding. Now position 0 and position 2 are different inputs — even with identical words.

The math took me 35 minutes to follow step by step. The concept took me a week to actually get.

→ https://nursnaaz.github.io/tutorial/positional-encoding

Every calculation is there. No "trust me, it works."

What took you longest to understand about transformers?

#NLP #Transformers #PositionalEncoding #DeepLearning #MachineLearning #AI`

// ─────────────────────────────────────────────────────────────────────────────
// Step 8 — Where PE Fits + Final Summary
// ─────────────────────────────────────────────────────────────────────────────
function Step8({ onNext, onPrevious }) {
  const [copied, setCopied] = useState(false)
  const [linkedInReady, setLinkedInReady] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(PE_LINKEDIN_POST).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  const handleLinkedIn = () => {
    navigator.clipboard.writeText(PE_LINKEDIN_POST).then(() => {
      setLinkedInReady(true)
      setTimeout(() => setLinkedInReady(false), 6000)
      window.open('https://www.linkedin.com/feed/', '_blank', 'noopener,noreferrer')
    })
  }

  return (
    <StepContainer
      stepNumber={9}
      title="Where PE Fits in the Transformer"
      onNext={onNext}
      onPrevious={onPrevious}
      isLast={true}
    >
      <SpaceBetween size="m">

        <StudentNote title="One Line Summary">
          Positional encoding happens <strong>once</strong>, at the very start, before any attention.
          After that, every operation in the transformer works on position-aware vectors.
        </StudentNote>

        {/* Simple flow diagram */}
        <Container header={<Header variant="h3">The Transformer Data Flow</Header>}>
          <div style={{
            background: '#f8f9fa',
            padding: '24px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '3',
            border: '2px solid #667eea'
          }}>
            Input sentence: "I bought apple to eat"<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ Embedding lookup table<br />
            Word embeddings X — 5 vectors of 4 numbers each<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ <span style={{ background: '#ffcdd2', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Add positional encoding ← THIS TUTORIAL</span><br />
            Position-aware embeddings X' = X + PE<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ Multiply by W_Q, W_K, W_V<br />
            Q, K, V matrices — each position looks different<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ <span style={{ background: '#c8e6c9', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Self-Attention ← previous tutorial</span><br />
            Context-aware embeddings — each word knows its neighbours<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ More layers (feed-forward, normalisation, repeat)<br />
            Final output
          </div>
        </Container>

        {/* Two key properties — kept short */}
        <Container header={<Header variant="h3">Two Properties Worth Knowing</Header>}>
          <SpaceBetween size="s">
            <div style={{ background: '#e8f5e8', padding: '16px', borderRadius: '8px', border: '2px solid #27ae60' }}>
              <strong>1. Works for any sentence length.</strong><br />
              The 4 rules are a formula, not a lookup table. You can compute PE for position 1000
              just as easily as position 2 — even if no sentence that long appeared during training.
              This is why the original Transformer uses sinusoidal PE instead of learned embeddings
              for position: it generalises beyond the training data.
            </div>
            <div style={{ background: '#e8f5e8', padding: '16px', borderRadius: '8px', border: '2px solid #27ae60' }}>
              <strong>2. The addition is reversible.</strong><br />
              Because it is simple addition, the model can in principle separate meaning from
              position by subtracting the known PE. In practice, the transformer layers learn to
              handle both together — but the operation never destroys the original meaning,
              it only blends position on top of it.
            </div>
          </SpaceBetween>
        </Container>

        {/* Final banner */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <Box variant="h2" color="inherit">🏆 You Built a Position-Aware Transformer Input!</Box>
          <div style={{ marginTop: '16px', fontFamily: 'monospace', fontSize: '15px', lineHeight: '2.5' }}>
            Raw "apple" embedding (meaning only) &nbsp;&nbsp;&nbsp;→ [0.600, &nbsp;0.400, 1.000, 0.200]<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ + PE(pos=2)<br />
            Position-aware "apple" (pos 2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ [1.509, −0.016, 1.020, 1.200]<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ self-attention<br />
            Context + position-aware output &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ [1.443, &nbsp;1.010, 0.956, 1.265]
          </div>
        </div>

        {/* Summary checklist */}
        <StudentNote title="What You Mastered in This Tutorial">
          <ol style={{ lineHeight: '2.2' }}>
            <li><strong>The problem:</strong> self-attention is order-blind — identical embeddings for "apple" at any position.</li>
            <li><strong>The 4 rules:</strong> sin/cos with two divisors (1.0 and 100.0) create a unique 4-number fingerprint per position.</li>
            <li><strong>Two speeds:</strong> fast dims (0,1) give local contrast; slow dims (2,3) give global position.</li>
            <li><strong>Negative values are fine:</strong> cos(2) = −0.416 is what distinguishes position 2 from positions 0 and 1.</li>
            <li><strong>The fix:</strong> "apple at pos 2" and "apple at pos 0" now produce completely different inputs to self-attention.</li>
            <li><strong>PE happens once:</strong> added to embeddings at the start, before any attention layer.</li>
          </ol>
        </StudentNote>

        {/* ── LinkedIn sharing ── */}
        <div style={{ background: '#f0f8ff', padding: '24px', borderRadius: '12px', border: '2px solid #0077b5' }}>
          <Box variant="h3">📢 Show Your Network What You Now Understand</Box>
          <Box variant="p" color="text-body-secondary">
            You computed the exact numbers that fix self-attention's blind spot. That's worth sharing — most people just wave their hands at "positional encoding."
          </Box>
          <div style={{
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '12px',
            fontFamily: 'sans-serif',
            fontSize: '14px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            maxHeight: '220px',
            overflowY: 'auto',
            color: '#333'
          }}>
            {PE_LINKEDIN_POST}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={handleCopy}
              style={{
                padding: '10px 20px',
                background: copied ? '#27ae60' : '#f0f0f0',
                color: copied ? 'white' : '#333',
                border: '1px solid #ccc',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              {copied ? '✓ Copied' : 'Copy post text'}
            </button>
            <button
              onClick={handleLinkedIn}
              style={{
                padding: '10px 20px',
                background: '#0077b5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Copy & Open LinkedIn →
            </button>
          </div>
          {linkedInReady && (
            <div style={{ marginTop: '12px', color: '#0077b5', fontWeight: 'bold', fontSize: '14px' }}>
              ✓ Text copied. Paste it in LinkedIn with Ctrl+V (or Cmd+V on Mac).
            </div>
          )}
        </div>

        <div style={{ background: '#e8f5e8', padding: '20px', borderRadius: '8px', border: '2px solid #27ae60' }}>
          <Box variant="h3">🎉 What's Next — Multi-Head Attention</Box>
          <Box variant="p">
            You now have the two foundational ingredients: <strong>self-attention</strong> (previous tutorial)
            and <strong>positional encoding</strong> (this tutorial). Together they explain how a transformer
            reads a sentence with full awareness of both word meaning and word order.<br /><br />
            The next step is <strong>Multi-Head Attention</strong> — where self-attention runs 8 times in
            parallel, each head learning a different type of relationship. Check it out next.
          </Box>
        </div>

      </SpaceBetween>
    </StepContainer>
  )
}


export default PositionalEncodingComplete
