"use client"

import { buttonStyles } from "@/registry/preskok/ui/preskok-ui/button"
import { Drawer } from "@/registry/preskok/ui/preskok-ui/drawer"
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
          <TextField
            label="Full Name"
            placeholder="Enter your full name"
            isRequired
          />
          <TextField
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            isRequired
          />
          <TextField
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
          />
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
