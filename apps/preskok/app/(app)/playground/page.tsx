"use client"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
} from "@/registry/preskok/ui/preskok-ui/popover"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/preskok/ui/preskok-ui/resizable"

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-slate-100/80">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 p-8 lg:p-12">
        <div className="space-y-2">
          <p className="text-sm font-medium tracking-[0.2em] text-slate-500 uppercase">
            Playground
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Popover and resizable playground
          </h1>
          <p className="max-w-3xl text-sm text-slate-600">
            The resizable example uses the new `preskok-ui` splitter
            implementation, including nested groups, collapsible side panels,
            draggable handles, and keyboard resizing.
          </p>
        </div>

        <div className="grid flex-1 gap-8 xl:grid-cols-[22rem_minmax(0,1fr)]">
          <section className="rounded-2xl bg-white/90 p-6 shadow-sm shadow-slate-950/5">
            <div className="mb-4 space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">Popover</h2>
              <p className="text-sm text-slate-600">
                Existing playground control for quick visual checks.
              </p>
            </div>

            <Popover>
              <Button intent="outline">View Vehicle Details</Button>
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>Vehicle Details</PopoverTitle>
                </PopoverHeader>
                <PopoverBody>
                  <Button intent="outline">View Vehicle Details</Button>
                  <Button intent="outline">View Vehicle Details 2</Button>
                  <Button intent="outline">View Vehicle Details 3</Button>
                  <Button intent="outline">View Vehicle Details 4</Button>
                  <Button intent="outline">View Vehicle Details 5</Button>
                </PopoverBody>
                <PopoverFooter>
                  <Button intent="outline">View Vehicle Details</Button>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </section>

          <section className="rounded-2xl bg-white/90 p-6 shadow-sm shadow-slate-950/5">
            <div className="mb-4 space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">
                Resizable Panels
              </h2>
              <p className="text-sm text-slate-600">
                Drag the handles, use arrow keys while a handle is focused,
                press Enter to collapse a collapsible panel, and use Shift with
                arrows for large jumps.
              </p>
            </div>

            <div className="min-h-[560px] overflow-hidden rounded-2xl bg-slate-100/90 shadow-inner shadow-slate-950/5">
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel
                  defaultSize={22}
                  minSize={16}
                  collapsible
                  collapsedSize={8}
                  className="bg-white"
                >
                  <div className="flex h-full flex-col gap-5 p-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
                        Navigation
                      </p>
                      <h3 className="text-base font-semibold text-slate-950">
                        Project Files
                      </h3>
                    </div>

                    <div className="grid gap-2">
                      <Button intent="plain" className="justify-start">
                        Dashboard overview
                      </Button>
                      <Button intent="plain" className="justify-start">
                        Fleet analytics
                      </Button>
                      <Button intent="plain" className="justify-start">
                        Active deliveries
                      </Button>
                      <Button intent="plain" className="justify-start">
                        Incident reports
                      </Button>
                    </div>

                    <div className="space-y-3 rounded-xl bg-slate-50/90 p-3 shadow-sm shadow-slate-950/5">
                      <p className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
                        Quick actions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button intent="outline" size="xs">
                          New report
                        </Button>
                        <Button intent="outline" size="xs">
                          Invite reviewer
                        </Button>
                      </div>
                    </div>
                  </div>
                </ResizablePanel>

                <ResizableHandle withHandle className="bg-transparent" />

                <ResizablePanel
                  defaultSize={54}
                  minSize={30}
                  className="bg-white"
                >
                  <ResizablePanelGroup direction="vertical" className="h-full">
                    <ResizablePanel defaultSize={68} minSize={40}>
                      <div className="flex h-full flex-col gap-4 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
                              Canvas
                            </p>
                            <h3 className="text-base font-semibold text-slate-950">
                              Vehicle Operations Board
                            </h3>
                          </div>

                          <div className="flex gap-2">
                            <Button intent="outline" size="xs">
                              Share view
                            </Button>
                            <Button size="xs">Deploy update</Button>
                          </div>
                        </div>

                        <div className="grid flex-1 gap-4 rounded-2xl bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_35%),linear-gradient(180deg,_white,_rgba(248,250,252,0.95))] p-4 shadow-inner shadow-slate-950/5 lg:grid-cols-[1.25fr_0.75fr]">
                          <div className="flex min-h-[240px] flex-col justify-between rounded-xl bg-white/80 p-4 shadow-sm shadow-slate-950/5 backdrop-blur">
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-slate-500">
                                Primary workspace
                              </p>
                              <h4 className="text-2xl font-semibold tracking-tight text-slate-950">
                                Route health is stable
                              </h4>
                              <p className="max-w-xl text-sm text-slate-600">
                                Use the horizontal handles to resize the
                                sidebars and the vertical handle below to expand
                                the live activity feed.
                              </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                              <div className="rounded-xl bg-white/90 p-3 shadow-sm shadow-slate-950/5">
                                <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
                                  Vehicles online
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-slate-950">
                                  128
                                </p>
                              </div>
                              <div className="rounded-xl bg-white/90 p-3 shadow-sm shadow-slate-950/5">
                                <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
                                  Avg. ETA drift
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-slate-950">
                                  2.4m
                                </p>
                              </div>
                              <div className="rounded-xl bg-white/90 p-3 shadow-sm shadow-slate-950/5">
                                <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
                                  Critical alerts
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-slate-950">
                                  03
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-3">
                            <div className="rounded-xl bg-white p-4 shadow-sm shadow-slate-950/5">
                              <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
                                Selected route
                              </p>
                              <p className="mt-2 text-lg font-semibold text-slate-950">
                                Ljubljana to Maribor
                              </p>
                              <p className="mt-1 text-sm text-slate-600">
                                14 stops, 4 priority deliveries, 1 route review
                                waiting for approval.
                              </p>
                            </div>
                            <div className="rounded-xl bg-slate-950 p-4 text-slate-50 shadow-sm shadow-slate-950/20">
                              <p className="text-xs tracking-[0.18em] text-slate-400 uppercase">
                                Suggested action
                              </p>
                              <p className="mt-2 text-lg font-semibold">
                                Reassign van PR-24 to Route B
                              </p>
                              <p className="mt-1 text-sm text-slate-300">
                                This frees 18 minutes of capacity for same-day
                                pickups in the east corridor.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle className="bg-transparent" />

                    <ResizablePanel
                      defaultSize={32}
                      minSize={18}
                      collapsible
                      collapsedSize={12}
                      className="bg-slate-950 text-slate-50"
                    >
                      <div className="flex h-full flex-col gap-4 p-4">
                        <div className="space-y-1">
                          <p className="text-xs font-medium tracking-[0.18em] text-slate-400 uppercase">
                            Activity Feed
                          </p>
                          <h3 className="text-base font-semibold">
                            Live event stream
                          </h3>
                        </div>

                        <div className="grid gap-3">
                          <div className="rounded-xl bg-slate-900/90 p-3 shadow-sm shadow-black/20">
                            <p className="text-sm font-medium">09:12</p>
                            <p className="mt-1 text-sm text-slate-300">
                              Route B picked up a new refrigeration alert.
                            </p>
                          </div>
                          <div className="rounded-xl bg-slate-900/90 p-3 shadow-sm shadow-black/20">
                            <p className="text-sm font-medium">09:24</p>
                            <p className="mt-1 text-sm text-slate-300">
                              Dispatch approved stop reordering for the city
                              center cluster.
                            </p>
                          </div>
                          <div className="rounded-xl bg-slate-900/90 p-3 shadow-sm shadow-black/20">
                            <p className="text-sm font-medium">09:31</p>
                            <p className="mt-1 text-sm text-slate-300">
                              Driver handoff completed without ETA regression.
                            </p>
                          </div>
                        </div>
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>

                <ResizableHandle withHandle className="bg-transparent" />

                <ResizablePanel
                  defaultSize={24}
                  minSize={18}
                  collapsible
                  collapsedSize={10}
                  className="bg-slate-50"
                >
                  <div className="flex h-full flex-col gap-4 p-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
                        Inspector
                      </p>
                      <h3 className="text-base font-semibold text-slate-950">
                        Selection Details
                      </h3>
                    </div>

                    <div className="space-y-3 rounded-xl bg-white/90 p-4 shadow-sm shadow-slate-950/5">
                      <div>
                        <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
                          Route owner
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-950">
                          Nina Kovac
                        </p>
                      </div>
                      <div>
                        <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
                          Fleet segment
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-950">
                          Refrigerated vans
                        </p>
                      </div>
                      <div>
                        <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
                          Review status
                        </p>
                        <p className="mt-1 text-sm font-medium text-emerald-600">
                          Ready for dispatch
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-2">
                      <Button size="sm">Approve changes</Button>
                      <Button intent="outline" size="sm">
                        Open audit trail
                      </Button>
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
