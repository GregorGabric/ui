import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import { SearchField } from "@/registry/preskok/ui/preskok-ui/search-field"

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <div className="py-0">
        <div className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SearchField id="search" placeholder="Search the docs..." />
        </div>
      </div>
    </form>
  )
}
