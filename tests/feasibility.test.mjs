import assert from "node:assert/strict";
import test from "node:test";
import {
  attributeCoverage,
  buildTfidfVectors,
  cosineSimilarity,
  evaluatePairClassifier,
  keywordOverlap,
  tokenize,
} from "../lib/feasibility.ts";

const record = (id, title, summary, dataset = "federal-register") => ({
  id,
  dataset,
  title,
  summary,
  url: `https://example.com/${id}`,
  publishedAt: "2026-01-01",
  retrievedAt: "2026-11-10",
  sourceType: "Rule",
  publisher: "Public agency",
});

test("tokenization normalizes visa category names", () => {
  assert.deepEqual(tokenize("F-1 and J-1 student visas"), ["f1", "j1", "student", "visas"]);
});

test("TF-IDF gives related policy records a higher similarity", () => {
  const records = [
    record("a", "F-1 admission period rule", "A fixed admission period for academic students"),
    record("b", "Academic student visa guidance", "Guidance for F-1 admission and study"),
    record("c", "Monetary policy meeting", "Interest rate decision and economic forecast"),
  ];
  const vectors = buildTfidfVectors(records);
  const related = cosineSimilarity(vectors.get("a"), vectors.get("b"));
  const unrelated = cosineSimilarity(vectors.get("a"), vectors.get("c"));
  assert.ok(related > unrelated);
  assert.ok(keywordOverlap(records[0], records[1]) > keywordOverlap(records[0], records[2]));
});

test("classifier metrics and attribute coverage are reproducible", () => {
  const pairs = [
    { left: "a", right: "b", related: true, reason: "same topic" },
    { left: "a", right: "c", related: false, reason: "different topic" },
  ];
  const metrics = evaluatePairClassifier(pairs, (left, right) => left === "a" && right === "b");
  assert.equal(metrics.accuracy, 1);
  assert.equal(metrics.f1, 1);

  const coverage = attributeCoverage([record("a", "Title", "Summary")]);
  assert.equal(coverage.requiredFieldCoverage, 1);
  assert.equal(coverage.publicationDateCoverage, 1);
});
