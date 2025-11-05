import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/registry/preskok/ui/preskok-ui/description-list"

export default function DescriptionListPreskokDemo() {
  return (
    <DescriptionList className="max-w-xl">
      <DescriptionTerm>Model</DescriptionTerm>
      <DescriptionDetails>Tesla Model 3</DescriptionDetails>
      <DescriptionTerm>Year</DescriptionTerm>
      <DescriptionDetails>2024</DescriptionDetails>
      <DescriptionTerm>Mileage</DescriptionTerm>
      <DescriptionDetails>15,000 miles</DescriptionDetails>
      <DescriptionTerm>Manufacturer</DescriptionTerm>
      <DescriptionDetails>Tesla</DescriptionDetails>
      <DescriptionTerm>Price</DescriptionTerm>
      <DescriptionDetails>$45,000</DescriptionDetails>
      <DescriptionTerm>Condition</DescriptionTerm>
      <DescriptionDetails>Like New</DescriptionDetails>
    </DescriptionList>
  )
}
