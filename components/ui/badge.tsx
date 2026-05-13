"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "accent" | "outline" | "destructive";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-primary/20 text-primary border border-primary/30": variant === "default",
          "bg-secondary text-secondary-foreground": variant === "secondary",
          "bg-accent/20 text-accent border border-accent/30": variant === "accent",
          "border border-border text-foreground": variant === "outline",
          "bg-destructive/20 text-destructive border border-destructive/30": variant === "destructive",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
