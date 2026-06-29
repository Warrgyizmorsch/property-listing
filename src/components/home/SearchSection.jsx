"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function SearchSection({ categories = [], cities = [] }) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [cityId, setCityId] = useState("");
  const [status, setStatus] = useState(""); // ONGOING | UPCOMING | COMPLETED | ""

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (keyword.trim()) params.set("search", keyword.trim());
    if (categoryId) params.set("category", categoryId);
    if (cityId) params.set("city", cityId);
    if (status) params.set("status", status);
    params.set("page", "1");

    router.push(`/projects?${params.toString()}`);
  };

  const statusOptions = [
    { label: "All Statuses", value: "" },
    { label: "Ongoing", value: "ONGOING" },
    { label: "Upcoming", value: "UPCOMING" },
    { label: "Completed", value: "COMPLETED" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-[var(--brand-border)] bg-white/95 p-6 shadow-2xl backdrop-blur-lg dark:border-[var(--brand-border)] dark:bg-zinc-950/95 sm:p-8 animate-fade-in-up">
      {/* Status Filter Tabs */}
      <div className="flex border-b border-neutral-100 dark:border-zinc-850 pb-4 mb-6 gap-2 overflow-x-auto select-none">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setStatus(opt.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${status === opt.value
                ? "bg-[var(--brand-primary)] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="grid grid-cols-1 gap-5 md:grid-cols-4 items-end">
        {/* Keyword Search */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-[var(--brand-secondary)]" />
            Search Keyword
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Prestige, Landmark"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="h-11 w-full rounded-xl border border-neutral-200/85 bg-white pl-3 pr-8 text-sm font-semibold text-neutral-800 brand-focus dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-100"
            />
          </div>
        </div>

        {/* Category Selector */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400">
            <Building className="h-3.5 w-3.5 text-[var(--brand-secondary)]" />
            Project Type
          </label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Any Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Category</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Selector */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400">
            <MapPin className="h-3.5 w-3.5 text-[var(--brand-secondary)]" />
            Location
          </label>
          <Select value={cityId} onValueChange={setCityId}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Any Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Location</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.slug}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search CTA Button */}
        <div>
          <Button
            type="submit"
            className="primary-btn w-full h-11"
          >
            <Search className="h-4 w-4" />
            Search Projects
          </Button>
        </div>
      </form>
    </div>
  );
}
