import {
  Card,
  CardContent,
  Carousel,
  CarouselButton,
  CarouselContent,
  CarouselHandler,
  CarouselItem,
} from "preskok"

const releases = [
  { name: "Audit log", detail: "Workspace events with actor metadata" },
  { name: "Approvals", detail: "Policy gates for sensitive exports" },
  { name: "Usage caps", detail: "Per-team budgets and overage alerts" },
]

export function Horizontal() {
  return (
    <Carousel className="w-full max-w-lg" opts={{ align: "start", loop: true }}>
      <CarouselContent>
        {releases.map((release) => (
          <CarouselItem key={release.name} className="basis-full sm:basis-1/2">
            <div className="p-1">
              <Card>
                <CardContent className="grid aspect-[4/3] content-center gap-2 p-6">
                  <span className="text-lg font-semibold">{release.name}</span>
                  <span className="text-sm text-muted-foreground">{release.detail}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselHandler className="justify-between">
        <CarouselButton segment="previous" />
        <CarouselButton segment="next" />
      </CarouselHandler>
    </Carousel>
  )
}

export function Vertical() {
  return (
    <Carousel orientation="vertical" className="h-64 w-64">
      <CarouselContent className="h-52">
        {releases.map((release) => (
          <CarouselItem key={release.name}>
            <Card>
              <CardContent className="grid h-48 content-center gap-2 p-5">
                <span className="font-medium">{release.name}</span>
                <span className="text-sm text-muted-foreground">{release.detail}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselHandler>
        <CarouselButton segment="previous" />
        <CarouselButton segment="next" />
      </CarouselHandler>
    </Carousel>
  )
}
