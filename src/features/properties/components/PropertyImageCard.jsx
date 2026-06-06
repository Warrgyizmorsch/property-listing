"use client"

import React from "react"
import { Star, Trash2, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"

export default function PropertyImageCard({
  image,
  isFirst = false,
  isLast = false,
  onMoveLeft,
  onMoveRight,
  onDelete,
  onSetFeatured,
  disabled = false,
}) {
  return (
    <div className="group relative rounded-lg border border-neutral-200 bg-white overflow-hidden shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col h-48">
      {/* 1. Image Thumbnail Preview */}
      <div className="relative flex-1 bg-neutral-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt="Property Gallery Image"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Featured Badge Overlay */}
        {image.isFeatured ? (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm select-none">
            <Star className="h-3 w-3 fill-white" />
            <span>Featured</span>
          </span>
        ) : (
          <button
            onClick={onSetFeatured}
            disabled={disabled}
            className="absolute left-2.5 top-2.5 opacity-0 group-hover:opacity-100 flex items-center justify-center h-7 w-7 rounded-full bg-white/90 text-neutral-400 hover:text-amber-500 hover:scale-115 transition-all shadow-xs border border-neutral-100 cursor-pointer"
            title="Set as featured image"
          >
            <Star className="h-4 w-4" />
          </button>
        )}

        {/* Loading Overlay */}
        {disabled && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-15">
            <Loader2 className="h-6 w-6 text-neutral-800 animate-spin" />
          </div>
        )}
      </div>

      {/* 2. Controls Footer */}
      <div className="flex items-center justify-between px-3 py-2 bg-neutral-50 border-t border-neutral-100 shrink-0">
        {/* Order Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveLeft}
            disabled={isFirst || disabled}
            className="p-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
            title="Move Left"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <span className="text-[10px] font-bold text-neutral-400 select-none px-1">
            #{image.sortOrder + 1}
          </span>

          <button
            type="button"
            onClick={onMoveRight}
            disabled={isLast || disabled}
            className="p-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
            title="Move Right"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Delete Control */}
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
          title="Delete Image"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
