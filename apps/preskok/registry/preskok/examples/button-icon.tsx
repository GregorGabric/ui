"use client"

import { HeartIcon, SearchIcon, ShareIcon, StarIcon } from "lucide-react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"

export default function ButtonIcon() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button size="sq-xs" intent="outline" aria-label="Add to favorites">
          <HeartIcon className="h-3 w-3" />
        </Button>
        <Button size="sq-sm" intent="outline" aria-label="Search vehicles">
          <SearchIcon className="h-4 w-4" />
        </Button>
        <Button size="sq-md" intent="outline" aria-label="Share vehicle">
          <ShareIcon className="h-4 w-4" />
        </Button>
        <Button size="sq-lg" intent="outline" aria-label="Rate vehicle">
          <StarIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button isCircle size="sm" intent="primary" aria-label="Like">
          <HeartIcon className="h-4 w-4" />
        </Button>
        <Button isCircle size="md" intent="secondary" aria-label="Star">
          <StarIcon className="h-4 w-4" />
        </Button>
        <Button isCircle size="lg" intent="outline" aria-label="Share">
          <ShareIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
