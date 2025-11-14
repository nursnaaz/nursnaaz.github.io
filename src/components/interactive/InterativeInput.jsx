import { useState } from 'react'
import FormField from '@cloudscape-design/components/form-field'
import Input from '@cloudscape-design/components/input'
import Button from '@cloudscape-design/components/button'
import Alert from '@cloudscape-design/components/alert'


export function InteractiveInput({ 
  label, 
  correctAnswer, 
  hint, 
  placeholder = "Enter your answer",
  tolerance = 0.01 
}) {
  const [value, setValue] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [showHint, setShowHint] = useState(false)


  const checkAnswer = () => {
    const userAnswer = parseFloat(value)
    const correct = parseFloat(correctAnswer)
    
    if (isNaN(userAnswer)) {
      setFeedback({ type: 'error', message: 'Please enter a valid number' })
      return
    }


    if (Math.abs(userAnswer - correct) < tolerance) {
      setFeedback({ 
        type: 'success', 
        message: '✅ Correct! Well done!' 
      })
    } else {
      setFeedback({ 
        type: 'error', 
        message: `❌ Not quite. The answer is approximately ${correct}. Try again!` 
      })
    }
  }


  return (
    <div style={{ marginTop: '16px', marginBottom: '16px' }}>
      <FormField label={label}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <Input
            value={value}
            onChange={({ detail }) => setValue(detail.value)}
            placeholder={placeholder}
            type="number"
            step="0.001"
          />
          <Button onClick={checkAnswer} variant="primary">
            Check Answer
          </Button>
          {hint && (
            <Button onClick={() => setShowHint(!showHint)}>
              {showHint ? 'Hide' : 'Show'} Hint
            </Button>
          )}
        </div>
      </FormField>
      
      {feedback && (
        <div style={{ marginTop: '8px' }}>
          <Alert type={feedback.type}>
            {feedback.message}
          </Alert>
        </div>
      )}
      
      {showHint && hint && (
        <div style={{ marginTop: '8px' }}>
          <Alert type="info" header="Hint">
            {hint}
          </Alert>
        </div>
      )}
    </div>
  )
}
