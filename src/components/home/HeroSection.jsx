import React from "react";
import { getSearchMetadata } from "@/features/home/services/home.service";
import SearchSection from "./SearchSection";

export default async function HeroSection() {
  // Fetch dropdown metadata on the server
  const { categories, cities } = await getSearchMetadata();

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-neutral-900 dark:via-zinc-950 dark:to-neutral-950 py-20 px-4 sm:px-6 lg:px-8">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-[url('/hero-bg-prop.jpg')] bg-cover bg-center bg-no-repeat opacity-95 dark:opacity-30"
        style={{ mixBlendMode: "normal" }}
      />

      <div className="absolute inset-0 bg-neutral-950/5 dark:bg-zinc-950/60" />

      {/* Hero content container */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        {/* Spacer to push content down for sticky header */}
        <div className="md:h-28 h-20"></div>

        {/* Big Headline */}
        <h1 className="page-heading center">
          Believe in Finding it
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl text-md text-slate-650 dark:text-neutral-300 sm:text-xl md:text-lg leading-relaxed mb-10">
          Search properties for sale and premium projects to invest
        </p>

        {/* Floating Search Bar */}
        <div className="mt-2 w-full px-2 lg:px-0 shadow-2xl">
          <SearchSection
            categories={categories}
            cities={cities}
          />
        </div>
      </div>
    </section>
  );
}
