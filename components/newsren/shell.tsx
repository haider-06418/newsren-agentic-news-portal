import Link from "next/link";
import { ArrowUpRight, Asterisk, MoveRight } from "lucide-react";
import { desks, deskSlug } from "@/lib/newsroom";
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="The Newsren home">
      <Asterisk size={31} strokeWidth={1.6} />
      <span>
        the newsren<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
export function Header() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="edition-bar">
        <span>INDEPENDENT THINKING. CONNECTED EVIDENCE.</span>
        <span>
          WEEK 01 <i /> REFERENCE EDITION
        </span>
      </div>
      <header className="site-header">
        <Brand />
        <div className="header-note">
          A little more context.
          <br />
          <strong>A clearer perspective.</strong>
        </div>
        <Link href="/about" className="text-link">
          How Newsren works <ArrowUpRight size={15} />
        </Link>
      </header>
      <nav className="desk-nav" aria-label="News desks">
        <Link href="/" className="nav-all">
          The briefing
        </Link>
        {desks.map((desk) => (
          <Link key={desk} href={`/?desk=${deskSlug(desk)}#stories`}>
            {desk}
          </Link>
        ))}
        <span className="nav-mark">
          Clarity over noise <Asterisk size={15} />
        </span>
      </nav>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Brand />
        <p>
          Follow a question.
          <br />
          Find your perspective.
        </p>
        <Link href="/about" className="text-link">
          Our approach <MoveRight size={18} />
        </Link>
      </div>
      <div className="footer-bottom">
        <p>
          Week 1 Assignment · 49-772 A2 Software Engineering Management
          <br />
          Fall 2026 · Carnegie Mellon University – Silicon Valley
        </p>
        <p>
          Prototype reference edition · Source snapshot: Oct 27, 2026
          <br />© 2026 The Newsren ·{" "}
          <a
            href="https://github.com/haider-06418/newsren-agentic-news-portal"
            target="_blank"
            rel="noreferrer"
          >
            Project on GitHub ↗
          </a>
        </p>
      </div>
    </footer>
  );
}
