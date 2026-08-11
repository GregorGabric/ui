"use client"

import { useState } from "react"

import {
  Checkbox,
  CheckboxGroup,
} from "@/registry/preskok/ui/preskok-ui/checkbox"
import { Description, Label } from "@/registry/preskok/ui/preskok-ui/field"

export default function CheckboxPreskokDemo() {
  const [selected, setSelected] = useState(["analytics", "alerts"])

  return (
    <div className="grid w-full max-w-md gap-4">
      <CheckboxGroup value={selected} onChange={setSelected}>
        <Label>Workspace notifications</Label>
        <Description>
          Choose the updates that should be sent to Slack.
        </Description>
        <Checkbox value="analytics">Weekly analytics digest</Checkbox>
        <Checkbox value="alerts">Critical production alerts</Checkbox>
        <Checkbox value="billing">Billing activity</Checkbox>
        <Checkbox value="launches" isDisabled>
          Launch checklist changes
        </Checkbox>
      </CheckboxGroup>
      <p className="text-sm text-muted-foreground">
        Selected: {selected.join(", ")}
      </p>
    </div>
  )
}
