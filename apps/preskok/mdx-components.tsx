import * as React from "react"
import Link from "next/link"
import { Callout } from "fumadocs-ui/components/callout"
import { Card, Cards } from "fumadocs-ui/components/card"
import { Step, Steps } from "fumadocs-ui/components/steps"
import {
  Tab as FumadocsTab,
  Tabs as FumadocsTabs,
  TabsContent as FumadocsTabsContent,
  TabsList as FumadocsTabsList,
  TabsTrigger as FumadocsTabsTrigger,
} from "fumadocs-ui/components/tabs"
import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"

import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper"
import { CodeTabs } from "@/components/code-tabs"
import { ComponentPreview } from "@/components/component-preview"
import { ComponentSource } from "@/components/component-source"
import { ComponentsList } from "@/components/components-list"
import { PreskokComponentsList } from "@/components/preskok-components-list"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  DisclosureGroup as Accordion,
  DisclosurePanel as AccordionContent,
  Disclosure as AccordionItem,
  DisclosureTrigger as AccordionTrigger,
} from "@/registry/preskok/ui/preskok-ui/disclosure-group"

type TabsProps = React.ComponentProps<typeof FumadocsTabs>

type TabsTriggerProps = Omit<
  React.ComponentProps<typeof FumadocsTabsTrigger>,
  "value"
> & {
  id?: string
  value?: string
}

type TabsContentProps = Omit<
  React.ComponentProps<typeof FumadocsTabsContent>,
  "value"
> & {
  id?: string
  value?: string
}

type TabProps = TabsContentProps

export function Tabs({ className, ...props }: TabsProps) {
  return <FumadocsTabs className={className} {...props} />
}

export function TabsList({
  ...props
}: React.ComponentProps<typeof FumadocsTabsList>) {
  return <FumadocsTabsList {...props} />
}

export function TabsTrigger({
  id,
  value,
  className,
  ...props
}: TabsTriggerProps) {
  return (
    <FumadocsTabsTrigger
      value={value ?? id ?? ""}
      className={className}
      {...props}
    />
  )
}

export function TabsContent({
  id,
  value,
  className,
  ...props
}: TabsContentProps) {
  return (
    <FumadocsTabsContent
      value={value ?? id ?? ""}
      className={className}
      {...props}
    />
  )
}

export function Tab({ id, value, ...props }: TabProps) {
  return <FumadocsTab value={value ?? id} {...props} />
}

function LinkedCard({
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      data-card
      className={cn(
        "prose-no-margin flex flex-col rounded-xl border bg-fd-card p-4 text-fd-card-foreground transition-colors hover:bg-fd-accent/50",
        className
      )}
      {...props}
    />
  )
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    Button,
    Callout,
    Alert: Callout,
    Card,
    Cards,
    Step,
    Steps,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Tab,
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    CodeTabs,
    ComponentPreview,
    ComponentSource,
    CodeCollapsibleWrapper,
    ComponentsList,
    PreskokComponentsList,
    LinkedCard,
    Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
      <Link
        className={cn("font-medium underline underline-offset-4", className)}
        {...props}
      />
    ),
  }
}

export const mdxComponents = getMDXComponents()
