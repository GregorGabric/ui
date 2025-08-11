import { IconSteeringWheel } from "@tabler/icons-react"

import { Button } from "@/registry/preskok/ui/button"

export default function ButtonWithIcon() {
  return (
    <Button variant="outline" size="sm">
      <IconSteeringWheel /> Request Test Drive
    </Button>
  )
}
