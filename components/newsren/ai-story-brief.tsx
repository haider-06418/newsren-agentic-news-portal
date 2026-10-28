import { BookOpen, Check, CircleHelp, Sparkles } from "lucide-react";
import type { Story } from "@/lib/newsroom";

const briefKinds = ["Supported", "Interpretation", "Unresolved"] as const;

const labels = {
  Supported: "What is supported",
  Interpretation: "How to read it",
  Unresolved: "What remains open",
};

export function AIStoryBrief({ story }: { story: Story }) {
  return (
    <section id="ai-brief" className="ai-brief" aria-labelledby="ai-brief-title">
      <div className="ai-brief-heading">
        <div>
          <p className="eyebrow">
            <Sparkles size={12} /> SOURCE-LINKED SUMMARY
          </p>
          <h2 id="ai-brief-title">The evidence in one glance.</h2>
        </div>
        <span>Citations attached to every claim</span>
      </div>
      <p className="ai-brief-intro">
        The strongest supported claim, the interpretation around it, and the
        most important open question—kept connected to the source ledger.
      </p>
      <div className="ai-brief-grid">
        {briefKinds.map((kind) => {
          const claim = story.claims.find((item) => item.kind === kind);
          const Icon =
            kind === "Supported"
              ? Check
              : kind === "Interpretation"
                ? BookOpen
                : CircleHelp;
          return (
            <div className={`ai-brief-card ai-brief-${kind.toLowerCase()}`} key={kind}>
              <span>
                <Icon size={14} /> {labels[kind]}
              </span>
              <p>
                {claim?.text ??
                  (kind === "Unresolved"
                    ? "No unresolved claim is recorded in this bundle."
                    : "No claim is recorded for this category.")}
              </p>
              {claim?.sourceIds.length ? (
                <div className="ai-brief-citations">
                  {claim.sourceIds.map((sourceId) => (
                    <a key={sourceId} href={`#source-${sourceId}`}>
                      Source {story.sources.findIndex((source) => source.id === sourceId) + 1}
                    </a>
                  ))}
                </div>
              ) : (
                <small>Evidence gap explicitly recorded</small>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
