"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import SeoForm from "@/components/seo/SeoForm";
import {
  Home,
  Search,
  User,
  Phone,
  ShieldCheck,
  Scale,
  HelpCircle,
} from "lucide-react";

const SEO_TABS = [
  { id: "HOME", label: "Homepage", icon: Home },
  { id: "PROPERTY_LISTING", label: "Listing Page", icon: Search },
  { id: "ABOUT", label: "About Page", icon: User },
  { id: "CONTACT", label: "Contact Page", icon: Phone },
  { id: "PRIVACY_POLICY", label: "Privacy Policy", icon: ShieldCheck },
  { id: "TERMS", label: "Terms Page", icon: Scale },
  { id: "FAQ", label: "FAQ Page", icon: HelpCircle },
];

export default function SeoTabsContainer({ currentTab, initialData }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (tabId) => {
    router.push(`${pathname}?tab=${tabId}`);
  };

  return (
    <div className="space-y-6">
      {/* Scrollable Tab bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {SEO_TABS.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = currentTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg tracking-wide border transition-all shrink-0 uppercase ${
                isActive
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <IconComponent className="h-4 w-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SEO Form Container */}
      <div className="mt-2">
        <SeoForm
          key={currentTab} // Force re-render when switching tabs to reset react-hook-form
          pageType={currentTab}
          initialData={initialData}
        />
      </div>
    </div>
  );
}
