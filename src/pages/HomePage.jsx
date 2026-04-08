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
import Link from '@cloudscape-design/components/link'
import { tutorials } from '../data/tutorials'

// ─── Filter options ────────────────────────────────────────────────────────────
const LEVEL_OPTIONS = [
  { label: 'All Levels',   value: 'all' },
  { label: 'Beginner',     value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced',     value: 'advanced' },
]

// ─── Profile data — single source of truth ────────────────────────────────────
const PROFILE = {
  name:    'Mohamed Noordeen Alaudeen',
  title:   'Data Scientist — AWS Generative AI Innovation Center',
  company: 'Amazon Web Services (AWS) · Dubai, UAE',
  photo:   'https://digitalconfex.com/wp-content/uploads/2024/07/Mohamed-Noordeen-Alaudeen.webp',
  motto:   'AI won\'t replace you, but a person using AI will.',
  bio:
    'Senior AI & Data Science leader with 10+ years of experience delivering production ML and ' +
    'GenAI systems across Fortune 500 companies. Currently at the AWS Generative AI Innovation ' +
    'Center, building state-of-the-art LLM solutions for global enterprises. ' +
    'Author of Data Science with Python (Packt), recognised as an Emerging Global Leader in ' +
    'Generative AI, and a trusted voice in the community with 29,000+ LinkedIn followers.',

  stats: [
    { value: '10+',    label: 'Years in AI / ML' },
    { value: '50+',    label: 'Production Projects' },
    { value: '1,000+', label: 'Professionals Mentored' },
    { value: '29K+',   label: 'LinkedIn Followers' },
  ],

  // Professional roles — full, visible by default
  professionalExp: [
    {
      company:   'Amazon Web Services (AWS)',
      logo:      '🟠',
      title:     'Data Scientist — Generative AI Innovation Center',
      period:    '2024 – Present',
      location:  'Dubai, UAE',
      current:   true,
      highlights: [
        'Delivers state-of-the-art GenAI solutions to global enterprise clients',
        'Builds LLM pipelines, RAG systems, and AI agents on AWS Bedrock & SageMaker',
        'Works cross-functionally with engineering, product, and C-suite stakeholders',
      ],
    },
    {
      company:   'Dyninno Group',
      logo:      '✈️',
      title:     'Senior AI Scientist — Generative AI',
      period:    '2023 – 2024',
      location:  'Dubai, UAE',
      current:   false,
      highlights: [
        'Led GenAI product development for travel & fintech verticals',
        'Built conversational AI systems and LLM-powered automation pipelines',
      ],
    },
    {
      company:   'Salesforce',
      logo:      '☁️',
      title:     'Senior Data Scientist',
      period:    '2020 – 2021',
      location:  'Remote',
      current:   false,
      highlights: [
        'Developed ML models to predict high-risk change cases, reducing customer downtime',
        'Built end-to-end data pipelines and deployed models to production at scale',
      ],
    },
    {
      company:   'Logitech',
      logo:      '🖱️',
      title:     'Lead Data Scientist',
      period:    '2018 – 2019',
      location:  'Remote',
      current:   false,
      highlights: [
        'Designed and deployed end-to-end BigData and Deep Neural Network systems',
        'Led a team of data scientists across product analytics and demand forecasting',
      ],
    },
    {
      company:   'Tiger Analytics',
      logo:      '📊',
      title:     'Data Science Engineer',
      period:    '2017',
      location:  'India',
      current:   false,
      highlights: [
        'Built ML models for analytics consulting clients across retail and FMCG sectors',
      ],
    },
    {
      company:   'Tata Consultancy Services (TCS)',
      logo:      '💼',
      title:     'Software Engineer',
      period:    '2011 – 2016',
      location:  'India',
      current:   false,
      highlights: [
        'Delivered enterprise software solutions across banking and insurance domains',
        'Foundation in large-scale systems engineering, Java, and SQL — precursor to AI/ML career',
      ],
    },
  ],

  // Teaching & thought leadership
  teachingExp: [
    {
      org:    'GenAI-2026 Cohort (Self-run)',
      role:   'GenAI Trainer & Curriculum Architect',
      detail: 'Designed and delivering a 21-module GenAI curriculum — NLP foundations through production AI systems',
    },
    {
      org:    'KnowledgeHut upGrad',
      role:   'Director of Data Science',
      detail: 'Oversaw data science education programmes and corporate training delivery',
    },
    {
      org:    'Great Learning',
      role:   'Data Science Mentor',
      detail: 'Mentored 1,000+ professionals in ML and Python across online cohorts',
    },
    {
      org:    'Packt Publishing',
      role:   'Author & Technical Editor',
      detail: 'Co-authored Data Science with Python (2019) — 426 pages, published internationally',
    },
  ],

  expertise: [
    'Generative AI & LLMs', 'RAG & Vector Search', 'LangChain & AI Agents',
    'AWS Bedrock & SageMaker', 'NLP & Transformers', 'Deep Learning',
    'MLOps & Deployment', 'Python for Data Science', 'Machine Learning at Scale',
  ],

  awards: [
    { icon: '🏆', title: 'Outstanding Leadership Award', org: 'Internet 2.0 Conference, Dubai, 2024' },
    { icon: '🌟', title: 'Emerging Global Leader in Generative AI', org: 'Times Power Icon' },
  ],

  book: {
    title:     'Data Science with Python',
    publisher: 'Packt Publishing · 2019 · 426 pages',
    url:       'https://www.packtpub.com/en-us/product/data-science-with-python-9781838552862',
  },

  links: {
    linkedin: 'https://linkedin.com/in/nursnaaz',
    github:   'https://github.com/nursnaaz',
  },
}

// ─── ExperienceTimeline ────────────────────────────────────────────────────────
function ExperienceTimeline({ items }) {
  return (
    <div>
      {items.map((exp, idx) => (
        <div
          key={exp.company + exp.period}
          style={{
            display: 'flex',
            gap: 16,
            paddingBottom: idx < items.length - 1 ? 20 : 0,
          }}
        >
          {/* Timeline spine */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
              background: exp.current ? '#0d2a1a' : '#1a2233',
              border: `2px solid ${exp.current ? '#1d8102' : '#414d5c'}`,
            }}>
              {exp.logo}
            </div>
            {idx < items.length - 1 && (
              <div style={{ width: 2, flex: 1, background: '#414d5c', marginTop: 4 }} />
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, paddingTop: 4, paddingBottom: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, marginBottom: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Box variant="strong">{exp.company}</Box>
                {exp.current && <Badge color="green">Current</Badge>}
              </div>
              <Box variant="small" color="text-body-secondary">{exp.period} · {exp.location}</Box>
            </div>
            <Box variant="small" color="text-status-info">{exp.title}</Box>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
              {exp.highlights.map(h => (
                <li key={h} style={{ marginBottom: 3 }}>
                  <Box variant="small" color="text-body-secondary">{h}</Box>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── ProfileSection ────────────────────────────────────────────────────────────
function ProfileSection() {
  return (
    <SpaceBetween size="m">

      {/* ── Hero: identity card ── */}
      <Container>
        <ColumnLayout columns={2} variant="text-grid">

          {/* Left: photo + name + bio + links */}
          <SpaceBetween size="m">
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Photo */}
              <div style={{
                width: 88, height: 88, borderRadius: '50%', flexShrink: 0,
                overflow: 'hidden', border: '3px solid #0073bb',
              }}>
                <img
                  src={PROFILE.photo}
                  alt={PROFILE.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => {
                    e.currentTarget.style.display = 'none'
                    const p = e.currentTarget.parentElement
                    Object.assign(p.style, {
                      background: 'linear-gradient(135deg,#0073bb,#6936d3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '26px', fontWeight: '700',
                    })
                    p.textContent = 'MN'
                  }}
                />
              </div>
              {/* Identity */}
              <div>
                <Box variant="h2">{PROFILE.name}</Box>
                <Box variant="p" color="text-status-info">{PROFILE.title}</Box>
                <Box variant="small" color="text-body-secondary">{PROFILE.company}</Box>
              </div>
            </div>

            <Box variant="p">{PROFILE.bio}</Box>

            {/* Motto */}
            <div style={{
              borderLeft: '3px solid #0073bb',
              paddingLeft: 12,
            }}>
              <Box variant="p" color="text-body-secondary">
                <em>"{PROFILE.motto}"</em>
              </Box>
            </div>

            {/* Links */}
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="primary" href={PROFILE.links.linkedin} target="_blank">
                LinkedIn
              </Button>
              <Button href={PROFILE.links.github} target="_blank">
                GitHub
              </Button>
              <Button href={PROFILE.book.url} target="_blank">
                📘 Book
              </Button>
            </SpaceBetween>
          </SpaceBetween>

          {/* Right: stats + awards + expertise */}
          <SpaceBetween size="l">
            {/* Stats */}
            <ColumnLayout columns={2} variant="text-grid">
              {PROFILE.stats.map(s => (
                <div key={s.label}>
                  <Box fontSize="display-l" fontWeight="bold" color="text-status-info">{s.value}</Box>
                  <Box variant="awsui-key-label">{s.label}</Box>
                </div>
              ))}
            </ColumnLayout>

            {/* Awards */}
            <div>
              <Box variant="awsui-key-label">Awards &amp; Recognition</Box>
              <SpaceBetween size="xs">
                {PROFILE.awards.map(a => (
                  <div key={a.title} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 6 }}>
                    <span style={{ fontSize: 16 }}>{a.icon}</span>
                    <div>
                      <Box variant="strong">{a.title}</Box>
                      <Box variant="small" color="text-body-secondary">{a.org}</Box>
                    </div>
                  </div>
                ))}
              </SpaceBetween>
            </div>

            {/* Published book */}
            <div>
              <Box variant="awsui-key-label">Published Book</Box>
              <div style={{ marginTop: 6 }}>
                <Link href={PROFILE.book.url} external>
                  📘 {PROFILE.book.title}
                </Link>
                <Box variant="small" color="text-body-secondary">{PROFILE.book.publisher}</Box>
              </div>
            </div>
          </SpaceBetween>
        </ColumnLayout>
      </Container>

      {/* ── Expertise tags ── */}
      <Container
        header={<Header variant="h2">Areas of Expertise</Header>}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PROFILE.expertise.map(skill => (
            <Badge key={skill} color="blue">{skill}</Badge>
          ))}
        </div>
      </Container>

      {/* ── Teaching & thought leadership ── */}
      <Container
        header={
          <Header variant="h2" description="Training, authorship, and community contributions">
            Teaching &amp; Thought Leadership
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          {PROFILE.teachingExp.map(t => (
            <div key={t.org}>
              <Box variant="strong">{t.org}</Box>
              <Box variant="small" color="text-status-info">{t.role}</Box>
              <Box variant="small" color="text-body-secondary">{t.detail}</Box>
            </div>
          ))}
        </ColumnLayout>
      </Container>

    </SpaceBetween>
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

      {/* ── Professional profile — top of page ── */}
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
