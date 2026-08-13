import {
  ArchiveIcon,
  CopyIcon,
  ExternalLinkIcon,
  FolderInputIcon,
  PencilIcon,
} from "lucide-react"

import {
  Button,
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuSubMenu,
} from "preskok"

export function Open() {
  return (
    <Menu isOpen aria-label="Vehicle actions">
      <Button intent="outline">2025 Volvo EX30</Button>
      <MenuContent popover={{ className: "min-w-56" }}>
        <MenuItem>
          <ExternalLinkIcon data-slot="icon" />
          <MenuLabel>Open vehicle</MenuLabel>
        </MenuItem>
        <MenuItem>
          <PencilIcon data-slot="icon" />
          <MenuLabel>Edit details</MenuLabel>
        </MenuItem>
        <MenuItem>
          <CopyIcon data-slot="icon" />
          <MenuLabel>Duplicate</MenuLabel>
        </MenuItem>
        <MenuSubMenu>
          <MenuItem>
            <FolderInputIcon data-slot="icon" />
            <MenuLabel>Move to</MenuLabel>
          </MenuItem>
          <MenuContent popover={{ className: "min-w-40" }}>
            <MenuItem>Available</MenuItem>
            <MenuItem>Reserved</MenuItem>
            <MenuItem>In service</MenuItem>
          </MenuContent>
        </MenuSubMenu>
        <MenuSeparator />
        <MenuItem intent="danger">
          <ArchiveIcon data-slot="icon" />
          <MenuLabel>Archive vehicle</MenuLabel>
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
