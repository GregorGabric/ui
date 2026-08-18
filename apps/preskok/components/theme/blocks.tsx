import {
  CheckCircle2Icon,
  CircleIcon,
  MoreHorizontalIcon,
  PlusIcon,
} from "lucide-react"
import { twMerge } from "tailwind-merge"

import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Checkbox } from "@/registry/preskok/ui/preskok-ui/checkbox"
import {
  ProgressBar,
  ProgressBarHeader,
  ProgressBarTrack,
  ProgressBarValue,
} from "@/registry/preskok/ui/preskok-ui/progress-bar"

const metrics = [
  { label: "Completion", value: "72%", change: "+8% this week" },
  { label: "Open tasks", value: "12", change: "4 due today" },
  { label: "Cycle time", value: "3.4d", change: "0.6d faster" },
] as const

const tasks = [
  {
    id: "onboarding-copy",
    title: "Finalize onboarding copy",
    detail: "Growth · Due today",
    status: "Review",
    intent: "warning",
    avatar: "/avatars/01.png",
    assignee: "Alex Johnson",
    hideOnMobile: false,
  },
  {
    id: "billing-webhooks",
    title: "Wire billing webhooks",
    detail: "Platform · Due tomorrow",
    status: "In progress",
    intent: "info",
    avatar: "/avatars/02.png",
    assignee: "Jamie Rivera",
    hideOnMobile: false,
  },
  {
    id: "mobile-checkout",
    title: "QA mobile checkout",
    detail: "Checkout · Due Friday",
    status: "Blocked",
    intent: "danger",
    avatar: "/avatars/03.png",
    assignee: "Taylor Kim",
    hideOnMobile: true,
  },
] as const

const milestones = [
  {
    label: "Design QA",
    detail: "18 of 18 screens",
    complete: true,
    hideOnMobile: false,
  },
  {
    label: "Engineering",
    detail: "24 of 31 tasks",
    complete: false,
    hideOnMobile: false,
  },
  {
    label: "Launch checklist",
    detail: "7 of 10 items",
    complete: false,
    hideOnMobile: true,
  },
] as const

export function Blocks() {
  return (
    <section className="not-prose mt-3 text-foreground">
      <div className="@container overflow-hidden rounded-2xl border border-foreground/10 bg-card text-card-foreground shadow-xs dark:shadow-none dark:ring-1 dark:ring-white/5">
        <header className="flex flex-col gap-4 border-b border-foreground/10 p-4 @2xl:flex-row @2xl:items-center @2xl:justify-between @2xl:p-5">
          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-semibold text-balance">
                Checkout launch
              </h3>
              <Badge intent="success">On track</Badge>
            </div>
            <p className="max-w-[52ch] text-base text-pretty text-muted-foreground sm:text-sm/6">
              Everything the team needs for the August release.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-1" aria-label="Project team">
              <Avatar src="/avatars/01.png" alt="Alex Johnson" size="sm" />
              <Avatar src="/avatars/02.png" alt="Jamie Rivera" size="sm" />
              <Avatar src="/avatars/03.png" alt="Taylor Kim" size="sm" />
            </div>
            <Button type="button" intent="outline" size="sm">
              <PlusIcon data-slot="icon" />
              Add task
            </Button>
            <Button
              type="button"
              aria-label="Project actions"
              intent="plain"
              size="sq-sm"
            >
              <MoreHorizontalIcon data-slot="icon" />
            </Button>
          </div>
        </header>

        <dl className="grid grid-cols-3 border-b border-foreground/10">
          {metrics.map((metric) => (
            <div
              className="min-w-0 border-l border-foreground/10 px-2 py-3 first:border-l-0 @2xl:px-5"
              key={metric.label}
            >
              <dt className="truncate text-base text-muted-foreground sm:text-sm/6">
                {metric.label}
              </dt>
              <dd className="min-w-0 @lg:flex @lg:items-baseline @lg:justify-between @lg:gap-3">
                <p className="truncate text-xl font-semibold tracking-tight tabular-nums">
                  {metric.value}
                </p>
                <p className="hidden truncate text-base text-muted-foreground tabular-nums sm:text-sm/6 @lg:block">
                  {metric.change}
                </p>
              </dd>
            </div>
          ))}
        </dl>

        <div className="grid @3xl:grid-cols-[3fr_2fr]">
          <section
            className="min-w-0 p-4 @2xl:p-5"
            aria-labelledby="tasks-title"
          >
            <div className="flex items-center justify-between gap-3">
              <h4 id="tasks-title" className="font-semibold">
                Priority work
              </h4>
              <Button type="button" intent="plain" size="xs">
                View all
              </Button>
            </div>

            <div className="divide-y divide-foreground/10">
              {tasks.map((task) => (
                <div
                  className={twMerge(
                    "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3",
                    task.hideOnMobile && "max-sm:hidden"
                  )}
                  key={task.id}
                >
                  <Checkbox
                    aria-label={`Mark ${task.title} complete`}
                    name="completed-task"
                    value={task.id}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-base font-medium sm:text-sm/6">
                      {task.title}
                    </p>
                    <p className="truncate text-base text-muted-foreground sm:text-sm/6">
                      {task.detail}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge className="max-sm:hidden" intent={task.intent}>
                      {task.status}
                    </Badge>
                    <Avatar src={task.avatar} alt={task.assignee} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="border-t border-foreground/10 bg-panel p-4 @2xl:p-5 @3xl:border-t-0 @3xl:border-l">
            <ProgressBar value={72} aria-label="Launch progress">
              <ProgressBarHeader>
                <span>Launch progress</span>
                <ProgressBarValue className="font-medium tabular-nums" />
              </ProgressBarHeader>
              <ProgressBarTrack className="min-w-0" />
            </ProgressBar>

            <div className="mt-5 divide-y divide-foreground/10">
              {milestones.map((milestone) => (
                <Milestone key={milestone.label} {...milestone} />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Milestone({
  label,
  detail,
  complete,
  hideOnMobile,
}: (typeof milestones)[number]) {
  const StatusIcon = complete ? CheckCircle2Icon : CircleIcon

  return (
    <div
      className={twMerge(
        "flex items-start gap-3 py-3 first:pt-0 last:pb-0",
        hideOnMobile && "max-sm:hidden"
      )}
    >
      <StatusIcon
        aria-hidden="true"
        className="size-4 h-lh shrink-0 stroke-primary"
        strokeWidth={complete ? 2.5 : 1.5}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-medium sm:text-sm/6">{label}</p>
        <p className="truncate text-base text-muted-foreground tabular-nums sm:text-sm/6">
          {detail}
        </p>
      </div>
    </div>
  )
}
