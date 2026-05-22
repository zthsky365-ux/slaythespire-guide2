import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Slay the Spire Guide",
  description: "Privacy Policy for Slay the Spire Guide.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-primary hover:underline text-sm mb-8 inline-block">
          &larr; Back to Home
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-lg">
            At Slay the Spire Guide, we take your privacy seriously. This policy outlines how we handle your data.
          </p>
          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">Information Collection</h2>
            <p>
              We collect minimal, anonymous usage data to improve our content and user experience. This includes page views and article popularity metrics.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">Cookies</h2>
            <p>
              We may use essential cookies to maintain your session. No tracking or advertising cookies are used.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">Third-Party Services</h2>
            <p>
              This website is hosted on Vercel and uses a secure database. We do not share your data with any third-party advertisers or analytics providers.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">Contact</h2>
            <p>
              If you have any questions about this policy, please contact us through our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
