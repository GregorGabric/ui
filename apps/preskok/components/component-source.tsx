import * as React from "react"
import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc"

import { getRegistryItem } from "@/lib/registry"
import { cn } from "@/lib/utils"
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper"
import { getIconForLanguageExtension } from "@/components/icons"

export async function ComponentSource({
  name,
  title,
  language,
  collapsible = true,
  className,
}: React.ComponentProps<"div"> & {
  name?: string
  title?: string
  language?: string
  collapsible?: boolean
}) {
  if (!name) {
    return null
  }

  const item = await getRegistryItem(name)
  const file = findRegistryFile(item?.files, title)
  const code = file?.content

  if (!code) {
    return null
  }

  const lang = language ?? title?.split(".").pop() ?? "tsx"

  if (collapsible) {
    return (
      <CodeCollapsibleWrapper className={className}>
        <ComponentCode code={code} language={lang} title={title} />
      </CodeCollapsibleWrapper>
    )
  }

  return (
    <ComponentCode
      className={className}
      code={code}
      language={lang}
      title={title}
    />
  )
}

function findRegistryFile<
  TFile extends {
    content?: string
    path: string
    target?: string
  },
>(files: TFile[] | undefined, title: string | undefined) {
  if (!files?.length) {
    return undefined
  }

  if (!title) {
    return files[0]
  }

  return files.find((file) => {
    if (file.path === title || title.endsWith(file.path)) {
      return true
    }

    return Boolean(
      file.target && (file.target === title || title.endsWith(file.target))
    )
  })
}

function ComponentCode({
  className,
  code,
  language,
  title,
}: {
  className?: string
  code: string
  language: string
  title: string | undefined
}) {
  return (
    <ServerCodeBlock
      code={code}
      lang={language}
      themes={{
        dark: "github-dark",
        light: "github-light-default",
      }}
      codeblock={{
        title,
        icon: getIconForLanguageExtension(language),
        className: cn("my-0! rounded-xl! bg-fd-card!", className),
        viewportProps: {
          className: "max-h-[460px]",
        },
      }}
    />
  )
}
