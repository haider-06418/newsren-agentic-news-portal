"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { AudienceMode } from "@/lib/audience";
import {
  followChangedEvent,
  followStorageKey,
  markFollowReviewed,
  parseStoredFollows,
  upsertFollow,
  type StoryFollow,
} from "@/lib/follows";
import type { Story } from "@/lib/newsroom";

function persistFollows(follows: StoryFollow[]) {
  window.localStorage.setItem(followStorageKey, JSON.stringify(follows));
  window.dispatchEvent(new Event(followChangedEvent));
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(followChangedEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(followChangedEvent, callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(followStorageKey) ?? "[]";
}

export function useFollows() {
  const rawFollows = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const follows = useMemo(() => parseStoredFollows(rawFollows), [rawFollows]);

  function save(
    story: Story,
    question: string,
    audience: AudienceMode,
  ) {
    const existing = follows.find((follow) => follow.storySlug === story.slug);
    const nextFollow: StoryFollow = {
      storySlug: story.slug,
      question: question.trim(),
      audience,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      lastSeenVersion: existing?.lastSeenVersion ?? story.version,
    };
    const next = upsertFollow(follows, nextFollow);
    persistFollows(next);
    return nextFollow;
  }

  function remove(storySlug: string) {
    const next = follows.filter((follow) => follow.storySlug !== storySlug);
    persistFollows(next);
  }

  function review(story: Story) {
    const next = follows.map((follow) =>
      follow.storySlug === story.slug
        ? markFollowReviewed(follow, story)
        : follow,
    );
    persistFollows(next);
  }

  return { follows, save, remove, review };
}
