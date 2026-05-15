import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Eye, ArrowLeft } from "lucide-react";
import { getArticleBySlug, getPublishedArticles, getCategories, getAdPlacements, incrementViewCount, recordPageView } from "@/lib/db";
import { formatDate, getImageUrl, readingTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArticleContent } from "./article-content";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt || undefined,
    },
  };
}

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article || article.status !== "published") {
    notFound();
  }

  // Record view
  await incrementViewCount(article.id);
  await recordPageView({
    articleId: article.id,
    path: `/articles/${slug}`,
    visitedAt: new Date().toISOString(),
    userAgent: "server",
    referrer: null,
  });

  const [categories, ads] = await Promise.all([
    getCategories(),
    getAdPlacements(),
  ]);

  const category = categories.find((c) => c.id === article.categoryId);
  const contentAd = ads.find((ad) => ad.position === "content" && ad.enabled);
  const readTimeValue = readingTime(article.content);
  const imageUrl = getImageUrl(article.coverImage);

  // Find related articles
  const allArticles = await getPublishedArticles();
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && a.categoryId === article.categoryId)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Article Header */}
      <header className="relative h-[300px] md:h-[400px] bg-card">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="relative w-full h-full bg-secondary">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized={imageUrl.startsWith('http')}
          />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Articles
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              {category && (
                <Link href={`/category/${category.slug}`}>
                  <Badge 
                    variant="default"
                    className="cursor-pointer hover:bg-primary/80"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name}
                  </Badge>
                </Link>
              )}
              {article.tags.map((tag) => (
                <Link key={tag} href={`/search?tag=${tag}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 max-w-4xl">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {readTimeValue} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {article.viewCount.toLocaleString()} views
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content - Client Component */}
      <ArticleContent 
        article={article}
        contentAd={contentAd}
        relatedArticles={relatedArticles}
        ads={ads}
      />
    </div>
  );
}
