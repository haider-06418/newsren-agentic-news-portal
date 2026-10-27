import Link from "next/link";
import { ArrowLeft, MoveRight } from "lucide-react";
import { Header, Footer } from "@/components/newsren/shell";
export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main" className="about-page">
        <Link className="text-link" href="/">
          <ArrowLeft size={16} /> Back to the briefing
        </Link>
        <p className="eyebrow">OUR APPROACH</p>
        <h1>
          A clearer perspective
          <br />
          starts with <em>better questions.</em>
        </h1>
        <p className="about-lede">
          The Newsren is a course prototype exploring how evidence, context, and
          uncertainty can make developing news easier to understand.
        </p>
        <div className="about-principles">
          {[
            [
              "01",
              "Follow the source.",
              "Every supported claim links to its underlying evidence. Dates, publisher identity, and source limitations stay visible.",
            ],
            [
              "02",
              "Make interpretation visible.",
              "Editorial analysis is labeled. A source proving one fact does not automatically support every implication someone draws from it.",
            ],
            [
              "03",
              "Leave questions open.",
              "When a bundle cannot answer a question, we say what is missing. We do not manufacture agreement between perspectives.",
            ],
            [
              "04",
              "Keep the reader in control.",
              "Read the brief, inspect individual claims, and follow the original publisher. The evidence should remain useful without an AI response.",
            ],
          ].map(([number, title, body]) => (
            <section key={number}>
              <span>{number}</span>
              <div>
                <h2>{title}</h2>
                <p>{body}</p>
              </div>
            </section>
          ))}
        </div>
        <div className="about-disclosure">
          <h2>About this edition</h2>
          <p>
            These four reference briefs were assembled for a weekly assignment
            from sources consulted on October 27, 2026. They await human
            editorial approval. They are not a live feed, do not monitor
            changes, and do not provide case-specific immigration or investment
            advice.
          </p>
          <p>
            Conversational research and saved topic following are planned next.
            This edition lets you review the reading experience and its source
            trail first.
          </p>
          <Link href="/#stories" className="button button-dark">
            Explore the reference briefs <MoveRight size={17} />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
