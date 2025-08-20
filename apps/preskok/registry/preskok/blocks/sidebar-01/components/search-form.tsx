import { SearchField } from "@/registry/preskok/ui/preskok-ui/search-field"

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <SearchField id="search" placeholder="Search the docs..." />
    </form>
  )
}
