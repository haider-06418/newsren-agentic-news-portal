import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FollowDashboard } from "@/components/newsren/follow-dashboard";
import { Footer, Header } from "@/components/newsren/shell";

export const metadata = {
  title: "Your follows | The Newsren",
  description: "Questions saved locally from Newsren reference briefs.",
};

export default function FollowsPage() {
  return (
    <>
      <Header />
      <main id="main" className="follows-page">
        <Link href="/#stories" className="back-link">
          <ArrowLeft size={14} /> The reading room
        </Link>
        <div className="follows-heading">
          <p className="eyebrow">YOUR LOCAL FOLLOW DESK</p>
          <h1>Follow the question, not just the headline.</h1>
          <p>
            Saved only in this browser. The change cards below are explicit
            simulations demonstrating how Newsren would surface material new
            evidence—never claims of live monitoring.
          </p>
        </div>
        <FollowDashboard />
      </main>
      <Footer />
    </>
  );
}
