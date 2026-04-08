// ─────────────────────────────────────────────────────────────────────────────
// useGitHubStars.js
//
// Fetches the star count for a public GitHub repo using the unauthenticated
// GitHub REST API (60 requests / hour / IP — sufficient for a personal site).
//
// The result is cached in React state for the lifetime of the page so the
// same component tree never triggers more than one network request.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'

/**
 * @param {string} repo  e.g. "nursnaaz/zero-to-genai-engineer"
 * @returns {{ stars: number | null, loading: boolean }}
 */
export function useGitHubStars(repo) {
  const [stars, setStars]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!repo) return

    let cancelled = false

    fetch(`https://api.github.com/repos/${repo}`, {
      // Ask for GitHub's v3 JSON — also tells the API we want a minimal response
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(data => {
        if (!cancelled) setStars(data.stargazers_count ?? null)
      })
      .catch(() => {
        // Fail silently — the component gracefully hides the star count when null
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [repo])

  return { stars, loading }
}
