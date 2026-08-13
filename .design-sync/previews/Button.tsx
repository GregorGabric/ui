import { DownloadIcon, HeartIcon, PlusIcon, SettingsIcon, Trash2Icon } from "lucide-react"

import { Button, Loader } from "preskok"

const intents = ["primary", "secondary", "warning", "danger", "outline", "plain"] as const
const sizes = ["xs", "sm", "md", "lg"] as const

export function Intents() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {intents.map((intent) => (
        <Button key={intent} intent={intent}>
          {intent[0].toUpperCase() + intent.slice(1)}
        </Button>
      ))}
    </div>
  )
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {sizes.map((size) => (
        <Button key={size} size={size} intent="outline">
          {size.toUpperCase()}
        </Button>
      ))}
    </div>
  )
}

export function States() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button intent="primary">Save changes</Button>
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
  )
}

export function IconButtons() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sq-md" intent="outline" aria-label="Settings">
        <SettingsIcon />
      </Button>
      <Button isCircle size="sq-md" intent="plain" aria-label="Favorite">
        <HeartIcon />
      </Button>
      <Button isCircle size="sq-md" intent="primary" aria-label="Add">
        <PlusIcon />
      </Button>
    </div>
  )
}
