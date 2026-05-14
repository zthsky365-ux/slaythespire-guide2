"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye, FolderTree, Tags, TrendingUp, Sword } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface Stats {
  totalArticles: number;
  totalCategories: number;
  totalTags: number;
  totalViews: number;
  todayViews: number;
  popularArticles: Array<{ title: string; views: number }>;
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    totalArticles: 0,
    totalCategories: 0,
    totalTags: 0,
    totalViews: 0,
    todayViews: 0,
    popularArticles: [],
  });
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

  const statCards = [
    {
      title: t("stats.totalArticles"),
      value: stats.totalArticles,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: t("stats.totalViews"),
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-green-500",
    },
    {
      title: t("stats.todayViews"),
      value: stats.todayViews,
      icon: TrendingUp,
      color: "text-amber-500",
    },
    {
      title: t("stats.totalCategories"),
      value: stats.totalCategories,
      icon: FolderTree,
      color: "text-purple-500",
    },
    {
      title: t("stats.totalTags"),
      value: stats.totalTags,
      icon: Tags,
      color: "text-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-serif">{t("common.dashboard")}</h1>
        <p className="text-muted-foreground mt-1">{t("home.heroDescription")}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Popular Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sword className="h-5 w-5" />
                {t("stats.popularArticles")}
              </CardTitle>
              <CardDescription>
                {t("stats.popularArticles")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.popularArticles.length > 0 ? (
                <div className="space-y-4">
                  {stats.popularArticles.slice(0, 5).map((article, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-sm">{index + 1}.</span>
                        <span className="font-medium">{article.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {article.views.toLocaleString()} {t("article.views")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">{t("home.noArticles")}</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
