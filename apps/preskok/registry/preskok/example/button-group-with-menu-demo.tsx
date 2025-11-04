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
        <RocketIcon />
        Deploy
      </Button>
      <Menu>
        <Button intent="secondary">
          <MoreHorizontalIcon />
        </Button>
        <MenuContent placement="bottom end">
          <MenuItem href="#">
            <RotateCcwIcon />
            Redeploy
          </MenuItem>
          <MenuItem href="#">
            <UndoIcon />
            Rollback
          </MenuItem>
          <MenuItem href="#">
            <FileTextIcon />
            View logs
          </MenuItem>
          <MenuItem href="#">
            <SettingsIcon />
            Settings
          </MenuItem>
        </MenuContent>
      </Menu>
    </ButtonGroup>
  )
}
