"use client"

import { Drawer } from "@/registry/preskok/ui/preskok-ui/drawer"

export default function DrawerPreskokDemo() {
  return (
    <Drawer>
      <Drawer.Trigger className="bg-primary text-primary-fg rounded-md px-3 py-1.5">
        Open drawer
      </Drawer.Trigger>
      <Drawer.Content side="right">
        <Drawer.Header>
          <Drawer.Title>Drawer title</Drawer.Title>
          <Drawer.Description>Optional description</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <p className="p-2">Drawer content...</p>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>Close</Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
}
