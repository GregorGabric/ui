"use client"

import * as React from "react"
import { CheckIcon, ClipboardIcon, TerminalIcon } from "lucide-react"

import { useConfig } from "@/hooks/use-config"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@/registry/preskok/ui/preskok-ui/tabs"
import {
  Tooltip,
  TooltipContent,
} from "@/registry/preskok/ui/preskok-ui/tooltip"

export function CodeBlockCommand({
  __npm__,
  __yarn__,
  __pnpm__,
  __bun__,
}: React.ComponentProps<"pre"> & {
  __npm__?: string
  __yarn__?: string
  __pnpm__?: string
  __bun__?: string
}) {
  const [config, setConfig] = useConfig()
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => {
        setHasCopied(false)
      }, 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [hasCopied])

  const packageManager = config.packageManager
  const tabs = React.useMemo(() => {
    return {
      pnpm: __pnpm__,
      npm: __npm__,
      yarn: __yarn__,
      bun: __bun__,
    }
  }, [__npm__, __pnpm__, __yarn__, __bun__])

  const copyCommand = React.useCallback(() => {
    const command = tabs[packageManager]

    if (!command) {
      return
    }

    copyToClipboardWithMeta(command, {
      name: "copy_npm_command",
      properties: {
        command,
        pm: packageManager,
      },
    })
    setHasCopied(true)
  }, [packageManager, tabs])

  return (
    <div className="overflow-x-auto">
      <Tabs
        data-slot="tabs"
        selectedKey={packageManager}
        className="gap-0"
        onSelectionChange={(key) => {
          setConfig({
            ...config,
            packageManager: key as "pnpm" | "npm" | "yarn" | "bun",
          })
        }}
      >
        <div className="border-border/50 flex items-center gap-2 border-b px-3 py-1">
          <div className="bg-foreground flex size-4 items-center justify-center rounded-[1px] opacity-70">
            <TerminalIcon className="text-code size-3" />
          </div>
          <TabList className="gap-x-1 border-b-0" aria-label="Package managers">
            {Object.entries(tabs).map(([key]) => {
              return (
                <Tab
                  key={key}
                  id={key}
                  className="group-orientation-horizontal/tabs:pb-1 selected:border-border h-7 border border-dashed border-transparent py-1 pt-0.5 first:ml-0 [&>span]:hidden"
                >
                  {key}
                </Tab>
              )
            })}
          </TabList>
        </div>
        <div className="no-scrollbar overflow-x-auto">
          {Object.entries(tabs).map(([key, value]) => {
            return (
              <TabPanel key={key} id={key} className="mt-0 px-4 py-3.5">
                <pre>
                  <code
                    className="relative font-mono text-sm leading-none"
                    data-language="bash"
                  >
                    {value}
                  </code>
                </pre>
              </TabPanel>
            )
          })}
        </div>
      </Tabs>
      <Tooltip>
        <Button
          data-slot="copy-button"
          size="sq-xs"
          intent="plain"
          className="absolute top-2 right-2 z-10 size-7 opacity-70 hover:opacity-100 focus-visible:opacity-100"
          onPress={copyCommand}
        >
          <span className="sr-only">Copy</span>
          {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
        </Button>
        <TooltipContent>
          {hasCopied ? "Copied" : "Copy to Clipboard"}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
