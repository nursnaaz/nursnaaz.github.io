import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import SpaceBetween from '@cloudscape-design/components/space-between'
import ProgressBar from '@cloudscape-design/components/progress-bar'
import Alert from '@cloudscape-design/components/alert'
import Box from '@cloudscape-design/components/box'
import Badge from '@cloudscape-design/components/badge'
import Breadcrumbs from '@cloudscape-design/components/breadcrumb-group'
import { SelfAttentionTutorialComplete } from '../components/tutorials/SelfAttentionTutorialComplete'
import { MultiHeadAttentionComplete } from '../components/tutorials/MultiHeadAttentionComplete'
import { TransformerCodeComplete } from '../components/tutorials/TransformerCodeComplete'
import { BertClassificationComplete } from '../components/tutorials/BertClassificationComplete'
import { ProductionChallengesComplete } from '../components/tutorials/ProductionChallengesComplete'
import { SecuredAgentsComplete } from '../components/tutorials/SecuredAgentsComplete'

// Tutorial component mapping
const tutorialComponents = {
  'self-attention': SelfAttentionTutorialComplete,
  'multi-head-attention': MultiHeadAttentionComplete,
  'transformer-code': TransformerCodeComplete,
  'bert-classification': BertClassificationComplete,
  'production-challenges': ProductionChallengesComplete,
  'secured-agents': SecuredAgentsComplete
}

export function TutorialPage({ tutorial }) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(9)

  useEffect(() => {
    // Trigger MathJax rendering when component mounts or updates
    if (window.MathJax) {
      window.MathJax.typesetPromise?.()
    }
  }, [currentStep])

  const handleStepChange = (step, total) => {
    setCurrentStep(step)
    setTotalSteps(total)
  }

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100

  // Get the tutorial component
  const TutorialComponent = tutorialComponents[tutorial.id]

  return (
    <SpaceBetween size="l">
      <Breadcrumbs
        items={[
          { text: 'Home', href: '/' },
          { text: 'Tutorials', href: '/' },
          { text: tutorial.title, href: '#' }
        ]}
        onFollow={event => {
          event.preventDefault()
          if (event.detail.href !== '#') {
            navigate(event.detail.href)
          }
        }}
      />

      <Container
        header={
          <Header
            variant="h1"
            description={tutorial.description}
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Badge color="blue">{tutorial.level}</Badge>
                <Badge>⏱️ {tutorial.estimatedTime}</Badge>
              </SpaceBetween>
            }
          >
            {tutorial.title}
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box>
            <ProgressBar
              value={progressPercentage}
              label={`Step ${currentStep + 1} of ${totalSteps}`}
              description="Complete each step to progress through the tutorial"
            />
          </Box>

          <Alert type="info" header="Interactive Learning">
            This tutorial includes interactive exercises. Calculate the answers yourself
            and verify your understanding at each step.
          </Alert>

          {/* Render tutorial component if available */}
          {TutorialComponent ? (
            <TutorialComponent onStepChange={handleStepChange} />
          ) : (
            <Container>
              <SpaceBetween size="l">
                <Box variant="h2">Tutorial content coming soon...</Box>
                <Box variant="p">
                  This tutorial is being migrated to the new Cloudscape design system.
                  The content from <code>tutorials/{tutorial.id}.html</code> will be
                  converted to React components.
                </Box>
              </SpaceBetween>
            </Container>
          )}
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  )
}
