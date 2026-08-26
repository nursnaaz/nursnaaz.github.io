# nursnaaz.github.io

Interactive ML / GenAI tutorials. Live site: [https://nursnaaz.github.io/](https://nursnaaz.github.io/).

GitHub Pages serves the `docs/` folder (Vite build). After each build, `scripts/spa-fallback.mjs` copies the SPA shell to `docs/404.html` and to `docs/tutorial/<id>/index.html` so Medium deep links return HTTP 200.

## Pair with [zero-to-genai-engineer](https://github.com/nursnaaz/zero-to-genai-engineer)

Open the lab in the browser (no API key). Then run the matching notebook. Medium write-ups are listed only when the article is live.

| Session | Lab | URL | Medium |
|---|---|---|---|
| S00 | How search engines work | https://nursnaaz.github.io/tutorial/how-search-engines-work | [TF-IDF / 100 students](https://medium.com/learning-data/how-i-taught-100-students-to-build-googles-core-algorithm-in-30-minutes-3166e6cc8636) |
| S01 | Cosine similarity & movie recommender | https://nursnaaz.github.io/tutorial/cosine-similarity-movie-recommender | [Words don't have meaning](https://medium.com/generative-ai/words-dont-have-meaning-sentences-do-ef5b7745eac2) |
| S02 | Self-attention | https://nursnaaz.github.io/tutorial/self-attention | [Self-attention by hand](https://medium.com/generative-ai/i-ran-the-math-that-powers-chatgpt-heres-what-i-found-2fc45eecec59) |
| S02 | Positional encoding | https://nursnaaz.github.io/tutorial/positional-encoding | |
| S02 | Multi-head attention | https://nursnaaz.github.io/tutorial/multi-head-attention | |
| S02 | Transformer implementation (code) | https://nursnaaz.github.io/tutorial/transformer-code | |
| S03 | BERT classification | https://nursnaaz.github.io/tutorial/bert-classification | |
| S04 | Tokens / BPE | https://nursnaaz.github.io/tutorial/tokens-are-money | [One word, two tokens](https://medium.com/@nursnaaz/one-word-two-tokens-here-is-how-bpe-builds-them-031f23614e65) |
| S04 | Temperature, top-k, top-p | https://nursnaaz.github.io/tutorial/sampling-temperature-topk-topp | |
| S04 | Context window budget | https://nursnaaz.github.io/tutorial/context-window-budget | |
| S05 | First LLM call | https://nursnaaz.github.io/tutorial/first-llm-call | |
| S05 | Local vs cloud | https://nursnaaz.github.io/tutorial/local-vs-cloud | |
| S06 | Zero-shot / few-shot / CoT | https://nursnaaz.github.io/tutorial/prompt-anatomy | |
| S06 | JSON or bust | https://nursnaaz.github.io/tutorial/json-or-bust | |
| S07 | Chatbots forget | https://nursnaaz.github.io/tutorial/chatbots-forget | |
| S09 / S11 | ReAct, one tool | https://nursnaaz.github.io/tutorial/one-tool-one-loop | |
| S10 | Tiny RAG | https://nursnaaz.github.io/tutorial/tiny-rag | [The 30-day lie](https://medium.com/@nursnaaz/i-asked-chatgpt-about-our-gyms-refund-policy-it-invented-one-bbf28cdf7ecc) |
| S10 | Chunking | https://nursnaaz.github.io/tutorial/chunking-intuition | |
| S10 | Hybrid search + RRF | https://nursnaaz.github.io/tutorial/hybrid-search-rrf | |
| S10 | Citations and refusals | https://nursnaaz.github.io/tutorial/citations-and-refusals | |
| S10 | RAG injection | https://nursnaaz.github.io/tutorial/rag-injection-guardrails | |
| S10f | Chat memory (again, with RAG) | https://nursnaaz.github.io/tutorial/chatbots-forget | |
| S11 | Human in the loop | https://nursnaaz.github.io/tutorial/human-in-the-loop | |
| S11 / MCP | MCP as USB | https://nursnaaz.github.io/tutorial/mcp-as-usb | |
| Production | Production challenges | https://nursnaaz.github.io/tutorial/production-challenges | |
| Agents | Securing AI agents | https://nursnaaz.github.io/tutorial/secured-agents | |

Do not paste the React labs into notebooks. Link the live page, then run the `.ipynb`.

## Local

```bash
npm install
npm run dev
```

Open `http://localhost:3000/`. Production build: `npm run build` (writes `docs/`).
