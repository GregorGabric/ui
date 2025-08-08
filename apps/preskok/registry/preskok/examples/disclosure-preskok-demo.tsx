"use client"

import {
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  DisclosureTrigger,
} from "@/registry/preskok/ui/preskok-ui/disclosure"

export default function DisclosurePreskokDemo() {
  return (
    <DisclosureGroup defaultExpandedKeys={["general"]}>
      <Disclosure id="general">
        <DisclosureTrigger>General</DisclosureTrigger>
        <DisclosurePanel>
          <div className="p-3">General settings content...</div>
        </DisclosurePanel>
      </Disclosure>
      <Disclosure id="advanced">
        <DisclosureTrigger>Advanced</DisclosureTrigger>
        <DisclosurePanel>
          <div className="p-3">Advanced settings content...</div>
        </DisclosurePanel>
      </Disclosure>
    </DisclosureGroup>
  )
}
