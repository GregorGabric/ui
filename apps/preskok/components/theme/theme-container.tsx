"use client"

import { Suspense, useState } from "react"
import {
  Card as DocsCard,
  Cards as DocsCards,
} from "fumadocs-ui/components/card"
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import {
  ChevronDownIcon,
  Code2Icon,
  CopyIcon,
  PanelRightIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Blocks } from "@/components/theme/blocks"
import { GeneratedTheme } from "@/components/theme/generated-theme"
import { ThemeCustomizer } from "@/components/theme/theme-customizer"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Menu,
  MenuContent,
  MenuItem,
} from "@/registry/preskok/ui/preskok-ui/menu"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@/registry/preskok/ui/preskok-ui/sheet"

import { generateTheme } from "./themes"

export function ThemeContainer() {
  const [selectedColors, setSelectedColors] = useState({
    primary: "blue",
    gray: "zinc",
    accent: "zinc",
    radius: "0.5rem",
  })

  const copy = () => {
    void navigator.clipboard.writeText(generateTheme(selectedColors))
    toast("Copied to clipboard.")
  }

  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <>
      <div className="space-y-6 pb-16">
        <DocsCards className="grid-cols-1 items-start gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
          <DocsCard
            title="Theme customizer"
            description="Adjust the core color families and radius token."
          >
            <div className="not-prose text-fd-foreground mt-4">
              <ThemeCustomizer {...{ selectedColors, setSelectedColors }} />
            </div>
            <div className="mt-3 flex justify-end">
              <Button className="flex w-full lg:hidden" onPress={handleOpen}>
                <Code2Icon data-slot="icon" />
                Get theme
              </Button>
            </div>
          </DocsCard>

          <DocsCard
            title="Generated theme"
            description="Preview the CSS variables generated from the current selection."
          >
            <div className="mt-4 hidden justify-end lg:flex">
              <Menu>
                <Button>
                  Get theme
                  <ChevronDownIcon data-slot="icon" />
                </Button>

                <MenuContent
                  placement="bottom right"
                  className="min-w-(--trigger-width)"
                >
                  <MenuItem onAction={copy}>
                    <CopyIcon data-slot="icon" />
                    Copy
                  </MenuItem>
                  <MenuItem onAction={handleOpen}>
                    <PanelRightIcon data-slot="icon" />
                    Show theme
                  </MenuItem>
                </MenuContent>
              </Menu>
            </div>
            <GeneratedTheme className="mt-4" />
          </DocsCard>
        </DocsCards>

        <Blocks />
        <Suspense fallback={null}>
          <style>{generateTheme(selectedColors)}</style>
        </Suspense>
      </div>

      <Sheet>
        <SheetContent
          onOpenChange={setOpen}
          isOpen={open}
          className="bg-fd-background sm:max-w-md"
          side="right"
        >
          <SheetHeader
            title="Theme"
            description="Copy the theme below and paste it into your CSS file."
          />
          <SheetBody className="border-y pb-4">
            <CodeBlock title="theme.css">
              <Pre>
                <code>{generateTheme(selectedColors)}</code>
              </Pre>
            </CodeBlock>
          </SheetBody>
          <SheetFooter className="gap-x-1">
            <SheetClose onPress={handleClose} className="hidden sm:flex">
              Close
            </SheetClose>
            <Button
              onPress={() => {
                copy()
                handleClose()
              }}
            >
              <CopyIcon />
              Copy
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
