import { readFile } from "node:fs/promises";
import { runReleaseEvaluation } from "../lib/evaluation.ts";

const root = new URL("../", import.meta.url);
const [shell, storyPage, askNewsren, audience, followCard, followsPage] =
  await Promise.all(
    [
      "components/newsren/shell.tsx",
      "app/stories/[slug]/page.tsx",
      "components/newsren/ask-newsren.tsx",
      "components/newsren/audience-explainer.tsx",
      "components/newsren/follow-story-card.tsx",
      "app/follows/page.tsx",
    ].map((path) => readFile(new URL(path, root), "utf8")),
  );

const report = await runReleaseEvaluation(
  {
    skipLink: shell.includes('className="skip-link"'),
    mainLandmarks:
      storyPage.includes('<main id="main"') &&
      followsPage.includes('<main id="main"'),
    labeledInputs:
      askNewsren.includes('<label className="sr-only"') &&
      followCard.includes("<label"),
    liveRegions:
      askNewsren.includes('aria-live="polite"') &&
      followCard.includes('role="status"'),
    pressedState: audience.includes("aria-pressed={mode === audienceMode}"),
  },
  Boolean(
    process.env.NEWSREN_PROVIDER_URL || process.env.NEWSREN_PROVIDER_MODEL,
  ),
);

console.log("Newsren release evaluation");
for (const metric of report.metrics) {
  const state = metric.passed ? "PASS" : "FAIL";
  console.log(
    `${state} | ${metric.category} | ${metric.label} | ${metric.value} | ${metric.threshold}`,
  );
}
console.log(`Overall: ${report.passed ? "PASS" : "FAIL"}`);

if (!report.passed) process.exitCode = 1;
