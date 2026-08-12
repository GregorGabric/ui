#!/usr/bin/env node

import { serveStdio } from "@modelcontextprotocol/server/stdio"

import { startPreskokHttpServer } from "./http.js"
import { createPreskokMcpServer } from "./mcp/server.js"

const arguments_ = process.argv.slice(2)
const http = arguments_.includes("--http")

if (http) {
  const host =
    readArgument("--host") ?? process.env.PRESKOK_MCP_HOST ?? "127.0.0.1"
  const portValue =
    readArgument("--port") ?? process.env.PRESKOK_MCP_PORT ?? "3333"
  const port = Number.parseInt(portValue, 10)
  if (!Number.isInteger(port) || port < 0 || port > 65_535) {
    throw new Error(`Invalid --port value: ${portValue}`)
  }
  const running = await startPreskokHttpServer({
    host,
    port,
    onError: reportError,
  })
  console.error(`Preskok Design MCP listening at ${running.url.href}`)
  installSignalHandlers(() => running.close())
} else {
  const handle = serveStdio(() => createPreskokMcpServer(), {
    onerror: reportError,
  })
  installSignalHandlers(() => handle.close())
}

function readArgument(name: string) {
  const index = arguments_.indexOf(name)
  if (index === -1) {
    return undefined
  }
  const value = arguments_[index + 1]
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value after ${name}`)
  }
  return value
}

function installSignalHandlers(close: () => Promise<void>) {
  const shutdown = async () => {
    await close()
    process.exitCode = 0
  }
  const requestShutdown = () => {
    void shutdown().catch(reportError)
  }
  process.once("SIGINT", requestShutdown)
  process.once("SIGTERM", requestShutdown)
}

function reportError(error: Error) {
  console.error(`[preskok-design-mcp] ${error.stack ?? error.message}`)
}
