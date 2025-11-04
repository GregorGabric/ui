"use client"

import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  ButtonGroup,
  ButtonGroupText,
} from "@/registry/preskok/ui/preskok-ui/button-group"

export default function ButtonGroupWithTextDemo() {
  return (
    <ButtonGroup>
      <ButtonGroupText>Deploy</ButtonGroupText>
      <Button intent="outline">
        Options
        <ChevronDownIcon />
      </Button>
    </ButtonGroup>
  )
}
