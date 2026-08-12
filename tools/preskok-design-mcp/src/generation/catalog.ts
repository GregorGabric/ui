import { promises as fs } from "node:fs"
import path from "node:path"
import ts from "typescript"

import type {
  ComponentDeclaration,
  ComponentDocumentation,
  ComponentExample,
  ComponentVariant,
  DesignToken,
  DocumentationProp,
  FigmaAsset,
  PreskokCatalog,
  PreskokComponent,
  FigmaComponentCoverage,
  FigmaCollectionContracts,
} from "../types.js"

type RegistryFile = {
  path: string
  type: string
  target?: string
}

type RegistryItem = {
  name: string
  type: string
  description?: string
  dependencies?: Array<string>
  registryDependencies?: Array<string>
  files?: Array<RegistryFile>
}

type Registry = {
  items: Array<RegistryItem>
}

type GenerateCatalogOptions = {
  workspaceRoot: string
}

type CatalogFileOptions = GenerateCatalogOptions & {
  outputPath: string
}

type ParsedSource = Pick<
  PreskokComponent,
  "exports" | "declarations" | "variants" | "tokens" | "slots"
>

const registryRelativePath = "apps/preskok/registry.json"
const appRelativePath = "apps/preskok"
const documentationRelativePath = "apps/preskok/content/docs"
const tokenRelativePath = "apps/preskok/styles/globals.css"
const figmaSnapshotRelativePath =
  "tools/preskok-design-mcp/config/figma-library.snapshot.json"
const figmaPropertiesSnapshotRelativePath =
  "tools/preskok-design-mcp/config/figma-properties.snapshot.json"
const figmaSourceSnapshotRelativePath =
  "tools/preskok-design-mcp/config/figma-source.snapshot.json"

type FigmaSnapshot = {
  schemaVersion: 1
  checkedAt: string
  contextFileKey: string
  library: {
    name: string
    libraryKey: string
  }
  components: Record<string, FigmaComponentCoverage>
}

type FigmaPropertySnapshot = {
  schemaVersion: 1
  checkedAt: string
  contextFileKey: string
  library: {
    name: string
    libraryKey: string
  }
  assets: Array<{
    requestedName: string
    componentKey: string
    actualName: string
    type: "COMPONENT" | "COMPONENT_SET"
    description: string | null
    properties: FigmaAsset["propertyDefinitions"]
    variantCount: number
  }>
}

type FigmaSourceSnapshot = {
  schemaVersion: 2
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

export async function generatePreskokCatalog({
  workspaceRoot,
}: GenerateCatalogOptions): Promise<PreskokCatalog> {
  const registryPath = path.join(workspaceRoot, registryRelativePath)
  const registry = JSON.parse(
    await fs.readFile(registryPath, "utf8")
  ) as Registry
  const documentation = await readDocumentation(workspaceRoot)
  const figmaSnapshot = await readFigmaSnapshot(workspaceRoot)
  const figmaPropertiesSnapshot =
    await readFigmaPropertiesSnapshot(workspaceRoot)
  const figmaSourceSnapshot = await readFigmaSourceSnapshot(workspaceRoot)
  validateFigmaSourceSnapshots(
    figmaSnapshot,
    figmaPropertiesSnapshot,
    figmaSourceSnapshot
  )
  const figmaCoverage = enrichFigmaCoverage(
    figmaSnapshot.components,
    figmaPropertiesSnapshot
  )
  const examples = registry.items.filter(
    (item) => item.type === "registry:example"
  )
  const components = registry.items.filter(
    (item) => item.type === "registry:ui"
  )

  const generatedComponents = await Promise.all(
    components.map((item) =>
      createComponent({
        item,
        examples,
        documentation: documentation.get(item.name) ?? null,
        figma: figmaCoverage[item.name],
        workspaceRoot,
      })
    )
  )
  const missingFigmaEntries = generatedComponents.filter(
    (component) => !component.figma
  )
  if (missingFigmaEntries.length > 0) {
    throw new Error(
      `Figma snapshot is missing component entries: ${missingFigmaEntries
        .map((component) => component.name)
        .join(", ")}`
    )
  }
  validateFigmaFallbacks(generatedComponents)
  const coverage = countFigmaCoverage(generatedComponents)

  return {
    schemaVersion: 2,
    source: {
      registryPath: registryRelativePath,
      componentCount: components.length,
      exampleCount: examples.length,
    },
    components: generatedComponents,
    tokens: await readTokens(workspaceRoot, generatedComponents),
    figma: {
      checkedAt: figmaSnapshot.checkedAt,
      propertiesCheckedAt: figmaPropertiesSnapshot.checkedAt,
      contextFileKey: figmaSnapshot.contextFileKey,
      library: figmaSnapshot.library,
      source: figmaSourceSnapshot,
      coverage,
    },
  }
}

export async function writePreskokCatalog({
  workspaceRoot,
  outputPath,
}: CatalogFileOptions) {
  const catalog = await generatePreskokCatalog({ workspaceRoot })
  const serialized = serializePreskokCatalog(catalog)
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, serialized)
}

export async function checkPreskokCatalog({
  workspaceRoot,
  outputPath,
}: CatalogFileOptions) {
  const catalog = await generatePreskokCatalog({ workspaceRoot })
  const expected = serializePreskokCatalog(catalog)
  try {
    return (await fs.readFile(outputPath, "utf8")) === expected
  } catch (error) {
    if (isMissingFileError(error)) {
      return false
    }
    throw error
  }
}

export function serializePreskokCatalog(catalog: PreskokCatalog) {
  return `${JSON.stringify(catalog, null, 2)}\n`
}

function isMissingFileError(cause: unknown): cause is NodeJS.ErrnoException {
  return cause instanceof Error && "code" in cause && cause.code === "ENOENT"
}

async function createComponent({
  item,
  examples,
  documentation,
  figma,
  workspaceRoot,
}: {
  item: RegistryItem
  examples: Array<RegistryItem>
  documentation: ComponentDocumentation | null
  figma: FigmaComponentCoverage | undefined
  workspaceRoot: string
}): Promise<PreskokComponent> {
  const files = item.files ?? []
  const parsedSources = await Promise.all(
    files
      .filter((file) => /\.[cm]?[jt]sx?$/.test(file.path))
      .map(async (file) => {
        const sourcePath = path.join(workspaceRoot, appRelativePath, file.path)
        const source = await fs.readFile(sourcePath, "utf8")
        return parseSource(source, sourcePath)
      })
  )
  const parsed = mergeParsedSources(parsedSources)

  return {
    name: item.name,
    registryName: `@preskok/${item.name}`,
    description: item.description ?? null,
    importPath: getImportPath(files),
    sourceFiles: files.map((file) => path.join(appRelativePath, file.path)),
    dependencies: sortedUnique(item.dependencies ?? []),
    registryDependencies: sortedUnique(
      (item.registryDependencies ?? []).map(normalizeRegistryDependency)
    ),
    exports: parsed.exports,
    declarations: parsed.declarations,
    variants: parsed.variants,
    tokens: parsed.tokens,
    slots: parsed.slots,
    documentation,
    examples: findExamples(item.name, examples),
    figma: requireFigmaCoverage(item.name, figma),
  }
}

function requireFigmaCoverage(
  componentName: string,
  coverage: FigmaComponentCoverage | undefined
) {
  if (!coverage) {
    throw new Error(`Figma snapshot is missing component ${componentName}`)
  }
  return coverage
}

function getImportPath(files: Array<RegistryFile>) {
  const primaryFile =
    files.find((file) => file.type === "registry:ui") ?? files[0]
  if (!primaryFile) {
    return `@/components/ui/preskok-ui`
  }

  const basename = path.basename(
    primaryFile.path,
    path.extname(primaryFile.path)
  )
  return `@/components/ui/preskok-ui/${basename}`
}

function parseSource(source: string, sourcePath: string): ParsedSource {
  const sourceFile = ts.createSourceFile(
    sourcePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    sourcePath.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  )
  const exports = new Set<string>()
  const declarations: Array<ComponentDeclaration> = []
  const variants = new Map<
    string,
    { values: Set<string>; defaultValue: string | null }
  >()

  for (const statement of sourceFile.statements) {
    collectExport(statement, exports)
    collectDeclaration(statement, sourceFile, declarations)
  }

  walk(sourceFile, (node) => {
    if (!ts.isPropertyAssignment(node)) {
      return
    }

    const propertyName = getPropertyName(node.name)
    if (
      propertyName === "variants" &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      collectVariants(node.initializer, variants)
    }
    if (
      propertyName === "defaultVariants" &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      collectVariantDefaults(node.initializer, variants)
    }
  })

  return {
    exports: [...exports].sort(),
    declarations,
    variants: Object.fromEntries(
      [...variants.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([name, variant]) => [
          name,
          {
            values: [...variant.values],
            defaultValue: variant.defaultValue,
          },
        ])
    ),
    tokens: sortedUnique(
      [...source.matchAll(/var\(\s*(--[\w-]+)/g)].map((match) => match[1]!)
    ),
    slots: sortedUnique(
      [...source.matchAll(/data-slot=["']([^"']+)["']/g)].map(
        (match) => match[1]!
      )
    ),
  }
}

function collectExport(statement: ts.Statement, exports: Set<string>) {
  if (ts.isExportDeclaration(statement) && statement.exportClause) {
    if (ts.isNamedExports(statement.exportClause)) {
      for (const element of statement.exportClause.elements) {
        exports.add(element.name.text)
      }
    }
    return
  }

  if (!hasExportModifier(statement)) {
    return
  }

  if (ts.isVariableStatement(statement)) {
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name)) {
        exports.add(declaration.name.text)
      }
    }
    return
  }

  if (
    (ts.isFunctionDeclaration(statement) ||
      ts.isClassDeclaration(statement) ||
      ts.isInterfaceDeclaration(statement) ||
      ts.isTypeAliasDeclaration(statement)) &&
    statement.name
  ) {
    exports.add(statement.name.text)
  }
}

function collectDeclaration(
  statement: ts.Statement,
  sourceFile: ts.SourceFile,
  declarations: Array<ComponentDeclaration>
) {
  if (
    ts.isInterfaceDeclaration(statement) &&
    /Props$/.test(statement.name.text)
  ) {
    declarations.push({
      name: statement.name.text,
      kind: "interface",
      declaration: statement.getText(sourceFile),
    })
  }

  if (
    ts.isTypeAliasDeclaration(statement) &&
    /Props$/.test(statement.name.text)
  ) {
    declarations.push({
      name: statement.name.text,
      kind: "type",
      declaration: statement.getText(sourceFile),
    })
  }
}

function collectVariants(
  object: ts.ObjectLiteralExpression,
  variants: Map<string, { values: Set<string>; defaultValue: string | null }>
) {
  for (const property of object.properties) {
    if (
      !ts.isPropertyAssignment(property) ||
      !ts.isObjectLiteralExpression(property.initializer)
    ) {
      continue
    }
    const name = getPropertyName(property.name)
    if (!name) {
      continue
    }
    const values = property.initializer.properties
      .map((value) => getObjectPropertyName(value))
      .filter((value): value is string => Boolean(value))
    const current = variants.get(name) ?? {
      values: new Set<string>(),
      defaultValue: null,
    }
    for (const value of values) {
      current.values.add(value)
    }
    variants.set(name, current)
  }
}

function collectVariantDefaults(
  object: ts.ObjectLiteralExpression,
  variants: Map<string, { values: Set<string>; defaultValue: string | null }>
) {
  for (const property of object.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue
    }
    const name = getPropertyName(property.name)
    if (!name) {
      continue
    }
    const current = variants.get(name) ?? {
      values: new Set<string>(),
      defaultValue: null,
    }
    current.defaultValue = literalText(property.initializer)
    variants.set(name, current)
  }
}

function getObjectPropertyName(property: ts.ObjectLiteralElementLike) {
  if (
    ts.isPropertyAssignment(property) ||
    ts.isShorthandPropertyAssignment(property) ||
    ts.isMethodDeclaration(property)
  ) {
    return getPropertyName(property.name)
  }
  return null
}

function getPropertyName(name: ts.PropertyName) {
  if (
    ts.isIdentifier(name) ||
    ts.isStringLiteral(name) ||
    ts.isNumericLiteral(name)
  ) {
    return name.text
  }
  return null
}

function literalText(node: ts.Expression) {
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
    return node.text
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return "true"
  }
  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return "false"
  }
  return node.getText()
}

function hasExportModifier(node: ts.Node) {
  return Boolean(
    ts.canHaveModifiers(node) &&
    ts
      .getModifiers(node)
      ?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
  )
}

function walk(node: ts.Node, visitor: (node: ts.Node) => void) {
  visitor(node)
  node.forEachChild((child) => walk(child, visitor))
}

function mergeParsedSources(sources: Array<ParsedSource>): ParsedSource {
  const variants = new Map<string, ComponentVariant>()
  for (const source of sources) {
    for (const [name, variant] of Object.entries(source.variants)) {
      const current = variants.get(name)
      variants.set(name, {
        values: unique([...(current?.values ?? []), ...variant.values]),
        defaultValue: variant.defaultValue ?? current?.defaultValue ?? null,
      })
    }
  }

  return {
    exports: sortedUnique(sources.flatMap((source) => source.exports)),
    declarations: dedupeDeclarations(
      sources.flatMap((source) => source.declarations)
    ),
    variants: Object.fromEntries(
      [...variants.entries()].sort(([left], [right]) =>
        left.localeCompare(right)
      )
    ),
    tokens: sortedUnique(sources.flatMap((source) => source.tokens)),
    slots: sortedUnique(sources.flatMap((source) => source.slots)),
  }
}

function dedupeDeclarations(declarations: Array<ComponentDeclaration>) {
  return [
    ...new Map(
      declarations.map((declaration) => [
        `${declaration.kind}:${declaration.name}`,
        declaration,
      ])
    ).values(),
  ]
}

function findExamples(
  componentName: string,
  examples: Array<RegistryItem>
): Array<ComponentExample> {
  return examples
    .filter((example) => {
      const dependencies = (example.registryDependencies ?? []).map(
        normalizeRegistryDependency
      )
      return (
        dependencies.includes(componentName) ||
        example.name.startsWith(`${componentName}-`)
      )
    })
    .map((example) => ({
      name: example.name,
      sourceFiles: (example.files ?? []).map((file) =>
        path.join(appRelativePath, file.path)
      ),
    }))
    .sort((left, right) => left.name.localeCompare(right.name))
}

function normalizeRegistryDependency(dependency: string) {
  const withoutQuery = dependency.split("?")[0] ?? dependency
  const basename = withoutQuery.split("/").at(-1) ?? withoutQuery
  return basename.replace(/\.json$/, "").replace(/^@preskok\//, "")
}

async function readDocumentation(workspaceRoot: string) {
  const root = path.join(workspaceRoot, documentationRelativePath)
  const files = await findFiles(root, ".mdx")
  const documentation = new Map<string, ComponentDocumentation>()

  for (const absolutePath of files) {
    const componentName = path.basename(absolutePath, ".mdx")
    if (componentName === "index") {
      continue
    }
    const source = await fs.readFile(absolutePath, "utf8")
    const relativePath = path.relative(root, absolutePath)
    const frontmatter = parseFrontmatter(source)
    documentation.set(componentName, {
      title: frontmatter.title ?? titleFromSlug(componentName),
      description: frontmatter.description ?? null,
      path: `/${relativePath
        .replace(/\.mdx$/, "")
        .split(path.sep)
        .join("/")}`,
      sourcePath: path.join(documentationRelativePath, relativePath),
      props: parsePropsTable(source),
      usage: parseUsage(source),
    })
  }

  return documentation
}

async function findFiles(
  directory: string,
  extension: string
): Promise<Array<string>> {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files: Array<string> = []
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await findFiles(entryPath, extension)))
    } else if (entry.name.endsWith(extension)) {
      files.push(entryPath)
    }
  }
  return files.sort()
}

function parseFrontmatter(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---/)
  const values: Record<string, string> = {}
  if (!match?.[1]) {
    return values
  }
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":")
    if (separator === -1) {
      continue
    }
    values[line.slice(0, separator).trim()] = line.slice(separator + 1).trim()
  }
  return values
}

function parsePropsTable(source: string): Array<DocumentationProp> {
  const section = source.match(
    /(?:^|\n)## Props\s*\n([\s\S]*?)(?=\n## |$)/
  )?.[1]
  if (!section) {
    return []
  }
  const rows = section
    .split("\n")
    .map(splitMarkdownRow)
    .filter((row) => row.length >= 4)
  if (rows.length < 3) {
    return []
  }

  return rows.slice(2).map((row) => ({
    name: cleanMarkdownCell(row[0] ?? ""),
    type: cleanMarkdownCell(row[1] ?? ""),
    defaultValue: nullableCell(row[2] ?? ""),
    description: cleanMarkdownCell(row[3] ?? ""),
  }))
}

function splitMarkdownRow(line: string) {
  if (!line.trim().startsWith("|")) {
    return []
  }
  const cells: Array<string> = []
  let current = ""
  let escaped = false
  for (const character of line.trim().slice(1, -1)) {
    if (character === "|" && !escaped) {
      cells.push(current.trim())
      current = ""
    } else {
      current += character
    }
    escaped = character === "\\" && !escaped
    if (character !== "\\") {
      escaped = false
    }
  }
  cells.push(current.trim())
  return cells
}

function cleanMarkdownCell(value: string) {
  return value
    .replaceAll("\\|", "|")
    .replace(/`([^`]*)`/g, "$1")
    .trim()
}

function nullableCell(value: string) {
  const cleaned = cleanMarkdownCell(value)
  if (!cleaned || cleaned === "-") {
    return null
  }
  return cleaned
}

function parseUsage(source: string) {
  const section = source.match(
    /(?:^|\n)## Usage\s*\n([\s\S]*?)(?=\n## |$)/
  )?.[1]
  if (!section) {
    return null
  }
  return section.match(/```(?:tsx?|jsx?)\n([\s\S]*?)```/)?.[1]?.trim() ?? null
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ")
}

async function readFigmaSnapshot(workspaceRoot: string) {
  const source = await fs.readFile(
    path.join(workspaceRoot, figmaSnapshotRelativePath),
    "utf8"
  )
  return JSON.parse(source) as FigmaSnapshot
}

async function readFigmaPropertiesSnapshot(workspaceRoot: string) {
  const source = await fs.readFile(
    path.join(workspaceRoot, figmaPropertiesSnapshotRelativePath),
    "utf8"
  )
  return JSON.parse(source) as FigmaPropertySnapshot
}

async function readFigmaSourceSnapshot(workspaceRoot: string) {
  const source = await fs.readFile(
    path.join(workspaceRoot, figmaSourceSnapshotRelativePath),
    "utf8"
  )
  return JSON.parse(source) as FigmaSourceSnapshot
}

function validateFigmaSourceSnapshots(
  librarySnapshot: FigmaSnapshot,
  propertySnapshot: FigmaPropertySnapshot,
  sourceSnapshot: FigmaSourceSnapshot
) {
  const expectedFileKey = sourceSnapshot.fileKey
  const expectedLibraryKey = sourceSnapshot.library.libraryKey
  for (const snapshot of [librarySnapshot, propertySnapshot]) {
    if (snapshot.contextFileKey !== expectedFileKey) {
      throw new Error(
        `Figma snapshot file key ${snapshot.contextFileKey} does not match source ${expectedFileKey}`
      )
    }
    if (snapshot.library.libraryKey !== expectedLibraryKey) {
      throw new Error(
        `Figma snapshot library key ${snapshot.library.libraryKey} does not match source ${expectedLibraryKey}`
      )
    }
  }
}

function enrichFigmaCoverage(
  coverageByComponent: Record<string, FigmaComponentCoverage>,
  snapshot: FigmaPropertySnapshot
) {
  const propertiesByKey = new Map(
    snapshot.assets.map((asset) => [asset.componentKey, asset])
  )
  const missingKeys = new Set<string>()
  const enriched = Object.fromEntries(
    Object.entries(coverageByComponent).map(([componentName, coverage]) => [
      componentName,
      {
        ...coverage,
        assets: coverage.assets.map((asset) => {
          const live = propertiesByKey.get(asset.componentKey)
          if (!live) {
            missingKeys.add(asset.componentKey)
            return asset
          }
          return {
            ...asset,
            liveName: live.actualName,
            liveDescription: live.description,
            propertyDefinitions: live.properties,
            variantCount: live.variantCount,
          }
        }),
      },
    ])
  ) as Record<string, FigmaComponentCoverage>

  if (missingKeys.size > 0) {
    throw new Error(
      `Figma property snapshot is missing mapped keys: ${[...missingKeys]
        .sort()
        .join(", ")}`
    )
  }
  return enriched
}

function countFigmaCoverage(components: Array<PreskokComponent>) {
  const coverage = {
    verified: 0,
    partial: 0,
    missing: 0,
    notApplicable: 0,
  }
  for (const component of components) {
    if (component.figma.status === "not_applicable") {
      coverage.notApplicable++
    } else {
      coverage[component.figma.status]++
    }
  }
  return coverage
}

function validateFigmaFallbacks(components: Array<PreskokComponent>) {
  const byName = new Map(
    components.map((component) => [component.name, component])
  )
  for (const component of components) {
    for (const fallbackName of component.figma.fallbackComponents ?? []) {
      const fallback = byName.get(fallbackName)
      if (!fallback) {
        throw new Error(
          `Figma fallback ${fallbackName} for ${component.name} is not a registry component`
        )
      }
      if (fallback.figma.assets.length === 0) {
        throw new Error(
          `Figma fallback ${fallbackName} for ${component.name} has no published asset`
        )
      }
    }
  }
}

async function readTokens(
  workspaceRoot: string,
  components: Array<PreskokComponent>
): Promise<Array<DesignToken>> {
  const absolutePath = path.join(workspaceRoot, tokenRelativePath)
  const source = await fs.readFile(absolutePath, "utf8")
  const theme = parseCssVariables(readCssBlock(source, "@theme inline"))
  const light = parseCssVariables(readCssBlock(source, ":root"))
  const dark = parseCssVariables(readCssBlock(source, ".dark"))
  const aliasesByToken = new Map<string, Array<string>>()

  for (const [alias, value] of Object.entries(theme)) {
    const target = value.match(/^var\((--[\w-]+)\)$/)?.[1]
    if (!target) {
      continue
    }
    const aliases = aliasesByToken.get(target) ?? []
    aliases.push(alias)
    aliasesByToken.set(target, aliases)
  }

  return sortedUnique([...Object.keys(light), ...Object.keys(dark)]).map(
    (name) => {
      const lightValue = light[name] ?? dark[name] ?? ""
      const darkValue = dark[name] ?? lightValue
      const aliases = sortedUnique(aliasesByToken.get(name) ?? [])
      const names = new Set([name, ...aliases])
      return {
        name,
        kind: classifyToken(name, lightValue),
        values: {
          light: lightValue,
          dark: darkValue,
        },
        aliases,
        usedBy: components
          .filter((component) =>
            component.tokens.some((token) => names.has(token))
          )
          .map((component) => component.name),
        sourcePath: tokenRelativePath,
      }
    }
  )
}

function readCssBlock(source: string, selector: string) {
  const selectorIndex = source.indexOf(selector)
  if (selectorIndex === -1) {
    throw new Error(`Could not find CSS block ${selector}`)
  }
  const openBrace = source.indexOf("{", selectorIndex)
  if (openBrace === -1) {
    throw new Error(`Could not find opening brace for CSS block ${selector}`)
  }
  let depth = 0
  for (let index = openBrace; index < source.length; index++) {
    const character = source[index]
    if (character === "{") {
      depth++
    } else if (character === "}") {
      depth--
      if (depth === 0) {
        return source.slice(openBrace + 1, index)
      }
    }
  }
  throw new Error(`Could not find closing brace for CSS block ${selector}`)
}

function parseCssVariables(block: string) {
  return Object.fromEntries(
    [...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [
      match[1]!,
      match[2]!.trim().replace(/\s+/g, " "),
    ])
  )
}

function classifyToken(name: string, value: string): DesignToken["kind"] {
  if (/font/.test(name)) {
    return "font"
  }
  if (
    /oklch|rgba?|hsla?|#[\da-f]{3,8}/i.test(value) ||
    /(?:color|background|foreground|border|ring|overlay|accent|muted|primary|secondary|warning|danger|destructive|card|popover|sidebar|navbar|surface|selection|chart|shiki)/.test(
      name
    )
  ) {
    return "color"
  }
  if (
    /radius|breakpoint|width|height|spacing/.test(name) ||
    /(?:rem|px|vw|vh|calc\()/.test(value)
  ) {
    return "dimension"
  }
  return "other"
}

function sortedUnique(values: Array<string>) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right))
}

function unique(values: Array<string>) {
  return [...new Set(values)]
}
