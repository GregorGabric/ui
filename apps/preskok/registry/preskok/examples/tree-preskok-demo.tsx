import {
  Tree,
  TreeContent,
  TreeItem,
} from "@/registry/preskok/ui/preskok-ui/tree"

export default function TreePreskokDemo() {
  return (
    <Tree aria-label="Automotive company structure">
      <TreeItem id="models" textValue="Vehicle Models">
        <TreeContent>Vehicle Models</TreeContent>
        <TreeItem id="sedans" textValue="Sedans">
          <TreeContent>Sedans</TreeContent>
          <TreeItem id="compact" textValue="Compact Series">
            <TreeContent>Compact Series</TreeContent>
            <TreeItem id="c200" textValue="C200 Specs.pdf">
              <TreeContent>C200 Specs.pdf</TreeContent>
            </TreeItem>
            <TreeItem id="c300" textValue="C300 Specs.pdf">
              <TreeContent>C300 Specs.pdf</TreeContent>
            </TreeItem>
            <TreeItem id="c400" textValue="C400 Specs.pdf">
              <TreeContent>C400 Specs.pdf</TreeContent>
            </TreeItem>
          </TreeItem>
          <TreeItem id="luxury" textValue="Luxury Series">
            <TreeContent>Luxury Series</TreeContent>
            <TreeItem id="s500" textValue="S500 Brochure.pdf">
              <TreeContent>S500 Brochure.pdf</TreeContent>
            </TreeItem>
            <TreeItem id="s600" textValue="S600 Brochure.pdf">
              <TreeContent>S600 Brochure.pdf</TreeContent>
            </TreeItem>
          </TreeItem>
        </TreeItem>
        <TreeItem id="suvs" textValue="SUVs">
          <TreeContent>SUVs</TreeContent>
          <TreeItem id="mid-size" textValue="Mid-Size SUVs">
            <TreeContent>Mid-Size SUVs</TreeContent>
            <TreeItem id="gx300" textValue="GX300 Manual.pdf">
              <TreeContent>GX300 Manual.pdf</TreeContent>
            </TreeItem>
            <TreeItem id="gx450" textValue="GX450 Manual.pdf">
              <TreeContent>GX450 Manual.pdf</TreeContent>
            </TreeItem>
            <TreeItem id="gx570" textValue="GX570 Manual.pdf">
              <TreeContent>GX570 Manual.pdf</TreeContent>
            </TreeItem>
            <TreeItem id="safety" textValue="Safety Features.xlsx">
              <TreeContent>Safety Features.xlsx</TreeContent>
            </TreeItem>
          </TreeItem>
        </TreeItem>
      </TreeItem>

      <TreeItem id="manufacturing" textValue="Manufacturing">
        <TreeContent>Manufacturing</TreeContent>
        <TreeItem id="assembly" textValue="Assembly Plants">
          <TreeContent>Assembly Plants</TreeContent>
          <TreeItem id="production" textValue="Production Lines">
            <TreeContent>Production Lines</TreeContent>
            <TreeItem id="line1" textValue="Line 1 Schedule.pdf">
              <TreeContent>Line 1 Schedule.pdf</TreeContent>
            </TreeItem>
            <TreeItem id="line2" textValue="Line 2 Schedule.pdf">
              <TreeContent>Line 2 Schedule.pdf</TreeContent>
            </TreeItem>
          </TreeItem>
        </TreeItem>
        <TreeItem id="electric" textValue="Electric Vehicle Division">
          <TreeContent>Electric Vehicle Division</TreeContent>
        </TreeItem>
      </TreeItem>

      <TreeItem id="dealers" textValue="Dealership Network">
        <TreeContent>Dealership Network</TreeContent>
        <TreeItem id="premium-auto" textValue="Premium Auto Group">
          <TreeContent>Premium Auto Group</TreeContent>
          <TreeItem id="contracts" textValue="Dealer Agreements">
            <TreeContent>Dealer Agreements</TreeContent>
            <TreeItem id="2024-contract" textValue="2024 Agreement.pdf">
              <TreeContent>2024 Agreement.pdf</TreeContent>
            </TreeItem>
            <TreeItem id="2025-contract" textValue="2025 Agreement.pdf">
              <TreeContent>2025 Agreement.pdf</TreeContent>
            </TreeItem>
          </TreeItem>
        </TreeItem>
        <TreeItem id="metro-motors" textValue="Metro Motors Ltd">
          <TreeContent>Metro Motors Ltd</TreeContent>
          <TreeItem id="performance" textValue="Sales Performance">
            <TreeContent>Sales Performance</TreeContent>
            <TreeItem id="q1-sales" textValue="Q1 Report.pdf">
              <TreeContent>Q1 Report.pdf</TreeContent>
            </TreeItem>
          </TreeItem>
        </TreeItem>
        <TreeItem id="city-cars" textValue="City Cars Inc">
          <TreeContent>City Cars Inc</TreeContent>
          <TreeItem id="inventory" textValue="Inventory Reports">
            <TreeContent>Inventory Reports</TreeContent>
            <TreeItem id="jan-inv" textValue="January.pdf">
              <TreeContent>January.pdf</TreeContent>
            </TreeItem>
            <TreeItem id="feb-inv" textValue="February.pdf">
              <TreeContent>February.pdf</TreeContent>
            </TreeItem>
            <TreeItem id="mar-inv" textValue="March.pdf">
              <TreeContent>March.pdf</TreeContent>
            </TreeItem>
          </TreeItem>
        </TreeItem>
      </TreeItem>

      <TreeItem id="compliance" textValue="Regulatory Compliance">
        <TreeContent>Regulatory Compliance</TreeContent>
        <TreeItem id="safety-standards" textValue="Safety Standards">
          <TreeContent>Safety Standards</TreeContent>
        </TreeItem>
        <TreeItem id="emissions" textValue="Emissions Testing">
          <TreeContent>Emissions Testing</TreeContent>
          <TreeItem id="current-tests" textValue="2025 Results.pdf">
            <TreeContent>2025 Results.pdf</TreeContent>
          </TreeItem>
          <TreeItem id="previous-tests" textValue="2024 Results.pdf">
            <TreeContent>2024 Results.pdf</TreeContent>
          </TreeItem>
        </TreeItem>
      </TreeItem>

      <TreeItem id="rd" textValue="Research & Development">
        <TreeContent>Research & Development</TreeContent>
        <TreeItem id="autonomous" textValue="Autonomous Driving">
          <TreeContent>Autonomous Driving</TreeContent>
          <TreeItem id="ai-specs" textValue="AI Systems.md">
            <TreeContent>AI Systems.md</TreeContent>
          </TreeItem>
          <TreeItem id="sensors" textValue="Sensor Tech.md">
            <TreeContent>Sensor Tech.md</TreeContent>
          </TreeItem>
          <TreeItem id="testing" textValue="Testing Protocols.md">
            <TreeContent>Testing Protocols.md</TreeContent>
          </TreeItem>
        </TreeItem>
        <TreeItem id="training" textValue="Training Materials">
          <TreeContent>Training Materials</TreeContent>
          <TreeItem id="safety-video" textValue="Safety Training.mp4">
            <TreeContent>Safety Training.mp4</TreeContent>
          </TreeItem>
          <TreeItem id="tech-video" textValue="New Tech Overview.mp4">
            <TreeContent>New Tech Overview.mp4</TreeContent>
          </TreeItem>
        </TreeItem>
      </TreeItem>
    </Tree>
  )
}
