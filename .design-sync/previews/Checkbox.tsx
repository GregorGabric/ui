import { Checkbox, CheckboxGroup, Description, Label } from "preskok"

export function Group() {
  return (
    <CheckboxGroup defaultValue={["analytics", "alerts"]} className="grid max-w-md gap-3">
      <Label>Workspace notifications</Label>
      <Description>Choose the updates that should be sent to Slack.</Description>
      <Checkbox value="analytics">Weekly analytics digest</Checkbox>
      <Checkbox value="alerts">Critical production alerts</Checkbox>
      <Checkbox value="billing">Billing activity</Checkbox>
      <Checkbox value="launches" isDisabled>
        Launch checklist changes
      </Checkbox>
    </CheckboxGroup>
  )
}

export function States() {
  return (
    <div className="grid max-w-md gap-3">
      <Checkbox name="terms" value="accepted" isRequired>
        <span data-slot="label">Accept terms and conditions</span>
        <Description>Required checkboxes participate in native form validation.</Description>
      </Checkbox>
      <Checkbox defaultSelected>
        <span data-slot="label">Email me a receipt</span>
        <Description>Default selected state with helper text.</Description>
      </Checkbox>
      <Checkbox isIndeterminate>
        <span data-slot="label">Some project notifications</span>
        <Description>Indeterminate state for partially selected groups.</Description>
      </Checkbox>
      <Checkbox isDisabled>
        <span data-slot="label">Locked billing preference</span>
      </Checkbox>
    </div>
  )
}
