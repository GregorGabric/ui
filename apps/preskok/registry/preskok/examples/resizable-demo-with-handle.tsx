"use client"

import { Card, CardContent } from "@/registry/preskok/ui/preskok-ui/card"

export default function ResizableDemoWithHandle() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Vehicle Comparison Layout</h3>
        <p className="text-muted-foreground text-sm">
          Resize the panels to compare different vehicles side by side
        </p>
      </div>

      <div className="flex h-64 gap-2">
        <Card className="min-w-0 flex-1">
          <CardContent className="p-4">
            <div className="space-y-2">
              <h4 className="font-medium">2024 Toyota Camry</h4>
              <div className="space-y-1 text-sm">
                <p>Price: $28,400</p>
                <p>MPG: 32/41</p>
                <p>Engine: 2.5L 4-Cyl</p>
                <p>Safety: 5-Star</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-border hover:bg-primary/50 w-1 cursor-col-resize transition-colors" />

        <Card className="min-w-0 flex-1">
          <CardContent className="p-4">
            <div className="space-y-2">
              <h4 className="font-medium">2024 Honda Accord</h4>
              <div className="space-y-1 text-sm">
                <p>Price: $26,800</p>
                <p>MPG: 48/47</p>
                <p>Engine: 2.0L Hybrid</p>
                <p>Safety: 5-Star</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-muted-foreground text-center text-xs">
        Note: This is a visual representation. Real resizable panels would
        require additional dependencies.
      </p>
    </div>
  )
}
