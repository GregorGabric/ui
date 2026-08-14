import { Tree, TreeContent, TreeItem } from "preskok"

export function Basic() {
  return (
    <Tree
      aria-label="Automotive company structure"
      className="w-full max-w-sm"
      defaultExpandedKeys={["models", "sedans", "compact"]}
    >
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
          </TreeItem>
          <TreeItem id="luxury" textValue="Luxury Series">
            <TreeContent>Luxury Series</TreeContent>
            <TreeItem id="s500" textValue="S500 Brochure.pdf">
              <TreeContent>S500 Brochure.pdf</TreeContent>
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
          </TreeItem>
        </TreeItem>
      </TreeItem>
      <TreeItem id="manufacturing" textValue="Manufacturing">
        <TreeContent>Manufacturing</TreeContent>
        <TreeItem id="assembly" textValue="Assembly Plants">
          <TreeContent>Assembly Plants</TreeContent>
        </TreeItem>
        <TreeItem id="electric" textValue="Electric Vehicle Division">
          <TreeContent>Electric Vehicle Division</TreeContent>
        </TreeItem>
      </TreeItem>
      <TreeItem id="dealers" textValue="Dealership Network">
        <TreeContent>Dealership Network</TreeContent>
        <TreeItem id="premium-auto" textValue="Premium Auto Group">
          <TreeContent>Premium Auto Group</TreeContent>
        </TreeItem>
      </TreeItem>
    </Tree>
  )
}
