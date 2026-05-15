"use client";

import Link from "next/link";
import Image from "next/image";
import { Share2, Bookmark, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdContent } from "@/components/ads/ad-banner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getImageUrl } from "@/lib/utils";
import type { Article, AdPlacement } from "@/lib/types";
import { useState } from "react";

interface ArticleContentProps {
  article: Article;
  contentAd: AdPlacement | undefined;
  relatedArticles: Article[];
  ads: AdPlacement[];
}

function RelatedArticleCard({ article }: { article: Article }) {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getImageUrl(article.coverImage);
  
  return (
    <Link 
      href={`/articles/${article.slug}`}
      className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all"
    >
      <div className="relative h-32 bg-secondary">
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-muted-foreground text-xs">Image unavailable</span>
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            sizes="300px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setHasError(true)}
            unoptimized={imageUrl.startsWith('http')}
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}

export function ArticleContent({ article, contentAd, relatedArticles, ads }: ArticleContentProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-3">
          {/* Share buttons */}
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
            <span className="text-sm text-muted-foreground">Share:</span>
            <Button variant="outline" size="sm" className="gap-2">
              <Globe className="h-4 w-4" />
              Twitter
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Save
            </Button>
          </div>

          {/* Article body */}
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold text-white mb-6 mt-8 font-serif">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-bold text-white mb-4 mt-8 font-serif">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-semibold text-purple-300 mb-3 mt-6">{children}</h3>,
                p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-gray-300">{children}</li>,
                strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                code: ({ children }) => <code className="bg-muted px-1.5 py-0.5 rounded text-purple-300 font-mono text-sm">{children}</code>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-4">{children}</blockquote>,
                img: ({ src, alt }) => (
                  <span className="my-4 block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={src} 
                      alt={alt || ''} 
                      className="max-w-full h-auto rounded-lg mx-auto"
                      style={{ maxHeight: '500px', objectFit: 'contain' }}
                      loading="lazy"
                    />
                  </span>
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* In-content Ad */}
          {contentAd && (
            <div className="my-12">
              <AdContent placement={contentAd} />
            </div>
          )}

          {/* Author Box */}
          <div className="mt-12 p-6 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">A</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Admin</h3>
                <p className="text-sm text-muted-foreground">Content Creator & Strategy Expert</p>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-12">
              <h2 className="font-serif text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <RelatedArticleCard key={related.id} article={related} />
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Table of Contents */}
          <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
            <h3 className="font-serif font-bold text-lg mb-4">On This Page</h3>
            <nav className="space-y-2 text-sm">
              <a href="#overview" className="block text-muted-foreground hover:text-foreground transition-colors">
                Overview
              </a>
              <a href="#getting-started" className="block text-muted-foreground hover:text-foreground transition-colors">
                Getting Started
              </a>
              <a href="#strategies" className="block text-muted-foreground hover:text-foreground transition-colors">
                Strategies
              </a>
              <a href="#tips" className="block text-muted-foreground hover:text-foreground transition-colors">
                Tips
              </a>
            </nav>
          </div>

          {/* Ad Sidebar */}
          {ads.find((ad) => ad.position === "sidebar" && ad.enabled) && (
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground text-center mb-2">Advertisement</p>
              <div className="h-[600px] bg-secondary/50 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Ad Space</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
