# Newsren: Team Project Architecture Design and Technical Feasibility Assessment

**Course:** 49-772 A2 Software Engineering Management, Fall 2026  
**Institution:** Carnegie Mellon University - Silicon Valley  
**Team:** Mohammed Haider Abbas, Ankit Ojha, Nikhil Gaurav  
**Deliverable:** Weeks 2-3 Team Project Architecture Design and Technical Feasibility Assessment  
**Repository:** https://github.com/haider-06418/newsren-agentic-news-portal  
**Assessment date:** November 10, 2026

## Executive summary

Newsren extends the team's Week 1 news-intelligence prototypes into a shared, evidence-grounded architecture for evolving policy stories. The team selected Mohammed Haider Abbas's implementation as the baseline because all three individual projects addressed the same prompt and produced similar concepts. This deliverable tests the highest-risk technical assumption: whether heterogeneous public sources can be normalized and matched while preserving provenance, time and uncertainty. The prototype integrates Federal Register records with authoritative agency guidance and compares keyword overlap with TF-IDF/cosine similarity on a small labeled set. The experiment establishes schema and access feasibility but also shows that text similarity alone has insufficient recall and cannot prove event identity. Human review and source validation therefore remain architectural requirements.

## 1. Individual responsibility and contribution (5%)

The team uses an equal 33.3% responsibility target. Mohammed owns integration and architecture; Ankit owns dataset access, normalization and quality analysis; Nikhil owns retrieval experiments, evaluation and risk analysis. Each workstream receives paired review, and all members remain accountable for explaining the complete system.

The existing Newsren codebase, deployment, source/claim model and evaluation harness are the starting contribution from Mohammed's selected Week 1 implementation. The team jointly selected the scope, free/public-data constraint and equal responsibility plan during the November 10 shared planning session. Final contribution wording will be reconciled against completed pairing logs and Git history before submission rather than overstating planned work.

## 2. Pair programming and knowledge transfer (5%)

The team uses driver/navigator pairing for complex, knowledge-transfer work. Roles must switch during each session, both participants must remain active, and the output must link to a commit or pull request. The planned rotation covers dataset normalization, algorithm evaluation and release validation so that each member pairs with both teammates.

The November 10 session is recorded as joint planning and ensemble design because all three members participated through a shared Codex session. It will only be claimed as code-pairing evidence after the team confirms the human driver/navigator rotation. The session log in `docs/week-2-3/TEAMWORK.md` contains the required fields and protects the submission from inventing collaboration evidence.

## 3. Individual work promoted to the team project (10%)

All members received the same Week 1 Newsren prompt and developed similar agentic news concepts. The team promoted the following elements from the selected implementation:

- an evidence map rather than a generic chatbot;
- claim-level source links and explicit unresolved questions;
- international-student policy as the flagship high-uncertainty domain;
- a contextual Ask Newsren assistant bounded to the active story;
- deterministic fallbacks so the demo does not require a paid model;
- audience-specific explanations and local topic following;
- human review, abstention and citation validation; and
- a public React/Next.js interface deployed on Vercel.

The team-level extension is not another UI redesign. It adds multi-dataset ingestion, a canonical schema, matching experiments, an updated architecture, measurable feasibility evidence and shared engineering practices.

## 4. Project problem statement (40%)

Readers struggle to understand evolving policy stories because official documents, institutional guidance, and news coverage change on different timelines and often mix verified facts with interpretation. Newsren will test whether an evidence-grounded agentic workflow can integrate these sources into claim-level cited briefs that preserve disagreement and uncertainty. We hypothesize that this approach will improve citation traceability, source diversity, and unsupported-claim rates compared with conventional single-source summaries. Our contribution is a lightweight, human-reviewed architecture for auditable AI news synthesis that helps affected readers make better-informed decisions without presenting uncertain conclusions as settled facts.

Word count: 92.

### Research questions

1. Can heterogeneous policy and guidance datasets be normalized without losing provenance or temporal context?
2. Can a lightweight retrieval method identify useful cross-dataset evidence candidates?
3. Can an agent remain bounded to validated claims and abstain when the evidence is insufficient?
4. Can the system operate with public datasets and no paid or hosted model?

### Innovation and human impact

Newsren does not treat uncertainty as randomness and does not manufacture consensus. It represents supported claims, interpretations, conflicts, dates and evidence gaps separately. This is particularly important for international students, whose decisions can be harmed when a broad headline is mistaken for a rule that applies immediately to every student.

## 5. Prototyping and technical feasibility (40%)

### 5.1 Datasets and access

The reproducible prototype integrates two available public datasets: structured Federal Register records and a curated registry of authoritative State Department guidance. A third planned corpus, GDELT DOC 2.0, is public but returned HTTP 429 during the access test and is therefore recorded as an unresolved availability risk rather than silently treated as available.

The six-record fixture covers proposed and final admission-period rules, an OPT-fee proposal, country-specific F-1 employment relief, general student-visa guidance and an F-1/J-1 comparison. All required canonical fields are populated; publication dates are present for four of six records.

### 5.2 Hypothesis-testing steps

1. Query a public regulatory API for international-student records.
2. Cache a small reproducible fixture with canonical URLs and retrieval metadata.
3. Normalize regulatory and guidance records into one schema.
4. Label ten document pairs as related or unrelated, with reasons.
5. Run a raw keyword-overlap baseline.
6. Run TF-IDF vectorization with cosine similarity.
7. Compare precision, recall, accuracy and F1.
8. Inspect errors and identify missing structured features.
9. Preserve validated records as candidates for the Newsren evidence bundle.
10. Retain human review before any policy conclusion is published.

### 5.3 Prototype code and reproducibility

The implementation is available in `lib/feasibility.ts`, `scripts/feasibility/run.mjs`, `data/feasibility/` and `tests/feasibility.test.mjs`.

```bash
npm run feasibility
npm test
npm run evaluate
npm run build:vercel
```

### 5.4 Initial experimental results

| Method | Precision | Recall | Accuracy | F1 |
| --- | ---: | ---: | ---: | ---: |
| Keyword overlap | 0.400 | 0.286 | 0.200 | 0.333 |
| TF-IDF + cosine | 0.667 | 0.286 | 0.400 | 0.400 |

TF-IDF modestly improves precision, accuracy and F1 on the exploratory sample, but recall remains low. The result supports continued investigation, not a general performance claim. The errors show that lexical similarity cannot distinguish “same broad population” from “same policy development.” The next architecture increment should add explicit entity, agency, document-version and temporal-relation features before considering embeddings or a larger model.

### 5.5 Hypothesis assessment

- **Data-access hypothesis:** supported for Federal Register and existing agency guidance.
- **Schema hypothesis:** supported for required metadata; temporal completeness is only partially supported.
- **Multi-dataset integration hypothesis:** supported for candidate generation, not for automatic event identity.
- **TF-IDF matching hypothesis:** weakly supported on this fixture; recall is insufficient.
- **Fully automated publishing hypothesis:** disproved by the observed ambiguity and temporal gaps.
- **Free/lightweight deployment hypothesis:** supported by the existing deterministic Vercel application.

### 5.6 Risks and mitigations

| Risk | Prototype evidence | Mitigation |
| --- | --- | --- |
| External API limits | GDELT returned HTTP 429 | Cache, backoff, scheduled low-volume retrieval or replacement corpus |
| Missing dates | Two guidance records lack publication dates | Preserve null, store retrieval time separately and require re-verification |
| False document matches | Both methods confuse broad-topic overlap with event identity | Add entities, agencies, document relations and human validation |
| Hallucinated synthesis | Model-generated prose could exceed evidence | Select validated claim IDs; reject altered or unknown claims |
| Stale policy information | A retrieved page may change later | Display evidence window and block unsupported currentness claims |
| Legal/personal advice | Individual outcomes need facts outside the corpus | Abstain and direct users to qualified institutional or legal support |
| Unequal teamwork | Planned ownership can diverge from actual work | Pair rotation, commit evidence and final contribution reconciliation |

## Architecture decision

The team will retain the existing evidence-selector architecture and add source adapters plus a canonical document layer. A model, if used, may rank or select evidence IDs but may not independently create publishable policy claims. This preserves the Week 1 product's strongest quality: a user can trace every material statement to an identifiable source or see that it remains unresolved.

## Feasibility conclusion and next increment

The project is technically feasible as a bounded, human-reviewed news-intelligence prototype. Public data can populate the required schema, multiple source families can be joined, and lightweight algorithms can produce evidence candidates. The experiment also disproves a risky shortcut: similarity scores alone are not reliable enough to automate policy-story construction. The next increment should enlarge the labeled set, implement entity/temporal features, add a controlled media corpus, and conduct a small human evaluation comparing a conventional summary with a Newsren evidence brief.

A secondary technology-policy transfer test may be added only after the international-student pipeline and evaluation remain reproducible.

## References

1. Federal Register API documentation: https://www.federalregister.gov/developers/documentation/api/v1
2. GDELT DOC 2.0 API documentation: https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/
3. U.S. Department of State, Student Visa: https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html
4. BridgeUSA, F-1 versus J-1 Visas: https://j1visa.state.gov/basics/other-u-s-visas/studying-at-u-s-universities-and-colleges-f-1-versus-j-1-visas/
5. LinkedIn, Pair Programming Best Practices: https://www.linkedin.com/top-content/technology/best-practices-in-technology/pair-programming-best-practices/

## Submission readiness

The architecture, prototype, dataset access evidence, initial experiment and report narrative are reproducible. Before final submission, the team must replace the unconfirmed pairing-log cells with the actual session dates, durations, driver/navigator rotations and linked commits, then reconcile the contribution table with completed work.
