import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import Image from "next/image";
import { Users, Building2, DollarSign, Globe, Eye } from "lucide-react";

export const metadata = {
  title: "About Us | Property Expert",
  description: "Curating extraordinary living spaces for the world's most discerning clientele. A legacy built on trust, discretion, and unparalleled market expertise.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 font-sans">
      <Navbar />
      
      <main className="grow">
        {/* Hero Section */}
        <section className="relative min-h-[460px] flex items-center justify-center text-center overflow-hidden py-16 px-4">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/abouts-us/AboutUsHero.png"
              alt="About Us Hero"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-neutral-950/70" />
          </div>
          <div className="relative z-10 max-w-3xl flex flex-col items-center brand-reveal">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Our Story
            </h1>
            <div className="mt-3 w-14 h-0.5 bg-[var(--brand-secondary)] rounded-full" />
            <p className="mt-6 text-base md:text-lg text-neutral-300 leading-relaxed">
              Curating extraordinary living spaces for the world&apos;s most discerning clientele. A legacy
              built on trust, discretion, and unparalleled market expertise.
            </p>
          </div>
        </section>

        {/* Foundation Section */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text column */}
            <div className="brand-reveal">
              <span className="text-xs uppercase font-bold tracking-wider text-[var(--brand-secondary)]">
                The Foundation
              </span>
              <h2 className="section-heading mt-2">Redefining Luxury Real Estate</h2>
              <p className="mt-6 text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Since our inception, Property Expert has operated on a simple yet profound
                philosophy: luxury is an experience, not a price point. We are not merely
                brokers; we are trusted advisors to individuals navigating complex, high-value
                asset acquisitions globally.
              </p>

              {/* Vision Card */}
              <div className="mt-8 bg-neutral-50 dark:bg-zinc-900/50 border border-neutral-100 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-2.5 text-base font-bold text-[var(--brand-primary)] dark:text-[var(--brand-secondary)] mb-3">
                  <Eye className="h-5 w-5 text-[var(--brand-secondary)]" />
                  <span>Our Vision</span>
                </div>
                <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  To be the undisputed authority in premium real estate, setting global
                  standards for service excellence, architectural appreciation, and client
                  discretion.
                </p>
              </div>
            </div>

            {/* Image column */}
            <div className="relative h-96 lg:h-full min-h-[380px] overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-800/80 shadow-md">
              <Image
                src="/images/abouts-us/AboutUS1.png"
                alt="Luxury interior design"
                fill
                className="object-cover transition-transform duration-500 hover:scale-103"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-neutral-50/50 dark:bg-zinc-900/30 border-y border-neutral-100 dark:border-neutral-800/50 py-20 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="section-heading center">A Track Record of Excellence</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {/* Happy Clients */}
              <div className="bg-white dark:bg-zinc-900/80 border border-neutral-150/70 dark:border-neutral-800 rounded-2xl p-8 text-center shadow-xs hover:shadow-md hover:border-[var(--brand-secondary)]/50 hover:-translate-y-1 transition-all duration-300">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)] border border-[var(--brand-secondary)]/20 shadow-xs mb-5">
                  <Users className="h-6 w-6" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-[var(--brand-primary)] dark:text-white tracking-tight">15,000+</div>
                <div className="mt-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Happy Clients</div>
              </div>

              {/* Active Listings */}
              <div className="bg-white dark:bg-zinc-900/80 border border-neutral-150/70 dark:border-neutral-800 rounded-2xl p-8 text-center shadow-xs hover:shadow-md hover:border-[var(--brand-secondary)]/50 hover:-translate-y-1 transition-all duration-300">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)] border border-[var(--brand-secondary)]/20 shadow-xs mb-5">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-[var(--brand-primary)] dark:text-white tracking-tight">3</div>
                <div className="mt-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Active Listings</div>
                <div className="mt-1 text-[11px] italic text-neutral-400">(Exclusive Portfolio)</div>
              </div>

              {/* Sales Volume */}
              <div className="bg-white dark:bg-zinc-900/80 border border-neutral-150/70 dark:border-neutral-800 rounded-2xl p-8 text-center shadow-xs hover:shadow-md hover:border-[var(--brand-secondary)]/50 hover:-translate-y-1 transition-all duration-300">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)] border border-[var(--brand-secondary)]/20 shadow-xs mb-5">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-[var(--brand-primary)] dark:text-white tracking-tight">$2B+</div>
                <div className="mt-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Sales Volume</div>
              </div>

              {/* Global Markets */}
              <div className="bg-white dark:bg-zinc-900/80 border border-neutral-150/70 dark:border-neutral-800 rounded-2xl p-8 text-center shadow-xs hover:shadow-md hover:border-[var(--brand-secondary)]/50 hover:-translate-y-1 transition-all duration-300">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)] border border-[var(--brand-secondary)]/20 shadow-xs mb-5">
                  <Globe className="h-6 w-6" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-[var(--brand-primary)] dark:text-white tracking-tight">12</div>
                <div className="mt-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Global Markets</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
