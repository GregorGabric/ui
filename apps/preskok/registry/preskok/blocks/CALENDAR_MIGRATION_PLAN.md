# Preskok UI Calendar Migration Plan

Scope: Replace react-day-picker based blocks with Preskok UI calendar primitives across all `apps/preskok/registry/preskok/blocks/calendar-*.tsx` files.

Components to target next (remaining):

- calendar-06.tsx … calendar-32.tsx

## Global approach

- Use `@/registry/preskok/ui/preskok-ui/calendar` for single-date selection.
- Use `@/registry/preskok/ui/preskok-ui/range-calendar` for range selection.
- Replace `Date` with `CalendarDate` and `RangeValue<CalendarDate>` from `@internationalized/date` / `react-aria-components`.
- Initialize state lazily to satisfy linter: `useState(() => parseDate("YYYY-MM-DD"))`.
- Wrap calendar with `div.inline-block.rounded-lg.border.shadow-sm` to preserve previous styling. Keep component `className` minimal unless needed.
- Remove react-day-picker-only props (e.g., `mode`, `defaultMonth`, `month`, `onMonthChange`, `showOutsideDays`, `modifiers*`, `buttonVariant`, `formatters`, `captionLayout`, `locale` from rdp).
- Prefer these react-aria props instead:
  - Single: `value`, `defaultValue`, `onChange`.
  - Range: `value`, `defaultValue`, `onChange`, `visibleDuration={{ months: N }}`.
  - Bounds: `minValue`, `maxValue`.
  - Disable dates: `isDateUnavailable={(date) => boolean}`.
  - Locales: Wrap block in `I18nProvider` (from `@react-aria/i18n`) when switching locales per-example.

## Feature mapping

- Single date:
  - from: `Date` → `CalendarDate` via `parseDate("YYYY-MM-DD")`.
  - Calendar: `<Calendar value={date} onChange={setDate} />`.
- Date range:
  - from `{ from: Date; to: Date }` → `RangeValue<CalendarDate>`: `{ start: parseDate("YYYY-MM-DD"), end: parseDate("YYYY-MM-DD") }`.
  - RangeCalendar: `<RangeCalendar value={range} onChange={setRange} />`.
- Two-month range views:
  - Use `<RangeCalendar visibleDuration={{ months: 2 }} />`.
- Two-month single views:
  - Not supported directly by our `Calendar` wrapper. Keep single-month view. If truly needed, consider DatePicker overlay (out-of-scope for these blocks).
- Disabled before/after a date:
  - Use `minValue` / `maxValue` on `Calendar`/`RangeCalendar` with `parseDate`.
- Disable weekends:
  - Use `isDateUnavailable={(d) => d.dayOfWeek === 0 || d.dayOfWeek === 6}`.
- Limit navigation to a range of months:
  - Use `minValue` / `maxValue` (applies at day level and effectively bounds navigation).
- Min/max nights for ranges:
  - Not a native prop. Keep the explanatory helper text under the calendar.
  - Optionally compute validation and set `errorMessage` on `RangeCalendar` when out-of-bounds.
- Booked/special modifiers with custom class names:
  - Map to `isDateUnavailable` (disables dates). Visual strikethrough modifiers are not first-class; we’ll accept disabled styling.
- Week number column:
  - Not supported in Preskok UI calendar. Omit.
- Month dropdown modes (captionLayout):
  - The Preskok header already shows month/year dropdowns. We won’t replicate per-mode toggles.
- Imperative month control (Today button, onMonthChange):
  - Use `setDate(today(getLocalTimeZone()))`. No separate `month` state.
- Locale switching:
  - Use `I18nProvider locale="xx-YY"` around the block and localized strings object for titles/descriptions.

## Code patterns

Single date (baseline):

```tsx
import * as React from "react"
import { parseDate, type CalendarDate } from "@internationalized/date"

import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function Example() {
  const [date, setDate] = React.useState<CalendarDate>(() =>
    parseDate("2025-06-12")
  )
  return (
    <div className="inline-block rounded-lg border shadow-sm">
      <Calendar value={date} onChange={setDate} />
    </div>
  )
}
```

Range with two months and min/max bounds:

```tsx
import * as React from "react"
import { parseDate, type CalendarDate } from "@internationalized/date"
import type { RangeValue } from "react-aria-components"

import { RangeCalendar } from "@/registry/preskok/ui/preskok-ui/range-calendar"

export default function Example() {
  const [range, setRange] = React.useState<RangeValue<CalendarDate>>(() => ({
    start: parseDate("2025-06-12"),
    end: parseDate("2025-06-26"),
  }))
  return (
    <div className="inline-block rounded-lg border shadow-sm">
      <RangeCalendar
        value={range}
        onChange={setRange}
        visibleDuration={{ months: 2 }}
        minValue={parseDate("2025-06-01")}
        maxValue={parseDate("2025-07-31")}
      />
    </div>
  )
}
```

Disable weekends (single or range):

```tsx
const isWeekend = (d: CalendarDate) => d.dayOfWeek === 0 || d.dayOfWeek === 6
// <Calendar isDateUnavailable={isWeekend} /> or <RangeCalendar isDateUnavailable={isWeekend} />
```

Locale example (per-block):

```tsx
import { I18nProvider } from "@react-aria/i18n"

// ...

;<I18nProvider locale="es-ES">
  <Calendar value={date} onChange={setDate} />
  {/* localized headings/labels remain app-driven */}
  {/* keep wrapper styles consistent */}
  <div className="text-muted-foreground text-center text-xs">…</div>
  {/* optional helper text */}
</I18nProvider>
```

## Per-file checklist

For each file below, apply the global approach and relevant mappings. Keep helper/explanatory text intact under the calendar.

- [ ] calendar-06: Range with min nights. Use `RangeCalendar`; keep helper text; optionally surface `errorMessage` when `< 5` nights.
- [ ] calendar-07: Range with `min=2` / `max=20`. Use `RangeCalendar`; compute nights and optionally set `errorMessage` when outside bounds; keep two-month view with `visibleDuration={{ months: 2 }}`.
- [ ] calendar-08: Single with dates disabled before a date. Use `Calendar` with `minValue`.
- [ ] calendar-09: Range with weekends disabled. Use `RangeCalendar` + `isDateUnavailable={isWeekend}`; keep two-month view.
- [ ] calendar-10: Card with “Today” button. Drop `month` state; set `date` to `today(getLocalTimeZone())` on click; keep `Card` UI.
- [ ] calendar-11: Range limited to June–July and no nav outside. Use `minValue/maxValue` bounding; keep two-month view and helper text.
- [ ] calendar-12: Locale switcher + card. Replace rdp `locale` with `I18nProvider`; keep select that toggles `locale` state and texts.
- [ ] calendar-13: Caption layout toggles. Keep Calendar defaults (month/year dropdowns available). Replace the toggles with a no-op UI (or repurpose to demonstrate other options). Document limitation in code comments.
- [ ] calendar-14: Booked dates. Use `isDateUnavailable` with a `Set` of `CalendarDate`s. Accept disabled styling (no strikethrough modifiers). Keep `bookedDates` generation.
- [ ] calendar-15: Week numbers. Omit week numbers; keep rest of styling. Document limitation in code comments.
- [ ] calendar-16: Calendar + time inputs (footer). Use `Calendar` only; keep time inputs intact.
- [ ] calendar-17: Compact calendar + two time inputs with dash. Same as 16; keep classes.
- [ ] calendar-18: Ghost variant & custom cell sizes. Remove `buttonVariant`; keep sizing via wrapper class if needed.
- [ ] calendar-19: Preset buttons (Today/Tomorrow/…). Use `today(getLocalTimeZone()).add({ days: n })` and `setDate` (as `CalendarDate`). Keep `Card` layout.
- [ ] calendar-20: Complex layout with side time slots and booked days. Replace booked/formatters/`showOutsideDays` with `isDateUnavailable` and defaults; keep time slot logic.
- [ ] calendar-21 … calendar-32: Inspect and apply the same transformation patterns: Single vs Range; disabled dates → `minValue/maxValue/isDateUnavailable`; 2-month ranges via `visibleDuration`.

## Validation and QA

- After each edit: run linter on the file.
- Visual checks: verify header dropdowns, navigation, disabled dates, and helper text.
- Interaction checks: value and onChange behavior; “Today”/preset buttons; time input integrity.

## Notes / Limitations

- Single-date multi-month views are not supported by our `Calendar` wrapper; we’ll keep single-month.
- Decorated modifiers (e.g., strikethrough “booked”) are not first-class; dates will appear disabled.
- Week numbers and advanced caption layouts are not provided by Preskok UI calendar.
