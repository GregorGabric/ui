"use client"

import { useState } from "react"
import { MinusIcon, PlusIcon } from "lucide-react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Separator } from "@/registry/preskok/ui/preskok-ui/separator"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/registry/preskok/ui/preskok-ui/sheet"

interface Part {
  id: string
  name: string
  price: number
  quantity: number
}

const initialParts: Part[] = [
  { id: "brake-pads", name: "Front brake pads", price: 64.9, quantity: 1 },
  { id: "oil-filter", name: "Oil filter", price: 12.5, quantity: 2 },
  { id: "wiper-blades", name: "Wiper blade set", price: 29, quantity: 1 },
]

const delivery = 6.9

const currency = new Intl.NumberFormat("sl-SI", {
  style: "currency",
  currency: "EUR",
})

export default function SheetCartDemo() {
  const [parts, setParts] = useState(initialParts)

  const itemCount = parts.reduce((sum, part) => sum + part.quantity, 0)

  const subtotal = parts.reduce(
    (sum, part) => sum + part.price * part.quantity,
    0
  )

  const deliveryFee = itemCount > 0 ? delivery : 0

  const changeQuantity = (id: string, step: number) => {
    setParts((current) =>
      current.map((part) =>
        part.id === id
          ? { ...part, quantity: Math.max(0, part.quantity + step) }
          : part
      )
    )
  }

  return (
    <Sheet>
      <Button intent="outline">Parts order ({itemCount})</Button>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Parts order</SheetTitle>
          <SheetDescription>For VW Passat B8 · 2.0 TDI</SheetDescription>
        </SheetHeader>
        <SheetBody className="gap-4">
          <ul className="grid gap-3">
            {parts.map((part) => (
              <li key={part.id} className="flex items-center gap-3">
                <div className="flex-1 text-sm">
                  <p className="font-medium">{part.name}</p>
                  <p className="text-muted-foreground tabular-nums">
                    {currency.format(part.price)}
                  </p>
                </div>
                <Button
                  intent="outline"
                  size="sq-sm"
                  aria-label={`Remove one ${part.name}`}
                  isDisabled={part.quantity === 0}
                  onPress={() => changeQuantity(part.id, -1)}
                >
                  <MinusIcon />
                </Button>
                <span
                  aria-live="polite"
                  className="w-6 text-center text-sm tabular-nums"
                >
                  {part.quantity}
                </span>
                <Button
                  intent="outline"
                  size="sq-sm"
                  aria-label={`Add one ${part.name}`}
                  onPress={() => changeQuantity(part.id, 1)}
                >
                  <PlusIcon />
                </Button>
              </li>
            ))}
          </ul>
          <Separator />
          <dl className="grid grid-cols-2 gap-y-1.5 text-sm">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="text-right tabular-nums">
              {currency.format(subtotal)}
            </dd>
            <dt className="text-muted-foreground">Delivery</dt>
            <dd className="text-right tabular-nums">
              {currency.format(deliveryFee)}
            </dd>
            <dt className="font-medium">Total</dt>
            <dd className="text-right font-medium tabular-nums">
              {currency.format(subtotal + deliveryFee)}
            </dd>
          </dl>
        </SheetBody>
        <SheetFooter>
          <SheetClose
            intent="primary"
            className="w-full"
            isDisabled={itemCount === 0}
          >
            Place order
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
