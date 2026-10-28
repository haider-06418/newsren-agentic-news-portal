import Link from "next/link";
import { Header, Footer } from "@/components/newsren/shell";
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="empty-state not-found">
        <p className="eyebrow">404 / A MISSING PAGE</p>
        <h1>
          This question needs
          <br />a different starting point.
        </h1>
        <p>That story is not in today&apos;s briefing.</p>
        <Link href="/" className="button button-dark">
          Back to the briefing
        </Link>
      </main>
      <Footer />
    </>
  );
}
