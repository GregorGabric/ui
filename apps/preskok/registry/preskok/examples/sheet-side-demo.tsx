"use client"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/registry/preskok/ui/preskok-ui/sheet"

const links = ["Inventory", "Auctions", "Offers", "Settings"]

export default function SheetSideDemo() {
  return (
    <Sheet>
      <Button intent="outline">Open menu</Button>
      <SheetContent side="start" isFloat={false} aria-label="Navigation">
        <SheetHeader>
          <SheetTitle>Cario</SheetTitle>
        </SheetHeader>
        <SheetBody className="gap-1">
          {links.map((link) => (
            <SheetClose key={link} className="justify-start">
              {link}
            </SheetClose>
          ))}
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
