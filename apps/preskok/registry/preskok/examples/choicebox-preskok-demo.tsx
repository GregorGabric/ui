"use client"

import { useState } from "react"
import type { Selection } from "react-aria-components/GridList"

import {
  ChoiceBox,
  ChoiceBoxItem,
} from "@/registry/preskok/ui/preskok-ui/choice-box"

export default function ChoiceBoxPreskokDemo() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set(["analytics", "support"])
  )

  return (
    <div className="grid w-full max-w-3xl gap-6">
      <ChoiceBox
        aria-label="Select plan"
        columns={3}
        gap={3}
        defaultSelectedKeys={["growth"]}
        disallowEmptySelection
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

      <ChoiceBox
        aria-label="Select add-ons"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
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
    </div>
  )
}
