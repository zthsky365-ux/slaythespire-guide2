"use client";

import Link from "next/link";
import Image from "next/image";
import { Share2, Bookmark, Globe, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdContent } from "@/components/ads/ad-banner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { getImageUrl } from "@/lib/utils";
import type { Article, AdPlacement } from "@/lib/types";
import { useState, useCallback, useRef } from "react";

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
            unoptimized={imageUrl.startsWith("http")}
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

/** 图片放大预览弹窗 */
function LightboxModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
        <button
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/** 安全地提取 className（支持 string 和 string[]） */
function getClassName(props: Record<string, unknown>): string {
  const cn = props?.className;
  if (typeof cn === "string") return cn;
  if (Array.isArray(cn)) return cn.join(" ");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cls = (props as any)?.class || "";
  if (typeof cls === "string") return cls;
  if (Array.isArray(cls)) return (cls as unknown[]).map(String).join(" ");
  return "";
}

/** 检查 className 是否包含某个 class */
function hasClass(props: Record<string, unknown>, name: string): boolean {
  return getClassName(props).split(/\s+/).includes(name);
}

export function ArticleContent({ article, contentAd, relatedArticles, ads }: ArticleContentProps) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  /** 用 ref 追踪当前是否在 gallery 内部，避免给画廊内图片加多余包裹 */
  const insideGallery = useRef(false);

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightbox({ src, alt });
  }, []);

  // 预处理内容：确保 image-gallery 的 data-cols 属性存在
  const processedContent = article.content.replace(
    /<div\s+class="image-gallery"\s*>/g,
    '<div class="image-gallery" data-cols="2">'
  );

  return (
    <div className="container mx-auto px-4 py-12">
      {lightbox && (
        <LightboxModal src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}

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
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-white mb-6 mt-8 font-serif">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-white mb-4 mt-8 font-serif">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-purple-300 mb-3 mt-6">{children}</h3>
                ),
                p: ({ children, ...rest }) => {
                  // 如果在 gallery 内部，p 标签不加额外 margin（避免影响 grid）
                  const props = rest as Record<string, unknown>;
                  if (insideGallery.current) {
                    return <p className="text-center text-xs text-muted-foreground my-1">{children}</p>;
                  }
                  return <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>;
                },
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-300">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="text-white font-semibold">{children}</strong>
                ),
                code: ({ children }) => (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-purple-300 font-mono text-sm">{children}</code>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-4">{children}</blockquote>
                ),
                img: ({ src, alt, ...rest }) => {
                  const imgSrc = String(src || "");
                  const htmlProps = rest as Record<string, unknown>;
                  const styleStr = (htmlProps?.style as string) || "";
                  // 解析 HTML 上的内联样式
                  const parsedStyle = styleStr ? parseStyleString(styleStr) : {};

                  // 画廊内部：简洁渲染，透传 style 属性，不加额外 span 包裹
                  if (insideGallery.current) {
                    /* eslint-disable-next-line @next/next/no-img-element */
                    return (
                      <img
                        src={imgSrc}
                        alt={alt || ""}
                        style={Object.keys(parsedStyle).length > 0 ? parsedStyle : undefined}
                        loading="lazy"
                        onClick={() => openLightbox(imgSrc, alt || "")}
                      />
                    );
                  }

                  // 普通独立图片：完整 lightbox 渲染
                  return (
                    <span
                      className="my-4 block group relative cursor-zoom-in inline-block w-full"
                      onClick={() => openLightbox(imgSrc, alt || "")}
                    >
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg z-10 flex items-center justify-center pointer-events-none">
                        <ZoomIn className="h-8 w-8 text-white" />
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc}
                        alt={alt || ""}
                        style={{ maxHeight: "500px", objectFit: "contain", ...(styleStr ? parseStyleString(styleStr) : {}) }}
                        className="max-w-full h-auto rounded-lg mx-auto cursor-zoom-in"
                        loading="lazy"
                      />
                      {alt ? (
                        <p className="text-center text-xs text-muted-foreground mt-2 italic">{alt}</p>
                      ) : null}
                    </span>
                  );
                },
                div: ({ node, children, ...props }) => {
                  const htmlProps = (node?.properties || props) as Record<string, unknown>;

                  // 图片画廊布局
                  if (hasClass(htmlProps, "image-gallery")) {
                    const rawCols = String(htmlProps?.["data-cols"] || "2");
                    const cols = Math.min(parseInt(rawCols, 10) || 2, 4);
                    const colClasses: Record<number, string> = {
                      1: "grid-cols-1",
                      2: "grid-cols-1 sm:grid-cols-2",
                      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                      4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
                    };

                    insideGallery.current = true;
                    const result = (
                      <div
                        className={`image-gallery ${colClasses[cols]} grid gap-4 my-6`}
                        data-cols={String(cols)}
                      >
                        {children}
                      </div>
                    );
                    // 使用 setTimeout 确保 children 渲染完成后再重置
                    setTimeout(() => { insideGallery.current = false; }, 0);
                    return result;
                  }

                  // 图片带标题容器
                  if (hasClass(htmlProps, "image-with-caption")) {
                    return (
                      <div className="my-6 border border-border/50 rounded-xl overflow-hidden bg-card/50">
                        {children}
                      </div>
                    );
                  }

                  // 默认 div
                  return <div {...props}>{children}</div>;
                },
              }}
            >
              {processedContent}
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

/** 解析 HTML style 字符串为对象 */
function parseStyleString(style: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!style) return result;
  style.split(";").forEach((decl) => {
    const [prop, val] = decl.split(":").map((s) => s.trim());
    if (prop && val) {
      const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      result[camelProp] = val;
    }
  });
  return result;
}
