"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Article, Category } from "@/lib/types";
import { formatDate, getImageUrl } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  category?: Category;
  featured?: boolean;
}

function ImageWithFallback({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <div className={`bg-secondary flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-sm">Image unavailable</span>
      </div>
    );
  }
  
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={className}
      onError={() => setHasError(true)}
      unoptimized={src.startsWith('http')}
    />
  );
}

export function ArticleCard({ article, category, featured = false }: ArticleCardProps) {
  const imageUrl = getImageUrl(article.coverImage);
  const readTime = Math.ceil(article.content.split(/\s+/).length / 200);

  if (featured) {
    return (
      <Link href={`/articles/${article.slug}`}>
        <Card className="group overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-auto bg-secondary">
              <ImageWithFallback
                src={imageUrl}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80 md:block hidden" />
            </div>
            <CardContent className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                {category && (
                  <Badge 
                    variant="default"
                    style={{ backgroundColor: `${category.color}30`, color: category.color }}
                  >
                    {category.name}
                  </Badge>
                )}
                <Badge variant="accent">Featured</Badge>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                {article.title}
              </h2>
              <p className="text-muted-foreground mb-6 line-clamp-3">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.publishedAt || article.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readTime} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.viewCount.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/articles/${article.slug}`}>
      <Card className="group overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        <div className="relative h-48 bg-secondary overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {category && (
            <div 
              className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium"
              style={{ backgroundColor: category.color, color: '#fff' }}
            >
              {category.name}
            </div>
          )}
        </div>
        <CardContent className="p-5 flex-1 flex flex-col">
          <h3 className="font-serif text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readTime} min
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {article.viewCount.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
