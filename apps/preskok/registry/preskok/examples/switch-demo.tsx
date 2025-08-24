"use client"

import { Switch } from "@/registry/preskok/ui/preskok-ui/switch"

export default function SwitchDemo() {
  return (
    <div className="space-y-4">
      <Switch defaultSelected>Enable GPS Navigation</Switch>
      <Switch>Automatic Emergency Braking</Switch>
      <Switch>Lane Departure Warning</Switch>
      <Switch defaultSelected>Bluetooth Connectivity</Switch>
      <Switch>Adaptive Cruise Control</Switch>
    </div>
  )
}
