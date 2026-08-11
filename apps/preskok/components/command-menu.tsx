"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { IconArrowRight } from "@tabler/icons-react"
import { CornerDownLeftIcon } from "lucide-react"

import { copyToClipboardWithMeta } from "@/components/copy-button"
import { useConfig } from "@/hooks/use-config"
import { useIsMac } from "@/hooks/use-is-mac"
import type { source } from "@/lib/source"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  CommandMenuFooter,
  CommandMenuItem,
  CommandMenuLabel,
  CommandMenuList,
  CommandMenu as CommandMenuPrimitive,
  CommandMenuSearch,
  CommandMenuSection,
} from "@/registry/preskok/ui/preskok-ui/command-menu"
import { Separator } from "@/registry/preskok/ui/preskok-ui/separator"

function isTextInputTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  if (target.isContentEditable) {
    return true
  }

  if (target instanceof HTMLInputElement) {
    return true
  }

  if (target instanceof HTMLTextAreaElement) {
    return true
  }

  if (target instanceof HTMLSelectElement) {
    return true
  }

  return false
}

function getActiveCommandItem() {
  return document.querySelector<HTMLElement>(
    '[data-slot="menu-item"][aria-selected="true"]'
  )
}

export function CommandMenu({ tree }: { tree: typeof source.pageTree }) {
  const router = useRouter()
  const isMac = useIsMac()
  const [config] = useConfig()
  const [open, setOpen] = React.useState(false)
  const packageManager = config.packageManager || "pnpm"

  function runCommand(command: () => void) {
    setOpen(false)
    command()
  }

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.key === "k" && (event.metaKey || event.ctrlKey)) ||
        event.key === "/"
      ) {
        if (isTextInputTarget(event.target)) {
          return
        }

        event.preventDefault()
        setOpen((isOpen) => !isOpen)
        return
      }

      if (
        event.key.toLowerCase() !== "c" ||
        (!event.metaKey && !event.ctrlKey)
      ) {
        return
      }

      if (!open) {
        return
      }

      const activeItem = getActiveCommandItem()
      if (!activeItem) {
        return
      }

      const type = activeItem.dataset.commandType
      if (!type) {
        return
      }

      const payload = activeItem.dataset.copyPayload ?? ""

      event.preventDefault()
      setOpen(false)

      copyToClipboardWithMeta(payload, {
        name: "copy_npm_command",
        properties: { command: payload, pm: packageManager },
      })
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, packageManager])

  return (
    <>
      <Button
        intent="secondary"
        size="sm"
        className={cn(
          "relative h-8 w-full justify-start bg-surface pl-2.5 font-normal text-surface-foreground/60 shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64 dark:bg-card"
        )}
        onPress={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <div className="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
          <CommandMenuKbd>{isMac ? "⌘" : "Ctrl"}</CommandMenuKbd>
          <CommandMenuKbd className="aspect-square">K</CommandMenuKbd>
        </div>
      </Button>
      <CommandMenuPrimitive
        isOpen={open}
        onOpenChange={setOpen}
        aria-label="Search documentation"
      >
        <CommandMenuSearch placeholder="Search documentation..." />
        <CommandMenuList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
          {tree.children.map((group) => {
            if (group.type !== "folder") {
              return null
            }

            const sectionLabel =
              typeof group.name === "string" ? group.name : undefined

            return (
              <CommandMenuSection key={group.$id} label={sectionLabel}>
                {group.children.map((item) => {
                  if (item.type !== "page") {
                    return null
                  }

                  const isComponent = item.url.includes("/components/")
                  const itemName =
                    typeof item.name === "string" ? item.name : item.url
                  const textValue = [sectionLabel, itemName]
                    .filter(Boolean)
                    .join(" ")
                  const componentName = item.url.split("/").pop() ?? ""
                  const payload = isComponent
                    ? getPreskokAddCommand(packageManager, componentName)
                    : ""

                  return (
                    <CommandMenuItem
                      key={item.url}
                      id={item.url}
                      textValue={textValue}
                      data-command-type={isComponent ? "component" : "page"}
                      data-copy-payload={payload}
                      onAction={() => {
                        runCommand(() => router.push(item.url))
                      }}
                    >
                      {isComponent ? (
                        <div className="size-4 rounded-full border border-dashed border-muted-foreground" />
                      ) : (
                        <IconArrowRight data-slot="icon" />
                      )}
                      <CommandMenuLabel>{itemName}</CommandMenuLabel>
                    </CommandMenuItem>
                  )
                })}
              </CommandMenuSection>
            )
          })}
        </CommandMenuList>
        <CommandMenuFooter className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-2">
            <CommandMenuKbd>
              <CornerDownLeftIcon />
            </CommandMenuKbd>
            <span>Select</span>
          </div>
          <Separator orientation="vertical" className="!h-4" />
          <div className="flex items-center gap-1">
            <CommandMenuKbd>{isMac ? "⌘" : "Ctrl"}</CommandMenuKbd>
            <CommandMenuKbd>C</CommandMenuKbd>
            <span>Copy highlighted item command</span>
          </div>
        </CommandMenuFooter>
      </CommandMenuPrimitive>
    </>
  )
}

function getPreskokAddCommand(
  packageManager: "npm" | "yarn" | "pnpm" | "bun",
  componentName: string
) {
  if (packageManager === "npm") {
    return `npx preskok-ui@latest add ${componentName}`
  }

  if (packageManager === "yarn") {
    return `yarn preskok-ui@latest add ${componentName}`
  }

  if (packageManager === "bun") {
    return `bunx --bun preskok-ui@latest add ${componentName}`
  }

  return `pnpm dlx preskok-ui@latest add ${componentName}`
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none flex h-5 items-center justify-center gap-1 rounded border bg-background px-1 font-sans text-[0.7rem] font-medium text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}
