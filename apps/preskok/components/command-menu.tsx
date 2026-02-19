"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { IconArrowRight } from "@tabler/icons-react"
import { CornerDownLeftIcon, SquareDashedIcon } from "lucide-react"

import type { ColorPalette } from "@/lib/colors"
import type { source } from "@/lib/source"
import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { useIsMac } from "@/hooks/use-is-mac"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { Button } from "@/registry/preskok/ui/button"
import {
  CommandMenuFooter,
  CommandMenuItem,
  CommandMenuLabel,
  CommandMenuList,
  CommandMenu as CommandMenuPrimitive,
  CommandMenuSearch,
  CommandMenuSection,
} from "@/registry/preskok/ui/preskok-ui/command-menu"
import { Separator } from "@/registry/preskok/ui/separator"

interface BlockItem {
  name: string
  description: string
  categories: string[]
}

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

export function CommandMenu({
  tree,
  colors,
  blocks,
}: {
  tree: typeof source.pageTree
  colors: ColorPalette[]
  blocks?: BlockItem[]
}) {
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

      if (type === "color") {
        copyToClipboardWithMeta(payload, {
          name: "copy_color",
          properties: { color: payload },
        })
        return
      }

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
        variant="secondary"
        className={cn(
          "bg-surface text-surface-foreground/60 dark:bg-card relative h-8 w-full justify-start pl-2.5 font-normal shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64"
        )}
        onClick={() => setOpen(true)}
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
                  const payload = isComponent
                    ? `${packageManager} dlx shadcn@latest add ${item.url.split("/").pop()}`
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
                        <div className="border-muted-foreground size-4 rounded-full border border-dashed" />
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
          {colors.map((palette) => (
            <CommandMenuSection
              key={palette.name}
              label={
                palette.name.charAt(0).toUpperCase() + palette.name.slice(1)
              }
            >
              {palette.colors.map((color) => (
                <CommandMenuItem
                  key={color.id}
                  id={color.id}
                  textValue={`${color.name} ${color.className} ${color.oklch}`}
                  data-command-type="color"
                  data-copy-payload={color.className}
                  onAction={() => {
                    runCommand(() =>
                      copyToClipboardWithMeta(color.oklch, {
                        name: "copy_color",
                        properties: { color: color.oklch },
                      })
                    )
                  }}
                >
                  <div
                    className="border-ghost size-4 rounded-sm bg-(--color)"
                    style={{ "--color": color.oklch } as React.CSSProperties}
                  />
                  <CommandMenuLabel>{color.className}</CommandMenuLabel>
                </CommandMenuItem>
              ))}
            </CommandMenuSection>
          ))}
          {blocks?.length ? (
            <CommandMenuSection label="Blocks">
              {blocks.map((block) => (
                <CommandMenuItem
                  key={block.name}
                  id={block.name}
                  textValue={`${block.name} ${block.description} ${block.categories.join(" ")}`}
                  data-command-type="block"
                  data-copy-payload={`${packageManager} dlx shadcn@latest add ${block.name}`}
                  onAction={() => {
                    runCommand(() =>
                      router.push(
                        `/blocks/${block.categories[0]}#${block.name}`
                      )
                    )
                  }}
                >
                  <SquareDashedIcon data-slot="icon" />
                  <CommandMenuLabel>{block.description}</CommandMenuLabel>
                </CommandMenuItem>
              ))}
            </CommandMenuSection>
          ) : null}
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

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}
