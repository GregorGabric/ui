import { UploadCloudIcon } from "lucide-react"

import * as FileUpload from "@/registry/preskok/ui/file-upload"

export function FileUploadDemo() {
  return (
    <div className="w-full max-w-[400px]">
      <FileUpload.Root>
        <input multiple type="file" tabIndex={-1} className="hidden" />
        <FileUpload.Icon as={UploadCloudIcon} />

        <div className="space-y-1.5">
          <div className="text-label-sm text-text-strong-950">
            Choose a file or drag & drop it here.
          </div>
          <div className="text-paragraph-xs text-text-sub-600">
            JPEG, PNG, PDF, and MP4 formats, up to 50 MB.
          </div>
        </div>
        <FileUpload.Button>Browse File</FileUpload.Button>
      </FileUpload.Root>
    </div>
  )
}
