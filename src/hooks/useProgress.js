// ─────────────────────────────────────────────────────────────────────────────
// useProgress.js
//
// Persists tutorial progress (visited / completed) in localStorage.
// No external dependencies — works offline, survives page refreshes.
//
// Storage key: "nt_progress"
// Storage shape: { [tutorialId]: { visited: true, completedAt: ISO string | null } }
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'

const STORAGE_KEY = 'nt_progress'

/** Read the raw progress map from localStorage, return {} on any error */
function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/** Write the progress map back to localStorage, fail silently */
function writeStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage may be unavailable in private-browsing on some browsers
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export function useProgress() {
  const [progress, setProgress] = useState(readStorage)

  /** Mark a tutorial as visited (called on every tutorial page mount) */
  const markVisited = useCallback((tutorialId) => {
    setProgress(prev => {
      if (prev[tutorialId]?.visited) return prev        // already recorded, no re-render
      const next = {
        ...prev,
        [tutorialId]: { ...prev[tutorialId], visited: true },
      }
      writeStorage(next)
      return next
    })
  }, [])

  /** Mark a tutorial as completed (called when the student finishes the last step) */
  const markCompleted = useCallback((tutorialId) => {
    setProgress(prev => {
      if (prev[tutorialId]?.completedAt) return prev    // already completed, no re-render
      const next = {
        ...prev,
        [tutorialId]: {
          ...prev[tutorialId],
          visited: true,
          completedAt: new Date().toISOString(),
        },
      }
      writeStorage(next)
      return next
    })
  }, [])

  /** True if the tutorial has been visited at least once */
  const isVisited = useCallback(
    (tutorialId) => Boolean(progress[tutorialId]?.visited),
    [progress]
  )

  /** True if the tutorial has been completed */
  const isCompleted = useCallback(
    (tutorialId) => Boolean(progress[tutorialId]?.completedAt),
    [progress]
  )

  /**
   * The last tutorial the user visited, or null.
   * Used to show the "Continue where you left off" resume banner.
   */
  const lastVisited = (() => {
    const entries = Object.entries(progress).filter(([, v]) => v.visited)
    if (!entries.length) return null
    // Pick the most recently visited by completedAt if available, else any
    const withDate = entries.filter(([, v]) => v.completedAt)
    if (withDate.length) {
      return withDate.sort((a, b) => new Date(b[1].completedAt) - new Date(a[1].completedAt))[0][0]
    }
    return entries[entries.length - 1][0]
  })()

  return { progress, markVisited, markCompleted, isVisited, isCompleted, lastVisited }
}
