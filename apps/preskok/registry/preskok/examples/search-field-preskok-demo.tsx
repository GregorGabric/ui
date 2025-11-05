"use client"

import {
  SearchField,
  SearchInput,
} from "@/registry/preskok/ui/preskok-ui/search-field"

export function Component() {
  return (
    <SearchField aria-label="Search">
      <SearchInput placeholder="Search" />
    </SearchField>
  )
}
