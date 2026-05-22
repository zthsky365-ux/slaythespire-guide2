"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Image, Columns, LayoutGrid, Rows, Ruler } from "lucide-react";

// Dynamically import to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

/** 获取 textarea 引用 */
function getTextarea(): HTMLTextAreaElement | null {
  return document.querySelector(".w-md-editor-text-input") as HTMLTextAreaElement | null;
}

/** 在光标位置插入模板文本 */
function insertAtCursor(before: string, after: string, onChange: (v: string) => void) {
  const textarea = getTextarea();
  if (!textarea) return;
  const { selectionStart: start, selectionEnd: end } = textarea;
  const value = textarea.value;
  const selected = value.substring(start, end);
  const newValue = value.substring(0, start) + before + selected + after + value.substring(end);
  onChange(newValue);
  setTimeout(() => {
    textarea.focus();
    const newPos = start + before.length + selected.length;
    textarea.setSelectionRange(newPos, newPos);
  }, 0);
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

  const insertSingleImage = () => {
    insertAtCursor('\n![图片描述](https://example.com/image.jpg)\n', '', onChange);
  };

  const insertRow2 = () => {
    insertAtCursor(
      '\n<div class="image-gallery" data-cols="2">\n\n![描述1](URL1)\n\n![描述2](URL2)\n\n</div>\n',
      '', onChange);
  };

  const insertRow3 = () => {
    insertAtCursor(
      '\n<div class="image-gallery" data-cols="3">\n\n![描述1](URL1)\n\n![描述2](URL2)\n\n![描述3](URL3)\n\n</div>\n',
      '', onChange);
  };

  const insertRow4 = () => {
    insertAtCursor(
      '\n<div class="image-gallery" data-cols="4">\n\n![描述1](URL1)\n\n![描述2](URL2)\n\n![描述3](URL3)\n\n![描述4](URL4)\n\n</div>\n',
      '', onChange);
  };

  const insertSizedImage = () => {
    insertAtCursor(
      '\n<img src="https://example.com/image.jpg" alt="描述" style="width:60%;" />\n',
      '', onChange);
  };

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
        /* ===== 图片画廊 — 编辑器预览 ===== */
        .wmde-markdown .image-gallery {
          display: grid;
          gap: 12px;
          margin: 24px 0;
        }
        .wmde-markdown .image-gallery[data-cols="2"] {
          grid-template-columns: repeat(2, 1fr);
        }
        .wmde-markdown .image-gallery[data-cols="3"] {
          grid-template-columns: repeat(3, 1fr);
        }
        .wmde-markdown .image-gallery[data-cols="4"] {
          grid-template-columns: repeat(4, 1fr);
        }
        .wmde-markdown .image-gallery img {
          margin: 0;
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        /* ===== 图片布局快速按钮区域 ===== */
        .image-layout-toolbar {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background-color: hsl(var(--card));
          border-bottom: 1px solid hsl(var(--border));
          flex-wrap: wrap;
        }
        .image-layout-toolbar .toolbar-label {
          font-size: 11px;
          color: hsl(var(--muted-foreground));
          display: flex;
          align-items: center;
          padding: 0 4px;
          user-select: none;
        }
        .image-layout-toolbar .toolbar-divider {
          width: 1px;
          height: 20px;
          background: hsl(var(--border));
          margin: 0 4px;
        }
        .image-layout-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 12px;
          color: hsl(var(--muted-foreground));
          background: transparent;
          border: 1px solid hsl(var(--border));
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .image-layout-btn:hover {
          color: hsl(var(--foreground));
          background: hsl(var(--secondary));
          border-color: hsl(var(--primary));
        }
        .image-layout-btn svg {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }
      `}</style>

      {/* 自定义图片布局工具栏 */}
      <div className="image-layout-toolbar">
        <span className="toolbar-label">🖼️ 图片布局:</span>
        <button className="image-layout-btn" onClick={insertSingleImage} title="插入单张图片（全宽显示）">
          <Image className="h-4 w-4" />
          <span>单张</span>
        </button>
        <button className="image-layout-btn" onClick={insertRow2} title="两列并排图片">
          <Columns className="h-4 w-4" />
          <span>两列</span>
        </button>
        <button className="image-layout-btn" onClick={insertRow3} title="三列并排图片">
          <LayoutGrid className="h-4 w-4" />
          <span>三列</span>
        </button>
        <button className="image-layout-btn" onClick={insertRow4} title="四列并排图片">
          <Rows className="h-4 w-4" />
          <span>四列</span>
        </button>
        <span className="toolbar-divider" />
        <button className="image-layout-btn" onClick={insertSizedImage} title="插入可自定义大小的图片（带 style）">
          <Ruler className="h-4 w-4" />
          <span>自定义大小</span>
        </button>
      </div>

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
