"use client"

import {
  CalendarDaysIcon,
  CircleDotIcon,
  FlagIcon,
  UserRoundIcon,
} from "lucide-react"

import {
  FilterBar,
  FilterBarAdd,
  FilterBarChips,
  FilterBarClear,
  FilterChip,
  FilterChipField,
  FilterChipOperator,
  FilterChipRemove,
  FilterChipValue,
  type FilterField,
} from "@/registry/preskok/ui/preskok-ui/filter-bar"

const fields: Array<FilterField> = [
  {
    id: "status",
    label: "Status",
    variant: "select",
    // The chip hides its operator, so allow only one: a hidden "is none of" would mislead.
    operators: ["isAnyOf"],
    icon: CircleDotIcon,
    options: [
      { value: "open", label: "Open" },
      { value: "in-progress", label: "In progress" },
      { value: "done", label: "Done" },
    ],
  },
  {
    id: "priority",
    label: "Priority",
    variant: "select",
    // The chip hides its operator, so allow only one: a hidden "is none of" would mislead.
    operators: ["isAnyOf"],
    icon: FlagIcon,
    options: [
      { value: "urgent", label: "Urgent" },
      { value: "high", label: "High" },
      { value: "low", label: "Low" },
    ],
  },
  { id: "assignee", label: "Assignee", variant: "text", icon: UserRoundIcon },
  { id: "due", label: "Due", variant: "date", icon: CalendarDaysIcon },
]

/**
 * Chips built from their parts: Status and Priority skip the operator and read as a tag
 * ("Status · Open"), and the field name shows only as its icon.
 */
export default function FilterBarCustomChipsDemo() {
  return (
    <div className="w-2xl max-w-full">
      <FilterBar
        fields={fields}
        defaultValue={[
          {
            field: "status",
            operator: "isAnyOf",
            value: ["open", "in-progress"],
          },
          {
            field: "priority",
            operator: "isAnyOf",
            value: ["urgent"],
          },
          {
            field: "assignee",
            operator: "contains",
            value: "ana",
          },
        ]}
      >
        <FilterBarChips>
          {({ field }) => (
            <FilterChip className="rounded-full">
              <FilterChipField className="ps-3 [&>span]:sr-only" />
              {field.id === "assignee" ? <FilterChipOperator /> : null}
              <FilterChipValue />
              <FilterChipRemove className="rounded-e-full" />
            </FilterChip>
          )}
        </FilterBarChips>
        <FilterBarAdd />
        <FilterBarClear />
      </FilterBar>
    </div>
  )
}
