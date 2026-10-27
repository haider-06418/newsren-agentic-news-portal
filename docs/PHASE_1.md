# Phase 1: editorial experience

## Delivered

- Responsive editorial homepage with custom SVG illustrations and Newsren branding.
- Four desks, URL-based desk filters, text search, and an empty-results state.
- Four story routes and a missing-story page.
- Flagship brief: international-student policy, using State Department and BridgeUSA reference material.
- Claim inspection distinguishing supported statements, editorial interpretation, and unresolved questions.
- Source ledger with publisher, source type, publication date when available, retrieval date, and limitations.
- Research trail showing what was published or checked and when.
- Right-side story notebook with source counts, navigation, and follow-up questions; stacked below the article on mobile.
- Related stories, methodology page, course attribution, and GitHub link.

## Content boundary

These are reference briefs built from primary sources consulted on October 27, 2026. They do not claim a newly verified event or continuous source monitoring. The research trail records actual source consultation, not invented policy events. Publication dates that were not displayed are explicitly marked as unknown.

The briefs have **Needs editorial review** status. Automated source checking is not a substitute for human editorial approval. The notebook's questions are reading prompts; no conversational model is active in Phase 1.

The government pages below were successfully consulted:

- [Student Visa — U.S. Department of State](https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html)
- [F-1 versus J-1 Visas — BridgeUSA](https://j1visa.state.gov/basics/other-u-s-visas/studying-at-u-s-universities-and-colleges-f-1-versus-j-1-visas/)
- [Generative AI Profile — NIST](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [Federal Open Market Committee — Federal Reserve](https://www.federalreserve.gov/monetarypolicy/fomc.htm)

Direct retrieval of the DHS Maintaining Status and USCIS Students and Employment pages was blocked by those sites during research. Their contents are not cited as verified evidence in the prototype.

## Verification

- Production build and TypeScript check.
- Browser checks for filtering, header desk navigation, search, empty state, reset, story routes, evidence expansion, source anchors, methodology, finance notice, and missing stories.
- Responsive inspection at desktop and mobile sizes; horizontal overflow and browser console checks.

Saved previews: [homepage](previews/phase-1-home.jpg), [story page](previews/phase-1-story.jpg), and [mobile homepage](previews/phase-1-mobile.jpg).

## Next phase

Implement the deterministic prototype research assistant in the story pane: supported question intents, cited answers, source validation, and explicit abstention. Keep API inference optional and clearly label demo-mode responses.
