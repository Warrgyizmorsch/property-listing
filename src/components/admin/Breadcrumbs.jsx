'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

/**
 * Dynamic breadcrumb navigation that parses the active window pathname.
 */
export default function Breadcrumbs() {
  const pathname = usePathname();

  // Split path into segments and remove empty parts
  const segments = pathname.split("/").filter(Boolean);

  // If path is root or just "/admin", render basic home indicator
  if (segments.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500 mb-5">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-1 text-neutral-400 hover:text-neutral-900 transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {segments.map((segment, index) => {
        // Skip rendering the first "admin" parent segment as it maps to Home/Dashboard links
        if (segment === "admin") return null;

        const isLast = index === segments.length - 1;
        const href = `/${segments.slice(0, index + 1).join("/")}`;

        // Format segment names (e.g. "property-statuses" -> "Property Statuses")
        const label = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        return (
          <React.Fragment key={segment}>
            <ChevronRight className="h-3 w-3 text-neutral-300 shrink-0" />
            {isLast ? (
              <span className="font-medium text-neutral-900 truncate" aria-current="page">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-neutral-900 transition-colors truncate"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
