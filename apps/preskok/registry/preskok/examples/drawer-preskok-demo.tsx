"use client"

import { buttonStyles } from "@/registry/preskok/ui/preskok-ui/button"
import { Drawer } from "@/registry/preskok/ui/preskok-ui/drawer"
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
          <TextField label="Full Name" type="text" placeholder="John Smith" />
          <TextField
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
          />
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close className="w-full">Book Test Drive</Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
}
