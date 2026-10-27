"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, Search, X } from "lucide-react";
import { desks, deskSlug, stories } from "@/lib/newsroom";
import { Illustration } from "./illustration";
export function StoryExplorer() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = searchParams.get("desk");
  const active = desks.some((desk) => deskSlug(desk) === requested)
    ? requested!
    : "all";
  const filtered = stories.filter(
    (s) =>
      (active === "all" || deskSlug(s.desk) === active) &&
      `${s.title} ${s.description} ${s.desk}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  function selectDesk(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") params.delete("desk");
    else params.set("desk", slug);
    const queryString = params.toString();
    router.replace(`${queryString ? `/?${queryString}` : "/"}#stories`, {
      scroll: false,
    });
  }
  return (
    <section id="stories" className="stories-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE READING ROOM</p>
          <h2>
            Follow your curiosity<span>.</span>
          </h2>
        </div>
        <span className="edition-count">04 BRIEFS / 04 DESKS</span>
      </div>
      <div className="explorer-tools">
        <div className="filter-tabs" role="group" aria-label="Filter by desk">
          <button
            onClick={() => selectDesk("all")}
            aria-pressed={active === "all"}
          >
            All stories <span>04</span>
          </button>
          {desks.map((desk) => (
            <button
              key={desk}
              onClick={() => selectDesk(deskSlug(desk))}
              aria-pressed={active === deskSlug(desk)}
            >
              {desk}
            </button>
          ))}
        </div>
        <div className="search-box">
          <Search size={17} />
          <input
            type="search"
            aria-label="Search briefs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a question…"
          />
          {query && (
            <button
              className="icon-button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
      <p className="sr-only" role="status">
        {filtered.length} {filtered.length === 1 ? "brief" : "briefs"} shown
      </p>
      <div className="story-grid">
        {filtered.map((story) => (
          <article className="story-card" key={story.slug}>
            <Link
              href={`/stories/${story.slug}`}
              className="card-art-link"
              tabIndex={-1}
              aria-hidden="true"
            >
              <Illustration kind={story.illustration} />
              <span className="art-index">
                {String(stories.indexOf(story) + 1).padStart(2, "0")}
              </span>
            </Link>
            <div className="card-meta">
              <span>{story.desk}</span>
              <span>{story.readingMinutes} MIN READ</span>
            </div>
            <Link href={`/stories/${story.slug}`} className="card-title">
              <h3>{story.title}</h3>
              <ArrowUpRight size={19} />
            </Link>
            <p>{story.description}</p>
            <div className="card-bottom">
              <span>
                <span className="small-dot" /> Reference brief
              </span>
              <span>
                {story.sources.length}{" "}
                {story.sources.length === 1 ? "source" : "sources"}
              </span>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <Search size={28} />
          <h3>No briefs match that question.</h3>
          <p>Try another word or browse the full reference edition.</p>
          <button
            className="button button-outline"
            onClick={() => {
              setQuery("");
              selectDesk("all");
            }}
          >
            Show all briefs
          </button>
        </div>
      )}
    </section>
  );
}
