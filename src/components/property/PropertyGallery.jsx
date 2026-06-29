"use client"

import { useState } from "react";
import Image from "next/image";
import { Maximize2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PropertyGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Fallback stock image if no gallery images exist in database
  const galleryImages = images.length > 0 
    ? images 
    : [{ url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800" }];

  const activeImage = galleryImages[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* 1. Main Active Image Preview Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-100 dark:bg-zinc-800 dark:border-zinc-800 shadow-sm group">
        <Image
          src={activeImage.url}
          alt="Property Gallery Image"
          fill
          priority
          sizes="(max-w-7xl) 66vw, 100vw"
          className="object-cover"
        />
        
        {/* Hover overlay zoom triggers */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            onClick={() => setLightboxOpen(true)}
            size="icon"
            className="rounded-full bg-white text-neutral-800 hover:bg-neutral-100 shadow-lg shrink-0 h-11 w-11"
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 2. Horizontal Swipeable Thumbnails Row */}
      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 shrink-0 scrollbar-thin scrollbar-thumb-neutral-200">
          {galleryImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-video h-16 sm:h-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                activeIndex === idx 
                  ? "border-[var(--brand-secondary)] shadow-sm opacity-100 scale-95"
                  : "border-transparent opacity-65 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={`Gallery Thumbnail ${idx + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* 3. Interactive Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8">
          {/* Close button */}
          <Button
            onClick={() => setLightboxOpen(false)}
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-white hover:bg-white/10 rounded-full h-11 w-11 z-10 shrink-0"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>

          {/* Carousel Viewport */}
          <div className="relative w-full max-w-5xl aspect-video overflow-hidden rounded-xl flex items-center justify-center">
            <Image
              src={activeImage.url}
              alt="Property Lightbox Image"
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {/* Display indices */}
          <p className="mt-4 text-sm font-bold text-neutral-400">
            Image {activeIndex + 1} of {galleryImages.length}
          </p>

          {/* Navigation selectors (only render if there's multiple pictures) */}
          {galleryImages.length > 1 && (
            <>
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all shadow-md shrink-0 cursor-pointer"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all shadow-md shrink-0 cursor-pointer"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}

    </div>
  );
}
