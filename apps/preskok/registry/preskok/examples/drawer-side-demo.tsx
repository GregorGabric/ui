"use client"

import { buttonStyles } from "@/registry/preskok/ui/preskok-ui/button"
import { Drawer } from "@/registry/preskok/ui/preskok-ui/drawer"

const links = ["Inventory", "Auctions", "Offers", "Settings"]

export default function DrawerSideDemo() {
  return (
    <Drawer>
      <Drawer.Trigger className={buttonStyles({ intent: "outline" })}>
        Open menu
      </Drawer.Trigger>
      <Drawer.Content side="left" aria-label="Navigation">
        <Drawer.Header>
          <Drawer.Title>Cario</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="gap-1">
          {links.map((link) => (
            <Drawer.Close key={link} intent="plain" className="justify-start">
              {link}
            </Drawer.Close>
          ))}
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  )
}
