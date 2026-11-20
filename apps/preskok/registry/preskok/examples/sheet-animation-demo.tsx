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
        <SheetBody className="gap-2 text-sm">
          <p>Peugeot 308 SW · Next service in 2,400 km</p>
          <p>Toyota Yaris Hybrid · Tyres due in November</p>
        </SheetBody>
        <SheetFooter>
          <SheetClose>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
