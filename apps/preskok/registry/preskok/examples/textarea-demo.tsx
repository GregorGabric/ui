"use client"

import { Textarea } from "@/registry/preskok/ui/preskok-ui/textarea"

export default function TextareaDemo() {
  return (
    <div className="space-y-4">
      <Textarea
        label="Vehicle Description"
        placeholder="Describe the vehicle features, condition, and any additional details..."
        description="Provide a detailed description for potential buyers"
      />

      <Textarea
        label="Service Notes"
        placeholder="Enter service history and maintenance notes..."
        defaultValue="Regular oil changes completed. New tires installed. Brake pads replaced at 45,000 miles."
      />
    </div>
  )
}
