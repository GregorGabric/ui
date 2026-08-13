import {
  Description,
  Label,
  Select,
  SelectContent,
  SelectDescription,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "preskok"

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

export function Basic() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Select
        defaultSelectedKey="growth"
        placeholder="Select a plan"
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
    </div>
  )
}
