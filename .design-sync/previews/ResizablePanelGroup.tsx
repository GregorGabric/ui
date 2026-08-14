import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "preskok"

export function Horizontal() {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-[180px] w-full max-w-2xl rounded-lg border md:min-h-[200px]"
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
  )
}

export function Vertical() {
  return (
    <ResizablePanelGroup
      orientation="vertical"
      className="min-h-[240px] w-full max-w-2xl rounded-lg border"
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
  )
}
