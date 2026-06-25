"use client"

import { Checkbox } from "@/registry/preskok/ui/preskok-ui/checkbox"
import { Description } from "@/registry/preskok/ui/preskok-ui/field"

export default function CheckboxSinglePreskokDemo() {
  return (
    <div className="grid gap-4">
      <Checkbox name="terms" value="accepted" isRequired>
        <span data-slot="label">Accept terms and conditions</span>
        <Description>
          Required checkboxes participate in native form validation.
        </Description>
      </Checkbox>
      <Checkbox defaultSelected>
        <span data-slot="label">Email me a receipt</span>
        <Description>Default selected state with helper text.</Description>
      </Checkbox>
      <Checkbox isIndeterminate>
        <span data-slot="label">Some project notifications</span>
        <Description>
          Indeterminate state for partially selected groups.
        </Description>
      </Checkbox>
      <Checkbox isDisabled>
        <span data-slot="label">Locked billing preference</span>
      </Checkbox>
    </div>
  )
}
