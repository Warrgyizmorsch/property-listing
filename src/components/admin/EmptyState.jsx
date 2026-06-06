import React from "react";
import { Search } from "lucide-react";

/**
 * Reusable empty state display for listing tables or search directories.
 * @param {object} props
 * @param {React.ReactNode} [props.icon] - Icon override.
 * @param {string} props.title - Main header.
 * @param {string} props.description - Detailed action guidance.
 * @param {React.ReactNode} [props.children] - Optional slot for CTA buttons.
 */
export default function EmptyState({ icon, title, description, children }) {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50 text-neutral-400 mb-4">
        {icon || <Search className="h-6 w-6" />}
      </div>
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 text-sm text-neutral-500 max-w-sm mb-6">{description}</p>
      {children && (
        <div className="flex items-center justify-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
