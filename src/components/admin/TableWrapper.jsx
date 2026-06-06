import React from "react";

/**
 * Reusable wrapper for admin tables to maintain layout consistency.
 * Uses a transparent wrapper to allow individual row cards to display correctly.
 */
export default function TableWrapper({ children, pagination }) {
  return (
    <div className="w-full space-y-4">
      <div className="w-full overflow-x-auto pb-2">
        {children}
      </div>
      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
          {pagination}
        </div>
      )}
    </div>
  );
}
