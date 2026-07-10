"use client"

import * as React from "react"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"

import { cn } from "@/lib/utils"

const previewClassName =
  "preview not-prose flex min-h-56 max-h-[min(520px,80vh)] w-full overflow-auto overscroll-contain scroll-p-6 p-6 sm:scroll-p-8 sm:px-8 sm:py-8"
const previewContentClassName =
  "flex max-w-full min-w-0 justify-center data-[align=center]:my-auto data-[align=end]:mt-auto data-[align=start]:mb-auto [&>.flex-wrap]:justify-center"

export function ComponentPreviewTabs({
  className,
  previewClassName: previewClassNameProp,
  align = "center",
  hideCode = false,
  component,
  source,
  ...props
}: React.ComponentProps<"div"> & {
  previewClassName?: string
  align?: "center" | "start" | "end"
  hideCode?: boolean
  component: React.ReactNode
  source: React.ReactNode
}) {
  if (hideCode) {
    return (
      <div
        data-slot="component-preview"
        className={cn(
          "group relative mt-4 mb-6 flex flex-col gap-2",
          className
        )}
        {...props}
      >
        <div className="bg-fd-card relative overflow-hidden rounded-xl border">
          <div className={cn(previewClassName, previewClassNameProp)}>
            <div data-align={align} className={previewContentClassName}>
              {component}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="component-preview"
      className={cn("group relative mt-4 mb-6 flex flex-col gap-2", className)}
      {...props}
    >
      <Tabs items={["Preview", "Code"]} className="my-0">
        <Tab value="Preview" className="p-0">
          <div className={cn(previewClassName, previewClassNameProp)}>
            <div data-align={align} className={previewContentClassName}>
              {component}
            </div>
          </div>
        </Tab>
        <Tab
          value="Code"
          className="bg-fd-card! overflow-hidden rounded-none! p-0 [&_figure]:!m-0 [&_figure]:rounded-none [&_figure]:border-0 [&_figure]:shadow-none"
        >
          {source}
        </Tab>
      </Tabs>
    </div>
  )
}
