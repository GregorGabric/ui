"use client"

import { CalendarDaysIcon, CarFrontIcon, EuroIcon } from "lucide-react"
import { I18nProvider } from "react-aria-components/I18nProvider"

import {
  FilterBar,
  FilterBarAdd,
  FilterBarChips,
  FilterBarClear,
  type FilterBarMessages,
  type FilterField,
} from "@/registry/preskok/ui/preskok-ui/filter-bar"

const fields: Array<FilterField> = [
  {
    id: "make",
    label: "Znamka",
    variant: "select",
    icon: CarFrontIcon,
    options: ["Audi", "BMW", "Škoda", "Volkswagen"].map((make) => ({
      value: make,
      label: make,
    })),
  },
  { id: "price", label: "Cena", variant: "number", icon: EuroIcon, unit: "€" },
  {
    id: "listed",
    label: "Objavljeno",
    variant: "date",
    icon: CalendarDaysIcon,
  },
]

const messages: FilterBarMessages = {
  filter: "Filter",
  addFilter: "Dodaj filter",
  clear: "Počisti",
  searchFields: "Filtriraj po…",
  noFields: "Ni polj",
  noResults: "Ni zadetkov",
  backToFields: "Nazaj na polja",
  min: "Od",
  max: "Do",
  and: "in",
  inPreset: "v",
  removeFilter: (field) => `Odstrani filter ${field}`,
  operators: {
    isAnyOf: "je katerikoli od",
    isNoneOf: "ni nobeden od",
    is: "je",
    isNot: "ni",
    between: "je med",
    lt: "je manj kot",
    lte: "je največ",
    gt: "je več kot",
    gte: "je vsaj",
    isEmpty: "je prazno",
    isNotEmpty: "ni prazno",
  },
  datePresets: {
    today: "Danes",
    "7d": "Zadnjih 7 dni",
    "30d": "Zadnjih 30 dni",
    "90d": "Zadnjih 90 dni",
    year: "Letos",
  },
  placeholders: { select: "Izberi…", number: "Vnesi…", date: "Izberi datume…" },
}

/** Slovenian strings; numbers and dates follow the `sl-SI` locale from React Aria. */
export default function FilterBarMessagesDemo() {
  return (
    <I18nProvider locale="sl-SI">
      <div className="w-2xl max-w-full">
        <FilterBar
          fields={fields}
          messages={messages}
          defaultValue={[
            {
              field: "price",
              operator: "between",
              value: { type: "range", min: 12_500, max: 30_000 },
            },
            {
              field: "listed",
              operator: "between",
              value: { type: "days", start: "2026-09-01", end: "2026-11-15" },
            },
          ]}
        >
          <FilterBarChips />
          <FilterBarAdd />
          <FilterBarClear />
        </FilterBar>
      </div>
    </I18nProvider>
  )
}
