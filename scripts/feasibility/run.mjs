import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  attributeCoverage,
  buildTfidfVectors,
  cosineSimilarity,
  evaluatePairClassifier,
  keywordOverlap,
} from "../../lib/feasibility.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), "utf8"));

const federal = await readJson("data/feasibility/federal-register-sample.json");
const guidance = await readJson("data/feasibility/authoritative-guidance.json");
const pairs = await readJson("data/feasibility/labeled-document-pairs.json");

const records = [
  ...federal.records.map((record) => ({
    id: record.id,
    dataset: "federal-register",
    title: record.title,
    summary: record.abstract,
    url: record.url,
    publishedAt: record.publishedAt,
    retrievedAt: federal.retrievedAt,
    sourceType: record.documentType,
    publisher: record.agencies.join(", "),
  })),
  ...guidance.records.map((record) => ({
    id: record.id,
    dataset: "authoritative-guidance",
    title: record.title,
    summary: record.summary,
    url: record.url,
    publishedAt: record.publishedAt,
    retrievedAt: guidance.retrievedAt,
    sourceType: record.sourceType,
    publisher: record.publisher,
  })),
];

const recordById = new Map(records.map((record) => [record.id, record]));
const vectors = buildTfidfVectors(records);
const baselineThreshold = 4;
const tfidfThreshold = 0.1;

const baseline = evaluatePairClassifier(pairs, (leftId, rightId) => {
  const left = recordById.get(leftId);
  const right = recordById.get(rightId);
  return Boolean(left && right && keywordOverlap(left, right) >= baselineThreshold);
});

const tfidf = evaluatePairClassifier(pairs, (leftId, rightId) => {
  const left = vectors.get(leftId);
  const right = vectors.get(rightId);
  return Boolean(left && right && cosineSimilarity(left, right) >= tfidfThreshold);
});

const crossDatasetPairs = pairs.filter((pair) => {
  const left = recordById.get(pair.left);
  const right = recordById.get(pair.right);
  return left && right && left.dataset !== right.dataset;
});

const result = {
  assessmentDate: "2026-11-10",
  hypothesis: "TF-IDF similarity will improve cross-dataset policy-document matching over raw keyword overlap on a small team-labeled feasibility set.",
  datasets: [
    { name: federal.dataset, access: federal.access, records: federal.records.length },
    { name: guidance.dataset, access: guidance.access, records: guidance.records.length },
    { name: "GDELT DOC 2.0", access: "public-api-rate-limited-during-assessment", records: 0 },
  ],
  sample: {
    records: records.length,
    labeledPairs: pairs.length,
    crossDatasetPairs: crossDatasetPairs.length,
    coverage: attributeCoverage(records),
  },
  algorithms: {
    keywordOverlap: { threshold: baselineThreshold, ...baseline },
    tfidfCosine: { threshold: tfidfThreshold, ...tfidf },
  },
  conclusion:
    tfidf.f1 > baseline.f1
      ? "The sample supports the matching hypothesis, but its size is too small for a general performance claim."
      : "The sample does not show a TF-IDF advantage; the matching hypothesis must be revised before implementation.",
  risks: [
    "The labeled sample is intentionally small and team-authored.",
    "Guidance pages without publication dates weaken temporal reasoning.",
    "Topical similarity does not prove that two documents describe the same policy event.",
    "The GDELT API returned HTTP 429 during the access test, so media-corpus ingestion requires caching, backoff, or another source.",
    "All generated claims still require source validation and human review.",
  ],
};

const outputDir = path.join(root, "docs/week-2-3/generated");
await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "feasibility-results.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
