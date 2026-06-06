"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

export default function PropertySort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "latest";

  const handleSortChange = (e) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "latest") {
      params.set("sortBy", value);
    } else {
      params.delete("sortBy");
    }
    params.set("page", "1"); // Reset to page 1 on sort change
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <SlidersHorizontal className="h-4 w-4 text-neutral-400 shrink-0" />
      <select
        value={sortBy}
        onChange={handleSortChange}
        className="h-10 rounded-xl border border-neutral-200 bg-white px-3 py-1 text-sm font-semibold text-neutral-800 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-100 cursor-pointer"
      >
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
