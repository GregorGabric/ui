"use client"

import {
  FileTextIcon,
  MoreHorizontalIcon,
  RocketIcon,
  RotateCcwIcon,
  SettingsIcon,
  UndoIcon,
} from "lucide-react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { ButtonGroup } from "@/registry/preskok/ui/preskok-ui/button-group"
import {
  Menu,
  MenuContent,
  MenuItem,
} from "@/registry/preskok/ui/preskok-ui/menu"

export default function ButtonGroupWithMenuDemo() {
  return (
    <ButtonGroup>
      <Button intent="secondary">
        <RocketIcon data-slot="icon" />
        Deploy
      </Button>
      <Menu>
        <Button intent="secondary" aria-label="More deploy actions">
          <MoreHorizontalIcon data-slot="icon" />
        </Button>
        <MenuContent placement="bottom end">
          <MenuItem href="#">
            <RotateCcwIcon data-slot="icon" />
            Redeploy
          </MenuItem>
          <MenuItem href="#">
            <UndoIcon data-slot="icon" />
            Rollback
          </MenuItem>
          <MenuItem href="#">
            <FileTextIcon data-slot="icon" />
            View logs
          </MenuItem>
          <MenuItem href="#">
            <SettingsIcon data-slot="icon" />
            Settings
          </MenuItem>
        </MenuContent>
      </Menu>
    </ButtonGroup>
  )
}
