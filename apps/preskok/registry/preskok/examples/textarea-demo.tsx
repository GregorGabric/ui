"use client"

import { Description, Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Textarea } from "@/registry/preskok/ui/preskok-ui/textarea"

export default function TextareaDemo() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="vehicle-description">Vehicle Description</Label>
        <Textarea
          id="vehicle-description"
          placeholder="Describe the vehicle features, condition, and any additional details..."
          aria-describedby="vehicle-description-help"
        />
        <Description id="vehicle-description-help">
          Provide a detailed description for potential buyers
        </Description>
      </div>

      <div className="space-y-1">
        <Label htmlFor="service-notes">Service Notes</Label>
        <Textarea
          id="service-notes"
          placeholder="Enter service history and maintenance notes..."
          defaultValue="Regular oil changes completed. New tires installed. Brake pads replaced at 45,000 miles."
        />
      </div>
    </div>
  )
}
