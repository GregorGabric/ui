"use client"

import { Tabs } from "@/registry/preskok/ui/preskok-ui/tabs"

const vehicleSpecs = [
  {
    id: "overview",
    title: "Overview",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold">2024 Toyota Camry LE</h4>
          <p className="text-muted-foreground">
            A reliable mid-size sedan with excellent fuel economy and advanced
            safety features.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">MSRP:</span> $28,400
          </div>
          <div>
            <span className="font-medium">MPG:</span> 32 city / 41 highway
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "engine",
    title: "Engine",
    content: (
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold">2.5L 4-Cylinder Engine</h4>
          <p className="text-muted-foreground">
            Dynamic Force Engine with improved fuel efficiency and performance.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Horsepower:</span> 203 hp
          </div>
          <div>
            <span className="font-medium">Torque:</span> 184 lb-ft
          </div>
          <div>
            <span className="font-medium">Transmission:</span> 8-Speed Automatic
          </div>
          <div>
            <span className="font-medium">Fuel Type:</span> Regular Gasoline
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "features",
    title: "Features",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold">Standard Features</h4>
        <ul className="space-y-1 text-sm">
          <li>• Toyota Safety Sense 2.0</li>
          <li>• 8-inch touchscreen display</li>
          <li>• Apple CarPlay & Android Auto</li>
          <li>• Dual-zone automatic climate control</li>
          <li>• LED headlights and taillights</li>
          <li>• 17-inch alloy wheels</li>
        </ul>
      </div>
    ),
  },
]

export default function TabsDemo() {
  return (
    <div className="w-full max-w-2xl">
      <Tabs defaultSelectedKey="overview" items={vehicleSpecs}>
        {(item) => <Tabs.Panel>{item.content}</Tabs.Panel>}
      </Tabs>
    </div>
  )
}
