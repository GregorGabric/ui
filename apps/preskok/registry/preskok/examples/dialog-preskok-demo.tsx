"use client"

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/registry/preskok/ui/preskok-ui/dialog"

export default function DialogPreskokDemo() {
  return (
    <Dialog>
      <DialogTrigger
        className={"rounded-md bg-primary px-3 py-1.5 text-primary-foreground"}
      >
        Open dialog
      </DialogTrigger>
      <DialogHeader title="Dialog title" description="Optional description" />
      <DialogBody>Content inside the dialog.</DialogBody>
      <DialogFooter>
        <DialogClose>Close</DialogClose>
      </DialogFooter>
    </Dialog>
  )
}
