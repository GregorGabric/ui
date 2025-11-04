"use client"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  ButtonGroup,
  ButtonGroupText,
} from "@/registry/preskok/ui/preskok-ui/button-group"

export default function ButtonGroupPreskokDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium">Horizontal Button Group</h3>
        <ButtonGroup>
          <Button intent="outline">First</Button>
          <Button intent="outline">Second</Button>
          <Button intent="outline">Third</Button>
        </ButtonGroup>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">Vertical Button Group</h3>
        <ButtonGroup orientation="vertical">
          <Button intent="outline">Top</Button>
          <Button intent="outline">Middle</Button>
          <Button intent="outline">Bottom</Button>
        </ButtonGroup>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">With Text Label</h3>
        <ButtonGroup>
          <ButtonGroupText>Actions:</ButtonGroupText>
          <Button intent="outline">Save</Button>
          <Button intent="outline">Cancel</Button>
          <Button intent="primary">Submit</Button>
        </ButtonGroup>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">Mixed Intents</h3>
        <ButtonGroup>
          <Button intent="outline">Cancel</Button>
          <Button intent="secondary">Draft</Button>
          <Button intent="primary">Publish</Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
