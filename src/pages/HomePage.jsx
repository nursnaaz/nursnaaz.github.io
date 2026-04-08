
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Cards from '@cloudscape-design/components/cards'
import Box from '@cloudscape-design/components/box'
import Badge from '@cloudscape-design/components/badge'
import Button from '@cloudscape-design/components/button'
import Input from '@cloudscape-design/components/input'
import Select from '@cloudscape-design/components/select'
import FormField from '@cloudscape-design/components/form-field'
import { tutorials } from '../data/tutorials'

const LEVEL_OPTIONS = [
  { label: 'All Levels', value: 'all' },
  { label: 'Beginner',   value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced',   value: 'advanced' },
]

export function HomePage() {
  const navigate = useNavigate()

  const [searchText,  setSearchText]  = useState('')
  const [levelOption, setLevelOption] = useState(LEVEL_OPTIONS[0])

  const getLevelColor = (level) => {
    const colors = { beginner: 'green', intermediate: 'blue', advanced: 'red' }
    return colors[level] || 'grey'
  }

  // Filter tutorials by search text and selected level
  const filteredTutorials = useMemo(() => {
    const query = searchText.toLowerCase().trim()
    return tutorials.filter(t => {
      const matchesLevel  = levelOption.value === 'all' || t.level === levelOption.value
      const matchesSearch = !query ||
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      return matchesLevel && matchesSearch
    })
  }, [searchText, levelOption])

  const counterLabel = filteredTutorials.length === tutorials.length
    ? `(${tutorials.length})`
    : `(${filteredTutorials.length} of ${tutorials.length})`

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
        items={filteredTutorials}
        empty={
          <Box textAlign="center" color="inherit" padding="l">
            <Box variant="strong">No tutorials found</Box>
            <Box variant="p" color="inherit">
              Try a different search term or level filter.
            </Box>
          </Box>
        }
        header={
          <Header
            counter={counterLabel}
            description="Choose a tutorial to begin your learning journey"
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <FormField>
                  <Select
                    selectedOption={levelOption}
                    onChange={({ detail }) => setLevelOption(detail.selectedOption)}
                    options={LEVEL_OPTIONS}
                    expandToViewport
                  />
                </FormField>
                <FormField>
                  <Input
                    type="search"
                    placeholder="Search tutorials…"
                    value={searchText}
                    onChange={({ detail }) => setSearchText(detail.value)}
                    clearAriaLabel="Clear search"
                  />
                </FormField>
              </SpaceBetween>
            }
          >
            Available Tutorials
          </Header>
        }
      />
    </SpaceBetween>
  )
}
