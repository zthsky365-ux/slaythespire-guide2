"use client";

import Link from "next/link";
import { Layers, User, Shield, Zap, Lightbulb, TrendingUp, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Category, Article } from "@/lib/types";

interface SidebarProps {
  categories: Category[];
  popularArticles?: Article[];
}

const iconMap: Record<string, React.ReactNode> = {
  layers: <Layers className="h-4 w-4" />,
  user: <User className="h-4 w-4" />,
  shield: <Shield className="h-4 w-4" />,
  zap: <Zap className="h-4 w-4" />,
  lightbulb: <Lightbulb className="h-4 w-4" />,
};

export function Sidebar({ categories, popularArticles = [] }: SidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors group"
                >
                  <span 
                    className="p-1.5 rounded-md group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    {iconMap[category.icon] || <Layers className="h-4 w-4" />}
                  </span>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {category.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Popular Articles */}
      {popularArticles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Popular Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {popularArticles.slice(0, 5).map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <TrendingUp className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {article.viewCount.toLocaleString()} views
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {["Ironclad", "Silent", "Defect", "Cards", "Bosses", "Builds", "Combos", "Tips", "Beginner", "Advanced"].map((tag) => (
              <Link key={tag} href={`/search?tag=${tag}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/20 transition-colors">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscribe CTA */}
      <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
        <CardContent className="pt-6">
          <h3 className="font-serif font-bold text-lg mb-2">Stay Updated</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get the latest guides and strategies delivered to your inbox.
          </p>
          <Link
            href="/subscribe"
            className="block w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Subscribe Now
          </Link>
        </CardContent>
      </Card>
    </aside>
  );
}
