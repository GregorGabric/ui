import { CheckIcon } from "lucide-react"
import { ProgressCircle } from "preskok"

export function Basic() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="flex items-center gap-2">
        <ProgressCircle value={72} className="size-5 text-primary" />
        <span className="text-sm">72% uploaded</span>
      </div>
      <div className="flex items-center gap-2">
        <ProgressCircle
          isIndeterminate
          className="size-5 text-muted-foreground"
        />
        <span className="text-sm">Processing</span>
      </div>
      <div className="flex items-center gap-2 text-success">
        <CheckIcon className="size-5" />
        <span className="text-sm">Complete</span>
      </div>
    </div>
  )
}
