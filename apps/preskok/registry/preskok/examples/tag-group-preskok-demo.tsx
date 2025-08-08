"use client"

import {
  Tag,
  TagGroup,
  TagList,
} from "@/registry/preskok/ui/preskok-ui/tag-group"

const items = [
  { id: 1, name: "Bug" },
  { id: 2, name: "Feature" },
  { id: 3, name: "UX" },
]

export default function TagGroupPreskokDemo() {
  return (
    <TagGroup
      label="Labels"
      description="Select applicable labels"
      selectionMode="multiple"
    >
      <TagList items={items}>
        {(item) => <Tag id={item.id}>{item.name}</Tag>}
      </TagList>
    </TagGroup>
  )
}
