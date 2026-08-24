import { useState, useLayoutEffect } from 'react'
import { StepContainer } from '../interactive/StepContainer'

export function LabShell({ titles, onStepChange, children }) {
  const [step, setStep] = useState(0)
  const total = titles.length

  useLayoutEffect(() => {
    onStepChange?.(step, total)
  }, [step, total, onStepChange])

  const go = (n) => {
    setStep(Math.max(0, Math.min(total - 1, n)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <StepContainer
      stepNumber={step + 1}
      title={titles[step]}
      onNext={() => go(step + 1)}
      onPrevious={() => go(step - 1)}
      isFirst={step === 0}
      isLast={step === total - 1}
    >
      {typeof children === 'function' ? children({ step, go }) : children}
    </StepContainer>
  )
}
