"use client"

import { useState } from "react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Popover,
  PopoverBody,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
} from "@/registry/preskok/ui/preskok-ui/popover"

export default function PopoverDemo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Popover>
        <Button intent="outline">Deployment summary</Button>
        <PopoverContent arrow placement="bottom start">
          <PopoverHeader>
            <PopoverTitle>Production deploy</PopoverTitle>
            <PopoverDescription>
              Build completed in 2m 14s and promoted after smoke checks.
            </PopoverDescription>
          </PopoverHeader>
          <PopoverBody>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-muted-foreground">Commit</dt>
              <dd>8f24c91</dd>
              <dt className="text-muted-foreground">Region</dt>
              <dd>iad1</dd>
              <dt className="text-muted-foreground">Runtime</dt>
              <dd>Node.js 24</dd>
            </dl>
          </PopoverBody>
        </PopoverContent>
      </Popover>

      <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button intent="plain">Retention policy</Button>
        <PopoverContent placement="top" className="max-w-sm">
          <PopoverHeader>
            <PopoverTitle>Keep logs for 30 days?</PopoverTitle>
            <PopoverDescription>
              Shorter retention lowers storage cost but limits incident review.
            </PopoverDescription>
          </PopoverHeader>
          <PopoverFooter>
            <PopoverClose intent="outline">Cancel</PopoverClose>
            <Button intent="primary" onPress={() => setIsOpen(false)}>
              Apply
            </Button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </div>
  )
}
