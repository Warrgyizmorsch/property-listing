"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutUser } from "@/actions/auth";
import {
  LayoutDashboard,
  Building,
  Tags,
  MapPin,
  Mail,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  FolderOpen,
  Home
} from "lucide-react";

export default function Sidebar({ className = "" }) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Catalog submenu expand/collapse state
  const isCatalogPath =
    pathname.startsWith("/admin/properties") ||
    pathname.startsWith("/admin/categories") ||
    pathname.startsWith("/admin/locations");
    
  const [catalogOpen, setCatalogOpen] = useState(isCatalogPath);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      startTransition(async () => {
        await logoutUser();
      });
    }
  };

  const navItemClass = (isActive) =>
    `flex items-center gap-3.5 pl-6 pr-4 py-3 text-sm font-semibold rounded-l-full transition-all cursor-pointer ${
      isActive
        ? "bg-white text-[#3b52d9] shadow-sm ml-4"
        : "text-blue-100 hover:bg-white/10 hover:text-white ml-4"
    }`;

  const subNavItemClass = (isActive) =>
    `flex items-center gap-3 pl-12 pr-4 py-2.5 text-xs font-semibold rounded-l-full transition-all cursor-pointer ${
      isActive
        ? "bg-white/95 text-[#3b52d9] shadow-xs ml-4"
        : "text-blue-200 hover:bg-white/5 hover:text-white ml-4"
    }`;

  return (
    <aside className={`flex h-full w-64 flex-col bg-[#3b52d9] text-white shadow-xl ${className}`}>
      {/* Sidebar Header Brand (eProperty) */}
      <div className="flex h-16 items-center px-6 gap-2.5 border-b border-white/10 shrink-0">
        <Home className="h-6 w-6 text-blue-100" />
        <span className="text-xl font-black tracking-tight text-white flex items-center">
          eProperty<span className="font-light text-blue-200 text-xs ml-1 bg-white/20 px-1.5 py-0.5 rounded-sm">Admin</span>
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 py-6 overflow-y-auto pr-0 scrollbar-none">
        
        {/* Dashboard Link */}
        <Link href="/admin/dashboard" className="block">
          <div className={navItemClass(pathname === "/admin/dashboard")}>
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            <span>Dashboard</span>
          </div>
        </Link>

        {/* Catalog Collapsible Parent Menu */}
        <div className="space-y-0.5">
          <button
            onClick={() => setCatalogOpen((prev) => !prev)}
            className={`w-full flex items-center justify-between gap-3.5 pl-6 pr-6 py-3 text-sm font-semibold rounded-l-full transition-all cursor-pointer ml-4 ${
              isCatalogPath && !catalogOpen
                ? "bg-white/20 text-white"
                : "text-blue-100 hover:bg-white/10 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <FolderOpen className="h-5 w-5 shrink-0" />
              <span>Catalog</span>
            </div>
            {catalogOpen ? (
              <ChevronDown className="h-4 w-4 shrink-0 text-blue-200" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-blue-200" />
            )}
          </button>

          {/* Subchildren list */}
          {catalogOpen && (
            <div className="space-y-0.5 mt-0.5">
              <Link href="/admin/properties" className="block">
                <div className={subNavItemClass(pathname.startsWith("/admin/properties"))}>
                  <Building className="h-4 w-4 shrink-0" />
                  <span>Properties</span>
                </div>
              </Link>

              <Link href="/admin/categories" className="block">
                <div className={subNavItemClass(pathname.startsWith("/admin/categories"))}>
                  <Tags className="h-4 w-4 shrink-0" />
                  <span>Categories</span>
                </div>
              </Link>

              <Link href="/admin/locations" className="block">
                <div className={subNavItemClass(pathname.startsWith("/admin/locations"))}>
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>Locations</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Enquiries Link */}
        <Link href="/admin/enquiries" className="block">
          <div className={navItemClass(pathname.startsWith("/admin/enquiries"))}>
            <Mail className="h-5 w-5 shrink-0" />
            <span>Enquiries</span>
          </div>
        </Link>

        {/* SEO Settings Link */}
        <Link href="/admin/seo" className="block">
          <div className={navItemClass(pathname.startsWith("/admin/seo"))}>
            <Settings className="h-5 w-5 shrink-0" />
            <span>SEO Settings</span>
          </div>
        </Link>

      </nav>

      {/* Footer Log Out Action */}
      <div className="border-t border-white/10 p-4 shrink-0">
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold bg-white/15 hover:bg-white text-white hover:text-[#3b52d9] rounded-xl border border-white/10 transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          <span>{isPending ? "Logging Out..." : "Log Out"}</span>
        </button>
      </div>
    </aside>
  );
}
