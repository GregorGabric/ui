import * as React from "react"
import { connection } from "next/server"
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
        <React.Suspense>
          <ComponentCode code={code} language={lang} title={title} />
        </React.Suspense>
      </CodeCollapsibleWrapper>
    )
  }

  return (
    <React.Suspense>
      <ComponentCode
        className={className}
        code={code}
        language={lang}
        title={title}
      />
    </React.Suspense>
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

async function ComponentCode({
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
  // fumadocs' `CodeBlock` (a Client Component) reads `Date.now()` during its
  // prerender SSR, which blocks the static shell under Cache Components. The
  // highlighted source is static, but the read can't be cached (it happens in
  // client SSR) so we render the code block at request time behind the
  // <Suspense> boundary in ComponentSource; the page shell still prerenders.
  await connection()

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
        keepBackground: true,
        className: cn("my-0! rounded-xl!", className),
        viewportProps: {
          className: "max-h-[460px]",
        },
      }}
    />
  )
}
