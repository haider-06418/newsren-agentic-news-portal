import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FollowDashboard } from "@/components/newsren/follow-dashboard";
import { Footer, Header } from "@/components/newsren/shell";

export const metadata = {
  title: "Your follows | The Newsren",
  description: "The developing questions you follow in Newsren.",
};

export default function FollowsPage() {
  return (
    <>
      <Header />
      <main id="main" className="follows-page">
        <Link href="/#stories" className="back-link">
          <ArrowLeft size={14} /> Today&apos;s briefing
        </Link>
        <div className="follows-heading">
          <p className="eyebrow">FOLLOWING</p>
          <h1>Follow the question, not just the headline.</h1>
          <p>
            Save the uncertainty that matters to you and return to it from any
            story. Following is in preview: questions stay on this device, and
            update cards are illustrative until live monitoring launches.
          </p>
        </div>
        <FollowDashboard />
      </main>
      <Footer />
    </>
  );
}
