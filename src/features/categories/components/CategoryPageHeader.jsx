"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import CategoryFormDialog from "./CategoryFormDialog"
import { useRouter } from "next/navigation"

export default function CategoryPageHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary text-white hover:bg-primary/90 flex items-center gap-1.5 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        <span>Add Category</span>
      </Button>

      <CategoryFormDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}
