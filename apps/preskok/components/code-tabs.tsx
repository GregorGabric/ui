"use client"

import * as React from "react"
import {
  Tabs as FumadocsTabs,
  TabsContent as FumadocsTabsContent,
  TabsList as FumadocsTabsList,
  TabsTrigger as FumadocsTabsTrigger,
} from "fumadocs-ui/components/tabs"

import { cn } from "@/lib/utils"

type TabValueCarrier = {
  children?: React.ReactNode
  className?: string
  id?: string
  value?: string
}

type TriggerItem = {
  children: React.ReactNode
  value: string
}

type ContentItem = {
  children: React.ReactNode
  className?: string
  value: string
}

function getTabValue(props: TabValueCarrier) {
  const tabValue = props.value ?? props.id

  if (typeof tabValue !== "string" || tabValue.length === 0) {
    return undefined
  }

  return tabValue
}

function collectTriggerItems(node: React.ReactNode, items: TriggerItem[] = []) {
  React.Children.forEach(node, (child) => {
    if (!React.isValidElement<TabValueCarrier>(child)) {
      return
    }

    const tabValue = getTabValue(child.props)

    if (tabValue && !items.some((item) => item.value === tabValue)) {
      items.push({
        children: child.props.children,
        value: tabValue,
      })
      return
    }

    if (child.props.children) {
      collectTriggerItems(child.props.children, items)
    }
  })

  return items
}

function getTriggerItems(children: React.ReactNode) {
  const items: TriggerItem[] = []

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<TabValueCarrier>(child)) {
      return
    }

    if (getTabValue(child.props)) {
      return
    }

    collectTriggerItems(child.props.children, items)
  })

  return items
}

function getContentItems(children: React.ReactNode) {
  const items: ContentItem[] = []

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<TabValueCarrier>(child)) {
      return
    }

    const tabValue = getTabValue(child.props)

    if (!tabValue) {
      return
    }

    items.push({
      children: child.props.children,
      className: child.props.className,
      value: tabValue,
    })
  })

  return items
}

export function CodeTabs({
  children,
  className,
  defaultValue,
  ...props
}: React.ComponentProps<typeof FumadocsTabs>) {
  const triggerItems = getTriggerItems(children)
  const contentItems = getContentItems(children)
  const tabValues = triggerItems.map((item) => item.value)
  const isInstallationTabs =
    tabValues.includes("cli") && tabValues.includes("manual")
  let selectedDefaultValue = defaultValue

  if (!selectedDefaultValue && isInstallationTabs) {
    selectedDefaultValue = "cli"
  }

  if (!selectedDefaultValue) {
    selectedDefaultValue = tabValues[0] ?? contentItems[0]?.value
  }

  const tabStateProps: Pick<
    React.ComponentProps<typeof FumadocsTabs>,
    "defaultValue" | "groupId" | "persist"
  > = {
    defaultValue: selectedDefaultValue,
  }

  if (isInstallationTabs) {
    tabStateProps.groupId = "preskok-installation"
    tabStateProps.persist = true
  }

  return (
    <FumadocsTabs
      {...props}
      {...tabStateProps}
      className={cn("mt-4 mb-0", className)}
    >
      <FumadocsTabsList>
        {triggerItems.map((item) => (
          <FumadocsTabsTrigger key={item.value} value={item.value}>
            {item.children}
          </FumadocsTabsTrigger>
        ))}
      </FumadocsTabsList>
      {contentItems.map((item) => (
        <FumadocsTabsContent
          key={item.value}
          value={item.value}
          className={cn(
            "prose-no-margin focus-visible:outline-none [&:has(>figure)]:bg-transparent [&:has(>figure)]:p-0 [&:has(>figure)>figure]:!m-0 [&:has(>figure)>figure]:rounded-none [&:has(>figure)>figure]:border-0",
            item.className
          )}
        >
          {item.children}
        </FumadocsTabsContent>
      ))}
    </FumadocsTabs>
  )
}
