import { ArticleCard } from "./article-card";
import type { Article, Category } from "@/lib/types";

interface ArticleGridProps {
  articles: Article[];
  categories: Category[];
  showFeatured?: boolean;
}

export function ArticleGrid({ articles, categories, showFeatured = true }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">No articles found.</p>
      </div>
    );
  }

  const getCategoryById = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const featuredArticle = showFeatured && articles.length > 0 ? articles[0] : null;
  const regularArticles = showFeatured && featuredArticle 
    ? articles.slice(1) 
    : articles;

  return (
    <div className="space-y-8">
      {/* Featured Article */}
      {featuredArticle && (
        <div className="animate-fade-in">
          <ArticleCard 
            article={featuredArticle} 
            category={getCategoryById(featuredArticle.categoryId)}
            featured 
          />
        </div>
      )}

      {/* Article Grid */}
      {regularArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map((article, index) => (
            <div 
              key={article.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ArticleCard 
                article={article} 
                category={getCategoryById(article.categoryId)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
