'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Tags,
  MapPin,
  Mail,
  Settings,
  Building,
  Activity
} from "lucide-react";

// Sidebar navigation routes configuration
export const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Properties",
    href: "/admin/properties",
    icon: Building,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    name: "Locations",
    href: "/admin/locations",
    icon: MapPin,
  },
  {
    name: "Enquiries",
    href: "/admin/enquiries",
    icon: Mail,
  },
  {
    name: "Statuses",
    href: "/admin/settings", // Redirects to statuses/badge settings configuration
    icon: Activity,
  },
  {
    name: "SEO Settings",
    href: "/admin/seo",
    icon: Settings,
  }
];

/**
 * Reusable Admin Sidebar Component.
 * Supports path highlighting.
 */
export default function Sidebar({ className = "" }) {
  const pathname = usePathname();

  return (
    <aside className={`flex h-full w-64 flex-col bg-neutral-900 text-white ${className}`}>
      {/* Sidebar Header Brand */}
      <div className="flex h-16 items-center border-b border-neutral-800 px-6 gap-2 shrink-0">
        <Home className="h-6 w-6 text-neutral-400" />
        <span className="text-lg font-bold tracking-tight text-white">
          RealEstate <span className="font-light text-neutral-400">Admin</span>
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/admin/dashboard" 
            ? pathname === item.href 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3.5 rounded-md px-3.5 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:bg-neutral-800/40 hover:text-white"
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-neutral-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Indicator */}
      <div className="border-t border-neutral-800 p-4 text-center shrink-0">
        <span className="text-[10px] tracking-wider uppercase text-neutral-500 font-bold block">
          v1.0.0 Production
        </span>
      </div>
    </aside>
  );
}
