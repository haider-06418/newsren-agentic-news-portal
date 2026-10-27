export const snapshotDate = "October 27, 2026";
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
  type: "Agency guidance" | "Research framework" | "Institutional reference";
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
export type Story = {
  slug: string;
  desk: Desk;
  kicker: string;
  title: string;
  shortTitle: string;
  description: string;
  readingMinutes: number;
  illustration: "campus" | "network" | "policy" | "markets";
  reviewStatus: "Needs editorial review";
  brief: string;
  claims: Claim[];
  perspectives: { label: string; text: string; type: "Editorial lens" }[];
  questions: string[];
  sources: Source[];
  trail: { date: string; title: string; description: string }[];
};
const retrievedAt = "2026-10-27";
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
      "Visa headlines, student status, and campus guidance can tell different parts of the story. Start with the evidence behind each one.",
    readingMinutes: 5,
    illustration: "campus",
    reviewStatus: "Needs editorial review",
    brief:
      "This reference brief establishes a starting point for evaluating student-policy headlines. The sources explain visa applications and the difference between F-1 and J-1 programs. They do not establish that a new rule took effect today or determine an individual student's eligibility.",
    claims: [
      {
        id: "c1",
        text: "The course of study and institution help determine the appropriate student visa category.",
        kind: "Supported",
        sourceIds: ["state-visa"],
        detail:
          "The State Department distinguishes academic study under F visas from vocational or nonacademic study under M visas.",
      },
      {
        id: "c2",
        text: "F-1 and J-1 students have different program support contacts.",
        kind: "Supported",
        sourceIds: ["state-programs"],
        detail:
          "BridgeUSA describes designated school officials for F-1 students and sponsor Responsible Officers for J-1 students.",
      },
      {
        id: "c3",
        text: "A policy headline should be checked against the affected program and underlying document.",
        kind: "Interpretation",
        sourceIds: ["state-visa", "state-programs"],
        detail:
          "Newsren's reading approach, based on the distinctions in these sources. This is editorial analysis, not an additional rule.",
      },
      {
        id: "c4",
        text: "Whether a recent policy change affects a particular student remains unanswered here.",
        kind: "Unresolved",
        sourceIds: [],
        detail:
          "This bundle does not contain a specific new rule, its effective date, court orders, or the student's circumstances. Those would need separate verification.",
      },
    ],
    perspectives: [
      {
        label: "For students",
        type: "Editorial lens",
        text: "Identify which program the claim concerns, then take the underlying document to your school or sponsor with a specific question.",
      },
      {
        label: "For campus advisers",
        type: "Editorial lens",
        text: "Explain the scope of a headline and distinguish general agency information from guidance tailored to a student's circumstances.",
      },
    ],
    questions: [
      "Which program and group does the claim cover?",
      "Where is the original announcement or rule?",
      "What is its effective date, and has anything superseded it?",
    ],
    sources: [studentVisa, studentPrograms],
    trail: [
      {
        date: retrievedAt,
        title: "Application guidance checked",
        description:
          "Consulted the State Department's Student Visa page for the scope of its guidance.",
      },
      {
        date: retrievedAt,
        title: "Program distinctions checked",
        description:
          "Consulted BridgeUSA's comparison of F-1 and J-1 programs.",
      },
      {
        date: retrievedAt,
        title: "Evidence gap recorded",
        description:
          "No specific new policy change is asserted. Case-specific effects remain unresolved.",
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
    readingMinutes: 3,
    illustration: "network",
    reviewStatus: "Needs editorial review",
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
    readingMinutes: 3,
    illustration: "policy",
    reviewStatus: "Needs editorial review",
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
    readingMinutes: 3,
    illustration: "markets",
    reviewStatus: "Needs editorial review",
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
