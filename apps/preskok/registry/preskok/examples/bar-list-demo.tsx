"use client"

import { BarList } from "@/registry/preskok/ui/preskok-ui/bar-list"

const data = [
  { name: "Sales", value: 1200, key: "sales" },
  { name: "Marketing", value: 800, key: "marketing" },
  { name: "Support", value: 600, key: "support" },
  { name: "Development", value: 400, key: "development" },
]

export default function BarListDemo() {
  return (
    <div className="w-full max-w-md">
      <BarList
        data={data}
        valueFormatter={(value) => `$${value.toLocaleString()}`}
      />
    </div>
  )
}
