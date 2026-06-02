import * as React from "react"

import { highlightCode } from "@/lib/highlight-code"
import { getRegistryItem } from "@/lib/registry"
import { cn } from "@/lib/utils"
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper"
import { CopyButton } from "@/components/copy-button"
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
  const highlightedCode = await highlightCode(code, lang)

  if (!collapsible) {
    return (
      <div className={cn("relative", className)}>
        <ComponentCode
          code={code}
          highlightedCode={highlightedCode}
          language={lang}
          title={title}
        />
      </div>
    )
  }

  return (
    <CodeCollapsibleWrapper className={className}>
      <ComponentCode
        code={code}
        highlightedCode={highlightedCode}
        language={lang}
        title={title}
      />
    </CodeCollapsibleWrapper>
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
  code,
  highlightedCode,
  language,
  title,
}: {
  code: string
  highlightedCode: string
  language: string
  title: string | undefined
}) {
  return (
    <figure
      data-rehype-pretty-code-figure=""
      className="mt-0! [&>pre]:max-h-96"
    >
      {title && (
        <figcaption
          data-rehype-pretty-code-title=""
          className="text-code-foreground [&_svg]:text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70"
          data-language={language}
        >
          {getIconForLanguageExtension(language)}
          {title}
        </figcaption>
      )}
      <CopyButton value={code} />
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </figure>
  )
}
