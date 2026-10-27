import type { Claim, Story } from "./newsroom";

export type AgentEngine = "deterministic" | "optional-provider";
export type AnswerStatus = "grounded" | "mixed" | "abstained";

export type AnswerPoint = {
  claimId: string;
  label: Claim["kind"];
  text: string;
  detail: string;
  sourceIds: string[];
};

export type AgentAnswer = {
  question: string;
  status: AnswerStatus;
  engine: AgentEngine;
  intro: string;
  points: AnswerPoint[];
  citedSourceIds: string[];
  missingEvidence: string | null;
  followUps: string[];
};

export type EvidenceSelection = {
  claimIds: string[];
  abstain: boolean;
};

export type EvidenceSelector = {
  name: string;
  select(question: string, story: Story): Promise<EvidenceSelection>;
};

const stopWords = new Set([
  "a",
  "about",
  "and",
  "are",
  "can",
  "does",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "of",
  "on",
  "the",
  "this",
  "to",
  "what",
  "which",
  "with",
]);

const personalAdvicePattern =
  /\b(affect me|my case|my status|am i eligible|should i|can i apply|what should i buy|invest|legal advice)\b/i;
const currentChangePattern =
  /\b(today|right now|latest|currently|new rule|recent change|what changed|effective date)\b/i;
const sourcePattern =
  /\b(source|evidence|proof|official|support|supported|citation)\b/i;
const uncertaintyPattern =
  /\b(unknown|uncertain|unresolved|missing|cannot tell|don't know|do not know)\b/i;
const interpretationPattern =
  /\b(interpret|meaning|perspective|takeaway|why does it matter|read this)\b/i;
const summaryPattern = /\b(summary|summarize|brief|overview|known|know)\b/i;

function words(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

function isInStoryScope(question: string, story: Story) {
  if (
    sourcePattern.test(question) ||
    uncertaintyPattern.test(question) ||
    interpretationPattern.test(question) ||
    summaryPattern.test(question) ||
    personalAdvicePattern.test(question) ||
    currentChangePattern.test(question)
  )
    return true;

  const storyVocabulary = new Set(
    words(
      [
        story.title,
        story.description,
        story.brief,
        ...story.claims.map((claim) => `${claim.text} ${claim.detail}`),
      ].join(" "),
    ),
  );
  return words(question).some((word) => storyVocabulary.has(word));
}

export function selectEvidenceDeterministically(
  question: string,
  story: Story,
): EvidenceSelection {
  const trimmed = question.trim();
  if (!trimmed || !isInStoryScope(trimmed, story))
    return { claimIds: [], abstain: true };

  if (personalAdvicePattern.test(trimmed) || currentChangePattern.test(trimmed))
    return {
      claimIds: story.claims
        .filter((claim) => claim.kind === "Unresolved")
        .map((claim) => claim.id),
      abstain: true,
    };

  let selected: Claim[];
  if (uncertaintyPattern.test(trimmed)) {
    selected = story.claims.filter((claim) => claim.kind === "Unresolved");
  } else if (interpretationPattern.test(trimmed)) {
    selected = story.claims.filter(
      (claim) => claim.kind === "Interpretation",
    );
  } else if (sourcePattern.test(trimmed)) {
    selected = story.claims.filter((claim) => claim.kind === "Supported");
  } else {
    selected = story.claims.filter((claim) => claim.kind !== "Unresolved");
  }

  return {
    claimIds: selected.slice(0, 3).map((claim) => claim.id),
    abstain: selected.length === 0,
  };
}

export function validateEvidenceSelection(
  story: Story,
  selection: EvidenceSelection,
) {
  if (!Array.isArray(selection.claimIds)) return false;
  const claimIds = new Set(story.claims.map((claim) => claim.id));
  return (
    selection.claimIds.length <= 4 &&
    new Set(selection.claimIds).size === selection.claimIds.length &&
    selection.claimIds.every((id) => claimIds.has(id))
  );
}

function buildAnswer(
  question: string,
  story: Story,
  selection: EvidenceSelection,
  engine: AgentEngine,
): AgentAnswer {
  const chosenClaims = selection.claimIds
    .map((id) => story.claims.find((claim) => claim.id === id))
    .filter((claim): claim is Claim => Boolean(claim));
  const unresolved = chosenClaims.filter(
    (claim) => claim.kind === "Unresolved",
  );
  const citedSourceIds = [
    ...new Set(chosenClaims.flatMap((claim) => claim.sourceIds)),
  ];
  const shouldAbstain = selection.abstain || chosenClaims.length === 0;
  const status: AnswerStatus = shouldAbstain
    ? "abstained"
    : chosenClaims.some((claim) => claim.kind !== "Supported")
      ? "mixed"
      : "grounded";

  let intro = "Here is what this story's evidence bundle supports.";
  if (status === "mixed")
    intro =
      "The bundle supports part of this answer, while keeping editorial interpretation visibly separate.";
  if (status === "abstained")
    intro =
      "I can’t establish that from this story’s evidence bundle. Here is the boundary the brief records.";

  const fallbackGap = story.claims.find(
    (claim) => claim.kind === "Unresolved",
  );
  const missingEvidence =
    status === "abstained"
      ? unresolved[0]?.detail ??
        fallbackGap?.detail ??
        "A relevant primary source is not present in this bounded story bundle."
      : unresolved[0]?.detail ?? null;

  return {
    question,
    status,
    engine,
    intro,
    points: chosenClaims.map((claim) => ({
      claimId: claim.id,
      label: claim.kind,
      text: claim.text,
      detail: claim.detail,
      sourceIds: [...claim.sourceIds],
    })),
    citedSourceIds,
    missingEvidence,
    followUps: story.questions.slice(0, 3),
  };
}

export function validateAgentAnswer(story: Story, answer: AgentAnswer) {
  const sourceIds = new Set(story.sources.map((source) => source.id));
  const claims = new Map(story.claims.map((claim) => [claim.id, claim]));
  if (answer.points.length > 4) return false;

  for (const point of answer.points) {
    const claim = claims.get(point.claimId);
    if (!claim) return false;
    if (
      point.text !== claim.text ||
      point.detail !== claim.detail ||
      point.label !== claim.kind
    )
      return false;
    if (
      point.sourceIds.length !== claim.sourceIds.length ||
      point.sourceIds.some(
        (id, index) => id !== claim.sourceIds[index] || !sourceIds.has(id),
      )
    )
      return false;
    if (point.label === "Supported" && point.sourceIds.length === 0)
      return false;
  }

  const expectedCitations = [
    ...new Set(answer.points.flatMap((point) => point.sourceIds)),
  ];
  return (
    expectedCitations.length === answer.citedSourceIds.length &&
    expectedCitations.every((id, index) => id === answer.citedSourceIds[index])
  );
}

export async function answerStoryQuestion(
  question: string,
  story: Story,
  selector?: EvidenceSelector,
) {
  const deterministicSelection = selectEvidenceDeterministically(
    question,
    story,
  );
  let selection = deterministicSelection;
  let engine: AgentEngine = "deterministic";

  if (selector) {
    try {
      const providerSelection = await selector.select(question, story);
      if (validateEvidenceSelection(story, providerSelection)) {
        selection = providerSelection;
        engine = "optional-provider";
      }
    } catch {
      selection = deterministicSelection;
    }
  }

  const answer = buildAnswer(question, story, selection, engine);
  if (validateAgentAnswer(story, answer)) return answer;

  return buildAnswer(question, story, deterministicSelection, "deterministic");
}
