// ─────────────────────────────────────────────────────────────────────────────
// tutorials.js — single source of truth for all tutorial metadata
//
// Fields:
//   id            – URL slug  (/tutorial/:id)
//   title         – display name
//   description   – one-sentence value proposition shown on the card
//   level         – 'beginner' | 'intermediate' | 'advanced'
//   tags          – array of lowercase strings
//   estimatedTime – human-readable string
//   featured      – boolean, controls "Featured" badge
//   isNew         – boolean, controls "New" badge (set false once tutorial is mature)
//   roadmapOrder  – integer, position in the learning path roadmap (1-based)
//   emoji         – used in the roadmap and card header
// ─────────────────────────────────────────────────────────────────────────────

export const tutorials = [
  {
    id: 'how-search-engines-work',
    title: 'How Search Engines Work — Build One from Scratch',
    description: 'Google runs this same 7-step pipeline 8.5 billion times a day. Build each step yourself — live, with real data — and discover the one thing TF-IDF can never do.',
    level: 'beginner',
    tags: ['search', 'tfidf', 'nlp', 'interactive'],
    estimatedTime: '45 minutes',
    featured: true,
    isNew: false,
    roadmapOrder: 1,
    emoji: '🔍',
  },
  {
    id: 'self-attention',
    title: 'Self-Attention Mechanism',
    description: 'Learn how self-attention works with step-by-step calculations using "I bought apple to eat" — discover how context determines meaning.',
    level: 'beginner',
    tags: ['attention', 'transformers', 'basics'],
    estimatedTime: '30 minutes',
    featured: true,
    isNew: false,
    roadmapOrder: 2,
    emoji: '🧠',
  },
  {
    id: 'multi-head-attention',
    title: 'Multi-Head Attention',
    description: 'Explore how 3 attention heads work in parallel — semantic, syntactic, and purpose-driven relationships all computed step by step.',
    level: 'intermediate',
    tags: ['attention', 'transformers', 'architecture'],
    estimatedTime: '60 minutes',
    featured: true,
    isNew: false,
    roadmapOrder: 3,
    emoji: '🔀',
  },
  {
    id: 'transformer-code',
    title: 'Transformer Implementation',
    description: 'Build a complete transformer model from scratch using TensorFlow/Keras with detailed explanations of every layer.',
    level: 'intermediate',
    tags: ['transformers', 'code', 'tensorflow'],
    estimatedTime: '60 minutes',
    featured: false,
    isNew: false,
    roadmapOrder: 4,
    emoji: '⚙️',
  },
  {
    id: 'bert-classification',
    title: 'BERT for Text Classification',
    description: 'Fine-tune BERT for sentiment analysis with practical examples and production-ready code.',
    level: 'intermediate',
    tags: ['bert', 'nlp', 'classification'],
    estimatedTime: '45 minutes',
    featured: true,
    isNew: false,
    roadmapOrder: 5,
    emoji: '🤖',
  },
  {
    id: 'production-challenges',
    title: 'Production AI Challenges',
    description: 'Real-world challenges in deploying AI systems: latency, cost, monitoring, and scaling.',
    level: 'advanced',
    tags: ['production', 'mlops', 'deployment'],
    estimatedTime: '40 minutes',
    featured: false,
    isNew: false,
    roadmapOrder: 6,
    emoji: '🚀',
  },
  {
    id: 'secured-agents',
    title: 'Securing AI Agents',
    description: 'Security best practices for AI agents: prompt injection, data leakage, and access control.',
    level: 'advanced',
    tags: ['security', 'agents', 'best-practices'],
    estimatedTime: '50 minutes',
    featured: false,
    isNew: true,
    roadmapOrder: 7,
    emoji: '🔒',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Derived constants — computed once, imported wherever needed
// ─────────────────────────────────────────────────────────────────────────────

/** The single tutorial rendered as the featured hero on the homepage */
export const featuredTutorial = tutorials.find(t => t.id === 'how-search-engines-work')

/** Tutorials sorted by roadmapOrder for the learning-path roadmap */
export const roadmapTutorials = [...tutorials].sort((a, b) => a.roadmapOrder - b.roadmapOrder)
