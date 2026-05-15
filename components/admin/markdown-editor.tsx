"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "在此输入 Markdown 内容...",
  minHeight = 400,
}: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        style={{ minHeight }}
      >
        <p className="text-muted-foreground">加载编辑器中...</p>
      </div>
    );
  }

  return (
    <div data-color-mode="dark" className="markdown-editor-wrapper">
      <style jsx global>{`
        .w-md-editor {
          background-color: hsl(var(--background)) !important;
          border: 1px solid hsl(var(--border)) !important;
        }
        .w-md-editor-text-input {
          color: hsl(var(--foreground)) !important;
        }
        .w-md-editor-text-pre {
          color: hsl(var(--foreground)) !important;
        }
        .w-md-editor-toolbar {
          background-color: hsl(var(--card)) !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
        }
        .w-md-editor-toolbar ul > li > button {
          color: hsl(var(--foreground)) !important;
        }
        .w-md-editor-toolbar ul > li > button:hover {
          background-color: hsl(var(--accent)) !important;
        }
        .w-md-editor-preview {
          background-color: hsl(var(--card)) !important;
        }
        .w-md-editor-preview .editor-preview {
          color: hsl(var(--foreground)) !important;
        }
        .w-md-editor-preview img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 16px 0;
        }
        .wmde-markdown {
          background-color: hsl(var(--background)) !important;
        }
        .wmde-markdown img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 16px 0;
        }
      `}</style>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        preview="edit"
        height={minHeight}
        textareaProps={{
          placeholder,
        }}
        style={{
          backgroundColor: "hsl(var(--background))",
        }}
      />
    </div>
  );
}
