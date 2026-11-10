export const snapshotDate = "November 10, 2026";
export const desks = [
  "Education & Immigration",
  "Technology",
  "Policy & Society",
  "Business & Finance",
] as const;
export type Desk = (typeof desks)[number];
export type Source = {
  id: string;
  publisher: string;
  title: string;
  url: string;
  type:
    | "Agency guidance"
    | "Final rule"
    | "Proposed rule"
    | "Research framework"
    | "Institutional reference";
  publishedAt: string | null;
  retrievedAt: string;
  note: string;
};
export type Claim = {
  id: string;
  text: string;
  kind: "Supported" | "Interpretation" | "Unresolved";
  sourceIds: string[];
  detail: string;
};
export type StoryUpdate = {
  id: string;
  version: number;
  detectedAt: string;
  label: "Seeded simulation";
  title: string;
  summary: string;
  materiality: string;
  affectedClaimIds: string[];
};
export type Story = {
  slug: string;
  desk: Desk;
  kicker: string;
  title: string;
  shortTitle: string;
  description: string;
  updatedAt: string;
  readingMinutes: number;
  illustration: "campus" | "network" | "policy" | "markets";
  reviewStatus: "Needs editorial review";
  version: number;
  seededUpdate: StoryUpdate;
  brief: string;
  claims: Claim[];
  perspectives: { label: string; text: string; type: "Editorial lens" }[];
  questions: string[];
  sources: Source[];
  trail: { date: string; title: string; description: string }[];
};
const retrievedAt = "2026-10-27";
const currentRetrievedAt = "2026-11-10";
const fixedAdmissionRule: Source = {
  id: "dhs-fixed-admission-final",
  publisher: "U.S. Department of Homeland Security · Federal Register",
  title:
    "Establishing a Fixed Time Period of Admission and an Extension of Stay Procedure",
  url: "https://www.federalregister.gov/documents/2026/07/17/2026-14439/establishing-a-fixed-time-period-of-admission-and-an-extension-of-stay-procedure-for-nonimmigrant",
  type: "Final rule",
  publishedAt: "2026-07-17",
  retrievedAt: currentRetrievedAt,
  note: "The document identifies itself as a final rule and lists September 15, 2026 as its effective date, subject to a congressional-review caveat and any later Federal Register notice.",
};
const optFeeProposal: Source = {
  id: "dhs-opt-fee-proposal",
  publisher: "U.S. Department of Homeland Security · Federal Register",
  title: "Optional Practical Training Fees",
  url: "https://www.federalregister.gov/documents/2026/10/08/2026-20660/optional-practical-training-fees",
  type: "Proposed rule",
  publishedAt: "2026-10-08",
  retrievedAt: currentRetrievedAt,
  note: "This is a notice of proposed rulemaking, not a final rule. The main comment deadline shown in the notice was November 9, 2026; a separate information-collection comment period runs through December 7, 2026.",
};
const studentVisa: Source = {
  id: "state-visa",
  publisher: "U.S. Department of State",
  title: "Student Visa",
  url: "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html",
  type: "Agency guidance",
  publishedAt: null,
  retrievedAt,
  note: "Application and entry guidance. Publication date is not displayed; retrieval date does not establish when policy changed.",
};
const studentPrograms: Source = {
  id: "state-programs",
  publisher: "BridgeUSA · U.S. Department of State",
  title: "F-1 versus J-1 Visas",
  url: "https://j1visa.state.gov/basics/other-u-s-visas/studying-at-u-s-universities-and-colleges-f-1-versus-j-1-visas/",
  type: "Agency guidance",
  publishedAt: null,
  retrievedAt,
  note: "Explains program differences and the roles of school officials and program sponsors. Publication date is not displayed.",
};
const nist: Source = {
  id: "nist-profile",
  publisher: "National Institute of Standards and Technology",
  title: "Generative Artificial Intelligence Profile · NIST AI 600-1",
  url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence",
  type: "Research framework",
  publishedAt: "2024-07-26",
  retrievedAt,
  note: "A companion to the AI Risk Management Framework. A framework is not an evaluation of any particular product.",
};
const fed: Source = {
  id: "fed-fomc",
  publisher: "Board of Governors of the Federal Reserve System",
  title: "Federal Open Market Committee",
  url: "https://www.federalreserve.gov/monetarypolicy/fomc.htm",
  type: "Institutional reference",
  publishedAt: null,
  retrievedAt,
  note: "Overview linking to statements, minutes, and meeting materials. Page last updated October 7, 2026; original publication date not stated.",
};
export const stories: Story[] = [
  {
    slug: "international-student-policy",
    desk: "Education & Immigration",
    kicker: "The developing question",
    title:
      "International student policy: what changed, and what actually applies?",
    shortTitle: "Clarity for the questions that shape your next semester.",
    description:
      "A final DHS rule replaces duration-of-status admissions with fixed periods for F, J, and I classifications. Here is what the source establishes—and what still needs case-specific guidance.",
    updatedAt: currentRetrievedAt,
    readingMinutes: 6,
    illustration: "campus",
    reviewStatus: "Needs editorial review",
    version: 2,
    seededUpdate: {
      id: "student-policy-primary-document",
      version: 3,
      detectedAt: currentRetrievedAt,
      label: "Seeded simulation",
      title: "A hypothetical implementation notice changes the evidence window.",
      summary:
        "Demo event only: imagine that DHS publishes a later notice changing the implementation date or transition guidance.",
      materiality:
        "A later notice could supersede the dates or implementation details summarized here, so Newsren would require editorial re-review.",
      affectedClaimIds: ["c2", "c5"],
    },
    brief:
      "DHS published a final rule changing F, J, and I admissions from duration of status to fixed periods and adding extension-of-stay requirements. The document lists September 15, 2026 as its effective date, while noting that congressional review could lead DHS to publish a different effective date or terminate the rule. This brief describes the rule's stated scope; it cannot determine how it applies to an individual record, travel plan, or school timeline.",
    claims: [
      {
        id: "c1",
        text: "DHS published the fixed-period admission change as a final rule on July 17, 2026.",
        kind: "Supported",
        sourceIds: ["dhs-fixed-admission-final"],
        detail:
          "The Federal Register document labels the action a final rule and identifies DHS and ICE as the issuing agencies.",
      },
      {
        id: "c2",
        text: "The final rule changes F, J, and I classifications from duration of status to admission for a fixed period.",
        kind: "Supported",
        sourceIds: ["dhs-fixed-admission-final"],
        detail:
          "The rule summary also describes changes to admission and extension requirements.",
      },
      {
        id: "c3",
        text: "The document lists September 15, 2026 as the effective date and says DHS would publish a later notice if congressional review changed it.",
        kind: "Supported",
        sourceIds: ["dhs-fixed-admission-final"],
        detail:
          "That caveat is part of the dates section, so readers should check the source and later Federal Register notices before relying on the date.",
      },
      {
        id: "c4",
        text: "The transition should be read alongside the affected classification, admission record, travel, and program timeline.",
        kind: "Interpretation",
        sourceIds: ["dhs-fixed-admission-final", "state-programs"],
        detail:
          "This is Newsren's reading lens, not case-specific legal advice. F-1 and J-1 programs also have different institutional support roles.",
      },
      {
        id: "c5",
        text: "This source bundle cannot determine the rule's effect on a particular student's status or next filing.",
        kind: "Unresolved",
        sourceIds: [],
        detail:
          "That requires the person's current documents and circumstances, current agency instructions, and qualified guidance from a designated school official, sponsor, or attorney.",
      },
    ],
    perspectives: [
      {
        label: "For students",
        type: "Editorial lens",
        text: "Bring your current I-94, I-20 or DS-2019, travel history, and program dates to your designated school official or sponsor before acting.",
      },
      {
        label: "For campus advisers",
        type: "Editorial lens",
        text: "Separate the rule's stated scope and transition provisions from advice based on a student's documents and timeline.",
      },
    ],
    questions: [
      "Has DHS published a later effective-date or implementation notice?",
      "How do the transition provisions interact with an existing I-94 and program end date?",
      "Which school, sponsor, or legal adviser can evaluate the individual record?",
    ],
    sources: [fixedAdmissionRule, studentPrograms, studentVisa],
    trail: [
      {
        date: "2026-07-17",
        title: "Final rule published",
        description:
          "DHS published the fixed-period admission and extension-of-stay rule in the Federal Register.",
      },
      {
        date: "2026-09-15",
        title: "Effective date listed in the rule",
        description:
          "The dates section lists this date and includes a congressional-review caveat.",
      },
      {
        date: currentRetrievedAt,
        title: "Evidence window refreshed",
        description:
          "The final rule and standing State Department guidance were reviewed; individual effects remain outside the evidence bundle.",
      },
    ],
  },
  {
    slug: "optional-practical-training-fee-proposal",
    desk: "Education & Immigration",
    kicker: "Proposal watch",
    title: "The OPT fee headline is consequential—and it is still a proposal.",
    shortTitle: "A proposed OPT fee is not a fee in force.",
    description:
      "DHS proposed new fees for initial and subsequent OPT. The procedural status matters as much as the headline numbers.",
    updatedAt: currentRetrievedAt,
    readingMinutes: 5,
    illustration: "policy",
    reviewStatus: "Needs editorial review",
    version: 1,
    seededUpdate: {
      id: "opt-fee-final-action",
      version: 2,
      detectedAt: currentRetrievedAt,
      label: "Seeded simulation",
      title: "A hypothetical final action appears in the docket.",
      summary:
        "Demo event only: imagine that DHS publishes a final rule, withdrawal, or revised proposal after reviewing comments.",
      materiality:
        "A final action would change the proposal's legal status and could alter the amounts, scope, or timing described here.",
      affectedClaimIds: ["c1", "c2", "c5"],
    },
    brief:
      "DHS published a notice of proposed rulemaking on October 8, 2026 that would create a $70,000 fee for initial OPT and a $30,000 fee for subsequent OPT for each F-1 student. The notice is a proposal, not a final rule. Its general comment deadline was November 9, 2026; the separate information-collection comment period remains listed through December 7, 2026. The proposal could change, be withdrawn, or require a later final rule before taking effect.",
    claims: [
      {
        id: "c1",
        text: "DHS published the OPT fee action as a proposed rule, not a final rule.",
        kind: "Supported",
        sourceIds: ["dhs-opt-fee-proposal"],
        detail:
          "The Federal Register page labels the document a Proposed Rule and the action a notice of proposed rulemaking.",
      },
      {
        id: "c2",
        text: "The proposal would charge $70,000 for initial OPT and $30,000 for subsequent OPT per F-1 student.",
        kind: "Supported",
        sourceIds: ["dhs-opt-fee-proposal"],
        detail:
          "These are the amounts in the proposal's summary; they are not presented here as current fees.",
      },
      {
        id: "c3",
        text: "The main comment deadline was November 9, while information-collection comments are listed through December 7, 2026.",
        kind: "Supported",
        sourceIds: ["dhs-opt-fee-proposal"],
        detail:
          "The notice distinguishes the overall rulemaking comment period from the Paperwork Reduction Act information-collection period.",
      },
      {
        id: "c4",
        text: "Readers should treat the proposal's status as part of the news, not as a footnote.",
        kind: "Interpretation",
        sourceIds: ["dhs-opt-fee-proposal"],
        detail:
          "Newsren's editorial lens: a proposed amount should not be described as a current obligation.",
      },
      {
        id: "c5",
        text: "The bundle does not establish whether DHS will finalize, revise, or withdraw the proposal.",
        kind: "Unresolved",
        sourceIds: [],
        detail:
          "That outcome requires a later official action. Newsren has not inferred one from the close of the main comment period.",
      },
    ],
    perspectives: [
      {
        label: "For students",
        type: "Editorial lens",
        text: "Do not treat a proposed amount as a current payment requirement; monitor the docket and confirm current requirements with official channels.",
      },
      {
        label: "For universities",
        type: "Editorial lens",
        text: "Communicate the document's procedural status, deadlines, and possible next actions alongside its headline impact.",
      },
    ],
    questions: [
      "Will DHS publish a final rule, revision, or withdrawal?",
      "If finalized, what effective date and transition provisions would apply?",
      "Which students and applications would fall within the final scope?",
    ],
    sources: [optFeeProposal],
    trail: [
      {
        date: "2026-10-08",
        title: "Proposal published",
        description:
          "DHS published the OPT fee notice of proposed rulemaking in the Federal Register.",
      },
      {
        date: "2026-11-09",
        title: "Main comment period closed",
        description:
          "The notice listed November 9 as the deadline for comments on the overall proposal.",
      },
      {
        date: currentRetrievedAt,
        title: "Proposal status verified",
        description:
          "The source still identifies the action as proposed; no final outcome is asserted in this brief.",
      },
    ],
  },
  {
    slug: "ai-evidence-beyond-announcements",
    desk: "Technology",
    kicker: "Beyond the announcement",
    title:
      "An AI framework is a starting point. Where is the product evidence?",
    shortTitle: "The distance between an AI claim and its evidence.",
    description:
      "A research framework helps frame questions. Product-specific performance still needs its own evidence.",
    updatedAt: retrievedAt,
    readingMinutes: 3,
    illustration: "network",
    reviewStatus: "Needs editorial review",
    version: 1,
    seededUpdate: {
      id: "ai-product-evaluation",
      version: 2,
      detectedAt: "2026-10-27",
      label: "Seeded simulation",
      title: "A hypothetical product evaluation enters the bundle.",
      summary:
        "Demo event only: imagine that a product-specific benchmark with a stated methodology and limitations is published.",
      materiality:
        "Product-level evidence could change what this brief can responsibly say beyond the general NIST framework.",
      affectedClaimIds: ["c2", "c3"],
    },
    brief:
      "NIST's Generative AI Profile accompanies its AI Risk Management Framework. It helps frame how organizations think about trustworthy AI; it should not be read as a test result for a particular model or application.",
    claims: [
      {
        id: "c1",
        text: "NIST published the Generative AI Profile on July 26, 2024.",
        kind: "Supported",
        sourceIds: ["nist-profile"],
        detail:
          "The publication page names the document NIST AI 600-1 and identifies it as a companion to AI RMF 1.0.",
      },
      {
        id: "c2",
        text: "A general framework cannot establish the performance of a named product.",
        kind: "Interpretation",
        sourceIds: ["nist-profile"],
        detail:
          "Newsren's distinction between a framework's scope and an independent product evaluation.",
      },
      {
        id: "c3",
        text: "No product-level performance conclusion is supported by this bundle.",
        kind: "Unresolved",
        sourceIds: [],
        detail:
          "A product-specific benchmark, methodology, and limitations would be needed before making that claim.",
      },
    ],
    perspectives: [
      {
        label: "For builders",
        type: "Editorial lens",
        text: "Use the framework to structure evaluation questions, then seek evidence specific to the product and its intended use.",
      },
    ],
    questions: [
      "What task was actually evaluated?",
      "Were the results independently replicated?",
      "Which limitations are missing from the announcement?",
    ],
    sources: [nist],
    trail: [
      {
        date: "2024-07-26",
        title: "Framework published",
        description: "NIST released its Generative AI Profile.",
      },
      {
        date: retrievedAt,
        title: "Source consulted for this brief",
        description:
          "Publication metadata and scope were checked. No new product evaluation is reported.",
      },
    ],
  },
  {
    slug: "student-programs-policy-scope",
    desk: "Policy & Society",
    kicker: "Scope matters",
    title:
      "The same policy headline can leave different students with different questions.",
    shortTitle: "Before judging the impact, establish the scope.",
    description:
      "A source-reading guide to the difference between a program, a policy claim, and its implications.",
    updatedAt: retrievedAt,
    readingMinutes: 3,
    illustration: "policy",
    reviewStatus: "Needs editorial review",
    version: 1,
    seededUpdate: {
      id: "policy-scope-document",
      version: 2,
      detectedAt: "2026-10-27",
      label: "Seeded simulation",
      title: "A hypothetical policy text clarifies who is covered.",
      summary:
        "Demo event only: imagine that an authoritative document names the affected program and population.",
      materiality:
        "A defined scope could replace an umbrella interpretation with a claim tied to an identifiable policy text.",
      affectedClaimIds: ["c2", "c3"],
    },
    brief:
      "BridgeUSA describes F-1 and J-1 as different routes for studying in the United States. That distinction is a useful first filter when reading a broad claim about international students. This brief does not report a new policy announcement.",
    claims: [
      {
        id: "c1",
        text: "Both F-1 and J-1 programs can permit university study, with different program requirements.",
        kind: "Supported",
        sourceIds: ["state-programs"],
        detail:
          "BridgeUSA's comparison discusses academic and cultural program differences.",
      },
      {
        id: "c2",
        text: "A broad headline may need a narrower description of who it affects.",
        kind: "Interpretation",
        sourceIds: ["state-programs"],
        detail:
          "An editorial reading lens. The source's program distinctions do not establish the scope of an unidentified future policy.",
      },
      {
        id: "c3",
        text: "The impact of an unspecified policy cannot be established.",
        kind: "Unresolved",
        sourceIds: [],
        detail:
          "A specific primary document and its applicable population are missing.",
      },
    ],
    perspectives: [
      {
        label: "For policy readers",
        type: "Editorial lens",
        text: "Look for the named visa category, affected population, and authority before drawing a conclusion from an umbrella term.",
      },
    ],
    questions: [
      "Who is included and who is excluded?",
      "Is the source describing law, guidance, or an opinion?",
      "What evidence would change this interpretation?",
    ],
    sources: [studentPrograms],
    trail: [
      {
        date: retrievedAt,
        title: "Program comparison consulted",
        description:
          "The source's scope was recorded separately from possible policy implications.",
      },
    ],
  },
  {
    slug: "reading-the-fed",
    desk: "Business & Finance",
    kicker: "Financial literacy",
    title:
      "The decision, the discussion, and the forecast: reading the Fed carefully.",
    shortTitle: "Read the decision. Question the prediction.",
    description:
      "Start with the Federal Reserve's own meeting materials before turning a rate headline into a forecast.",
    updatedAt: retrievedAt,
    readingMinutes: 3,
    illustration: "markets",
    reviewStatus: "Needs editorial review",
    version: 1,
    seededUpdate: {
      id: "fomc-meeting-material",
      version: 2,
      detectedAt: "2026-10-27",
      label: "Seeded simulation",
      title: "A hypothetical meeting statement is added to the trail.",
      summary:
        "Demo event only: imagine that a newly selected FOMC statement is attached with its meeting date.",
      materiality:
        "The dated primary document would let the brief discuss a specific decision while keeping market forecasts out of scope.",
      affectedClaimIds: ["c2", "c3", "c4"],
    },
    brief:
      "The Federal Reserve's FOMC overview links to statements, minutes, and meeting materials. These are distinct parts of a source trail. This brief explains where to begin reading; it makes no claim about today's rate decision or future market returns.",
    claims: [
      {
        id: "c1",
        text: "The FOMC holds eight regularly scheduled meetings each year.",
        kind: "Supported",
        sourceIds: ["fed-fomc"],
        detail:
          "The institutional overview describes meetings to assess economic conditions and monetary policy.",
      },
      {
        id: "c2",
        text: "The FOMC overview provides access to statements, minutes, and historical materials.",
        kind: "Supported",
        sourceIds: ["fed-fomc"],
        detail:
          "These are linked as separate resources on the Federal Reserve's page.",
      },
      {
        id: "c3",
        text: "A policy document alone does not support a prediction of a particular investment return.",
        kind: "Interpretation",
        sourceIds: ["fed-fomc"],
        detail:
          "Newsren's distinction between reporting a monetary-policy source and forecasting an asset's performance.",
      },
      {
        id: "c4",
        text: "This bundle does not establish a current rate decision or a future market return.",
        kind: "Unresolved",
        sourceIds: [],
        detail:
          "A dated meeting statement would be needed for a specific policy decision, while future returns cannot be established from the institutional overview.",
      },
    ],
    perspectives: [
      {
        label: "For learners",
        type: "Editorial lens",
        text: "Read the official document, note its date, and keep subsequent commentary separate from what the committee actually published.",
      },
    ],
    questions: [
      "Which meeting does the headline reference?",
      "Is this a statement, minutes, or someone else's forecast?",
      "What remains an interpretation?",
    ],
    sources: [fed],
    trail: [
      {
        date: retrievedAt,
        title: "Institutional source checked",
        description:
          "The FOMC overview was consulted as a reference. No rate data or market price is reproduced.",
      },
    ],
  },
];
export function getStory(slug: string) {
  return stories.find((story) => story.slug === slug);
}
export function deskSlug(desk: Desk) {
  return desk.toLowerCase().replace(/ & /g, "-").replaceAll(" ", "-");
}
export function formatSourceDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}
