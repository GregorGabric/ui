import * as React from "react"
import type { Editor } from "@tiptap/react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Menu,
  MenuContent,
  MenuItem,
} from "@/registry/preskok/ui/preskok-ui/menu"
import type { ToggleProps } from "@/registry/preskok/ui/preskok-ui/toggle"

import type { FormatAction } from "../types"
import { getShortcutKey } from "../utils"
import { ShortcutKey } from "./shortcut-key"
import { ToolbarButton } from "./toolbar-button"

interface ToolbarSectionProps extends ToggleProps {
  editor: Editor
  actions: Array<FormatAction>
  activeActions?: Array<string>
  mainActionCount?: number
  dropdownIcon?: React.ReactNode
  dropdownTooltip?: string
  dropdownClassName?: string
}

export const ToolbarSection: React.FC<ToolbarSectionProps> = ({
  editor,
  actions,
  activeActions: _activeActions,
  mainActionCount = 0,
  dropdownIcon,
  dropdownTooltip = "More options",
  dropdownClassName = "w-12",
  size,
}) => {
  const activeActions = _activeActions ?? actions.map((action) => action.value)

  const { mainActions, dropdownActions } = React.useMemo(() => {
    const sortedActions = actions
      .filter((action) => activeActions.includes(action.value))
      .sort(
        (a, b) =>
          activeActions.indexOf(a.value) - activeActions.indexOf(b.value)
      )

    return {
      mainActions: sortedActions.slice(0, mainActionCount),
      dropdownActions: sortedActions.slice(mainActionCount),
    }
  }, [actions, activeActions, mainActionCount])

  const renderToolbarButton = React.useCallback(
    (action: FormatAction) => (
      <ToolbarButton
        key={action.label}
        onClick={() => {
          action.action(editor)
        }}
        isActive={action.isActive(editor)}
        isDisabled={!action.canExecute(editor)}
        tooltip={`${action.label} ${action.shortcuts.map((s) => getShortcutKey(s).symbol).join(" ")}`}
        aria-label={action.label}
        size={size}
      >
        {action.icon}
      </ToolbarButton>
    ),
    [editor, size]
  )

  const renderDropdownMenuItem = React.useCallback(
    (action: FormatAction) => (
      <MenuItem
        key={action.label}
        onAction={() => {
          action.action(editor)
        }}
        isDisabled={!action.canExecute(editor)}
        className={cn("flex flex-row items-center justify-between gap-4", {
          "bg-accent": action.isActive(editor),
        })}
        aria-label={action.label}
      >
        <span className="grow">{action.label}</span>
        <ShortcutKey keys={action.shortcuts} />
      </MenuItem>
    ),
    [editor]
  )

  const isDropdownActive = dropdownActions.some((action) =>
    action.isActive(editor)
  )

  return (
    <>
      {mainActions.map(renderToolbarButton)}
      {dropdownActions.length > 0 && (
        <Menu>
          <ToolbarButton
            isActive={isDropdownActive}
            tooltip={dropdownTooltip}
            aria-label={dropdownTooltip}
            className={cn("gap-0", dropdownClassName)}
          >
            {dropdownIcon || <ChevronDownIcon className="size-4" />}
          </ToolbarButton>

          <MenuContent
            popover={{ placement: "bottom start" }}
            className="w-full"
          >
            {dropdownActions.map(renderDropdownMenuItem)}
          </MenuContent>
        </Menu>
      )}
    </>
  )
}
