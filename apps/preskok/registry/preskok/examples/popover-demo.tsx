"use client"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from "@/registry/preskok/ui/preskok-ui/popover"

export default function PopoverDemo() {
  return (
    <Popover>
      <Button intent="outline">View Vehicle Details</Button>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>2024 Toyota Camry</PopoverTitle>
          <PopoverDescription>
            This vehicle is available for test drive and comes with a 5-year
            warranty.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}
