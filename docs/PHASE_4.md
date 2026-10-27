# Phase 4: evaluation and release

## Delivered

- A repeatable release harness for trust, usefulness, accessibility structure, deterministic latency, and default inference cost.
- A public-facing `/evaluation` scorecard that states both passing checks and evaluation limits.
- GitHub Actions enforcement of `npm run evaluate` alongside tests and the production build.
- Desktop, keyboard, semantic, contrast, and actual 390-pixel responsive browser QA.
- Saved release screenshots and a generated 15-second visual walkthrough.
- A 90-second demonstration script and one-minute architecture walkthrough.
- An explicit unresolved claim added to the Federal Reserve brief after the evaluation found an incomplete evidence loop.

## Release evidence

- [Evaluation report](EVALUATION.md)
- [Demo and architecture walkthrough](DEMO_WALKTHROUGH.md)
- [Animated visual walkthrough](demo/newsren-phase-4-demo.gif)
- [Evaluation page preview](previews/phase-4-evaluation.jpg)
- [Mobile QA preview](previews/phase-4-mobile.jpg)

## Deployment status

The existing ChatGPT Sites project is active and currently uses a custom audience. Deployment requires synchronizing this public GitHub checkout to the separate Sites source repository. That synchronization is intentionally pending explicit user confirmation; the source and build have not been sent to the Sites destination in this phase yet.

Project ID: `appgprj_6ae070acd97881919a1b581d85cf63d9`

## Prototype boundary

The release remains a course prototype. It does not crawl the web, publish news automatically, run a background monitor, host a model, or make case-specific legal or investment recommendations. The optional provider adapter remains disabled by default.
