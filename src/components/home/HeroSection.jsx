import Link from "next/link";
import { ArrowRight, Sparkles, Building, Key, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSearchMetadata } from "@/features/home/services/home.service";
import SearchSection from "./SearchSection";

export default async function HeroSection() {
  // Fetch dropdown metadata on the server
  const { categories, cities } = await getSearchMetadata();

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-neutral-900 py-20 px-4 dark:bg-zinc-950 sm:px-6 lg:px-8">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1800')] bg-cover bg-center bg-no-repeat opacity-25"
        style={{ mixBlendMode: "luminosity" }}
      />

      {/* Radial overlay to enrich dark theme colors */}
      <div className="absolute inset-0 bg-radial-gradient from-indigo-900/10 via-neutral-950/70 to-neutral-950/95" />

      {/* Decorative colored glow circles */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center text-center motion-safe:animate-fade-in-up">
        {/* Sparkle badge */}
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-indigo-300 uppercase animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          The Epitome of Premium Living
        </div>

        {/* Big Headline */}
        <h1 className="max-w-4xl font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:leading-[1.1]">
          Discover Your Next{" "}
          <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
            Masterpiece Project
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 max-w-2xl text-base text-neutral-200 sm:text-lg md:text-xl leading-8">
          Explore a curated collection of exceptional luxury residential, upcoming villa complexes, and premier commercial projects in prime locations.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 motion-safe:animate-fade-in-up">
          <Link href="/projects">
            <Button
              size="lg"
              className="h-12 bg-linear-to-r from-indigo-600 to-violet-600 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:from-indigo-700 hover:to-violet-700 cursor-pointer"
            >
              Browse Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-neutral-700/80 bg-transparent font-semibold text-white transition-all duration-300 hover:bg-neutral-800/85 cursor-pointer"
            >
              Contact an Advisory Agent
            </Button>
          </Link>
        </div>

        {/* Inline Stats Overview */}
        <div className="mt-12 hidden grid-cols-3 gap-8 border-t border-white/10 pt-8 text-left md:grid">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-indigo-300 border border-white/5">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">450+</p>
              <p className="text-xs text-neutral-400">Premium Real Estate Projects</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-indigo-300 border border-white/5">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">1,200+</p>
              <p className="text-xs text-neutral-400">Available Units</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-indigo-300 border border-white/5">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">15,000+</p>
              <p className="text-xs text-neutral-400">Satisfied Families</p>
            </div>
          </div>
        </div>

        {/* Floating Search Bar */}
        <div className="mt-16 w-full px-2 lg:px-0">
          <SearchSection
            categories={categories}
            cities={cities}
          />
        </div>
      </div>
    </section>
  );
}
