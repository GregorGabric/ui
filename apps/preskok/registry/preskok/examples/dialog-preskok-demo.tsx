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
    <DialogTrigger>
      <button className="bg-primary text-primary-fg rounded-md px-3 py-1.5">
        Open dialog
      </button>
      <Dialog>
        <DialogHeader title="Dialog title" description="Optional description" />
        <DialogBody>Content inside the dialog.</DialogBody>
        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </Dialog>
    </DialogTrigger>
  )
}
