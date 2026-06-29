"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2, Image as ImageIcon } from "lucide-react";

export default function ProjectHeroGallery({ images = [], fallbackImage, bannerImage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const validImages = images.filter((img) => img && img.url);

  const heroImage =
  bannerImage ||
  fallbackImage ||
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";

  // Fallback array if no gallery images
  const displayImages = [
  { url: heroImage },
  ...validImages.filter((img) => img.url !== heroImage),
];

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  }, [displayImages.length]);

  const showPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  }, [displayImages.length]);

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

  // Housing.com Layout grid
  return (
    <div className="relative mb-8 rounded-3xl overflow-hidden border border-neutral-200/80 bg-neutral-900 shadow-sm dark:border-zinc-800">
      {displayImages.length === 1 ? (
        // Simple banner layout if only 1 image exists
        <div 
          onClick={() => openLightbox(0)}
          className="relative h-64 sm:h-80 md:h-[450px] w-full overflow-hidden cursor-pointer group"
        >
          <img
            src={heroImage}
            alt="Project Featured Image"
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <button className="absolute bottom-5 right-5 inline-flex items-center gap-1.5 rounded-xl bg-white/90 backdrop-blur-xs px-4 py-2 text-xs font-bold text-slate-900 shadow-sm hover:bg-white transition-all">
            <ImageIcon className="h-4 w-4 text-slate-700" />
            View Photo
          </button>
        </div>
      ) : (
        // Multi-image Housing.com grid layout
        <div className="grid grid-cols-1 md:grid-cols-3 md:h-[450px] w-full overflow-hidden">
          {/* Main Large Image (Left 2 columns on desktop) */}
          <div 
            onClick={() => openLightbox(0)}
            className="relative md:col-span-2 h-64 md:h-full overflow-hidden cursor-pointer group"
          >
            <img
              src={heroImage}
              alt="Project Main Featured View"
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Side Stacked Images (Right column) */}
          <div className="grid grid-cols-2 md:grid-cols-1 h-36 md:h-full">
            {/* Top Right Thumbnail */}
            <div 
              onClick={() => openLightbox(1)}
              className="relative h-full overflow-hidden cursor-pointer group"
            >
              <img
                src={displayImages[1].url}
                alt="Project Thumbnail View 1"
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
            </div>

            {/* Bottom Right Thumbnail (with +X overlay if more images) */}
            <div 
              onClick={() => openLightbox(2)}
              className="relative h-full overflow-hidden cursor-pointer group"
            >
              <img
                src={displayImages[2]?.url || displayImages[0].url}
                alt="Project Thumbnail View 2"
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              
              {displayImages.length > 3 ? (
                // Over limit glass overlay
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xxs flex flex-col items-center justify-center text-white transition-colors duration-300 group-hover:bg-slate-950/50">
                  <span className="text-2xl font-bold font-heading">+{displayImages.length - 2}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-1">View Gallery</span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
              )}
            </div>
          </div>

          {/* Floating Gallery Size Button (Desktop Bottom Right) */}
          <button 
            onClick={() => openLightbox(0)}
            className="absolute bottom-5 right-5 inline-flex items-center gap-1.5 rounded-xl bg-slate-900/80 backdrop-blur-xs border border-white/10 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-slate-900 transition-all"
          >
            <ImageIcon className="h-4 w-4" />
            View All {displayImages.length} Photos
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          {/* Top Controls Header */}
          <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-white z-110">
            <span className="text-sm font-semibold tracking-wide bg-neutral-900/60 px-3 py-1 rounded-full border border-white/5">
              Photo {currentIndex + 1} of {displayImages.length}
            </span>
            <button
              onClick={closeLightbox}
              className="p-2.5 rounded-full bg-neutral-900/60 text-white hover:bg-neutral-800 hover:scale-110 transition-all border border-white/10 cursor-pointer flex items-center justify-center shadow-md"
              title="Close Gallery (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Large Image Container */}
          <div className="relative w-full max-w-5xl px-4 flex items-center justify-center select-none">
            <button
              onClick={showPrev}
              className="absolute left-6 md:left-10 p-3 rounded-full bg-neutral-900/60 hover:bg-neutral-800 text-white hover:scale-110 transition-all border border-white/10 z-110 cursor-pointer hidden sm:flex items-center justify-center shadow-md"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="relative w-full max-w-4xl max-h-[70vh] md:max-h-[80vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black flex items-center justify-center">
              <img
                src={displayImages[currentIndex].url}
                alt={`Expanded Project View ${currentIndex + 1}`}
                className="max-w-full max-h-[65vh] md:max-h-[80vh] object-contain mx-auto animate-in zoom-in-95 duration-200"
              />
            </div>

            <button
              onClick={showNext}
              className="absolute right-6 md:right-10 p-3 rounded-full bg-neutral-900/60 hover:bg-neutral-800 text-white hover:scale-110 transition-all border border-white/10 z-110 cursor-pointer hidden sm:flex items-center justify-center shadow-md"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile bottom controls */}
          <div className="flex sm:hidden items-center gap-6 mt-6 z-110">
            <button
              onClick={showPrev}
              className="p-3 rounded-full bg-neutral-900/70 text-white border border-white/10 flex items-center justify-center"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-xs text-neutral-400 font-bold select-none">Swipe or Tap Controls</span>
            <button
              onClick={showNext}
              className="p-3 rounded-full bg-neutral-900/70 text-white border border-white/10 flex items-center justify-center"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
