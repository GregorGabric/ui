"use client"

import { useState } from "react"
import { twMerge } from "tailwind-merge"

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

interface TrackerItem {
  id: React.Key
  label: string
  color?: React.CSSProperties["backgroundColor"]
}

interface TrackerProps extends Omit<
  React.ComponentProps<"ol">,
  "aria-label" | "children"
> {
  "aria-label": string
  data: readonly TrackerItem[]
  defaultColor?: React.CSSProperties["backgroundColor"]
}

const trackerItemClassName =
  "h-full min-w-0 flex-1 overflow-hidden px-[0.5px] first:rounded-l-[4px] first:pl-0 last:rounded-r-[4px] last:pr-0 sm:px-px"

const TrackerList = ({ className, ...props }: React.ComponentProps<"ol">) => (
  <ol
    className={twMerge("flex h-8 w-full items-center", className)}
    {...props}
  />
)

const TrackerSegment = ({
  color,
}: {
  color: React.CSSProperties["backgroundColor"]
}) => (
  <span
    aria-hidden="true"
    className="block size-full rounded-[1px] transition-opacity"
    style={{ backgroundColor: color }}
  />
)

const Tracker = ({
  data,
  defaultColor = "var(--secondary)",
  ...props
}: TrackerProps) => {
  const [openItemId, setOpenItemId] = useState<React.Key | null>(null)

  return (
    <TrackerList {...props}>
      {data.map((item) => (
        <li className={trackerItemClassName} key={item.id}>
          <Tooltip
            isOpen={openItemId === item.id}
            onOpenChange={(isOpen) => {
              if (isOpen) {
                setOpenItemId(item.id)
                return
              }

              setOpenItemId((currentItemId) =>
                currentItemId === item.id ? null : currentItemId
              )
            }}
            delay={0}
            closeDelay={0}
          >
            <TooltipTrigger
              aria-label={item.label}
              className="size-full rounded-[1px] outline-hidden hover:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              onPress={() => setOpenItemId(item.id)}
            >
              <TrackerSegment color={item.color ?? defaultColor} />
            </TooltipTrigger>
            <TooltipContent
              arrow={false}
              offset={10}
              placement="top"
              inverse
              className="px-2 py-1.5 text-xs"
            >
              {item.label}
            </TooltipContent>
          </Tooltip>
        </li>
      ))}
    </TrackerList>
  )
}

const StaticTracker = ({
  data,
  defaultColor = "var(--secondary)",
  ...props
}: TrackerProps) => (
  <TrackerList {...props}>
    {data.map((item) => (
      <li className={trackerItemClassName} key={item.id}>
        <TrackerSegment color={item.color ?? defaultColor} />
        <span className="sr-only">{item.label}</span>
      </li>
    ))}
  </TrackerList>
)

export { StaticTracker, Tracker }
export type { TrackerItem, TrackerProps }
