"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, User, Shield, Globe, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function SettingsPage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [siteName, setSiteName] = useState("Slay the Spire 2 Guide");
  const [siteDescription, setSiteDescription] = useState("Your ultimate guide to Slay the Spire 2");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetch("/api/auth/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.email) setProfile(data);
      })
      .catch(() => {});
    
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.siteName) setSiteName(data.siteName);
        if (data.siteDescription) setSiteDescription(data.siteDescription);
        if (data.notificationEmail) setNotificationEmail(data.notificationEmail);
      })
      .catch(() => {});
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: t("auth.passwordMismatch") });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: t("auth.passwordTooShort") });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: t("auth.passwordChanged") });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || t("auth.currentPasswordIncorrect") });
      }
    } catch {
      setMessage({ type: "error", text: t("messages.networkError") });
    }
    setSaving(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteName, siteDescription, notificationEmail }),
      });
      
      if (res.ok) {
        setMessage({ type: "success", text: t("settings.settingsSaved") });
      } else {
        setMessage({ type: "error", text: t("messages.operationFailed") });
      }
    } catch {
      setMessage({ type: "error", text: t("messages.networkError") });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-serif">{t("settings.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("settings.title")}</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
          {message.text}
        </div>
      )}

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("settings.profile")}
          </CardTitle>
          <CardDescription>{t("settings.profileDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">{t("user.username")}</label>
              <Input value={profile?.name || ""} disabled />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">{t("user.email")}</label>
              <Input value={profile?.email || ""} disabled />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">{t("user.role")}</label>
            <Input value={profile?.role || ""} disabled className="capitalize" />
          </div>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("settings.changePassword")}
          </CardTitle>
          <CardDescription>{t("settings.changePasswordDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">{t("auth.currentPassword")}</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t("auth.currentPassword")}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("auth.newPassword")}</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("auth.newPassword")}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("auth.confirmPassword")}</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("auth.confirmPassword")}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
              {t("auth.changePassword")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Site Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t("settings.siteSettings")}
          </CardTitle>
          <CardDescription>{t("settings.siteSettingsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">{t("settings.siteName")}</label>
            <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder={t("settings.siteName")} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">{t("settings.siteDescription")}</label>
            <Input value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} placeholder={t("settings.siteDescription")} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">{t("settings.notificationEmail")}</label>
            <Input type="email" value={notificationEmail} onChange={(e) => setNotificationEmail(e.target.value)} placeholder="email@example.com" />
          </div>
          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {t("settings.saveSettings")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
