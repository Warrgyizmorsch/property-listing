"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export default function ProjectGallery({ images = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter out any invalid images
  const validImages = images.filter((img) => img && img.url);

  if (validImages.length === 0) return null;

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden"; // Prevent body scroll
  };

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = ""; // Restore body scroll
  }, []);

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const showPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  // Handle keyboard events in lightbox
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") showNext();
      else if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeLightbox, showNext, showPrev]);

  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/30 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-heading">
          Project Photo Gallery
        </h2>
        <p className="text-xs text-neutral-400 mt-1 font-medium">
          Click on any photo to expand into premium fullscreen preview mode.
        </p>
        <hr className="border-slate-100 dark:border-zinc-800 mt-3" />
      </div>

      {/* Grid Layouts depending on image count for premium aesthetic */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {validImages.map((image, index) => {
          // If we have more than 8 images, group them and show a "+X more" overlay on the 8th image
          const limit = 8;
          const isOverLimit = validImages.length > limit;
          const isLastVisible = index === limit - 1;

          if (index >= limit) return null;

          return (
            <div
              key={image.id || index}
              onClick={() => openLightbox(index)}
              className={`group relative overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-800 border border-neutral-100 dark:border-zinc-850 aspect-video cursor-pointer shadow-xs hover:shadow-md transition-all duration-300 ${index === 0 && validImages.length >= 3
                  ? "md:col-span-2 md:row-span-2 md:h-full md:aspect-auto md:min-h-[220px]"
                  : ""
                }`}
            >
              <img
                src={image.url}
                alt={`Project Photo ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="p-3 bg-white/20 backdrop-blur-xs rounded-full text-white scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Maximize2 className="h-5 w-5" />
                </div>
              </div>

              {/* Last Visible card "+X more" overlay */}
              {isOverLimit && isLastVisible && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                  <span className="text-2xl font-bold font-heading">
                    +{validImages.length - limit + 1}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-1">
                    View All Photos
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md transition-all duration-300 animate-in fade-in">

          {/* Top Controls Header */}
          <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-white z-110">
            <span className="text-sm font-semibold tracking-wide select-none bg-neutral-900/50 px-3 py-1 rounded-full backdrop-blur-xs border border-white/5">
              Photo {currentIndex + 1} of {validImages.length}
            </span>
            <button
              onClick={closeLightbox}
              className="p-2.5 rounded-full bg-neutral-900/50 text-white hover:bg-neutral-800 hover:scale-110 transition-all border border-white/10 cursor-pointer flex items-center justify-center shadow-md"
              title="Close Gallery (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Large Image Container */}
          <div className="relative w-full max-w-5xl px-4 flex items-center justify-center select-none">
            {/* Prev Trigger */}
            <button
              onClick={showPrev}
              className="absolute left-6 md:left-10 p-3 rounded-full bg-neutral-900/50 hover:bg-neutral-800 text-white hover:scale-110 transition-all border border-white/10 z-110 cursor-pointer hidden sm:flex items-center justify-center shadow-md"
              title="Previous Photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Central Expanded Image */}
            <div className="relative w-full max-w-4xl max-h-[70vh] md:max-h-[80vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black flex items-center justify-center">
              <img
                src={validImages[currentIndex].url}
                alt={`Project Photo Expanded ${currentIndex + 1}`}
                className="max-w-full max-h-[65vh] md:max-h-[80vh] object-contain mx-auto animate-in zoom-in-95 duration-200"
              />
            </div>

            {/* Next Trigger */}
            <button
              onClick={showNext}
              className="absolute right-6 md:right-10 p-3 rounded-full bg-neutral-900/50 hover:bg-neutral-800 text-white hover:scale-110 transition-all border border-white/10 z-110 cursor-pointer hidden sm:flex items-center justify-center shadow-md"
              title="Next Photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Bottom Navigation Swipe/Tap indicators */}
          <div className="flex sm:hidden items-center gap-6 mt-6 z-110">
            <button
              onClick={showPrev}
              className="p-3 rounded-full bg-neutral-900/70 text-white border border-white/10 cursor-pointer flex items-center justify-center"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-xs text-neutral-400 font-bold select-none">
              Swipe or Tap Controls
            </span>
            <button
              onClick={showNext}
              className="p-3 rounded-full bg-neutral-900/70 text-white border border-white/10 cursor-pointer flex items-center justify-center"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
