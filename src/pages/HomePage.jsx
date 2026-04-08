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
import ColumnLayout from '@cloudscape-design/components/column-layout'
import ExpandableSection from '@cloudscape-design/components/expandable-section'
import Link from '@cloudscape-design/components/link'
import { tutorials } from '../data/tutorials'

// ─── Filter options ────────────────────────────────────────────────────────────
const LEVEL_OPTIONS = [
  { label: 'All Levels',    value: 'all' },
  { label: 'Beginner',      value: 'beginner' },
  { label: 'Intermediate',  value: 'intermediate' },
  { label: 'Advanced',      value: 'advanced' },
]

// ─── Profile data ──────────────────────────────────────────────────────────────
const PROFILE = {
  name:    'Mohamed Noordeen Alaudeen',
  title:   'Data Scientist, AWS Generative AI Innovation Center',
  company: 'Amazon Web Services (AWS) · Dubai, UAE',
  photo:   'https://digitalconfex.com/wp-content/uploads/2024/07/Mohamed-Noordeen-Alaudeen.webp',
  motto:   '"AI won\'t replace you, but a person using AI will."',
  bio:
    'An AI and data science leader with over a decade of experience building solutions in NLP, ' +
    'machine learning, and generative AI. Currently delivers state-of-the-art GenAI solutions ' +
    'to global enterprises while mentoring engineers and leaders. ' +
    'Author of Data Science with Python (Packt, 2019) and a recognized voice in the GenAI community ' +
    'with 29,000+ LinkedIn followers.',
  stats: [
    { value: '10+',    label: 'Years in AI/ML' },
    { value: '50+',    label: 'Production ML Projects' },
    { value: '1,000+', label: 'Professionals Mentored' },
    { value: '29K+',   label: 'LinkedIn Followers' },
  ],
  teaches: [
    'Generative AI & LLMs', 'RAG & Vector Search', 'LangChain & AI Agents',
    'Machine Learning', 'Deep Learning', 'NLP from Scratch',
    'MLOps & Deployment', 'Python for Data Science', 'AWS SageMaker & Bedrock',
  ],
  experience: [
    { company: 'Amazon Web Services (AWS)',  title: 'Data Scientist, GenAI Innovation Center', period: '2024 – Present',  current: true },
    { company: 'Dyninno Group',              title: 'Senior AI Scientist — Generative AI',     period: '2023 – 2024',    current: false },
    { company: 'KnowledgeHut upGrad',        title: 'Director of Data Science',                period: '2023',           current: false },
    { company: 'Salesforce',                 title: 'Senior Data Scientist',                   period: '2020 – 2021',    current: false },
    { company: 'Logitech',                   title: 'Lead Data Scientist',                     period: '2018 – 2019',    current: false },
    { company: 'Tiger Analytics',            title: 'Data Science Engineer',                   period: '2017 – 2017',    current: false },
  ],
  awards: [
    '🏆 Outstanding Leadership Award — Internet 2.0 Conference, Dubai (2024)',
    '🌟 Emerging Global Leader in Generative AI — Times Power Icon',
  ],
  book: {
    title:     'Data Science with Python',
    publisher: 'Packt Publishing, 2019',
    url:       'https://www.packtpub.com/en-us/product/data-science-with-python-9781838552862',
  },
  links: {
    linkedin: 'https://linkedin.com/in/nursnaaz',
    github:   'https://github.com/nursnaaz',
    book:     'https://www.packtpub.com/en-us/product/data-science-with-python-9781838552862',
  },
}

// ─── ProfileSection component ──────────────────────────────────────────────────
function ProfileSection() {
  return (
    <Container
      header={
        <Header variant="h2" description="Data Scientist · GenAI Trainer · Published Author">
          About the Instructor
        </Header>
      }
    >
      <SpaceBetween size="l">

        {/* ── Top: photo + identity + stats ── */}
        <ColumnLayout columns={4} variant="text-grid">

          {/* Photo + name block */}
          <div>
            <SpaceBetween size="s">
              <div style={{ width: 90, height: 90, borderRadius: '50%', overflow: 'hidden', border: '3px solid #0073bb' }}>
                <img
                  src={PROFILE.photo}
                  alt={PROFILE.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => {
                    // Fallback to initials if photo fails to load
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement.style.background = 'linear-gradient(135deg,#0073bb,#6936d3)'
                    e.currentTarget.parentElement.style.display = 'flex'
                    e.currentTarget.parentElement.style.alignItems = 'center'
                    e.currentTarget.parentElement.style.justifyContent = 'center'
                    e.currentTarget.parentElement.style.color = '#fff'
                    e.currentTarget.parentElement.style.fontSize = '28px'
                    e.currentTarget.parentElement.style.fontWeight = '700'
                    e.currentTarget.parentElement.textContent = 'MN'
                  }}
                />
              </div>
              <div>
                <Box variant="h3">{PROFILE.name}</Box>
                <Box variant="small" color="text-status-info">{PROFILE.title}</Box>
                <Box variant="small" color="text-body-secondary">{PROFILE.company}</Box>
              </div>
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  variant="primary"
                  iconName="share"
                  href={PROFILE.links.linkedin}
                  target="_blank"
                >
                  LinkedIn
                </Button>
                <Button
                  iconName="script"
                  href={PROFILE.links.github}
                  target="_blank"
                >
                  GitHub
                </Button>
              </SpaceBetween>
            </SpaceBetween>
          </div>

          {/* Stats */}
          {PROFILE.stats.map(s => (
            <div key={s.label}>
              <Box variant="awsui-key-label">{s.label}</Box>
              <Box fontSize="display-l" fontWeight="bold" color="text-status-info">{s.value}</Box>
            </div>
          ))}
        </ColumnLayout>

        {/* ── Motto ── */}
        <Box variant="blockquote" color="text-body-secondary">
          <em>{PROFILE.motto}</em>
        </Box>

        {/* ── Bio ── */}
        <Box variant="p">{PROFILE.bio}</Box>

        {/* ── What I teach ── */}
        <div>
          <Box variant="awsui-key-label">What I Teach</Box>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {PROFILE.teaches.map(topic => (
              <Badge key={topic} color="blue">{topic}</Badge>
            ))}
          </div>
        </div>

        {/* ── Experience (expandable to keep the page tidy) ── */}
        <ExpandableSection headerText="Work Experience" variant="container">
          <ColumnLayout columns={1} borders="horizontal">
            {PROFILE.experience.map(exp => (
              <div key={exp.company + exp.period} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                <div>
                  <Box variant="strong">
                    {exp.current && <Badge color="green">Current</Badge>}{' '}
                    {exp.company}
                  </Box>
                  <Box variant="small" color="text-body-secondary">{exp.title}</Box>
                </div>
                <Box variant="small" color="text-body-secondary">{exp.period}</Box>
              </div>
            ))}
          </ColumnLayout>
        </ExpandableSection>

        {/* ── Awards + Book ── */}
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">Awards &amp; Recognition</Box>
            <SpaceBetween size="xs">
              {PROFILE.awards.map(a => (
                <Box key={a} variant="p">{a}</Box>
              ))}
            </SpaceBetween>
          </div>
          <div>
            <Box variant="awsui-key-label">Published Book</Box>
            <Box variant="p">
              <Link href={PROFILE.links.book} external>
                📘 {PROFILE.book.title}
              </Link>
              <br />
              <Box variant="small" color="text-body-secondary">{PROFILE.book.publisher}</Box>
            </Box>
          </div>
        </ColumnLayout>

      </SpaceBetween>
    </Container>
  )
}

// ─── HomePage ──────────────────────────────────────────────────────────────────
export function HomePage() {
  const navigate = useNavigate()

  const [searchText,  setSearchText]  = useState('')
  const [levelOption, setLevelOption] = useState(LEVEL_OPTIONS[0])

  const getLevelColor = (level) => {
    const colors = { beginner: 'green', intermediate: 'blue', advanced: 'red' }
    return colors[level] || 'grey'
  }

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

      {/* ── Bio / About section — always at the top ── */}
      <ProfileSection />

      {/* ── Site intro ── */}
      <Container
        header={
          <Header
            variant="h2"
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

      {/* ── Tutorial cards with search + filter ── */}
      <Cards
        cardDefinition={{
          header: item => (
            <SpaceBetween size="xs">
              <Box fontSize="heading-m" fontWeight="bold">{item.title}</Box>
              <Badge color={getLevelColor(item.level)}>{item.level}</Badge>
            </SpaceBetween>
          ),
          sections: [
            {
              id: 'description',
              content: item => item.description,
            },
            {
              id: 'meta',
              content: item => (
                <SpaceBetween size="xs" direction="horizontal">
                  <Box variant="small">⏱️ {item.estimatedTime}</Box>
                  <Box variant="small">{item.tags.map(tag => `#${tag}`).join(' ')}</Box>
                </SpaceBetween>
              ),
            },
            {
              id: 'action',
              content: item => (
                <Button variant="primary" onClick={() => navigate(`/tutorial/${item.id}`)}>
                  Start Tutorial
                </Button>
              ),
            },
          ],
        }}
        cardsPerRow={[
          { cards: 1 },
          { minWidth: 500, cards: 2 },
          { minWidth: 900, cards: 3 },
        ]}
        items={filteredTutorials}
        empty={
          <Box textAlign="center" color="inherit" padding="l">
            <Box variant="strong">No tutorials found</Box>
            <Box variant="p" color="inherit">Try a different search term or level filter.</Box>
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
