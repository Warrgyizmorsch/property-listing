import Link from "next/link";
import { ArrowLeft, Home, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";

export default function PropertyNotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/20 dark:bg-zinc-950 font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md flex flex-col items-center">
          {/* Visual Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] dark:bg-zinc-900 dark:text-[var(--brand-secondary)] border border-[var(--brand-border)] dark:border-zinc-800 shadow-sm">
            <Building className="h-8 w-8" />
          </div>

          {/* Heading */}
          <h2 className="mt-6 font-heading text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">
            Listing Not Found
          </h2>

          {/* Subtext */}
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-450 leading-6">
            The property listing you requested does not exist, has been removed,
            or is currently archived by Property Expert administrators.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Button asChild className="w-full sm:w-auto gap-2 bg-[var(--brand-primary)] font-bold text-white hover:bg-[var(--brand-primary-hover)] rounded-xl">
              <Link href="/properties">
                <ArrowLeft className="h-4 w-4" />
                Back to Listings
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto gap-2 font-bold border-neutral-200 dark:border-zinc-800 rounded-xl"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                Go Homepage
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
