"use client"

import { ToggleGroup } from "@/registry/preskok/ui/preskok-ui/toggle-group"

export default function ToggleGroupDemo() {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Drivetrain Options</label>
        <ToggleGroup
          selectionMode="single"
          defaultSelectedKeys={["fwd"]}
          aria-label="Select drivetrain"
          className="mt-2"
        >
          <ToggleGroup.Item id="fwd">FWD</ToggleGroup.Item>
          <ToggleGroup.Item id="rwd">RWD</ToggleGroup.Item>
          <ToggleGroup.Item id="awd">AWD</ToggleGroup.Item>
          <ToggleGroup.Item id="4wd">4WD</ToggleGroup.Item>
        </ToggleGroup>
      </div>

      <div>
        <label className="text-sm font-medium">Safety Features</label>
        <ToggleGroup
          selectionMode="multiple"
          defaultSelectedKeys={["abs", "airbags"]}
          aria-label="Select safety features"
          className="mt-2"
        >
          <ToggleGroup.Item id="abs">ABS</ToggleGroup.Item>
          <ToggleGroup.Item id="airbags">Airbags</ToggleGroup.Item>
          <ToggleGroup.Item id="esc">ESC</ToggleGroup.Item>
          <ToggleGroup.Item id="tpms">TPMS</ToggleGroup.Item>
        </ToggleGroup>
      </div>

      <div>
        <label className="text-sm font-medium">Transmission Type</label>
        <ToggleGroup
          selectionMode="single"
          defaultSelectedKeys={["automatic"]}
          aria-label="Select transmission"
          className="mt-2"
        >
          <ToggleGroup.Item id="manual">Manual</ToggleGroup.Item>
          <ToggleGroup.Item id="automatic">Automatic</ToggleGroup.Item>
          <ToggleGroup.Item id="cvt">CVT</ToggleGroup.Item>
        </ToggleGroup>
      </div>
    </div>
  )
}
