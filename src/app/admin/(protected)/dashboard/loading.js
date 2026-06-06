import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Dashboard skeleton loader screen shown during server side counts and fetches.
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5 border-neutral-200/80 mb-6">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded bg-neutral-200"></div>
          <div className="h-4 w-72 rounded bg-neutral-200"></div>
        </div>
      </div>

      {/* 2. Grid of Cards Skeletons */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 rounded bg-neutral-200"></div>
              <div className="h-8 w-8 rounded bg-neutral-100"></div>
            </div>
            <div className="h-8 w-12 rounded bg-neutral-200"></div>
            <div className="h-3.5 w-32 rounded bg-neutral-100"></div>
          </div>
        ))}
      </div>

      {/* 3. Recent Enquiries Section Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-36 rounded bg-neutral-200"></div>
        
        {/* Table container skeleton */}
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-24 rounded bg-neutral-200"></div>
            ))}
          </div>
          <div className="space-y-3 pt-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                <div className="h-4 w-28 rounded bg-neutral-200"></div>
                <div className="h-4 w-32 rounded bg-neutral-100"></div>
                <div className="h-4 w-20 rounded bg-neutral-100"></div>
                <div className="h-4 w-40 rounded bg-neutral-200"></div>
                <div className="h-6 w-16 rounded-full bg-neutral-100"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
