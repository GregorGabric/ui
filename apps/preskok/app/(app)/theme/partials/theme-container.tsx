"use client"

import { Suspense, useState } from "react"
import {
  ChevronDownIcon,
  Code2Icon,
  CopyIcon,
  PanelRightIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { Container } from "@/registry/preskok/ui/preskok-ui/container"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"
import { Sheet } from "@/registry/preskok/ui/preskok-ui/sheet"
import { Blocks } from "@/app/(app)/theme/partials/blocks"
import { GeneratedTheme } from "@/app/(app)/theme/partials/generated-theme"
import { ThemeCustomizer } from "@/app/(app)/theme/partials/theme-customizer"

import { generateTheme } from "./themes"

export function ThemeContainer() {
  const [selectedColors, setSelectedColors] = useState({
    primary: "blue",
    gray: "zinc",
    accent: "blue",
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
      <Container className="pb-16">
        <div className="flex flex-col divide-y rounded-lg border lg:flex-row lg:divide-x lg:divide-y-0">
          <div className="w-full p-4 lg:w-1/2 lg:p-6">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-6">
              <CardHeader>
                <CardTitle>Theme customizer</CardTitle>
                <CardDescription>
                  Customize your theme by selecting colors from the color picker
                  or by entering a hex code.
                </CardDescription>
              </CardHeader>
            </div>
            <div>
              <ThemeCustomizer {...{ selectedColors, setSelectedColors }} />
              <div className="mt-3 flex justify-end">
                <Button className="flex w-full lg:hidden" onPress={handleOpen}>
                  <Code2Icon />
                  Get theme
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full px-4 pt-2 pb-4 lg:w-2/3 lg:p-6">
            <CardHeader className="mb-4">
              <CardTitle>Generated theme</CardTitle>
              <CardDescription>
                The generated colors are based on the selected gray color.
              </CardDescription>
              <CardAction className="hidden lg:inline-flex">
                <Menu>
                  <MenuTrigger>
                    <Button>
                      Get theme
                      <ChevronDownIcon />
                    </Button>
                  </MenuTrigger>
                  <MenuContent
                    placement="bottom right"
                    className="min-w-(--trigger-width)"
                  >
                    <MenuItem onAction={copy}>
                      <CopyIcon />
                      Copy
                    </MenuItem>
                    <MenuItem onAction={handleOpen}>
                      <PanelRightIcon />
                      Show theme
                    </MenuItem>
                  </MenuContent>
                </Menu>
              </CardAction>
            </CardHeader>
            <GeneratedTheme />
          </div>
        </div>

        <Blocks />
        <Suspense fallback={<div>Loading...</div>}>
          <style>{generateTheme(selectedColors)}</style>
        </Suspense>
      </Container>

      <Sheet>
        <Sheet.Content
          onOpenChange={setOpen}
          isOpen={open}
          className="bg-shiki-bg sm:max-w-md"
          side="right"
        >
          <Sheet.Header
            title="Theme"
            description="Copy the theme below and paste it into your CSS file."
          />
          <Sheet.Body className="border-y pb-4">
            <Card className="bg-neutral-950 p-4">
              <pre className="overflow-x-auto text-xs text-white">
                <code>{generateTheme(selectedColors)}</code>
              </pre>
            </Card>
          </Sheet.Body>
          <Sheet.Footer className="gap-x-1">
            <Sheet.Close onPress={handleClose} className="hidden sm:flex">
              Close
            </Sheet.Close>
            <Button
              onPress={() => {
                copy()
                handleClose()
              }}
            >
              <CopyIcon />
              Copy
            </Button>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet>
    </>
  )
}
