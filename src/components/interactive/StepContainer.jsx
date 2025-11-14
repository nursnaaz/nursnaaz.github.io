import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Button from '@cloudscape-design/components/button'


export function StepContainer({ 
  stepNumber, 
  title, 
  children, 
  onNext, 
  onPrevious,
  isFirst = false,
  isLast = false 
}) {
  return (
    <Container
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            {stepNumber}
          </div>
          <Header variant="h2">{title}</Header>
        </div>
      }
    >
      <SpaceBetween size="l">
        {children}
        
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', marginTop: '24px' }}>
          <Button
            disabled={isFirst}
            onClick={onPrevious}
          >
            ← Previous Step
          </Button>
          <Button
            variant="primary"
            disabled={isLast}
            onClick={onNext}
          >
            Next Step →
          </Button>
        </div>
      </SpaceBetween>
    </Container>
  )
}
