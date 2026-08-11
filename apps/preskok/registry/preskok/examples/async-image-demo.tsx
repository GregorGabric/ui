"use client"

import { AsyncImage } from "@/registry/preskok/ui/preskok-ui/async-image"

export default function AsyncImageDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Default (skeleton to image, lazy-loaded)
        </p>
        <div className="flex gap-4">
          <AsyncImage.Root
            src="https://picsum.photos/200/200"
            alt="Placeholder"
            width={200}
            height={200}
          />
          <AsyncImage.Root
            src="https://picsum.photos/201/201"
            alt="Placeholder"
            width={200}
            height={200}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Custom loading slot
        </p>
        <AsyncImage.Root
          src="https://picsum.photos/300/150"
          alt="Custom loading"
          width={300}
          height={150}
        >
          <AsyncImage.Loading className="flex items-center justify-center bg-muted/50">
            <span className="text-xs text-muted-foreground">Loading...</span>
          </AsyncImage.Loading>
        </AsyncImage.Root>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Error fallback (invalid src)
        </p>
        <AsyncImage.Root
          src="https://invalid.example/not-found.jpg"
          alt="Will error"
          width={200}
          height={200}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Grid (lazy load as you scroll)
        </p>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <AsyncImage.Root
              key={i}
              src={`https://picsum.photos/160/120?random=${i + 1}`}
              alt={`Image ${i + 1}`}
              width={160}
              height={120}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
