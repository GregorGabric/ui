"use client"

import { Card, CardContent } from "@/registry/preskok/ui/preskok-ui/card"
import {
  Carousel,
  CarouselButton,
  CarouselContent,
  CarouselHandler,
  CarouselItem,
} from "@/registry/preskok/ui/preskok-ui/carousel"

const vehicleImages = [
  {
    id: 1,
    title: "Exterior Front",
    description: "Front view showing the sleek design",
  },
  {
    id: 2,
    title: "Interior Dashboard",
    description: "Modern dashboard with digital displays",
  },
  {
    id: 3,
    title: "Engine Bay",
    description: "2.5L 4-cylinder hybrid engine",
  },
  {
    id: 4,
    title: "Rear View",
    description: "Aerodynamic rear design with LED taillights",
  },
  {
    id: 5,
    title: "Side Profile",
    description: "Complete side view with alloy wheels",
  },
]

export default function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-md">
      <CarouselContent>
        {vehicleImages.map((image) => (
          <CarouselItem key={image.id}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-video items-center justify-center p-6">
                  <div className="space-y-2 text-center">
                    <div className="text-2xl font-semibold">{image.id}</div>
                    <div className="font-medium">{image.title}</div>
                    <div className="text-muted-foreground text-sm">
                      {image.description}
                    </div>
                  </div>
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
