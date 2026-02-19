"use client"

import { getLocalTimeZone, today } from "@internationalized/date"
import type { DateValue, RangeCalendarProps } from "react-aria-components"
import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  RangeCalendar as RangeCalendarPrimitive,
} from "react-aria-components"
import { twMerge } from "tailwind-merge"

import { cx } from "@/registry/preskok/lib/primitive"

import { CalendarGridHeader, CalendarHeader } from "./calendar"

export function RangeCalendar<T extends DateValue>({
  className,
  visibleDuration = { months: 1 },
  ...props
}: RangeCalendarProps<T>) {
  const now = today(getLocalTimeZone())
  const visibleMonths = visibleDuration?.months ?? 1
  const shouldSnap = visibleMonths > 1

  return (
    <RangeCalendarPrimitive
      data-slot="calendar"
      visibleDuration={visibleDuration}
      className={cx("min-w-0", className)}
      {...props}
    >
      <CalendarHeader isRange data-slot="calendar-header" />
      <div
        data-slot="range-calendar-months"
        data-scroll-snap={shouldSnap || undefined}
        className={twMerge(
          "flex items-start justify-stretch gap-6 [overflow-clip-margin:4px] sm:gap-10",
          "data-[scroll-snap=true]:snap-x data-[scroll-snap=true]:snap-mandatory data-[scroll-snap=true]:overflow-x-auto data-[scroll-snap=true]:overflow-y-clip data-[scroll-snap=true]:[-ms-overflow-style:none] data-[scroll-snap=true]:[scrollbar-width:none] data-[scroll-snap=true]:sm:snap-none data-[scroll-snap=true]:sm:overflow-visible data-[scroll-snap=true]:[&::-webkit-scrollbar]:hidden",
          "data-[scroll-snap=true]:[&>[data-slot=range-calendar-month]]:w-full data-[scroll-snap=true]:[&>[data-slot=range-calendar-month]]:shrink-0 data-[scroll-snap=true]:[&>[data-slot=range-calendar-month]]:snap-start data-[scroll-snap=true]:sm:[&>[data-slot=range-calendar-month]]:w-auto data-[scroll-snap=true]:sm:[&>[data-slot=range-calendar-month]]:shrink data-[scroll-snap=true]:sm:[&>[data-slot=range-calendar-month]]:snap-none",
          !shouldSnap && "overflow-clip"
        )}
      >
        {Array.from({ length: visibleMonths }).map((_, index) => {
          const id = index + 1
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
                      "group/calendar-cell selection-start:rounded-s-lg data-outside-month:text-muted-foreground relative size-11 cursor-default [line-height:2.286rem] outline-hidden data-selection-end:rounded-e-lg sm:size-9 sm:text-sm",
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
    </RangeCalendarPrimitive>
  )
}
