import { ChevronDownIcon } from "lucide-react"

import { ShowMore } from "preskok"

const events = [
  {
    title: "Access policy updated",
    meta: "2 min ago",
    detail:
      "Admins now require device posture checks before approving exports.",
  },
  {
    title: "Invoice export queued",
    meta: "11 min ago",
    detail:
      "A finance export for Q4 renewals is waiting for reviewer approval.",
  },
  {
    title: "Deployment approved",
    meta: "43 min ago",
    detail: "Security reviewed the change request and cleared it for rollout.",
  },
]

export function Collapsed() {
  return (
    <div className="w-full max-w-2xl rounded-xl border bg-background shadow-sm">
      <ol className="divide-y">
        {events.slice(0, 2).map((event) => (
          <li key={event.title} className="grid gap-1 px-4 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-sm font-medium">{event.title}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {event.meta}
              </span>
            </div>
            <p className="text-sm text-pretty text-muted-foreground">
              {event.detail}
            </p>
          </li>
        ))}
      </ol>
      <div className="px-4 py-3">
        <ShowMore>
          Show 1 more
          <ChevronDownIcon className="size-4" />
        </ShowMore>
      </div>
    </div>
  )
}

export function Expanded() {
  return (
    <div className="w-full max-w-2xl rounded-xl border bg-background shadow-sm">
      <ol className="divide-y">
        {events.map((event) => (
          <li key={event.title} className="grid gap-1 px-4 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-sm font-medium">{event.title}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {event.meta}
              </span>
            </div>
            <p className="text-sm text-pretty text-muted-foreground">
              {event.detail}
            </p>
          </li>
        ))}
      </ol>
      <div className="px-4 py-3">
        <ShowMore isSelected>
          Show less
          <ChevronDownIcon className="size-4 rotate-180 transition-transform duration-200" />
        </ShowMore>
      </div>
    </div>
  )
}
