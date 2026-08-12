import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { startPreskokHttpServer, type RunningHttpServer } from "../src/http.js"

describe("Preskok Design MCP over Streamable HTTP", () => {
  let running: RunningHttpServer
  let client: Client

  beforeEach(async () => {
    running = await startPreskokHttpServer({ port: 0 })
    client = new Client({ name: "preskok-http-test", version: "1.0.0" })
    await client.connect(new StreamableHTTPClientTransport(running.url))
  })

  afterEach(async () => {
    await client.close()
    await running.close()
  })

  it("negotiates and executes the same generated contract", async () => {
    const status = await client.callTool({
      name: "get_preskok_status",
      arguments: {},
    })
    expect(status.structuredContent).toMatchObject({
      status: {
        components: { total: 96 },
        figma: { verified: 81, partial: 11, missing: 3, notApplicable: 1 },
      },
    })

    const workflow = await client.callTool({
      name: "get_preskok_workflow",
      arguments: { name: "web_app_to_figma" },
    })
    expect(workflow.structuredContent).toMatchObject({
      workflow: {
        verification: expect.arrayContaining([
          expect.objectContaining({ kind: "figma" }),
          expect.objectContaining({ kind: "visual" }),
        ]),
      },
    })

    const planned = await client.callTool({
      name: "plan_preskok_design",
      arguments: {
        intent: "Primary account action",
        figmaStrategy: "published",
        theme: { style: "Default", mode: "Light" },
        requirements: [{ codeName: "button" }],
      },
    })
    const plan = (
      planned.structuredContent as {
        plan: {
          source: {
            libraryKey: string
            collections: {
              style: { key: string }
              colorMode: { key: string }
            }
          }
          requirements: Array<{ assetName: string; componentKey: string }>
        }
      }
    ).plan
    const requirement = plan.requirements[0]
    if (!requirement) throw new Error("Expected an HTTP plan requirement")

    const finalized = await client.callTool({
      name: "finalize_preskok_design",
      arguments: {
        plan,
        evidence: {
          fileKey: "http-proof-file",
          rootNodeId: "900:1",
          enabledLibraryKeys: [plan.source.libraryKey],
          instances: [
            {
              nodeId: "900:2",
              name: "Primary action",
              assetName: requirement.assetName,
              componentKey: requirement.componentKey,
              remote: true,
              detached: false,
              properties: { Intent: "primary" },
            },
          ],
          manualNodes: [],
          localComponents: [],
          modes: [
            {
              collectionName: "Style",
              collectionKey: plan.source.collections.style.key,
              mode: "Default",
              explicit: true,
              remote: true,
            },
            {
              collectionName: "Mode",
              collectionKey: plan.source.collections.colorMode.key,
              mode: "Light",
              explicit: true,
              remote: true,
            },
          ],
          hardcodedValues: [],
        },
      },
    })
    expect(finalized.structuredContent).toMatchObject({
      finalization: {
        ready: true,
        coverage: { requiredInstances: 1, satisfiedInstances: 1 },
      },
    })
  })

  it("exposes a health check without weakening the MCP route", async () => {
    const healthUrl = new URL("/healthz", running.url)
    const health = await fetch(healthUrl)
    expect(health.status).toBe(200)
    await expect(health.json()).resolves.toEqual({ status: "ok" })

    const missing = await fetch(new URL("/not-mcp", running.url))
    expect(missing.status).toBe(404)

    const invalidOrigin = await fetch(running.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://attacker.example",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" }),
    })
    expect(invalidOrigin.status).toBe(403)
  })
})
