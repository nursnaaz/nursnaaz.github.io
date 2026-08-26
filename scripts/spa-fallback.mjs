#!/usr/bin/env node
/**
 * GitHub Pages only serves index.html at known files.
 * Copy the SPA shell to every /tutorial/<id>/index.html so Medium deep links
 * return HTTP 200 instead of relying on 404.html.
 */
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const index = join(root, 'docs/index.html')
copyFileSync(index, join(root, 'docs/404.html'))

const js = readFileSync(join(root, 'src/data/tutorials.js'), 'utf8')
const ids = [...js.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1])
for (const id of ids) {
  const dir = join(root, 'docs/tutorial', id)
  mkdirSync(dir, { recursive: true })
  copyFileSync(index, join(dir, 'index.html'))
}
console.log(`spa-fallback: 404.html + ${ids.length} tutorial shells`)
