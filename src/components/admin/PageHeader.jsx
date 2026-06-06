import React from "react";

/**
 * Reusable page header for admin sub-routes.
 * @param {object} props
 * @param {string} props.title - Main header title.
 * @param {string} [props.description] - Sub-header description.
 * @param {React.ReactNode} [props.children] - Slot for page actions (e.g. Add buttons).
 */
export default function PageHeader({ title, description, children }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5 border-neutral-200/80 mb-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
        {description && (
          <p className="text-sm text-neutral-500">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
