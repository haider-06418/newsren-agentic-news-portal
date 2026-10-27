"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowUp,
  Bot,
  Check,
  CircleHelp,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import type { AgentAnswer } from "@/lib/agent";
import type { Story } from "@/lib/newsroom";

export function AskNewsren({ story }: { story: Story }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AgentAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestions = [
    "Summarize what is supported.",
    story.questions[0],
    "What remains uncertain?",
  ].filter(Boolean);

  async function ask(value: string) {
    const clean = value.trim();
    if (!clean || loading) return;
    setQuestion(clean);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: story.slug, question: clean }),
      });
      const payload = (await response.json()) as AgentAnswer | { error: string };
      if (!response.ok || "error" in payload)
        throw new Error("error" in payload ? payload.error : "Unable to answer.");
      setAnswer(payload);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The story assistant is unavailable.",
      );
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(question);
  }

  function reset() {
    setAnswer(null);
    setQuestion("");
    setError(null);
  }

  return (
    <section className="ask-newsren" aria-labelledby="ask-newsren-title">
      <div className="ask-title-row">
        <span className="ask-icon">
          <Bot size={17} />
        </span>
        <div>
          <p className="eyebrow">STORY-SCOPED ASSISTANT</p>
          <h2 id="ask-newsren-title">Ask Newsren</h2>
        </div>
        {answer && (
          <button className="ask-reset" onClick={reset} aria-label="Start over">
            <RotateCcw size={14} />
          </button>
        )}
      </div>
      <p className="ask-disclosure">
        Answers only from this brief. Claims stay linked to its source ledger.
      </p>

      {!answer ? (
        <div className="ask-starters">
          <p>Try a bounded question</p>
          {suggestions.map((suggestion) => (
            <button key={suggestion} onClick={() => void ask(suggestion)}>
              {suggestion}
              <ArrowUp size={13} />
            </button>
          ))}
        </div>
      ) : (
        <div className="ask-answer" aria-live="polite">
          <p className="ask-question">“{answer.question}”</p>
          <div className={`answer-status answer-status-${answer.status}`}>
            {answer.status === "grounded" ? (
              <Check size={13} />
            ) : (
              <CircleHelp size={13} />
            )}
            {answer.status === "grounded"
              ? "Grounded answer"
              : answer.status === "mixed"
                ? "Evidence + interpretation"
                : "Evidence boundary"}
          </div>
          <p className="answer-intro">{answer.intro}</p>
          {answer.points.map((point) => (
            <div className="answer-point" key={point.claimId}>
              <span>{point.label}</span>
              <p>{point.text}</p>
              {point.sourceIds.length > 0 && (
                <div className="answer-citations">
                  {point.sourceIds.map((sourceId) => (
                    <a key={sourceId} href={`#source-${sourceId}`}>
                      [
                      {story.sources.findIndex(
                        (source) => source.id === sourceId,
                      ) + 1}
                      ]
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {answer.missingEvidence && (
            <div className="answer-gap">
              <strong>What is missing</strong>
              <p>{answer.missingEvidence}</p>
            </div>
          )}
          <div className="answer-engine">
            <ShieldCheck size={13} />
            {answer.engine === "deterministic"
              ? "Validated demo response"
              : "Provider selection · locally validated"}
          </div>
        </div>
      )}

      {error && (
        <p className="ask-error" role="alert">
          {error}
        </p>
      )}
      <form className="ask-form" onSubmit={submit}>
        <label className="sr-only" htmlFor={`ask-${story.slug}`}>
          Ask a question about this story
        </label>
        <textarea
          id={`ask-${story.slug}`}
          value={question}
          onChange={(event) => setQuestion(event.target.value.slice(0, 500))}
          placeholder="Ask about the evidence…"
          rows={2}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          aria-label="Ask Newsren"
        >
          {loading ? <span className="ask-spinner" /> : <ArrowUp size={16} />}
        </button>
      </form>
      <p className="ask-footnote">
        Prototype assistant · not legal, financial, or individual advice
      </p>
    </section>
  );
}
