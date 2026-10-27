import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  CircleHelp,
  Clock3,
  Files,
  Info,
  MoveRight,
} from "lucide-react";
import { Header, Footer } from "@/components/newsren/shell";
import { Illustration } from "@/components/newsren/illustration";
import {
  getStory,
  stories,
  formatSourceDate,
  snapshotDate,
} from "@/lib/newsroom";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStory(slug);
  return {
    title: story
      ? `${story.title} | The Newsren`
      : "Brief not found | The Newsren",
    description: story?.description,
  };
}
export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();
  const sourceNumber = (id: string) =>
    story.sources.findIndex((source) => source.id === id) + 1;
  return (
    <>
      <Header />
      <main id="main" className="story-page">
        <div className="story-breadcrumb">
          <Link href="/#stories">
            <ArrowLeft size={14} /> The reading room
          </Link>
          <span>{story.desk}</span>
        </div>
        <div className="story-heading">
          <p className="eyebrow">{story.kicker}</p>
          <h1>{story.title}</h1>
          <p className="story-deck">{story.description}</p>
          <div className="story-byline">
            <span className="byline-avatar">n.</span>
            <div>
              <strong>The Newsren reference desk</strong>
              <span>
                Source snapshot · {snapshotDate} · {story.readingMinutes} min
                read
              </span>
            </div>
            <span className="review-badge">
              <Clock3 size={13} /> {story.reviewStatus}
            </span>
          </div>
        </div>
        <div className="story-layout">
          <article className="story-body">
            <Illustration
              kind={story.illustration}
              className="story-hero-art"
            />
            <div className="reference-notice">
              <Info size={17} />
              <p>
                This is a curated reference brief. It explains a source bundle
                and does not report a newly verified development.
                {story.desk === "Education & Immigration" ||
                story.desk === "Policy & Society"
                  ? " General information, not individual immigration advice."
                  : ""}
                {story.desk === "Business & Finance"
                  ? " Informational and educational only; not investment advice."
                  : ""}
              </p>
            </div>
            <section id="brief" className="article-section">
              <p className="eyebrow">01 / THE STARTING POINT</p>
              <h2>What the evidence tells us.</h2>
              <p className="brief-paragraph">{story.brief}</p>
              <p className="brief-source-note">
                Source bundle:{" "}
                {story.sources.map((source) => (
                  <a
                    key={source.id}
                    href={`#source-${source.id}`}
                    className="citation"
                  >
                    [{sourceNumber(source.id)}]
                  </a>
                ))}
              </p>
            </section>
            <section id="evidence" className="article-section">
              <p className="eyebrow">02 / INSPECT THE EVIDENCE</p>
              <h2>One claim at a time.</h2>
              <p className="section-intro">
                Open a claim to see its support, the editorial interpretation,
                or the evidence still missing.
              </p>
              <div className="claim-list">
                {story.claims.map((claim) => (
                  <details
                    className={`claim claim-${claim.kind.toLowerCase()}`}
                    key={claim.id}
                  >
                    <summary>
                      <span className="claim-state">
                        {claim.kind === "Supported" ? (
                          <Check size={15} />
                        ) : claim.kind === "Unresolved" ? (
                          <CircleHelp size={15} />
                        ) : (
                          <BookOpen size={15} />
                        )}
                        {claim.kind}
                      </span>
                      <span className="claim-text">{claim.text}</span>
                      <span className="disclosure-plus">+</span>
                    </summary>
                    <div className="claim-detail">
                      <p>{claim.detail}</p>
                      {claim.sourceIds.length ? (
                        <div className="claim-sources">
                          {claim.sourceIds.map((id) => (
                            <a
                              key={id}
                              href={`#source-${id}`}
                              className="citation"
                            >
                              Source {sourceNumber(id)} ↗
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="no-evidence">
                          No supporting evidence in this bundle
                        </span>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </section>
            <section id="perspectives" className="article-section">
              <p className="eyebrow">03 / CONNECT THE CONTEXT</p>
              <h2>More than one reading lens.</h2>
              <p className="section-intro">
                These are editorial prompts for understanding the sources. They
                are not quotations or independently reported stakeholder
                opinions.
              </p>
              <div className="perspective-grid">
                {story.perspectives.map((perspective, index) => (
                  <div className="perspective-card" key={perspective.label}>
                    <span className="perspective-number">0{index + 1}</span>
                    <h3>{perspective.label}</h3>
                    <p>{perspective.text}</p>
                    <span>{perspective.type}</span>
                  </div>
                ))}
              </div>
            </section>
            <section id="timeline" className="article-section">
              <p className="eyebrow">04 / THE RESEARCH TRAIL</p>
              <h2>How this brief came together.</h2>
              <p className="section-intro">
                Source publication and research activity are shown separately.
                Retrieval is not the date a policy took effect.
              </p>
              <ol className="timeline">
                {story.trail.map((event, index) => (
                  <li key={`${event.title}-${index}`}>
                    <span className="timeline-dot" />
                    <time dateTime={event.date}>
                      {formatSourceDate(event.date)}
                    </time>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                  </li>
                ))}
              </ol>
            </section>
            <section id="sources" className="article-section sources-section">
              <p className="eyebrow">05 / GO TO THE ORIGINAL</p>
              <h2>The source ledger.</h2>
              <p className="section-intro">
                Each link opens the original publisher. This bundle is a dated
                snapshot and is not monitored for changes.
              </p>
              {story.sources.map((source, index) => (
                <div
                  className="source-row"
                  id={`source-${source.id}`}
                  key={source.id}
                >
                  <span className="source-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="source-type">{source.type}</span>
                    <h3>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.title} <ArrowUpRight size={16} />
                      </a>
                    </h3>
                    <p>{source.publisher}</p>
                    <p className="source-dates">
                      Published:{" "}
                      {source.publishedAt
                        ? formatSourceDate(source.publishedAt)
                        : "Not stated"}
                      <br />
                      Retrieved: {formatSourceDate(source.retrievedAt)}
                    </p>
                    <p className="source-note">{source.note}</p>
                  </div>
                </div>
              ))}
            </section>
          </article>
          <aside className="story-sidebar">
            <div className="notebook">
              <div className="notebook-title">
                <Files size={19} />
                <h2>The story notebook</h2>
              </div>
              <p>A little structure for a complicated question.</p>
              <nav aria-label="In this brief">
                <a href="#brief">
                  <span>01</span>The starting point <MoveRight size={15} />
                </a>
                <a href="#evidence">
                  <span>02</span>Inspect the evidence <MoveRight size={15} />
                </a>
                <a href="#perspectives">
                  <span>03</span>Connect the context <MoveRight size={15} />
                </a>
                <a href="#timeline">
                  <span>04</span>The research trail <MoveRight size={15} />
                </a>
                <a href="#sources">
                  <span>05</span>Original sources <MoveRight size={15} />
                </a>
              </nav>
              <div className="evidence-summary">
                <div>
                  <strong>{story.sources.length}</strong>
                  <span>original sources</span>
                </div>
                <div>
                  <strong>
                    {story.claims.filter((c) => c.kind === "Supported").length}
                  </strong>
                  <span>supported claims</span>
                </div>
              </div>
              <div className="questions-note">
                <p className="eyebrow">KEEP ASKING</p>
                <h3>Questions worth following.</h3>
                <ul>
                  {story.questions.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </div>
              <div className="notebook-foot">
                <span className="status-dot" /> Evidence visible. Questions
                open.
              </div>
            </div>
          </aside>
        </div>
        <section className="related-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">KEEP EXPLORING</p>
              <h2>A different angle.</h2>
            </div>
            <Link href="/#stories" className="text-link">
              All briefs <MoveRight size={18} />
            </Link>
          </div>
          <div className="related-grid">
            {stories
              .filter((s) => s.slug !== slug)
              .slice(0, 2)
              .map((related) => (
                <Link
                  href={`/stories/${related.slug}`}
                  key={related.slug}
                  className="related-card"
                >
                  <div>
                    <p className="eyebrow">{related.desk}</p>
                    <h3>{related.title}</h3>
                    <span>
                      {related.readingMinutes} min read ·{" "}
                      {related.sources.length}{" "}
                      {related.sources.length === 1 ? "source" : "sources"}
                    </span>
                  </div>
                  <ArrowUpRight size={22} />
                </Link>
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
