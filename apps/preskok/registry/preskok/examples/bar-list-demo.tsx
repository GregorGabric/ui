"use client"

import { useState } from "react"

import { BarList } from "@/registry/preskok/ui/preskok-ui/bar-list"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"

const data = [
  { name: "Organic search", value: 18420, key: "organic" },
  { name: "Direct", value: 13680, key: "direct" },
  { name: "Referrals", value: 9210, key: "referrals" },
  { name: "Social", value: 6540, key: "social" },
  { name: "Email", value: 4890, key: "email" },
]

const totalVisitors = data.reduce((total, item) => total + item.value, 0)
const compactNumber = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
  notation: "compact",
})

export default function BarListDemo() {
  const [selected, setSelected] = useState(data[0])
  const selectedShare = (selected.value / totalVisitors) * 100

  return (
    <Card className="w-xl max-w-full">
      <CardHeader>
        <CardTitle>Visitors by channel</CardTitle>
        <CardDescription>
          Where your audience came from this month.
        </CardDescription>
        <CardAction className="text-right">
          <p className="text-xs text-muted-foreground">Total visitors</p>
          <p className="text-xl font-semibold tabular-nums">
            {compactNumber.format(totalVisitors)}
          </p>
        </CardAction>
      </CardHeader>
      <CardContent>
        <BarList
          data={data}
          showAnimation
          valueFormatter={(value) => compactNumber.format(value)}
          onValueChange={setSelected}
        />
      </CardContent>
      <CardFooter
        className="border-t text-sm text-muted-foreground"
        aria-live="polite"
      >
        <p>
          <span className="font-medium text-foreground">{selected.name}</span>
          {" accounts for "}
          <span className="text-foreground tabular-nums">
            {selectedShare.toFixed(1)}%
          </span>
          {" of visits"}
        </p>
      </CardFooter>
    </Card>
  )
}
