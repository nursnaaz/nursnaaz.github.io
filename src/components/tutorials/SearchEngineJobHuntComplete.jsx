import { useState, useEffect, useRef } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Container from '@cloudscape-design/components/container'
import Box from '@cloudscape-design/components/box'
import Button from '@cloudscape-design/components/button'
import Alert from '@cloudscape-design/components/alert'
import Header from '@cloudscape-design/components/header'
import Input from '@cloudscape-design/components/input'
import Badge from '@cloudscape-design/components/badge'
import ProgressBar from '@cloudscape-design/components/progress-bar'
import { StudentNote } from '../interactive/StudentNote'
import { TryYourself } from '../interactive/TryYourself'
import { InteractiveInput } from '../interactive/InterativeInput'

// ─── 25 AI Job Postings ───────────────────────────────────────────────────────
// Crafted so some use abbreviations (ML, NLP, LLM) and others use full forms
// (machine learning, natural language processing) — making TF-IDF failures
// dramatic and teachable.

const JOBS = [
  { id: 'J01', flag: '🇬🇧', title: 'Machine Learning Engineer',       company: 'Google DeepMind',    loc: 'London',          desc: 'Design and deploy machine learning systems at scale. Deep expertise in TensorFlow and Python required. Build evaluation pipelines for large neural network models in production.' },
  { id: 'J02', flag: '🇺🇸', title: 'AI Engineer',                     company: 'OpenAI',             loc: 'San Francisco',   desc: 'Build production artificial intelligence applications integrating our APIs. Strong Python programming skills needed. Focus on reliability and safety of AI systems at scale.' },
  { id: 'J03', flag: '🇺🇸', title: 'MLOps Engineer',                  company: 'AWS',                loc: 'Seattle',         desc: 'Own the ML platform and model deployment infrastructure. Experience with Kubernetes, Docker and model serving required. Automate training pipelines and monitor ML model performance.' },
  { id: 'J04', flag: '🇺🇸', title: 'LLM Engineer',                    company: 'Anthropic',          loc: 'San Francisco',   desc: 'Specialise in large language model fine-tuning and alignment research. Deep knowledge of RLHF and Constitutional AI needed. Make powerful language models safe, helpful and honest.' },
  { id: 'J05', flag: '🇺🇸', title: 'Data Scientist',                  company: 'Netflix',            loc: 'Los Angeles',     desc: 'Analyse viewer behaviour to improve content recommendations. Python, SQL and statistical modelling skills required. Design A/B experiments and measure product decisions with data.' },
  { id: 'J06', flag: '🇺🇸', title: 'NLP Engineer',                    company: 'Microsoft',          loc: 'Redmond',         desc: 'Build natural language processing pipelines for Microsoft Copilot. BERT, transformers and text classification expertise needed. Work on entity recognition and sentiment analysis systems.' },
  { id: 'J07', flag: '🇺🇸', title: 'Computer Vision Engineer',        company: 'Tesla',              loc: 'Austin',          desc: 'Develop image recognition and object detection for Autopilot. PyTorch and convolutional neural network experience required. Build real-time video processing for safety-critical applications.' },
  { id: 'J08', flag: '🇺🇸', title: 'AI Research Scientist',           company: 'Meta AI',            loc: 'New York',        desc: 'Conduct foundational deep learning research and publish at top AI conferences. Explore novel architectures, optimisation algorithms and scaling methods. Push the frontier of what AI can do.' },
  { id: 'J09', flag: '🌍',  title: 'Prompt Engineer',                 company: 'Salesforce',         loc: 'Remote',          desc: 'Design and optimise prompts for generative AI products. Experience with ChatGPT, GPT-4 and Claude required. Build prompt templates and improve reliability of AI assistants.' },
  { id: 'J10', flag: '🇺🇸', title: 'GenAI Developer',                 company: 'IBM',                loc: 'New York',        desc: 'Build generative AI applications using RAG pipelines and vector databases. LLM integration and orchestration experience needed. Create enterprise AI solutions with document understanding.' },
  { id: 'J11', flag: '🇸🇪', title: 'ML Platform Engineer',            company: 'Spotify',            loc: 'Stockholm',       desc: 'Build internal ML infrastructure and feature store tooling. MLflow, ML pipelines and Python expertise needed. Enable teams to train, evaluate and ship ML models faster.' },
  { id: 'J12', flag: '🇺🇸', title: 'Conversational AI Engineer',      company: 'Amazon Alexa',       loc: 'Seattle',         desc: 'Design dialogue systems and voice assistant experiences. Natural language understanding and intent classification experience needed. Build entity extraction for voice interactions.' },
  { id: 'J13', flag: '🇺🇸', title: 'AI Product Manager',              company: 'Apple',              loc: 'Cupertino',       desc: 'Define the roadmap for Siri and on-device machine learning features. Understanding of machine learning capabilities and limitations required. Ship AI experiences to millions of users.' },
  { id: 'J14', flag: '🇺🇸', title: 'Reinforcement Learning Engineer', company: 'Boston Dynamics',    loc: 'Boston',          desc: 'Train robots using reinforcement learning and control theory. Simulation environments and reward shaping expertise required. Work on locomotion, manipulation and robot deployment.' },
  { id: 'J15', flag: '🇬🇧', title: 'AI Safety Researcher',            company: 'DeepMind',           loc: 'London',          desc: 'Research alignment and interpretability of large AI systems. RLHF, red-teaming and mechanistic interpretability knowledge needed. Keep AI systems safe and predictable as they scale.' },
  { id: 'J16', flag: '🇨🇦', title: 'Foundation Model Engineer',       company: 'Cohere',             loc: 'Toronto',         desc: 'Pre-train and fine-tune transformer foundation models for enterprise. Distributed training on GPU clusters and mixed-precision training required. Scale models across cloud infrastructure.' },
  { id: 'J17', flag: '🇺🇸', title: 'Knowledge Graph Engineer',        company: 'LinkedIn',           loc: 'Sunnyvale',       desc: 'Build knowledge graphs powering professional network intelligence. Graph neural networks and ontology design experience needed. Connect profiles, companies and skills using structured knowledge.' },
  { id: 'J18', flag: '🇸🇬', title: 'Recommendation Systems Engineer', company: 'TikTok',             loc: 'Singapore',       desc: 'Build the recommendation engine powering the For You feed. Collaborative filtering, deep learning ranking and real-time serving expertise needed. Personalise content for one billion users.' },
  { id: 'J19', flag: '🇺🇸', title: 'AI Infrastructure Engineer',      company: 'Nvidia',             loc: 'Santa Clara',     desc: 'Build GPU cluster infrastructure for AI training workloads. CUDA programming, distributed computing and HPC systems knowledge needed. Optimise utilisation for large-scale deep learning.' },
  { id: 'J20', flag: '🇺🇸', title: 'Speech Recognition Engineer',     company: 'Rev.ai',             loc: 'San Francisco',   desc: 'Build automatic speech recognition systems for transcription products. Audio signal processing and wav2vec expertise required. Improve accuracy across accents, noise conditions and languages.' },
  { id: 'J21', flag: '🇬🇧', title: 'Financial ML Engineer',           company: 'Bloomberg',          loc: 'London',          desc: 'Build machine learning models for financial data and market signal analysis. Time series forecasting, anomaly detection and quantitative modelling skills needed. Apply ML to trading risk.' },
  { id: 'J22', flag: '🇬🇧', title: 'Healthcare AI Engineer',          company: 'DeepMind Health',    loc: 'London',          desc: 'Apply deep learning to medical imaging and clinical text analysis. Computer vision for radiology and clinical NLP for patient records experience needed. Build AI systems for clinicians.' },
  { id: 'J23', flag: '🇺🇸', title: 'Autonomous Systems ML Engineer',  company: 'Waymo',              loc: 'Mountain View',   desc: 'Build machine learning systems for self-driving vehicle perception. Sensor fusion, lidar processing and 3D object detection expertise required. Train models for real-time safety decisions.' },
  { id: 'J24', flag: '🌍',  title: 'AI Ethics Researcher',            company: 'Mozilla Foundation', loc: 'Remote',          desc: 'Research fairness, accountability and transparency in AI systems. Bias detection, model auditing and responsible AI policy experience needed. Advocate for ethical AI that works for everyone.' },
  { id: 'J25', flag: '🌍',  title: 'RAG Systems Engineer',            company: 'Pinecone',           loc: 'Remote',          desc: 'Build retrieval augmented generation systems using vector databases. Embedding models, semantic search and LLM orchestration expertise needed. Create enterprise knowledge management powered by AI.' },
]

// ─── Badges ───────────────────────────────────────────────────────────────────
const BADGES = [
  { id: 'hired',      icon: '👔', name: 'New Hire',       desc: 'You accepted the mission!',         xp: 10,  color: '#10b981' },
  { id: 'explorer',  icon: '🗺️', name: 'Data Explorer',  desc: 'You reviewed all 25 job postings!', xp: 15,  color: '#3b82f6' },
  { id: 'searcher',  icon: '🔍', name: 'First Search',    desc: 'You ran your first search!',        xp: 20,  color: '#8b5cf6' },
  { id: 'maths',     icon: '🧮', name: 'Math Wizard',     desc: 'You calculated TF-IDF by hand!',    xp: 40,  color: '#f59e0b' },
  { id: 'expert',    icon: '🎯', name: 'Search Expert',   desc: 'You completed 5 searches!',         xp: 30,  color: '#06b6d4' },
  { id: 'bughunter', icon: '🐛', name: 'Bug Hunter',      desc: "You found TF-IDF's fatal flaw!",   xp: 40,  color: '#ef4444' },
  { id: 'engineer',  icon: '🏆', name: 'Search Engineer', desc: 'Tutorial complete! You did it!',    xp: 60,  color: '#f97316' },
]
const MAX_XP = BADGES.reduce((s, b) => s + b.xp, 0) // 215

// ─── Guided failure queries ───────────────────────────────────────────────────
const TRAPS = [
  { id: 'ml',     label: '"ML engineer"',           query: 'ML engineer',           emoji: '😱', shouldFind: 'Machine Learning Engineer @ Google DeepMind',           why: '"ML" is just an abbreviation. Google\'s job says "machine learning" — the full form. TF-IDF treats "ML" and "machine learning" as completely different words. They\'ve never met.' },
  { id: 'chatbot',label: '"chatbot developer"',     query: 'chatbot developer',     emoji: '😤', shouldFind: 'Conversational AI Engineer @ Amazon Alexa',              why: '"chatbot" appears in zero job postings. Amazon builds exactly that — but calls it "dialogue systems" and "conversational AI". TF-IDF can only match exact characters.' },
  { id: 'gpt',    label: '"GPT specialist"',        query: 'GPT specialist',        emoji: '🤦', shouldFind: 'LLM Engineer @ Anthropic + Foundation Model Engineer @ Cohere', why: '"GPT" only appears in one posting (Salesforce prompt role). Anthropic and Cohere build the same thing — but say "large language model" and "foundation model". Missed entirely.' },
  { id: 'neural', label: '"neural network scientist"', query: 'neural network scientist', emoji: '💀', shouldFind: 'AI Research Scientist @ Meta AI',                  why: 'Meta\'s description says "deep learning research" and "AI architectures" — not "neural network scientist". Same job, different vocabulary. TF-IDF gives it 0.0.' },
]

// ─── TF-IDF implementation (runs fully in-browser) ───────────────────────────
const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','is','it',
  'with','you','we','our','your','are','be','by','from','as','this','that',
  'have','has','will','can','all','into','more','their','its','using','used',
])

function tokenize(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(t => t.length > 1)
}
function preprocess(text) {
  return tokenize(text).filter(t => !STOP_WORDS.has(t))
}
function tf(term, docTerms) {
  const count = docTerms.filter(t => t === term).length
  return docTerms.length > 0 ? count / docTerms.length : 0
}
function idf(term, allDocTerms) {
  const df = allDocTerms.filter(doc => doc.includes(term)).length
  return df > 0 ? Math.log(allDocTerms.length / df) : 0
}
function computeScores(query) {
  const queryTerms = preprocess(query)
  if (!queryTerms.length) return JOBS.map(j => ({ ...j, score: 0, queryTerms: [] }))
  const allDocTerms = JOBS.map(j => preprocess(`${j.title} ${j.desc}`))
  return JOBS.map((job, i) => {
    const docTerms = allDocTerms[i]
    const score = queryTerms.reduce((s, t) => s + tf(t, docTerms) * idf(t, allDocTerms), 0)
    return { ...job, score, queryTerms }
  }).sort((a, b) => b.score - a.score)
}
function computeNaiveScores(query) {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 0)
  return JOBS.map(j => {
    const text = `${j.title} ${j.desc}`.toLowerCase()
    const score = words.reduce((n, w) => n + (text.split(w).length - 1), 0)
    return { ...j, score }
  }).sort((a, b) => b.score - a.score)
}

// ─── Badge toast notification ─────────────────────────────────────────────────
function BadgeToast({ badge, onDismiss }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 50)
    const t2 = setTimeout(() => { setShow(false); setTimeout(onDismiss, 350) }, 3800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDismiss])
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      background: '#fff', borderRadius: 14, padding: '18px 22px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
      border: `3px solid ${badge.color}`,
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      opacity: show ? 1 : 0,
      transform: show ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.9)',
      minWidth: 280,
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{ fontSize: 46 }}>{badge.icon}</div>
        <div>
          <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 3 }}>🔓 Badge Unlocked!</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: badge.color, marginBottom: 2 }}>{badge.name}</div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>{badge.desc}</div>
          <div style={{ fontSize: 12, color: badge.color, fontWeight: 700, marginTop: 5 }}>+{badge.xp} XP ⚡</div>
        </div>
      </div>
    </div>
  )
}

// ─── XP bar + badge shelf (always visible at top) ────────────────────────────
function XPBar({ xp, badges }) {
  const pct = Math.min((xp / MAX_XP) * 100, 100)
  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontWeight: 800, color: '#667eea', fontSize: 16 }}>⚡ {xp} XP</span>
            <span style={{ color: '#9ca3af', fontSize: 13 }}>Goal: {MAX_XP} XP</span>
          </div>
          <div style={{ background: '#e2e8f0', borderRadius: 8, height: 14, overflow: 'hidden' }}>
            <div style={{
              width: `${pct}%`, height: '100%',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              borderRadius: 8, transition: 'width 0.7s ease',
            }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {BADGES.map(b => (
            <div key={b.id}
              title={badges.includes(b.id) ? `${b.name} — ${b.desc}` : '🔒 Not yet unlocked'}
              style={{ fontSize: 28, opacity: badges.includes(b.id) ? 1 : 0.18, transition: 'all 0.4s ease', cursor: 'help', transform: badges.includes(b.id) ? 'scale(1.15)' : 'scale(1)' }}>
              {b.icon}
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}

// ─── Reusable step wrapper with conditional Next button ───────────────────────
function GameStep({ title, icon, children, onNext, onPrev, canNext = true, isFirst = false, isLast = false, lockedMsg = '⏳ Complete the task above to continue' }) {
  return (
    <Container
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 22, fontWeight: 800,
          }}>{icon}</div>
          <Header variant="h2">{title}</Header>
        </div>
      }
    >
      <SpaceBetween size="l">
        {children}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #e2e8f0', marginTop: 8, flexWrap: 'wrap', gap: 10 }}>
          <Button disabled={isFirst} onClick={onPrev}>← Previous</Button>
          {!isLast && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {!canNext && <span style={{ fontSize: 13, color: '#d97706', fontWeight: 600 }}>{lockedMsg}</span>}
              <Button variant="primary" disabled={!canNext} onClick={onNext}>Next Step →</Button>
            </div>
          )}
        </div>
      </SpaceBetween>
    </Container>
  )
}

// ─── Term highlighter ─────────────────────────────────────────────────────────
function HighlightedText({ text, queryTerms }) {
  if (!queryTerms || queryTerms.length === 0) return <>{text}</>
  const escaped = queryTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <mark key={i} style={{ background: '#fef08a', borderRadius: 3, padding: '0 2px', fontWeight: 700 }}>{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  )
}

// ─── Live TF-IDF search engine component ─────────────────────────────────────
function LiveSearchEngine({ onSearchDone, placeholder = 'e.g. "machine learning engineer" or "NLP transformers"' }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [queryTerms, setQueryTerms] = useState([])

  const runSearch = (q) => {
    const searchQ = (typeof q === 'string' ? q : query).trim()
    if (!searchQ) return
    const scored = computeScores(searchQ)
    setResults(scored)
    setQueryTerms(preprocess(searchQ))
    if (onSearchDone) onSearchDone(searchQ, scored)
  }

  const topJobs = results ? results.slice(0, 8) : []
  const maxScore = Math.max(...topJobs.map(r => r.score), 0.0001)
  const matched = results ? results.filter(r => r.score > 0).length : 0
  const missed = results ? results.length - matched : 0

  return (
    <SpaceBetween size="m">
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }} onKeyDown={(e) => e.key === 'Enter' && runSearch()}>
          <Input value={query} onChange={({ detail }) => setQuery(detail.value)} placeholder={placeholder} />
        </div>
        <Button variant="primary" iconName="search" onClick={() => runSearch()}>Search</Button>
      </div>

      {results && (
        <SpaceBetween size="m">
          <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
            <span style={{ color: '#059669', fontWeight: 700 }}>✅ {matched} matched</span>
            <span style={{ color: '#dc2626', fontWeight: 700 }}>❌ {missed} scored 0.0</span>
          </div>

          {/* Animated score bars */}
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: 16, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
              TF-IDF Rankings — Top 8
            </div>
            {topJobs.map((job, i) => (
              <div key={job.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>
                    <span style={{ color: '#667eea', fontSize: 11, marginRight: 6, fontWeight: 800 }}>#{i + 1}</span>
                    {job.flag} {job.title}
                    <span style={{ color: '#9ca3af', fontWeight: 400 }}> · {job.company}</span>
                  </span>
                  <span style={{
                    fontSize: 12, fontWeight: 800, fontFamily: 'monospace', minWidth: 64, textAlign: 'right',
                    color: job.score > 0.05 ? '#059669' : job.score > 0.01 ? '#2563eb' : job.score > 0 ? '#d97706' : '#dc2626'
                  }}>
                    {job.score.toFixed(4)}
                  </span>
                </div>
                <div style={{ background: '#e2e8f0', borderRadius: 6, height: 11, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(job.score / maxScore) * 100}%`, height: '100%', borderRadius: 6,
                    transition: 'width 0.85s cubic-bezier(0.22, 1, 0.36, 1)',
                    background: job.score > 0.05 ? 'linear-gradient(90deg,#10b981,#059669)'
                      : job.score > 0.01 ? 'linear-gradient(90deg,#60a5fa,#3b82f6)'
                      : job.score > 0 ? 'linear-gradient(90deg,#fcd34d,#f59e0b)'
                      : '#e2e8f0',
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Best match or zero state */}
          {results[0]?.score > 0 ? (
            <div style={{ border: '2px solid #10b981', borderRadius: 12, padding: 16, background: '#f0fdf4' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                🏆 Best Match
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>
                {results[0].flag} {results[0].title}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 10 }}>
                {results[0].company} · 📍 {results[0].loc}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.75, color: '#374151' }}>
                <HighlightedText text={results[0].desc} queryTerms={queryTerms} />
              </div>
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: '#059669' }}>
                TF-IDF Score: {results[0].score.toFixed(4)}
              </div>
            </div>
          ) : (
            <Alert type="error" header="🚨 Every job scored 0.0000">
              The words you used don't appear in any job description. This is the vocabulary mismatch problem — and you're about to understand exactly why it happens.
            </Alert>
          )}
        </SpaceBetween>
      )}
    </SpaceBetween>
  )
}

// ─── Step 0: Mission Briefing ─────────────────────────────────────────────────
function Step0_Mission({ onNext, unlockBadge }) {
  const [accepted, setAccepted] = useState(false)
  const accept = () => {
    setAccepted(true)
    unlockBadge('hired')
    setTimeout(onNext, 2200)
  }
  return (
    <Container header={<Header variant="h2">🎯 Mission Briefing — You've Been Hired</Header>}>
      <SpaceBetween size="l">
        <div style={{ background: 'linear-gradient(135deg,rgba(102,126,234,0.08),rgba(118,75,162,0.08))', borderRadius: 14, padding: 24, border: '1.5px solid #c4b5fd' }}>
          <div style={{ fontSize: 12, color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
            📧 New Email · From: cto@aijobs.ai · Subject: You got the job!
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 16, color: '#1e1b4b' }}>
            "Congratulations — You're our new Search Engineer!"
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.9, color: '#374151', marginBottom: 20 }}>
            Your first task: <strong>build the search engine for our AI job board.</strong>
            <br />
            We have <strong>25 real AI/ML job postings</strong> from companies like Google, OpenAI, Tesla and Anthropic.
            Thousands of job seekers are counting on you to build something that actually understands what they're looking for.
            <br /><br />
            The previous engineer used a naive word-counting approach. It failed miserably.
            You need to build something smarter — and discover exactly why the old approach breaks.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
            {['🇬🇧 Google', '🇺🇸 OpenAI', '🇺🇸 Tesla', '🇺🇸 Meta AI', '🇺🇸 Anthropic', '🇨🇦 Cohere', '🇸🇬 TikTok', '+ 18 more'].map(c => (
              <div key={c} style={{ background: 'white', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e2e8f0' }}>{c}</div>
            ))}
          </div>
          {!accepted ? (
            <Button variant="primary" onClick={accept}>✅ Accept the Mission — Let's Build This!</Button>
          ) : (
            <Alert type="success" header="Mission accepted! 👔 New Hire badge earned!">
              Welcome to the team! +10 XP. Loading your job database in 2 seconds...
            </Alert>
          )}
        </div>
        <StudentNote title="What You'll Learn in 8 Steps">
          You'll build a <strong>TF-IDF search engine</strong> — the algorithm that powered early Google.
          Step by step, you'll calculate the math by hand, watch it work, watch it fail, and finally understand why the world needed something more powerful.
          Earn <strong>7 badges</strong> and <strong>215 XP</strong> along the way.
        </StudentNote>
      </SpaceBetween>
    </Container>
  )
}

// ─── Step 1: The Job Database ─────────────────────────────────────────────────
function Step1_Database({ onNext, onPrev, unlockBadge, badges }) {
  const [ready, setReady] = useState(false)
  const handleReady = () => {
    setReady(true)
    if (!badges.includes('explorer')) unlockBadge('explorer')
    setTimeout(onNext, 1400)
  }
  return (
    <GameStep title="Your Job Database — 25 AI Roles" icon="🗺️" onNext={onNext} onPrev={onPrev} canNext={false}>
      <StudentNote>
        Before writing a single line of search code, you must understand your data.
        Scroll through all 25 job postings. Pay close attention to how different companies describe similar roles — the vocabulary differences are the key to everything that follows.
      </StudentNote>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 10, maxHeight: 460, overflowY: 'auto', padding: '2px 4px' }}>
        {JOBS.map(job => (
          <div key={job.id}
            style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#667eea'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(102,126,234,0.14)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 700, flex: 1, lineHeight: 1.4 }}>{job.flag} {job.title}</div>
              <div style={{ fontSize: 10, color: '#c4b5fd', fontWeight: 700 }}>{job.id}</div>
            </div>
            <div style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600, marginBottom: 4 }}>{job.company}</div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>📍 {job.loc}</div>
          </div>
        ))}
      </div>

      <TryYourself>
        Spot the vocabulary traps! Notice: <strong>Spotify (J11)</strong> says "ML" but <strong>Google (J01)</strong> says "machine learning". <strong>Anthropic (J04)</strong> says "LLM" but <strong>Cohere (J16)</strong> says "foundation model". <strong>Amazon (J12)</strong> says "conversational AI" — nobody says "chatbot". These mismatches will become critical later.
      </TryYourself>

      {!ready ? (
        <div style={{ textAlign: 'center' }}>
          <Button variant="primary" onClick={handleReady}>
            🗺️ I've reviewed all 25 jobs — I'm ready to build the search engine
          </Button>
        </div>
      ) : (
        <Alert type="success" header="Data Explorer badge earned! 🗺️">
          +15 XP! You've seen the data. Now let's build the first version of the search engine — starting with the simplest possible approach.
        </Alert>
      )}
    </GameStep>
  )
}

// ─── Step 2: Naive Word Count Search ─────────────────────────────────────────
function Step2_NaiveSearch({ onNext, onPrev }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [presetType, setPresetType] = useState(null)

  const PRESETS = [
    { label: '✅ "machine learning"', query: 'machine learning', type: 'good' },
    { label: '⚠️ "the best engineer"', query: 'the best engineer', type: 'bad' },
    { label: '✅ "Python AI"', query: 'Python AI', type: 'good' },
    { label: '⚠️ "of and the"', query: 'of and the', type: 'bad' },
  ]

  const run = (q, type) => {
    const searchQ = (typeof q === 'string' ? q : query).trim()
    if (!searchQ) return
    setResults(computeNaiveScores(searchQ))
    setPresetType(type || null)
  }

  const topResults = results ? results.slice(0, 6) : []
  const maxScore = Math.max(...topResults.map(r => r.score), 1)

  return (
    <GameStep title="Attempt 1 — Just Count the Words" icon="🤔" onNext={onNext} onPrev={onPrev}>
      <StudentNote title="The Naive Idea">
        The simplest possible search engine: count how many times each query word appears in a job description. The job with the highest word count wins.
        <br /><br />
        It sounds reasonable. Let's test it — then break it.
      </StudentNote>

      <div style={{ background: '#1e1e2e', borderRadius: 10, padding: 16, color: '#cdd6f4', fontFamily: 'monospace', fontSize: 13, lineHeight: 2 }}>
        <span style={{ color: '#89b4fa' }}>def</span> <span style={{ color: '#a6e3a1' }}>naive_score</span>(query, job_description):<br />
        &nbsp;&nbsp;words = query.<span style={{ color: '#f38ba8' }}>split</span>()<br />
        &nbsp;&nbsp;<span style={{ color: '#89b4fa' }}>return</span> <span style={{ color: '#f38ba8' }}>sum</span>(job_description.<span style={{ color: '#f38ba8' }}>count</span>(w) <span style={{ color: '#89b4fa' }}>for</span> w <span style={{ color: '#89b4fa' }}>in</span> words)
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Try these preset queries — one will surprise you:</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PRESETS.map(p => (
            <Button key={p.query} variant={p.type === 'good' ? 'primary' : 'normal'} onClick={() => { setQuery(p.query); run(p.query, p.type) }}>{p.label}</Button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }} onKeyDown={e => e.key === 'Enter' && run()}>
          <Input value={query} onChange={({ detail }) => setQuery(detail.value)} placeholder="Or type your own query..." />
        </div>
        <Button onClick={() => run()}>Search</Button>
      </div>

      {results && (
        <SpaceBetween size="m">
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: 16, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
              Naive Word Count — Top 6
            </div>
            {topResults.map((job, i) => (
              <div key={job.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 3 }}>
                  <span><strong>#{i + 1}</strong> {job.flag} {job.title} · <span style={{ color: '#8b5cf6' }}>{job.company}</span></span>
                  <span style={{ fontWeight: 700 }}>{job.score} hits</span>
                </div>
                <div style={{ background: '#e2e8f0', borderRadius: 4, height: 10, overflow: 'hidden' }}>
                  <div style={{ width: `${(job.score / maxScore) * 100}%`, height: '100%', background: '#8b5cf6', borderRadius: 4, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>

          {presetType === 'bad' && (
            <Alert type="error" header="🚨 The Problem — Common Words Win!">
              Common words like <strong>"the"</strong>, <strong>"and"</strong>, <strong>"of"</strong> appear in almost every job description. So queries containing these words push irrelevant jobs to the top just because they happen to mention "the" a lot.
              <br /><br />
              <strong>The fix:</strong> We need to penalise words that appear everywhere. A word that's in every document tells us nothing. That's exactly what <strong>IDF (Inverse Document Frequency)</strong> solves.
            </Alert>
          )}
          {presetType === 'good' && (
            <Alert type="success" header="Works great! But it has hidden flaws...">
              Specific technical words like "machine" and "Python" work well because they're rare. But try the ⚠️ queries above — you'll quickly see the fundamental problem with naive counting.
            </Alert>
          )}
        </SpaceBetween>
      )}
    </GameStep>
  )
}

// ─── Step 3: TF-IDF Mathematics ──────────────────────────────────────────────
function Step3_Mathematics({ onNext, onPrev, unlockBadge, badges }) {
  const [tfDone, setTfDone] = useState(false)
  const [idfDone, setIdfDone] = useState(false)
  const canNext = tfDone && idfDone

  useEffect(() => {
    if (tfDone && idfDone && !badges.includes('maths')) unlockBadge('maths')
  }, [tfDone, idfDone]) // eslint-disable-line

  return (
    <GameStep title="The Math — TF × IDF" icon="🧮" onNext={onNext} onPrev={onPrev}
      canNext={canNext} lockedMsg="✅ Complete both calculations above to continue">

      <StudentNote title="The Two-Part Fix">
        We fix naive counting with two complementary ideas:
        <br />
        <strong>TF (Term Frequency):</strong> How often does this word appear in THIS document? Normalised by document length so longer documents don't have an unfair advantage.
        <br />
        <strong>IDF (Inverse Document Frequency):</strong> How rare is this word across ALL documents? Rare words get a high score; words that appear everywhere ("the", "and") get penalised toward zero.
        <br /><br />
        <strong>Final score = TF × IDF.</strong> High only when a word is frequent in this doc AND rare across all docs. Let's calculate it by hand.
      </StudentNote>

      {/* TF exercise */}
      <div style={{ border: '2px solid #3b82f6', borderRadius: 12, padding: 20, background: '#eff6ff' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#1d4ed8', marginBottom: 14 }}>📐 Part 1 — TF (Term Frequency)</div>
        <div style={{ background: '#1e3a5f', borderRadius: 8, padding: 12, color: '#93c5fd', fontFamily: 'monospace', fontSize: 13, marginBottom: 16 }}>
          TF(word, doc) = count(word in doc) / total_words_in_doc
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.9, marginBottom: 14, color: '#1e3a5f' }}>
          <strong>Mini document (simplified for the exercise):</strong><br />
          <em>"best machine learning engineer joins our team today"</em><br />
          After preprocessing (removing stop words):<br />
          <strong>[best, machine, learning, engineer, joins, team, today] → 7 terms total</strong><br /><br />
          The word <strong>"machine"</strong> appears <strong>1 time</strong>.
        </div>
        <InteractiveInput
          label='Calculate TF("machine") — enter a decimal number'
          correctAnswer={0.143}
          tolerance={0.01}
          placeholder="e.g. 0.143"
          hint="Count = 1 occurrence. Total terms = 7. TF = 1 ÷ 7 ≈ ?"
        />
        {!tfDone && <Button variant="link" onClick={() => setTfDone(true)}>✅ Got it — mark TF as done</Button>}
        {tfDone && <Alert type="success">✅ TF mastered! 1 ÷ 7 ≈ 0.143</Alert>}
      </div>

      {/* IDF exercise */}
      <div style={{ border: '2px solid #8b5cf6', borderRadius: 12, padding: 20, background: '#f5f3ff' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#6d28d9', marginBottom: 14 }}>📐 Part 2 — IDF (Inverse Document Frequency)</div>
        <div style={{ background: '#2d1b69', borderRadius: 8, padding: 12, color: '#c4b5fd', fontFamily: 'monospace', fontSize: 13, marginBottom: 16 }}>
          IDF(word) = ln( total_documents / documents_containing_word )
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.9, marginBottom: 14, color: '#2e1065' }}>
          Across our <strong>25 job postings</strong>, the word <strong>"machine"</strong> appears in exactly <strong>4 jobs</strong>:
          Google (J01), Apple (J13), Bloomberg (J21), and Waymo (J23).<br /><br />
          IDF("machine") = ln(25 ÷ 4) = ln(6.25) ≈ ?
        </div>
        <InteractiveInput
          label='Calculate IDF("machine") across all 25 jobs — enter a decimal'
          correctAnswer={1.833}
          tolerance={0.05}
          placeholder="e.g. 1.833"
          hint="ln(25/4) = ln(6.25). In Python: import math; math.log(6.25). On calculator: ln(6.25) ≈ 1.833"
        />
        {!idfDone && <Button variant="link" onClick={() => setIdfDone(true)}>✅ Got it — mark IDF as done</Button>}
        {idfDone && <Alert type="success">✅ IDF mastered! ln(25/4) ≈ 1.833</Alert>}
      </div>

      {canNext && (
        <div style={{ background: 'linear-gradient(135deg,#fef9c3,#fef08a)', border: '2px solid #f59e0b', borderRadius: 12, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🧮</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Math Wizard badge unlocked! +40 XP</div>
          <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.8 }}>
            TF-IDF("machine", Google job) = 0.143 × 1.833 ≈ <strong style={{ color: '#d97706' }}>0.262</strong>
            <br />
            Now let's run this calculation across all 25 jobs simultaneously — and watch the rankings animate live!
          </div>
        </div>
      )}
    </GameStep>
  )
}

// ─── Step 4: Live TF-IDF Search Engine ───────────────────────────────────────
function Step4_LiveSearch({ onNext, onPrev, unlockBadge, badges }) {
  const countRef = useRef(0)
  const [localCount, setLocalCount] = useState(0)
  const canNext = localCount >= 5

  const SUGGESTED = [
    '"machine learning engineer"', '"NLP transformers BERT"',
    '"computer vision PyTorch"', '"LLM fine-tuning RLHF"',
    '"RAG vector database"', '"deep learning research"',
  ]

  const onSearch = () => {
    countRef.current += 1
    const n = countRef.current
    setLocalCount(n)
    if (n === 1 && !badges.includes('searcher')) unlockBadge('searcher')
    if (n === 5) unlockBadge('expert')
  }

  return (
    <GameStep title="Your Real TF-IDF Search Engine — Live!" icon="🎯" onNext={onNext} onPrev={onPrev}
      canNext={canNext} lockedMsg={`🔍 Do ${5 - localCount} more search${5 - localCount !== 1 ? 'es' : ''} to unlock the next step`}>

      <StudentNote title="This Is The Real Thing">
        This search engine runs TF-IDF on all 25 jobs in real time — fully in your browser.
        Watch the bars animate as rankings shift. Notice that rare, specific words (like "RLHF" or "wav2vec") score much higher than common words (like "build" or "system").
      </StudentNote>

      <div>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Suggested queries to try:</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SUGGESTED.map(s => (
            <div key={s} style={{ fontSize: 12, background: '#eff6ff', color: '#2563eb', borderRadius: 6, padding: '5px 11px', border: '1px solid #bfdbfe', fontWeight: 600, cursor: 'default' }}>
              {s}
            </div>
          ))}
        </div>
      </div>

      <LiveSearchEngine onSearchDone={onSearch} />

      <ProgressBar
        value={(Math.min(localCount, 5) / 5) * 100}
        label={`${Math.min(localCount, 5)}/5 searches completed`}
        description={canNext ? '✅ Search Expert unlocked! Click Next Step to continue.' : 'Complete 5 searches to unlock the next step'}
        status={canNext ? 'success' : 'in-progress'}
      />

      {canNext && (
        <Alert type="success" header="🎯 Search Expert badge earned! +30 XP">
          You've mastered TF-IDF search — the algorithm that powered early Google. Now comes the really interesting part: can you break it? (Spoiler: yes.)
        </Alert>
      )}
    </GameStep>
  )
}

// ─── Step 5: Break the Engine ─────────────────────────────────────────────────
function Step5_BreakIt({ onNext, onPrev, unlockBadge, badges, trapsCompleted, handleTrapDone }) {
  const [activeResult, setActiveResult] = useState(null)
  const [activeTrap, setActiveTrap] = useState(null)
  const allDone = TRAPS.every(t => trapsCompleted.includes(t.id))

  const tryTrap = (trap) => {
    setActiveResult(computeScores(trap.query))
    setActiveTrap(trap)
    if (!trapsCompleted.includes(trap.id)) handleTrapDone(trap.id)
  }

  useEffect(() => {
    if (allDone && !badges.includes('bughunter')) unlockBadge('bughunter')
  }, [allDone]) // eslint-disable-line

  const topResults = activeResult ? activeResult.slice(0, 5) : []
  const maxScore = Math.max(...topResults.map(r => r.score), 0.0001)

  return (
    <GameStep title="Break the Engine — 4 Queries That Fail" icon="💥" onNext={onNext} onPrev={onPrev}
      canNext={allDone} lockedMsg={`🐛 Try ${TRAPS.filter(t => !trapsCompleted.includes(t.id)).length} more failing quer${TRAPS.filter(t => !trapsCompleted.includes(t.id)).length !== 1 ? 'ies' : 'y'} to continue`}>

      <StudentNote title="Time to Break Things">
        Your TF-IDF engine looks great — until it doesn't. Below are 4 searches that <em>should</em> return obvious results but fail completely. Click each one. Watch the scores collapse. Discover the fundamental limit of keyword search.
      </StudentNote>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 10 }}>
        {TRAPS.map(trap => {
          const done = trapsCompleted.includes(trap.id)
          const active = activeTrap?.id === trap.id
          return (
            <div key={trap.id} onClick={() => tryTrap(trap)}
              style={{
                border: `2px solid ${done ? '#ef4444' : active ? '#667eea' : '#e2e8f0'}`,
                borderRadius: 10, padding: 16, cursor: 'pointer',
                background: done ? '#fef2f2' : active ? '#f5f3ff' : 'white',
                transition: 'all 0.2s',
                transform: active ? 'scale(1.02)' : 'scale(1)',
              }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{done ? '🐛' : '🔍'}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: '#111' }}>{trap.label}</div>
              <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>Should find: {trap.shouldFind.split('+')[0].trim()}</div>
              {done && <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 700, marginTop: 6 }}>FAILED — Score: 0.0000 ❌</div>}
            </div>
          )
        })}
      </div>

      <ProgressBar
        value={(trapsCompleted.length / TRAPS.length) * 100}
        label={`${trapsCompleted.length}/${TRAPS.length} failures discovered`}
        description={allDone ? '🐛 All 4 failures found! TF-IDF is broken.' : 'Find all 4 failures to continue'}
        status={allDone ? 'error' : 'in-progress'}
      />

      {activeResult && activeTrap && (
        <SpaceBetween size="m">
          <div style={{ border: '2px solid #ef4444', borderRadius: 12, padding: 16, background: '#fef2f2' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#dc2626', marginBottom: 14 }}>
              {activeTrap.emoji} Results for "{activeTrap.query}":
            </div>
            {topResults.map((job, i) => (
              <div key={job.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>#{i + 1} {job.flag} {job.title} · {job.company}</span>
                  <span style={{ fontWeight: 800, color: job.score === 0 ? '#dc2626' : '#059669' }}>
                    {job.score === 0 ? '0.0000 ❌' : job.score.toFixed(4)}
                  </span>
                </div>
                <div style={{ background: '#fecaca', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${(job.score / maxScore) * 100}%`, height: '100%', background: '#dc2626', borderRadius: 4, transition: 'width 0.7s ease' }} />
                </div>
              </div>
            ))}
          </div>
          <Alert type="error" header={`Why "${activeTrap.query}" fails:`}>
            {activeTrap.why}
            <br /><br />
            <strong>The job you actually wanted</strong> — {activeTrap.shouldFind} — scored <strong>0.0000</strong>.
            It's in the database. It's a perfect match. But TF-IDF can't see it.
          </Alert>
        </SpaceBetween>
      )}

      {allDone && (
        <div style={{ background: 'linear-gradient(135deg,#fef9c3,#fef08a)', border: '2px solid #f59e0b', borderRadius: 12, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🐛</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Bug Hunter badge earned! +40 XP</div>
          <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.8 }}>
            You've uncovered TF-IDF's fatal flaw. Now let's understand exactly <em>why</em> it happens — and what the world invented to fix it.
          </div>
        </div>
      )}
    </GameStep>
  )
}

// ─── Step 6: Why It Fails ─────────────────────────────────────────────────────
function Step6_WhyItFails({ onNext, onPrev }) {
  return (
    <GameStep title="The Vocabulary Prison — Why It Really Fails" icon="🧠" onNext={onNext} onPrev={onPrev}>
      <StudentNote title="The Root Cause">
        TF-IDF is a <strong>character-matching</strong> system. It works perfectly in a world where everyone uses the exact same vocabulary. The moment language becomes messy — abbreviations, synonyms, jargon, brand names — it collapses.
      </StudentNote>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
        {[
          { you: 'ML engineer',           job: 'Machine Learning Engineer', type: 'Abbreviation vs full form',     colour: '#dc2626' },
          { you: 'chatbot developer',      job: 'Conversational AI Engineer', type: 'Synonym for the same role',    colour: '#ea580c' },
          { you: 'GPT specialist',         job: 'LLM / Foundation Model Eng', type: 'Brand name vs category name', colour: '#d97706' },
          { you: 'neural network scientist', job: 'AI Research Scientist',    type: 'Different words, same meaning', colour: '#9333ea' },
        ].map((ex, i) => (
          <div key={i} style={{ border: '1.5px solid #fca5a5', borderRadius: 10, padding: 14, background: '#fef2f2' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <div style={{ background: '#ef4444', color: 'white', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>You type</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>"{ex.you}"</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <div style={{ background: '#10b981', color: 'white', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>Job says</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>"{ex.job}"</div>
            </div>
            <div style={{ fontSize: 12, color: ex.colour, fontWeight: 700 }}>❌ {ex.type}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#1e1e2e', borderRadius: 12, padding: 22, color: '#cdd6f4', lineHeight: 2.2, fontSize: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#f38ba8', marginBottom: 14 }}>🔒 The Vocabulary Prison</div>
        In TF-IDF's world, every word is an isolated island with no connection to any other word.<br />
        <span style={{ color: '#f38ba8', fontWeight: 700 }}>"ML"</span> and <span style={{ color: '#89dceb', fontWeight: 700 }}>"machine learning"</span> have never met. They live in different dimensions.<br />
        <span style={{ color: '#f38ba8', fontWeight: 700 }}>"chatbot"</span> and <span style={{ color: '#89dceb', fontWeight: 700 }}>"conversational AI"</span> are complete strangers.<br />
        <span style={{ color: '#f38ba8', fontWeight: 700 }}>"GPT"</span> and <span style={{ color: '#89dceb', fontWeight: 700 }}>"large language model"</span> share no connection whatsoever.<br />
        <br />
        TF-IDF cannot understand <em>meaning</em>. Only exact character matches.
      </div>

      <Alert type="info" header="🚀 The Solution That Changed Everything: Semantic Search">
        The fix is elegant: instead of matching words, match <strong>meanings</strong>.
        <br /><br />
        In the next tutorial, you'll learn about <strong>word embeddings</strong> — a way to represent every word as a point in a high-dimensional mathematical space. In that space, "ML" and "machine learning" end up at nearly the same coordinates, because they appear in similar contexts in millions of documents.
        <br /><br />
        This is the foundation of how Google, Bing, ChatGPT's memory, and every RAG system you'll build in this course actually works.
      </Alert>
    </GameStep>
  )
}

// ─── Step 7: Certificate of Completion ───────────────────────────────────────
function Step7_Certificate({ onPrev, xp, badges, unlockBadge }) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100)
    setTimeout(() => unlockBadge('engineer'), 700)
  }, []) // eslint-disable-line

  const confetti = Array.from({ length: 36 }, (_, i) => ({
    left: `${(i * 2.8) % 100}%`,
    color: ['#667eea','#764ba2','#f093fb','#f59e0b','#10b981','#3b82f6','#ef4444','#06b6d4'][i % 8],
    delay: `${(i % 12) * 0.15}s`,
    duration: `${2.2 + (i % 4) * 0.4}s`,
    size: `${7 + (i % 4) * 3}px`,
    rotate: `${(i % 3) * 180}deg`,
  }))

  return (
    <div>
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-60px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(800px) rotate(540deg); opacity: 0; }
        }
        @keyframes badgePop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          65%  { transform: scale(1.25) rotate(4deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes heroScale {
          0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
          70%  { transform: scale(1.1) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes certGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(102,126,234,0.3); }
          50% { box-shadow: 0 0 0 20px rgba(102,126,234,0); }
        }
      `}</style>

      {/* Confetti */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: 0, zIndex: 9990, pointerEvents: 'none', overflow: 'visible' }}>
        {animate && confetti.map((c, i) => (
          <div key={i} style={{
            position: 'absolute', left: c.left, top: '-10px',
            width: c.size, height: c.size, background: c.color,
            borderRadius: i % 3 === 0 ? '50%' : '2px',
            animation: `confettiFall ${c.duration} ease-in ${c.delay} both`,
          }} />
        ))}
      </div>

      <Container>
        <SpaceBetween size="l">
          {/* Hero trophy */}
          <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
            <div style={{
              fontSize: 90, display: 'inline-block', marginBottom: 14,
              animation: animate ? 'heroScale 0.7s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
            }}>🏆</div>
            <div style={{ fontSize: 30, fontWeight: 900, background: 'linear-gradient(135deg,#667eea,#764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>
              You're a Search Engineer!
            </div>
            <div style={{ fontSize: 16, color: '#6b7280' }}>
              Tutorial complete — here is your official certificate
            </div>
          </div>

          {/* Certificate with gradient border */}
          <div style={{
            padding: 3,
            background: 'linear-gradient(135deg,#667eea,#764ba2,#f093fb)',
            borderRadius: 19,
            animation: animate ? 'certGlow 2s ease 1s 3' : 'none',
          }}>
            <div style={{ background: 'linear-gradient(135deg,#f5f3ff,#eff6ff)', borderRadius: 16, padding: 36, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 700, marginBottom: 14 }}>
                Certificate of Completion
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#3730a3', marginBottom: 12 }}>
                TF-IDF Search Engineer — Level 1
              </div>
              <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.9, marginBottom: 24, maxWidth: 520, margin: '0 auto 24px' }}>
                You built a complete TF-IDF search engine from scratch, calculated the math by hand,
                watched it rank 25 real AI job postings, discovered its fundamental limit,
                and understood exactly why the world needed something smarter.
              </div>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#667eea', marginBottom: 8 }}>
                ⚡ {xp} XP
              </div>
              <div style={{ fontSize: 13, color: '#8b5cf6', fontWeight: 600 }}>
                Signed by Mohamed Noordeen Alaudeen · AWS GenAI Innovation Center
              </div>
            </div>
          </div>

          {/* Badge parade */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 18 }}>
              Your Badges
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 22, flexWrap: 'wrap' }}>
              {BADGES.map((b, i) => (
                <div key={b.id} title={`${b.name} — ${b.desc}`}
                  style={{
                    textAlign: 'center',
                    animation: animate && badges.includes(b.id) ? `badgePop 0.55s cubic-bezier(0.34,1.56,0.64,1) ${0.1 + i * 0.12}s both` : 'none',
                    opacity: badges.includes(b.id) ? 1 : 0.15,
                    cursor: 'help',
                  }}>
                  <div style={{ fontSize: 44, marginBottom: 6 }}>{b.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: b.color, maxWidth: 72, margin: '0 auto' }}>{b.name}</div>
                  <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>+{b.xp} XP</div>
                </div>
              ))}
            </div>
          </div>

          {/* What's next */}
          <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius: 14, padding: 24, border: '2px solid #86efac' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#15803d', marginBottom: 10 }}>🚀 Next Tutorial</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#14532d', marginBottom: 8 }}>
              Word Embeddings: Teaching Machines to Understand Meaning
            </div>
            <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.85 }}>
              You've discovered TF-IDF's fatal flaw: it can't understand that "ML" and "machine learning" are the same thing.
              In the next tutorial, you'll learn how <strong>word embeddings</strong> solve this — by mapping every word into a
              mathematical space where similar concepts live close together. You'll literally watch "ML" and "machine learning"
              converge to the same coordinates.
            </div>
          </div>

          {/* Restart */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
            <Button onClick={onPrev}>← Previous</Button>
            <Button variant="primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              🔄 Restart Tutorial
            </Button>
          </div>
        </SpaceBetween>
      </Container>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function SearchEngineJobHuntComplete({ onStepChange }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [xp, setXP] = useState(0)
  const [badges, setBadges] = useState([])
  const [newBadge, setNewBadge] = useState(null)
  const [trapsCompleted, setTrapsCompleted] = useState([])
  const totalSteps = 8

  useEffect(() => {
    if (onStepChange) onStepChange(currentStep, totalSteps)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep, onStepChange])

  const unlockBadge = (id) => {
    const badge = BADGES.find(b => b.id === id)
    if (!badge) return
    setBadges(prev => {
      if (prev.includes(id)) return prev
      setXP(x => x + badge.xp)
      setNewBadge(badge)
      return [...prev, id]
    })
  }

  const handleTrapDone = (trapId) => {
    setTrapsCompleted(prev => prev.includes(trapId) ? prev : [...prev, trapId])
  }

  const next = () => setCurrentStep(p => Math.min(totalSteps - 1, p + 1))
  const prev = () => setCurrentStep(p => Math.max(0, p - 1))

  const shared = { onNext: next, onPrev: prev, xp, badges, unlockBadge, trapsCompleted, handleTrapDone }

  const steps = [
    <Step0_Mission     key={0} {...shared} />,
    <Step1_Database    key={1} {...shared} />,
    <Step2_NaiveSearch key={2} {...shared} />,
    <Step3_Mathematics key={3} {...shared} />,
    <Step4_LiveSearch  key={4} {...shared} />,
    <Step5_BreakIt     key={5} {...shared} />,
    <Step6_WhyItFails  key={6} {...shared} />,
    <Step7_Certificate key={7} {...shared} isLast />,
  ]

  return (
    <SpaceBetween size="l">
      {newBadge && <BadgeToast badge={newBadge} onDismiss={() => setNewBadge(null)} />}
      <XPBar xp={xp} badges={badges} />
      {steps[currentStep]}
    </SpaceBetween>
  )
}
