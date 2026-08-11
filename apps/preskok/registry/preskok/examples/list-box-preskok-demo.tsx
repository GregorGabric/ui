"use client"

import { useState } from "react"
import type { Selection } from "react-aria-components/ListBox"

import {
  ListBox,
  ListBoxDescription,
  ListBoxItem,
  ListBoxLabel,
} from "@/registry/preskok/ui/preskok-ui/list-box"

function formatSelection(selection: Selection) {
  if (selection === "all") {
    return "All"
  }

  return Array.from(selection).join(", ")
}

export default function ListBoxPreskokDemo() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set(["api", "billing"])
  )

  return (
    <div className="grid w-full max-w-sm gap-3">
      <ListBox
        className="max-w-sm"
        items={queues}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        aria-label="Support queues"
      >
        {(item) => (
          <ListBoxItem id={item.id} isDisabled={item.isDisabled}>
            <ListBoxLabel>{item.name}</ListBoxLabel>
            <ListBoxDescription>{item.description}</ListBoxDescription>
          </ListBoxItem>
        )}
      </ListBox>
      <p className="text-sm text-muted-foreground">
        Selected queues: {formatSelection(selectedKeys)}
      </p>
    </div>
  )
}

const queues = [
  {
    id: "api",
    name: "API incidents",
    description: "Rate limits, latency, and webhook failures",
  },
  {
    id: "billing",
    name: "Billing",
    description: "Invoices, cards, plan changes, and renewals",
  },
  {
    id: "security",
    name: "Security review",
    description: "SOC 2, vendor reviews, and audit requests",
  },
  {
    id: "launch",
    name: "Launch room",
    description: "Locked while a deploy freeze is active",
    isDisabled: true,
  },
]
