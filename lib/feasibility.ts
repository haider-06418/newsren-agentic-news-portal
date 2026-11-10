export type FeasibilityRecord = {
  id: string;
  dataset: "federal-register" | "authoritative-guidance";
  title: string;
  summary: string;
  url: string;
  publishedAt: string | null;
  retrievedAt: string;
  sourceType: string;
  publisher: string;
};

export type LabeledPair = {
  left: string;
  right: string;
  related: boolean;
  reason: string;
};

export const feasibilityStopWords = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in",
  "is", "it", "of", "on", "or", "that", "the", "their", "this", "to",
  "u", "s", "with",
]);

export function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/f-1/g, "f1")
    .replace(/j-1/g, "j1")
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !feasibilityStopWords.has(token));
}

function recordText(record: FeasibilityRecord) {
  return `${record.title} ${record.summary} ${record.publisher} ${record.sourceType}`;
}

export function keywordOverlap(left: FeasibilityRecord, right: FeasibilityRecord) {
  const leftTokens = new Set(tokenize(recordText(left)));
  const rightTokens = new Set(tokenize(recordText(right)));
  return [...leftTokens].filter((token) => rightTokens.has(token)).length;
}

export function buildTfidfVectors(records: FeasibilityRecord[]) {
  const tokenized = records.map((record) => tokenize(recordText(record)));
  const documentFrequency = new Map<string, number>();
  for (const tokens of tokenized) {
    for (const token of new Set(tokens)) {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
    }
  }

  return new Map(
    records.map((record, index) => {
      const counts = new Map<string, number>();
      for (const token of tokenized[index]) {
        counts.set(token, (counts.get(token) ?? 0) + 1);
      }
      const total = Math.max(tokenized[index].length, 1);
      const vector = new Map<string, number>();
      for (const [token, count] of counts) {
        const tf = count / total;
        const idf = Math.log((records.length + 1) / ((documentFrequency.get(token) ?? 0) + 1)) + 1;
        vector.set(token, tf * idf);
      }
      return [record.id, vector] as const;
    }),
  );
}

export function cosineSimilarity(
  left: Map<string, number>,
  right: Map<string, number>,
) {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (const [token, value] of left) {
    dot += value * (right.get(token) ?? 0);
    leftMagnitude += value * value;
  }
  for (const value of right.values()) rightMagnitude += value * value;
  if (leftMagnitude === 0 || rightMagnitude === 0) return 0;
  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

export function evaluatePairClassifier(
  pairs: LabeledPair[],
  predict: (left: string, right: string) => boolean,
) {
  let truePositive = 0;
  let falsePositive = 0;
  let trueNegative = 0;
  let falseNegative = 0;
  for (const pair of pairs) {
    const predicted = predict(pair.left, pair.right);
    if (predicted && pair.related) truePositive += 1;
    else if (predicted && !pair.related) falsePositive += 1;
    else if (!predicted && !pair.related) trueNegative += 1;
    else falseNegative += 1;
  }
  const precision = truePositive / Math.max(truePositive + falsePositive, 1);
  const recall = truePositive / Math.max(truePositive + falseNegative, 1);
  const accuracy = (truePositive + trueNegative) / Math.max(pairs.length, 1);
  const f1 = (2 * precision * recall) / Math.max(precision + recall, 1e-9);
  return { truePositive, falsePositive, trueNegative, falseNegative, precision, recall, accuracy, f1 };
}

export function attributeCoverage(records: FeasibilityRecord[]) {
  const required = ["id", "title", "summary", "url", "retrievedAt", "sourceType", "publisher"] as const;
  const populated = records.reduce(
    (total, record) => total + required.filter((key) => Boolean(record[key])).length,
    0,
  );
  const publicationDates = records.filter((record) => Boolean(record.publishedAt)).length;
  return {
    requiredFieldCoverage: populated / (records.length * required.length),
    publicationDateCoverage: publicationDates / records.length,
  };
}
