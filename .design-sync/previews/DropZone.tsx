import { ImageIcon, UploadCloudIcon } from "lucide-react"

import { Description, DropZone, Label } from "preskok"

export function Default() {
  return (
    <DropZone
      getDropOperation={(types) =>
        types.has("image/png") || types.has("image/jpeg") ? "copy" : "cancel"
      }
    >
      <UploadCloudIcon className="size-6 text-muted-foreground" />
      <Label>Drop files here</Label>
      <Description>
        PNG and JPEG files are accepted; other types are rejected.
      </Description>
    </DropZone>
  )
}

export function Compact() {
  return (
    <DropZone className="max-w-sm gap-1 p-4">
      <ImageIcon className="size-5 text-muted-foreground" />
      <Label className="text-sm">Drag an avatar here</Label>
      <Description className="text-xs">Up to 2MB, square images work best.</Description>
    </DropZone>
  )
}
