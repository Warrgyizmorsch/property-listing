"use client"

import React, { useTransition } from "react"
import { updateEnquiryStatusAction } from "../actions/enquiry.actions"
import { ENQUIRY_STATUSES } from "../schemas/enquiry.schema"
import { toast } from "@/components/ui/toast"
import { Label } from "@/components/ui/label"
import { ShieldCheck } from "lucide-react"

export default function EnquiryStatusSelector({ enquiryId, currentStatus }) {
  const [isPending, startTransition] = useTransition()

  const handleChangeStatus = (e) => {
    const newStatus = e.target.value
    startTransition(async () => {
      const result = await updateEnquiryStatusAction(enquiryId, newStatus)
      if (result.success) {
        toast.success(`Lead status updated to ${newStatus}.`)
      } else {
        toast.error(result.error || "Failed to update lead status.")
      }
    })
  }

  // Calculate percentage width for visual indicator
  const getProgressWidth = () => {
    switch (currentStatus) {
      case "NEW":
        return "w-1/5 bg-amber-500"
      case "CONTACTED":
        return "w-2/5 bg-[var(--brand-primary)]"
      case "NEGOTIATION":
        return "w-3/5 bg-[var(--brand-secondary)]"
      case "CLOSED":
        return "w-4/5 bg-red-500"
      case "CONVERTED":
        return "w-full bg-green-500"
      case "RESOLVED":
        return "w-full bg-neutral-500"
      default:
        return "w-1/5 bg-amber-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
        <ShieldCheck className="h-4 w-4 text-neutral-500" />
        <h4 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
          Lead Status Workflow
        </h4>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-neutral-500">
          Current Processing Stage
        </Label>
        <select
          value={currentStatus}
          onChange={handleChangeStatus}
          disabled={isPending}
          className="flex w-full h-10 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm brand-focus cursor-pointer disabled:opacity-50"
        >
          {ENQUIRY_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Progress pipeline visual representation */}
      <div className="pt-2">
        <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
          <span>New</span>
          <span>Contacted</span>
          <span>Negotiation</span>
          <span>Closed</span>
          <span>Converted</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden flex">
          <div className={`h-full rounded-full transition-all duration-500 ${getProgressWidth()}`} />
        </div>
      </div>
    </div>
  )
}
