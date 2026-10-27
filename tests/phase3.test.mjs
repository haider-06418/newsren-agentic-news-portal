import assert from "node:assert/strict";
import test from "node:test";
import {
  audienceModes,
  createAudienceExplanation,
} from "../lib/audience.ts";
import {
  detectMaterialChange,
  markFollowReviewed,
  parseStoredFollows,
  upsertFollow,
} from "../lib/follows.ts";
import { stories } from "../lib/newsroom.ts";

const sampleFollow = {
  storySlug: stories[0].slug,
  question: stories[0].questions[0],
  audience: "student",
  createdAt: "2026-10-27T10:00:00.000Z",
  lastSeenVersion: 1,
};

test("audience modes preserve the active story's exact claim records", () => {
  for (const story of stories) {
    for (const mode of audienceModes) {
      const explanation = createAudienceExplanation(story, mode);
      assert.equal(explanation.mode, mode);
      assert.ok(
        story.claims.some(
          (claim) =>
            claim.id === explanation.focusClaim.id &&
            claim.text === explanation.focusClaim.text,
        ),
      );
      assert.ok(story.questions.includes(explanation.nextStep));
    }
  }
});

test("saved follows parse defensively and ignore corrupted records", () => {
  assert.deepEqual(parseStoredFollows(null), []);
  assert.deepEqual(parseStoredFollows("not-json"), []);
  assert.deepEqual(
    parseStoredFollows(
      JSON.stringify([
        sampleFollow,
        { ...sampleFollow, storySlug: "bad-mode", audience: "expert" },
        { ...sampleFollow, storySlug: "bad-date", createdAt: "yesterday" },
      ]),
    ),
    [sampleFollow],
  );
});

test("one bounded question is stored per story", () => {
  const updated = {
    ...sampleFollow,
    question: "Where is the original announcement?",
    audience: "educator",
  };
  const other = {
    ...sampleFollow,
    storySlug: stories[1].slug,
  };
  const result = upsertFollow([sampleFollow, other], updated);
  assert.equal(result.length, 2);
  assert.equal(result[0].question, updated.question);
  assert.equal(
    result.filter((follow) => follow.storySlug === sampleFollow.storySlug)
      .length,
    1,
  );
});

test("seeded material changes are detected once and can be marked reviewed", () => {
  const story = stories[0];
  const change = detectMaterialChange(sampleFollow, story);
  assert.ok(change);
  assert.equal(change.update.label, "Seeded simulation");
  assert.ok(change.affectedClaims.length > 0);

  const reviewed = markFollowReviewed(sampleFollow, story);
  assert.equal(reviewed.lastSeenVersion, story.seededUpdate.version);
  assert.equal(detectMaterialChange(reviewed, story), null);
});
