"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function ProjectSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "latest";

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "latest") {
      params.set("sortBy", value);
    } else {
      params.delete("sortBy");
    }
    params.set("page", "1"); // Reset to page 1 on sort change
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <SlidersHorizontal className="h-4 w-4 text-neutral-400 shrink-0" />
      <Select value={sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="h-10 w-[240px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Latest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="order">Display Order</SelectItem>
          <SelectItem value="price-asc">Starting Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Starting Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
