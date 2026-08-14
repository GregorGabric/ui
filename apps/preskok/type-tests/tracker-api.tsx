import {
  StaticTracker,
  Tracker,
  type TrackerItem,
} from "@/registry/preskok/ui/preskok-ui/tracker"

const data = [
  { id: "09:00", label: "On time at 09:00", color: "var(--chart-1)" },
  { id: "10:00", label: "Delayed at 10:00" },
] satisfies readonly TrackerItem[]

const interactiveTracker = (
  <Tracker
    aria-label="Delivery status by hour"
    data={data}
    defaultColor="var(--secondary)"
  />
)

const staticTracker = (
  <StaticTracker aria-label="Delivery status by hour" data={data} />
)

const missingLabel = (
  <Tracker
    aria-label="Delivery status by hour"
    // @ts-expect-error every segment needs an accessible label.
    data={[{ id: "09:00" }]}
  />
)

const removedTooltipToggle = (
  // @ts-expect-error use StaticTracker instead of switching behavior with a boolean.
  <Tracker aria-label="Delivery status by hour" data={data} disabledTooltip />
)

export { interactiveTracker, missingLabel, removedTooltipToggle, staticTracker }
