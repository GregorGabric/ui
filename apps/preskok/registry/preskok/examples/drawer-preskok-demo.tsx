"use client"

import { buttonStyles } from "@/registry/preskok/ui/preskok-ui/button"
import { Drawer } from "@/registry/preskok/ui/preskok-ui/drawer"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Input } from "@/registry/preskok/ui/preskok-ui/input"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

export default function DrawerPreskokDemo() {
  return (
    <Drawer>
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
