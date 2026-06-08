import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section
      id="contact"
      className="relative bg-neutral-900 py-20 px-4 dark:bg-zinc-950 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Visual background overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl text-center flex flex-col items-center">
        {/* Mail Icon Circle */}
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-xs">
          <Mail className="h-6 w-6" />
        </div>

        {/* Title */}
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl max-w-2xl leading-[1.2]">
          Ready to Discover Your Next Exclusive Landmark Property?
        </h2>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-base text-neutral-300 leading-7">
          Whether you are looking to purchase a modern luxury villa, lease a
          premium office tower, or list your private apartment catalog, our
          certified advisors are here to help.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/properties">
            <Button
              size="lg"
              className="h-12 bg-white font-bold text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-50 dark:hover:bg-neutral-200"
            >
              Browse Listings
            </Button>
          </Link>
          <Link href="/#contact">
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-neutral-700 bg-transparent font-bold text-white hover:bg-neutral-800"
            >
              Get in Touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
