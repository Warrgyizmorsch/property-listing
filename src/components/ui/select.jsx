"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

function Select({ ...props }) {
  return <SelectPrimitive.Root {...props} />
}

function SelectTrigger({ className, children, ...props }) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-xl border border-neutral-200/80 bg-white px-3 text-sm font-semibold text-neutral-800 brand-focus dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon render={<ChevronDownIcon className="h-4 w-4 text-slate-500 opacity-70 shrink-0" />} />
    </SelectPrimitive.Trigger>
  )
}

function SelectValue({ className, placeholder, ...props }) {
  return (
    <SelectPrimitive.Value
      className={cn("text-left text-sm", className)}
      placeholder={placeholder}
      {...props}
    />
  )
}

function SelectContent({ className, children, ...props }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner className="isolate z-50 outline-none" sideOffset={4}>
        <SelectPrimitive.Popup
          className={cn(
            "z-50 max-h-(--available-height) w-(--anchor-width) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-lg border border-neutral-200/85 bg-white p-1 text-neutral-900 shadow-md outline-none dark:border-neutral-200/85 dark:bg-white dark:text-neutral-900 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          {children}
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({ className, children, ...props }) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm font-semibold text-neutral-900 outline-none hover:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-100 data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="h-4 w-4 text-neutral-900 dark:text-neutral-900" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}
