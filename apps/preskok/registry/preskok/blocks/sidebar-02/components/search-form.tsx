import { Search } from "lucide-react"

import { Input, Label } from "@/registry/preskok/ui/preskok-ui/field"

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <div className="py-0">
        <div className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input
            id="search"
            placeholder="Search the docs..."
            className="pl-8"
          />
          <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        </div>
      </div>
    </form>
  )
}
