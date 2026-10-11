"use client"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
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
        <SheetBody className="gap-3 text-sm">
          <p className="text-muted-foreground">
            Sold by Avtohiša Kranj. Inspected on 2 October with two minor
            findings.
          </p>
          <Sheet>
            <Button intent="outline">Contact seller</Button>
            <SheetContent side="bottom" isFloat={false} style={{ height: 440 }}>
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
                  <Button intent="plain" className="self-start">
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
