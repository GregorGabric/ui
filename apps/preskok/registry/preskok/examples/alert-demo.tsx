import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/preskok/ui/alert"

export default function AlertDemo() {
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>Success! Your vehicle listing has been saved</AlertTitle>
        <AlertDescription>
          Your changes to the vehicle details are now live.
        </AlertDescription>
      </Alert>
      <Alert>
        <PopcornIcon />
        <AlertTitle>Dealer tip: add high-quality photos</AlertTitle>
      </Alert>
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Unable to process the vehicle delivery payment.</AlertTitle>
        <AlertDescription>
          <p>Please verify your billing information and try again.</p>
          <ul className="list-inside list-disc text-sm">
            <li>Check the card details</li>
            <li>Ensure sufficient funds</li>
            <li>Verify the billing address</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
