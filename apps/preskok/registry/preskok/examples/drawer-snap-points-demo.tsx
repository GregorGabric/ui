"use client"

import { buttonStyles } from "@/registry/preskok/ui/preskok-ui/button"
import { Drawer } from "@/registry/preskok/ui/preskok-ui/drawer"

const specs = [
  ["Mileage", "42,180 km"],
  ["Fuel", "Diesel"],
  ["Gearbox", "Automatic"],
  ["Power", "140 kW"],
  ["First registration", "03/2022"],
  ["Location", "Ljubljana"],
]

export default function DrawerSnapPointsDemo() {
  return (
    <Drawer>
      <Drawer.Trigger className={buttonStyles({ intent: "outline" })}>
        View vehicle
      </Drawer.Trigger>
      <Drawer.Content snapPoints={[240]}>
        <Drawer.Header>
          <Drawer.Title>Škoda Octavia Combi</Drawer.Title>
          <Drawer.Description>
            Drag up for the full spec sheet, or swipe down to dismiss.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <dl className="divide-y text-sm">
            {specs.map(([term, value]) => (
              <div key={term} className="flex justify-between py-3">
                <dt className="text-muted-foreground">{term}</dt>
                <dd className="font-medium tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close intent="primary" className="w-full">
            Place a bid
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
}
