import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { initializeDefaultData } from "@/lib/db";
import { LanguageProvider } from "@/components/language-provider";

const BASE_URL = "https://www.sxdgame.com";
const SITE_NAME = "Slay Guide";
const SITE_DESCRIPTION =
  "Your ultimate resource for Slay the Spire 2 guides, card strategies, character builds, and boss tactics. Master the spire with our comprehensive game guides.";
const OG_IMAGE = `${BASE_URL}/og`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `Slay Guide - Slay the Spire 2 Strategy & Card Guides`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Slay the Spire 2",
    "Slay the Spire",
    "game guide",
    "card game",
    "strategy",
    "Ironclad",
    "Silent",
    "Defect",
    "roguelike",
    "deck building",
  ],
  authors: [{ name: "Slay Guide Team" }],
  creator: "Slay Guide Team",
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: SITE_NAME,
    title: `Slay Guide - Slay the Spire 2 Strategy & Card Guides`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Slay Guide - Slay the Spire 2 Strategy Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Slay Guide - Slay the Spire 2 Strategy & Card Guides`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "uxSzTP_yndj-kbO7XEBNbi7j9YKwIOK5tfr9fNKmzek", // ⬅ 替换为 Google Search Console 提供的验证码
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await initializeDefaultData();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
