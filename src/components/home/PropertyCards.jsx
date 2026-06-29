"use client";

import React from "react";
import { MapPin, Layers, Building2, SquareStack, ArrowUpRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { formatCurrency, formatArea } from "@/lib/format";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";

const STATUS_CONFIG = {
  ONGOING:   { label: "Ongoing",   color: "bg-emerald-600" },
  COMPLETED: { label: "Completed", color: "bg-[var(--brand-primary)]" },
  UPCOMING:  { label: "Upcoming",  color: "bg-[var(--brand-secondary)]" },
};

export const PropertyCard = ({ project, isBestDeal }) => {
  const coverImage =
    project.mainImage ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";

  const locationText = [project.address, project.city?.name].filter(Boolean).join(", ");

  const priceDisplay =
    project.startingPrice && project.startingPrice > 0
      ? `₹${formatCurrency(project.startingPrice).replace("₹", "")}`
      : "Price on Request";

  let areaDisplay = "On Request";
  if (project.minArea && project.minArea > 0) {
    areaDisplay =
      project.maxArea && project.maxArea > project.minArea
        ? `${formatArea(project.minArea)} – ${formatArea(project.maxArea)}`
        : formatArea(project.minArea);
  }

  const status = STATUS_CONFIG[project.status] || { label: project.status, color: "bg-muted-foreground" };

  return (
    <Link href={`/projects/${project.slug}`} className="block h-full">
      <div className="group relative flex flex-col h-full rounded-xl overflow-hidden bg-card border border-border transition-all duration-300 ease-out shadow-md hover:-translate-y-1 hover:shadow-xl hover:border-[var(--brand-border)] brand-card-motion">

        {/* Portrait image */}
        <div className="relative overflow-hidden flex-shrink-0">
          <img
            src={coverImage}
            alt={project.projectName}
            className={[
              "w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
              isBestDeal ? "h-72" : "h-64",
            ].join(" ")}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

          {/* Status — top left: frosted pill with dot */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-background/75 dark:bg-card/80 backdrop-blur-md border border-border/50 text-foreground text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.color}`} />
            {status.label}
          </div>

          {/* Category — top right */}
          {project.category?.name && (
            <div className="absolute top-3 right-3 bg-background/75 dark:bg-card/80 backdrop-blur-md border border-border/50 text-muted-foreground text-[9px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full shadow-sm">
              {project.category.name}
            </div>
          )}

          {/* Price pinned bottom of image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <p className="text-white/60 text-[9px] font-semibold tracking-[0.12em] uppercase mb-0.5">Starting from</p>
              <p className="text-white text-xl font-bold leading-none tracking-tight drop-shadow-sm">
                {priceDisplay}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--brand-secondary)] group-hover:border-[var(--brand-secondary)] flex-shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover:text-[#0B1F3A] transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Compact body */}
        <div className="flex flex-col p-4 gap-3">

          {/* Name + location */}
          <div>
            <h3 className="text-[18px] font-bold text-foreground line-clamp-1 tracking-tight leading-snug">
              {project.projectName}
            </h3>
            <p className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground leading-none">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">{locationText}</span>
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Meta — 3 compact items in a row */}
          <div className="grid grid-cols-3 gap-1 text-center">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-semibold tracking-widest uppercase text-muted-foreground">Units</span>
              <span className="text-[12px] font-bold text-foreground leading-tight">
                {project.availableProps}<span className="font-normal text-muted-foreground">/{project.totalProps}</span>
              </span>
            </div>
            <div className="flex flex-col gap-0.5 border-x border-border px-1">
              <span className="text-[9px] font-semibold tracking-widest uppercase text-muted-foreground">Area</span>
              <span className="text-[12px] font-bold text-foreground leading-tight truncate">{areaDisplay}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-semibold tracking-widest uppercase text-muted-foreground">By</span>
              <span className="text-[12px] font-bold text-foreground leading-tight truncate">{project.builderName}</span>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
};

const PropertyCards = ({ title, description, projects, isBestDeal }) => {
  return (
    <div className="md:py-6 py-4 brand-reveal">
      {/* Section header */}
      <div className="text-center mb-8">
        <h2 className="section-heading center">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* px-1 + slide py-2 prevents shadow clipping inside swiper overflow */}
      <div className="px-1">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={16}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: isBestDeal ? 3 : 4 },
          }}
          className="!pb-10"
        >
          {projects.map((project, index) => (
            <SwiperSlide key={index} className="!h-auto py-2">
              <PropertyCard project={project} isBestDeal={isBestDeal} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 5px !important;
          height: 5px !important;
          background: oklch(0.708 0 0) !important;
          opacity: 1 !important;
          transition: all 0.25s ease !important;
          border-radius: 9999px !important;
        }
        .swiper-pagination-bullet-active {
          background: var(--brand-secondary) !important;
          width: 16px !important;
          border-radius: 3px !important;
        }
        .dark .swiper-pagination-bullet {
          background: oklch(0.439 0 0) !important;
        }
        .dark .swiper-pagination-bullet-active {
          background: var(--brand-secondary) !important;
        }
      `}</style>
    </div>
  );
};

export default PropertyCards;
