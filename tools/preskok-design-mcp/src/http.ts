import {
  hostHeaderValidation,
  originValidation,
  toNodeHandler,
} from "@modelcontextprotocol/node"
import { createMcpHandler } from "@modelcontextprotocol/server"
import {
  createServer,
  type IncomingMessage,
  type Server as HttpServer,
  type ServerResponse,
} from "node:http"

import { loadPreskokDesignSystem } from "./design-system.js"
import { createPreskokMcpServer } from "./mcp/server.js"

export type HttpServerOptions = {
  host?: string
  port?: number
  onError?: (error: Error) => void
}

export type RunningHttpServer = {
  server: HttpServer
  url: URL
  close(): Promise<void>
}

export async function startPreskokHttpServer({
  host = "127.0.0.1",
  port = 3333,
  onError = (error) => console.error(error),
}: HttpServerOptions = {}): Promise<RunningHttpServer> {
  const designSystem = await loadPreskokDesignSystem()
  const handler = createMcpHandler(() => createPreskokMcpServer(designSystem), {
    legacy: "stateless",
    responseMode: "auto",
    onerror: onError,
  })
  const nodeHandler = toNodeHandler(handler, { onerror: onError })
  const allowedHosts = uniqueStrings([host, "localhost", "127.0.0.1", "[::1]"])
  const validateHost = hostHeaderValidation(allowedHosts)
  const validateOrigin = originValidation(allowedHosts)

  const handleRequest = async (
    request: IncomingMessage,
    response: ServerResponse
  ) => {
    const requestUrl = new URL(request.url ?? "/", `http://${host}`)
    if (requestUrl.pathname === "/healthz") {
      response.writeHead(200, { "content-type": "application/json" })
      response.end(JSON.stringify({ status: "ok" }))
      return
    }
    if (requestUrl.pathname !== "/mcp") {
      response.writeHead(404, { "content-type": "text/plain" })
      response.end("Not found")
      return
    }
    if (
      !validateHost(request, response) ||
      !validateOrigin(request, response)
    ) {
      return
    }
    await nodeHandler(request as Parameters<typeof nodeHandler>[0], response)
  }
  const server = createServer((request, response) => {
    void handleRequest(request, response).catch((cause: unknown) => {
      const reported = cause instanceof Error ? cause : new Error(String(cause))
      onError(reported)
      if (!response.headersSent) {
        response.writeHead(500, { "content-type": "text/plain" })
      }
      if (!response.writableEnded) {
        response.end("Internal server error")
      }
    })
  })

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject)
    server.listen(port, host, () => {
      server.off("error", reject)
      resolve()
    })
  })
  const address = server.address()
  if (!address || !(address instanceof Object)) {
    await closeNodeServer(server)
    await handler.close()
    throw new Error("Could not determine the Preskok MCP HTTP address")
  }
  const urlHost = host.includes(":") ? `[${host}]` : host
  const url = new URL(`http://${urlHost}:${address.port}/mcp`)

  return {
    server,
    url,
    async close() {
      await handler.close()
      await closeNodeServer(server)
    },
  }
}

function closeNodeServer(server: HttpServer) {
  return new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  })
}

function uniqueStrings(values: Array<string>) {
  return [...new Set(values)]
}
