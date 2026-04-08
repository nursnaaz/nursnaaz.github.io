// ─────────────────────────────────────────────────────────────────────────────
// HomePage.jsx
//
// Features implemented:
//   1. Resume banner     — "Continue where you left off" from localStorage
//   2. Featured hero     — full-width card for the #1 tutorial
//   3. Stats bar         — social-proof numbers (tutorials, free, Colab, students)
//   4. GitHub star count — live fetch, graceful fallback
//   5. Filter tabs       — All / Beginner / Intermediate / Advanced
//   6. Tutorial cards    — with New / Featured badges + progress indicators
//   7. Learning roadmap  — horizontal visual of the full learning path
//   8. Author strip      — personal brand + LinkedIn link
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import Button from '@cloudscape-design/components/button'

import { tutorials, featuredTutorial, roadmapTutorials } from '../data/tutorials'
import { useProgress }    from '../hooks/useProgress'
import { useGitHubStars } from '../hooks/useGitHubStars'

// ─── design tokens ────────────────────────────────────────────────────────────
const C = {
  bg1:     '#0D1117',
  bg2:     '#161B22',
  bg3:     '#1C2430',
  border:  '#30363D',
  border2: '#21262D',
  text1:   '#E6EDF3',
  text2:   '#8B949E',
  text3:   '#6E7681',
  blue:    '#58A6FF',
  blue2:   '#79C0FF',
  green:   '#3FB950',
  green2:  '#56D364',
  orange:  '#F78166',
  orange2: '#FFA657',
  purple:  '#BC8CFF',
  yellow:  '#E3B341',
}

const LEVEL_COLORS = {
  beginner:     { bg: '#0D2A14', border: '#3FB95060', text: C.green2   },
  intermediate: { bg: '#0D1F3A', border: '#58A6FF60', text: C.blue2    },
  advanced:     { bg: '#2A1A0D', border: '#FFA65760', text: C.orange2  },
}

// ─── tiny shared style helpers ────────────────────────────────────────────────

const pill = (active, color = C.blue) => ({
  padding: '6px 16px',
  borderRadius: 20,
  border: `1px solid ${active ? color : C.border}`,
  background: active ? `${color}22` : 'transparent',
  color: active ? color : C.text2,
  fontSize: 13,
  fontWeight: active ? 600 : 400,
  cursor: 'pointer',
  transition: 'all 0.15s',
  userSelect: 'none',
  whiteSpace: 'nowrap',
})

const card = (bg = C.bg2) => ({
  background: bg,
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  padding: '20px 22px',
})

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Resume Banner ──────────────────────────────────────────────────────────
function ResumeBanner({ lastVisitedId, onResume }) {
  const tutorial = tutorials.find(t => t.id === lastVisitedId)
  if (!tutorial) return null

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 12,
      background: `${C.blue}12`,
      border: `1px solid ${C.blue}40`,
      borderRadius: 10, padding: '12px 18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18 }}>👋</span>
        <div>
          <span style={{ color: C.text2, fontSize: 13 }}>Welcome back — continue where you left off</span>
          <div style={{ color: C.blue2, fontWeight: 600, fontSize: 14, marginTop: 2 }}>{tutorial.title}</div>
        </div>
      </div>
      <button
        onClick={() => onResume(tutorial.id)}
        style={{
          padding: '7px 18px', borderRadius: 6, cursor: 'pointer',
          border: `1px solid ${C.blue}60`, background: `${C.blue}22`,
          color: C.blue2, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
        }}
      >
        Resume →
      </button>
    </div>
  )
}

// ── 2. Featured Hero Card ─────────────────────────────────────────────────────
function FeaturedHero({ tutorial, isCompleted, onStart }) {
  const lc = LEVEL_COLORS[tutorial.level] || LEVEL_COLORS.beginner

  return (
    <div style={{
      background: `linear-gradient(135deg, #0D1B2A 0%, #0B1F12 100%)`,
      border: `1px solid ${C.border}`,
      borderRadius: 12, padding: '28px 28px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* decorative blur circle */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 200, height: 200, borderRadius: '50%',
        background: `${C.green}18`, filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, position: 'relative' }}>
        <div style={{ maxWidth: 620 }}>
          {/* label row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: C.green2, background: `${C.green}18`, border: `1px solid ${C.green}40`,
              borderRadius: 4, padding: '2px 8px',
            }}>
              ⭐ Start Here
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: lc.text, background: lc.bg, border: `1px solid ${lc.border}`,
              borderRadius: 4, padding: '2px 8px',
            }}>
              {tutorial.level}
            </span>
          </div>

          {/* title */}
          <h2 style={{ color: C.text1, margin: '0 0 10px', fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>
            {tutorial.emoji} {tutorial.title}
          </h2>

          {/* description */}
          <p style={{ color: C.text2, margin: '0 0 18px', fontSize: 14, lineHeight: 1.65 }}>
            {tutorial.description}
          </p>

          {/* meta row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <span style={{ color: C.text3, fontSize: 13 }}>⏱ {tutorial.estimatedTime}</span>
            <span style={{ color: C.text3, fontSize: 13 }}>✅ No login required</span>
            <span style={{ color: C.text3, fontSize: 13 }}>🧪 100% Interactive</span>
          </div>

          {/* tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 22 }}>
            {tutorial.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 11, color: C.text3, background: C.bg3,
                border: `1px solid ${C.border2}`, borderRadius: 4, padding: '2px 7px',
              }}>
                #{tag}
              </span>
            ))}
          </div>

          <button
            onClick={() => onStart(tutorial.id)}
            style={{
              padding: '10px 28px', borderRadius: 7, cursor: 'pointer', fontSize: 14, fontWeight: 700,
              border: 'none', background: `linear-gradient(90deg, ${C.green} 0%, #2EA043 100%)`,
              color: '#fff', boxShadow: `0 0 16px ${C.green}40`, transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            {isCompleted ? '🔁 Revisit Tutorial' : '▶ Start Tutorial — Free'}
          </button>
        </div>

        {/* completion badge (visible once student completes it) */}
        {isCompleted && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: `${C.green}14`, border: `1px solid ${C.green}40`,
            borderRadius: 10, padding: '16px 24px', flexShrink: 0, textAlign: 'center',
          }}>
            <span style={{ fontSize: 32 }}>🏆</span>
            <div style={{ color: C.green2, fontWeight: 700, fontSize: 13, marginTop: 6 }}>Completed</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── 3. Stats Bar ──────────────────────────────────────────────────────────────
function StatsBar({ stars }) {
  const stats = [
    { value: `${tutorials.length}`,     label: 'Tutorials'       },
    { value: '100%',                    label: 'Free Forever'    },
    { value: 'Colab',                   label: 'Works in Google' },
    { value: '100+',                    label: 'Students'        },
    ...(stars !== null ? [{ value: `⭐ ${stars}`, label: 'GitHub Stars' }] : []),
  ]

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 0,
      background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden',
    }}>
      {stats.map((s, i) => (
        <div key={s.label} style={{
          flex: '1 1 100px', padding: '14px 18px', textAlign: 'center',
          borderRight: i < stats.length - 1 ? `1px solid ${C.border2}` : 'none',
        }}>
          <div style={{ color: C.text1, fontWeight: 700, fontSize: 18, lineHeight: 1 }}>{s.value}</div>
          <div style={{ color: C.text3, fontSize: 11, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── 4. Filter Tabs ────────────────────────────────────────────────────────────
function FilterTabs({ active, onChange }) {
  const levels = ['all', 'beginner', 'intermediate', 'advanced']
  const colorFor = l => l === 'beginner' ? C.green : l === 'intermediate' ? C.blue : l === 'advanced' ? C.orange2 : C.text2

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {levels.map(level => (
        <button
          key={level}
          onClick={() => onChange(level)}
          style={pill(active === level, colorFor(level))}
        >
          {level === 'all' ? 'All Tutorials' : level.charAt(0).toUpperCase() + level.slice(1)}
          {level !== 'all' && (
            <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>
              ({tutorials.filter(t => t.level === level).length})
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ── 5. Tutorial Card ──────────────────────────────────────────────────────────
function TutorialCard({ tutorial, visited, completed, onStart }) {
  const lc = LEVEL_COLORS[tutorial.level] || LEVEL_COLORS.beginner

  return (
    <div style={{
      ...card(),
      display: 'flex', flexDirection: 'column', gap: 12,
      transition: 'border-color 0.15s, box-shadow 0.15s',
      position: 'relative',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = C.blue + '60'
        e.currentTarget.style.boxShadow   = `0 4px 20px rgba(0,0,0,0.4)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = C.border
        e.currentTarget.style.boxShadow   = 'none'
      }}
    >
      {/* top row — emoji + badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 24 }}>{tutorial.emoji}</span>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {tutorial.featured && (
            <span style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              color: C.yellow, background: `${C.yellow}18`, border: `1px solid ${C.yellow}40`,
              borderRadius: 4, padding: '2px 6px',
            }}>Featured</span>
          )}
          {tutorial.isNew && (
            <span style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              color: C.green2, background: `${C.green}18`, border: `1px solid ${C.green}40`,
              borderRadius: 4, padding: '2px 6px',
            }}>New</span>
          )}
          {completed && (
            <span style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              color: C.green2, background: `${C.green}18`, border: `1px solid ${C.green}40`,
              borderRadius: 4, padding: '2px 6px',
            }}>✓ Done</span>
          )}
          {visited && !completed && (
            <span style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              color: C.blue2, background: `${C.blue}14`, border: `1px solid ${C.blue}40`,
              borderRadius: 4, padding: '2px 6px',
            }}>In Progress</span>
          )}
        </div>
      </div>

      {/* level badge */}
      <span style={{
        alignSelf: 'flex-start', fontSize: 11, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        color: lc.text, background: lc.bg, border: `1px solid ${lc.border}`,
        borderRadius: 4, padding: '2px 8px',
      }}>
        {tutorial.level}
      </span>

      {/* title */}
      <div style={{ color: C.text1, fontWeight: 700, fontSize: 15, lineHeight: 1.4 }}>
        {tutorial.title}
      </div>

      {/* description */}
      <div style={{ color: C.text2, fontSize: 13, lineHeight: 1.6, flex: 1 }}>
        {tutorial.description}
      </div>

      {/* meta */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ color: C.text3, fontSize: 12 }}>⏱ {tutorial.estimatedTime}</span>
        <span style={{ color: C.text3, fontSize: 12 }}>
          {tutorial.tags.map(t => `#${t}`).join(' ')}
        </span>
      </div>

      {/* progress bar */}
      <div style={{ height: 3, background: C.border2, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2, transition: 'width 0.4s',
          background: completed ? C.green : visited ? C.blue : 'transparent',
          width: completed ? '100%' : visited ? '40%' : '0%',
        }} />
      </div>

      {/* action button */}
      <button
        onClick={() => onStart(tutorial.id)}
        style={{
          width: '100%', padding: '9px 0', borderRadius: 6, cursor: 'pointer',
          border: `1px solid ${C.blue}60`, background: `${C.blue}18`,
          color: C.blue2, fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${C.blue}28` }}
        onMouseLeave={e => { e.currentTarget.style.background = `${C.blue}18` }}
      >
        {completed ? '🔁 Revisit' : visited ? '▶ Continue' : '▶ Start Tutorial'}
      </button>
    </div>
  )
}

// ── 6. Learning Path Roadmap ──────────────────────────────────────────────────
function LearningRoadmap({ visited, completed, onNavigate }) {
  const levelColor = l =>
    l === 'beginner' ? C.green : l === 'intermediate' ? C.blue : C.orange2

  return (
    <div style={{ ...card(C.bg2) }}>
      {/* header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: C.text1, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
          🗺️ Your Learning Path
        </div>
        <div style={{ color: C.text3, fontSize: 13 }}>
          Work through the tutorials in order — each one builds on the last.
        </div>
      </div>

      {/* nodes */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, alignItems: 'center' }}>
        {roadmapTutorials.map((t, i) => {
          const done    = completed(t.id)
          const started = visited(t.id)
          const color   = levelColor(t.level)

          return (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center' }}>
              {/* node */}
              <button
                onClick={() => onNavigate(t.id)}
                title={t.title}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 6, background: 'none', border: 'none', cursor: 'pointer',
                  padding: '6px 8px',
                }}
              >
                {/* circle */}
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                  background: done ? `${C.green}22` : started ? `${color}18` : C.bg3,
                  border: `2px solid ${done ? C.green : started ? color : C.border}`,
                  boxShadow: done ? `0 0 10px ${C.green}40` : 'none',
                  transition: 'all 0.2s',
                }}>
                  {done ? '✅' : t.emoji}
                </div>
                {/* label */}
                <div style={{
                  color: done ? C.green2 : started ? color : C.text3,
                  fontSize: 10, fontWeight: 600, textAlign: 'center',
                  maxWidth: 68, lineHeight: 1.3,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  {t.title.split('—')[0].trim().split(' ').slice(0, 3).join(' ')}
                </div>
              </button>

              {/* connector line (not after last item) */}
              {i < roadmapTutorials.length - 1 && (
                <div style={{
                  width: 24, height: 2, flexShrink: 0,
                  background: completed(roadmapTutorials[i + 1].id)
                    ? C.green
                    : visited(roadmapTutorials[i + 1].id)
                      ? C.blue
                      : C.border,
                  transition: 'background 0.3s',
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        {[
          { color: C.green,  label: 'Completed' },
          { color: C.blue,   label: 'In Progress' },
          { color: C.border, label: 'Not Started' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
            <span style={{ color: C.text3, fontSize: 11 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 7. Author Strip ───────────────────────────────────────────────────────────
function AuthorStrip() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16,
      ...card(C.bg2),
    }}>
      {/* avatar */}
      <div style={{
        width: 52, height: 52, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
        background: `linear-gradient(135deg, ${C.blue} 0%, ${C.purple} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, fontWeight: 700, color: '#fff',
      }}>
        MN
      </div>

      {/* bio */}
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ color: C.text1, fontWeight: 700, fontSize: 14 }}>
          Mohamed Noordeen Alaudeen
        </div>
        <div style={{ color: C.text2, fontSize: 13, marginTop: 3, lineHeight: 1.5 }}>
          GenAI trainer · Helping 100+ engineers break into AI · Building the curriculum I wish I had.
        </div>
      </div>

      {/* links */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
        <a
          href="https://www.linkedin.com/in/mohamednoordeenalaudeen/"
          target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 6, textDecoration: 'none',
            border: `1px solid ${C.blue}60`, background: `${C.blue}14`,
            color: C.blue2, fontSize: 13, fontWeight: 600,
          }}
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/nursnaaz"
          target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 6, textDecoration: 'none',
            border: `1px solid ${C.border}`, background: C.bg3,
            color: C.text2, fontSize: 13, fontWeight: 600,
          }}
        >
          GitHub
        </a>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HomePage — root component
// ─────────────────────────────────────────────────────────────────────────────

export function HomePage() {
  const navigate = useNavigate()
  const { isVisited, isCompleted, lastVisited } = useProgress()
  const { stars } = useGitHubStars('nursnaaz/zero-to-genai-engineer')

  const [levelFilter, setLevelFilter] = useState('all')

  // Non-featured tutorials, filtered by level
  const gridTutorials = tutorials
    .filter(t => t.id !== featuredTutorial.id)
    .filter(t => levelFilter === 'all' || t.level === levelFilter)

  const handleNavigate = (id) => navigate(`/tutorial/${id}`)

  return (
    <div style={{ padding: '4px 0', maxWidth: 1100, margin: '0 auto' }}>
      <SpaceBetween size="l">

        {/* 1 ─ Resume banner (only when student has visited something) */}
        {lastVisited && lastVisited !== featuredTutorial.id && (
          <ResumeBanner lastVisitedId={lastVisited} onResume={handleNavigate} />
        )}

        {/* 2 ─ Featured hero */}
        <FeaturedHero
          tutorial={featuredTutorial}
          isCompleted={isCompleted(featuredTutorial.id)}
          onStart={handleNavigate}
        />

        {/* 3 ─ Stats bar */}
        <StatsBar stars={stars} />

        {/* 4 ─ Filter tabs + cards grid */}
        <div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
              <div>
                <div style={{ color: C.text1, fontWeight: 700, fontSize: 16 }}>All Tutorials</div>
                <div style={{ color: C.text3, fontSize: 13, marginTop: 2 }}>
                  {gridTutorials.length} tutorial{gridTutorials.length !== 1 ? 's' : ''} available
                </div>
              </div>
              <FilterTabs active={levelFilter} onChange={setLevelFilter} />
            </div>
          </div>

          {gridTutorials.length === 0 ? (
            <div style={{ ...card(), textAlign: 'center', color: C.text3, fontSize: 14, padding: '32px' }}>
              No tutorials at this level yet — check back soon.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}>
              {gridTutorials.map(t => (
                <TutorialCard
                  key={t.id}
                  tutorial={t}
                  visited={isVisited(t.id)}
                  completed={isCompleted(t.id)}
                  onStart={handleNavigate}
                />
              ))}
            </div>
          )}
        </div>

        {/* 5 ─ Learning path roadmap */}
        <LearningRoadmap
          visited={isVisited}
          completed={isCompleted}
          onNavigate={handleNavigate}
        />

        {/* 6 ─ Author strip */}
        <AuthorStrip />

        {/* footer note */}
        <Box textAlign="center">
          <span style={{ color: C.text3, fontSize: 12 }}>
            All tutorials are free forever · No account required · Content by Mohamed Noordeen
          </span>
        </Box>

      </SpaceBetween>
    </div>
  )
}
