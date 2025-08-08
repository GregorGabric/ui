"use client"

import { useListData } from "react-stately"

import { TagField } from "@/registry/preskok/ui/preskok-ui/tag-field"

export default function TagFieldPreskokDemo() {
  const list = useListData({ initialItems: [{ id: 1, name: "ui" }] })
  return (
    <TagField
      label="Tags"
      placeholder="Add tag and press Enter"
      list={list}
      max={5}
      description="Up to 5 tags"
      name="tags"
    />
  )
}
