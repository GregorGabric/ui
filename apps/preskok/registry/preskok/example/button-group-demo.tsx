import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { ButtonGroup } from "@/registry/preskok/ui/preskok-ui/button-group"

export default function ButtonGroupDemo() {
  return (
    <ButtonGroup>
      <Button intent="secondary">Down</Button>
      <Button intent="secondary">Up</Button>
    </ButtonGroup>
  )
}
