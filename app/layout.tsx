import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { initializeDefaultData } from "@/lib/db";

export const metadata: Metadata = {
  title: {
    default: "Slay Guide - Slay the Spire 2 Strategy & Card Guides",
    template: "%s | Slay Guide",
  },
  description: "Your ultimate resource for Slay the Spire 2 guides, card strategies, character builds, and boss tactics. Master the spire with our comprehensive game guides.",
  keywords: ["Slay the Spire 2", "Slay the Spire", "game guide", "card game", "strategy", "Ironclad", "Silent", "Defect"],
  authors: [{ name: "Slay Guide Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Slay Guide",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize default data on first load
  await initializeDefaultData();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
