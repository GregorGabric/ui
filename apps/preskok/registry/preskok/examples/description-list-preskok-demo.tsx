import {
  Card,
  CardContent,
  CardHeader,
} from "@/registry/preskok/ui/preskok-ui/card"
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/registry/preskok/ui/preskok-ui/description-list"

export default function DescriptionListPreskokDemo() {
  return (
    <Card className="max-w-xl">
      <CardHeader
        title="Workspace contract"
        description="Commercial terms used for renewal approval."
      />
      <CardContent>
        <DescriptionList>
          <DescriptionTerm>Plan</DescriptionTerm>
          <DescriptionDetails>Enterprise</DescriptionDetails>
          <DescriptionTerm>Seats</DescriptionTerm>
          <DescriptionDetails>240 active, 18 pending</DescriptionDetails>
          <DescriptionTerm>Renewal date</DescriptionTerm>
          <DescriptionDetails>September 30, 2026</DescriptionDetails>
          <DescriptionTerm>Billing owner</DescriptionTerm>
          <DescriptionDetails>Maya Chen</DescriptionDetails>
          <DescriptionTerm>Annual value</DescriptionTerm>
          <DescriptionDetails>$128,000</DescriptionDetails>
          <DescriptionTerm>Status</DescriptionTerm>
          <DescriptionDetails>Legal review</DescriptionDetails>
        </DescriptionList>
      </CardContent>
    </Card>
  )
}
