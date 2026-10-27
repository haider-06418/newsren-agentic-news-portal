import assert from "node:assert/strict";
import test from "node:test";
import {
  answerStoryQuestion,
  selectEvidenceDeterministically,
  validateAgentAnswer,
  validateEvidenceSelection,
} from "../lib/agent.ts";
import { getStory, stories } from "../lib/newsroom.ts";

const studentStory = getStory("international-student-policy");
assert.ok(studentStory);

test("deterministic answers only reproduce claims from the active story", async () => {
  for (const story of stories) {
    const answer = await answerStoryQuestion(
      "Summarize what is supported.",
      story,
    );
    assert.equal(answer.engine, "deterministic");
    assert.ok(answer.points.length > 0);
    assert.ok(answer.points.every((point) => point.label === "Supported"));
    assert.ok(validateAgentAnswer(story, answer));
    for (const point of answer.points) {
      const claim = story.claims.find((item) => item.id === point.claimId);
      assert.equal(point.text, claim?.text);
      assert.deepEqual(point.sourceIds, claim?.sourceIds);
    }
  }
});

test("the assistant abstains from personal and current-policy conclusions", async () => {
  for (const question of [
    "Does this affect my status?",
    "What changed today?",
    "Am I eligible?",
  ]) {
    const answer = await answerStoryQuestion(question, studentStory);
    assert.equal(answer.status, "abstained");
    assert.ok(answer.missingEvidence);
    assert.ok(validateAgentAnswer(studentStory, answer));
  }
});

test("out-of-scope questions produce an evidence boundary, not invented facts", async () => {
  const answer = await answerStoryQuestion(
    "Who won the baseball game?",
    studentStory,
  );
  assert.equal(answer.status, "abstained");
  assert.equal(answer.points.length, 0);
  assert.deepEqual(answer.citedSourceIds, []);
});

test("provider selections are bounded to real claim IDs", async () => {
  assert.equal(
    validateEvidenceSelection(studentStory, {
      claimIds: ["c1", "c2"],
      abstain: false,
    }),
    true,
  );
  assert.equal(
    validateEvidenceSelection(studentStory, {
      claimIds: ["c1", "invented"],
      abstain: false,
    }),
    false,
  );

  const maliciousSelector = {
    name: "invalid-test-provider",
    async select() {
      return { claimIds: ["invented"], abstain: false };
    },
  };
  const answer = await answerStoryQuestion(
    "Summarize what is supported.",
    studentStory,
    maliciousSelector,
  );
  assert.equal(answer.engine, "deterministic");
  assert.ok(validateAgentAnswer(studentStory, answer));
});

test("answer validation rejects altered claim language and false citations", async () => {
  const answer = await answerStoryQuestion(
    "What evidence supports this?",
    studentStory,
  );
  const altered = structuredClone(answer);
  altered.points[0].text = "An unsupported material claim.";
  assert.equal(validateAgentAnswer(studentStory, altered), false);

  const falseCitation = structuredClone(answer);
  falseCitation.points[0].sourceIds = ["invented-source"];
  assert.equal(validateAgentAnswer(studentStory, falseCitation), false);
});

test("question classification stays deterministic", () => {
  assert.deepEqual(
    selectEvidenceDeterministically(
      "What remains uncertain?",
      studentStory,
    ).claimIds,
    ["c4"],
  );
});
