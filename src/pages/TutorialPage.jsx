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
import Link from '@cloudscape-design/components/link'
import { COURSE_REPO, courseUrl } from '../data/tutorials'
import { CosineSimilarityMovieRecommender } from '../components/tutorials/CosineSimilarityMovieRecommender'
import { HowSearchEnginesWork } from '../components/tutorials/HowSearchEnginesWork'
import { SelfAttentionTutorialComplete } from '../components/tutorials/SelfAttentionTutorialComplete'
import { MultiHeadAttentionComplete } from '../components/tutorials/MultiHeadAttentionComplete'
import { TransformerCodeComplete } from '../components/tutorials/TransformerCodeComplete'
import { BertClassificationComplete } from '../components/tutorials/BertClassificationComplete'
import { ProductionChallengesComplete } from '../components/tutorials/ProductionChallengesComplete'
import { SecuredAgentsComplete } from '../components/tutorials/SecuredAgentsComplete'
import { PositionalEncodingComplete } from '../components/tutorials/PositionalEncodingComplete'
import { TokensAreMoney } from '../components/tutorials/TokensAreMoney'
import { SamplingPlayground } from '../components/tutorials/SamplingPlayground'
import { FirstLlmCall } from '../components/tutorials/FirstLlmCall'
import { PromptAnatomy } from '../components/tutorials/PromptAnatomy'
import { JsonOrBust } from '../components/tutorials/JsonOrBust'
import { ChatbotsForget } from '../components/tutorials/ChatbotsForget'
import { TinyRag } from '../components/tutorials/TinyRag'
import { OneToolOneLoop } from '../components/tutorials/OneToolOneLoop'
import { ChunkingIntuition } from '../components/tutorials/ChunkingIntuition'
import { HybridSearchRrf } from '../components/tutorials/HybridSearchRrf'
import { LocalVsCloud } from '../components/tutorials/LocalVsCloud'
import { CitationsAndRefusals } from '../components/tutorials/CitationsAndRefusals'
import { HumanInTheLoop } from '../components/tutorials/HumanInTheLoop'
import { McpAsUsb } from '../components/tutorials/McpAsUsb'
import { RagInjectionGuardrails } from '../components/tutorials/RagInjectionGuardrails'
import { ContextWindowBudget } from '../components/tutorials/ContextWindowBudget'

// Tutorial component mapping
const tutorialComponents = {
  'cosine-similarity-movie-recommender': CosineSimilarityMovieRecommender,
  'how-search-engines-work': HowSearchEnginesWork,
  'positional-encoding': PositionalEncodingComplete,
  'self-attention': SelfAttentionTutorialComplete,
  'multi-head-attention': MultiHeadAttentionComplete,
  'transformer-code': TransformerCodeComplete,
  'bert-classification': BertClassificationComplete,
  'production-challenges': ProductionChallengesComplete,
  'secured-agents': SecuredAgentsComplete,
  'tokens-are-money': TokensAreMoney,
  'sampling-temperature-topk-topp': SamplingPlayground,
  'first-llm-call': FirstLlmCall,
  'prompt-anatomy': PromptAnatomy,
  'json-or-bust': JsonOrBust,
  'chatbots-forget': ChatbotsForget,
  'tiny-rag': TinyRag,
  'one-tool-one-loop': OneToolOneLoop,
  'chunking-intuition': ChunkingIntuition,
  'hybrid-search-rrf': HybridSearchRrf,
  'local-vs-cloud': LocalVsCloud,
  'citations-and-refusals': CitationsAndRefusals,
  'human-in-the-loop': HumanInTheLoop,
  'mcp-as-usb': McpAsUsb,
  'rag-injection-guardrails': RagInjectionGuardrails,
  'context-window-budget': ContextWindowBudget,
}

export function TutorialPage({ tutorial }) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(1)

  useEffect(() => {
    setCurrentStep(0)
    setTotalSteps(1)
  }, [tutorial.id])

  useEffect(() => {
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

          <Alert type="info" header="Work through each step">
            Use the controls on the page, then check the quiz before you move on.
          </Alert>

          {(tutorial.session || tutorial.medium) && (
            <Alert type="success" header={tutorial.session ? `Pairs with ${tutorial.session}` : 'Goes with the course'}>
              Open the matching notebooks in{' '}
              <Link href={tutorial.course ? courseUrl(tutorial.course) : COURSE_REPO} external>
                zero-to-genai-engineer
              </Link>
              {tutorial.course ? ` / ${tutorial.course}` : ''}.
              {tutorial.medium && (
                <>
                  {' '}Write-up:{' '}
                  <Link href={tutorial.medium.url} external>
                    {tutorial.medium.title}
                  </Link>
                  .
                </>
              )}
            </Alert>
          )}

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
