#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { WebClient } from "@slack/web-api";
import fs from "fs";
import path from "path";
import os from "os";
import http from "http";
import open from "open";

const CONFIG_DIR = path.join(os.homedir(), ".config", "slack-mcp");
const TOKEN_FILE = path.join(CONFIG_DIR, "token.json");
const OAUTH_PORT = 9876;
const REDIRECT_URI = `http://localhost:${OAUTH_PORT}/callback`;

const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID;
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

// Token management
function loadToken() {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const data = JSON.parse(fs.readFileSync(TOKEN_FILE, "utf-8"));
      return data.access_token;
    }
  } catch (error) {
    console.error("Failed to load token:", error.message);
  }
  return null;
}

function saveToken(tokenData) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
}

// OAuth flow
async function performOAuth() {
  return new Promise((resolve, reject) => {
    const scopes = [
      "channels:history",
      "channels:read",
      "groups:history",
      "groups:read",
      "im:history",
      "im:read",
      "mpim:history",
      "mpim:read",
      "users:read",
      "chat:write",
      "reactions:write",
    ].join(",");

    const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=${scopes}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, `http://localhost:${OAUTH_PORT}`);

      if (url.pathname === "/callback") {
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");

        if (error) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end(`<html><body><h1>Authentication Failed</h1><p>${error}</p></body></html>`);
          server.close();
          reject(new Error(error));
          return;
        }

        if (code) {
          try {
            // Exchange code for token
            const tokenResponse = await fetch("https://slack.com/api/oauth.v2.access", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                client_id: SLACK_CLIENT_ID,
                client_secret: SLACK_CLIENT_SECRET,
                code,
                redirect_uri: REDIRECT_URI,
              }),
            });

            const tokenData = await tokenResponse.json();

            if (tokenData.ok) {
              saveToken(tokenData);
              res.writeHead(200, { "Content-Type": "text/html" });
              res.end(`
                <html>
                  <body style="font-family: system-ui; text-align: center; padding: 50px;">
                    <h1>Authentication Successful!</h1>
                    <p>Slack MCP Server is now connected to your workspace.</p>
                    <p>You can close this window.</p>
                  </body>
                </html>
              `);
              server.close();
              resolve(tokenData.access_token);
            } else {
              throw new Error(tokenData.error || "Token exchange failed");
            }
          } catch (err) {
            res.writeHead(500, { "Content-Type": "text/html" });
            res.end(`<html><body><h1>Error</h1><p>${err.message}</p></body></html>`);
            server.close();
            reject(err);
          }
        }
      }
    });

    server.listen(OAUTH_PORT, () => {
      console.error(`Opening browser for Slack authentication...`);
      console.error(`If browser doesn't open, visit: ${authUrl}`);
      open(authUrl);
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error("OAuth timeout"));
    }, 5 * 60 * 1000);
  });
}

// Initialize Slack client
async function getSlackClient() {
  let token = loadToken();

  if (!token) {
    if (!SLACK_CLIENT_ID || !SLACK_CLIENT_SECRET) {
      throw new Error(
        "SLACK_CLIENT_ID and SLACK_CLIENT_SECRET environment variables are required for OAuth"
      );
    }
    token = await performOAuth();
  }

  return new WebClient(token);
}

// MCP Server
const server = new Server(
  { name: "slack-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

let slackClient = null;

// Tool definitions
const tools = [
  {
    name: "slack_list_channels",
    description: "List all channels in the workspace",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Maximum number of channels to return", default: 100 },
      },
    },
  },
  {
    name: "slack_get_channel_history",
    description: "Get message history from a channel",
    inputSchema: {
      type: "object",
      properties: {
        channel_id: { type: "string", description: "Channel ID" },
        limit: { type: "number", description: "Number of messages to fetch", default: 20 },
      },
      required: ["channel_id"],
    },
  },
  {
    name: "slack_post_message",
    description: "Post a message to a channel",
    inputSchema: {
      type: "object",
      properties: {
        channel_id: { type: "string", description: "Channel ID" },
        text: { type: "string", description: "Message text" },
      },
      required: ["channel_id", "text"],
    },
  },
  {
    name: "slack_get_users",
    description: "List all users in the workspace",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Maximum number of users to return", default: 100 },
      },
    },
  },
  {
    name: "slack_get_unread",
    description: "Get unread messages and mentions",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "slack_add_reaction",
    description: "Add a reaction to a message",
    inputSchema: {
      type: "object",
      properties: {
        channel_id: { type: "string", description: "Channel ID" },
        timestamp: { type: "string", description: "Message timestamp" },
        emoji: { type: "string", description: "Emoji name (without colons)" },
      },
      required: ["channel_id", "timestamp", "emoji"],
    },
  },
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (!slackClient) {
    slackClient = await getSlackClient();
  }

  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "slack_list_channels": {
        const result = await slackClient.conversations.list({
          limit: args?.limit || 100,
          types: "public_channel,private_channel",
        });
        return {
          content: [{ type: "text", text: JSON.stringify(result.channels, null, 2) }],
        };
      }

      case "slack_get_channel_history": {
        const result = await slackClient.conversations.history({
          channel: args.channel_id,
          limit: args?.limit || 20,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(result.messages, null, 2) }],
        };
      }

      case "slack_post_message": {
        const result = await slackClient.chat.postMessage({
          channel: args.channel_id,
          text: args.text,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "slack_get_users": {
        const result = await slackClient.users.list({
          limit: args?.limit || 100,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(result.members, null, 2) }],
        };
      }

      case "slack_get_unread": {
        // Get conversations with unread messages
        const conversations = await slackClient.conversations.list({
          types: "public_channel,private_channel,im,mpim",
        });

        const unreadChannels = [];
        for (const channel of conversations.channels || []) {
          if (channel.is_member && channel.unread_count > 0) {
            const history = await slackClient.conversations.history({
              channel: channel.id,
              limit: channel.unread_count,
            });
            unreadChannels.push({
              channel: channel.name || channel.id,
              unread_count: channel.unread_count,
              messages: history.messages,
            });
          }
        }

        return {
          content: [{ type: "text", text: JSON.stringify(unreadChannels, null, 2) }],
        };
      }

      case "slack_add_reaction": {
        const result = await slackClient.reactions.add({
          channel: args.channel_id,
          timestamp: args.timestamp,
          name: args.emoji,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Slack MCP Server running on stdio");
}

main().catch(console.error);
