"use client"

import React from "react"
import { CameraIcon, FolderIcon, PaperclipIcon } from "lucide-react"
import {
  FileTrigger as FileTriggerPrimitive,
  type FileTriggerProps as FileTriggerPrimitiveProps,
} from "react-aria-components/FileTrigger"
import type { VariantProps } from "tailwind-variants"

import { Button, type buttonStyles } from "./button"

interface FileTriggerProps
  extends FileTriggerPrimitiveProps, VariantProps<typeof buttonStyles> {
  isDisabled?: boolean
  ref?: React.RefObject<HTMLInputElement>
  className?: string
}

const FileTrigger = ({
  acceptDirectory,
  allowsMultiple,
  children,
  defaultCamera,
  intent = "outline",
  isDisabled,
  isPending,
  size = "md",
  isCircle = false,
  ref,
  className,
  ...props
}: FileTriggerProps) => {
  const defaultLabel = getDefaultLabel({
    acceptDirectory,
    allowsMultiple,
    defaultCamera,
  })
  const label = children ?? (isCircle ? null : defaultLabel)

  return (
    <FileTriggerPrimitive
      ref={ref}
      acceptDirectory={acceptDirectory}
      allowsMultiple={allowsMultiple}
      defaultCamera={defaultCamera}
      {...props}
    >
      <Button
        className={className}
        isDisabled={isDisabled}
        isPending={isPending}
        intent={intent}
        size={size}
        isCircle={isCircle}
      >
        {!isPending && (
          <FileTriggerIcon
            acceptDirectory={acceptDirectory}
            defaultCamera={defaultCamera}
          />
        )}
        {label}
      </Button>
    </FileTriggerPrimitive>
  )
}

function FileTriggerIcon({
  acceptDirectory,
  defaultCamera,
}: Pick<FileTriggerProps, "acceptDirectory" | "defaultCamera">) {
  if (defaultCamera) {
    return <CameraIcon />
  }

  if (acceptDirectory) {
    return <FolderIcon />
  }

  return <PaperclipIcon />
}

function getDefaultLabel({
  acceptDirectory,
  allowsMultiple,
  defaultCamera,
}: Pick<
  FileTriggerProps,
  "acceptDirectory" | "allowsMultiple" | "defaultCamera"
>) {
  if (defaultCamera) {
    return "Open camera"
  }

  if (allowsMultiple) {
    return "Browse files"
  }

  if (acceptDirectory) {
    return "Browse folder"
  }

  return "Browse file"
}

export { FileTrigger }
export type { FileTriggerProps }
