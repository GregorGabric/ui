"use client"

import type { PreviewTriggerProps } from "react-aria-components/PreviewTrigger"
import { PreviewTrigger as PreviewTriggerPrimitive } from "react-aria-components/PreviewTrigger"

import { PopoverContent, type PopoverContentProps } from "./popover"

const PreviewTrigger = (props: PreviewTriggerProps) => (
  <PreviewTriggerPrimitive {...props} />
)

const PreviewContent = (props: PopoverContentProps) => (
  <PopoverContent {...props} />
)

export { PreviewContent, PreviewTrigger }
export type { PopoverContentProps as PreviewContentProps, PreviewTriggerProps }
