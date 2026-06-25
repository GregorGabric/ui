"use client"

import { useState } from "react"

import { Description, Label } from "@/registry/preskok/ui/preskok-ui/field"
import {
  Tag,
  TagGroup,
  TagList,
} from "@/registry/preskok/ui/preskok-ui/tag-group"

const defaultFilters = [
  { id: "finance", name: "Finance" },
  { id: "security", name: "Security" },
  { id: "renewal", name: "Renewal" },
  { id: "blocked", name: "Blocked", isDisabled: true },
]

export default function TagGroupPreskokDemo() {
  const [filters, setFilters] = useState(defaultFilters)

  return (
    <TagGroup
      selectionMode="multiple"
      defaultSelectedKeys={["finance", "renewal"]}
      onRemove={(keys) => {
        setFilters(filters.filter((filter) => !keys.has(filter.id)))
      }}
    >
      <Label>Report filters</Label>
      <Description>
        Selected tags are included in the saved report view.
      </Description>
      <TagList items={filters}>
        {(item) => (
          <Tag id={item.id} isDisabled={item.isDisabled}>
            {item.name}
          </Tag>
        )}
      </TagList>
    </TagGroup>
  )
}
