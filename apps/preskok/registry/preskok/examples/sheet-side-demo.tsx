"use client"

import { CarIcon, GavelIcon, HandCoinsIcon, SettingsIcon } from "lucide-react"

import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/registry/preskok/ui/preskok-ui/sheet"

const links = [
  { label: "Inventory", icon: CarIcon },
  { label: "Auctions", icon: GavelIcon },
  { label: "Offers", icon: HandCoinsIcon, count: 3 },
  { label: "Settings", icon: SettingsIcon },
]

export default function SheetSideDemo() {
  return (
    <Sheet>
      <Button intent="outline">Open menu</Button>
      <SheetContent side="start" isFloat={false} aria-label="Navigation">
        <SheetHeader>
          <SheetTitle>Cario</SheetTitle>
        </SheetHeader>
        <SheetBody className="gap-1">
          {links.map(({ label, icon: Icon, count }) => (
            <SheetClose
              key={label}
              intent="plain"
              className="-mx-3 justify-start sm:-mx-2.5"
            >
              <Icon data-slot="icon" />
              {label}
              {count && (
                <Badge
                  intent="secondary"
                  className="ms-auto shrink-0 tabular-nums"
                >
                  {count}
                </Badge>
              )}
            </SheetClose>
          ))}
        </SheetBody>
        <SheetFooter>
          <div className="flex items-center gap-3 border-t pt-4">
            <Avatar initials="MK" alt="" />
            <div className="min-w-0 text-sm/5">
              <p className="truncate font-medium">Maja Kovač</p>
              <p className="truncate text-muted-foreground">Avtohiša Kranj</p>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
