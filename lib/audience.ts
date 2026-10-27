import type { Claim, Story } from "./newsroom";

export const audienceModes = ["student", "educator", "professional"] as const;
export type AudienceMode = (typeof audienceModes)[number];

export type AudienceExplanation = {
  mode: AudienceMode;
  label: string;
  title: string;
  framing: string;
  focusClaim: Claim;
  nextStep: string;
};

const modeCopy: Record<
  AudienceMode,
  Pick<AudienceExplanation, "label" | "title" | "framing">
> = {
  student: {
    label: "Student",
    title: "Start with the plain-language fact.",
    framing:
      "Begin with one source-backed statement, then keep the unanswered part separate before applying the story to your own situation.",
  },
  educator: {
    label: "Educator",
    title: "Teach the evidence boundary.",
    framing:
      "Use the labeled claim to distinguish what the source states from the editorial lens used to interpret it.",
  },
  professional: {
    label: "Professional",
    title: "Carry the uncertainty into the decision.",
    framing:
      "Treat the unresolved claim as a constraint: record what the bundle cannot establish before acting on a headline.",
  },
};

export function createAudienceExplanation(
  story: Story,
  mode: AudienceMode,
): AudienceExplanation {
  const preferredKind =
    mode === "student"
      ? "Supported"
      : mode === "educator"
        ? "Interpretation"
        : "Unresolved";
  const focusClaim =
    story.claims.find((claim) => claim.kind === preferredKind) ??
    story.claims[0];
  const questionIndex = mode === "student" ? 0 : mode === "educator" ? 1 : 2;

  return {
    mode,
    ...modeCopy[mode],
    focusClaim,
    nextStep: story.questions[questionIndex] ?? story.questions[0],
  };
}
