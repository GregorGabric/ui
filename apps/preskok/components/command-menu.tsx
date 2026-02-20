"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useDocsSearch } from "fumadocs-core/search/client"
import { CornerDownLeftIcon } from "lucide-react"

import type { source } from "@/lib/source"
import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { useIsMac } from "@/hooks/use-is-mac"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { Button } from "@/registry/preskok/ui/button"
import {
  CommandMenuFooter,
  CommandMenuLabel,
  CommandMenuList,
  CommandMenu as CommandMenuPrimitive,
  CommandMenuItem as CommandMenuPrimitiveItem,
  CommandMenuSearch,
} from "@/registry/preskok/ui/preskok-ui/command-menu"
import { Separator } from "@/registry/preskok/ui/separator"

interface PageItem {
  id: string
  name: string
  section: string
  url: string
  isComponent: boolean
  copyPayload: string
}

interface SearchResultItem {
  id: string
  type: "page" | "heading" | "text"
  content: string
  url: string
  breadcrumbs: Array<string>
  contentWithHighlights?: Array<{
    type: "text"
    content: string
    styles?: {
      highlight?: boolean
    }
  }>
}

interface SearchPageItem {
  id: string
  title: string
  url: string
  breadcrumbs: Array<string>
  snippet: string
  snippetWithHighlights?: SearchResultItem["contentWithHighlights"]
  isComponent: boolean
  copyPayload: string
}

function getActiveCommandItem() {
  return document.querySelector<HTMLElement>(
    '[data-slot="menu-item"][aria-selected="true"]'
  )
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

function getPageItems(tree: typeof source.pageTree, packageManager: string) {
  const items: Array<PageItem> = []

  for (const group of tree.children) {
    if (group.type !== "folder") {
      continue
    }

    const section = typeof group.name === "string" ? group.name : ""
    for (const item of group.children) {
      if (item.type !== "page") {
        continue
      }

      const isComponent = item.url.includes("/components/")
      const componentName = item.url.split("/").pop()
      const copyPayload =
        isComponent && componentName
          ? `${packageManager} dlx shadcn@latest add ${componentName}`
          : ""

      items.push({
        id: item.url,
        name: typeof item.name === "string" ? item.name : item.url,
        section,
        url: item.url,
        isComponent,
        copyPayload,
      })
    }
  }

  return items
}

function getSearchResults(data: unknown) {
  if (!Array.isArray(data)) {
    return []
  }

  const results: Array<SearchResultItem> = []

  for (const item of data) {
    if (!item || typeof item !== "object") {
      continue
    }

    const candidate = item as {
      id?: unknown
      type?: unknown
      content?: unknown
      url?: unknown
      breadcrumbs?: unknown
      contentWithHighlights?: unknown
    }

    if (
      typeof candidate.id !== "string" ||
      (candidate.type !== "page" &&
        candidate.type !== "heading" &&
        candidate.type !== "text") ||
      typeof candidate.content !== "string" ||
      typeof candidate.url !== "string"
    ) {
      continue
    }

    if (candidate.type === "text") {
      const wordCount = candidate.content.trim().split(/\s+/).length
      if (wordCount <= 1) {
        continue
      }
    }

    const breadcrumbs = Array.isArray(candidate.breadcrumbs)
      ? candidate.breadcrumbs.filter(
          (breadcrumb): breadcrumb is string => typeof breadcrumb === "string"
        )
      : []

    const contentWithHighlights = Array.isArray(candidate.contentWithHighlights)
      ? candidate.contentWithHighlights.filter((part) => {
          if (!part || typeof part !== "object") {
            return false
          }

          const chunk = part as {
            type?: unknown
            content?: unknown
            styles?: unknown
          }

          if (chunk.type !== "text" || typeof chunk.content !== "string") {
            return false
          }

          if (!chunk.styles) {
            return true
          }

          if (typeof chunk.styles !== "object") {
            return false
          }

          const styles = chunk.styles as {
            highlight?: unknown
          }

          return (
            styles.highlight === undefined ||
            typeof styles.highlight === "boolean"
          )
        })
      : undefined

    results.push({
      id: candidate.id,
      type: candidate.type,
      content: candidate.content,
      url: candidate.url,
      breadcrumbs,
      contentWithHighlights,
    })
  }

  return results
}

function getSearchPages(
  results: Array<SearchResultItem>,
  packageManager: string
): Array<SearchPageItem> {
  const pages = new Map<string, SearchPageItem>()

  for (const result of results) {
    const existing = pages.get(result.url)

    if (!existing) {
      const isComponent = result.url.includes("/components/")
      const componentName = result.url.split("/").pop()
      pages.set(result.url, {
        id: result.id,
        title: result.content,
        url: result.url,
        breadcrumbs: result.breadcrumbs,
        snippet: "",
        snippetWithHighlights: undefined,
        isComponent,
        copyPayload:
          isComponent && componentName
            ? `${packageManager} dlx shadcn@latest add ${componentName}`
            : "",
      })
      continue
    }

    if (existing.breadcrumbs.length === 0 && result.breadcrumbs.length > 0) {
      existing.breadcrumbs = result.breadcrumbs
    }

    if (result.type === "page") {
      existing.title = result.content
      continue
    }

    if (result.type === "heading" && existing.title === existing.url) {
      existing.title = result.content
    }

    if (existing.snippet) {
      continue
    }

    if (result.type === "text" || result.type === "heading") {
      existing.snippet = result.content
      existing.snippetWithHighlights = result.contentWithHighlights
    }
  }

  return Array.from(pages.values())
}

export function CommandMenu({ tree }: { tree: typeof source.pageTree }) {
  const router = useRouter()
  const isMac = useIsMac()
  const [config] = useConfig()
  const [open, setOpen] = React.useState(false)
  const { search, setSearch, query } = useDocsSearch({
    type: "fetch",
  })
  const packageManager = config.packageManager || "pnpm"
  const pageItems = getPageItems(tree, packageManager)
  const componentItems = pageItems.filter((item) => item.isComponent)
  const searchResults = getSearchResults(query.data)
  const searchPages = getSearchPages(searchResults, packageManager)
  const hasSearchQuery = search.trim().length > 0
  const isLoading = hasSearchQuery && query.isLoading
  const localQuery = search.trim().toLowerCase()
  const filteredComponentItems =
    localQuery.length > 0
      ? componentItems.filter((item) => {
          return (
            item.name.toLowerCase().includes(localQuery) ||
            item.url.toLowerCase().includes(localQuery)
          )
        })
      : componentItems

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

      const copyPayload = activeItem.dataset.copyPayload ?? ""
      if (!copyPayload) {
        return
      }

      event.preventDefault()
      setOpen(false)

      copyToClipboardWithMeta(copyPayload, {
        name: "copy_npm_command",
        properties: { command: copyPayload, pm: packageManager },
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
        onOpenChange={(isOpen) => {
          setOpen(isOpen)

          if (isOpen) {
            return
          }

          setSearch("")
        }}
        aria-label="Search documentation"
        inputValue={search}
        onInputChange={setSearch}
        isPending={isLoading}
      >
        <CommandMenuSearch placeholder="Search documentation..." />
        <CommandMenuList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
          {hasSearchQuery ? (
            <>
              {filteredComponentItems.length > 0 ? (
                <div className="text-muted-foreground col-span-full px-2.5 pb-1 text-xs font-medium">
                  Components
                </div>
              ) : null}
              {filteredComponentItems.map((item) => (
                <CommandMenuPrimitiveItem
                  key={`component-${item.id}`}
                  id={`component-${item.id}`}
                  textValue={`${item.section} ${item.name} ${item.url}`}
                  data-command-type={item.isComponent ? "component" : "page"}
                  data-copy-payload={item.copyPayload}
                  onAction={() => {
                    runCommand(() => router.push(item.url))
                  }}
                >
                  <CommandMenuLabel>{item.name}</CommandMenuLabel>
                </CommandMenuPrimitiveItem>
              ))}
              {searchPages.length > 0 ? (
                <div className="text-muted-foreground col-span-full px-2.5 pt-3 pb-1 text-xs font-medium">
                  Search Results
                </div>
              ) : null}
              {searchPages.map((item) => (
                <CommandMenuPrimitiveItem
                  key={`search-page-${item.id}`}
                  id={`search-page-${item.id}`}
                  className="items-start py-2.5"
                  textValue={`${item.title} ${item.url} ${item.snippet} ${item.breadcrumbs.join(" ")}`}
                  data-command-type={item.isComponent ? "component" : "page"}
                  data-copy-payload={item.copyPayload}
                  onAction={() => {
                    runCommand(() => router.push(item.url))
                  }}
                >
                  <div className="col-start-2 min-w-0 space-y-1">
                    {item.breadcrumbs.length > 0 ? (
                      <p className="text-muted-foreground line-clamp-1 text-[11px] font-medium">
                        {item.breadcrumbs.join(" > ")}
                      </p>
                    ) : null}
                    <CommandMenuLabel className="line-clamp-1 text-sm font-semibold">
                      {item.title}
                    </CommandMenuLabel>
                    {item.snippet ? (
                      <p className="text-muted-foreground line-clamp-2 border-l pl-2 text-sm font-normal">
                        {item.snippetWithHighlights?.length
                          ? item.snippetWithHighlights.map((part, index) => (
                              <span
                                key={`${item.id}-snippet-${index}`}
                                className={
                                  part.styles?.highlight
                                    ? "bg-accent/55 text-foreground rounded-[2px]"
                                    : undefined
                                }
                              >
                                {part.content}
                              </span>
                            ))
                          : item.snippet}
                      </p>
                    ) : null}
                  </div>
                </CommandMenuPrimitiveItem>
              ))}
            </>
          ) : (
            pageItems.map((item) => (
              <CommandMenuPrimitiveItem
                key={item.id}
                id={item.id}
                textValue={`${item.section} ${item.name} ${item.url}`}
                data-command-type={item.isComponent ? "component" : "page"}
                data-copy-payload={item.copyPayload}
                onAction={() => {
                  runCommand(() => router.push(item.url))
                }}
              >
                <CommandMenuLabel>{item.name}</CommandMenuLabel>
              </CommandMenuPrimitiveItem>
            ))
          )}
        </CommandMenuList>
        <CommandMenuFooter className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-2">
            <CommandMenuKbd>
              <CornerDownLeftIcon />
            </CommandMenuKbd>
            <span>Go to Page</span>
          </div>
          <Separator orientation="vertical" className="!h-4" />
          <div className="flex items-center gap-1">
            <CommandMenuKbd>{isMac ? "⌘" : "Ctrl"}</CommandMenuKbd>
            <CommandMenuKbd>C</CommandMenuKbd>
            <span>Copy highlighted component command</span>
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
