/**
 * Cloudflare Workers adapter for the RepairShopr MCP Server.
 *
 * Routes:
 * - POST /mcp  -> MCP protocol handler
 * - GET /health -> Health check
 * - *          -> 404
 *
 * Secrets are read from Cloudflare Worker environment bindings:
 * - REPAIRSHOPR_API_KEY
 * - REPAIRSHOPR_SUBDOMAIN (optional)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { randomUUID } from "node:crypto";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

interface Env {
  REPAIRSHOPR_API_KEY: string;
  REPAIRSHOPR_SUBDOMAIN?: string;
  AUTH_MODE?: string;
}

/**
 * Create a health check response
 */
function healthResponse(env: Env): Response {
  return new Response(
    JSON.stringify({
      status: "ok",
      transport: "http",
      authMode: env.AUTH_MODE === "gateway" ? "gateway" : "env",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

/**
 * Create a 404 response
 */
function notFoundResponse(): Response {
  return new Response(
    JSON.stringify({ error: "Not found", endpoints: ["/mcp", "/health"] }),
    {
      status: 404,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/health") {
      return healthResponse(env);
    }

    // MCP endpoint
    if (url.pathname === "/mcp") {
      // Inject credentials into the global scope for the RepairShopr client
      // In Workers, we use globalThis since process.env is not available
      (globalThis as Record<string, unknown>).__REPAIRSHOPR_API_KEY =
        env.REPAIRSHOPR_API_KEY;
      (globalThis as Record<string, unknown>).__REPAIRSHOPR_SUBDOMAIN =
        env.REPAIRSHOPR_SUBDOMAIN;

      // For gateway mode, check headers
      if (env.AUTH_MODE === "gateway") {
        const apiKey = request.headers.get("x-repairshopr-api-key");
        if (!apiKey) {
          return new Response(
            JSON.stringify({
              error: "Missing credentials",
              message: "Gateway mode requires X-RepairShopr-API-Key header",
              required: ["X-RepairShopr-API-Key"],
              optional: ["X-RepairShopr-Subdomain"],
            }),
            {
              status: 401,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
        (globalThis as Record<string, unknown>).__REPAIRSHOPR_API_KEY = apiKey;
        const subdomain = request.headers.get("x-repairshopr-subdomain");
        if (subdomain) {
          (globalThis as Record<string, unknown>).__REPAIRSHOPR_SUBDOMAIN =
            subdomain;
        }
      }

      // Create a minimal MCP server for this request
      const server = new Server(
        { name: "repairshopr-mcp", version: "1.0.0" },
        { capabilities: { tools: {} } }
      );

      // Register minimal handlers for the worker context
      server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
          tools: [
            {
              name: "repairshopr_navigate",
              description: "Navigate to a RepairShopr domain to access its tools.",
              inputSchema: {
                type: "object",
                properties: {
                  domain: {
                    type: "string",
                    description: "The domain to navigate to",
                  },
                },
                required: ["domain"],
              },
            },
          ],
        };
      });

      server.setRequestHandler(CallToolRequestSchema, async (request) => {
        return {
          content: [
            {
              type: "text",
              text: `Tool ${request.params.name} called in worker context`,
            },
          ],
        };
      });

      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        enableJsonResponse: true,
      });

      await server.connect(transport);

      // Convert the Workers Request to a Node-compatible request for the transport
      // StreamableHTTPServerTransport expects Node IncomingMessage/ServerResponse,
      // so we need to handle this at the framework level
      return new Response(
        JSON.stringify({
          error: "Worker MCP transport requires framework adapter",
          message:
            "Use the Node.js HTTP transport for full MCP functionality. " +
            "Worker support requires an adapter layer for StreamableHTTPServerTransport.",
        }),
        {
          status: 501,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return notFoundResponse();
  },
};
