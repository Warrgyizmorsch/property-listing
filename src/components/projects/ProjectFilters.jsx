"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  MapPin,
  Sparkles,
  RotateCcw,
  BedDouble,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
  const currentBhk = searchParams.get("bhk") || "";
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
        <Select value={currentCategory} onValueChange={(val) => updateQueryParam("category", val)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.name} ({c._count?.projects ?? 0})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 2. Project Status */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          <Sparkles className="h-3.5 w-3.5" />
          Project Status
        </Label>
        <Select value={currentStatus} onValueChange={(val) => updateQueryParam("status", val)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Any Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Status</SelectItem>
            <SelectItem value="ONGOING">Ongoing</SelectItem>
            <SelectItem value="UPCOMING">Upcoming</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 3. BHK Configuration */}
      <div className="space-y-2 border-t border-neutral-100 pt-4 dark:border-neutral-850">
        <Label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          <BedDouble className="h-3.5 w-3.5" />
          BHK Configuration
        </Label>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "1 BHK", value: "1" },
            { label: "2 BHK", value: "2" },
            { label: "3 BHK", value: "3" },
            { label: "4+ BHK", value: "4" },
          ].map((option) => {
            const isActive = currentBhk === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateQueryParam("bhk", isActive ? "" : option.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer border select-none ${
                  isActive
                    ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-sm"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 dark:bg-zinc-900 dark:text-neutral-300 dark:border-zinc-700 dark:hover:bg-zinc-800"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Cascading Locations (Country -> State -> City) */}
      <div className="space-y-4 border-t border-neutral-100 pt-4 dark:border-neutral-850">
        <Label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          <MapPin className="h-3.5 w-3.5" />
          Location
        </Label>

        {/* Country Select */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Country
          </span>
          <Select value={currentCountry} onValueChange={(val) => handleCountryChange({ target: { value: val } })}>
            <SelectTrigger className="h-9.5">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Select Country</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c.id} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* State Select */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            State
          </span>
          <Select
            value={currentState}
            onValueChange={(val) => handleStateChange({ target: { value: val } })}
            disabled={!selectedCountryId}
          >
            <SelectTrigger className="h-9.5">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Select State</SelectItem>
              {filteredStates.map((s) => (
                <SelectItem key={s.id} value={s.slug}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City Select */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            City
          </span>
          <Select
            value={currentCity}
            onValueChange={(val) => handleCityChange({ target: { value: val } })}
            disabled={!selectedStateId}
          >
            <SelectTrigger className="h-9.5">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Select City</SelectItem>
              {filteredCities.map((c) => (
                <SelectItem key={c.id} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          className="h-4.5 w-4.5 rounded-lg border-neutral-300 text-[var(--brand-primary)] focus:ring-[var(--brand-secondary)] cursor-pointer"
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
        className="secondary-btn group mt-4 gap-2 w-full h-9.5 text-xs font-bold shadow-sm rounded-xl cursor-pointer"
      >
        <RotateCcw className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-360" />
        Reset Filters
      </Button>
    </div>
  );
}
