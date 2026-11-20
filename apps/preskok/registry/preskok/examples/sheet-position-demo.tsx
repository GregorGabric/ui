"use client"

import { useState } from "react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/registry/preskok/ui/preskok-ui/sheet"
import type { Sides } from "@/registry/preskok/ui/preskok-ui/sheet"
import { Switch, SwitchLabel } from "@/registry/preskok/ui/preskok-ui/switch"

const sides: Sides[] = ["top", "right", "bottom", "left", "center"]

export default function SheetPositionDemo() {
  const [isFloat, setIsFloat] = useState(true)

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center gap-2">
        {sides.map((side) => (
          <Sheet key={side}>
            <Button intent="outline" className="capitalize">
              {side}
            </Button>
            <SheetContent side={side} isFloat={isFloat}>
              <SheetHeader>
                <SheetTitle className="first-letter:uppercase">
                  {side} sheet
                </SheetTitle>
                <SheetDescription>
                  {side === "center"
                    ? "Swipe up or down to dismiss."
                    : `Swipe toward the ${side} edge to dismiss.`}
                </SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p className="text-sm text-muted-foreground">
                  Use the edge that matches where the content lives on the page.
                  A bottom sheet suits phones, and a right sheet suits details
                  next to a table.
                </p>
              </SheetBody>
              <SheetFooter>
                <SheetClose intent="outline">Close</SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </div>
      <Switch isSelected={isFloat} onChange={setIsFloat}>
        <SwitchLabel>Float</SwitchLabel>
      </Switch>
    </div>
  )
}
