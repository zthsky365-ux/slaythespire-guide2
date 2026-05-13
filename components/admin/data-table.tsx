"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Article } from "@/lib/types";

interface DataTableProps {
  data: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (article: Article) => void;
}

export function DataTable({ data, onEdit, onDelete, onToggleStatus }: DataTableProps) {
  const statusColors = {
    published: "default",
    draft: "secondary",
    archived: "outline",
  } as const;

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full">
        <thead className="bg-card">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Title</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Views</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item) => (
            <tr key={item.id} className="bg-background hover:bg-card/50 transition-colors">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-foreground line-clamp-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{item.excerpt}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant={statusColors[item.status]}>
                  {item.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {item.viewCount.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {formatDate(item.publishedAt || item.createdAt)}
              </td>
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(item)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(item)}>
                      {item.status === "published" ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Publish
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(item.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
