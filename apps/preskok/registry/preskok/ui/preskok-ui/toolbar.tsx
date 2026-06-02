"use client"

import { createContext, use, useContext } from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import type { GroupProps } from "react-aria-components/Group"
import { Group } from "react-aria-components/Group"
import type { SeparatorProps } from "react-aria-components/Separator"
import type { ToolbarProps as ToolbarPrimitiveProps } from "react-aria-components/Toolbar"
import { Toolbar as ToolbarPrimitive } from "react-aria-components/Toolbar"
import { twMerge } from "tailwind-merge"

import { cx } from "@/registry/preskok/lib/primitive"

import { Separator } from "./separator"
import { Toggle, type ToggleProps } from "./toggle"

const ToolbarContext = createContext<ToolbarProps>({
  orientation: "horizontal",
  isCircle: false,
})

interface ToolbarProps extends ToolbarPrimitiveProps {
  isCircle?: boolean
}

const Toolbar = ({
  orientation = "horizontal",
  isCircle,
  className,
  ...props
}: ToolbarProps) => {
  return (
    <ToolbarContext value={{ orientation, isCircle }}>
      <ToolbarPrimitive
        orientation={orientation}
        {...props}
        className={composeRenderProps(className, (className, { orientation }) =>
          twMerge(
            "group inset-ring-border bg-overlay inline-flex [scrollbar-width:none] flex-row gap-1.5 p-1.5 inset-ring [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            isCircle ? "rounded-full" : "rounded-lg",
            orientation === "horizontal"
              ? "[scrollbar-width:none] flex-row items-center [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              : "flex-col items-start",
            className
          )
        )}
      />
    </ToolbarContext>
  )
}

const ToolbarGroupContext = createContext<{
  isDisabled?: boolean
  isCircle?: boolean
}>({})

type ToolbarGroupProps = GroupProps
const ToolbarGroup = ({
  isDisabled,
  className,
  ...props
}: ToolbarGroupProps) => {
  return (
    <ToolbarGroupContext value={{ isDisabled }}>
      <Group
        className={cx(
          "group-orientation-vertical:flex-col group-orientation-vertical:items-start group-orientation-horizontal:items-center flex gap-1.5",
          className
        )}
        {...props}
      >
        {props.children}
      </Group>
    </ToolbarGroupContext>
  )
}

type ToggleItemProps = ToggleProps

const ToolbarItem = ({
  isDisabled,
  isCircle,
  size = "sm",
  ref,
  className,
  ...props
}: ToggleItemProps) => {
  const context = use(ToolbarGroupContext)
  const { isCircle: contextCircle } = use(ToolbarContext)
  const effectiveIsDisabled = isDisabled || context.isDisabled
  const effectiveIsCircle = isCircle || contextCircle
  return (
    <Toggle
      size={size}
      ref={ref}
      data-slot="toolbar-item"
      className={cx(
        effectiveIsCircle
          ? "rounded-full"
          : "rounded-[calc(var(--radius-lg)-1px)]",
        className
      )}
      isDisabled={effectiveIsDisabled}
      {...props}
    />
  )
}
type ToolbarSeparatorProps = SeparatorProps
const ToolbarSeparator = ({ className, ...props }: ToolbarSeparatorProps) => {
  const { orientation } = useContext(ToolbarContext)
  const reverseOrientation =
    orientation === "vertical" ? "horizontal" : "vertical"
  return (
    <Separator
      orientation={reverseOrientation}
      className={twMerge(
        reverseOrientation === "vertical" ? "mx-0.5 h-6" : "my-0.5 w-8",
        className
      )}
      {...props}
    />
  )
}

export { Toolbar, ToolbarGroup, ToolbarItem, ToolbarSeparator }
export type {
  ToggleItemProps,
  ToolbarGroupProps,
  ToolbarProps,
  ToolbarSeparatorProps,
}
