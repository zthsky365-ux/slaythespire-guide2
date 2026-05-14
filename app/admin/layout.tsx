"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LanguageProvider } from "@/components/language-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </LanguageProvider>
  );
}
