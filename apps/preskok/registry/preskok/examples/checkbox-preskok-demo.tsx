"use client"

import {
  Checkbox,
  CheckboxGroup,
} from "@/registry/preskok/ui/preskok-ui/checkbox"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"

export default function CheckboxPreskokDemo() {
  return (
    <CheckboxGroup>
      <Label>Select interests</Label>
      <Checkbox value="dev">Development</Checkbox>
      <Checkbox value="design">Design</Checkbox>
      <Checkbox value="pm">Product Management</Checkbox>
    </CheckboxGroup>
  )
}
