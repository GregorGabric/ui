"use client"

import * as React from "react"
import { CheckIcon, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/registry/preskok/ui/preskok-ui/card"
import {
  CommandMenu,
  CommandMenuFooter,
  CommandMenuItem,
  CommandMenuList,
  CommandMenuSearch,
} from "@/registry/preskok/ui/preskok-ui/command-menu"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"
import {
  Tooltip,
  TooltipContent,
} from "@/registry/preskok/ui/preskok-ui/tooltip"

const users = [
  {
    name: "Olivia Martin",
    email: "m@example.com",
    avatar: "/avatars/01.png",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: "/avatars/03.png",
  },
  {
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: "/avatars/05.png",
  },
  {
    name: "Jackson Lee",
    email: "lee@example.com",
    avatar: "/avatars/02.png",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    avatar: "/avatars/04.png",
  },
] as const

type User = (typeof users)[number]

interface ChatMessage {
  id: string
  role: "agent" | "user"
  content: string
}

export function CardsChat() {
  const [open, setOpen] = React.useState(false)
  const [selectedUsers, setSelectedUsers] = React.useState<Array<User>>([])

  const [messages, setMessages] = React.useState<Array<ChatMessage>>([
    {
      id: "m-1",
      role: "agent",
      content:
        "Hi, how can we assist with your vehicle transport or resale today?",
    },
    {
      id: "m-2",
      role: "user",
      content: "I need help scheduling a pickup for a vehicle auction lot.",
    },
    {
      id: "m-3",
      role: "agent",
      content: "Sure—what's the pickup location and desired delivery window?",
    },
    {
      id: "m-4",
      role: "user",
      content: "Pickup in Munich, delivery to Lyon next week.",
    },
  ])
  const nextId = React.useRef(5)
  const [input, setInput] = React.useState("")
  const inputLength = input.trim().length

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="flex items-center gap-4">
            <Avatar
              src="/avatars/01.png"
              alt="Image"
              initials="S"
              className="border"
            />
            <div className="flex flex-col gap-0.5">
              <p className="text-sm leading-none font-medium">Sofia Davis</p>
              <p className="text-xs text-muted-foreground">m@example.com</p>
            </div>
          </div>
          <Tooltip>
            <Button
              size="sq-sm"
              intent="secondary"
              isCircle
              className="ml-auto"
              onPress={() => {
                setOpen(true)
              }}
            >
              <PlusIcon />
              <span className="sr-only">New message</span>
            </Button>
            <TooltipContent>New message</TooltipContent>
          </Tooltip>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (inputLength === 0) {
                return
              }
              setMessages([
                ...messages,
                {
                  id: `m-${nextId.current++}`,
                  role: "user",
                  content: input,
                },
              ])
              setInput("")
            }}
            className="relative w-full"
          >
            <TextField
              aria-label="Message"
              className="w-full"
              value={input}
              onChange={(value) => {
                setInput(value)
              }}
            />
          </form>
        </CardFooter>
      </Card>
      <CommandMenu
        isOpen={open}
        onOpenChange={setOpen}
        aria-label="New message"
        size="md"
      >
        <CommandMenuSearch placeholder="Search user..." />
        <CommandMenuList
          onAction={(key) => {
            const user = users.find((u) => u.email === key)
            if (!user) {
              return
            }
            if (selectedUsers.includes(user)) {
              setSelectedUsers(selectedUsers.filter((u) => u !== user))
              return
            }
            setSelectedUsers(
              [...users].filter((u) => [...selectedUsers, user].includes(u))
            )
          }}
        >
          {users.map((user) => (
            <CommandMenuItem
              key={user.email}
              id={user.email}
              textValue={user.name}
              className={"flex"}
            >
              <Avatar
                src={user.avatar}
                initials={user.name[0]}
                className="border"
              />
              <div className="ml-2">
                <p className="text-sm leading-none font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              {selectedUsers.includes(user) ? (
                <CheckIcon className="ml-auto flex size-4 text-primary" />
              ) : null}
            </CommandMenuItem>
          ))}
        </CommandMenuList>
        <CommandMenuFooter className="flex items-center sm:justify-between">
          {selectedUsers.length > 0 ? (
            <div className="flex -space-x-2 overflow-hidden">
              {selectedUsers.map((user) => (
                <Avatar
                  key={user.email}
                  src={user.avatar}
                  initials={user.name[0]}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select users to add to this thread.
            </p>
          )}
          <Button
            size="sm"
            isDisabled={selectedUsers.length < 2}
            onPress={() => {
              setOpen(false)
            }}
          >
            Continue
          </Button>
        </CommandMenuFooter>
      </CommandMenu>
    </>
  )
}
