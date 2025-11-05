"use client"

import React from "react"
import { CircleAlertIcon, CircleCheckIcon, InfoIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"

interface NoteProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  intent?: "default" | "info" | "warning" | "danger" | "success"
  indicator?: boolean
}

const iconMap: Record<string, React.ElementType | null> = {
  info: InfoIcon,
  warning: CircleAlertIcon,
  danger: CircleAlertIcon,
  success: CircleCheckIcon,
  default: null,
}
const Note = ({
  indicator = true,
  intent = "default",
  className,
  ...props
}: NoteProps) => {
  const IconComponent = iconMap[intent] || null

  return (
    <div
      className={twMerge([
        "grid w-full grid-cols-[auto_1fr] gap-3 overflow-hidden rounded-lg p-4 inset-ring-1 inset-ring-current/10 sm:text-sm/6",
        "[&_a]:underline hover:[&_a]:underline **:[strong]:font-semibold",
        intent === "default" &&
          "border-border bg-secondary/20 text-secondary-foreground **:data-[slot=icon]:text-secondary-foreground dark:**:data-[slot=icon]:text-secondary-foreground [&_a]:text-secondary-foreground dark:[&_a]:text-secondary-foreground",
        intent === "info" &&
          "bg-sky-500/5 text-sky-700 group-hover:bg-sky-500/25 dark:bg-sky-500/10 dark:text-sky-300 dark:group-hover:bg-sky-500/20",
        intent === "warning" &&
          "bg-amber-400/20 text-amber-700 group-hover:bg-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400 dark:group-hover:bg-amber-400/15",
        intent === "danger" &&
          "bg-red-500/15 text-red-700 group-hover:bg-red-500/25 dark:bg-red-500/10 dark:text-red-400 dark:group-hover:bg-red-500/20",
        intent === "success" &&
          "border-success/20 bg-success/10 **:data-[slot=icon]:text-success dark:bg-success/10 leading-4 text-emerald-800 dark:text-emerald-200 dark:**:data-[slot=icon]:text-emerald-400 [&_a]:text-emerald-600 dark:[&_a]:text-emerald-50",
        className,
      ])}
      {...props}
    >
      {IconComponent && indicator && (
        <IconComponent className="col-start-1 size-5 shrink-0" />
      )}
      <div className="text-base/6 text-pretty group-has-data-[slot=icon]:col-start-2 sm:text-sm/6">
        {props.children}
      </div>
    </div>
  )
}

export { Note }
export type { NoteProps }
