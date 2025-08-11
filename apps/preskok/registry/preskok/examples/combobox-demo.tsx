"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
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

const makes = [
  { value: "toyota", label: "Toyota" },
  { value: "ford", label: "Ford" },
  { value: "bmw", label: "BMW" },
  { value: "tesla", label: "Tesla" },
  { value: "honda", label: "Honda" },
]

export default function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? makes.find((make) => make.value === value)?.label
            : "Select make..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search make..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {makes.map((make) => (
                <CommandItem
                  key={make.value}
                  value={make.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {make.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === make.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
