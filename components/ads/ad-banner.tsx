"use client";

import { useState } from "react";
import type { AdPlacement } from "@/lib/types";

interface AdBannerProps {
  placement: AdPlacement;
}

export function AdBanner({ placement }: AdBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!placement.enabled) {
    return null;
  }

  const sizeStyles: Record<string, string> = {
    "728x90": "h-[90px] w-full max-w-[728px]",
    "300x250": "h-[250px] w-[300px]",
    "300x600": "h-[600px] w-[300px]",
    "320x50": "h-[50px] w-full max-w-[320px]",
  };

  const containerStyle = sizeStyles[placement.size] || "h-[250px] w-[300px]";

  return (
    <div 
      className={`${containerStyle} mx-auto bg-secondary/50 rounded-lg border border-border overflow-hidden flex items-center justify-center`}
      data-ad-position={placement.position}
      data-ad-size={placement.size}
    >
      {placement.code ? (
        <div dangerouslySetInnerHTML={{ __html: placement.code }} />
      ) : (
        <div className="text-center p-4">
          {!isLoaded && !hasError && (
            <div className="animate-pulse-subtle text-muted-foreground text-sm">
              Loading advertisement...
            </div>
          )}
          {hasError && (
            <div className="text-muted-foreground text-xs">
              Ad could not be displayed
            </div>
          )}
          {/* Placeholder for Google AdSense */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded p-4">
            <span className="text-gray-400 text-xs">Advertisement</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface AdSidebarProps {
  placement: AdPlacement | null;
}

export function AdSidebar({ placement }: AdSidebarProps) {
  if (!placement || !placement.enabled) {
    return null;
  }

  return (
    <div className="mb-6">
      <AdBanner placement={placement} />
    </div>
  );
}

interface AdContentProps {
  placement: AdPlacement | null;
}

export function AdContent({ placement }: AdContentProps) {
  if (!placement || !placement.enabled) {
    return null;
  }

  return (
    <div className="my-8">
      <AdBanner placement={placement} />
    </div>
  );
}
