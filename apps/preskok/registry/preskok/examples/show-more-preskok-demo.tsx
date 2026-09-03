"use client"

import { useState } from "react"
import { twMerge } from "cn"
import { ChevronDownIcon } from "lucide-react"

import { ShowMore } from "@/registry/preskok/ui/preskok-ui/show-more"

const events = [
  {
    title: "Access policy updated",
    meta: "2 min ago",
    detail:
      "Admins now require device posture checks before approving exports.",
  },
  {
    title: "Invoice export queued",
    meta: "11 min ago",
    detail:
      "A finance export for Q4 renewals is waiting for reviewer approval.",
  },
  {
    title: "Deployment approved",
    meta: "43 min ago",
    detail: "Security reviewed the change request and cleared it for rollout.",
  },
  {
    title: "Risk flag resolved",
    meta: "1 hr ago",
    detail: "The compliance note was linked to the customer record.",
  },
  {
    title: "Owner reassigned",
    meta: "2 hr ago",
    detail: "Maya Chen took over the enterprise renewal workflow.",
  },
]

export default function ShowMorePreskokDemo() {
  const [isExpanded, setIsExpanded] = useState(false)
  const visibleEvents = isExpanded ? events : events.slice(0, 2)

  return (
    <div className="w-full max-w-2xl rounded-xl border bg-background shadow-sm">
      <ol className="divide-y">
        {visibleEvents.map((event) => (
          <li key={event.title} className="grid gap-1 px-4 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-sm font-medium">{event.title}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {event.meta}
              </span>
            </div>
            <p className="text-sm text-pretty text-muted-foreground">
              {event.detail}
            </p>
          </li>
        ))}
      </ol>
      <div className="px-4 py-3">
        <ShowMore isSelected={isExpanded} onChange={setIsExpanded}>
          {({ isSelected }) => (
            <>
              {isSelected ? "Show less" : "Show 3 more"}
              <ChevronDownIcon
                className={twMerge(
                  isSelected ? "rotate-180" : "",
                  "size-4 transition-transform duration-200"
                )}
              />
            </>
          )}
        </ShowMore>
      </div>
    </div>
  )
}
