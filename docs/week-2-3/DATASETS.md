# Dataset and technical-feasibility assessment

Assessment date: November 10, 2026

## Dataset 1: Federal Register API

- **Purpose:** structured regulatory notices, proposed rules and final rules.
- **Access:** obtained; public HTTPS API; no key required for this prototype.
- **Prototype sample:** four records covering F-1 admission duration, OPT fees and country-specific employment relief.
- **Useful attributes:** document number, title, abstract, document type, agencies, publication date and canonical URL.
- **Observed limitation:** broad keyword queries produce irrelevant results, so agency/topic filtering and human validation remain necessary.

## Dataset 2: authoritative agency-guidance registry

- **Purpose:** explanatory guidance that helps readers interpret the scope of regulatory records.
- **Access:** obtained from public State Department and BridgeUSA pages already used in Newsren.
- **Prototype sample:** Student Visa guidance and F-1/J-1 program comparison.
- **Useful attributes:** title, publisher, canonical URL, source type and retrieval date.
- **Observed limitation:** some guidance pages do not expose a reliable publication date. Retrieval time cannot be treated as the effective date of a policy.

## Dataset 3: GDELT DOC 2.0

- **Purpose:** discover independent reporting and compare how the same development is framed across outlets.
- **Access:** public API documented; the November 10 access attempt returned HTTP 429.
- **Status:** in process, not required for the reproducible two-dataset prototype.
- **Mitigation:** cached queries, exponential backoff, a smaller query schedule or a replacement public RSS/media source.

## Integration keys

The prototype joins records through candidate features rather than a guaranteed database key:

- visa/program entities such as F-1, J-1 and OPT;
- responsible agency;
- normalized title and summary terms;
- publication and retrieval time;
- document type; and
- policy-development relationships such as proposed rule to final rule.

Topical similarity is only a candidate-generation signal. A high similarity score does not establish that records describe the same policy event.

## Attribute feasibility

The six-record fixture has 100% coverage for the required canonical fields and 66.7% coverage for publication dates. The date gap comes from agency-guidance pages and is material because Newsren's value depends on temporal reasoning.

## Data governance and safety

- Store metadata and short team-authored summaries, not copied full articles.
- Preserve canonical URLs and retrieval dates.
- Prefer primary government sources for policy assertions.
- Keep journalistic framing attributed if a media corpus is added.
- Do not infer individual immigration eligibility.
- Recheck live documents before presenting a brief as current.

## Sources

- Federal Register API: https://www.federalregister.gov/developers/documentation/api/v1
- GDELT DOC 2.0 API: https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/
- U.S. Department of State student visas: https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html
- BridgeUSA F-1/J-1 comparison: https://j1visa.state.gov/basics/other-u-s-visas/studying-at-u-s-universities-and-colleges-f-1-versus-j-1-visas/
