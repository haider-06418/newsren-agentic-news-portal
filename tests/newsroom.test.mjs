import assert from "node:assert/strict";
import test from "node:test";
import { desks, deskSlug, getStory, stories } from "../lib/newsroom.ts";

test("every desk has a reachable story and a unique route", () => {
  assert.equal(
    new Set(stories.map((story) => story.slug)).size,
    stories.length,
  );
  assert.equal(new Set(desks.map(deskSlug)).size, desks.length);
  for (const desk of desks)
    assert.ok(stories.some((story) => story.desk === desk));
  for (const story of stories) assert.equal(getStory(story.slug), story);
  assert.equal(getStory("missing-story"), undefined);
});

test("every supported claim has traceable evidence within its story bundle", () => {
  for (const story of stories) {
    const sourceIds = new Set(story.sources.map((source) => source.id));
    assert.equal(sourceIds.size, story.sources.length);
    assert.equal(
      new Set(story.claims.map((claim) => claim.id)).size,
      story.claims.length,
    );
    for (const claim of story.claims) {
      if (claim.kind === "Supported")
        assert.ok(
          claim.sourceIds.length > 0,
          `${story.slug}: ${claim.id} lacks evidence`,
        );
      for (const id of claim.sourceIds)
        assert.ok(sourceIds.has(id), `${story.slug}: unknown source ${id}`);
    }
  }
});

test("source provenance is explicit and valid, without inventing publication dates", () => {
  for (const story of stories) {
    assert.equal(story.reviewStatus, "Needs editorial review");
    for (const source of story.sources) {
      assert.equal(new URL(source.url).protocol, "https:");
      assert.ok(source.publisher && source.title && source.type && source.note);
      assert.match(source.retrievedAt, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(Number.isFinite(Date.parse(source.retrievedAt)));
      if (source.publishedAt !== null) {
        assert.ok(Number.isFinite(Date.parse(source.publishedAt)));
        assert.ok(source.publishedAt <= source.retrievedAt);
      }
    }
    for (const event of story.trail)
      assert.ok(Number.isFinite(Date.parse(event.date)));
  }
});

test("seeded updates are explicitly simulated and reference real story claims", () => {
  for (const story of stories) {
    assert.ok(story.seededUpdate.version > story.version);
    assert.equal(story.seededUpdate.label, "Seeded simulation");
    assert.match(story.seededUpdate.summary, /^Demo event only:/);
    assert.ok(Number.isFinite(Date.parse(story.seededUpdate.detectedAt)));
    assert.ok(story.seededUpdate.affectedClaimIds.length > 0);
    const claimIds = new Set(story.claims.map((claim) => claim.id));
    for (const id of story.seededUpdate.affectedClaimIds)
      assert.ok(claimIds.has(id), `${story.slug}: unknown affected claim ${id}`);
  }
});
