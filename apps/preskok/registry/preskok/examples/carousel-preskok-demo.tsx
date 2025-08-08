"use client"

import { Card, CardContent } from "@/registry/preskok/ui/preskok-ui/card"
import {
  Carousel,
  CarouselButton,
  CarouselContent,
  CarouselHandler,
  CarouselItem,
} from "@/registry/preskok/ui/preskok-ui/carousel"

export default function CarouselPreskokDemo() {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
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
