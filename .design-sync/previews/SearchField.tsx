import { Description, Label, SearchField, SearchInput } from "preskok"

const documents = [
  "Invoice export guide",
  "Webhook retry policy",
  "SAML setup checklist",
]

export function Default() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <SearchField defaultValue="invoice" aria-label="Search docs">
        <Label>Search docs</Label>
        <Description>Clear button appears when the field has a value.</Description>
        <SearchInput placeholder="Search by title" />
      </SearchField>
      <div className="rounded-lg border p-2">
        {documents.map((result) => (
          <div key={result} className="px-2 py-1.5 text-sm">
            {result}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Empty() {
  return (
    <SearchField aria-label="Search customers" className="grid w-full max-w-sm gap-2">
      <Label>Search customers</Label>
      <SearchInput placeholder="Search by company, owner, or email" />
    </SearchField>
  )
}
