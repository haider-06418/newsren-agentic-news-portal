# Release evaluation

Evaluation date: October 27, 2026

Run locally with:

```bash
npm run evaluate
```

The command exits unsuccessfully if any release metric fails. It is also part of the GitHub Actions workflow.

## Automated scorecard

| Category | Check | Result | Release threshold |
| --- | --- | ---: | ---: |
| Trust | Supported-claim citation coverage | 100% | 100% |
| Trust | Simulated-update disclosure | 100% | 100% |
| Usefulness | End-to-end story completeness | 4/4 briefs | All briefs |
| Usefulness | Audience explanation coverage | 12 paths | 12 paths |
| Usefulness | Follow-to-change demonstration | 4/4 briefs | All briefs |
| Accessibility | Structural accessibility checks | 5/5 | 5/5 |
| Latency | Deterministic answer selection p95 | Under 0.1 ms locally | Under 5 ms locally |
| Cost | Default inference cost | $0.00 per answer | $0.00 without opt-in |

The latency figure measures 200 in-process evidence selections. It deliberately excludes browser rendering, network latency, and optional-provider calls. It is a regression threshold, not a production service-level objective.

## Browser QA

- Desktop evaluation, story, and follow-desk layouts inspected in the in-app browser.
- A 390-pixel iframe viewport exercised the actual mobile media queries.
- Mobile document width: 373 CSS pixels; scroll width: 373 CSS pixels; no body-level horizontal overflow.
- Skip navigation receives first keyboard focus and reaches `#main`.
- Inputs expose accessible labels; answer and follow confirmations expose live/status semantics.
- Audience controls expose pressed state.
- Representative contrast ratios: 11.41:1 for primary text and 4.93:1 for muted body text on the paper background.
- Desktop and mobile browser consoles contained no errors or warnings during the release checks.

Saved evidence: [evaluation page](previews/phase-4-evaluation.jpg) and [390-pixel mobile QA](previews/phase-4-mobile.jpg).

## Limits

This evaluation does not establish WCAG conformance, production reliability, newsroom accuracy, legal compliance, or security certification. Those require representative users, independent accessibility testing, threat modeling, and an operational editorial process. The scorecard verifies the bounded Week 1 implementation contract.
