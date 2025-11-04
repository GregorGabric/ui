"use client"

import {
  CalendarIcon,
  FileIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
} from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/registry/preskok/ui/preskok-ui/command"

export default function CommandPreskokDemo() {
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <CalendarIcon className="mr-2 size-4" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <SmileIcon className="mr-2 size-4" />
            <span>Search Emoji</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <UserIcon className="mr-2 size-4" />
            <span>Profile</span>
          </CommandItem>
          <CommandItem>
            <FileIcon className="mr-2 size-4" />
            <span>Documents</span>
          </CommandItem>
          <CommandItem>
            <SettingsIcon className="mr-2 size-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
