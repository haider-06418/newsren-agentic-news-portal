"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { Bell, BookmarkCheck, MoveRight } from "lucide-react";
import type { AudienceMode } from "@/lib/audience";
import { detectMaterialChange } from "@/lib/follows";
import type { Story } from "@/lib/newsroom";
import { useFollows } from "./use-follows";

export function FollowStoryCard({ story }: { story: Story }) {
  const { follows, save } = useFollows();
  const existing = follows.find((follow) => follow.storySlug === story.slug);
  const [questionDraft, setQuestionDraft] = useState<string | null>(null);
  const [audienceDraft, setAudienceDraft] = useState<AudienceMode | null>(null);
  const [saved, setSaved] = useState(false);
  const question = questionDraft ?? existing?.question ?? story.questions[0];
  const audience = audienceDraft ?? existing?.audience ?? "student";

  const materialChange = existing
    ? detectMaterialChange(existing, story)
    : null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) return;
    save(story, question, audience);
    setSaved(true);
  }

  return (
    <section className="follow-card" aria-labelledby="follow-card-title">
      <div className="follow-card-heading">
        <Bell size={17} />
        <div>
          <p className="eyebrow">FOLLOW THE QUESTION</p>
          <h2 id="follow-card-title">Keep this on your desk.</h2>
        </div>
      </div>
      {existing && saved ? (
        <div className="follow-saved" role="status">
          <BookmarkCheck size={19} />
          <strong>Saved on this browser.</strong>
          <p>No account or background service is running.</p>
        </div>
      ) : (
        <form onSubmit={submit}>
          <label htmlFor={`follow-question-${story.slug}`}>Question to follow</label>
          <textarea
            id={`follow-question-${story.slug}`}
            value={question}
            onChange={(event) =>
              setQuestionDraft(event.target.value.slice(0, 240))
            }
            rows={3}
          />
          <label htmlFor={`follow-audience-${story.slug}`}>Reading mode</label>
          <select
            id={`follow-audience-${story.slug}`}
            value={audience}
            onChange={(event) =>
              setAudienceDraft(event.target.value as AudienceMode)
            }
          >
            <option value="student">Student</option>
            <option value="educator">Educator</option>
            <option value="professional">Professional</option>
          </select>
          <button type="submit" className="button button-dark">
            {existing ? "Update follow" : "Follow locally"}
          </button>
        </form>
      )}
      {existing && (
        <div className="follow-card-status">
          <span className={materialChange ? "change-ready" : "change-reviewed"}>
            {materialChange ? "1 seeded change ready" : "Demo update reviewed"}
          </span>
          <Link href="/follows">
            Your follows <MoveRight size={14} />
          </Link>
        </div>
      )}
    </section>
  );
}
