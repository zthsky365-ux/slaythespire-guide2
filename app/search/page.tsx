import type { Metadata } from "next";
import { SearchContent } from "@/components/search/search-content";

const BASE_URL = "https://www.sxdgame.com";

export const metadata: Metadata = {
  title: "Search Guides",
  description:
    "Search for Slay the Spire 2 guides, card strategies, character builds, and boss tactics.",
  alternates: {
    canonical: `${BASE_URL}/search`,
  },
  openGraph: {
    title: "Search Guides - Slay the Spire 2",
    description:
      "Search for Slay the Spire 2 guides, card strategies, character builds, and boss tactics.",
    url: `${BASE_URL}/search`,
  },
};

export default function SearchPage() {
  return <SearchContent />;
}
