"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { formatCurrency, formatArea } from "@/lib/format";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import PropertyEnquiryForm from "@/components/enquiry/PropertyEnquiryForm";

export const UnitPropertyCard = ({ property }) => {
  const [isOpen, setIsOpen] = useState(false);

  const coverImage =
    property.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";

  const startingPrice =
    property.price > 0
      ? formatCurrency(property.price)
      : "Price on Request";

  return (
    <>
      <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-zinc-850 dark:bg-zinc-900/40">
        {/* Image & Price Overlay */}
        <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-zinc-800">
          <img
            src={coverImage}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Status Badge */}
          <div className="absolute right-3 top-3">
            <span
              className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold border shadow-xs ${
                property.status?.name === "Available"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                  : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
              }`}
            >
              {property.status?.name || "Available"}
            </span>
          </div>

          {/* Unit Type */}
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center rounded-lg bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
              {property.unitType || `${property.bedrooms} BHK`}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h4 className="text-base font-bold text-neutral-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {property.title}
            </h4>

            <span className="text-base font-bold text-neutral-950 dark:text-white shrink-0 font-heading">
              {startingPrice}
            </span>
          </div>

          <p className="text-xs text-neutral-400 font-medium mb-4">
            {property.propertyCode
              ? `Code: ${property.propertyCode}`
              : "Premium Inventory Unit"}
          </p>

          <div className="grid grid-cols-3 gap-2 border-t border-neutral-100 dark:border-zinc-800 pt-3.5 mb-4 text-xs font-semibold text-neutral-600 dark:text-zinc-400">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                Area Size
              </span>
              <span className="text-neutral-800 dark:text-white">
                {formatArea(property.areaSize)}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                Bedrooms
              </span>
              <span className="text-neutral-800 dark:text-white">
                {property.bedrooms} Beds
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                Bathrooms
              </span>
              <span className="text-neutral-800 dark:text-white">
                {property.bathrooms} Baths
              </span>
            </div>
          </div>

          {property.facing && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-5 font-medium">
              <Compass className="h-3.5 w-3.5 text-neutral-400" />
              <span>
                {property.facing} Facing{" "}
                {property.is_corner && "• Corner Plot"}
              </span>
            </div>
          )}

          <div className="mt-auto grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100 dark:border-zinc-800">
            <Link
              href={`/properties/${property.slug}`}
              className="block w-full"
            >
              <button className="secondary-btn w-full text-xs py-2 h-9">
                View Details
              </button>
            </Link>

            <button
              onClick={() => setIsOpen(true)}
              className="primary-btn w-full text-xs py-2 h-9"
            >
              Get Callback
            </button>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl w-[97vw] rounded-md">
          <DialogHeader>
            <DialogTitle>
              Enquire About {property.title}
            </DialogTitle>

            <DialogDescription>
              Fill out the form and our advisors will contact you shortly.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <PropertyEnquiryForm
              propertyTitle={property.title}
              onSuccess={() => setIsOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function ProjectConfigurationsTabs({ properties = [] }) {
  const [activeTab, setActiveTab] = useState("All");

  if (!properties || properties.length === 0) {
    return (
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-8 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900/30">
        <p className="text-sm text-neutral-500 dark:text-neutral-450 italic">
          No layout configurations are currently listed under this development.
        </p>
      </div>
    );
  }

  const tabs = ["All"];

  properties.forEach((prop) => {
    const type =
      prop.unitType || (prop.bedrooms ? `${prop.bedrooms} BHK` : null);

    if (type && !tabs.includes(type)) {
      tabs.push(type);
    }
  });

  tabs.sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;

    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  const filteredProperties = properties.filter((prop) => {
    if (activeTab === "All") return true;

    const type =
      prop.unitType || (prop.bedrooms ? `${prop.bedrooms} BHK` : null);

    return type === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 dark:border-zinc-800 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === tab
                ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                : "bg-slate-50 text-slate-650 hover:bg-slate-100 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:bg-zinc-900"
            }`}
          >
            {tab}
          </button>
        ))}

        <span className="text-[11px] text-neutral-400 font-semibold ml-auto hidden md:inline">
          Showing {filteredProperties.length} of {properties.length} options
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProperties.map((property) => (
          <UnitPropertyCard
            key={property.id}
            property={property}
          />
        ))}
      </div>
    </div>
  );
}