import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedArticles, getCategories, getAdPlacements } from "@/lib/db";
import { Sidebar } from "@/components/layout/sidebar";
import { ArticleGrid } from "@/components/articles/article-grid";
import { AdBanner } from "@/components/ads/ad-banner";
import { ArticleCard } from "@/components/articles/article-card";
import { WebSiteJsonLd, OrganizationJsonLd } from "@/components/seo/json-ld";
import { Sparkles, ChevronRight } from "lucide-react";

// 每60秒重新验证缓存，确保新发布的内容能及时显示
export const revalidate = 60;

const BASE_URL = "https://www.sxdgame.com";

export const metadata: Metadata = {
  title: "Slay Guide - Slay the Spire 2 Strategy & Card Guides",
  description:
    "Your ultimate resource for Slay the Spire 2 guides, card strategies, character builds, and boss tactics. Master the spire with our comprehensive game guides.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Slay Guide - Slay the Spire 2 Strategy & Card Guides",
    description:
      "Your ultimate resource for Slay the Spire 2 guides, card strategies, character builds, and boss tactics.",
    url: BASE_URL,
    type: "website",
    siteName: "Slay Guide",
    images: [
      {
        url: `${BASE_URL}/og`,
        width: 1200,
        height: 630,
        alt: "Slay Guide - Slay the Spire 2 Strategy Guides",
      },
    ],
  },
};

export default async function HomePage() {
  const [articles, categories, ads] = await Promise.all([
    getPublishedArticles(),
    getCategories(),
    getAdPlacements(),
  ]);

  const headerAd = ads.find((ad) => ad.position === "header" && ad.enabled);
  const popularArticles = [...articles]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  // 最新发布的文章（最近7天内）
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentArticles = articles.filter((article) => {
    const publishedDate = new Date(article.publishedAt || article.createdAt);
    return publishedDate >= oneWeekAgo;
  });

  // 获取分类名称的映射
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  }, {} as Record<string, typeof categories[0]>);

  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <WebSiteJsonLd />
      <OrganizationJsonLd />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
            Master <span className="text-primary">Slay the Spire 2</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
            Comprehensive guides, card analyses, and strategies to help you conquer the Spire. From beginner tips to advanced combos.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <a 
              href="#guides" 
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Guides
            </a>
            <a 
              href="/category/character-builds" 
              className="px-6 py-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
              Character Builds
            </a>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Header Ad */}
      {headerAd && (
        <section className="py-4 bg-card/50">
          <div className="container mx-auto px-4">
            <AdBanner placement={headerAd} />
          </div>
        </section>
      )}

      {/* New/Recent Articles Section */}
      {recentArticles.length > 0 && (
        <section className="py-8 bg-gradient-to-r from-amber-500/10 via-primary/10 to-purple-500/10 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h2 className="font-serif text-xl font-bold">最新发布</h2>
                <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-500 rounded-full">
                  {recentArticles.length} 篇
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentArticles.slice(0, 6).map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  category={categoryMap[article.categoryId]} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section id="guides" className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl font-bold">All Guides</h2>
                <span className="text-sm text-muted-foreground">
                  {articles.length} articles
                </span>
              </div>
              <Suspense fallback={<ArticleGridSkeleton />}>
                <ArticleGrid articles={articles} categories={categories} showFeatured />
              </Suspense>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar categories={categories} popularArticles={popularArticles} />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-card to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">Stay Ahead of the Spire</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Subscribe to get notified about new guides, updates, and exclusive strategies.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function ArticleGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
          <div className="h-48 bg-secondary" />
          <div className="p-5 space-y-3">
            <div className="h-6 bg-secondary rounded w-3/4" />
            <div className="h-4 bg-secondary rounded w-full" />
            <div className="h-4 bg-secondary rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
