"use client";

import { useState, useEffect } from "react";
import { Eye, FileText, Clock, TrendingUp, Users, Globe } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Stats {
  totalViews: number;
  totalArticles: number;
  totalCategories: number;
  popularArticles: { id: string; title: string; views: number }[];
  recentViews: { date: string; views: number }[];
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p>Loading...</p></div>;
  }

  if (!stats) {
    return <div className="flex items-center justify-center h-64"><p>Failed to load stats</p></div>;
  }

  const maxViews = Math.max(...stats.recentViews.map((d) => d.views), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Statistics</h1>
        <p className="text-muted-foreground mt-1">Track your website performance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Page Views</p>
                <h3 className="text-3xl font-bold mt-1">{stats.totalViews.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-primary/20 rounded-lg">
                <Eye className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Articles</p>
                <h3 className="text-3xl font-bold mt-1">{stats.totalArticles}</h3>
              </div>
              <div className="p-3 bg-accent/20 rounded-lg">
                <FileText className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Daily Views</p>
                <h3 className="text-3xl font-bold mt-1">
                  {Math.round(stats.totalViews / 7).toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-success/20 rounded-lg">
                <Clock className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <h3 className="text-3xl font-bold mt-1">{stats.totalCategories}</h3>
              </div>
              <div className="p-3 bg-secondary rounded-lg">
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Daily Page Views (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-3">
              {stats.recentViews.map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end" style={{ height: "200px" }}>
                    <div 
                      className="w-full bg-gradient-to-t from-primary/50 to-primary rounded-t transition-all hover:from-primary/70 hover:to-primary cursor-pointer"
                      style={{ height: `${(day.views / maxViews) * 100}%`, minHeight: day.views > 0 ? "8px" : "0" }}
                      title={`${day.views} views`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span className="text-xs font-medium">{day.views}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              Top Performing Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.popularArticles.length > 0 ? (
                stats.popularArticles.map((article, index) => (
                  <div key={article.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{article.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {article.views.toLocaleString()} views
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stats.totalViews > 0
                        ? Math.round((article.views / stats.totalViews) * 100)
                        : 0}%
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No article data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Avg. Views per Article</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.totalArticles > 0
                  ? Math.round(stats.totalViews / stats.totalArticles)
                  : 0}
              </p>
            </div>
            <div className="text-center p-6 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Best Performing Article</p>
              <p className="text-lg font-bold text-primary truncate">
                {stats.popularArticles[0]?.title || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                {stats.popularArticles[0]?.views.toLocaleString() || 0} views
              </p>
            </div>
            <div className="text-center p-6 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Content Growth</p>
              <p className="text-3xl font-bold text-success">+{stats.totalArticles}</p>
              <p className="text-sm text-muted-foreground">articles published</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
