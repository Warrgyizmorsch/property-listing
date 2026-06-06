"use client"

import React from "react"

export default function PropertyStatusBadge({ status }) {
  if (!status) return null

  // Fallback styling if colorClass is not configured
  const colorClass = status.colorClass || "bg-neutral-100 text-neutral-800"

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide whitespace-nowrap shadow-2xs ${colorClass}`}
    >
      {status.name}
    </span>
  )
}
