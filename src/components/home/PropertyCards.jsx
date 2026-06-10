"use client";

import React from "react";
import { MapPin, Layers, Building2, Calendar, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { formatCurrency, formatArea } from "@/lib/format";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const PropertyCards = ({ title, description, projects, isBestDeal }) => {
  const getStatusLabel = (status) => {
    switch (status) {
      case "ONGOING":
        return "Ongoing";
      case "COMPLETED":
        return "Completed";
      case "UPCOMING":
        return "Upcoming";
      default:
        return status;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "ONGOING":
        return "bg-blue-600 text-white";
      case "COMPLETED":
        return "bg-emerald-600 text-white";
      case "UPCOMING":
        return "bg-amber-500 text-white";
      default:
        return "bg-slate-600 text-white";
    }
  };

  return (
    <div className="py-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
          {title}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true, el: null }}
        spaceBetween={20}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: isBestDeal ? 3 : 4 },
        }}
      >
        {projects.map((project, index) => {
          const coverImage =
            project.mainImage ||
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";

          const locationText = `${project.address || ""}, ${project.city?.name || ""}`;

          const priceDisplay =
            project.startingPrice && project.startingPrice > 0
              ? `Starting ₹${formatCurrency(project.startingPrice).replace("₹", "")}`
              : "Price on Request";

          let areaDisplay = "Area on Request";
          if (project.minArea && project.minArea > 0) {
            if (project.maxArea && project.maxArea > project.minArea) {
              areaDisplay = `${formatArea(project.minArea)} - ${formatArea(project.maxArea)}`;
            } else {
              areaDisplay = formatArea(project.minArea);
            }
          }

          return (
            <SwiperSlide key={index} className="pb-10">
              <Link href={`/projects/${project.slug}`}>
                <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden hover:shadow-xl transition border border-neutral-100 dark:border-neutral-800 flex flex-col h-full cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img
                      src={coverImage}
                      alt={project.projectName}
                      className={`w-full object-cover transition-transform duration-300 hover:scale-103 ${
                        isBestDeal ? "h-64" : "h-48"
                      }`}
                    />
                    <div className="absolute top-3 left-3 flex gap-2 font-semibold z-10">
                      <div className={`text-xs px-2.5 py-1 rounded-lg font-bold shadow-md ${getStatusBadgeClass(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </div>
                      {project.isFeatured && (
                        <div className="bg-amber-500 text-white text-xs px-2.5 py-1 rounded-lg font-bold shadow-md flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-white" />
                          Featured
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-1 rounded-md uppercase">
                        {project.category?.name || "Real Estate"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1 mb-1">
                      {project.projectName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 leading-relaxed mb-4">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                      <span className="line-clamp-1">{locationText}</span>
                    </p>

                    <hr className="my-3 border-slate-100 dark:border-neutral-800" />

                    <div className="mt-auto space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-650 dark:text-slate-350">
                        <div className="flex items-center gap-1.5">
                          <Layers className="h-4 w-4 text-slate-400" />
                          <span>{project.availableProps} / {project.totalProps} units</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-end">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="truncate">{areaDisplay}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        <Building2 className="h-4 w-4 text-neutral-400" />
                        <span className="truncate">By {project.builderName}</span>
                      </div>

                      <div className="text-rose-500 dark:text-rose-400 font-extrabold text-lg mt-2 font-heading">
                        {priceDisplay}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default PropertyCards;
