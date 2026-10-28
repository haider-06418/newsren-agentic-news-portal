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
            <span className="status-dot" /> TODAY&apos;S BRIEFING
          </p>
          <p>
            Tuesday, October 27, 2026 <span className="intro-separator">/</span>{" "}
            4 developing stories across 4 desks
          </p>
        </section>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">TODAY&apos;S LEAD QUESTION</p>
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
              <span className="status-dot" /> LEAD BRIEF <span>01 / 04</span>
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
        <section className="approach-strip" aria-label="Newsren product features">
          <div>
            <span>01</span>
            <p>
              <strong>Evidence linked.</strong> Every material claim stays
              connected to its original source.
            </p>
          </div>
          <div>
            <span>02</span>
            <p>
              <strong>Multiple reading lenses.</strong> See how the same
              evidence matters to different readers.
            </p>
          </div>
          <div>
            <span>03</span>
            <p>
              <strong>Questions worth following.</strong> Save the uncertainty
              that matters—not just another headline.
            </p>
          </div>
        </section>
        <Suspense
          fallback={
            <section id="stories" className="stories-section" aria-busy="true">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">TODAY&apos;S BRIEFING</p>
                  <h2>
                    Stories worth understanding<span>.</span>
                  </h2>
                </div>
                <span className="edition-count">LOADING THE BRIEFING</span>
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
            <p className="eyebrow">BUILT FOR DEVELOPING STORIES</p>
            <h2>
              Know what changed.
              <br />
              <em>See what still hasn&apos;t.</em>
            </h2>
          </div>
          <div>
            <p>
              Newsren connects the source trail, the strongest supported
              claims, and the questions that remain unresolved—so you can form
              a view without losing the evidence.
            </p>
            <Link href="/about" className="text-link">
              Inside our approach <MoveRight size={19} />
            </Link>
          </div>
        </section>
        <p className="prototype-note">
          Newsren shows the date and limits of every evidence window. Coverage
          is current to the source dates shown and is not personalized advice.
        </p>
      </main>
      <Footer />
    </>
  );
}
