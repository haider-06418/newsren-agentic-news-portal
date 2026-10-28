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
          The Newsren is evidence-led news intelligence for developing stories.
          It connects original sources, competing interpretations, and open
          questions in one place—without pretending uncertainty has disappeared.
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
              "Read the brief, choose an explanation mode, inspect individual claims, and follow one question locally. The evidence remains useful without an AI response.",
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
          <h2>Coverage boundaries</h2>
          <p>
            Newsren currently covers four developing questions using sources
            consulted on October 27, 2026. Every story shows its evidence
            window and unresolved claims. Coverage is not a live feed and does
            not provide case-specific immigration or investment advice.
          </p>
          <p>
            Ask Newsren is bounded to each story&apos;s evidence. Saved follows stay
            in this browser. Following is in preview: update cards are clearly
            labeled illustrative until live monitoring and notifications launch.
          </p>
          <Link href="/#stories" className="button button-dark">
            Explore today&apos;s briefing <MoveRight size={17} />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
