import Link from "next/link";
import { ArrowLeft, Check, MoveRight } from "lucide-react";
import { Footer, Header } from "@/components/newsren/shell";

export const metadata = {
  title: "Release evaluation | The Newsren",
  description: "The Newsren prototype release scorecard and limitations.",
};

const checks = [
  {
    name: "Trust",
    measure: "100% citation coverage",
    detail:
      "Every supported claim retains source IDs; simulated updates are labeled before their text.",
  },
  {
    name: "Usefulness",
    measure: "4 complete story loops",
    detail:
      "Each brief supports discovery, evidence inspection, three audience modes, a bounded assistant, and a follow path.",
  },
  {
    name: "Accessibility",
    measure: "5/5 structural checks",
    detail:
      "Skip navigation, landmarks, input labels, status announcements, and pressed states are verified in the release harness.",
  },
  {
    name: "Latency",
    measure: "p95 under 5 ms",
    detail:
      "The threshold covers the deterministic in-process evidence selector, excluding page rendering and network time.",
  },
  {
    name: "Cost",
    measure: "$0.00 default inference",
    detail:
      "The public prototype does not call a model unless an operator explicitly configures an optional provider.",
  },
];

export default function EvaluationPage() {
  return (
    <>
      <Header />
      <main id="main" className="evaluation-page">
        <Link href="/about" className="back-link">
          <ArrowLeft size={14} /> Our approach
        </Link>
        <div className="evaluation-heading">
          <p className="eyebrow">WEEK 01 RELEASE GATE</p>
          <h1>Useful is not enough. Show the evidence.</h1>
          <p>
            This scorecard makes the prototype&apos;s release criteria visible. It
            is a bounded course evaluation—not a claim of production
            certification or continuous monitoring.
          </p>
        </div>
        <div className="evaluation-grid">
          {checks.map((check, index) => (
            <article key={check.name}>
              <div className="evaluation-card-topline">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span><Check size={13} /> Release check passed</span>
              </div>
              <h2>{check.name}</h2>
              <strong>{check.measure}</strong>
              <p>{check.detail}</p>
            </article>
          ))}
        </div>
        <section className="evaluation-boundary">
          <div>
            <p className="eyebrow">WHAT THIS DOES NOT PROVE</p>
            <h2>A prototype score is a starting point.</h2>
          </div>
          <p>
            The checks do not replace independent accessibility testing,
            newsroom review, security assessment, live-source monitoring, or
            evaluation with representative readers. They confirm the Week 1
            implementation contract and make its limits inspectable.
          </p>
          <Link href="/stories/international-student-policy" className="button button-dark">
            Inspect the flagship brief <MoveRight size={16} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
