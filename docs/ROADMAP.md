# Roadmap

## Phase 0 - Foundation

- [x] Confirm product boundary and initial desks.
- [x] Select a prototype-first architecture with no model-hosting requirement.
- [x] Scaffold the web application.
- [x] Document editorial and AI decisions.
- [x] Create and push the public GitHub repository.
- [x] Register the private development deployment.

## Phase 1 - Editorial experience

- [x] Build the responsive homepage and desk navigation.
- [x] Add the flagship Education & Immigration reference brief.
- [x] Model sources, evidence, claims, and research-trail events.
- [x] Add evidence and editorial-status UI.

Phase 1 includes four curated reference briefs, desk filters, search, expandable claims, source provenance, the story notebook, related briefs, an approach page, and a missing-story page. Each brief is labeled as a dated snapshot awaiting editorial review. The research trail distinguishes source publication from retrieval; it does not fabricate a current news timeline.

**Gate:** The story can be understood and audited without invoking a model.

## Phase 2 - Story intelligence

- [x] Implement the deterministic prototype agent and an optional provider adapter.
- [x] Add AI Story Brief.
- [x] Add the contextual Ask Newsren pane.
- [x] Add source-grounded response validation and abstention.

Phase 2 keeps the assistant bounded to the active story. The default engine selects exact claim records and preserves their source IDs. An optional provider may select evidence IDs, but it cannot write displayed claims; invalid output falls back to the deterministic path. Personal, current-event, and out-of-scope questions receive an explicit evidence-boundary response.

**Gate:** Every generated material claim is supported or explicitly marked uncertain.

## Phase 3 - Learn and follow

- [x] Add student, educator, and professional explanation modes.
- [x] Save follows locally.
- [x] Demonstrate material-change detection with seeded updates.

Phase 3 adds deterministic audience lenses and a browser-local follow desk. Seeded updates are visibly hypothetical and are compared against each follow's last-reviewed version; they do not imply live monitoring, new reporting, or a background service.

**Gate:** A user can discover, understand, investigate, and follow one question end to end.

## Phase 4 - Evaluation and release

- [x] Add trust, usefulness, accessibility, latency, and cost checks.
- [x] Complete responsive browser QA.
- [ ] Publish the demonstration site.
- [x] Record a short demo and architecture walkthrough.

The release harness, public scorecard, 390-pixel browser QA, visual demo, and walkthrough are complete. Deployment to the separate existing Sites source repository remains pending explicit user confirmation; the public GitHub repository is not automatically the Sites deployment source.
