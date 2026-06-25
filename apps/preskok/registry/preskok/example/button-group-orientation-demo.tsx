"use client"

import { Volume2Icon, VolumeXIcon } from "lucide-react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { ButtonGroup } from "@/registry/preskok/ui/preskok-ui/button-group"

export default function ButtonGroupOrientationDemo() {
  return (
    <ButtonGroup orientation="vertical" aria-label="Volume controls">
      <Button intent="secondary" aria-label="Unmute">
        <Volume2Icon />
      </Button>
      <Button intent="secondary" aria-label="Mute">
        <VolumeXIcon />
      </Button>
    </ButtonGroup>
  )
}
