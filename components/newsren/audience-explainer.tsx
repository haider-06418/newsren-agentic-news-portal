"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, BriefcaseBusiness, GraduationCap } from "lucide-react";
import {
  audienceModes,
  createAudienceExplanation,
  type AudienceMode,
} from "@/lib/audience";
import type { Story } from "@/lib/newsroom";

const icons = {
  student: GraduationCap,
  educator: BookOpen,
  professional: BriefcaseBusiness,
};

export function AudienceExplainer({ story }: { story: Story }) {
  const [mode, setMode] = useState<AudienceMode>("student");
  const explanation = createAudienceExplanation(story, mode);
  const sourceNumber = (sourceId: string) =>
    story.sources.findIndex((source) => source.id === sourceId) + 1;

  return (
    <section id="learning-mode" className="audience-explainer" aria-labelledby="learning-mode-title">
      <div className="audience-heading">
        <div>
          <p className="eyebrow">LEARN YOUR WAY</p>
          <h2 id="learning-mode-title">Choose the lens you need.</h2>
        </div>
        <p>Same evidence. A different path through it.</p>
      </div>
      <div className="audience-tabs" role="group" aria-label="Explanation mode">
        {audienceModes.map((audienceMode) => {
          const Icon = icons[audienceMode];
          return (
            <button
              key={audienceMode}
              onClick={() => setMode(audienceMode)}
              aria-pressed={mode === audienceMode}
            >
              <Icon size={14} />
              {audienceMode[0].toUpperCase() + audienceMode.slice(1)}
            </button>
          );
        })}
      </div>
      <div className="audience-output" aria-live="polite">
        <div className="audience-mode-mark">
          <span>{explanation.label}</span>
          <strong>MODE</strong>
        </div>
        <div className="audience-copy">
          <h3>{explanation.title}</h3>
          <p>{explanation.framing}</p>
          <div className="audience-claim">
            <span>{explanation.focusClaim.kind}</span>
            <p>{explanation.focusClaim.text}</p>
            {explanation.focusClaim.sourceIds.map((sourceId) => (
              <a key={sourceId} href={`#source-${sourceId}`}>
                Source {sourceNumber(sourceId)}
              </a>
            ))}
            {explanation.focusClaim.sourceIds.length === 0 && (
              <small>Not resolved by this source bundle</small>
            )}
          </div>
          <div className="audience-next-step">
            <ArrowRight size={15} />
            <p>
              <strong>Next question</strong>
              {explanation.nextStep}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
