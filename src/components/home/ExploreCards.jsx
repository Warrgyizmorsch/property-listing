"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const fallbackImages = {
  // Categories
  apartment: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=75&w=400",
  villa: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=75&w=400",
  commercial: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=75&w=400",
  land: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=75&w=400",
  penthouse: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=75&w=400",

  // Cities
  mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=75&w=400",
  udaipur: "https://images.unsplash.com/photo-1595636312480-1a77460bf803?auto=format&fit=crop&q=75&w=400",
  chennai: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=75&w=400",
  delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=75&w=400",
  bangalore: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=75&w=400",
  pune: "https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&q=75&w=400",
  hyderabad: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&q=75&w=400",
};

function getOptimizedExploreImage(url, width = 400) {
  if (!url) return url;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/f_webp,q_75,w_${width},c_limit/`);
  }
  if (url.includes("images.unsplash.com")) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set("auto", "format");
      parsed.searchParams.set("q", "75");
      parsed.searchParams.set("w", String(width));
      return parsed.toString();
    } catch {
      return url;
    }
  }
  return url;
}

const getFallbackImage = (title) => {
  const slug = title?.toLowerCase() || "";
  if (fallbackImages[slug]) return fallbackImages[slug];
  for (const key in fallbackImages) {
    if (slug.includes(key)) return fallbackImages[key];
  }
  return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=75&w=400";
};

const ExploreCards = ({ exploreCardData, isProperty }) => {
  return (
    <div className="py-6">
      <div className="text-center mb-10">
        <h2 className="section-heading center">
          {exploreCardData.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
          {exploreCardData.description}
        </p>
      </div>

      <div className="px-1">
        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          pagination={{
            clickable: true,
            renderBullet: (index, className) =>
              `<button type="button" class="${className}" aria-label="Go to slide ${index + 1}"></button>`,
          }}
          className="!pb-10"
        >
          {exploreCardData.cardData.map((item, index) => {
            const cardImage = item.image || getFallbackImage(item.title);

            return (
              <SwiperSlide key={index} className="!h-auto py-2">
                <Link href={item.href || "/projects"}>
                  <div className="flex flex-col h-full cursor-pointer">
                    <div className="relative w-full h-[220px] md:h-[250px] rounded-2xl overflow-hidden shadow-md group border border-neutral-100 dark:border-neutral-800 bg-neutral-100 dark:bg-zinc-800">
                      <Image
                        src={getOptimizedExploreImage(cardImage, 320)}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 220px"
                        quality={70}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {isProperty && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-md font-bold">{item.title}</h3>
                            <p className="text-xs text-slate-200 mt-0.5">{item.count} Projects</p>
                          </div>
                        </>
                      )}
                    </div>

                    {!isProperty && (
                      <div className="mt-3 ml-1">
                        <p className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                          {item.count} Projects
                        </p>
                        <h3 className="text-md font-bold text-slate-800 dark:text-white mt-0.5">
                          {item.title}
                        </h3>
                        {item.subtext && (
                          <p className="text-xs font-medium text-slate-600 dark:text-zinc-300 mt-0.5">{item.subtext}</p>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          box-sizing: content-box !important;
          width: 6px !important;
          height: 6px !important;
          padding: 10px 8px !important;
          background-clip: content-box !important;
          background-color: oklch(0.708 0 0) !important;
          opacity: 1 !important;
          transition: all 0.25s ease !important;
          border-radius: 9999px !important;
          cursor: pointer !important;
          display: inline-block !important;
        }
        .swiper-pagination-bullet-active {
          background-color: var(--brand-secondary, #C8A45D) !important;
          width: 18px !important;
        }
        .dark .swiper-pagination-bullet {
          background-color: oklch(0.439 0 0) !important;
        }
        .dark .swiper-pagination-bullet-active {
          background-color: var(--brand-secondary, #C8A45D) !important;
        }
      `}</style>
    </div>
  );
};

export default ExploreCards;