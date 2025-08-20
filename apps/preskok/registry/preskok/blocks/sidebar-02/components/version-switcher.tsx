"use client"

import * as React from "react"
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"
import {
  SidebarItem,
  SidebarLink,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export function VersionSwitcher({
  versions,
  defaultVersion,
}: {
  versions: string[]
  defaultVersion: string
}) {
  const [selectedVersion, setSelectedVersion] = React.useState(defaultVersion)

  return (
    <Menu>
      <MenuTrigger>
        <SidebarItem>
          <SidebarLink href="#">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-medium">Documentation</span>
              <span>v{selectedVersion}</span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </SidebarLink>
        </SidebarItem>
      </MenuTrigger>
      <MenuContent align="start">
        {versions.map((version) => (
          <MenuItem key={version} onAction={() => setSelectedVersion(version)}>
            v{version}{" "}
            {version === selectedVersion && <Check className="ml-auto" />}
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  )
}
