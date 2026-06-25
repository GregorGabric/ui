"use client"

import { useState } from "react"

import { Description, Label } from "@/registry/preskok/ui/preskok-ui/field"
import {
  SearchField,
  SearchInput,
} from "@/registry/preskok/ui/preskok-ui/search-field"

export function Component() {
  const [query, setQuery] = useState("invoice")
  const results = documents.filter((document) =>
    document.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="grid w-full max-w-sm gap-3">
      <SearchField value={query} onChange={setQuery} aria-label="Search docs">
        <Label>Search docs</Label>
        <Description>
          Clear button appears when the field has a value.
        </Description>
        <SearchInput placeholder="Search by title" />
      </SearchField>
      <div className="rounded-lg border p-2">
        {results.map((result) => (
          <div key={result} className="px-2 py-1.5 text-sm">
            {result}
          </div>
        ))}
      </div>
    </div>
  )
}

const documents = [
  "Invoice export guide",
  "Webhook retry policy",
  "SAML setup checklist",
  "Quarterly security review",
]
