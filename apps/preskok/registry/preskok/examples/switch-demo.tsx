"use client"

import { Description } from "@/registry/preskok/ui/preskok-ui/field"
import { Switch, SwitchLabel } from "@/registry/preskok/ui/preskok-ui/switch"

export default function SwitchDemo() {
  return (
    <div className="grid gap-4">
      <Switch defaultSelected name="notifications" value="enabled">
        <SwitchLabel>Product updates</SwitchLabel>
        <Description>Send a digest when watched projects change.</Description>
      </Switch>
      <Switch>
        <SwitchLabel>Quiet hours</SwitchLabel>
        <Description>Pause notifications outside working hours.</Description>
      </Switch>
      <Switch isDisabled defaultSelected>
        <SwitchLabel>Security alerts</SwitchLabel>
        <Description>Locked by organization policy.</Description>
      </Switch>
    </div>
  )
}
