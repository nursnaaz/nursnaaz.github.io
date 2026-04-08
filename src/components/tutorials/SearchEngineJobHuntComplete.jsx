import { useState, useEffect, useRef } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Container from '@cloudscape-design/components/container'
import Box from '@cloudscape-design/components/box'
import Button from '@cloudscape-design/components/button'
import Alert from '@cloudscape-design/components/alert'
import Header from '@cloudscape-design/components/header'
import Input from '@cloudscape-design/components/input'
import ProgressBar from '@cloudscape-design/components/progress-bar'
import { InteractiveInput } from '../interactive/InterativeInput'

// ─────────────────────────────────────────────────────────────────────────────
// 25 AI/ML Job Postings
// KEY DESIGN: some jobs use abbreviations (ML, NLP, LLM, RAG, GPT)
//             others spell them out (machine learning, natural language processing)
//             This mismatch IS the lesson. Students discover it personally.
// ─────────────────────────────────────────────────────────────────────────────
const JOBS = [
  { id:'J01', flag:'🇬🇧', title:'Machine Learning Engineer',       company:'Google DeepMind',    loc:'London',        skills:['TensorFlow','Python','ML pipelines'],
    desc:'Design and deploy machine learning systems at scale. Deep expertise in TensorFlow and Python required. Build evaluation pipelines for large neural network models in production environments.' },
  { id:'J02', flag:'🇺🇸', title:'AI Engineer',                     company:'OpenAI',             loc:'San Francisco', skills:['Python','APIs','AI systems'],
    desc:'Build production artificial intelligence applications integrating our APIs. Strong Python programming skills needed. Focus on reliability and safety of AI systems at scale.' },
  { id:'J03', flag:'🇺🇸', title:'MLOps Engineer',                  company:'AWS',                loc:'Seattle',       skills:['Kubernetes','Docker','model serving'],
    desc:'Own the ML platform and model deployment infrastructure. Experience with Kubernetes, Docker and model serving required. Automate training pipelines and monitor machine learning model performance.' },
  { id:'J04', flag:'🇺🇸', title:'LLM Engineer',                    company:'Anthropic',          loc:'San Francisco', skills:['RLHF','fine-tuning','alignment'],
    desc:'Specialise in large language model fine-tuning and alignment research. Deep knowledge of RLHF and Constitutional AI needed. Make powerful language models safe, helpful and honest.' },
  { id:'J05', flag:'🇺🇸', title:'Data Scientist',                  company:'Netflix',            loc:'Los Angeles',   skills:['Python','SQL','A/B testing'],
    desc:'Analyse viewer behaviour to improve content recommendations. Python, SQL and statistical modelling skills required. Design A/B experiments and measure product decisions with data.' },
  { id:'J06', flag:'🇺🇸', title:'NLP Engineer',                    company:'Microsoft',          loc:'Redmond',       skills:['BERT','transformers','NLP'],
    desc:'Build natural language processing pipelines for Microsoft Copilot. BERT, transformers and text classification expertise needed. Work on named entity recognition and sentiment analysis systems.' },
  { id:'J07', flag:'🇺🇸', title:'Computer Vision Engineer',        company:'Tesla',              loc:'Austin',        skills:['PyTorch','CNN','object detection'],
    desc:'Develop image recognition and object detection systems for Autopilot. PyTorch and convolutional neural network experience required. Build real-time video processing for safety-critical vehicle applications.' },
  { id:'J08', flag:'🇺🇸', title:'AI Research Scientist',           company:'Meta AI',            loc:'New York',      skills:['deep learning','research','publications'],
    desc:'Conduct foundational deep learning research and publish at top AI conferences. Explore novel neural architectures, optimisation algorithms and scaling methods. Push the frontier of what AI can do.' },
  { id:'J09', flag:'🌍',  title:'Prompt Engineer',                 company:'Salesforce',         loc:'Remote',        skills:['ChatGPT','GPT-4','Claude'],
    desc:'Design and optimise prompts for generative AI products. Experience with ChatGPT, GPT-4 and Claude required. Build prompt templates and improve response quality and reliability of AI assistants.' },
  { id:'J10', flag:'🇺🇸', title:'GenAI Developer',                 company:'IBM',                loc:'New York',      skills:['RAG','vector databases','LLM'],
    desc:'Build generative AI applications using RAG pipelines and vector databases. LLM integration and orchestration experience needed. Create enterprise AI solutions with document understanding and retrieval.' },
  { id:'J11', flag:'🇸🇪', title:'ML Platform Engineer',            company:'Spotify',            loc:'Stockholm',     skills:['MLflow','feature store','Python'],
    desc:'Build internal ML infrastructure and feature store tooling. MLflow, ML pipelines and Python expertise needed. Enable teams to train, evaluate and ship machine learning models faster.' },
  { id:'J12', flag:'🇺🇸', title:'Conversational AI Engineer',      company:'Amazon Alexa',       loc:'Seattle',       skills:['dialogue systems','NLU','intent classification'],
    desc:'Design dialogue systems and voice assistant conversational experiences. Natural language understanding and intent classification experience needed. Build entity extraction for voice interactions at scale.' },
  { id:'J13', flag:'🇺🇸', title:'AI Product Manager',              company:'Apple',              loc:'Cupertino',     skills:['Siri','machine learning','product roadmap'],
    desc:'Define the roadmap for Siri and on-device machine learning features. Understanding of machine learning capabilities and limitations required. Ship AI experiences to hundreds of millions of Apple users.' },
  { id:'J14', flag:'🇺🇸', title:'Reinforcement Learning Engineer', company:'Boston Dynamics',    loc:'Boston',        skills:['RL','robotics','simulation'],
    desc:'Train robots using reinforcement learning and control theory. Simulation environments and reward shaping expertise required. Work on locomotion, manipulation and real-world robot deployment.' },
  { id:'J15', flag:'🇬🇧', title:'AI Safety Researcher',            company:'DeepMind',           loc:'London',        skills:['RLHF','interpretability','alignment'],
    desc:'Research alignment and interpretability of large AI systems. RLHF, red-teaming and mechanistic interpretability knowledge needed. Keep AI systems safe and predictable as they scale to new capabilities.' },
  { id:'J16', flag:'🇨🇦', title:'Foundation Model Engineer',       company:'Cohere',             loc:'Toronto',       skills:['transformer training','distributed GPU','fine-tuning'],
    desc:'Pre-train and fine-tune transformer foundation models for enterprise customers. Distributed training on GPU clusters and mixed-precision training required. Scale language models across cloud infrastructure.' },
  { id:'J17', flag:'🇺🇸', title:'Knowledge Graph Engineer',        company:'LinkedIn',           loc:'Sunnyvale',     skills:['graph neural networks','ontology','structured data'],
    desc:'Build knowledge graphs powering professional network intelligence. Graph neural networks and ontology design experience needed. Connect profiles, companies and skills using structured knowledge representations.' },
  { id:'J18', flag:'🇸🇬', title:'Recommendation Systems Engineer', company:'TikTok',             loc:'Singapore',     skills:['collaborative filtering','deep learning ranking','real-time serving'],
    desc:'Build the recommendation engine powering the For You feed. Collaborative filtering, deep learning ranking and real-time serving expertise needed. Personalise content for over one billion daily users.' },
  { id:'J19', flag:'🇺🇸', title:'AI Infrastructure Engineer',      company:'Nvidia',             loc:'Santa Clara',   skills:['CUDA','GPU clusters','distributed computing'],
    desc:'Build GPU cluster infrastructure for large-scale AI training workloads. CUDA programming, distributed computing and HPC systems knowledge needed. Optimise cluster utilisation for deep learning at scale.' },
  { id:'J20', flag:'🇺🇸', title:'Speech Recognition Engineer',     company:'Rev.ai',             loc:'San Francisco', skills:['ASR','wav2vec','audio processing'],
    desc:'Build automatic speech recognition systems for transcription products. Audio signal processing and wav2vec model expertise required. Improve accuracy across accents, background noise and multiple languages.' },
  { id:'J21', flag:'🇬🇧', title:'Financial ML Engineer',           company:'Bloomberg',          loc:'London',        skills:['time series','anomaly detection','quantitative modelling'],
    desc:'Build machine learning models for financial data and market signal analysis. Time series forecasting, anomaly detection and quantitative modelling skills needed. Apply ML to trading and risk management.' },
  { id:'J22', flag:'🇬🇧', title:'Healthcare AI Engineer',          company:'DeepMind Health',    loc:'London',        skills:['medical imaging','clinical NLP','computer vision'],
    desc:'Apply deep learning to medical imaging and clinical text analysis. Computer vision for radiology and clinical NLP for patient records experience needed. Build AI diagnostic systems for clinicians and hospitals.' },
  { id:'J23', flag:'🇺🇸', title:'Autonomous Systems ML Engineer',  company:'Waymo',              loc:'Mountain View', skills:['lidar','sensor fusion','3D object detection'],
    desc:'Build machine learning systems for self-driving vehicle perception and decision making. Sensor fusion, lidar processing and 3D object detection expertise required. Train models for real-time autonomous safety decisions.' },
  { id:'J24', flag:'🌍',  title:'AI Ethics Researcher',            company:'Mozilla Foundation', loc:'Remote',        skills:['bias detection','model auditing','responsible AI'],
    desc:'Research fairness, accountability and transparency in AI systems. Bias detection, model auditing and responsible AI policy experience needed. Advocate for ethical AI systems that work equitably for everyone.' },
  { id:'J25', flag:'🌍',  title:'RAG Systems Engineer',            company:'Pinecone',           loc:'Remote',        skills:['RAG','embeddings','semantic search'],
    desc:'Build RAG (retrieval augmented generation) systems and vector database infrastructure. Embedding models, semantic search and LLM orchestration expertise needed. Help enterprises find answers inside their own documents using AI.' },
]

// ─── Badges ───────────────────────────────────────────────────────────────────
const BADGES = [
  { id:'hired',     icon:'👔', name:'Job Seeker',     desc:'You started the job hunt!',            xp:10,  color:'#10b981' },
  { id:'explorer',  icon:'🗺️', name:'Data Explorer',  desc:'You reviewed all 25 job postings!',    xp:15,  color:'#3b82f6' },
  { id:'lightbulb', icon:'💡', name:'Got It!',         desc:'You saw how word matching works!',     xp:20,  color:'#8b5cf6' },
  { id:'maths',     icon:'🧮', name:'Math Wizard',     desc:'You calculated TF-IDF by hand!',      xp:40,  color:'#f59e0b' },
  { id:'expert',    icon:'🎯', name:'Search Expert',   desc:'You completed 5 live searches!',      xp:30,  color:'#06b6d4' },
  { id:'bughunter', icon:'🐛', name:'Bug Hunter',      desc:"You found the fatal flaw!",           xp:40,  color:'#ef4444' },
  { id:'engineer',  icon:'🏆', name:'Search Engineer', desc:'Tutorial complete!',                  xp:60,  color:'#f97316' },
]
const MAX_XP = BADGES.reduce((s,b) => s+b.xp, 0)

// ─── TF-IDF engine (runs 100% in-browser, no backend) ────────────────────────
const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','is','it',
  'with','you','we','our','your','are','be','by','from','as','this','that',
  'have','has','will','can','all','into','more','their','its','using','used',
  'needed','required','experience','expertise','skills','knowledge','across',
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

// Returns sorted results with per-term breakdown for transparency
function computeScores(query) {
  const queryTerms = preprocess(query)
  if (!queryTerms.length) return JOBS.map(j => ({ ...j, score:0, queryTerms:[], breakdown:[] }))
  const allDocTerms = JOBS.map(j => preprocess(`${j.title} ${j.desc}`))
  return JOBS.map((job, i) => {
    const docTerms = allDocTerms[i]
    const uniqueQueryTerms = [...new Set(queryTerms)]
    const breakdown = uniqueQueryTerms.map(t => {
      const tfVal = tf(t, docTerms)
      const idfVal = idf(t, allDocTerms)
      const docsWithTerm = allDocTerms.filter(d => d.includes(t)).length
      return { term:t, tf:tfVal, idf:idfVal, score:tfVal*idfVal, docsWithTerm, foundInThisJob: tfVal > 0 }
    })
    const score = breakdown.reduce((s,b) => s+b.score, 0)
    return { ...job, score, queryTerms, breakdown }
  }).sort((a,b) => b.score-a.score)
}

// ─── Highlight matched words in text ─────────────────────────────────────────
function Highlighted({ text, terms }) {
  if (!terms || terms.length === 0) return <>{text}</>
  const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'))
  return <>
    {parts.map((part, i) =>
      i % 2 === 1
        ? <mark key={i} style={{ background:'#fef08a', borderRadius:3, padding:'1px 3px', fontWeight:700 }}>{part}</mark>
        : <span key={i}>{part}</span>
    )}
  </>
}

// ─── Badge toast (bottom-right pop-in) ────────────────────────────────────────
function BadgeToast({ badge, onDismiss }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 60)
    const t2 = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 400) }, 3800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDismiss])
  return (
    <div style={{
      position:'fixed', bottom:28, right:28, zIndex:9999,
      background:'#fff', borderRadius:14, padding:'18px 22px',
      boxShadow:'0 12px 40px rgba(0,0,0,0.18)', border:`3px solid ${badge.color}`,
      minWidth:280,
      transition:'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.9)',
    }}>
      <div style={{ display:'flex', gap:14, alignItems:'center' }}>
        <div style={{ fontSize:48 }}>{badge.icon}</div>
        <div>
          <div style={{ fontSize:10, color:'#9ca3af', textTransform:'uppercase', letterSpacing:1.5, fontWeight:700 }}>🔓 Badge Unlocked!</div>
          <div style={{ fontSize:17, fontWeight:800, color:badge.color }}>{badge.name}</div>
          <div style={{ fontSize:13, color:'#6b7280' }}>{badge.desc}</div>
          <div style={{ fontSize:12, fontWeight:700, color:badge.color, marginTop:4 }}>+{badge.xp} XP ⚡</div>
        </div>
      </div>
    </div>
  )
}

// ─── XP bar + badge shelf ─────────────────────────────────────────────────────
function XPBar({ xp, unlockedBadges }) {
  const pct = Math.min((xp / MAX_XP) * 100, 100)
  return (
    <Container>
      <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:200 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontWeight:800, color:'#667eea', fontSize:16 }}>⚡ {xp} XP</span>
            <span style={{ color:'#9ca3af', fontSize:13 }}>Max: {MAX_XP} XP</span>
          </div>
          <div style={{ background:'#e2e8f0', borderRadius:8, height:14, overflow:'hidden' }}>
            <div style={{ width:`${pct}%`, height:'100%', background:'linear-gradient(90deg,#667eea,#764ba2)', borderRadius:8, transition:'width 0.7s ease' }} />
          </div>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          {BADGES.map(b => (
            <div key={b.id}
              title={unlockedBadges.includes(b.id) ? `${b.name}: ${b.desc}` : 'Not yet unlocked'}
              style={{ fontSize:28, opacity:unlockedBadges.includes(b.id) ? 1 : 0.18, transition:'all 0.4s', cursor:'help', transform:unlockedBadges.includes(b.id)?'scale(1.15)':'scale(1)' }}>
              {b.icon}
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}

// ─── Step wrapper ─────────────────────────────────────────────────────────────
function Step({ title, emoji, children, onNext, onPrev, canNext=true, isFirst=false, isLast=false, lockMsg='Complete the task above to continue →' }) {
  return (
    <Container
      header={
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:46, height:46, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#667eea,#764ba2)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>
            {emoji}
          </div>
          <Header variant="h2">{title}</Header>
        </div>
      }
    >
      <SpaceBetween size="l">
        {children}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:16, borderTop:'1px solid #e2e8f0', flexWrap:'wrap', gap:10 }}>
          <Button disabled={isFirst} onClick={onPrev}>← Previous</Button>
          {!isLast && (
            <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
              {!canNext && <span style={{ fontSize:13, color:'#d97706', fontWeight:600 }}>⏳ {lockMsg}</span>}
              <Button variant="primary" disabled={!canNext} onClick={onNext}>Next Step →</Button>
            </div>
          )}
        </div>
      </SpaceBetween>
    </Container>
  )
}

// ─── Callout boxes ────────────────────────────────────────────────────────────
function Note({ icon='💡', title, bg='#eff6ff', border='#bfdbfe', children }) {
  return (
    <div style={{ background:bg, border:`1.5px solid ${border}`, borderRadius:10, padding:16 }}>
      <div style={{ fontWeight:700, marginBottom:6 }}>{icon} {title}</div>
      <div style={{ fontSize:14, lineHeight:1.8, color:'#374151' }}>{children}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 0 — Welcome: You're job hunting
// ─────────────────────────────────────────────────────────────────────────────
function Step0_Welcome({ onNext, unlock }) {
  const [accepted, setAccepted] = useState(false)

  const accept = () => {
    setAccepted(true)
    unlock('hired')
    setTimeout(onNext, 2000)
  }

  return (
    <Step title="You Just Finished a GenAI Course. Now What?" emoji="🎓" onNext={onNext} isFirst canNext={false}>
      <div style={{ background:'linear-gradient(135deg,#f5f3ff,#eff6ff)', borderRadius:14, padding:28, border:'1.5px solid #c4b5fd' }}>
        <div style={{ fontSize:24, fontWeight:900, color:'#3730a3', marginBottom:16, lineHeight:1.4 }}>
          Congratulations — you've completed a GenAI course.<br/>
          Now you need a job. 🎯
        </div>
        <div style={{ fontSize:15, lineHeight:2, color:'#374151', marginBottom:20 }}>
          Good news: <strong>25 top AI companies are hiring right now.</strong><br/>
          Companies like Google DeepMind, OpenAI, Tesla, Anthropic, and Meta AI — all actively looking for someone like you.<br/><br/>
          There's a job board. It has a search engine. All you need to do is search for your dream role.<br/><br/>
          <strong>Simple, right?</strong><br/><br/>
          In this tutorial, you'll discover that it's not simple at all — and by the end, you'll understand <em>exactly</em> why Google had to invent something far smarter.
        </div>

        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
          {['🇬🇧 Google DeepMind','🇺🇸 OpenAI','🇺🇸 Tesla','🇺🇸 Anthropic','🇺🇸 Meta AI','🇨🇦 Cohere','🇸🇬 TikTok','🇺🇸 AWS','🇬🇧 DeepMind Health','+ 16 more'].map(c => (
            <div key={c} style={{ background:'white', borderRadius:8, padding:'6px 12px', fontSize:13, fontWeight:600, boxShadow:'0 2px 8px rgba(0,0,0,0.07)', border:'1px solid #e2e8f0' }}>{c}</div>
          ))}
        </div>

        {!accepted ? (
          <Button variant="primary" onClick={accept}>
            Let's find my dream job →
          </Button>
        ) : (
          <Alert type="success" header="👔 Job Seeker badge earned! +10 XP">
            Welcome! Loading the job board in 2 seconds...
          </Alert>
        )}
      </div>

      <Note icon="📚" title="What you'll learn" bg="#f0fdf4" border="#86efac">
        You'll use a real search engine (TF-IDF — the algorithm that powered early Google) on 25 actual AI job postings.
        You'll see it work perfectly. Then you'll watch it completely fail on searches you'd naturally make.
        And you'll understand <strong>exactly</strong> why — which is the foundation of everything in modern AI search.
      </Note>
    </Step>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Browse 25 jobs
// ─────────────────────────────────────────────────────────────────────────────
function Step1_Browse({ onNext, onPrev, unlock, unlockedBadges }) {
  const [ready, setReady] = useState(false)

  const handleReady = () => {
    setReady(true)
    if (!unlockedBadges.includes('explorer')) unlock('explorer')
    setTimeout(onNext, 1400)
  }

  return (
    <Step title="The Job Board — 25 AI Companies Hiring Now" emoji="🗺️" onNext={onNext} onPrev={onPrev} canNext={false}>
      <Note icon="👀" title="Your task before continuing" bg="#fefce8" border="#fde047">
        Scroll through all 25 jobs. <strong>Notice one thing:</strong> different companies use completely different words to describe similar roles.
        For example — does everyone say "machine learning"? Or do some say "ML"? Does anyone say "chatbot"?
        This observation is the entire point of this tutorial.
      </Note>

      <div style={{ maxHeight:460, overflowY:'auto', padding:'2px 4px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:10 }}>
          {JOBS.map(job => (
            <div key={job.id}
              style={{ background:'white', border:'1.5px solid #e2e8f0', borderRadius:10, padding:'14px 16px', cursor:'default', transition:'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#667eea'; e.currentTarget.style.boxShadow='0 4px 16px rgba(102,126,234,0.14)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.boxShadow='none' }}
            >
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <div style={{ fontSize:13, fontWeight:700, flex:1 }}>{job.flag} {job.title}</div>
                <div style={{ fontSize:10, color:'#c4b5fd', fontWeight:700 }}>{job.id}</div>
              </div>
              <div style={{ fontSize:12, color:'#7c3aed', fontWeight:600, marginBottom:4 }}>{job.company}</div>
              <div style={{ fontSize:11, color:'#9ca3af', marginBottom:8 }}>📍 {job.loc}</div>
              <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                {job.skills.map(s => (
                  <span key={s} style={{ fontSize:10, background:'#f3f4f6', color:'#374151', borderRadius:4, padding:'2px 7px', fontWeight:600 }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Note icon="🔍" title="Spotted the differences?" bg="#fef2f2" border="#fca5a5">
        <strong>J01 Google DeepMind</strong> says "machine learning" (full words).<br/>
        <strong>J03 AWS</strong> says "ML platform" (abbreviation).<br/>
        <strong>J12 Amazon Alexa</strong> says "dialogue systems" — nobody says "chatbot".<br/>
        <strong>J04 Anthropic</strong> says "LLM" but <strong>J16 Cohere</strong> says "foundation models".<br/><br/>
        Same types of jobs. Completely different vocabulary. <strong>This is about to become your problem.</strong>
      </Note>

      {!ready ? (
        <div style={{ textAlign:'center' }}>
          <Button variant="primary" onClick={handleReady}>
            I've reviewed all 25 jobs — I'm ready →
          </Button>
        </div>
      ) : (
        <Alert type="success" header="🗺️ Data Explorer badge earned! +15 XP">
          You've seen the data. Now let's understand how the search engine actually works.
        </Alert>
      )}
    </Step>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — How the search engine works (visual word matching)
// ─────────────────────────────────────────────────────────────────────────────
function Step2_HowItWorks({ onNext, onPrev, unlock, unlockedBadges }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [matchedTerms, setMatchedTerms] = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  const [triedShort, setTriedShort] = useState(false)

  const run = (q) => {
    const sq = (typeof q === 'string' ? q : query).trim()
    if (!sq) return
    const scored = computeScores(sq)
    const terms = [...new Set(preprocess(sq))]
    setResults(scored)
    setMatchedTerms(terms)
    setHasSearched(true)
    if (sq.toLowerCase().includes('ml') || sq.toLowerCase().split(' ').some(w => w.length <= 3)) {
      setTriedShort(true)
    }
  }

  const canNext = hasSearched && triedShort
  if (canNext && !unlockedBadges.includes('lightbulb')) unlock('lightbulb')

  const topResults = results ? results.filter(r => r.score > 0).slice(0,5) : []
  const zeroResults = results ? results.filter(r => r.score === 0) : []

  return (
    <Step title="How the Search Engine Finds Jobs" emoji="🔍" onNext={onNext} onPrev={onPrev} canNext={canNext}
      lockMsg='Try one more search with a short word or abbreviation (like "ML" or "AI")'>

      {/* The analogy — what the engine actually does */}
      <div style={{ background:'#1e1e2e', borderRadius:12, padding:20, color:'#cdd6f4' }}>
        <div style={{ fontSize:14, fontWeight:700, color:'#89b4fa', marginBottom:14 }}>
          🤔 What does "search" actually mean here?
        </div>
        <div style={{ fontSize:14, lineHeight:2.2 }}>
          When you type <span style={{ color:'#a6e3a1', fontWeight:700 }}>"machine learning"</span>, the engine does exactly one thing:<br/>
          <br/>
          It looks at the title and description of every job.<br/>
          It checks: <span style={{ color:'#ffd700' }}>does the word "machine" appear here?</span> Does <span style={{ color:'#ffd700' }}>"learning"</span> appear here?<br/>
          <br/>
          Jobs where these words appear → get a score. Jobs where they don't → score of <span style={{ color:'#f38ba8', fontWeight:700 }}>0.0000</span>.<br/>
          <br/>
          That's it. <span style={{ color:'#a6e3a1' }}>No understanding of meaning. Just: does this exact word exist in this text?</span>
        </div>
      </div>

      {/* Live demo */}
      <Note icon="🎮" title="Try it — watch the words get highlighted" bg="#f0fdf4" border="#86efac">
        Type any job skill and hit Search. The yellow highlights show you EXACTLY what the engine matched.
        Notice the scores — higher = better match. After that, try a short word or abbreviation like <strong>"ML"</strong> or <strong>"AI"</strong> or <strong>"NLP"</strong>.
      </Note>

      <div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
          {['"machine learning"','"Python deep learning"','"ML"','"NLP"','"AI researcher"'].map(s => (
            <button key={s} onClick={() => { setQuery(s.replace(/"/g,'')); run(s.replace(/"/g,'')) }}
              style={{ fontSize:12, background:s.includes('"ML"')||s.includes('"NLP"')||s.includes('"AI"') ? '#fef2f2':'#eff6ff', color:s.includes('"ML"')||s.includes('"NLP"')||s.includes('"AI"') ? '#dc2626':'#2563eb', borderRadius:6, padding:'5px 11px', border:'1px solid', borderColor:s.includes('"ML"')||s.includes('"NLP"')||s.includes('"AI"') ? '#fca5a5':'#bfdbfe', fontWeight:600, cursor:'pointer' }}>
              {s}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <div style={{ flex:1 }} onKeyDown={e => e.key==='Enter' && run()}>
            <Input value={query} onChange={({detail}) => setQuery(detail.value)} placeholder='Type a skill — e.g. "Python" or "ML" or "RLHF"' />
          </div>
          <Button variant="primary" onClick={() => run()}>Search</Button>
        </div>
      </div>

      {results && (
        <SpaceBetween size="m">
          {/* Stats */}
          <div style={{ display:'flex', gap:20 }}>
            <span style={{ fontSize:14, color:'#059669', fontWeight:700 }}>✅ {topResults.length} jobs matched</span>
            <span style={{ fontSize:14, color:'#dc2626', fontWeight:700 }}>❌ {zeroResults.length} jobs scored 0.0000</span>
          </div>

          {/* Results with word highlights */}
          {topResults.length > 0 ? (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {topResults.map((job,i) => (
                <div key={job.id} style={{ border:'1.5px solid #86efac', borderRadius:10, padding:14, background:'#f0fdf4' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8, flexWrap:'wrap', gap:8 }}>
                    <div>
                      <span style={{ fontSize:11, fontWeight:800, color:'#667eea', marginRight:8 }}>#{i+1}</span>
                      <strong>{job.flag} {job.title}</strong>
                      <span style={{ fontSize:13, color:'#6b7280' }}> · {job.company}</span>
                    </div>
                    {/* BIG VISIBLE SCORE */}
                    <div style={{ background:'#667eea', color:'white', borderRadius:8, padding:'4px 14px', fontWeight:900, fontFamily:'monospace', fontSize:15 }}>
                      Score: {job.score.toFixed(4)}
                    </div>
                  </div>
                  <div style={{ fontSize:13, lineHeight:1.7, color:'#374151' }}>
                    <Highlighted text={job.desc} terms={matchedTerms} />
                  </div>
                  <div style={{ fontSize:11, color:'#6b7280', marginTop:8 }}>
                    📍 {job.loc}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert type="error" header="0 matches — none of your words appear in any job">
              The search engine found exactly nothing. Not because the jobs don't exist — but because <strong>the exact words you typed don't appear in any description.</strong>
            </Alert>
          )}

          {/* Insight after searching with short term */}
          {triedShort && (
            <Note icon="🤔" title="Notice something interesting?" bg="#fefce8" border="#fde047">
              When you search <strong>"ML"</strong>, you get fewer results than <strong>"machine learning"</strong> — even though they mean the same thing.
              That's not a bug. That's the engine working exactly as designed. It's finding the exact characters <em>M-L</em> — and it has no idea that "ML" and "machine learning" are the same concept.
              <br/><br/>
              <strong>This is the first hint of the big problem you're about to discover.</strong>
            </Note>
          )}
        </SpaceBetween>
      )}
    </Step>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — TF × IDF math (by hand, with real analogy)
// ─────────────────────────────────────────────────────────────────────────────
function Step3_Math({ onNext, onPrev, unlock, unlockedBadges }) {
  const [tfDone, setTfDone] = useState(false)
  const [idfDone, setIdfDone] = useState(false)
  const canNext = tfDone && idfDone
  if (canNext && !unlockedBadges.includes('maths')) unlock('maths')

  return (
    <Step title="Why Do Some Jobs Score Higher Than Others?" emoji="🧮" onNext={onNext} onPrev={onPrev} canNext={canNext}
      lockMsg="Complete both calculations above to continue">

      <Note icon="🎯" title="The question" bg="#eff6ff" border="#bfdbfe">
        When you searched "machine learning", Job #1 scored 0.28 and Job #7 scored 0.04. Why? They both contain the words "machine" and "learning". Why doesn't everyone score the same?
        <br/><br/>
        Answer: the engine uses a formula called <strong>TF-IDF</strong>. It considers two things: how <em>focused</em> a job is on your word, and how <em>rare</em> your word is across all jobs. Let's calculate this by hand.
      </Note>

      {/* TF */}
      <div style={{ border:'2px solid #3b82f6', borderRadius:12, padding:22, background:'#eff6ff' }}>
        <div style={{ fontSize:17, fontWeight:800, color:'#1d4ed8', marginBottom:16 }}>
          Part 1 — TF (Term Frequency): How focused is this job on your keyword?
        </div>

        <Note icon="🏋️" title="The analogy" bg="white" border="#93c5fd">
          Imagine two athletes. Athlete A mentions "swimming" 5 times in a 10-word interview. Athlete B mentions "swimming" once in a 50-word interview.
          Who is more focused on swimming? Athlete A — because swimming takes up 50% of what they said vs 2%.
          <br/><br/>
          TF works the same way. <strong>TF = (times the word appears) ÷ (total words in the document)</strong>
        </Note>

        <div style={{ background:'#dbeafe', borderRadius:8, padding:16, margin:'16px 0', fontSize:14, lineHeight:1.9 }}>
          <strong>Your calculation:</strong><br/>
          Job description (simplified): <em>"best machine learning engineer joins our team today"</em><br/>
          After removing stop words: <strong>[best, machine, learning, engineer, joins, team, today]</strong> → <strong>7 terms</strong><br/>
          The word <strong>"machine"</strong> appears <strong>1 time</strong>.<br/>
          <strong>TF("machine") = 1 ÷ 7 = ?</strong>
        </div>

        <InteractiveInput
          label='Calculate TF("machine") — type a decimal (e.g. 0.143)'
          correctAnswer={0.143}
          tolerance={0.01}
          placeholder="Your answer..."
          hint="Divide 1 by 7. Use a calculator if needed. Round to 3 decimal places."
        />
        {!tfDone && <div style={{ marginTop:10 }}><Button variant="link" onClick={() => setTfDone(true)}>I understand this — mark as done ✓</Button></div>}
        {tfDone && <Alert type="success">✅ Correct! TF = 1 ÷ 7 ≈ 0.143. A higher TF means a job description is more "devoted" to your keyword.</Alert>}
      </div>

      {/* IDF */}
      <div style={{ border:'2px solid #8b5cf6', borderRadius:12, padding:22, background:'#f5f3ff' }}>
        <div style={{ fontSize:17, fontWeight:800, color:'#6d28d9', marginBottom:16 }}>
          Part 2 — IDF (Inverse Document Frequency): How rare and special is your keyword?
        </div>

        <Note icon="🙋" title="The analogy" bg="white" border="#c4b5fd">
          Imagine 25 people in a room. You ask: "Raise your hand if your job description contains the word <strong>'and'</strong>."
          All 25 hands go up. Not useful — 'and' tells you nothing specific.
          <br/><br/>
          Now ask: "Raise your hand if your job description contains the word <strong>'RLHF'</strong>." Only 2 hands go up.
          Now THAT is useful! A job that mentions RLHF is very specifically about AI alignment.
          <br/><br/>
          <strong>IDF rewards rare words. It penalises common words.</strong><br/>
          Formula: <strong>IDF = ln(total documents ÷ documents containing the word)</strong><br/>
          Common word like "and" → ln(25/25) = ln(1) = 0 → contributes nothing<br/>
          Rare word like "RLHF" → ln(25/2) = 2.53 → contributes a lot
        </Note>

        <div style={{ background:'#ede9fe', borderRadius:8, padding:16, margin:'16px 0', fontSize:14, lineHeight:1.9 }}>
          <strong>Your calculation:</strong><br/>
          We have <strong>25 job postings</strong> total.<br/>
          The word <strong>"machine"</strong> appears in exactly <strong>4 jobs</strong> (Google, Apple, Bloomberg, Waymo).<br/>
          <strong>IDF("machine") = ln(25 ÷ 4) = ln(6.25) = ?</strong>
        </div>

        <InteractiveInput
          label='Calculate IDF("machine") — type a decimal (e.g. 1.833)'
          correctAnswer={1.833}
          tolerance={0.05}
          placeholder="Your answer..."
          hint="ln(6.25). In Python: import math; math.log(6.25). On calculator: press ln then 6.25. Answer ≈ 1.833"
        />
        {!idfDone && <div style={{ marginTop:10 }}><Button variant="link" onClick={() => setIdfDone(true)}>I understand this — mark as done ✓</Button></div>}
        {idfDone && <Alert type="success">✅ IDF = ln(25/4) ≈ 1.833. Rare words get high IDF. Words in every job get IDF near 0.</Alert>}
      </div>

      {/* Final formula */}
      {canNext && (
        <div style={{ background:'linear-gradient(135deg,#fef9c3,#fef08a)', border:'2px solid #f59e0b', borderRadius:12, padding:24, textAlign:'center' }}>
          <div style={{ fontSize:40, marginBottom:10 }}>🧮</div>
          <div style={{ fontSize:18, fontWeight:800, marginBottom:12 }}>You've got it! 🎉</div>
          <div style={{ fontSize:22, fontWeight:900, fontFamily:'monospace', color:'#92400e', marginBottom:14 }}>
            TF-IDF = TF × IDF = 0.143 × 1.833 ≈ 0.262
          </div>
          <div style={{ fontSize:14, color:'#374151', lineHeight:1.9 }}>
            This score means: <em>"the word 'machine' appears meaningfully in this specific job AND is moderately rare across all 25 jobs."</em><br/>
            That combination = high confidence this job is relevant to your search.
          </div>
        </div>
      )}
    </Step>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Live TF-IDF engine with score breakdown
// ─────────────────────────────────────────────────────────────────────────────
function Step4_LiveEngine({ onNext, onPrev, unlock, unlockedBadges }) {
  const searchCount = useRef(0)
  const [count, setCount] = useState(0)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [matchedTerms, setMatchedTerms] = useState([])

  const run = (q) => {
    const sq = (typeof q === 'string' ? q : query).trim()
    if (!sq) return
    const scored = computeScores(sq)
    setResults(scored)
    setMatchedTerms([...new Set(preprocess(sq))])
    searchCount.current += 1
    const n = searchCount.current
    setCount(n)
    if (n === 1 && !unlockedBadges.includes('searcher')) unlock('searcher')
    if (n >= 5 && !unlockedBadges.includes('expert')) unlock('expert')
  }

  const canNext = count >= 5
  const top5 = results ? results.slice(0,5) : []
  const maxScore = Math.max(...top5.map(r => r.score), 0.0001)

  const SUGGESTIONS = ['"machine learning engineer"','"Python AI"','"deep learning research"','"RAG vector database"','"RLHF alignment"','"computer vision PyTorch"']

  return (
    <Step title="Your Live Search Engine — Real TF-IDF on 25 Jobs" emoji="🎯" onNext={onNext} onPrev={onPrev}
      canNext={canNext} lockMsg={`Do ${Math.max(0,5-count)} more search${5-count!==1?'es':''} to unlock next step`}>

      <Note icon="⚡" title="This runs real TF-IDF — entirely in your browser" bg="#f0fdf4" border="#86efac">
        Every score you see is calculated using the formula you just learned: TF × IDF for each query word across all 25 jobs.
        No black box. The breakdown table shows you exactly WHY each job scored what it scored.
      </Note>

      <div>
        <div style={{ fontSize:13, fontWeight:700, marginBottom:8, color:'#374151' }}>Suggested searches:</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => { setQuery(s.replace(/"/g,'')); run(s.replace(/"/g,'')) }}
              style={{ fontSize:12, background:'#eff6ff', color:'#2563eb', borderRadius:6, padding:'5px 11px', border:'1px solid #bfdbfe', fontWeight:600, cursor:'pointer' }}>
              {s}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <div style={{ flex:1 }} onKeyDown={e => e.key==='Enter' && run()}>
            <Input value={query} onChange={({detail}) => setQuery(detail.value)} placeholder='Search for any AI skill or role...' />
          </div>
          <Button variant="primary" onClick={() => run()}>Search</Button>
        </div>
      </div>

      {results && (
        <SpaceBetween size="l">
          {/* Animated ranking bars */}
          <div style={{ background:'#f8fafc', borderRadius:10, padding:16, border:'1px solid #e2e8f0' }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:1.5, marginBottom:16 }}>
              TF-IDF Rankings — Top 5 of 25 Jobs
            </div>
            {top5.map((job,i) => (
              <div key={job.id} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5, flexWrap:'wrap', gap:6 }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>
                    <span style={{ fontSize:11, color:'#667eea', fontWeight:800, marginRight:8 }}>#{i+1}</span>
                    {job.flag} {job.title}
                    <span style={{ color:'#9ca3af', fontWeight:400 }}> · {job.company}</span>
                  </span>
                  {/* BIG score — impossible to miss */}
                  <span style={{
                    fontSize:15, fontWeight:900, fontFamily:'monospace',
                    background: job.score > 0.05 ? '#dcfce7' : job.score > 0.01 ? '#dbeafe' : job.score > 0 ? '#fef9c3' : '#fef2f2',
                    color: job.score > 0.05 ? '#15803d' : job.score > 0.01 ? '#1d4ed8' : job.score > 0 ? '#92400e' : '#dc2626',
                    borderRadius:6, padding:'3px 10px', border:'1.5px solid',
                    borderColor: job.score > 0.05 ? '#86efac' : job.score > 0.01 ? '#93c5fd' : job.score > 0 ? '#fde047' : '#fca5a5',
                  }}>
                    {job.score === 0 ? '0.0000 ❌' : job.score.toFixed(4)}
                  </span>
                </div>
                <div style={{ background:'#e2e8f0', borderRadius:6, height:12, overflow:'hidden' }}>
                  <div style={{
                    width:`${(job.score/maxScore)*100}%`, height:'100%', borderRadius:6,
                    transition:'width 0.8s cubic-bezier(0.22,1,0.36,1)',
                    background: job.score > 0.05 ? 'linear-gradient(90deg,#10b981,#059669)'
                              : job.score > 0.01 ? 'linear-gradient(90deg,#60a5fa,#3b82f6)'
                              : job.score > 0  ? 'linear-gradient(90deg,#fcd34d,#f59e0b)'
                              : '#e2e8f0',
                  }}/>
                </div>
              </div>
            ))}
          </div>

          {/* Score breakdown for #1 result */}
          {results[0]?.score > 0 && results[0].breakdown.length > 0 && (
            <div style={{ border:'2px solid #667eea', borderRadius:12, padding:20, background:'#f5f3ff' }}>
              <div style={{ fontSize:14, fontWeight:800, color:'#4c1d95', marginBottom:14 }}>
                🔬 Why did <strong>{results[0].title}</strong> score highest?
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead>
                    <tr style={{ background:'#ede9fe' }}>
                      <th style={{ padding:'8px 12px', textAlign:'left', fontWeight:700 }}>Your word</th>
                      <th style={{ padding:'8px 12px', textAlign:'center', fontWeight:700 }}>Found in this job?</th>
                      <th style={{ padding:'8px 12px', textAlign:'center', fontWeight:700 }}>TF (focus)</th>
                      <th style={{ padding:'8px 12px', textAlign:'center', fontWeight:700 }}>IDF (rarity)</th>
                      <th style={{ padding:'8px 12px', textAlign:'right', fontWeight:700 }}>TF × IDF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results[0].breakdown.map((b,i) => (
                      <tr key={i} style={{ background: i%2===0 ? 'white' : '#f9f7ff', borderTop:'1px solid #e8e4f9' }}>
                        <td style={{ padding:'8px 12px', fontWeight:700, fontFamily:'monospace', color:'#7c3aed' }}>"{b.term}"</td>
                        <td style={{ padding:'8px 12px', textAlign:'center' }}>
                          {b.foundInThisJob ? '✅ yes' : '❌ no'}
                        </td>
                        <td style={{ padding:'8px 12px', textAlign:'center', fontFamily:'monospace' }}>
                          {b.tf.toFixed(4)}
                          <div style={{ fontSize:10, color:'#9ca3af' }}>{b.docsWithTerm} of 25 jobs</div>
                        </td>
                        <td style={{ padding:'8px 12px', textAlign:'center', fontFamily:'monospace' }}>
                          {b.idf.toFixed(4)}
                        </td>
                        <td style={{ padding:'8px 12px', textAlign:'right', fontFamily:'monospace', fontWeight:800, color: b.score > 0 ? '#059669' : '#dc2626' }}>
                          {b.score.toFixed(4)}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background:'#667eea', color:'white' }}>
                      <td colSpan={4} style={{ padding:'8px 12px', fontWeight:700 }}>Total TF-IDF Score</td>
                      <td style={{ padding:'8px 12px', textAlign:'right', fontWeight:900, fontFamily:'monospace', fontSize:15 }}>
                        {results[0].score.toFixed(4)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop:14, fontSize:13, color:'#374151', lineHeight:1.8 }}>
                <div style={{ marginBottom:6 }}><strong>TF</strong> = how often your word appears in this specific job ÷ total words in that job</div>
                <div><strong>IDF</strong> = ln(25 ÷ how many jobs contain this word). Higher = rarer = more valuable for ranking.</div>
              </div>
            </div>
          )}
        </SpaceBetween>
      )}

      <ProgressBar
        value={Math.min(count,5)/5*100}
        label={`${Math.min(count,5)}/5 searches done`}
        status={canNext ? 'success' : 'in-progress'}
        description={canNext ? '🎯 Search Expert unlocked! Click Next Step.' : 'Try different search terms to reach 5.'}
      />
    </Step>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — The jobs you're missing (personal, emotional failures)
// ─────────────────────────────────────────────────────────────────────────────
const FAILURES = [
  {
    id:'ml',
    context: 'You studied machine learning for months. You\'ve built models in TensorFlow. You\'re perfect for Google DeepMind.',
    yourSearch: 'ML engineer',
    youExpect: 'Machine Learning Engineer · Google DeepMind',
    why: 'Google\'s job posting says "machine learning" — the full words. Your search was "ML" — the abbreviation everyone uses. The search engine sees "ML" and "machine learning" as completely different. They have never met. Google\'s dream job for you: Score 0.0000.',
    emoji: '😱'
  },
  {
    id:'chatbot',
    context: 'You want to build voice assistants and chatbots. Amazon Alexa is your dream company. You search the obvious thing.',
    yourSearch: 'chatbot developer',
    youExpect: 'Conversational AI Engineer · Amazon Alexa',
    why: 'Amazon\'s job description never uses the word "chatbot". They call it "dialogue systems" and "conversational AI". These are industry terms for the exact same thing. But the search engine doesn\'t know that. Chatbot ≠ dialogue system in its world.',
    emoji: '😤'
  },
  {
    id:'gpt',
    context: 'You\'ve worked with GPT-4 and large language models. Anthropic is building exactly that. You search what you know.',
    yourSearch: 'GPT engineer',
    youExpect: 'LLM Engineer · Anthropic',
    why: 'Anthropic calls it "LLM" (large language model). Your search says "GPT" — a specific OpenAI product. Same technology, different names. Anthropic\'s posting: Score 0.0000. And yet it\'s the most relevant job in the entire list for you.',
    emoji: '🤦'
  },
  {
    id:'neural',
    context: 'You understand neural networks deeply. Meta AI Research is your dream. You search what you studied.',
    yourSearch: 'neural network researcher',
    youExpect: 'AI Research Scientist · Meta AI',
    why: 'Meta\'s posting says "deep learning research" and "novel architectures". They never use the phrase "neural network researcher". Neural networks ARE deep learning. But to the search engine, these are alien words that have never met each other.',
    emoji: '💀'
  }
]

function Step5_Failures({ onNext, onPrev, unlock, unlockedBadges, done, markDone }) {
  const [active, setActive] = useState(null)
  const [activeResults, setActiveResults] = useState(null)
  const allDone = FAILURES.every(f => done.includes(f.id))
  if (allDone && !unlockedBadges.includes('bughunter')) unlock('bughunter')

  const trySearch = (failure) => {
    const scored = computeScores(failure.yourSearch)
    setActive(failure)
    setActiveResults(scored)
    markDone(failure.id)
  }

  return (
    <Step title="The Jobs You're Missing Right Now" emoji="💥" onNext={onNext} onPrev={onPrev}
      canNext={allDone} lockMsg={`Experience ${FAILURES.filter(f=>!done.includes(f.id)).length} more failure${FAILURES.filter(f=>!done.includes(f.id)).length!==1?'s':''} to continue`}>

      <Note icon="🎯" title="This is personal" bg="#fef2f2" border="#fca5a5">
        Below are 4 real scenarios. You are qualified for every single one of these jobs.
        The companies are hiring right now. Your skills match exactly.
        <strong> But the search engine is about to fail you — and you'll see it happen live.</strong>
        <br/><br/>Click each scenario. Run the search. Watch your dream job score 0.0000.
      </Note>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:12 }}>
        {FAILURES.map(f => {
          const isDone = done.includes(f.id)
          const isActive = active?.id === f.id
          return (
            <div key={f.id} onClick={() => trySearch(f)}
              style={{
                border:`2px solid ${isDone ? '#ef4444' : isActive ? '#667eea' : '#e2e8f0'}`,
                borderRadius:12, padding:18, cursor:'pointer', transition:'all 0.2s',
                background: isDone ? '#fef2f2' : isActive ? '#f5f3ff' : 'white',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}>
              <div style={{ fontSize:32, marginBottom:10 }}>{isDone ? '🐛' : '🔍'}</div>
              <div style={{ fontSize:13, color:'#6b7280', marginBottom:8, lineHeight:1.6 }}>{f.context}</div>
              <div style={{ background:'#1e1e2e', borderRadius:6, padding:'8px 12px', fontFamily:'monospace', fontSize:13, color:'#a6e3a1', marginBottom:10 }}>
                Search: "{f.yourSearch}"
              </div>
              <div style={{ fontSize:12, color:'#374151', marginBottom:8 }}>
                <strong>Expected:</strong> {f.youExpect}
              </div>
              {isDone && (
                <div style={{ fontSize:12, color:'#dc2626', fontWeight:800 }}>Result: SCORE 0.0000 ❌</div>
              )}
            </div>
          )
        })}
      </div>

      <ProgressBar
        value={done.length/FAILURES.length*100}
        label={`${done.length}/4 failures discovered`}
        status={allDone ? 'error' : 'in-progress'}
      />

      {active && activeResults && (
        <SpaceBetween size="m">
          {/* The result for the expected job */}
          {(() => {
            const expectedTitle = active.youExpect.split('·')[0].trim()
            const expectedJob = activeResults.find(r => r.title.toLowerCase().includes(expectedTitle.toLowerCase().split(' ')[0]))
            const rank = expectedJob ? activeResults.indexOf(expectedJob) + 1 : null
            return (
              <div style={{ border:'2px solid #ef4444', borderRadius:12, padding:20, background:'#fef2f2' }}>
                <div style={{ fontSize:15, fontWeight:800, color:'#dc2626', marginBottom:14 }}>
                  {active.emoji} You searched: <span style={{ fontFamily:'monospace', background:'#fecaca', padding:'2px 8px', borderRadius:4 }}>"{active.yourSearch}"</span>
                </div>

                {expectedJob && (
                  <div style={{ background:'white', borderRadius:8, padding:14, marginBottom:14, border:'1.5px solid #fca5a5' }}>
                    <div style={{ fontSize:12, color:'#dc2626', fontWeight:700, marginBottom:6 }}>The job you were looking for:</div>
                    <div style={{ fontWeight:800, fontSize:15 }}>{expectedJob.flag} {expectedJob.title}</div>
                    <div style={{ fontSize:13, color:'#6b7280', marginBottom:10 }}>{expectedJob.company} · 📍 {expectedJob.loc}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ background:'#fef2f2', border:'2px solid #ef4444', borderRadius:8, padding:'6px 16px', fontFamily:'monospace', fontWeight:900, fontSize:18, color:'#dc2626' }}>
                        0.0000 ❌
                      </div>
                      {rank && <div style={{ fontSize:13, color:'#6b7280' }}>Ranked #{rank} of 25 — because it scored 0</div>}
                    </div>
                  </div>
                )}

                <Alert type="error" header="Why this happened:">
                  {active.why}
                </Alert>

                {/* Show what ACTUALLY scored top */}
                {activeResults[0]?.score > 0 && activeResults[0]?.id !== expectedJob?.id && (
                  <div style={{ marginTop:14, background:'#f9fafb', borderRadius:8, padding:14, border:'1px solid #e2e8f0' }}>
                    <div style={{ fontSize:12, color:'#374151', fontWeight:700, marginBottom:6 }}>What the engine returned instead (top result):</div>
                    <div style={{ fontWeight:700 }}>{activeResults[0].flag} {activeResults[0].title} · {activeResults[0].company}</div>
                    <div style={{ fontSize:13, color:'#059669', fontFamily:'monospace', marginTop:4 }}>Score: {activeResults[0].score.toFixed(4)}</div>
                    <div style={{ fontSize:12, color:'#6b7280', marginTop:4 }}>This scored higher because the exact characters from your search appeared in its description.</div>
                  </div>
                )}
              </div>
            )
          })()}
        </SpaceBetween>
      )}

      {allDone && (
        <div style={{ background:'linear-gradient(135deg,#fef9c3,#fef08a)', border:'2px solid #f59e0b', borderRadius:12, padding:24, textAlign:'center' }}>
          <div style={{ fontSize:44, marginBottom:10 }}>🐛</div>
          <div style={{ fontSize:18, fontWeight:800, marginBottom:8 }}>Bug Hunter badge earned! +40 XP</div>
          <div style={{ fontSize:14, color:'#374151', lineHeight:1.8 }}>
            You just personally experienced 4 jobs you're qualified for — with a score of 0.0000. Now let's understand exactly why this keeps happening, and what the world invented to fix it.
          </div>
        </div>
      )}
    </Step>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 — Why it fails (simple, clear, leads to embeddings)
// ─────────────────────────────────────────────────────────────────────────────
function Step6_Why({ onNext, onPrev }) {
  return (
    <Step title="The Root Cause — And What Google Did About It" emoji="🧠" onNext={onNext} onPrev={onPrev}>

      <Note icon="🔒" title="The problem has a name: Vocabulary Mismatch" bg="#fef2f2" border="#fca5a5">
        TF-IDF can only match the exact characters you typed. It has no idea what words <em>mean</em>.
        In its world, every word lives on a desert island with no connection to any other word.
      </Note>

      {/* Visual: word pairs that mean the same but score 0 */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:10 }}>
        {[
          { you:'"ML"',              job:'"machine learning"',    type:'Abbreviation vs full form' },
          { you:'"chatbot"',         job:'"conversational AI"',   type:'Everyday word vs industry term' },
          { you:'"GPT engineer"',    job:'"LLM engineer"',        type:'Brand name vs category name' },
          { you:'"neural network"',  job:'"deep learning"',       type:'Different name, same meaning' },
          { you:'"car crash"',       job:'"automobile accident"', type:'Synonym — classic example' },
          { you:'"job"',             job:'"position"',            type:'Simple synonym' },
        ].map((ex,i) => (
          <div key={i} style={{ border:'1.5px solid #fca5a5', borderRadius:10, padding:14, background:'white' }}>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}>
              <div style={{ background:'#667eea', color:'white', borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700, flexShrink:0 }}>You type</div>
              <code style={{ fontSize:13, fontWeight:700, color:'#4c1d95' }}>{ex.you}</code>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}>
              <div style={{ background:'#10b981', color:'white', borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700, flexShrink:0 }}>Job says</div>
              <code style={{ fontSize:13, fontWeight:700, color:'#065f46' }}>{ex.job}</code>
            </div>
            <div style={{ fontSize:11, color:'#dc2626', fontWeight:700 }}>❌ No match · Score: 0.0000</div>
            <div style={{ fontSize:11, color:'#9ca3af', marginTop:4 }}>{ex.type}</div>
          </div>
        ))}
      </div>

      {/* The fix */}
      <div style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius:12, padding:24, border:'2px solid #86efac' }}>
        <div style={{ fontSize:18, fontWeight:800, color:'#15803d', marginBottom:12 }}>🚀 The fix: stop matching words, start matching meanings</div>
        <div style={{ fontSize:14, lineHeight:2, color:'#374151' }}>
          In the 2010s, researchers at Google asked: what if instead of treating words as characters, we represent each word as a <strong>point in mathematical space</strong>?<br/><br/>
          In that space, words that appear in similar contexts end up close to each other. "ML" and "machine learning" appear in the same kind of sentences, in the same kind of documents. So they end up at almost the same coordinates. "Chatbot" and "conversational AI" — same spot.<br/><br/>
          When you search in this mathematical space, you find nearby meanings — not just exact character matches. This is called <strong>semantic search</strong>, and it's the foundation of modern Google, ChatGPT's memory, and every RAG system you'll build in this course.
        </div>
      </div>

      <Note icon="➡️" title="What's next: Word Embeddings" bg="#f5f3ff" border="#c4b5fd">
        In the next tutorial, you'll build that mathematical space yourself. You'll take the exact same 25 job postings,
        convert every word into a vector (a list of numbers), and watch "ML" and "machine learning" converge to
        nearly the same location. The search that returned 0.0000 will suddenly return your dream job.
      </Note>
    </Step>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 7 — Certificate of completion
// ─────────────────────────────────────────────────────────────────────────────
function Step7_Certificate({ onPrev, xp, unlockedBadges, unlock, onRestart }) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setAnimated(true), 100)
    const t2 = setTimeout(() => unlock('engineer'), 600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, []) // eslint-disable-line

  const confetti = Array.from({length:40}, (_,i) => ({
    left:`${(i*2.5)%100}%`,
    color:['#667eea','#764ba2','#f093fb','#f59e0b','#10b981','#3b82f6','#ef4444','#06b6d4'][i%8],
    delay:`${(i%12)*0.12}s`,
    dur:`${2+((i%4)*0.4)}s`,
    size:`${6+(i%5)*3}px`,
  }))

  return (
    <div>
      <style>{`
        @keyframes fall { 0%{transform:translateY(-60px) rotate(0);opacity:1} 100%{transform:translateY(900px) rotate(540deg);opacity:0} }
        @keyframes pop  { 0%{transform:scale(0) rotate(-20deg);opacity:0} 65%{transform:scale(1.25) rotate(4deg)} 100%{transform:scale(1);opacity:1} }
        @keyframes hero { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
      `}</style>

      {animated && (
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:0,zIndex:9990,pointerEvents:'none',overflow:'visible'}}>
          {confetti.map((c,i) => (
            <div key={i} style={{position:'absolute',left:c.left,top:'-10px',width:c.size,height:c.size,background:c.color,borderRadius:i%3===0?'50%':'2px',animation:`fall ${c.dur} ease-in ${c.delay} both`}} />
          ))}
        </div>
      )}

      <Container>
        <SpaceBetween size="l">

          {/* Hero */}
          <div style={{textAlign:'center',padding:'20px 0 8px'}}>
            <div style={{fontSize:90,display:'inline-block',marginBottom:14,animation:animated?'hero 0.7s cubic-bezier(0.34,1.56,0.64,1) both':'none'}}>🏆</div>
            <div style={{fontSize:28,fontWeight:900,background:'linear-gradient(135deg,#667eea,#764ba2)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:6}}>
              You're a Search Engineer!
            </div>
            <div style={{fontSize:15,color:'#6b7280'}}>Here is your official certificate of completion</div>
          </div>

          {/* Certificate */}
          <div style={{padding:3,background:'linear-gradient(135deg,#667eea,#764ba2,#f093fb)',borderRadius:19}}>
            <div style={{background:'linear-gradient(135deg,#f5f3ff,#eff6ff)',borderRadius:16,padding:36,textAlign:'center'}}>
              <div style={{fontSize:11,color:'#7c3aed',textTransform:'uppercase',letterSpacing:3,fontWeight:700,marginBottom:14}}>Certificate of Completion</div>
              <div style={{fontSize:24,fontWeight:900,color:'#3730a3',marginBottom:14}}>TF-IDF Search Engineer — Level 1</div>
              <div style={{fontSize:14,color:'#374151',lineHeight:2,marginBottom:24,maxWidth:520,margin:'0 auto 24px'}}>
                You built a real TF-IDF search engine on 25 AI job postings, calculated the math by hand,
                saw it work beautifully, watched it fail you personally on 4 searches,
                and understood exactly why the world needed something smarter.
              </div>
              <div style={{fontSize:44,fontWeight:900,color:'#667eea',marginBottom:8}}>⚡ {xp} XP</div>
              <div style={{fontSize:13,color:'#8b5cf6',fontWeight:600}}>
                Mohamed Noordeen Alaudeen · AWS GenAI Innovation Center
              </div>
            </div>
          </div>

          {/* Badge parade */}
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:12,fontWeight:700,color:'#9ca3af',textTransform:'uppercase',letterSpacing:1.5,marginBottom:18}}>Your Badges</div>
            <div style={{display:'flex',justifyContent:'center',gap:20,flexWrap:'wrap'}}>
              {BADGES.map((b,i) => (
                <div key={b.id} title={`${b.name}: ${b.desc}`}
                  style={{textAlign:'center',animation:animated&&unlockedBadges.includes(b.id)?`pop 0.55s cubic-bezier(0.34,1.56,0.64,1) ${0.1+i*0.12}s both`:'none',opacity:unlockedBadges.includes(b.id)?1:0.15,cursor:'help'}}>
                  <div style={{fontSize:42,marginBottom:6}}>{b.icon}</div>
                  <div style={{fontSize:11,fontWeight:700,color:b.color,maxWidth:72,margin:'0 auto'}}>{b.name}</div>
                  <div style={{fontSize:10,color:'#9ca3af',marginTop:2}}>+{b.xp} XP</div>
                </div>
              ))}
            </div>
          </div>

          {/* What's next */}
          <div style={{background:'linear-gradient(135deg,#f0fdf4,#dcfce7)',borderRadius:14,padding:24,border:'2px solid #86efac'}}>
            <div style={{fontSize:17,fontWeight:800,color:'#15803d',marginBottom:10}}>🚀 Next Tutorial</div>
            <div style={{fontSize:15,fontWeight:800,color:'#14532d',marginBottom:8}}>Word Embeddings: Teaching Machines to Understand Meaning</div>
            <div style={{fontSize:14,color:'#374151',lineHeight:1.9}}>
              You've felt the pain of TF-IDF: searching "ML" and missing Google DeepMind. In the next tutorial, you'll learn how <strong>word embeddings</strong> solve this — by converting every word into numbers where similar words end up close together. The same 25 jobs. The same searches. But this time, "ML" finds "machine learning" instantly.
            </div>
          </div>

          {/* Nav */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:12,borderTop:'1px solid #e2e8f0',flexWrap:'wrap',gap:10}}>
            <Button onClick={onPrev}>← Previous</Button>
            <Button variant="primary" onClick={onRestart}>🔄 Start Over</Button>
          </div>
        </SpaceBetween>
      </Container>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — state lives here, steps are pure components
// ─────────────────────────────────────────────────────────────────────────────
export function SearchEngineJobHuntComplete({ onStepChange }) {
  const [step, setStep] = useState(0)
  const [xp, setXP] = useState(0)
  const [unlockedBadges, setUnlockedBadges] = useState([])
  const [toast, setToast] = useState(null)
  const [failuresDone, setFailuresDone] = useState([])
  const totalSteps = 8

  useEffect(() => {
    if (onStepChange) onStepChange(step, totalSteps)
    window.scrollTo({ top:0, behavior:'smooth' })
  }, [step, onStepChange])

  const unlock = (id) => {
    const badge = BADGES.find(b => b.id === id)
    if (!badge) return
    setUnlockedBadges(prev => {
      if (prev.includes(id)) return prev
      setXP(x => x + badge.xp)
      setToast(badge)
      return [...prev, id]
    })
  }

  const markFailureDone = (id) => setFailuresDone(prev => prev.includes(id) ? prev : [...prev, id])

  // Full reset — works for restart button
  const restart = () => {
    setStep(0)
    setXP(0)
    setUnlockedBadges([])
    setToast(null)
    setFailuresDone([])
  }

  const next = () => setStep(p => Math.min(totalSteps-1, p+1))
  const prev = () => setStep(p => Math.max(0, p-1))

  const shared = { onNext:next, onPrev:prev, unlock, unlockedBadges, done:failuresDone, markDone:markFailureDone }

  const steps = [
    <Step0_Welcome   key={0} {...shared} />,
    <Step1_Browse    key={1} {...shared} />,
    <Step2_HowItWorks key={2} {...shared} />,
    <Step3_Math      key={3} {...shared} />,
    <Step4_LiveEngine key={4} {...shared} />,
    <Step5_Failures  key={5} {...shared} />,
    <Step6_Why       key={6} {...shared} />,
    <Step7_Certificate key={7} onPrev={prev} xp={xp} unlockedBadges={unlockedBadges} unlock={unlock} onRestart={restart} isLast />,
  ]

  return (
    <SpaceBetween size="l">
      {toast && <BadgeToast badge={toast} onDismiss={() => setToast(null)} />}
      <XPBar xp={xp} unlockedBadges={unlockedBadges} />
      {steps[step]}
    </SpaceBetween>
  )
}
