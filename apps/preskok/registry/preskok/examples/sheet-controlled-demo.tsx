"use client"

import { useState } from "react"

import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/registry/preskok/ui/preskok-ui/sheet"

interface Vehicle {
  id: string
  name: string
  year: number
  mileage: string
  price: string
  status: "Live" | "Reserved" | "Sold"
}

const vehicles: Vehicle[] = [
  {
    id: "VW-2291",
    name: "Volkswagen Golf 1.5 TSI",
    year: 2021,
    mileage: "38,400 km",
    price: "€18,900",
    status: "Live",
  },
  {
    id: "BMW-4410",
    name: "BMW 320d Touring",
    year: 2020,
    mileage: "71,250 km",
    price: "€24,500",
    status: "Reserved",
  },
  {
    id: "RN-1187",
    name: "Renault Clio TCe 90",
    year: 2022,
    mileage: "19,800 km",
    price: "€13,200",
    status: "Sold",
  },
]

const statusIntent = {
  Live: "success",
  Reserved: "warning",
  Sold: "secondary",
} as const

export default function SheetControlledDemo() {
  const [isOpen, setOpen] = useState(false)
  // Kept after closing so the content doesn't disappear during the exit animation.
  const [vehicle, setVehicle] = useState(vehicles[0])

  return (
    <>
      <ul className="w-full max-w-sm divide-y rounded-lg border">
        {vehicles.map((item) => (
          <li key={item.id}>
            <Button
              intent="plain"
              className="w-full justify-between rounded-none px-4 py-3 text-left"
              onPress={() => {
                setVehicle(item)
                setOpen(true)
              }}
            >
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground tabular-nums">
                {item.price}
              </span>
            </Button>
          </li>
        ))}
      </ul>
      <SheetContent isOpen={isOpen} onOpenChange={setOpen}>
        <SheetHeader>
          <SheetTitle>{vehicle.name}</SheetTitle>
          <SheetDescription>Lot {vehicle.id}</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <dt className="text-muted-foreground">Status</dt>
            <dd>
              <Badge intent={statusIntent[vehicle.status]}>
                {vehicle.status}
              </Badge>
            </dd>
            <dt className="text-muted-foreground">Year</dt>
            <dd className="tabular-nums">{vehicle.year}</dd>
            <dt className="text-muted-foreground">Mileage</dt>
            <dd className="tabular-nums">{vehicle.mileage}</dd>
            <dt className="text-muted-foreground">Asking price</dt>
            <dd className="tabular-nums">{vehicle.price}</dd>
          </dl>
        </SheetBody>
        <SheetFooter>
          <SheetClose>Close</SheetClose>
          <Button
            intent="primary"
            isDisabled={vehicle.status === "Sold"}
            onPress={() => setOpen(false)}
          >
            Make an offer
          </Button>
        </SheetFooter>
      </SheetContent>
    </>
  )
}
