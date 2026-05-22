import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Slay the Spire Guide",
  description: "Terms of Service for Slay the Spire Guide.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-primary hover:underline text-sm mb-8 inline-block">
          &larr; Back to Home
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-lg">
            By accessing and using Slay the Spire Guide, you agree to the following terms.
          </p>
          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">Content Usage</h2>
            <p>
              All guides, strategies, and content on this site are provided for informational purposes. You may reference and share our content with proper attribution.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">Intellectual Property</h2>
            <p>
              Slay the Spire and all related assets are property of Mega Crit Games. This is an unofficial fan guide and is not affiliated with or endorsed by Mega Crit Games.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">Disclaimer</h2>
            <p>
              We strive to keep our content accurate and up-to-date, but we make no guarantees regarding completeness or accuracy. Use the information at your own discretion.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">Changes</h2>
            <p>
              We reserve the right to update these terms at any time. Continued use of the site constitutes acceptance of any changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
