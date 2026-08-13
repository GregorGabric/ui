import { Button, Tooltip, TooltipContent } from "preskok"

export function Default() {
  return (
    <div className="flex items-center justify-center p-10">
      <Tooltip defaultOpen>
        <Button intent="primary">Vehicle Details</Button>
        <TooltipContent placement="top">
          <strong className="font-semibold">Vehicle specifications</strong>
          <p className="mt-1 max-w-2xs text-sm text-pretty text-muted-foreground">
            View detailed vehicle specifications and features.
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export function Inverse() {
  return (
    <div className="flex items-center justify-center p-10">
      <Tooltip defaultOpen>
        <Button intent="outline">Payment Calculator</Button>
        <TooltipContent placement="bottom" inverse>
          <strong className="font-semibold">Payment calculator</strong>
          <p className="mt-1 max-w-2xs text-sm text-pretty text-muted-foreground">
            Calculate monthly payment based on down payment, interest rate,
            and loan term.
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
