import { ListBox, ListBoxDescription, ListBoxItem, ListBoxLabel } from "preskok"

const queues = [
  {
    id: "api",
    name: "API incidents",
    description: "Rate limits, latency, and webhook failures",
  },
  {
    id: "billing",
    name: "Billing",
    description: "Invoices, cards, plan changes, and renewals",
  },
  {
    id: "security",
    name: "Security review",
    description: "SOC 2, vendor reviews, and audit requests",
  },
  {
    id: "launch",
    name: "Launch room",
    description: "Locked while a deploy freeze is active",
    isDisabled: true,
  },
]

export function Multiple() {
  return (
    <ListBox
      className="max-w-sm"
      items={queues}
      selectionMode="multiple"
      defaultSelectedKeys={["api", "billing"]}
      aria-label="Support queues"
    >
      {(item) => (
        <ListBoxItem id={item.id} isDisabled={item.isDisabled}>
          <ListBoxLabel>{item.name}</ListBoxLabel>
          <ListBoxDescription>{item.description}</ListBoxDescription>
        </ListBoxItem>
      )}
    </ListBox>
  )
}
