"use client"

import { useReducer } from "react"
import {
  CheckCheckIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  CircleIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RotateCcwIcon,
} from "lucide-react"
import { twMerge } from "tailwind-merge"

import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Checkbox } from "@/registry/preskok/ui/preskok-ui/checkbox"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Input } from "@/registry/preskok/ui/preskok-ui/input"
import {
  Menu,
  MenuContent,
  MenuItem,
} from "@/registry/preskok/ui/preskok-ui/menu"
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from "@/registry/preskok/ui/preskok-ui/popover"
import {
  ProgressBar,
  ProgressBarHeader,
  ProgressBarTrack,
  ProgressBarValue,
} from "@/registry/preskok/ui/preskok-ui/progress-bar"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

type TaskIntent = "danger" | "info" | "secondary" | "warning"

interface ShowcaseTask {
  id: string
  title: string
  detail: string
  status: string
  intent: TaskIntent
  avatar: string
  assignee: string
  isNew?: boolean
}

interface ShowcaseState {
  tasks: ShowcaseTask[]
  completedTaskIds: Set<string>
  isAddTaskOpen: boolean
  showAllTasks: boolean
  statusMessage: string
}

type ShowcaseAction =
  | { type: "set-add-task-open"; isOpen: boolean }
  | { type: "toggle-show-all" }
  | { type: "toggle-task"; task: ShowcaseTask; isSelected: boolean }
  | { type: "add-task"; task: ShowcaseTask }
  | { type: "mark-all-complete" }
  | { type: "reset" }

const initialTasks: ShowcaseTask[] = [
  {
    id: "onboarding-copy",
    title: "Finalize onboarding copy",
    detail: "Growth · Due today",
    status: "Review",
    intent: "warning",
    avatar: "/avatars/01.png",
    assignee: "Alex Johnson",
  },
  {
    id: "billing-webhooks",
    title: "Wire billing webhooks",
    detail: "Platform · Due tomorrow",
    status: "In progress",
    intent: "info",
    avatar: "/avatars/02.png",
    assignee: "Jamie Rivera",
  },
  {
    id: "mobile-checkout",
    title: "QA mobile checkout",
    detail: "Checkout · Due Friday",
    status: "Blocked",
    intent: "danger",
    avatar: "/avatars/03.png",
    assignee: "Taylor Kim",
  },
]

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

function createInitialState(statusMessage = ""): ShowcaseState {
  return {
    tasks: initialTasks.map((task) => ({ ...task })),
    completedTaskIds: new Set(),
    isAddTaskOpen: false,
    showAllTasks: false,
    statusMessage,
  }
}

function showcaseReducer(
  state: ShowcaseState,
  action: ShowcaseAction
): ShowcaseState {
  switch (action.type) {
    case "set-add-task-open":
      return { ...state, isAddTaskOpen: action.isOpen }
    case "toggle-show-all":
      return { ...state, showAllTasks: !state.showAllTasks }
    case "toggle-task": {
      const completedTaskIds = new Set(state.completedTaskIds)

      if (action.isSelected) {
        completedTaskIds.add(action.task.id)
      } else {
        completedTaskIds.delete(action.task.id)
      }

      const statusMessage = action.isSelected
        ? `${action.task.title} marked complete.`
        : `${action.task.title} reopened.`

      return { ...state, completedTaskIds, statusMessage }
    }
    case "add-task": {
      const tasks = [action.task, ...state.tasks].slice(0, 3)
      const taskIds = new Set(tasks.map((task) => task.id))
      const completedTaskIds = new Set(
        [...state.completedTaskIds].filter((id) => taskIds.has(id))
      )

      return {
        ...state,
        tasks,
        completedTaskIds,
        isAddTaskOpen: false,
        statusMessage: `${action.task.title} added to priority work.`,
      }
    }
    case "mark-all-complete":
      return {
        ...state,
        completedTaskIds: new Set(state.tasks.map((task) => task.id)),
        statusMessage: "All priority work marked complete.",
      }
    case "reset":
      return createInitialState("Project preview reset.")
  }
}

export function Blocks() {
  const [state, dispatch] = useReducer(
    showcaseReducer,
    undefined,
    createInitialState
  )
  const completedTaskCount = state.completedTaskIds.size
  const newTaskCount = state.tasks.filter((task) => task.isNew).length
  const completion = Math.round(
    72 + (completedTaskCount / state.tasks.length) * 28
  )
  const openTaskCount = Math.max(0, 12 + newTaskCount - completedTaskCount)
  const completedTaskLabel =
    completedTaskCount === 1 ? "priority task" : "priority tasks"
  const completionChange = completedTaskCount
    ? `${completedTaskCount} ${completedTaskLabel} done`
    : "+8% this week"
  const openTasksChange = completedTaskCount
    ? `${completedTaskCount} just completed`
    : "4 due today"
  const metrics = [
    {
      label: "Completion",
      value: `${completion}%`,
      change: completionChange,
    },
    {
      label: "Open tasks",
      value: String(openTaskCount),
      change: openTasksChange,
    },
    { label: "Cycle time", value: "3.4d", change: "0.6d faster" },
  ]

  function addTask(formData: FormData) {
    const title = String(formData.get("taskTitle") ?? "").trim()

    if (!title) {
      return
    }

    dispatch({
      type: "add-task",
      task: {
        id: crypto.randomUUID(),
        title,
        detail: "Planning · Added now",
        status: "New",
        intent: "secondary",
        avatar: "/avatars/04.png",
        assignee: "Morgan Lee",
        isNew: true,
      },
    })
  }

  return (
    <section
      className="not-prose mt-3 text-foreground"
      aria-label="Interactive project preview"
    >
      <div className="@container overflow-hidden rounded-2xl border border-foreground/10 bg-card text-card-foreground shadow-xs dark:shadow-none dark:ring-1 dark:ring-white/5">
        <div role="status" className="sr-only">
          {state.statusMessage}
        </div>

        <ProjectHeader
          isAddTaskOpen={state.isAddTaskOpen}
          onAddTask={addTask}
          onAddTaskOpenChange={(isOpen) =>
            dispatch({ type: "set-add-task-open", isOpen })
          }
          onMarkAllComplete={() => dispatch({ type: "mark-all-complete" })}
          onReset={() => dispatch({ type: "reset" })}
        />
        <MetricsGrid metrics={metrics} />

        <div className="grid @3xl:grid-cols-[3fr_2fr]">
          <TaskList
            tasks={state.tasks}
            completedTaskIds={state.completedTaskIds}
            showAllTasks={state.showAllTasks}
            onToggleShowAll={() => dispatch({ type: "toggle-show-all" })}
            onToggleTask={(task, isSelected) =>
              dispatch({ type: "toggle-task", task, isSelected })
            }
          />
          <ProjectProgress completion={completion} />
        </div>
      </div>
    </section>
  )
}

function ProjectHeader({
  isAddTaskOpen,
  onAddTask,
  onAddTaskOpenChange,
  onMarkAllComplete,
  onReset,
}: {
  isAddTaskOpen: boolean
  onAddTask: (formData: FormData) => void
  onAddTaskOpenChange: (isOpen: boolean) => void
  onMarkAllComplete: () => void
  onReset: () => void
}) {
  return (
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

        <Popover isOpen={isAddTaskOpen} onOpenChange={onAddTaskOpenChange}>
          <Button
            className="motion-safe:pressed:scale-96"
            type="button"
            intent="outline"
            size="sm"
          >
            <PlusIcon data-slot="icon" />
            Add task
          </Button>
          <PopoverContent className="z-50 w-72" placement="bottom end">
            <PopoverHeader>
              <PopoverTitle>Add priority task</PopoverTitle>
              <PopoverDescription>
                Add one item to the project preview.
              </PopoverDescription>
            </PopoverHeader>
            <PopoverBody>
              <form action={onAddTask} className="grid gap-4">
                <TextField name="taskTitle" isRequired>
                  <Label>Task name</Label>
                  <Input
                    autoFocus
                    autoComplete="off"
                    maxLength={48}
                    pattern=".*\S.*"
                    placeholder="Prepare release notes"
                  />
                </TextField>
                <div className="flex justify-end gap-2">
                  <Button
                    className="motion-safe:pressed:scale-96"
                    type="button"
                    intent="plain"
                    size="sm"
                    onPress={() => onAddTaskOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="motion-safe:pressed:scale-96"
                    type="submit"
                    size="sm"
                  >
                    Add task
                  </Button>
                </div>
              </form>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        <Menu>
          <Button
            className="motion-safe:pressed:scale-96"
            type="button"
            aria-label="Project actions"
            intent="plain"
            size="sq-sm"
          >
            <MoreHorizontalIcon data-slot="icon" />
          </Button>
          <MenuContent placement="bottom end" popover={{ className: "z-50" }}>
            <MenuItem onAction={onMarkAllComplete}>
              <CheckCheckIcon data-slot="icon" />
              Mark all complete
            </MenuItem>
            <MenuItem onAction={onReset}>
              <RotateCcwIcon data-slot="icon" />
              Reset preview
            </MenuItem>
          </MenuContent>
        </Menu>
      </div>
    </header>
  )
}

function MetricsGrid({
  metrics,
}: {
  metrics: { label: string; value: string; change: string }[]
}) {
  return (
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
  )
}

function TaskList({
  tasks,
  completedTaskIds,
  showAllTasks,
  onToggleShowAll,
  onToggleTask,
}: {
  tasks: ShowcaseTask[]
  completedTaskIds: Set<string>
  showAllTasks: boolean
  onToggleShowAll: () => void
  onToggleTask: (task: ShowcaseTask, isSelected: boolean) => void
}) {
  return (
    <section className="min-w-0 p-4 @2xl:p-5" aria-labelledby="tasks-title">
      <div className="flex items-center justify-between gap-3">
        <h4 id="tasks-title" className="font-semibold">
          Priority work
        </h4>
        <Button
          className="@3xl:hidden motion-safe:pressed:scale-96"
          type="button"
          intent="plain"
          size="xs"
          aria-controls="priority-task-list"
          aria-expanded={showAllTasks}
          onPress={onToggleShowAll}
        >
          {showAllTasks ? "Show less" : "View all"}
          <ContextualChevron isExpanded={showAllTasks} />
        </Button>
      </div>

      <div id="priority-task-list" className="divide-y divide-foreground/10">
        {tasks.map((task, index) => (
          <TaskRow
            key={task.id}
            task={task}
            isCompleted={completedTaskIds.has(task.id)}
            hideOnMobile={index > 1 && !showAllTasks}
            onToggle={onToggleTask}
          />
        ))}
      </div>
    </section>
  )
}

function ContextualChevron({ isExpanded }: { isExpanded: boolean }) {
  return (
    <span className="relative size-3.5" aria-hidden="true">
      <ChevronUpIcon
        className={twMerge(
          "absolute inset-0 size-3.5 transition-opacity duration-150 motion-safe:transition-[opacity,filter,scale] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]",
          isExpanded
            ? "opacity-100 motion-safe:scale-100 motion-safe:blur-0"
            : "opacity-0 motion-safe:scale-[0.25] motion-safe:blur-[4px]"
        )}
      />
      <ChevronDownIcon
        className={twMerge(
          "size-3.5 transition-opacity duration-150 motion-safe:transition-[opacity,filter,scale] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]",
          isExpanded
            ? "opacity-0 motion-safe:scale-[0.25] motion-safe:blur-[4px]"
            : "opacity-100 motion-safe:scale-100 motion-safe:blur-0"
        )}
      />
    </span>
  )
}

function TaskRow({
  task,
  isCompleted,
  hideOnMobile,
  onToggle,
}: {
  task: ShowcaseTask
  isCompleted: boolean
  hideOnMobile: boolean
  onToggle: (task: ShowcaseTask, isSelected: boolean) => void
}) {
  return (
    <div
      className={twMerge(
        "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3",
        hideOnMobile && "max-sm:hidden"
      )}
    >
      <Checkbox
        aria-label={`${isCompleted ? "Reopen" : "Complete"} ${task.title}`}
        isSelected={isCompleted}
        name="completed-task"
        value={task.id}
        onChange={(isSelected) => onToggle(task, isSelected)}
      />
      <div
        className={twMerge(
          "min-w-0 transition-opacity duration-150",
          isCompleted && "opacity-60"
        )}
      >
        <p
          className={twMerge(
            "truncate text-base font-medium decoration-2 sm:text-sm/6",
            isCompleted && "line-through decoration-current/50"
          )}
        >
          {task.title}
        </p>
        <p className="truncate text-base text-muted-foreground sm:text-sm/6">
          {task.detail}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge
          className="max-sm:hidden"
          intent={isCompleted ? "success" : task.intent}
        >
          {isCompleted ? "Done" : task.status}
        </Badge>
        <Avatar src={task.avatar} alt={task.assignee} size="sm" />
      </div>
    </div>
  )
}

function ProjectProgress({ completion }: { completion: number }) {
  return (
    <aside className="border-t border-foreground/10 bg-panel p-4 @2xl:p-5 @3xl:border-t-0 @3xl:border-l">
      <ProgressBar value={completion} aria-label="Launch progress">
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
