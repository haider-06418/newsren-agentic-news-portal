import type { AudienceMode } from "./audience";
import type { Story, StoryUpdate } from "./newsroom";

export const followStorageKey = "newsren:follows:v1";
export const followChangedEvent = "newsren:follows-changed";

export type StoryFollow = {
  storySlug: string;
  question: string;
  audience: AudienceMode;
  createdAt: string;
  lastSeenVersion: number;
};

export type MaterialChange = {
  update: StoryUpdate;
  affectedClaims: Story["claims"];
};

export function isStoryFollow(value: unknown): value is StoryFollow {
  if (!value || typeof value !== "object") return false;
  const follow = value as Partial<StoryFollow>;
  return (
    typeof follow.storySlug === "string" &&
    typeof follow.question === "string" &&
    follow.question.trim().length > 0 &&
    ["student", "educator", "professional"].includes(follow.audience ?? "") &&
    typeof follow.createdAt === "string" &&
    Number.isFinite(Date.parse(follow.createdAt)) &&
    Number.isInteger(follow.lastSeenVersion) &&
    (follow.lastSeenVersion ?? -1) >= 0
  );
}

export function parseStoredFollows(raw: string | null) {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw) as unknown;
    if (!Array.isArray(value)) return [];
    return value.filter(isStoryFollow);
  } catch {
    return [];
  }
}

export function upsertFollow(
  follows: StoryFollow[],
  nextFollow: StoryFollow,
) {
  return [
    nextFollow,
    ...follows.filter((follow) => follow.storySlug !== nextFollow.storySlug),
  ];
}

export function detectMaterialChange(
  follow: StoryFollow,
  story: Story,
): MaterialChange | null {
  if (story.seededUpdate.version <= follow.lastSeenVersion) return null;
  return {
    update: story.seededUpdate,
    affectedClaims: story.claims.filter((claim) =>
      story.seededUpdate.affectedClaimIds.includes(claim.id),
    ),
  };
}

export function markFollowReviewed(follow: StoryFollow, story: Story) {
  return {
    ...follow,
    lastSeenVersion: story.seededUpdate.version,
  };
}
