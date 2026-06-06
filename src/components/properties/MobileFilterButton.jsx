"use client"

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import PropertyFilters from "./PropertyFilters";

export default function MobileFilterButton({ metadata }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-1.5 rounded-xl border-neutral-200 bg-white font-bold text-neutral-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-300"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] overflow-y-auto border-r border-neutral-100 bg-white p-6 dark:border-neutral-800 dark:bg-zinc-950">
          <SheetHeader className="pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <SheetTitle className="font-heading font-bold text-neutral-900 dark:text-white">
              Filter Listings
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {/* Embed the filters, and auto close the sheet on route transitions */}
            <div onClick={() => setOpen(false)}>
              <PropertyFilters metadata={metadata} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
