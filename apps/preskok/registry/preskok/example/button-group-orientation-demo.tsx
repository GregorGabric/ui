"use client"

import { Volume2Icon, VolumeXIcon } from "lucide-react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { ButtonGroup } from "@/registry/preskok/ui/preskok-ui/button-group"

export default function ButtonGroupOrientationDemo() {
  return (
    <ButtonGroup orientation="vertical">
      <Button intent="secondary">
        <Volume2Icon />
      </Button>
      <Button intent="secondary">
        <VolumeXIcon />
      </Button>
    </ButtonGroup>
  )
}
