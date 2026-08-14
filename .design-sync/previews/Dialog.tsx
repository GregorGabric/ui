import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogFooter,
  DialogHeader,
} from "preskok"

export function Basic() {
  return (
    <div className="w-sm rounded-lg border border-border bg-background shadow-sm">
      <Dialog>
        <DialogHeader
          title="Dialog title"
          description="Optional description"
        />
        <DialogBody>Content inside the dialog.</DialogBody>
        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
