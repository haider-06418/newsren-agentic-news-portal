import { performance } from "node:perf_hooks";
import { answerStoryQuestion } from "./agent.ts";
import { audienceModes, createAudienceExplanation } from "./audience.ts";
import { detectMaterialChange, type StoryFollow } from "./follows.ts";
import { stories } from "./newsroom.ts";

export type EvaluationCategory =
  | "Trust"
  | "Usefulness"
  | "Accessibility"
  | "Latency"
  | "Cost";

export type EvaluationMetric = {
  id: string;
  category: EvaluationCategory;
  label: string;
  value: string;
  threshold: string;
  passed: boolean;
  evidence: string;
};

export type AccessibilitySignals = {
  skipLink: boolean;
  mainLandmarks: boolean;
  labeledInputs: boolean;
  liveRegions: boolean;
  pressedState: boolean;
};

function percentage(part: number, total: number) {
  return total === 0 ? 100 : Math.round((part / total) * 100);
}

export function evaluateTrust(): EvaluationMetric[] {
  const supportedClaims = stories.flatMap((story) =>
    story.claims.filter((claim) => claim.kind === "Supported"),
  );
  const citedClaims = supportedClaims.filter(
    (claim) => claim.sourceIds.length > 0,
  );
  const simulatedUpdates = stories.filter(
    (story) =>
      story.seededUpdate.label === "Seeded simulation" &&
      story.seededUpdate.summary.startsWith("Demo event only:"),
  );

  return [
    {
      id: "supported-citation-coverage",
      category: "Trust",
      label: "Supported-claim citation coverage",
      value: `${percentage(citedClaims.length, supportedClaims.length)}%`,
      threshold: "100%",
      passed: citedClaims.length === supportedClaims.length,
      evidence: `${citedClaims.length} of ${supportedClaims.length} supported claims retain source IDs.`,
    },
    {
      id: "simulation-disclosure",
      category: "Trust",
      label: "Simulated-update disclosure",
      value: `${percentage(simulatedUpdates.length, stories.length)}%`,
      threshold: "100%",
      passed: simulatedUpdates.length === stories.length,
      evidence: `${simulatedUpdates.length} of ${stories.length} demo updates are explicitly labeled and prefixed.`,
    },
  ];
}

export function evaluateUsefulness(): EvaluationMetric[] {
  const completeStories = stories.filter(
    (story) =>
      story.sources.length > 0 &&
      story.claims.some((claim) => claim.kind === "Supported") &&
      story.claims.some((claim) => claim.kind === "Unresolved") &&
      story.questions.length >= 3 &&
      story.perspectives.length > 0,
  );
  const audiencePaths = stories.flatMap((story) =>
    audienceModes.map((mode) => createAudienceExplanation(story, mode)),
  );
  const demoFollows: StoryFollow[] = stories.map((story) => ({
    storySlug: story.slug,
    question: story.questions[0],
    audience: "student",
    createdAt: "2026-10-27T12:00:00.000Z",
    lastSeenVersion: story.version,
  }));
  const detectableChanges = demoFollows.filter((follow) => {
    const story = stories.find((item) => item.slug === follow.storySlug);
    return story ? Boolean(detectMaterialChange(follow, story)) : false;
  });

  return [
    {
      id: "story-completeness",
      category: "Usefulness",
      label: "End-to-end story completeness",
      value: `${completeStories.length}/${stories.length} briefs`,
      threshold: "All briefs",
      passed: completeStories.length === stories.length,
      evidence:
        "Each complete brief includes a source, supported and unresolved claims, three follow-up questions, and a perspective.",
    },
    {
      id: "audience-paths",
      category: "Usefulness",
      label: "Audience explanation coverage",
      value: `${audiencePaths.length} paths`,
      threshold: `${stories.length * audienceModes.length} paths`,
      passed: audiencePaths.length === stories.length * audienceModes.length,
      evidence: "Student, educator, and professional paths resolve for every brief.",
    },
    {
      id: "change-detection",
      category: "Usefulness",
      label: "Follow-to-change demonstration",
      value: `${detectableChanges.length}/${stories.length} briefs`,
      threshold: "All briefs",
      passed: detectableChanges.length === stories.length,
      evidence: "Every story can demonstrate one explicitly simulated material change.",
    },
  ];
}

export function evaluateAccessibility(
  signals: AccessibilitySignals,
): EvaluationMetric[] {
  const checks = Object.values(signals);
  const passed = checks.filter(Boolean).length;
  return [
    {
      id: "semantic-accessibility",
      category: "Accessibility",
      label: "Structural accessibility checks",
      value: `${passed}/${checks.length} checks`,
      threshold: `${checks.length}/${checks.length}`,
      passed: passed === checks.length,
      evidence:
        "Checks cover skip navigation, main landmarks, input labels, live status regions, and visible pressed state.",
    },
  ];
}

export async function evaluateLatency(iterations = 200) {
  const samples: number[] = [];
  for (let index = 0; index < iterations; index += 1) {
    const story = stories[index % stories.length];
    const start = performance.now();
    await answerStoryQuestion("Summarize what is supported.", story);
    samples.push(performance.now() - start);
  }
  samples.sort((a, b) => a - b);
  const p95 = samples[Math.floor(samples.length * 0.95)];
  const thresholdMs = 5;
  return {
    id: "deterministic-latency",
    category: "Latency",
    label: "Deterministic answer p95",
    value: `${p95.toFixed(3)} ms`,
    threshold: `< ${thresholdMs} ms locally`,
    passed: p95 < thresholdMs,
    evidence: `${iterations} in-process, provider-free answer selections. Network and rendering time are excluded.`,
  } satisfies EvaluationMetric;
}

export function evaluateCost(providerConfigured: boolean): EvaluationMetric[] {
  return [
    {
      id: "default-model-cost",
      category: "Cost",
      label: "Default demo inference cost",
      value: providerConfigured ? "Provider configured" : "$0.00 / answer",
      threshold: "$0.00 without opt-in",
      passed: !providerConfigured,
      evidence:
        "The release configuration uses the deterministic engine and makes no model call unless provider environment variables are explicitly supplied.",
    },
  ];
}

export async function runReleaseEvaluation(
  accessibility: AccessibilitySignals,
  providerConfigured = false,
) {
  const metrics = [
    ...evaluateTrust(),
    ...evaluateUsefulness(),
    ...evaluateAccessibility(accessibility),
    await evaluateLatency(),
    ...evaluateCost(providerConfigured),
  ];
  return {
    evaluatedAt: new Date().toISOString(),
    passed: metrics.every((metric) => metric.passed),
    metrics,
  };
}
