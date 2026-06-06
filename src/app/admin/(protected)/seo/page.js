import React from "react";
import PageHeader from "@/components/admin/PageHeader";
import { getSeoSettingByPageType } from "@/features/seo/services/seo.service";
import SeoTabsContainer from "./SeoTabsContainer";

export const metadata = {
  title: "SEO Management | Admin Dashboard",
  description: "Configure system-wide page meta tags, canonicals, and social graph cards.",
};

export default async function AdminSeoPage({ searchParams }) {
  // Await searchParams as required by Next.js 15
  const awaitedParams = await searchParams;
  const currentTab = awaitedParams.tab || "HOME";

  // Fetch data on server
  const initialData = await getSeoSettingByPageType(currentTab);
  
  // Format metadata for clients
  const serializedData = initialData ? JSON.parse(JSON.stringify(initialData)) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO Settings"
        breadcrumbs={[
          { label: "Dashboard", url: "/admin/dashboard" },
          { label: "SEO Settings", url: "/admin/seo" },
        ]}
      />

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <SeoTabsContainer
          currentTab={currentTab}
          initialData={serializedData}
        />
      </div>
    </div>
  );
}
