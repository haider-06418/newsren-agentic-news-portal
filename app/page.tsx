import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Check,
  Layers3,
  MoveRight,
} from "lucide-react";
import { Header, Footer } from "@/components/newsren/shell";
import { Illustration } from "@/components/newsren/illustration";
import { StoryExplorer } from "@/components/newsren/story-explorer";
import { stories } from "@/lib/newsroom";
export default function Home() {
  const featured = stories[0];
  return (
    <>
      <Header />
      <main id="main">
        <section className="intro-row">
          <p className="eyebrow">
            <span className="status-dot" /> THE REFERENCE EDITION
          </p>
          <p>
            Tuesday, October 27, 2026 <span className="intro-separator">/</span>{" "}
            Built for the curious.
          </p>
        </section>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">LESS NOISE. MORE UNDERSTANDING.</p>
            <h1>
              News moves fast.
              <br />
              <em>Understanding</em>
              <br />
              takes connection.
            </h1>
            <p className="hero-description">
              Go beyond the headline. Explore the evidence, connect the context,
              and follow the questions that matter to you.
            </p>
            <a href="#stories" className="button button-dark">
              Explore the briefing <ArrowDown size={17} />
            </a>
            <div className="hero-proof">
              <span>
                <Check size={14} /> Original sources
              </span>
              <span>
                <Check size={14} /> Uncertainty, visible
              </span>
            </div>
          </div>
          <div className="hero-feature">
            <Illustration kind="campus" className="feature-illustration" />
            <div className="feature-tag">
              <span className="status-dot" /> IN FOCUS <span>01 / 04</span>
            </div>
            <div className="feature-caption">
              <p className="eyebrow">EDUCATION & IMMIGRATION</p>
              <Link href={`/stories/${featured.slug}`}>
                <h2>{featured.shortTitle}</h2>
                <ArrowUpRight size={27} />
              </Link>
              <p>International student policy, through a clearer lens.</p>
            </div>
            <div className="source-stamp">
              <Layers3 size={20} />
              <div>
                <strong>2 original sources</strong>
                <span>One connected starting point</span>
              </div>
            </div>
          </div>
        </section>
        <section className="approach-strip" aria-label="The Newsren approach">
          <div>
            <span>01</span>
            <p>
              <strong>Start with the evidence.</strong> Trace claims to their
              original sources.
            </p>
          </div>
          <div>
            <span>02</span>
            <p>
              <strong>See the whole question.</strong> Keep facts and
              interpretation distinct.
            </p>
          </div>
          <div>
            <span>03</span>
            <p>
              <strong>Understand what is missing.</strong> Make room for
              unresolved questions.
            </p>
          </div>
        </section>
        <Suspense
          fallback={
            <section id="stories" className="stories-section" aria-busy="true">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">THE READING ROOM</p>
                  <h2>
                    Follow your curiosity<span>.</span>
                  </h2>
                </div>
                <span className="edition-count">LOADING THE EDITION</span>
              </div>
            </section>
          }
        >
          <StoryExplorer />
        </Suspense>
        <section className="reader-note">
          <div className="reader-note-icon">
            <BookOpen size={29} strokeWidth={1.3} />
          </div>
          <div>
            <p className="eyebrow">A DIFFERENT WAY TO READ</p>
            <h2>
              Good questions deserve
              <br />
              <em>more than a quick take.</em>
            </h2>
          </div>
          <div>
            <p>
              Each brief gives you a starting point, a source trail, and the
              questions the evidence cannot answer yet. Build your perspective
              with the context in view.
            </p>
            <Link href="/about" className="text-link">
              Inside our approach <MoveRight size={19} />
            </Link>
          </div>
        </section>
        <p className="prototype-note">
          A course prototype with curated reference briefs. This edition is a
          dated source snapshot, not a live news feed. Briefs await human
          editorial approval.
        </p>
      </main>
      <Footer />
    </>
  );
}
