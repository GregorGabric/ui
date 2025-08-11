"use client"

import { useState } from "react"
import type { Key, Selection } from "react-aria-components"

import { MultipleSelect } from "@/registry/preskok/ui/preskok-ui/multiple-select"

const items = [
  { id: "design", textValue: "Design" },
  { id: "frontend", textValue: "Frontend" },
  { id: "backend", textValue: "Backend" },
  { id: "docs", textValue: "Docs" },
]

export default function MultipleSelectPreskokDemo() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<Key>())

  return (
    <div className="min-w-64">
      <MultipleSelect
        label="Labels"
        placeholder="Search labels..."
        items={items}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    </div>
  )
}






