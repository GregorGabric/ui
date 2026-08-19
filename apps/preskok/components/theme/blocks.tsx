"use client"

import { useReducer, useState, type Key } from "react"
import {
  getLocalTimeZone,
  parseDate,
  type CalendarDate,
} from "@internationalized/date"
import {
  ActivityIcon,
  CheckCheckIcon,
  CheckCircle2Icon,
  CircleIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  ListTodoIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RocketIcon,
  RotateCcwIcon,
  UsersIcon,
} from "lucide-react"
import type { Selection } from "react-aria-components/GridList"
import { twMerge } from "tailwind-merge"

import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Checkbox } from "@/registry/preskok/ui/preskok-ui/checkbox"
import {
  ChoiceBox,
  ChoiceBoxItem,
} from "@/registry/preskok/ui/preskok-ui/choice-box"
import {
  DatePicker,
  DatePickerTrigger,
} from "@/registry/preskok/ui/preskok-ui/date-picker"
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
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/registry/preskok/ui/preskok-ui/table"
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@/registry/preskok/ui/preskok-ui/tabs"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

type TaskIntent = "danger" | "info" | "secondary" | "warning"
type TaskPriority = "normal" | "urgent"
type ProjectView = "activity" | "overview" | "tasks"

const defaultTaskDueDate = parseDate("2026-08-28")

interface ShowcaseTask {
  id: string
  title: string
  workstream: string
  due: string
  status: string
  intent: TaskIntent
  avatar: string
  assignee: string
  isNew?: boolean
}

interface ShowcaseState {
  tasks: ShowcaseTask[]
  completedTaskIds: Set<string>
  activeView: ProjectView
  isAddTaskOpen: boolean
  statusMessage: string
}

type ShowcaseAction =
  | { type: "set-view"; view: ProjectView }
  | { type: "set-add-task-open"; isOpen: boolean }
  | { type: "toggle-task"; task: ShowcaseTask; isSelected: boolean }
  | { type: "add-task"; task: ShowcaseTask }
  | { type: "mark-all-complete" }
  | { type: "reset" }

const initialTasks: ShowcaseTask[] = [
  {
    id: "onboarding-copy",
    title: "Finalize onboarding copy",
    workstream: "Growth",
    due: "Today",
    status: "Review",
    intent: "warning",
    avatar: "/avatars/01.png",
    assignee: "Alex Johnson",
  },
  {
    id: "billing-webhooks",
    title: "Wire billing webhooks",
    workstream: "Platform",
    due: "Tomorrow",
    status: "In progress",
    intent: "info",
    avatar: "/avatars/02.png",
    assignee: "Jamie Rivera",
  },
  {
    id: "mobile-checkout",
    title: "QA mobile checkout",
    workstream: "Checkout",
    due: "Friday",
    status: "Blocked",
    intent: "danger",
    avatar: "/avatars/03.png",
    assignee: "Taylor Kim",
  },
  {
    id: "tax-rules",
    title: "Confirm regional tax rules",
    workstream: "Compliance",
    due: "26 Aug",
    status: "Approved",
    intent: "secondary",
    avatar: "/avatars/04.png",
    assignee: "Morgan Lee",
  },
  {
    id: "launch-comms",
    title: "Schedule launch announcement",
    workstream: "Growth",
    due: "28 Aug",
    status: "Scheduled",
    intent: "info",
    avatar: "/avatars/05.png",
    assignee: "Jordan Bell",
  },
]

const recentActivity = [
  {
    id: "blocked-checkout",
    avatar: "/avatars/03.png",
    assignee: "Taylor Kim",
    action: "flagged mobile checkout as blocked",
    time: "12 min ago",
  },
  {
    id: "approved-tax",
    avatar: "/avatars/04.png",
    assignee: "Morgan Lee",
    action: "approved the regional tax rules",
    time: "1 hr ago",
  },
  {
    id: "uploaded-prototype",
    avatar: "/avatars/01.png",
    assignee: "Alex Johnson",
    action: "shared the final checkout prototype",
    time: "Yesterday",
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

function createInitialState(statusMessage = ""): ShowcaseState {
  return {
    tasks: initialTasks.map((task) => ({ ...task })),
    completedTaskIds: new Set(),
    activeView: "overview",
    isAddTaskOpen: false,
    statusMessage,
  }
}

function showcaseReducer(
  state: ShowcaseState,
  action: ShowcaseAction
): ShowcaseState {
  switch (action.type) {
    case "set-view":
      return { ...state, activeView: action.view }
    case "set-add-task-open":
      return { ...state, isAddTaskOpen: action.isOpen }
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
      const tasks = [action.task, ...state.tasks].slice(0, 5)
      const taskIds = new Set(tasks.map((task) => task.id))
      const completedTaskIds = new Set(
        [...state.completedTaskIds].filter((id) => taskIds.has(id))
      )

      return {
        ...state,
        tasks,
        completedTaskIds,
        activeView: "tasks",
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
      shortLabel: "Ready",
      value: `${completion}%`,
      change: completionChange,
    },
    {
      label: "Open tasks",
      shortLabel: "Open",
      value: String(openTaskCount),
      change: openTasksChange,
    },
    {
      label: "Cycle time",
      shortLabel: "Cycle",
      value: "3.4d",
      change: "0.6d faster",
    },
  ]

  function addTask(
    formData: FormData,
    dueDate: CalendarDate | null,
    priority: TaskPriority
  ) {
    const title = String(formData.get("taskTitle") ?? "").trim()

    if (!title) {
      return
    }

    const dueDateLabel = dueDate
      ? dueDate.toDate(getLocalTimeZone()).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        })
      : null
    const workstream = priority === "urgent" ? "Urgent" : "Planning"
    const due = dueDateLabel ?? "No date"
    const status = priority === "urgent" ? "High priority" : "Scheduled"
    const intent: TaskIntent = priority === "urgent" ? "warning" : "secondary"

    dispatch({
      type: "add-task",
      task: {
        id: crypto.randomUUID(),
        title,
        workstream,
        due,
        status,
        intent,
        avatar: "/avatars/04.png",
        assignee: "Morgan Lee",
        isNew: true,
      },
    })
  }

  function changeView(key: Key) {
    if (key === "overview" || key === "tasks" || key === "activity") {
      dispatch({ type: "set-view", view: key })
    }
  }

  function toggleTask(task: ShowcaseTask, isSelected: boolean) {
    dispatch({ type: "toggle-task", task, isSelected })
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

        <div className="grid min-w-0 @5xl:grid-cols-[11rem_minmax(0,1fr)]">
          <WorkspaceSidebar />

          <div className="min-w-0">
            <WorkspaceToolbar />
            <ProjectHeader
              isAddTaskOpen={state.isAddTaskOpen}
              onAddTask={addTask}
              onAddTaskOpenChange={(isOpen) =>
                dispatch({ type: "set-add-task-open", isOpen })
              }
              onMarkAllComplete={() => dispatch({ type: "mark-all-complete" })}
              onReset={() => dispatch({ type: "reset" })}
            />

            <Tabs
              className="gap-0"
              selectedKey={state.activeView}
              onSelectionChange={changeView}
            >
              <TabList
                aria-label="Project sections"
                className="overflow-x-auto overflow-y-hidden border-b border-foreground/10 px-4 py-0 @2xl:px-5"
              >
                <Tab
                  id="overview"
                  className="max-sm:[--tab-gutter-x:--spacing(2)]"
                >
                  Overview
                </Tab>
                <Tab
                  id="tasks"
                  className="max-sm:[--tab-gutter-x:--spacing(2)]"
                >
                  Tasks
                  <span className="ml-1.5 rounded-full bg-secondary px-1.5 text-xs/5 text-secondary-foreground tabular-nums">
                    {openTaskCount}
                  </span>
                </Tab>
                <Tab
                  id="activity"
                  className="max-sm:[--tab-gutter-x:--spacing(2)]"
                >
                  Activity
                </Tab>
              </TabList>

              <TabPanel id="overview">
                <MetricsGrid metrics={metrics} />
                <div className="grid @3xl:grid-cols-[3fr_2fr]">
                  <TaskList
                    tasks={state.tasks.slice(0, 3)}
                    completedTaskIds={state.completedTaskIds}
                    onViewAll={() =>
                      dispatch({ type: "set-view", view: "tasks" })
                    }
                    onToggleTask={toggleTask}
                  />
                  <ProjectProgress completion={completion} />
                </div>
              </TabPanel>

              <TabPanel id="tasks">
                <TaskTable
                  tasks={state.tasks}
                  completedTaskIds={state.completedTaskIds}
                  onToggleTask={toggleTask}
                />
              </TabPanel>

              <TabPanel id="activity">
                <ActivityView />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}

function WorkspaceSidebar() {
  return (
    <aside className="hidden min-h-full flex-col border-r border-foreground/10 bg-panel p-3 @5xl:flex">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <span className="grid size-7 place-items-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
          N
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm/5 font-semibold">Northstar</p>
          <p className="truncate text-xs/4 text-muted-foreground">
            Product team
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-1">
        <span className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm/5 text-muted-foreground">
          <LayoutDashboardIcon className="size-4" strokeWidth={1.5} />
          Dashboard
        </span>
        <span className="flex items-center gap-2 rounded-lg bg-accent px-2 py-1.5 text-sm/5 font-medium text-foreground">
          <FolderKanbanIcon className="size-4 text-primary" strokeWidth={2} />
          Projects
        </span>
        <span className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm/5 text-muted-foreground">
          <ListTodoIcon className="size-4" strokeWidth={1.5} />
          My work
        </span>
        <span className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm/5 text-muted-foreground">
          <UsersIcon className="size-4" strokeWidth={1.5} />
          Team
        </span>
      </div>

      <div className="mt-5 border-t border-foreground/10 pt-4">
        <p className="px-2 text-xs/4 font-medium text-muted-foreground">
          Current project
        </p>
        <div className="mt-2 rounded-xl border border-foreground/10 bg-background p-2.5">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            <p className="truncate text-sm/5 font-medium">Checkout launch</p>
          </div>
          <p className="mt-1 text-xs/4 text-muted-foreground">
            Ships in 9 days
          </p>
        </div>
      </div>

      <div className="mt-auto px-2 pt-6">
        <p className="text-xs/4 text-muted-foreground">Release 2.8</p>
        <p className="text-xs/4 font-medium">Production workspace</p>
      </div>
    </aside>
  )
}

function WorkspaceToolbar() {
  return (
    <div className="flex min-h-12 items-center justify-between gap-3 border-b border-foreground/10 px-4 @2xl:px-5">
      <div className="flex min-w-0 items-center gap-2">
        <RocketIcon
          className="size-4 shrink-0 text-muted-foreground"
          strokeWidth={1.5}
        />
        <p className="truncate text-sm/5 text-muted-foreground">
          Projects <span className="px-1 text-foreground/30">/</span>
          <span className="font-medium text-foreground">Checkout launch</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <span className="hidden items-center gap-1.5 text-xs/4 text-muted-foreground sm:flex">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Synced 2 min ago
        </span>
        <Avatar src="/avatars/04.png" alt="Morgan Lee" size="sm" />
      </div>
    </div>
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
  onAddTask: (
    formData: FormData,
    dueDate: CalendarDate | null,
    priority: TaskPriority
  ) => void
  onAddTaskOpenChange: (isOpen: boolean) => void
  onMarkAllComplete: () => void
  onReset: () => void
}) {
  const [dueDate, setDueDate] = useState<CalendarDate | null>(
    defaultTaskDueDate
  )
  const [priority, setPriority] = useState<TaskPriority>("normal")

  function handlePriorityChange(selection: Selection) {
    if (selection === "all") {
      return
    }

    const nextPriority = [...selection][0]

    if (nextPriority === "normal" || nextPriority === "urgent") {
      setPriority(nextPriority)
    }
  }

  function submitTask(formData: FormData) {
    onAddTask(formData, dueDate, priority)
    setDueDate(defaultTaskDueDate)
    setPriority("normal")
  }

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
          Commerce platform · Release 2.8 · Ships 28 August
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
            className="whitespace-nowrap motion-safe:pressed:scale-96"
            type="button"
            intent="outline"
            size="sm"
          >
            <PlusIcon data-slot="icon" />
            Add task
          </Button>
          <PopoverContent
            className="z-50 w-[calc(100vw-1.5rem)] sm:w-80"
            placement="bottom end"
          >
            <PopoverHeader>
              <PopoverTitle>Add priority task</PopoverTitle>
              <PopoverDescription>
                Add one item to the project preview.
              </PopoverDescription>
            </PopoverHeader>
            <PopoverBody>
              <form action={submitTask} className="grid gap-4">
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
                <DatePicker value={dueDate} onChange={setDueDate} isRequired>
                  <Label>Due date</Label>
                  <DatePickerTrigger />
                </DatePicker>
                <div className="grid gap-1.5">
                  <span
                    id="new-task-priority-label"
                    className="text-base/6 font-medium sm:text-sm/6"
                  >
                    Priority
                  </span>
                  <ChoiceBox
                    aria-labelledby="new-task-priority-label"
                    columns={2}
                    gap={2}
                    selectedKeys={[priority]}
                    onSelectionChange={handlePriorityChange}
                    disallowEmptySelection
                    className="[--gutter:--spacing(3)]"
                  >
                    <ChoiceBoxItem
                      id="normal"
                      textValue="Normal"
                      label="Normal"
                      description="This sprint"
                    />
                    <ChoiceBoxItem
                      id="urgent"
                      textValue="Urgent"
                      label="Urgent"
                      description="Needs attention"
                    />
                  </ChoiceBox>
                </div>
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
  metrics: {
    label: string
    shortLabel: string
    value: string
    change: string
  }[]
}) {
  return (
    <dl className="grid grid-cols-3 border-b border-foreground/10">
      {metrics.map((metric) => (
        <div
          className="min-w-0 border-l border-foreground/10 px-2 py-3 first:border-l-0 @2xl:px-5"
          key={metric.label}
        >
          <dt className="truncate text-base text-muted-foreground sm:text-sm/6">
            <span className="sm:hidden">{metric.shortLabel}</span>
            <span className="max-sm:hidden">{metric.label}</span>
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
  onViewAll,
  onToggleTask,
}: {
  tasks: ShowcaseTask[]
  completedTaskIds: Set<string>
  onViewAll: () => void
  onToggleTask: (task: ShowcaseTask, isSelected: boolean) => void
}) {
  return (
    <section className="min-w-0 p-4 @2xl:p-5" aria-labelledby="tasks-title">
      <div className="flex items-center justify-between gap-3">
        <h4 id="tasks-title" className="font-semibold">
          Priority work
        </h4>
        <Button
          className="motion-safe:pressed:scale-96"
          type="button"
          intent="plain"
          size="xs"
          onPress={onViewAll}
        >
          View all
        </Button>
      </div>

      <div id="priority-task-list" className="divide-y divide-foreground/10">
        {tasks.map((task, index) => (
          <TaskRow
            key={task.id}
            task={task}
            isCompleted={completedTaskIds.has(task.id)}
            hideOnMobile={index > 1}
            onToggle={onToggleTask}
          />
        ))}
      </div>
    </section>
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
          {task.workstream} · Due {task.due}
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

function TaskTable({
  tasks,
  completedTaskIds,
  onToggleTask,
}: {
  tasks: ShowcaseTask[]
  completedTaskIds: Set<string>
  onToggleTask: (task: ShowcaseTask, isSelected: boolean) => void
}) {
  return (
    <section className="p-4 @2xl:p-5" aria-labelledby="all-tasks-title">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h4 id="all-tasks-title" className="font-semibold">
            Release work
          </h4>
          <p className="text-sm/5 text-muted-foreground">
            Priority items across the launch team
          </p>
        </div>
        <Badge intent="secondary">{tasks.length} shown</Badge>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-foreground/10">
        <Table
          aria-label="Release work"
          bleed
          className="mx-0 [--gutter:0px] [&_table]:min-w-[660px]"
        >
          <TableHeader>
            <TableColumn isRowHeader>Task</TableColumn>
            <TableColumn>Owner</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Due</TableColumn>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const isCompleted = completedTaskIds.has(task.id)

              return (
                <TableRow key={task.id} id={task.id}>
                  <TableCell>
                    <div className="flex min-w-64 items-center gap-3">
                      <Checkbox
                        aria-label={`${isCompleted ? "Reopen" : "Complete"} ${task.title}`}
                        isSelected={isCompleted}
                        name="completed-task-table"
                        value={task.id}
                        onChange={(isSelected) =>
                          onToggleTask(task, isSelected)
                        }
                      />
                      <div
                        className={twMerge(
                          "min-w-0",
                          isCompleted && "opacity-60"
                        )}
                      >
                        <p
                          className={twMerge(
                            "truncate font-medium text-foreground",
                            isCompleted && "line-through decoration-current/50"
                          )}
                        >
                          {task.title}
                        </p>
                        <p className="truncate text-xs/4 text-muted-foreground">
                          {task.workstream}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar src={task.avatar} alt={task.assignee} size="sm" />
                      <span className="text-foreground">{task.assignee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge intent={isCompleted ? "success" : task.intent}>
                      {isCompleted ? "Done" : task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="tabular-nums">{task.due}</span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

function ActivityView() {
  return (
    <div className="grid @3xl:grid-cols-[3fr_2fr]">
      <section
        className="min-w-0 p-4 @2xl:p-5"
        aria-labelledby="recent-activity-title"
      >
        <div className="flex items-center gap-2">
          <ActivityIcon
            className="size-4 text-muted-foreground"
            strokeWidth={1.5}
          />
          <h4 id="recent-activity-title" className="font-semibold">
            Recent activity
          </h4>
        </div>

        <div className="mt-3 divide-y divide-foreground/10">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 py-3 first:pt-0"
            >
              <Avatar src={item.avatar} alt={item.assignee} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm/5">
                  <span className="font-medium">{item.assignee}</span>{" "}
                  <span className="text-muted-foreground">{item.action}</span>
                </p>
                <p className="text-xs/4 text-muted-foreground tabular-nums">
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="border-t border-foreground/10 bg-panel p-4 @2xl:p-5 @3xl:border-t-0 @3xl:border-l">
        <p className="text-xs/4 font-medium text-muted-foreground">
          Next checkpoint
        </p>
        <p className="mt-1 font-semibold">Go-live review</p>
        <p className="text-sm/5 text-muted-foreground">
          Thursday, 27 August · 10:30
        </p>

        <div className="mt-4 divide-y divide-foreground/10 border-t border-foreground/10 pt-4">
          {milestones.map((milestone) => (
            <Milestone key={milestone.label} {...milestone} />
          ))}
        </div>
      </aside>
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

      <div className="mt-5 rounded-xl border border-foreground/10 bg-background p-3">
        <div className="flex items-start gap-2.5">
          <span className="mt-1 size-2 shrink-0 rounded-full bg-amber-500" />
          <div className="min-w-0">
            <p className="text-sm/5 font-medium">1 launch risk</p>
            <p className="truncate text-xs/4 text-muted-foreground">
              Mobile checkout QA needs an owner
            </p>
          </div>
        </div>
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
