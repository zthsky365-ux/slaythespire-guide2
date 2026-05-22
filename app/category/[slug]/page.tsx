import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategoryBySlug, getPublishedArticles, getCategories } from "@/lib/db";
import { ArticleGrid } from "@/components/articles/article-grid";
import { BreadcrumbListJsonLd, CollectionPageJsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

const BASE_URL = "https://www.sxdgame.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  
  if (!category) {
    return { title: "Category Not Found" };
  }

  const categoryUrl = `${BASE_URL}/category/${category.slug}`;

  return {
    title: category.name,
    description: category.description || `Browse all ${category.name} guides and strategies for Slay the Spire 2.`,
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      title: `${category.name} - Slay the Spire 2 Guides`,
      description: category.description || `Browse all ${category.name} guides and strategies for Slay the Spire 2.`,
      url: categoryUrl,
      type: "website",
      siteName: "Slay Guide",
      images: [
        {
          url: `${BASE_URL}/og`,
          width: 1200,
          height: 630,
          alt: `${category.name} Guides`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} - Slay the Spire 2 Guides`,
      description: category.description || `Browse all ${category.name} guides and strategies.`,
      images: [`${BASE_URL}/og`],
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  
  const [category, allArticles, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getPublishedArticles(),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const filteredArticles = allArticles.filter((article) => article.categoryId === category.id);

  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <BreadcrumbListJsonLd
        items={[
          { name: "Home", url: BASE_URL },
          { name: category.name, url: `${BASE_URL}/category/${category.slug}` },
        ]}
      />
      <CollectionPageJsonLd
        name={`${category.name} Guides`}
        description={category.description || `Browse all ${category.name} guides for Slay the Spire 2.`}
        url={`${BASE_URL}/category/${category.slug}`}
      />

      {/* Header */}
      <header 
        className="py-16 bg-gradient-to-b from-card to-background"
        style={{ borderBottom: `2px solid ${category.color}30` }}
      >
        <div className="container mx-auto px-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="p-4 rounded-xl"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <span style={{ color: category.color }}>
                {category.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="font-serif text-4xl font-bold text-foreground">
                {category.name}
              </h1>
              <p className="text-muted-foreground mt-2">{category.description}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"}
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredArticles.length > 0 ? (
            <ArticleGrid articles={filteredArticles} categories={categories} showFeatured={false} />
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                No articles in this category yet.
              </p>
              <Link 
                href="/"
                className="text-primary hover:underline"
              >
                Browse other articles
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
