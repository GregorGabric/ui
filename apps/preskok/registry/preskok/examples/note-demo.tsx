"use client"

import { Note } from "@/registry/preskok/ui/preskok-ui/note"

export default function NoteDemo() {
  return (
    <div className="space-y-4">
      <Note intent="default">
        Our premium detailing service includes interior cleaning, exterior wash,
        and tire shine. Book your appointment today for a spotless finish.
      </Note>

      <Note intent="info">
        New electric vehicle charging stations are now available in our service
        center parking lot. Free charging for customers during service
        appointments.
      </Note>

      <Note intent="warning">
        Vehicle recall notice: If you own a 2022-2023 model, please schedule an
        inspection for potential brake system updates. Safety is our priority.
      </Note>

      <Note intent="danger">
        Emergency roadside assistance required? Our 24/7 towing service covers a
        50-mile radius. Call our hotline immediately for rapid response.
      </Note>

      <Note intent="success">
        Congratulations! Your vehicle has passed all safety inspections and is
        ready for pickup. Thank you for choosing our certified service center.
      </Note>
    </div>
  )
}
