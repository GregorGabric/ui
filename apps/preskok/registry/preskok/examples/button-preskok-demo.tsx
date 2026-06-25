"use client"

import { useState } from "react"
import {
  ArrowRightIcon,
  DownloadIcon,
  HeartIcon,
  PlusIcon,
  RefreshCwIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react"

import { Button, buttonStyles } from "@/registry/preskok/ui/preskok-ui/button"
import { Link } from "@/registry/preskok/ui/preskok-ui/link"
import { Loader } from "@/registry/preskok/ui/preskok-ui/loader"

function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default function ButtonPreskokDemo() {
  const allIntents = Object.keys(buttonStyles.variants.intent) as Array<
    keyof typeof buttonStyles.variants.intent
  >
  const textSizes = ["xs", "sm", "md", "lg"] as const
  const squareSizes = ["sq-xs", "sq-sm", "sq-md", "sq-lg"] as const

  const [isPending, setIsPending] = useState(false)

  function handleSave() {
    setIsPending(true)
    window.setTimeout(() => setIsPending(false), 1200)
  }

  return (
    <div className="grid w-full max-w-3xl gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {allIntents.map((intent) => (
          <Button key={intent} intent={intent}>
            {toTitleCase(intent)}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {textSizes.map((size) => (
          <Button key={size} size={size} intent="outline">
            {size.toUpperCase()}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button onPress={handleSave} isPending={isPending}>
          Save changes
        </Button>
        <Button intent="secondary">
          <Loader variant="bars" />
          Syncing
        </Button>
        <Button intent="outline">
          <DownloadIcon />
          Export CSV
        </Button>
        <Button intent="danger">
          <Trash2Icon />
          Delete project
        </Button>
        <Button intent="secondary" isDisabled>
          Disabled
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {squareSizes.map((size) => (
          <Button key={size} size={size} intent="outline" aria-label={size}>
            <SettingsIcon />
          </Button>
        ))}
        <Button isCircle size="sq-md" intent="plain" aria-label="Favorite">
          <HeartIcon />
        </Button>
        <Button isCircle size="sq-md" intent="primary" aria-label="Add">
          <PlusIcon />
        </Button>
        <Button size="lg">
          Continue
          <ArrowRightIcon />
        </Button>
        <Link
          href="/docs"
          className={buttonStyles({ intent: "outline", size: "md" })}
        >
          Docs
          <RefreshCwIcon />
        </Link>
      </div>
    </div>
  )
}
