"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <h2 className="page-heading center">
          Discover a place you'll<br className="hidden md:block" /> love to live
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 mt-4 max-w-xl mx-auto font-medium">
          Find exceptional residential complexes, upcoming villa communities, and premier commercial projects in prime localities.
        </p>
        <div className="flex justify-center items-center">
          <Button asChild className="primary-btn mt-8">
            <Link href="/projects">
              View All Projects <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BgImageSection;
