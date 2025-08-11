import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/preskok/ui/accordion"

export default function AccordionDemo() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Vehicle Information</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Our flagship vehicle combines cutting-edge technology with sleek
            design. Built with premium materials, it offers outstanding
            performance and reliability.
          </p>
          <p>
            Key features include advanced driver assistance systems, an
            intuitive infotainment interface, and best-in-class safety ratings.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Delivery Details</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            We offer nationwide vehicle delivery through trusted logistics
            partners. Standard delivery takes 3-5 business days, while express
            delivery ensures arrival within 1-2 business days.
          </p>
          <p>
            All vehicles are fully insured in transit. Track your delivery in
            real time through our tracking portal.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Warranty Policy</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            We stand behind our vehicles with a comprehensive 3-year/36,000-mile
            limited warranty. If you&apos;re not completely satisfied, contact
            your dealer for available exchange options.
          </p>
          <p>
            Warranty coverage includes powertrain and major components. Extended
            coverage options are available at checkout.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
