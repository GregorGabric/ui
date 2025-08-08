"use client"

import {
  Checkbox,
  CheckboxGroup,
} from "@/registry/preskok/ui/preskok-ui/checkbox"

export default function CheckboxPreskokDemo() {
  return (
    <CheckboxGroup label="Select interests">
      <Checkbox value="dev">Development</Checkbox>
      <Checkbox value="design">Design</Checkbox>
      <Checkbox value="pm">Product Management</Checkbox>
    </CheckboxGroup>
  )
}
