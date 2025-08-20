"use client"

import * as React from "react"
import type { CalendarDate } from "@internationalized/date"
import { parseDate } from "@internationalized/date"
import { I18nProvider } from "@react-aria/i18n"
import type { RangeValue } from "react-aria-components"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/card"
import { RangeCalendar } from "@/registry/preskok/ui/preskok-ui/range-calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/preskok/ui/select"

const localizedStrings = {
  en: {
    title: "Book an appointment",
    description: "Select the dates for your appointment",
  },
  es: {
    title: "Reserva una cita",
    description: "Selecciona las fechas para tu cita",
  },
} as const

export default function Calendar12() {
  const [locale, setLocale] =
    React.useState<keyof typeof localizedStrings>("es")
  const [range, setRange] = React.useState<RangeValue<CalendarDate>>(() => ({
    start: parseDate("2025-09-09"),
    end: parseDate("2025-09-17"),
  }))

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{localizedStrings[locale].title}</CardTitle>
        <CardDescription>
          {localizedStrings[locale].description}
        </CardDescription>
        <CardAction>
          <Select
            value={locale}
            onValueChange={(value) =>
              setLocale(value as keyof typeof localizedStrings)
            }
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <I18nProvider locale={locale === "es" ? "es-ES" : "en-US"}>
          <div className="inline-block rounded-lg border shadow-sm">
            <RangeCalendar
              value={range}
              onChange={setRange}
              visibleDuration={{ months: 2 }}
            />
          </div>
        </I18nProvider>
      </CardContent>
    </Card>
  )
}
