import { Button } from "@/registry/preskok/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/preskok/ui/tooltip"

export default function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  )
}
