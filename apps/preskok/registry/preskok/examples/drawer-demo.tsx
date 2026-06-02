"use client"

import { buttonStyles } from "@/registry/preskok/ui/preskok-ui/button"
import { Drawer } from "@/registry/preskok/ui/preskok-ui/drawer"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Input } from "@/registry/preskok/ui/preskok-ui/input"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

export default function DrawerDemo() {
  return (
    <Drawer>
      <Drawer.Trigger className={buttonStyles({ intent: "outline" })}>
        Vehicle Inquiry
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Contact Dealer</Drawer.Title>
          <Drawer.Description>
            Get more information about this vehicle or schedule a test drive.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Body className="space-y-4">
          <TextField isRequired>
            <Label>Full Name</Label>
            <Input placeholder="Enter your full name" />
          </TextField>
          <TextField type="email" isRequired>
            <Label>Email Address</Label>
            <Input placeholder="your.email@example.com" />
          </TextField>
          <TextField type="tel">
            <Label>Phone Number</Label>
            <Input placeholder="+1 (555) 123-4567" />
          </TextField>
          <div className="bg-muted rounded p-3">
            <h4 className="text-sm font-medium">Vehicle of Interest</h4>
            <p className="text-muted-foreground text-sm">
              2024 Toyota Camry LE - Stock #TC240156
            </p>
            <p className="text-muted-foreground text-sm">Price: $28,400</p>
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close className="w-full">Send Inquiry</Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
}
