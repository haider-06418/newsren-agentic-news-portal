# The Newsren

The Newsren is an agentic news-intelligence prototype for understanding evolving, contested, and high-uncertainty stories. It helps readers separate verified facts from interpretation, compare credible perspectives, understand who is affected, and identify what to watch next.

> Week 1 Assignment for the course 49-772 A2 **Software Engineering Management, Fall 2026 offering at Carnegie Mellon University - Silicon Valley**.

## Product thesis

Newsren is not a generic news chatbot and does not try to produce a single authoritative opinion. It creates an evidence map around a developing question:

1. What is known?
2. What changed?
3. Where do credible sources disagree?
4. Who is affected?
5. What remains uncertain?
6. What should readers watch next?

The flagship prototype story will focus on changing United States rules and guidance affecting international students. This is a strong test case because policy announcements, agency guidance, court actions, university interpretation, and lived impact may change on different timelines.

## Initial desks

- **Education & Immigration** - student policy, university guidance, access, and learning evidence
- **Technology** - research, model releases, benchmarks, security, and regulation
- **Policy & Society** - evolving public policy with clearly separated facts, analysis, and opinion
- **Business & Finance** - company filings, earnings, industry implications, and regulation, with no investment advice

Sports is a sensible future desk for rule changes, governance, labor, safety, and disputed decisions. It is intentionally outside the first vertical slice so Week 1 remains focused and testable.

## Week 1 prototype

- Editorial homepage and four desks
- One end-to-end evidence-grounded story
- AI Story Brief with claim-level sources
- A contextual **Ask Newsren** pane on the right side of story pages
- Student, educator, and professional explanation modes
- Local topic following with no account required
- Human-review status and finance guardrails
- Deterministic seeded content so the demo continues to work if an AI provider is unavailable

## Architecture

The UI is built with TypeScript, React, Vinext, and Tailwind CSS and is deployable as a Cloudflare Worker through OpenAI Sites. Agent logic is isolated behind a provider interface:

- A free hosted model is the intended public-demo provider.
- The locally installed Ollama `qwen3.5:9b` model is supported as a development fallback.
- Seeded, pre-reviewed outputs provide a no-model demo mode.

See [Architecture](docs/ARCHITECTURE.md), [Product Decisions](docs/PRODUCT_DECISIONS.md), and [Roadmap](docs/ROADMAP.md).

## Development

Prerequisites:

- Node.js 22.13 or newer
- npm
- Optional: Ollama with `qwen3.5:9b`

```bash
npm run install:ci
npm run dev
```

The first implementation phase is in progress. Environment variables and provider setup will be documented when the agent API lands.

## Editorial safety

- Every material claim must link to supporting evidence.
- Primary and authoritative sources are preferred.
- Reporting, analysis, and opinion are labeled separately.
- Credible disagreement is described instead of silently resolved.
- The system abstains when evidence is insufficient.
- Finance content is informational and never personalized investment advice.
- Initial publication requires human review.

## License

No open-source license has been granted. The repository is public for course review and demonstration.
