"use client"

import * as React from "react"

import { Button } from "@/registry/preskok/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/preskok/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/preskok/ui/popover"

type Status = {
  value: string
  label: string
}

const statuses: Status[] = [
  { value: "inbound", label: "Inbound" },
  { value: "inspection", label: "Inspection" },
  { value: "detail", label: "Detailing" },
  { value: "listed", label: "Listed" },
  { value: "sold", label: "Sold" },
]

export default function ComboboxPopover() {
  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    null
  )

  return (
    <div className="flex items-center space-x-4">
      <p className="text-muted-foreground text-sm">Vehicle status</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedStatus ? (
              <>{selectedStatus.label}</>
            ) : (
              <>+ Set vehicle status</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    onSelect={(value) => {
                      setSelectedStatus(
                        statuses.find((priority) => priority.value === value) ||
                          null
                      )
                      setOpen(false)
                    }}
                  >
                    {status.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
