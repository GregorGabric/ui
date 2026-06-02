"use client"

import * as React from "react"

import { getColorFormat, type Color, type ColorFormat } from "@/lib/colors"
import { cn } from "@/lib/utils"
import { useColors } from "@/hooks/use-colors"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/registry/preskok/ui/preskok-ui/select"
import { Skeleton } from "@/registry/preskok/ui/preskok-ui/skeleton"

export function ColorFormatSelector({
  color,
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectTrigger>, "color"> & {
  color: Color
}) {
  const { format, setFormat, isLoading } = useColors()
  const formats = getColorFormat(color)

  if (isLoading) {
    return <ColorFormatSelectorSkeleton />
  }

  return (
    <Select
      selectedKey={format}
      onSelectionChange={(key) => setFormat(key as ColorFormat)}
    >
      <SelectTrigger
        className={cn(
          "bg-secondary text-secondary-foreground border-secondary shadow-none",
          className
        )}
        prefix={<span className="font-medium">Format:</span>}
        {...props}
      />
      <SelectContent popover={{ placement: "bottom end" }} className="rounded-xl">
        {Object.entries(formats).map(([format, value]) => (
          <SelectItem
            key={format}
            id={format}
            className="gap-2 rounded-lg [&>span]:flex [&>span]:items-center [&>span]:gap-2"
          >
            <SelectLabel>{format}</SelectLabel>
            <span className="text-muted-foreground font-mono text-xs">
              {value}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function ColorFormatSelectorSkeleton({
  className,
  ...props
}: React.ComponentProps<typeof Skeleton>) {
  return (
    <Skeleton
      className={cn("h-8 w-[132px] gap-1.5 rounded-md", className)}
      {...props}
    />
  )
}
