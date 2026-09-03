"use client"

import { useState, type UIEvent } from "react"
import { getLocalTimeZone, today } from "@internationalized/date"
import { twMerge } from "cn"
import type {
  DateValue,
  RangeCalendarProps,
} from "react-aria-components/RangeCalendar"
import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  RangeCalendar as RangeCalendarPrimitive,
} from "react-aria-components/RangeCalendar"

import { cx } from "@/registry/preskok/lib/primitive"

import { CalendarGridHeader, CalendarHeader } from "./calendar"

function getClosestMonthIndex(
  track: HTMLDivElement | null,
  scrollLeft: number
) {
  if (!track) return 0

  const months = Array.from(track.children) as Array<HTMLElement>
  if (months.length === 0) return 0

  let closestIndex = 0
  let closestDistance = Number.POSITIVE_INFINITY

  for (const [index, month] of months.entries()) {
    const distance = Math.abs(month.offsetLeft - scrollLeft)
    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  }

  return closestIndex
}

export function RangeCalendar<T extends DateValue>({
  className,
  visibleDuration = { months: 1 },
  ...props
}: RangeCalendarProps<T>) {
  const now = today(getLocalTimeZone())
  const visibleMonths = visibleDuration?.months ?? 1
  const monthIds = Array.from(
    { length: visibleMonths },
    (_, index) => index + 1
  )
  const shouldSnap = visibleMonths > 1
  const [activeMonth, setActiveMonth] = useState(0)
  const activeMonthIndex = Math.min(activeMonth, visibleMonths - 1)

  function handleMonthScroll(event: UIEvent<HTMLDivElement>) {
    if (!shouldSnap) {
      return
    }

    const track = event.currentTarget
    const closestMonth = getClosestMonthIndex(track, track.scrollLeft)
    setActiveMonth(Math.min(closestMonth, visibleMonths - 1))
  }

  return (
    <RangeCalendarPrimitive
      data-slot="calendar"
      visibleDuration={visibleDuration}
      className={cx("min-w-0 flex-1", className)}
      {...props}
    >
      <CalendarHeader isRange data-slot="calendar-header" />
      <div
        onScroll={handleMonthScroll}
        data-slot="range-calendar-months"
        data-scroll-snap={shouldSnap || undefined}
        className={twMerge(
          "flex items-start justify-stretch gap-4 [overflow-clip-margin:4px]",
          "data-[scroll-snap=true]:snap-x data-[scroll-snap=true]:snap-mandatory data-[scroll-snap=true]:[scrollbar-width:none] data-[scroll-snap=true]:overflow-x-auto data-[scroll-snap=true]:overflow-y-clip data-[scroll-snap=true]:[-ms-overflow-style:none] data-[scroll-snap=true]:sm:snap-none data-[scroll-snap=true]:sm:overflow-visible data-[scroll-snap=true]:[&::-webkit-scrollbar]:hidden",
          "data-[scroll-snap=true]:[&>[data-slot=range-calendar-month]]:w-full data-[scroll-snap=true]:[&>[data-slot=range-calendar-month]]:shrink-0 data-[scroll-snap=true]:[&>[data-slot=range-calendar-month]]:snap-start data-[scroll-snap=true]:sm:[&>[data-slot=range-calendar-month]]:w-auto data-[scroll-snap=true]:sm:[&>[data-slot=range-calendar-month]]:shrink data-[scroll-snap=true]:sm:[&>[data-slot=range-calendar-month]]:snap-none",
          !shouldSnap && "overflow-clip"
        )}
      >
        {monthIds.map((id) => {
          return (
            <CalendarGrid
              data-slot="range-calendar-month"
              key={id}
              offset={id >= 2 ? { months: id - 1 } : undefined}
              className="[&_td]:border-collapse [&_td]:px-0 [&_td]:py-0.5"
            >
              <CalendarGridHeader />
              <CalendarGridBody>
                {(date) => (
                  <CalendarCell
                    date={date}
                    className={twMerge([
                      "shrink-0 [--cell-foreground:var(--color-primary)] [--cell:var(--color-primary)]/15",
                      "group/calendar-cell selection-start:rounded-s-lg data-outside-month:text-muted-foreground relative size-full cursor-default [line-height:2.286rem] outline-hidden data-selection-end:rounded-e-lg max-md:aspect-square sm:size-9 sm:text-sm md:size-11",
                      "selected:bg-(--cell) selected:text-(--cell-foreground)",
                      "selected:after:bg-primary-foreground focus-visible:after:bg-primary-foreground",
                      "invalid:selected:bg-destructive/10",
                      "[td:first-child_&]:rounded-s-lg [td:last-child_&]:rounded-e-lg",
                      "forced-colors:selected:bg-[Highlight] forced-colors:selected:text-[HighlightText] forced-colors:invalid:selected:bg-[Mark]",
                      date.compare(now) === 0 &&
                        "after:bg-primary selected:after:bg-primary-foreground after:pointer-events-none after:absolute after:start-1/2 after:bottom-1 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-full",
                    ])}
                  >
                    {({
                      formattedDate,
                      isSelected,
                      isSelectionStart,
                      isSelectionEnd,
                      isDisabled,
                      isFocusVisible,
                    }) => {
                      let selectedClassName: string | Array<string>

                      if (isSelected && (isSelectionStart || isSelectionEnd)) {
                        selectedClassName =
                          "bg-primary text-primary-foreground group-invalid/calendar-cell:bg-destructive group-invalid/calendar-cell:text-destructive-foreground forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-colors:group-invalid/calendar-cell:bg-[Mark]"
                      } else if (isSelected) {
                        selectedClassName = [
                          // hover
                          "group-hover/calendar-cell:bg-primary/15",
                          // pressed
                          "group-pressed/calendar-cell:bg-(--cell)",
                          // invalid
                          "group-invalid/calendar-cell:text-destructive group-invalid/calendar-cell:group-hover/calendar-cell:bg-destructive/10 group-invalid/calendar-cell:group-pressed/calendar-cell:bg-destructive/30",
                          // forced-colors
                          "forced-colors:group-pressed/calendar-cell:bg-[Highlight] forced-colors:group-invalid/calendar-cell:group-pressed/calendar-cell:bg-[Mark] forced-colors:text-[HighlightText] forced-colors:group-hover/calendar-cell:bg-[Highlight] forced-colors:group-invalid:group-hover/calendar-cell:bg-[Mark]",
                        ]
                      } else {
                        selectedClassName =
                          "group-hover/calendar-cell:bg-secondary-foreground/15 group-pressed/calendar-cell:bg-secondary-foreground/20 forced-colors:group-pressed/calendar-cell:bg-[Highlight]"
                      }

                      return (
                        <span
                          className={twMerge(
                            "flex size-full items-center justify-center rounded-lg tabular-nums forced-color-adjust-none",
                            isFocusVisible &&
                              "outline-ring outline outline-2 outline-offset-2 forced-colors:outline-[Highlight]",
                            selectedClassName,
                            isDisabled &&
                              "opacity-50 forced-colors:text-[GrayText]"
                          )}
                        >
                          {formattedDate}
                        </span>
                      )
                    }}
                  </CalendarCell>
                )}
              </CalendarGridBody>
            </CalendarGrid>
          )
        })}
      </div>
      <RangeCalendarSwipePills
        shouldSnap={shouldSnap}
        monthIds={monthIds}
        activeMonth={activeMonthIndex}
      />
    </RangeCalendarPrimitive>
  )
}
interface RangeCalendarSwipePillsProps {
  shouldSnap: boolean
  monthIds: Array<number>
  activeMonth: number
}

function RangeCalendarSwipePills({
  shouldSnap,
  monthIds,
  activeMonth,
}: RangeCalendarSwipePillsProps) {
  if (!shouldSnap) {
    return null
  }
  return (
    <div
      aria-hidden="true"
      data-slot="range-calendar-swipe-pills"
      className="mt-3 flex items-center justify-center gap-1.5 sm:hidden"
    >
      {monthIds.map((id) => (
        <span
          key={`pill-${id}`}
          data-slot="range-calendar-swipe-pill"
          data-active={id - 1 === activeMonth || undefined}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20 data-[active=true]:w-4 data-[active=true]:bg-primary/75"
        />
      ))}
    </div>
  )
}
