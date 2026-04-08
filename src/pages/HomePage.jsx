
import { useNavigate } from 'react-router-dom'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Cards from '@cloudscape-design/components/cards'
import Box from '@cloudscape-design/components/box'
import Badge from '@cloudscape-design/components/badge'
import Button from '@cloudscape-design/components/button'
import { tutorials } from '../data/tutorials'

export function HomePage() {
  const navigate = useNavigate()

  const getLevelColor = (level) => {
    const colors = {
      beginner: 'green',
      intermediate: 'blue',
      advanced: 'red'
    }
    return colors[level] || 'grey'
  }

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Interactive, step-by-step tutorials on Machine Learning, Deep Learning, and AI Agents"
          >
            Welcome to Noordeen Tutorials
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Learn transformer architectures, attention mechanisms, BERT, and production deployment
            of AI systems through hands-on, interactive tutorials. Each tutorial includes:
          </Box>
          <ul>
            <li>📊 Step-by-step calculations you can verify yourself</li>
            <li>🧮 Interactive exercises with instant feedback</li>
            <li>💻 Complete, runnable code examples</li>
            <li>🎯 Real-world production scenarios</li>
          </ul>
        </SpaceBetween>
      </Container>

      <Cards
        cardDefinition={{
          header: item => (
            <SpaceBetween size="xs">
              <Box fontSize="heading-m" fontWeight="bold">
                {item.title}
              </Box>
              <Badge color={getLevelColor(item.level)}>
                {item.level}
              </Badge>
            </SpaceBetween>
          ),
          sections: [
            {
              id: 'description',
              content: item => item.description
            },
            {
              id: 'meta',
              content: item => (
                <SpaceBetween size="xs" direction="horizontal">
                  <Box variant="small">⏱️ {item.estimatedTime}</Box>
                  <Box variant="small">
                    {item.tags.map(tag => `#${tag}`).join(' ')}
                  </Box>
                </SpaceBetween>
              )
            },
            {
              id: 'action',
              content: item => (
                <Button
                  variant="primary"
                  onClick={() => navigate(`/tutorial/${item.id}`)}
                >
                  Start Tutorial
                </Button>
              )
            }
          ]
        }}
        cardsPerRow={[
          { cards: 1 },
          { minWidth: 500, cards: 2 },
          { minWidth: 900, cards: 3 }
        ]}
        items={tutorials}
        header={
          <Header
            counter={`(${tutorials.length})`}
            description="Choose a tutorial to begin your learning journey"
          >
            Available Tutorials
          </Header>
        }
      />
    </SpaceBetween>
  )
}
