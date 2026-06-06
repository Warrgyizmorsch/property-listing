"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import CountryFormDialog from "./CountryFormDialog"
import StateFormDialog from "./StateFormDialog"
import CityFormDialog from "./CityFormDialog"
import { useRouter } from "next/navigation"

export default function LocationPageHeader({ tab = "countries" }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const buttonLabel =
    tab === "countries"
      ? "Add Country"
      : tab === "states"
      ? "Add State"
      : "Add City"

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-neutral-950 text-white hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        <span>{buttonLabel}</span>
      </Button>

      {tab === "countries" && (
        <CountryFormDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSuccess={() => router.refresh()}
        />
      )}

      {tab === "states" && (
        <StateFormDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSuccess={() => router.refresh()}
        />
      )}

      {tab === "cities" && (
        <CityFormDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSuccess={() => router.refresh()}
        />
      )}
    </>
  )
}
