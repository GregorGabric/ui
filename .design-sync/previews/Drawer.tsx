import { Drawer, Input, Label, TextField, buttonStyles } from "preskok"

export function BottomDrawer() {
  return (
    <Drawer defaultOpen>
      <Drawer.Trigger className={buttonStyles({ intent: "outline" })}>
        Schedule Test Drive
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Schedule Test Drive</Drawer.Title>
          <Drawer.Description>
            Book your test drive experience with our latest vehicle models.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Body className="space-y-4">
          <TextField type="text">
            <Label>Full Name</Label>
            <Input placeholder="John Smith" />
          </TextField>
          <TextField type="tel">
            <Label>Phone Number</Label>
            <Input placeholder="+1 (555) 123-4567" />
          </TextField>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close className="w-full">Book Test Drive</Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
}

export function SideDrawer() {
  return (
    <Drawer defaultOpen>
      <Drawer.Trigger className={buttonStyles({ intent: "outline" })}>
        Notifications
      </Drawer.Trigger>
      <Drawer.Content side="right">
        <Drawer.Header>
          <Drawer.Title>Notifications</Drawer.Title>
          <Drawer.Description>
            Recent updates from your account.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Body className="space-y-3">
          <div className="rounded-lg border p-3">
            <p className="text-sm font-medium">Order #3921 shipped</p>
            <p className="text-xs text-muted-foreground">2 minutes ago</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-sm font-medium">Payment received</p>
            <p className="text-xs text-muted-foreground">1 hour ago</p>
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close className="w-full">Mark all as read</Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
}
