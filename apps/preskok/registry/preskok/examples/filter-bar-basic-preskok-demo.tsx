"use client"

import { CircleDotIcon, TagIcon, UserRoundIcon } from "lucide-react"

import {
  FilterBar,
  FilterBarAdd,
  FilterBarChips,
  FilterBarClear,
  type FilterField,
} from "@/registry/preskok/ui/preskok-ui/filter-bar"

const fields: Array<FilterField> = [
  {
    id: "status",
    label: "Status",
    variant: "select",
    icon: CircleDotIcon,
    options: [
      { value: "open", label: "Open" },
      { value: "in-progress", label: "In progress" },
      { value: "done", label: "Done" },
    ],
  },
  { id: "title", label: "Title", variant: "text", icon: TagIcon },
  {
    id: "assignee",
    label: "Assignee",
    variant: "select",
    icon: UserRoundIcon,
    multiple: false,
    options: [
      { value: "ana", label: "Ana Novak" },
      { value: "luka", label: "Luka Horvat" },
      { value: "maja", label: "Maja Kranjc" },
    ],
  },
]

/** Uncontrolled: the bar keeps its own filters, starting from `defaultValue`. */
export default function FilterBarBasicDemo() {
  return (
    <div className="w-2xl max-w-full">
      <FilterBar
        fields={fields}
        defaultValue={[
          {
            field: "status",
            operator: "isAnyOf",
            value: { type: "options", values: ["open"] },
          },
        ]}
      >
        <FilterBarChips />
        <FilterBarAdd />
        <FilterBarClear />
      </FilterBar>
    </div>
  )
}
