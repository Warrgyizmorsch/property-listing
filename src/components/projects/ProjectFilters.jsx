"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  MapPin,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ProjectFilters({ metadata = {} }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state to manage hierarchical location select cascades
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");

  // Extract metadata lists with safe fallbacks
  const { categories = [], countries = [], states = [], cities = [] } = metadata;

  // Sync cascading select initial states based on URL query parameters
  useEffect(() => {
    const countrySlug = searchParams.get("country");
    const stateSlug = searchParams.get("state");

    if (countrySlug) {
      const countryObj = countries.find((c) => c.slug === countrySlug);
      if (countryObj) {
        setSelectedCountryId(countryObj.id);
      }
    } else {
      setSelectedCountryId("");
    }

    if (stateSlug) {
      const stateObj = states.find((s) => s.slug === stateSlug);
      if (stateObj) {
        setSelectedStateId(stateObj.id);
      }
    } else {
      setSelectedStateId("");
    }
  }, [searchParams, countries, states]);

  // Read current URL parameter settings
  const currentCategory = searchParams.get("category") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentCountry = searchParams.get("country") || "";
  const currentState = searchParams.get("state") || "";
  const currentCity = searchParams.get("city") || "";
  const currentIsFeatured = searchParams.get("isFeatured") === "true";

  // Updates single parameter in URL and resets pagination page index
  const updateQueryParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset pagination
    router.push(`/projects?${params.toString()}`);
  };

  // Updates cascading location filters cleanly
  const handleCountryChange = (e) => {
    const slug = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (slug) {
      params.set("country", slug);
      const countryObj = countries.find((c) => c.slug === slug);
      setSelectedCountryId(countryObj?.id || "");
    } else {
      params.delete("country");
      setSelectedCountryId("");
    }

    // Clear child state and city params when country changes
    params.delete("state");
    params.delete("city");
    setSelectedStateId("");
    params.set("page", "1");
    router.push(`/projects?${params.toString()}`);
  };

  const handleStateChange = (e) => {
    const slug = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (slug) {
      params.set("state", slug);
      const stateObj = states.find((s) => s.slug === slug);
      setSelectedStateId(stateObj?.id || "");
    } else {
      params.delete("state");
      setSelectedStateId("");
    }

    // Clear child city param when state changes
    params.delete("city");
    params.set("page", "1");
    router.push(`/projects?${params.toString()}`);
  };

  const handleCityChange = (e) => {
    updateQueryParam("city", e.target.value);
  };

  // Filters location records dynamically for cascaded dropdown selections
  const filteredStates = selectedCountryId
    ? states.filter((s) => s.countryId === selectedCountryId)
    : [];

  const filteredCities = selectedStateId
    ? cities.filter((c) => c.stateId === selectedStateId)
    : [];

  const handleReset = () => {
    setSelectedCountryId("");
    setSelectedStateId("");
    router.push("/projects");
  };

  return (
    <div className="flex flex-col gap-6 py-1">
      {/* 1. Project Category (Type) */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          <Home className="h-3.5 w-3.5" />
          Project Type
        </Label>
        <select
          value={currentCategory}
          onChange={(e) => updateQueryParam("category", e.target.value)}
          className="h-10 w-full rounded-xl border border-neutral-200/80 bg-white px-3 text-sm font-semibold text-neutral-800 transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-100 dark:focus:border-indigo-400 cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name} ({c._count?.projects ?? 0})
            </option>
          ))}
        </select>
      </div>

      {/* 2. Project Status */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          <Sparkles className="h-3.5 w-3.5" />
          Project Status
        </Label>
        <select
          value={currentStatus}
          onChange={(e) => updateQueryParam("status", e.target.value)}
          className="h-10 w-full rounded-xl border border-neutral-200/80 bg-white px-3 text-sm font-semibold text-neutral-800 transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-100 dark:focus:border-indigo-400 cursor-pointer"
        >
          <option value="">Any Status</option>
          <option value="ONGOING">Ongoing</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* 3. Cascading Locations (Country -> State -> City) */}
      <div className="space-y-4 border-t border-neutral-100 pt-4 dark:border-neutral-850">
        <Label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          <MapPin className="h-3.5 w-3.5" />
          Location
        </Label>

        {/* Country Select */}
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
            Country
          </span>
          <select
            value={currentCountry}
            onChange={handleCountryChange}
            className="h-9.5 w-full rounded-xl border border-neutral-200/80 bg-white px-3 text-xs font-semibold text-neutral-800 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-100 cursor-pointer"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* State Select */}
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
            State
          </span>
          <select
            value={currentState}
            onChange={handleStateChange}
            disabled={!selectedCountryId}
            className="h-9.5 w-full rounded-xl border border-neutral-200/80 bg-white px-3 text-xs font-semibold text-neutral-800 disabled:opacity-50 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-100 cursor-pointer"
          >
            <option value="">Select State</option>
            {filteredStates.map((s) => (
              <option key={s.id} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* City Select */}
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
            City
          </span>
          <select
            value={currentCity}
            onChange={handleCityChange}
            disabled={!selectedStateId}
            className="h-9.5 w-full rounded-xl border border-neutral-200/80 bg-white px-3 text-xs font-semibold text-neutral-800 disabled:opacity-50 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-100 cursor-pointer"
          >
            <option value="">Select City</option>
            {filteredCities.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Featured Projects */}
      <div className="flex items-center gap-2.5 border-t border-neutral-100 pt-4 dark:border-neutral-850">
        <input
          id="isFeatured"
          type="checkbox"
          checked={currentIsFeatured}
          onChange={(e) =>
            updateQueryParam("isFeatured", e.target.checked ? "true" : "")
          }
          className="h-4.5 w-4.5 rounded-lg border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
        <label
          htmlFor="isFeatured"
          className="text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer select-none"
        >
          Show Featured Projects Only
        </label>
      </div>

      {/* 5. Reset Button */}
      <Button
        onClick={handleReset}
        variant="outline"
        className="mt-4 gap-2 w-full font-bold text-neutral-700 hover:text-indigo-600 dark:text-neutral-300 dark:hover:text-indigo-400 border-neutral-200 dark:border-zinc-800 cursor-pointer"
      >
        <RotateCcw className="h-4 w-4" />
        Reset Filters
      </Button>
    </div>
  );
}
