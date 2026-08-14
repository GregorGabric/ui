import { Separator } from "preskok"

export function Horizontal() {
  return (
    <div className="w-full max-w-sm">
      <h3 className="text-lg font-semibold">Vehicle Details</h3>
      <Separator className="my-4" />
      <div className="space-y-2 text-sm">
        <p>Make: Toyota</p>
        <p>Model: Camry</p>
        <p>Year: 2024</p>
      </div>
    </div>
  )
}

export function Vertical() {
  return (
    <div className="flex items-center space-x-4 text-sm">
      <span>Engine</span>
      <Separator orientation="vertical" className="h-4" />
      <span>Transmission</span>
      <Separator orientation="vertical" className="h-4" />
      <span>Drivetrain</span>
    </div>
  )
}
