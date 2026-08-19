"use client"

import { Suspense, useRef, useState } from "react"
import type { CSSProperties } from "react"
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
import { UNSAFE_PortalProvider } from "react-aria"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

import { Blocks } from "@/components/theme/blocks"
import { GeneratedTheme } from "@/components/theme/generated-theme"
import {
  ThemeCustomizer,
  type ThemeAppearance,
} from "@/components/theme/theme-customizer"
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
  THEME_COLOR_TOKEN_NAMES,
  THEME_PRIMITIVE_STEPS,
  type ResolvedTheme,
  type ThemeSelection,
} from "./themes"

type GeneratedFile = {
  filename: string
  content: string
  type: string
}

function createPreviewStyles(
  theme: ResolvedTheme,
  appearance: ThemeAppearance
) {
  const colors = theme.colors[appearance]
  const primitives = theme.primitives[appearance]

  return {
    colorScheme: appearance,
    ...Object.fromEntries(
      THEME_COLOR_TOKEN_NAMES.flatMap((token) => [
        [`--${token}`, colors[token]],
        [`--color-${token}`, colors[token]],
      ])
    ),
    ...Object.fromEntries(
      THEME_PRIMITIVE_STEPS.flatMap((step, index) => [
        [`--accent-${step}`, primitives.accent[index]],
        [`--accent-a${step}`, primitives.accentAlpha[index]],
        [`--gray-${step}`, primitives.gray[index]],
        [`--gray-a${step}`, primitives.grayAlpha[index]],
      ])
    ),
    "--accent-contrast": primitives.accentContrast,
    "--accent-surface-primitive": primitives.accentSurface,
    "--gray-surface": primitives.graySurface,
  } as CSSProperties
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
  const [appearance, setAppearance] = useState<ThemeAppearance>("light")
  const [open, setOpen] = useState(false)
  const previewPortalRef = useRef<HTMLDivElement>(null)
  const { theme, contrastChecks, css, figmaJson, manifestJson } =
    createThemeArtifacts(selectedColors)
  const previewStyles = createPreviewStyles(theme, appearance)

  async function copyCss() {
    try {
      await navigator.clipboard.writeText(css)
      toast.success("CSS copied to clipboard.")
    } catch {
      toast.error("CSS could not be copied.")
    }
  }

  function downloadCss() {
    downloadFile({
      filename: "preskok-theme.css",
      content: css,
      type: "text/css",
    })
  }

  function downloadFigmaTheme() {
    downloadFile({
      filename: "preskok-style-mode.json",
      content: figmaJson,
      type: "application/json",
    })
  }

  function downloadManifest() {
    downloadFile({
      filename: "preskok-theme.json",
      content: manifestJson,
      type: "application/json",
    })
  }

  async function loadManifest(files: FileList | null) {
    const file = files?.item(0)
    if (!file) {
      return
    }

    try {
      const manifest = parseThemeManifestJson(await file.text())
      setSelectedColors(manifest.selection)
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
  }

  return (
    <>
      <div className="space-y-8 pb-16">
        <UNSAFE_PortalProvider getContainer={() => previewPortalRef.current}>
          <section
            className={twMerge(
              "not-prose relative isolate overflow-hidden rounded-3xl bg-background p-5 text-foreground shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_-1px_oklch(0_0_0/0.06),0_2px_4px_oklch(0_0_0/0.04)] sm:p-8 dark:shadow-none dark:ring-1 dark:ring-white/10",
              appearance
            )}
            style={previewStyles}
          >
            <div
              aria-hidden="true"
              className={twMerge(
                "pointer-events-none absolute inset-x-0 top-0 h-80 bg-[linear-gradient(to_bottom,var(--accent-4),transparent)]",
                appearance === "dark" ? "opacity-20" : "opacity-45"
              )}
            />
            <div className="relative grid gap-10">
              <ThemeCustomizer
                actions={
                  <Menu>
                    <Button className="w-full">
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
                }
                {...{
                  appearance,
                  selectedColors,
                  setAppearance,
                  setSelectedColors,
                }}
              />

              <GeneratedTheme
                appearance={appearance}
                theme={theme}
                checks={contrastChecks}
              />

              <div className="flex flex-wrap gap-2 border-t border-foreground/10 pt-5">
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
          </section>

          <div
            className={twMerge(
              "rounded-3xl bg-background p-3 text-foreground sm:p-4",
              appearance
            )}
            style={previewStyles}
          >
            <Suspense fallback={null}>
              <Blocks />
            </Suspense>
          </div>
        </UNSAFE_PortalProvider>
        <div
          ref={previewPortalRef}
          className={twMerge(
            "not-prose",
            appearance,
            "[&_[data-slot=modal-overlay]]:z-[100001]"
          )}
          style={{ ...previewStyles, display: "contents" }}
        />
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
