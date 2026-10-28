"use client";

import Link from "next/link";
import { Bell, Check, CircleHelp, MoveRight, Trash2 } from "lucide-react";
import { detectMaterialChange } from "@/lib/follows";
import { formatSourceDate, getStory } from "@/lib/newsroom";
import { useFollows } from "./use-follows";

export function FollowDashboard() {
  const { follows, remove, review } = useFollows();

  if (follows.length === 0)
    return (
      <div className="follows-empty">
        <Bell size={30} />
        <h2>Your follow desk is empty.</h2>
        <p>Open an evidence brief and save one question to follow.</p>
        <Link href="/#stories" className="button button-dark">
          Explore today&apos;s briefing <MoveRight size={16} />
        </Link>
      </div>
    );

  return (
    <div className="follow-list">
      {follows.map((follow) => {
        const story = getStory(follow.storySlug);
        if (!story) return null;
        const change = detectMaterialChange(follow, story);
        const previewSummary = change?.update.summary.replace(
          /^Demo event only: imagine that /,
          "Preview scenario: ",
        );
        return (
          <article className="follow-item" key={follow.storySlug}>
            <div className="follow-item-topline">
              <span>{story.desk}</span>
              <span>{follow.audience} mode</span>
            </div>
            <div className="follow-item-heading">
              <div>
                <p className="eyebrow">YOUR QUESTION</p>
                <h2>{follow.question}</h2>
                <Link href={`/stories/${story.slug}`}>
                  Open evidence brief <MoveRight size={14} />
                </Link>
              </div>
              <button
                onClick={() => remove(story.slug)}
                className="remove-follow"
                aria-label={`Remove follow for ${story.title}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
            {change ? (
              <div className="material-change">
                <div className="change-heading">
                  <span><CircleHelp size={13} /> UPDATE PREVIEW</span>
                  <time dateTime={change.update.detectedAt}>
                    {formatSourceDate(change.update.detectedAt)}
                  </time>
                </div>
                <h3>{change.update.title}</h3>
                <p>{previewSummary}</p>
                <div className="materiality-note">
                  <strong>Why Newsren flags it as material</strong>
                  <p>{change.update.materiality}</p>
                </div>
                <div className="affected-claims">
                  <span>Affected evidence questions</span>
                  {change.affectedClaims.map((claim) => (
                    <p key={claim.id}>{claim.text}</p>
                  ))}
                </div>
                <button onClick={() => review(story)} className="button button-dark">
                  Mark update reviewed <Check size={15} />
                </button>
              </div>
            ) : (
              <div className="follow-current">
                <Check size={16} />
                <div>
                  <strong>You&apos;re caught up.</strong>
                  <p>There are no unreviewed preview updates for this question.</p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
