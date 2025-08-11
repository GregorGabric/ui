"use client"

import { DescriptionList } from "@/registry/preskok/ui/preskok-ui/description-list"

export default function DescriptionListPreskokDemo() {
  return (
    <DescriptionList className="max-w-xl">
      <DescriptionList.Term>Listing</DescriptionList.Term>
      <DescriptionList.Details>Preskok UI</DescriptionList.Details>

      <DescriptionList.Term>Status</DescriptionList.Term>
      <DescriptionList.Details>Active</DescriptionList.Details>

      <DescriptionList.Term>Owner</DescriptionList.Term>
      <DescriptionList.Details>Design Systems</DescriptionList.Details>
    </DescriptionList>
  )
}
