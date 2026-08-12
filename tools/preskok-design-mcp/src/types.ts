export type DocumentationProp = {
  name: string
  type: string
  defaultValue: string | null
  description: string
}

export type ComponentDocumentation = {
  title: string
  description: string | null
  path: string
  sourcePath: string
  props: Array<DocumentationProp>
  usage: string | null
}

export type ComponentVariant = {
  values: Array<string>
  defaultValue: string | null
}

export type ComponentExample = {
  name: string
  sourceFiles: Array<string>
}

export type ComponentDeclaration = {
  name: string
  kind: "interface" | "type"
  declaration: string
}

export type FigmaComponentPropertyDefinition = {
  name: string
  type: "BOOLEAN" | "INSTANCE_SWAP" | "TEXT" | "VARIANT"
  defaultValue: string | boolean
  variantOptions: Array<string>
  preferredValues: Array<{
    type: "COMPONENT" | "COMPONENT_SET"
    key: string
  }>
  boundVariables: Record<string, { type: "VARIABLE_ALIAS"; id: string }>
}

export type FigmaAsset = {
  name: string
  assetType: "component" | "component_set"
  componentKey: string
  description: string | null
  updatedAt: string
  filePath: string
  liveName: string
  liveDescription: string | null
  propertyDefinitions: Array<FigmaComponentPropertyDefinition>
  variantCount: number
}

export type FigmaComponentCoverage = {
  query: string
  status: "verified" | "partial" | "missing" | "not_applicable"
  reason: string
  assets: Array<FigmaAsset>
  fallbackComponents?: Array<string>
}

export type PreskokComponent = {
  name: string
  registryName: string
  description: string | null
  importPath: string
  sourceFiles: Array<string>
  dependencies: Array<string>
  registryDependencies: Array<string>
  exports: Array<string>
  declarations: Array<ComponentDeclaration>
  variants: Record<string, ComponentVariant>
  tokens: Array<string>
  slots: Array<string>
  documentation: ComponentDocumentation | null
  examples: Array<ComponentExample>
  figma: FigmaComponentCoverage
}

export type DesignToken = {
  name: string
  kind: "color" | "dimension" | "font" | "other"
  values: {
    light: string
    dark: string
  }
  aliases: Array<string>
  usedBy: Array<string>
  sourcePath: string
}

export type PreskokCatalog = {
  schemaVersion: 2
  source: {
    registryPath: string
    componentCount: number
    exampleCount: number
  }
  components: Array<PreskokComponent>
  tokens: Array<DesignToken>
  figma: {
    checkedAt: string
    propertiesCheckedAt: string
    contextFileKey: string
    library: {
      name: string
      libraryKey: string
    }
    source: {
      checkedAt: string
      url: string
      fileKey: string
      library: {
        name: string
        libraryKey: string
      }
      publishedAccess: {
        preferred: "enabled_library"
        directImportByKeySupported: true
        assetsPanelRequiresEnabledLibrary: true
        proofRequirement: string
      }
      collections: {
        source: FigmaCollectionContracts
        published: FigmaCollectionContracts
      }
    }
    coverage: {
      verified: number
      partial: number
      missing: number
      notApplicable: number
    }
  }
}

export type FigmaCollectionContracts = {
  style: {
    name: "Style"
    key: string
    modes: Array<string>
  }
  colorMode: {
    name: "Mode"
    key: string
    modes: Array<"Light" | "Dark">
  }
}
