"use client"

import { Choicebox } from "@/registry/preskok/ui/preskok-ui/choicebox"

type Option = { id: string; label: string; description?: string }

const options: Option[] = [
  { id: "basic", label: "Basic", description: "For personal projects" },
  { id: "pro", label: "Pro", description: "For small teams" },
  { id: "enterprise", label: "Enterprise", description: "For large orgs" },
]

export default function ChoiceboxPreskokDemo() {
  return (
    <Choicebox<Option>
      aria-label="Plans"
      items={options}
      columns={3}
      gap={4}
      selectionMode="single"
    >
      {(item) => (
        <Choicebox.Item key={item.id}>
          <Choicebox.Label>{item.label}</Choicebox.Label>
          {item.description && (
            <Choicebox.Description>{item.description}</Choicebox.Description>
          )}
        </Choicebox.Item>
      )}
    </Choicebox>
  )
}
