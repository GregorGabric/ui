"use client"

import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import {
  GridList,
  GridListDescription,
  GridListItem,
  GridListLabel,
  GridListSpacer,
  GridListStart,
} from "@/registry/preskok/ui/preskok-ui/grid-list"
import { Input } from "@/registry/preskok/ui/preskok-ui/input"
import { Radio, RadioGroup } from "@/registry/preskok/ui/preskok-ui/radio"
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
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"
import { Textarea } from "@/registry/preskok/ui/preskok-ui/textarea"

export default function SheetStackingDemo() {
  return (
    <Sheet>
      <Button intent="outline">Open lot</Button>
      <SheetContent side="bottom" isFloat={false} style={{ height: 520 }}>
        <SheetHeader>
          <SheetTitle>Audi A4 Avant 40 TDI</SheetTitle>
          <SheetDescription>Lot AU-3021 · Ends in 2h 14m</SheetDescription>
        </SheetHeader>
        <SheetBody className="gap-4 text-sm">
          <dl className="grid grid-cols-3 gap-3">
            {lotFacts.map(([term, value]) => (
              <div key={term}>
                <dt className="text-muted-foreground">{term}</dt>
                <dd className="font-medium tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <GridList aria-label="Inspection findings" items={findings}>
            {(finding) => (
              <GridListItem id={finding.id} textValue={finding.name}>
                <GridListStart>
                  <div>
                    <GridListLabel>{finding.name}</GridListLabel>
                    <GridListDescription>{finding.detail}</GridListDescription>
                  </div>
                </GridListStart>
                <GridListSpacer />
                <Badge intent="warning" className="shrink-0">
                  Minor
                </Badge>
              </GridListItem>
            )}
          </GridList>
          <Sheet>
            <Button intent="outline">Contact seller</Button>
            <SheetContent side="bottom" isFloat={false} style={{ height: 480 }}>
              <SheetHeader>
                <SheetTitle>Contact seller</SheetTitle>
                <SheetDescription>
                  Your message goes to Avtohiša Kranj.
                </SheetDescription>
              </SheetHeader>
              <SheetBody className="gap-4">
                <RadioGroup defaultValue="question">
                  <Label>Topic</Label>
                  <Radio value="question">Question about the vehicle</Radio>
                  <Radio value="viewing">Arrange a viewing</Radio>
                </RadioGroup>
                <Sheet>
                  <Button
                    intent="plain"
                    className="-ml-3 self-start sm:-ml-2.5"
                  >
                    Add pickup details
                  </Button>
                  <SheetContent
                    side="bottom"
                    isFloat={false}
                    style={{ height: 360 }}
                  >
                    <SheetHeader>
                      <SheetTitle>Pickup details</SheetTitle>
                    </SheetHeader>
                    <SheetBody className="gap-4">
                      <TextField>
                        <Label>Pickup address</Label>
                        <Input placeholder="Street, city" />
                      </TextField>
                    </SheetBody>
                    <SheetFooter>
                      <SheetClose intent="primary">Save</SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
                <TextField>
                  <Label>Message</Label>
                  <Textarea placeholder="Is the timing belt replaced?" />
                </TextField>
              </SheetBody>
              <SheetFooter>
                <SheetClose intent="primary">Send</SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </SheetBody>
        <SheetFooter>
          <SheetClose>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const lotFacts = [
  ["Current bid", "€21,400"],
  ["Mileage", "88,200 km"],
  ["Year", "2020"],
]

const findings = [
  {
    id: "bumper",
    name: "Scratch on rear bumper",
    detail: "Inspected 2 October",
  },
  {
    id: "tyres",
    name: "Front tyres at 3 mm",
    detail: "Inspected 2 October",
  },
]
