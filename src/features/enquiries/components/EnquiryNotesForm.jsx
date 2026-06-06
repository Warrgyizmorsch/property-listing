"use client"

import React, { useState, useTransition } from "react"
import { updateEnquiryNotesAction } from "../actions/enquiry.actions"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Save, ClipboardEdit } from "lucide-react"

export default function EnquiryNotesForm({ enquiryId, initialNotes = "" }) {
  const [notes, setNotes] = useState(initialNotes || "")
  const [isPending, startTransition] = useTransition()

  const handleSaveNotes = (e) => {
    e.preventDefault()

    startTransition(async () => {
      const result = await updateEnquiryNotesAction(enquiryId, notes)
      if (result.success) {
        toast.success("Internal notes saved successfully.")
      } else {
        toast.error(result.error || "Failed to save internal notes.")
      }
    })
  }

  const hasChanged = notes !== (initialNotes || "")

  return (
    <form onSubmit={handleSaveNotes} className="space-y-4">
      <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
        <ClipboardEdit className="h-4 w-4 text-neutral-500" />
        <h4 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
          Internal Admin Notes
        </h4>
      </div>

      <p className="text-xs text-neutral-500 leading-normal">
        Use this section to record progress logs, negotiation terms, client budget updates, or
        follow-up callbacks. These notes are visible strictly to system administrators.
      </p>

      <div className="space-y-2">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Type client details, negotiation status or internal logs here..."
          rows={6}
          disabled={isPending}
          className="border-neutral-200 focus:border-neutral-400 bg-white text-sm"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending || !hasChanged}
          className="bg-neutral-950 text-white hover:bg-neutral-800 h-9 px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-3.5 w-3.5" />
          <span>{isPending ? "Saving Notes..." : "Save Notes"}</span>
        </Button>
      </div>
    </form>
  )
}
