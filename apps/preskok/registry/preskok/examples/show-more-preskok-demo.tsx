"use client"

import { ShowMore } from "@/registry/preskok/ui/preskok-ui/show-more"

export default function ShowMorePreskokDemo() {
  return (
    <div className="space-y-3">
      <ShowMore as="button">Show more</ShowMore>
      <ShowMore as="text" text="More results" />
    </div>
  )
}



