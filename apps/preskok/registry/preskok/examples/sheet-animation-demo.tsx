"use client"

import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  GridList,
  GridListDescription,
  GridListItem,
  GridListLabel,
  GridListSpacer,
  GridListStart,
} from "@/registry/preskok/ui/preskok-ui/grid-list"
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

// `from` is the dismissed state and `to` is fully open; the swipe scrubs between them.
const keyframes = `
@keyframes sheet-tilt {
  from {
    transform-origin: top right;
    transform: skew(10deg) scale(0.8);
  }
  to {
    transform: skew(0deg) scale(1);
  }
}
`

export default function SheetAnimationDemo() {
  return (
    <Sheet>
      {/* React hoists and dedupes the style by `href`, however many sheets render it. */}
      <style href="sheet-tilt" precedence="default">
        {keyframes}
      </style>
      <Button intent="outline">Open garage</Button>
      <SheetContent swipeAnimation="sheet-tilt">
        <SheetHeader>
          <SheetTitle>My garage</SheetTitle>
          <SheetDescription>
            Swipe the sheet slowly to watch it tilt away.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <GridList aria-label="Vehicles" items={vehicles}>
            {(vehicle) => (
              <GridListItem id={vehicle.id} textValue={vehicle.name}>
                <GridListStart>
                  <div>
                    <GridListLabel>{vehicle.name}</GridListLabel>
                    <GridListDescription>{vehicle.plate}</GridListDescription>
                  </div>
                </GridListStart>
                <GridListSpacer />
                <Badge
                  intent={vehicle.intent}
                  className="shrink-0 whitespace-nowrap"
                >
                  {vehicle.status}
                </Badge>
              </GridListItem>
            )}
          </GridList>
        </SheetBody>
        <SheetFooter>
          <SheetClose>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const vehicles = [
  {
    id: "308",
    name: "Peugeot 308 SW",
    plate: "LJ 48-KTE",
    status: "Service soon",
    intent: "secondary",
  },
  {
    id: "yaris",
    name: "Toyota Yaris Hybrid",
    plate: "KR 12-HJA",
    status: "Tyres due",
    intent: "warning",
  },
  {
    id: "kangoo",
    name: "Renault Kangoo",
    plate: "MB 77-PLS",
    status: "Up to date",
    intent: "success",
  },
] as const
