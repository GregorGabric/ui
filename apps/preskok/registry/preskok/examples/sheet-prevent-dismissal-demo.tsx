"use client"

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

export default function SheetPreventDismissalDemo() {
  return (
    <Sheet>
      <Button intent="primary">Place bid</Button>
      <SheetContent side="bottom" role="alertdialog">
        <SheetHeader>
          <SheetTitle>Confirm your bid of €21,400?</SheetTitle>
          <SheetDescription>
            Bids are binding. If you win, the invoice is due within 3 working
            days.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Your bid</dt>
            <dd className="text-right tabular-nums">€21,400</dd>
            <dt className="text-muted-foreground">Buyer fee</dt>
            <dd className="text-right tabular-nums">€390</dd>
            <dt className="font-medium">Total if you win</dt>
            <dd className="text-right font-medium tabular-nums">€21,790</dd>
          </dl>
        </SheetBody>
        <SheetFooter>
          <SheetClose intent="outline">Cancel</SheetClose>
          <SheetClose intent="primary">Confirm bid</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
