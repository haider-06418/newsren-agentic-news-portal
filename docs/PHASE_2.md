# Phase 2: story intelligence

## Delivered

- An AI Story Brief on every story that separates supported claims, editorial interpretation, and unresolved questions.
- A right-side **Ask Newsren** pane scoped to the active story.
- Deterministic question routing for summaries, sources, interpretation, uncertainty, current-change questions, personal advice, and out-of-scope prompts.
- Claim-level citations that navigate to the story's original source ledger.
- Explicit abstention for answers the evidence bundle cannot support.
- A server-side `/api/ask` boundary with input validation and no response caching.
- An optional OpenAI-compatible evidence-selector adapter. It is disabled unless environment variables are configured and never writes answer prose.
- Runtime validation and automated tests that reject unknown claim IDs, changed claim text, false citations, and unsupported personal or current-policy conclusions.

## Trust boundary

Ask Newsren does not have open web access and does not answer from general model knowledge. The deterministic engine chooses from the active story's existing claim records. The UI reproduces their stored text and source IDs rather than generating new material claims.

If an optional provider is configured, it can only select up to four existing claim IDs or abstain. Its selection is validated locally. Invalid output, a timeout, or a provider error falls back to the deterministic engine. Provider-written prose is never displayed.

The assistant is therefore useful for navigating a bounded evidence bundle, but it cannot establish that a new event happened, give personal immigration guidance, predict investments, or determine an individual's eligibility. Those questions return an evidence-boundary response explaining what is missing.

## Optional provider configuration

No provider is required. To experiment with an OpenAI-compatible endpoint, copy the names from `.env.example` into a local environment file:

```text
NEWSREN_PROVIDER_URL=http://127.0.0.1:11434/v1/chat/completions
NEWSREN_PROVIDER_MODEL=qwen3.5:9b
NEWSREN_PROVIDER_API_KEY=
```

This works with a compatible local server such as Ollama, but no local model is started by the application. The default demo remains deterministic and lightweight.

## Verification

- Unit tests cover grounded responses, abstention, out-of-scope questions, adversarial provider output, altered claim text, and false citations.
- TypeScript, lint, and production build checks.
- Desktop browser QA covers starter questions, typed questions, citation navigation, abstention, reset, visual layout, and console errors. Mobile rules are covered by responsive CSS and the production build; full device emulation remains part of the Phase 4 QA pass.

Saved preview: [Phase 2 story intelligence](previews/phase-2-story.jpg).

## Next phase

Add student, educator, and professional explanation modes, save follows locally, and demonstrate material-change detection with seeded updates.
