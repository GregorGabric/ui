import { ChoiceBox, ChoiceBoxItem } from "preskok"

export function Single() {
  return (
    <ChoiceBox
      aria-label="Select plan"
      columns={3}
      gap={3}
      defaultSelectedKeys={["growth"]}
      disallowEmptySelection
      className="max-w-3xl"
    >
      <ChoiceBoxItem
        id="starter"
        textValue="Starter"
        label="Starter"
        description="Simple workflows for one project."
      />
      <ChoiceBoxItem
        id="growth"
        textValue="Growth"
        label="Growth"
        description="Shared automation and team analytics."
      />
      <ChoiceBoxItem
        id="enterprise"
        textValue="Enterprise"
        label="Enterprise"
        description="SSO, audit logs, and custom limits."
      />
    </ChoiceBox>
  )
}

export function Multiple() {
  return (
    <ChoiceBox
      aria-label="Select add-ons"
      selectionMode="multiple"
      defaultSelectedKeys={["analytics", "support"]}
      className="max-w-2xl"
    >
      <ChoiceBoxItem
        id="analytics"
        textValue="Analytics"
        label="Analytics"
        description="Weekly reports and cohort breakdowns."
      />
      <ChoiceBoxItem
        id="support"
        textValue="Priority support"
        label="Priority support"
        description="Private escalation queue with four-hour SLA."
      />
      <ChoiceBoxItem
        id="security"
        textValue="Security review"
        label="Security review"
        description="Locked while procurement is pending."
        isDisabled
      />
    </ChoiceBox>
  )
}
