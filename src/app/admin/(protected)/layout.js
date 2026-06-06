import React from "react";
import { requireAdmin } from "@/lib/auth-helpers";
import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import Breadcrumbs from "@/components/admin/Breadcrumbs";

/**
 * Root Layout for all secure Admin panel routes (/admin/*).
 * Validates authentication session and role checks server-side.
 */
export default async function AdminLayout({ children }) {
  // 1. Enforce Server-Side Auth guard check (will redirect to login if session fails)
  const session = await requireAdmin();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-50">
      {/* 2. Left Sidebar Navigation (visible on Desktop size only) */}
      <Sidebar className="hidden lg:flex" />

      {/* 3. Right Content Column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar with Profile info */}
        <Navbar user={session.user} />

        {/* Scrollable Sub-route Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Dynamic Breadcrumbs Navigation */}
            <Breadcrumbs />
            
            {/* Page contents */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
