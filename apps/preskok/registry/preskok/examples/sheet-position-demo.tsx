"use client"

import { useState } from "react"
import { CheckIcon } from "lucide-react"

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
import type { Sides } from "@/registry/preskok/ui/preskok-ui/sheet"
import { Switch, SwitchLabel } from "@/registry/preskok/ui/preskok-ui/switch"

const sides: Sides[] = ["top", "right", "bottom", "left", "center"]

export default function SheetPositionDemo() {
  const [isFloat, setIsFloat] = useState(true)

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap gap-2">
        {sides.map((side) => (
          <Sheet key={side}>
            <Button intent="outline" className="capitalize">
              {side}
            </Button>
            <SheetContent side={side} isFloat={isFloat}>
              <SheetHeader>
                <SheetTitle>Saved searches</SheetTitle>
                <SheetDescription>
                  {side === "center"
                    ? "Swipe up or down to dismiss."
                    : `Opened from the ${side}. Swipe toward that edge to dismiss.`}
                </SheetDescription>
              </SheetHeader>
              <SheetBody>
                <SavedSearches />
              </SheetBody>
              <SheetFooter>
                <SheetClose>Close</SheetClose>
                <SheetClose intent="primary">Show results</SheetClose>
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

function SavedSearches() {
  return (
    <GridList
      aria-label="Saved searches"
      selectionMode="single"
      disallowEmptySelection
      defaultSelectedKeys={["audi"]}
      items={searches}
    >
      {(search) => (
        <GridListItem id={search.id} textValue={search.name}>
          {({ isSelected }) => (
            <>
              <GridListStart>
                <div>
                  <GridListLabel>{search.name}</GridListLabel>
                  <GridListDescription>{search.filters}</GridListDescription>
                </div>
              </GridListStart>
              <GridListSpacer />
              {search.newCount > 0 && (
                <Badge
                  intent="secondary"
                  className="shrink-0 whitespace-nowrap tabular-nums"
                >
                  {search.newCount} new
                </Badge>
              )}
              {isSelected && <CheckIcon data-slot="icon" aria-hidden />}
            </>
          )}
        </GridListItem>
      )}
    </GridList>
  )
}

const searches = [
  {
    id: "audi",
    name: "Audi A4 Avant",
    filters: "Diesel · From 2019",
    newCount: 12,
  },
  {
    id: "golf",
    name: "Volkswagen Golf",
    filters: "Petrol · Under €18,000",
    newCount: 4,
  },
  {
    id: "vans",
    name: "Delivery vans",
    filters: "Trafic, Transit · Under 150k km",
    newCount: 0,
  },
]
