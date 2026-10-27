# Phase 3: learn and follow

## Delivered

- Student, educator, and professional explanation modes on every reference brief.
- Audience views that reuse exact claim records and keep claim labels and source links attached.
- A question-level follow form with one bounded question per story and an audience preference.
- Browser-only persistence with no account, server database, scheduled task, or background process.
- A dedicated **Your follows** desk for reviewing saved questions.
- Seeded material-change detection with an explicit simulation label, affected claims, and a rationale for why the hypothetical evidence would matter.
- A review action that advances the local follow version and demonstrates the caught-up state.
- Defensive storage parsing and automated tests for audience grounding, follow uniqueness, change detection, and review state.

## Prototype boundary

The explanation modes reorganize existing claims; they do not generate new factual conclusions. Student mode begins with a supported claim, educator mode foregrounds a labeled editorial interpretation, and professional mode foregrounds an unresolved constraint. Each mode keeps the original source state visible.

Follows are saved under `newsren:follows:v1` in the browser's local storage. Nothing leaves the browser, and nothing runs while the site is closed. Removing site data or using another browser removes or hides those follows.

The change detector is a product demonstration, not live monitoring. Every update is labeled **Seeded simulation**, begins with “Demo event only,” and describes a hypothetical evidence event. The prototype compares a saved follow's last-seen version with the story's seeded demo version, then displays the affected existing claims. Marking the update reviewed changes only local browser state.

## Verification

- Automated tests cover all three audience modes, corrupted storage records, one-question-per-story behavior, seeded change detection, review state, simulated-update labeling, and affected-claim integrity.
- Existing story intelligence, provenance, and citation tests remain green.
- TypeScript, ESLint, production build, and browser interaction checks.
- Browser QA covers mode switching, local save, persistence after navigation, material-change display, review state, and empty-state recovery.

Saved preview: [Phase 3 follow desk](previews/phase-3-follows.jpg).

## Next phase

Add the release evaluation rubric, finish full responsive and accessibility QA, publish the demonstration site, and prepare a short walkthrough.
