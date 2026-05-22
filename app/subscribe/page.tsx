import Link from "next/link";
import type { Metadata } from "next";

const BASE_URL = "https://www.sxdgame.com";

export const metadata: Metadata = {
  title: "Subscribe to Newsletter",
  description: "Subscribe to the Slay Guide newsletter for the latest Slay the Spire 2 guides, strategies, and tips.",
  alternates: {
    canonical: `${BASE_URL}/subscribe`,
  },
  openGraph: {
    title: "Subscribe - Slay Guide Newsletter",
    description: "Get the latest Slay the Spire 2 guides, strategies, and tips delivered to your inbox.",
    url: `${BASE_URL}/subscribe`,
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function SubscribePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Stay Updated</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Get the latest Slay the Spire guides, strategies, and tips delivered to your inbox.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Subscribe
          </button>
        </form>
        <p className="text-sm text-muted-foreground">
          No spam. Unsubscribe anytime.
        </p>
        <div className="mt-8">
          <Link href="/" className="text-primary hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
