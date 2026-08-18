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
  DownloadIcon,
  FileJsonIcon,
  RotateCcwIcon,
  UploadIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Blocks } from "@/components/theme/blocks"
import { GeneratedTheme } from "@/components/theme/generated-theme"
import { ThemeCustomizer } from "@/components/theme/theme-customizer"
import { Button, buttonStyles } from "@/registry/preskok/ui/preskok-ui/button"
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
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@/registry/preskok/ui/preskok-ui/tabs"

import {
  createThemeArtifacts,
  DEFAULT_THEME_SELECTION,
  parseThemeManifestJson,
  type ThemeSelection,
} from "./themes"

type GeneratedFile = {
  filename: string
  content: string
  type: string
}

function downloadFile({ filename, content, type }: GeneratedFile) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function ThemeContainer() {
  const [selectedColors, setSelectedColors] = useState<ThemeSelection>(
    DEFAULT_THEME_SELECTION
  )
  const [open, setOpen] = useState(false)
  const { theme, contrastChecks, css, figmaJson, manifestJson } =
    createThemeArtifacts(selectedColors)

  function copyCss() {
    void navigator.clipboard.writeText(css)
    toast.success("CSS copied to clipboard.")
  }

  function downloadCss() {
    downloadFile({
      filename: "preskok-theme.css",
      content: css,
      type: "text/css",
    })
    toast.success("CSS theme downloaded.")
  }

  function downloadFigmaTheme() {
    downloadFile({
      filename: "preskok-style-mode.json",
      content: figmaJson,
      type: "application/json",
    })
    toast.success("Figma mode downloaded.")
  }

  function downloadManifest() {
    downloadFile({
      filename: "preskok-theme.json",
      content: manifestJson,
      type: "application/json",
    })
    toast.success("Project theme saved.")
  }

  async function loadManifest(files: FileList | null) {
    const file = files?.item(0)
    if (!file) {
      return
    }

    try {
      const manifest = parseThemeManifestJson(await file.text())
      setSelectedColors(manifest.selection)
      toast.success("Project theme loaded.")
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The theme could not be loaded."
      toast.error(message)
    }
  }

  function resetTheme() {
    setSelectedColors(DEFAULT_THEME_SELECTION)
    toast.success("Theme reset to the Preskok defaults.")
  }

  return (
    <>
      <div className="space-y-6 pb-16">
        <DocsCards className="grid-cols-1 items-start gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
          <DocsCard title="Project theme">
            <div className="not-prose mt-4 text-fd-foreground">
              <ThemeCustomizer {...{ selectedColors, setSelectedColors }} />
              <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
                <label
                  className={buttonStyles({ intent: "outline", size: "sm" })}
                >
                  <UploadIcon data-slot="icon" />
                  Load project theme
                  <input
                    className="sr-only"
                    type="file"
                    accept="application/json,.json"
                    onChange={(event) => {
                      void loadManifest(event.currentTarget.files)
                      event.currentTarget.value = ""
                    }}
                  />
                </label>
                <Button size="sm" intent="plain" onPress={resetTheme}>
                  <RotateCcwIcon data-slot="icon" />
                  Reset
                </Button>
              </div>
            </div>
          </DocsCard>

          <DocsCard title="Preview">
            <div className="mt-4 flex justify-end">
              <Menu>
                <Button>
                  Get theme
                  <ChevronDownIcon data-slot="icon" />
                </Button>

                <MenuContent placement="bottom right" className="min-w-56">
                  <MenuItem onAction={copyCss}>
                    <CopyIcon data-slot="icon" />
                    Copy CSS
                  </MenuItem>
                  <MenuItem onAction={downloadCss}>
                    <DownloadIcon data-slot="icon" />
                    Download CSS
                  </MenuItem>
                  <MenuItem onAction={downloadFigmaTheme}>
                    <FileJsonIcon data-slot="icon" />
                    Download for Figma
                  </MenuItem>
                  <MenuItem onAction={downloadManifest}>
                    <DownloadIcon data-slot="icon" />
                    Save project theme
                  </MenuItem>
                  <MenuItem onAction={() => setOpen(true)}>
                    <Code2Icon data-slot="icon" />
                    Inspect generated files
                  </MenuItem>
                </MenuContent>
              </Menu>
            </div>
            <GeneratedTheme
              theme={theme}
              checks={contrastChecks}
              className="mt-4"
            />
          </DocsCard>
        </DocsCards>

        <Suspense fallback={null}>
          <Blocks />
        </Suspense>
        <style>{css}</style>
      </div>

      <Sheet>
        <SheetContent
          onOpenChange={setOpen}
          isOpen={open}
          className="bg-fd-background sm:max-w-2xl"
          side="right"
        >
          <SheetHeader
            title="Generated project theme"
            description="Use the same theme in code and Figma."
          />
          <SheetBody className="border-y pb-4">
            <Tabs defaultSelectedKey="css" className="mt-2">
              <TabList aria-label="Generated theme files">
                <Tab id="css">CSS</Tab>
                <Tab id="figma">Figma</Tab>
                <Tab id="manifest">Manifest</Tab>
              </TabList>
              <TabPanel id="css">
                <GeneratedCode title="preskok-theme.css" value={css} />
              </TabPanel>
              <TabPanel id="figma">
                <p className="mb-3 text-sm text-muted-foreground">
                  Import this file as a new mode in Figma&apos;s
                  <code> Style</code> collection.
                </p>
                <GeneratedCode
                  title="preskok-style-mode.json"
                  value={figmaJson}
                />
              </TabPanel>
              <TabPanel id="manifest">
                <p className="mb-3 text-sm text-muted-foreground">
                  Save this file to edit the same theme later.
                </p>
                <GeneratedCode
                  title="preskok-theme.json"
                  value={manifestJson}
                />
              </TabPanel>
            </Tabs>
          </SheetBody>
          <SheetFooter className="flex-wrap gap-2">
            <SheetClose className="mr-auto hidden sm:flex">Close</SheetClose>
            <Button intent="outline" onPress={downloadFigmaTheme}>
              <FileJsonIcon data-slot="icon" />
              Download for Figma
            </Button>
            <Button onPress={copyCss}>
              <CopyIcon data-slot="icon" />
              Copy CSS
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}

function GeneratedCode({ title, value }: { title: string; value: string }) {
  return (
    <CodeBlock title={title} className="mt-3">
      <Pre>
        <code>{value}</code>
      </Pre>
    </CodeBlock>
  )
}
