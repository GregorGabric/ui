import { AsyncImage } from "preskok"

export function Default() {
  return (
    <div className="flex gap-4">
      <AsyncImage.Root
        src="https://picsum.photos/id/1015/200/200"
        alt="Mountain lake"
        width={200}
        height={200}
        lazyLoad={false}
      />
      <AsyncImage.Root
        src="https://picsum.photos/id/1025/200/200"
        alt="Dog portrait"
        width={200}
        height={200}
        lazyLoad={false}
      />
    </div>
  )
}

export function CustomLoadingSlot() {
  return (
    <AsyncImage.Root
      src="https://picsum.photos/id/1041/300/150"
      alt="Custom loading"
      width={300}
      height={150}
      lazyLoad={false}
    >
      <AsyncImage.Loading className="flex items-center justify-center bg-muted/50">
        <span className="text-xs text-muted-foreground">Loading…</span>
      </AsyncImage.Loading>
    </AsyncImage.Root>
  )
}

export function ErrorFallback() {
  return (
    <AsyncImage.Root
      src=""
      alt="Will error"
      width={200}
      height={200}
      lazyLoad={false}
    />
  )
}
