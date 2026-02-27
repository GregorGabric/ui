"use client"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
} from "@/registry/preskok/ui/preskok-ui/popover"

export default function PlaygroundPage() {
  return (
    <div className="flex h-screen w-screen flex-1 flex-col">
      <div className="flex max-w-7xl flex-1 flex-col bg-slate-100 p-20">
        <Popover>
          <Button intent="outline">View Vehicle Details</Button>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Vehicle Details</PopoverTitle>
            </PopoverHeader>
            <PopoverBody>
              <Button intent="outline">View Vehicle Details</Button>
              <Button intent="outline">View Vehicle Details 2</Button>
              <Button intent="outline">View Vehicle Details 3</Button>
              <Button intent="outline">View Vehicle Details 4</Button>
              <Button intent="outline">View Vehicle Details 5</Button>
            </PopoverBody>
            <PopoverFooter>
              <Button intent="outline">View Vehicle Details</Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
