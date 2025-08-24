"use client"

import { ChevronDownIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"

import { ShowMore } from "@/registry/preskok/ui/preskok-ui/show-more"

export default function ShowMorePreskokDemo() {
  return (
    <div className="py-6">
      <ShowMore>
        {({ isSelected }) => (
          <>
            Show {isSelected ? "less" : "more"}
            <ChevronDownIcon
              className={twMerge(
                isSelected ? "rotate-180" : "",
                "size-4 transition-transform duration-200"
              )}
            />
          </>
        )}
      </ShowMore>
    </div>
  )
}
