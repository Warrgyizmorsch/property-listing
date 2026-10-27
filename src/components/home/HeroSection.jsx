import React from "react";
import Image from "next/image";
import { getSearchMetadata } from "@/features/home/services/home.service";
import SearchSection from "./SearchSection";

export default async function HeroSection() {
  // Fetch dropdown metadata on the server
  const { categories, cities } = await getSearchMetadata();

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--brand-primary-soft)] via-white to-[var(--brand-secondary-soft)] dark:from-neutral-900 dark:via-zinc-950 dark:to-neutral-950 py-20 px-4 sm:px-6 lg:px-8">
      {/* High-priority LCP hero background image discoverable from initial HTML */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/hero-bg-prop.webp"
          alt="Luxury Property Background"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={75}
          className="object-cover object-center opacity-95 dark:opacity-30"
        />
      </div>

      <div className="absolute inset-0 bg-neutral-950/5 dark:bg-zinc-950/60" />

      {/* Hero content container */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center text-center brand-reveal">
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
        <div className="mt-2 w-full px-2 lg:px-0 shadow-2xl brand-gold-glow">
          <SearchSection
            categories={categories}
            cities={cities}
          />
        </div>
      </div>
    </section>
  );
}
