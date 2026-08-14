"use client"

import { useState } from "react"

import { BarList } from "@/registry/preskok/ui/preskok-ui/bar-list"

const data = [
  { name: "Dashboard", value: 12400, key: "dashboard", href: "/docs" },
  { name: "Reports", value: 9800, key: "reports" },
  { name: "Settings", value: 4200, key: "settings" },
  { name: "Billing", value: 3100, key: "billing" },
]

export default function BarListDemo() {
  const [selected, setSelected] = useState("Dashboard")

  return (
    <div className="grid w-full max-w-md gap-3">
      <BarList
        data={data}
        showAnimation
        valueFormatter={(value) => value.toLocaleString()}
        onValueChange={(item) => setSelected(item.name)}
      />
      <p className="text-sm text-muted-foreground">Selected: {selected}</p>
    </div>
  )
}
