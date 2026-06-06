"use client";

import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * Google Search Snippet Preview Component.
 * Emulates how metadata appears in Google search engine result pages (SERPs).
 */
export default function SeoPreview({ title, description, slug = "", pageType = "HOME" }) {
  const domain = typeof window !== "undefined" ? window.location.origin : "https://www.yourdomain.com";
  
  // Resolve path prefix based on page type
  let path = "";
  if (pageType === "PROPERTY") {
    path = `/properties/${slug || "luxury-villa-sample"}`;
  } else if (pageType === "PROPERTY_LISTING") {
    path = "/properties";
  } else if (pageType === "HOME") {
    path = "/";
  } else {
    path = `/${pageType.toLowerCase().replace(/_/g, "-")}`;
  }

  const url = `${domain}${path}`;

  // Length calculations
  const titleLength = title?.length || 0;
  const descLength = description?.length || 0;

  const isTitleOver = titleLength > 60;
  const isDescOver = descLength > 160;

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5 shadow-inner">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Google Search Snippet Preview
        </h4>
        <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-200">
          Desktop View
        </span>
      </div>

      {/* Simulated SERP Card */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        {/* Site branding and breadcrumb URL */}
        <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 border border-slate-200">
            W
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold leading-none text-slate-800">
              Warrgyizmorsch Properties
            </span>
            <span className="text-[10px] text-slate-400 leading-none">
              {url}
            </span>
          </div>
        </div>

        {/* Title Link */}
        <h3 className="cursor-pointer text-xl font-medium text-[#1a0dab] hover:underline break-words line-clamp-1 leading-snug">
          {title || "Please enter a meta title"}
        </h3>

        {/* Description Snippet */}
        <p className="mt-1 text-sm text-[#4d5156] line-clamp-2 break-words leading-relaxed">
          {description || "Please enter a meta description. Beautiful property with all modern amenities in a highly desirable prime location."}
        </p>
      </div>

      {/* Dynamic Count Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {/* Title Meter */}
        <div className="rounded-lg bg-white p-3 border border-slate-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">Meta Title Length</span>
            <span className={`font-mono font-bold ${isTitleOver ? "text-red-500" : "text-emerald-600"}`}>
              {titleLength} / 60
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isTitleOver ? "bg-red-500" : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }}
            />
          </div>
          <div className="flex items-center gap-1.5 pt-1 text-[11px]">
            {isTitleOver ? (
              <>
                <AlertCircle className="h-3 w-3 text-red-500 shrink-0" />
                <span className="text-red-500">Too long (aim for &le; 60 chars)</span>
              </>
            ) : titleLength === 0 ? (
              <>
                <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
                <span className="text-amber-500">Empty (will use auto fallback)</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                <span className="text-emerald-600">Optimal length</span>
              </>
            )}
          </div>
        </div>

        {/* Description Meter */}
        <div className="rounded-lg bg-white p-3 border border-slate-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">Meta Description Length</span>
            <span className={`font-mono font-bold ${isDescOver ? "text-red-500" : "text-emerald-600"}`}>
              {descLength} / 160
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isDescOver ? "bg-red-500" : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min((descLength / 160) * 100, 100)}%` }}
            />
          </div>
          <div className="flex items-center gap-1.5 pt-1 text-[11px]">
            {isDescOver ? (
              <>
                <AlertCircle className="h-3 w-3 text-red-500 shrink-0" />
                <span className="text-red-500">Too long (aim for &le; 160 chars)</span>
              </>
            ) : descLength === 0 ? (
              <>
                <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
                <span className="text-amber-500">Empty (will use auto fallback)</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                <span className="text-emerald-600">Optimal length</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
