import {
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  DisclosureTrigger,
} from "preskok"

export function Default() {
  return (
    <DisclosureGroup defaultExpandedKeys={["cardetails"]} className="w-full max-w-md">
      <Disclosure id="taxdetails">
        <DisclosureTrigger>Add tax details</DisclosureTrigger>
        <DisclosurePanel>
          You can add your tax information to your invoices, including your
          company name, tax ID, and billing address.
        </DisclosurePanel>
      </Disclosure>
      <Disclosure id="cardetails">
        <DisclosureTrigger>Add car information details</DisclosureTrigger>
        <DisclosurePanel>
          You can add your car information details to your invoices, including
          your company name, tax ID, and billing address.
        </DisclosurePanel>
      </Disclosure>
      <Disclosure id="vehicledetails">
        <DisclosureTrigger>Add vehicle details</DisclosureTrigger>
        <DisclosurePanel>
          You can add your vehicle details information to your invoices,
          including your company name, tax ID, and billing address.
        </DisclosurePanel>
      </Disclosure>
    </DisclosureGroup>
  )
}
