import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Eye, ArrowLeft } from "lucide-react";
import { getArticleBySlug, getPublishedArticles, getCategories, getAdPlacements, incrementViewCount, recordPageView } from "@/lib/db";
import { formatDate, getImageUrl, readingTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArticleContent } from "./article-content";
import { ArticleJsonLd, BreadcrumbListJsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

const BASE_URL = "https://www.sxdgame.com";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    return { title: "Article Not Found" };
  }

  const articleUrl = `${BASE_URL}/articles/${article.slug}`;
  const coverImageUrl = article.coverImage
    ? (article.coverImage.startsWith("http") ? article.coverImage : `${BASE_URL}${article.coverImage}`)
    : `${BASE_URL}/og`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: articleUrl,
      type: "article",
      publishedTime: article.publishedAt || article.createdAt,
      modifiedTime: article.updatedAt,
      siteName: "Slay Guide",
      images: [
        {
          url: coverImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [coverImageUrl],
    },
    other: {
      "article:published_time": article.publishedAt || article.createdAt,
      "article:modified_time": article.updatedAt,
      ...(article.tags.length > 0
        ? Object.fromEntries(article.tags.map((tag, i) => [`article:tag:${i}`, tag]))
        : {}),
    },
  };
}

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const sp = await searchParams;
  const isPreview = sp.preview === "true";

  if (!article || (!isPreview && article.status !== "published")) {
    notFound();
  }

  // Record view (skip for preview/draft)
  if (!isPreview) {
    await incrementViewCount(article.id);
    await recordPageView({
      articleId: article.id,
      path: `/articles/${slug}`,
      visitedAt: new Date().toISOString(),
      userAgent: "server",
      referrer: null,
    });
  }

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
      {/* Draft Preview Banner */}
      {isPreview && (
        <div className="bg-amber-500/90 text-black text-center py-2 text-sm font-medium">
          Preview Mode — This article is currently a draft and not publicly visible.
        </div>
      )}
      {/* Structured Data */}
      <ArticleJsonLd
        article={article}
        category={category}
        url={`${BASE_URL}/articles/${article.slug}`}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: "Home", url: BASE_URL },
          ...(category
            ? [{ name: category.name, url: `${BASE_URL}/category/${category.slug}` }]
            : []),
          { name: article.title, url: `${BASE_URL}/articles/${article.slug}` },
        ]}
      />

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
              <time dateTime={article.publishedAt || article.createdAt} className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(article.publishedAt || article.createdAt)}
              </time>
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
