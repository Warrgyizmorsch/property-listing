"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, IndianRupee, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchSection({ purposes = [], categories = [], cities = [] }) {
  const router = useRouter();
  const [purposeId, setPurposeId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [cityId, setCityId] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const priceOptions = [
    { label: "Up to ₹25 Lakh", max: 2500000 },
    { label: "₹25 Lakh - ₹50 Lakh", min: 2500000, max: 5000000 },
    { label: "₹50 Lakh - ₹1 Crore", min: 5000000, max: 10000000 },
    { label: "₹1 Crore - ₹2 Crore", min: 10000000, max: 20000000 },
    { label: "₹2 Crore+", min: 20000000 },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Construct search URL parameters
    const params = new URLSearchParams();
    if (purposeId) params.set("purpose", purposeId);
    if (categoryId) params.set("category", categoryId);
    if (cityId) params.set("city", cityId);

    params.set("page", "1");
    
    if (priceRange) {
      const selectedRange = priceOptions[parseInt(priceRange, 10)];
      if (selectedRange.min) params.set("priceMin", selectedRange.min.toString());
      if (selectedRange.max) params.set("priceMax", selectedRange.max.toString());
    }

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl rounded-3xl border border-neutral-200/50 bg-white/90 p-5 shadow-xl backdrop-blur-lg dark:border-zinc-800/40 dark:bg-zinc-950/90 sm:p-7">
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {/* Purpose selector */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400">
            <Home className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            Purpose
          </label>
          <select
            value={purposeId}
            onChange={(e) => setPurposeId(e.target.value)}
            className="h-11 w-full rounded-xl border border-neutral-200/80 bg-white px-3 text-sm font-semibold text-neutral-800 transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-100 dark:focus:border-indigo-400 cursor-pointer"
          >
            <option value="">Any Purpose</option>
            {purposes.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category selector */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400">
            <Home className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            Property Type
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="h-11 w-full rounded-xl border border-neutral-200/80 bg-white px-3 text-sm font-semibold text-neutral-800 transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-100 dark:focus:border-indigo-400 cursor-pointer"
          >
            <option value="">Any Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location selector */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400">
            <MapPin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            Location
          </label>
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            className="h-11 w-full rounded-xl border border-neutral-200/80 bg-white px-3 text-sm font-semibold text-neutral-800 transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-100 dark:focus:border-indigo-400 cursor-pointer"
          >
            <option value="">Any Location</option>
            {cities.map((city) => (
              <option key={city.id} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range selector */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400">
            <IndianRupee className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            Price Range
          </label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="h-11 w-full rounded-xl border border-neutral-200/80 bg-white px-3 text-sm font-semibold text-neutral-800 transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-100 dark:focus:border-indigo-400 cursor-pointer"
          >
            <option value="">Any Price</option>
            {priceOptions.map((opt, idx) => (
              <option key={idx} value={idx}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search CTA Button */}
        <div className="flex items-end">
          <Button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:from-indigo-700 hover:to-violet-700 hover:shadow-indigo-300 dark:shadow-none"
          >
            <Search className="h-4 w-4" />
            Search Properties
          </Button>
        </div>
      </form>
    </div>
  );
}
