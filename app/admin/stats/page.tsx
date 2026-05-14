"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Eye, FileText, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface Stats {
  totalArticles: number;
  totalCategories: number;
  totalTags: number;
  totalViews: number;
  todayViews: number;
  yesterdayViews: number;
  popularArticles: Array<{ title: string; views: number }>;
  viewHistory: Array<{ date: string; views: number }>;
}

export default function StatsPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const viewChange = stats ? stats.todayViews - stats.yesterdayViews : 0;
  const viewChangePercent = stats && stats.yesterdayViews > 0 
    ? ((viewChange / stats.yesterdayViews) * 100).toFixed(1) 
    : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white font-serif">{t("stats.title")}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-serif">{t("stats.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("stats.title")}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("stats.todayViews")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.todayViews || 0}</div>
            <div className={`flex items-center text-xs ${viewChange >= 0 ? "text-green-400" : "text-red-400"}`}>
              {viewChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {Math.abs(Number(viewChangePercent))}% {t("stats.viewTrends")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("stats.totalViews")}
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalViews.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("stats.totalViews")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("stats.totalArticles")}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalArticles || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("stats.totalArticles")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t("stats.totalCategories")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{stats?.totalCategories || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t("stats.totalTags")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{stats?.totalTags || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t("stats.popularArticles")}
          </CardTitle>
          <CardDescription>{t("stats.popularArticles")}</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.popularArticles && stats.popularArticles.length > 0 ? (
            <div className="space-y-4">
              {stats.popularArticles.map((article, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="font-medium">{article.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{article.views.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">{t("home.noArticles")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
