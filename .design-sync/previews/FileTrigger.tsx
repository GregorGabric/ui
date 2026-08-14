import { Avatar, FileTrigger } from "preskok"

export function Default() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FileTrigger acceptedFileTypes={["image/png", "image/jpeg"]}>
        Upload image
      </FileTrigger>
      <FileTrigger allowsMultiple>Upload multiple</FileTrigger>
      <FileTrigger acceptDirectory>Upload folder</FileTrigger>
    </div>
  )
}

export function IconVariants() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <FileTrigger
        defaultCamera="environment"
        acceptedFileTypes={["image/*"]}
        isCircle
        size="sq-md"
        aria-label="Open camera"
      />
      <FileTrigger
        acceptedFileTypes={["image/png", "image/jpeg"]}
        intent="plain"
        className="px-0"
      >
        <Avatar initials="MC" alt="Maya Chen" size="sm" />
        Replace avatar
      </FileTrigger>
      <FileTrigger isPending>Scanning files</FileTrigger>
      <FileTrigger isDisabled>Locked</FileTrigger>
    </div>
  )
}
