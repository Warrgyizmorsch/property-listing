"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BgImageSection = () => {
  return (
    <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center bg-gradient-to-b from-[#e0ecf3] to-white dark:from-neutral-900 dark:to-neutral-950 overflow-hidden rounded-3xl my-8">
      {/* Background image (houses) */}
      <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full">
        <img
          src="/herobanner.jpg"
          alt="Colorful Houses"
          className="object-cover h-full w-full opacity-40 dark:opacity-20"
        />
        <div className="absolute inset-0 bg-neutral-950/20 dark:bg-zinc-950/45" />
      </div>

      {/* Overlay content */}
      <div className="relative z-10 px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold text-neutral-900 dark:text-white leading-tight">
          Discover a place you'll<br className="hidden md:block" /> love to live
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 mt-4 max-w-xl mx-auto font-medium">
          Find exceptional residential complexes, upcoming villa communities, and premier commercial projects in prime localities.
        </p>
        <div className="flex justify-center items-center">
          <Link href="/projects" className="mt-8">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition flex items-center gap-2 shadow-md">
              View All Projects <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BgImageSection;
