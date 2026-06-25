"use client"

import { useState } from "react"
import type { Key } from "react-aria-components/Select"

import { Description, Label } from "@/registry/preskok/ui/preskok-ui/field"
import {
  Select,
  SelectContent,
  SelectDescription,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/registry/preskok/ui/preskok-ui/select"

export default function SelectDemo() {
  const [value, setValue] = useState("growth")

  function handleChange(value: Key | null) {
    if (value) {
      setValue(value.toString())
    }
  }

  return (
    <div className="grid w-full max-w-sm gap-3">
      <Select
        placeholder="Select a plan"
        value={value}
        onChange={handleChange}
        aria-label="Plan"
      >
        <Label>Plan</Label>
        <Description>
          Disabled items stay visible but cannot be selected.
        </Description>
        <SelectTrigger />
        <SelectContent items={plans}>
          {(item) => (
            <SelectItem
              id={item.id}
              textValue={item.name}
              isDisabled={item.isDisabled}
            >
              <SelectLabel>{item.name}</SelectLabel>
              <SelectDescription>{item.description}</SelectDescription>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      <p className="text-muted-foreground text-sm">Current value: {value}</p>
    </div>
  )
}

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "1 workspace and 3 editors",
  },
  {
    id: "growth",
    name: "Growth",
    description: "Unlimited projects with shared analytics",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "SSO, audit logs, and custom limits",
  },
  {
    id: "legacy",
    name: "Legacy",
    description: "Existing customers only",
    isDisabled: true,
  },
]
