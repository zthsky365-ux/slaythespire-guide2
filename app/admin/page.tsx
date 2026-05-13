import Link from "next/link";
import { FileText, Eye, FolderTree, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/admin/stats-card";
import { getSiteStats, getArticles, getCategories } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function AdminDashboard() {
  const [stats, articles, categories] = await Promise.all([
    getSiteStats(),
    getArticles(),
    getCategories(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Articles"
          value={stats.totalArticles}
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          icon={Eye}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Categories"
          value={stats.totalCategories}
          icon={FolderTree}
        />
        <StatsCard
          title="Avg. Daily Views"
          value={Math.round(stats.totalViews / 7)}
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Popular Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.popularArticles.length > 0 ? (
                stats.popularArticles.map((article, index) => (
                  <div key={article.id} className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-muted-foreground w-8">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{article.title}</p>
                      <p className="text-sm text-muted-foreground">{article.views.toLocaleString()} views</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No articles yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/admin/articles"
                className="p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <FileText className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium">Manage Articles</p>
                <p className="text-sm text-muted-foreground">{articles.length} total</p>
              </Link>
              <Link
                href="/admin/categories"
                className="p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <FolderTree className="h-8 w-8 text-accent mb-2" />
                <p className="font-medium">Categories</p>
                <p className="text-sm text-muted-foreground">{categories.length} categories</p>
              </Link>
              <Link
                href="/admin/ads"
                className="p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <TrendingUp className="h-8 w-8 text-success mb-2" />
                <p className="font-medium">Ad Placements</p>
                <p className="text-sm text-muted-foreground">Manage ads</p>
              </Link>
              <Link
                href="/admin/stats"
                className="p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Eye className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium">Statistics</p>
                <p className="text-sm text-muted-foreground">View analytics</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Views Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Views Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end gap-2">
            {stats.recentViews.map((day, index) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-primary/30 rounded-t transition-all hover:bg-primary/50"
                  style={{ height: `${Math.max((day.views / Math.max(...stats.recentViews.map(d => d.views), 1)) * 100, 4)}%` }}
                />
                <span className="text-xs text-muted-foreground">
                  {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
