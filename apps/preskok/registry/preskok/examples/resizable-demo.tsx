"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/preskok/ui/preskok-ui/resizable"

export default function ResizableDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">Horizontal split</p>
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[180px] rounded-lg border md:min-h-[200px]"
        >
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="flex h-full items-center justify-center p-4">
              <span className="text-sm font-medium">Left panel</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="flex h-full items-center justify-center p-4">
              <span className="text-sm font-medium">Right panel</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">Vertical split</p>
        <ResizablePanelGroup
          direction="vertical"
          className="min-h-[240px] rounded-lg border"
        >
          <ResizablePanel defaultSize={45} minSize={20}>
            <div className="flex h-full items-center justify-center p-4">
              <span className="text-sm font-medium">Top panel</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={55} minSize={20}>
            <div className="flex h-full items-center justify-center p-4">
              <span className="text-sm font-medium">Bottom panel</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
