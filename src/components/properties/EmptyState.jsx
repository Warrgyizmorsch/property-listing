import Link from "next/link";
import { SearchX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-400 dark:bg-zinc-850 dark:text-zinc-500 shadow-xs">
        <SearchX className="h-7 w-7" />
      </div>
      
      <h3 className="mt-6 text-lg font-bold text-neutral-900 dark:text-white">
        No Properties Match Your Criteria
      </h3>
      
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-sm leading-6">
        We couldn't find any listings matching your active filters. Try adjusting your search query, expanding the price range, or selecting another location.
      </p>
      
      <div className="mt-8">
        <Link href="/properties">
          <Button className="gap-2 bg-indigo-600 font-semibold text-white hover:bg-indigo-700">
            <RotateCcw className="h-4 w-4" />
            Clear All Filters
          </Button>
        </Link>
      </div>
    </div>
  );
}
