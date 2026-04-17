"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import type {
  registryItemFileSchema,
  registryItemSchema,
} from "@preskok-org/ui/registry"
import {
  Check,
  ChevronRight,
  Clipboard,
  File,
  Folder,
  Fullscreen,
  Monitor,
  RotateCw,
  Smartphone,
  Tablet,
  Terminal,
} from "lucide-react"
import type { ImperativePanelHandle } from "react-resizable-panels"
import type { z } from "zod"

import { trackEvent } from "@/lib/events"
import type {
  createFileTreeForRegistryItemFiles,
  FileTree,
} from "@/lib/registry"
import { cn } from "@/lib/utils"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { getIconForLanguageExtension } from "@/components/icons"
import { Button } from "@/registry/preskok/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/preskok/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarSection,
  SidebarSectionGroup,
} from "@/registry/preskok/ui/preskok-ui/sidebar"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/preskok/ui/preskok-ui/resizable"
import { Separator } from "@/registry/preskok/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/registry/preskok/ui/tabs"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/preskok/ui/toggle-group"

type BlockViewerContext = {
  item: z.infer<typeof registryItemSchema>
  view: "code" | "preview"
  setView: (view: "code" | "preview") => void
  activeFile: string | null
  setActiveFile: (file: string) => void
  resizablePanelRef: React.RefObject<ImperativePanelHandle | null> | null
  tree: ReturnType<typeof createFileTreeForRegistryItemFiles> | null
  highlightedFiles: Array<
    z.infer<typeof registryItemFileSchema> & {
      highlightedContent: string
    }
  > | null
  iframeKey?: number
  setIframeKey?: React.Dispatch<React.SetStateAction<number>>
}

const BlockViewerContext = React.createContext<BlockViewerContext | null>(null)

function useBlockViewer() {
  const context = React.use(BlockViewerContext)
  if (!context) {
    throw new Error("useBlockViewer must be used within a BlockViewerProvider.")
  }
  return context
}

function BlockViewerProvider({
  item,
  tree,
  highlightedFiles,
  children,
}: Pick<BlockViewerContext, "item" | "tree" | "highlightedFiles"> & {
  children: React.ReactNode
}) {
  const [view, setView] = React.useState<BlockViewerContext["view"]>("preview")
  const [activeFile, setActiveFile] = React.useState<
    BlockViewerContext["activeFile"]
  >(highlightedFiles?.[0].target ?? null)
  const resizablePanelRef = React.useRef<ImperativePanelHandle>(null)
  const [iframeKey, setIframeKey] = React.useState(0)

  return (
    <BlockViewerContext
      value={{
        item,
        view,
        setView,
        resizablePanelRef,
        activeFile,
        setActiveFile,
        tree,
        highlightedFiles,
        iframeKey,
        setIframeKey,
      }}
    >
      <div
        id={item.name}
        data-view={view}
        className="group/block-view-wrapper flex min-w-0 scroll-mt-24 flex-col-reverse items-stretch gap-4 overflow-hidden md:flex-col"
        style={
          {
            "--height": item.meta?.iframeHeight ?? "930px",
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </BlockViewerContext>
  )
}

function BlockViewerToolbar() {
  const { setView, view, item, resizablePanelRef, setIframeKey } =
    useBlockViewer()
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <div className="hidden w-full items-center gap-2 pl-2 md:pr-6 lg:flex">
      <Tabs
        value={view}
        onValueChange={(value) => {
          setView(value as "preview" | "code")
        }}
      >
        <TabsList className="grid h-8 grid-cols-2 items-center rounded-md p-1 *:data-[slot=tabs-trigger]:h-6 *:data-[slot=tabs-trigger]:rounded-sm *:data-[slot=tabs-trigger]:px-2 *:data-[slot=tabs-trigger]:text-xs">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
      </Tabs>
      <Separator orientation="vertical" className="mx-2 !h-4" />
      <a
        href={`#${item.name}`}
        className="flex-1 text-center text-sm font-medium underline-offset-2 hover:underline md:flex-auto md:text-left"
      >
        {item.description?.replace(/\.$/, "")}
      </a>
      <div className="ml-auto flex items-center gap-2">
        <div className="h-8 items-center gap-1.5 rounded-md border p-1 shadow-none">
          <ToggleGroup
            type="single"
            defaultValue="100"
            onValueChange={(value) => {
              setView("preview")
              if (resizablePanelRef?.current) {
                resizablePanelRef.current.resize(parseInt(value))
              }
            }}
            className="gap-1 *:data-[slot=toggle-group-item]:!size-6 *:data-[slot=toggle-group-item]:!rounded-sm"
          >
            <ToggleGroupItem value="100" title="Desktop">
              <Monitor />
            </ToggleGroupItem>
            <ToggleGroupItem value="60" title="Tablet">
              <Tablet />
            </ToggleGroupItem>
            <ToggleGroupItem value="30" title="Mobile">
              <Smartphone />
            </ToggleGroupItem>
            <Separator orientation="vertical" className="!h-4" />
            <Button
              size="icon"
              variant="ghost"
              className="size-6 rounded-sm p-0"
              asChild
              title="Open in New Tab"
            >
              <Link href={`/view/${item.name}`} target="_blank">
                <span className="sr-only">Open in New Tab</span>
                <Fullscreen />
              </Link>
            </Button>
            <Separator orientation="vertical" className="!h-4" />
            <Button
              size="icon"
              variant="ghost"
              className="size-6 rounded-sm p-0"
              title="Refresh Preview"
              onClick={() => {
                if (setIframeKey) {
                  setIframeKey((k) => k + 1)
                }
              }}
            >
              <RotateCw />
              <span className="sr-only">Refresh Preview</span>
            </Button>
          </ToggleGroup>
        </div>
        <Separator orientation="vertical" className="mx-1 !h-4" />
        <Button
          variant="outline"
          className="w-fit gap-1 px-2 shadow-none"
          size="sm"
          onClick={() => {
            copyToClipboard(`npx @preskok-org/ui@latest add ${item.name}`)
          }}
        >
          {isCopied ? <Check /> : <Terminal />}
          <span>npx @preskok-org/ui add {item.name}</span>
        </Button>
        <Separator orientation="vertical" className="mx-1 !h-4" />
      </div>
    </div>
  )
}

function BlockViewerIframe({ className }: { className?: string }) {
  const { item, iframeKey } = useBlockViewer()

  return (
    <iframe
      key={iframeKey}
      src={`/view/${item.name}`}
      height={item.meta?.iframeHeight ?? 930}
      loading="lazy"
      className={cn(
        "bg-background no-scrollbar relative z-20 w-full",
        className
      )}
    />
  )
}

function BlockViewerView() {
  const { resizablePanelRef } = useBlockViewer()

  return (
    <div className="hidden group-data-[view=code]/block-view-wrapper:hidden md:h-(--height) lg:flex">
      <div className="relative grid w-full gap-4">
        <div className="absolute inset-0 right-4 [background-image:radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:20px_20px] dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"></div>
        <ResizablePanelGroup
          direction="horizontal"
          className="after:bg-surface/50 relative z-10 after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-xl"
        >
          <ResizablePanel
            ref={resizablePanelRef}
            className="bg-background relative aspect-[4/2.5] overflow-hidden rounded-lg border md:aspect-auto md:rounded-xl"
            defaultSize={100}
            minSize={30}
          >
            <BlockViewerIframe />
          </ResizablePanel>
          <ResizableHandle className="after:bg-border relative hidden w-3 bg-transparent p-0 after:absolute after:top-1/2 after:right-0 after:h-8 after:w-[6px] after:translate-x-[-1px] after:-translate-y-1/2 after:rounded-full after:transition-all after:hover:h-10 md:block" />
          <ResizablePanel defaultSize={0} minSize={0} />
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

function BlockViewerMobile({ children }: { children: React.ReactNode }) {
  const { item } = useBlockViewer()

  return (
    <div className="flex flex-col gap-2 lg:hidden">
      <div className="flex items-center gap-2 px-2">
        <div className="line-clamp-1 text-sm font-medium">
          {item.description}
        </div>
        <div className="text-muted-foreground ml-auto shrink-0 font-mono text-xs">
          {item.name}
        </div>
      </div>
      {item.meta?.mobile === "component" ? (
        children
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <Image
            src={`/r/styles/preskok/${item.name}-light.png`}
            alt={item.name}
            data-block={item.name}
            width={1440}
            height={900}
            className="object-cover dark:hidden"
          />
          <Image
            src={`/r/styles/preskok/${item.name}-dark.png`}
            alt={item.name}
            data-block={item.name}
            width={1440}
            height={900}
            className="hidden object-cover dark:block"
          />
        </div>
      )}
    </div>
  )
}

function BlockViewerCode() {
  const { activeFile, highlightedFiles } = useBlockViewer()

  const file = React.useMemo(() => {
    return highlightedFiles?.find((file) => file.target === activeFile)
  }, [highlightedFiles, activeFile])

  if (!file) {
    return null
  }

  const language = file.path.split(".").pop() ?? "tsx"

  return (
    <div className="bg-code text-code-foreground mr-[14px] flex overflow-hidden rounded-xl border group-data-[view=preview]/block-view-wrapper:hidden md:h-(--height)">
      <div className="w-72">
        <BlockViewerFileTree />
      </div>
      <figure
        data-rehype-pretty-code-figure=""
        className="!mx-0 mt-0 flex min-w-0 flex-1 flex-col rounded-xl border-none"
      >
        <figcaption
          className="text-code-foreground [&_svg]:text-code-foreground flex h-12 shrink-0 items-center gap-2 border-b px-4 py-2 [&_svg]:size-4 [&_svg]:opacity-70"
          data-language={language}
        >
          {getIconForLanguageExtension(language)}
          {file.target}
          <div className="ml-auto flex items-center gap-2">
            <BlockCopyCodeButton />
          </div>
        </figcaption>
        <div
          key={file?.path}
          dangerouslySetInnerHTML={{ __html: file?.highlightedContent ?? "" }}
          className="no-scrollbar overflow-y-auto"
        />
      </figure>
    </div>
  )
}

export function BlockViewerFileTree() {
  const { tree } = useBlockViewer()

  if (!tree) {
    return null
  }

  return (
    <SidebarProvider className="flex flex-col border-r">
      <Sidebar collapsible="none" className="w-full flex-1">
        <SidebarContent>
          <div className="flex h-12 items-center rounded-none border-b px-4 text-sm font-medium">
            Files
          </div>
          <SidebarSectionGroup>
            <SidebarSection>
              <div className="translate-x-0 gap-1.5">
                {tree.map((file, index) => (
                  <Tree key={index} item={file} index={1} />
                ))}
              </div>
            </SidebarSection>
          </SidebarSectionGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

function Tree({ item, index }: { item: FileTree; index: number }) {
  const { activeFile, setActiveFile } = useBlockViewer()

  if (!item.children) {
    return (
      <button
        className={cn(
          "hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 flex w-full items-center gap-2 rounded-none p-2 text-left whitespace-nowrap",
          item.path === activeFile && "bg-muted-foreground/15"
        )}
        onClick={() => item.path && setActiveFile(item.path)}
        data-index={index}
        style={
          {
            "--index": `${index * (index === 2 ? 1.2 : 1.3)}rem`,
            paddingLeft: `var(--index)`,
          } as React.CSSProperties
        }
      >
        <ChevronRight className="invisible" />
        <File className="h-4 w-4" />
        {item.name}
      </button>
    )
  }

  return (
    <Collapsible
      className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
      defaultOpen
    >
      <CollapsibleTrigger asChild>
        <button
          className="hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 flex w-full items-center gap-2 rounded-none p-2 text-left whitespace-nowrap"
          style={
            {
              "--index": `${index * (index === 1 ? 1 : 1.2)}rem`,
              paddingLeft: `var(--index)`,
            } as React.CSSProperties
          }
        >
          <ChevronRight className="transition-transform" />
          <Folder />
          {item.name}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="m-0 w-full translate-x-0 border-none p-0">
          {item.children.map((subItem, key) => (
            <Tree key={key} item={subItem} index={index + 1} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function BlockCopyCodeButton() {
  const { activeFile, item } = useBlockViewer()
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  const file = React.useMemo(() => {
    return item.files?.find((file) => file.target === activeFile)
  }, [activeFile, item.files])

  const content = file?.content

  if (!content) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7"
      onClick={() => {
        copyToClipboard(content)
        trackEvent({
          name: "copy_block_code",
          properties: {
            name: item.name,
            file: file.path,
          },
        })
      }}
    >
      {isCopied ? <Check /> : <Clipboard />}
    </Button>
  )
}

function BlockViewer({
  item,
  tree,
  highlightedFiles,
  children,
  ...props
}: Pick<BlockViewerContext, "item" | "tree" | "highlightedFiles"> & {
  children: React.ReactNode
}) {
  return (
    <BlockViewerProvider
      item={item}
      tree={tree}
      highlightedFiles={highlightedFiles}
      {...props}
    >
      <BlockViewerToolbar />
      <BlockViewerView />
      <BlockViewerCode />
      <BlockViewerMobile>{children}</BlockViewerMobile>
    </BlockViewerProvider>
  )
}

export { BlockViewer }
