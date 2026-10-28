import Link from "next/link";
import { ArrowUpRight, Asterisk, Bell, MoveRight } from "lucide-react";
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
        <span>EVIDENCE-LED NEWS INTELLIGENCE</span>
        <span>
          SOURCE INDEX <i /> UPDATED OCT 27, 2026
        </span>
      </div>
      <header className="site-header">
        <Brand />
        <div className="header-note">
          See what holds up.
          <br />
          <strong>Know what remains open.</strong>
        </div>
        <div className="header-actions">
          <Link href="/follows" className="text-link">
            Your follows <Bell size={14} />
          </Link>
          <Link href="/about" className="text-link">
            How Newsren works <ArrowUpRight size={15} />
          </Link>
        </div>
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
          Evidence before opinion <Asterisk size={15} />
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
          Evidence-led news intelligence
          <br />
          Original sources · Visible uncertainty · Reader-controlled context
        </p>
        <p>
          Coverage updated Oct 27, 2026
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
