#!/usr/bin/env node
/**
 * halalscreener-mcp — local stdio MCP server for HalalScreener.
 *
 * This is a THIN PROXY. It contains NO screening logic and NO secrets: it reads
 * your own API key from the HALALSCREENER_API_KEY environment variable and
 * forwards every tool call to the hosted HalalScreener MCP over HTTPS. All
 * compliance logic, gating, and metering stay server-side.
 *
 * Usage (e.g. in Claude Desktop / Cursor mcp config):
 *   command: "npx"
 *   args: ["-y", "halalscreener-mcp"]
 *   env: { "HALALSCREENER_API_KEY": "hs_live_..." }
 *
 * Get a key: https://halalscreener.app/en/mcp
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_KEY = process.env.HALALSCREENER_API_KEY;
const ENDPOINT = process.env.HALALSCREENER_MCP_URL || "https://halalscreener.app/api/mcp/mcp";

if (!API_KEY) {
  console.error(
    "[halalscreener-mcp] Missing HALALSCREENER_API_KEY environment variable.\n" +
      "Get a free key at https://halalscreener.app/en/mcp and set it in your MCP client config."
  );
  process.exit(1);
}

async function main() {
  // 1. Connect to the hosted HalalScreener MCP as a client (Bearer auth).
  const remote = new Client({ name: "halalscreener-mcp-proxy", version: "1.0.0" }, { capabilities: {} });
  const transport = new StreamableHTTPClientTransport(new URL(ENDPOINT), {
    requestInit: { headers: { Authorization: `Bearer ${API_KEY}` } },
  });
  await remote.connect(transport);

  // 2. Expose a local stdio server that forwards everything to the remote.
  const server = new Server(
    { name: "halalscreener", version: "1.0.0" },
    { capabilities: { tools: {}, resources: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => remote.listTools());
  server.setRequestHandler(CallToolRequestSchema, async (req) =>
    remote.callTool(req.params)
  );
  server.setRequestHandler(ListResourcesRequestSchema, async () => remote.listResources());
  server.setRequestHandler(ReadResourceRequestSchema, async (req) =>
    remote.readResource(req.params)
  );

  await server.connect(new StdioServerTransport());

  // Clean shutdown.
  const shutdown = async () => {
    try {
      await transport.close();
    } catch {
      /* ignore */
    }
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("[halalscreener-mcp] Fatal error:", err?.message || err);
  process.exit(1);
});
