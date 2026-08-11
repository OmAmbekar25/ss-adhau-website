#!/usr/bin/env node
/**
 * Aimfox MCP server.
 *
 * Exposes the Aimfox LinkedIn outreach API (https://docs.aimfox.com) as MCP
 * tools over stdio: accounts, campaigns, leads, conversations, labels, notes,
 * templates, custom variables, blacklists, and webhooks.
 *
 * Configuration (environment variables):
 *   AIMFOX_API_KEY   required — API key from the Aimfox Integrations page
 *   AIMFOX_BASE_URL  optional — defaults to https://api.aimfox.com/api/v2
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { AimfoxClient, AimfoxError } from "./aimfox-client.js";

const client = new AimfoxClient({
  apiKey: process.env.AIMFOX_API_KEY,
  baseUrl: process.env.AIMFOX_BASE_URL || undefined,
});

const server = new McpServer({
  name: "aimfox",
  version: "0.1.0",
});

/** Wraps an API call so tool handlers return MCP content and API errors
 * surface as tool errors instead of crashing the server. */
function handle(fn) {
  return async (args) => {
    try {
      const result = await fn(args ?? {});
      return {
        content: [
          {
            type: "text",
            text:
              result === null || result === undefined
                ? "OK (empty response)"
                : JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const detail =
        error instanceof AimfoxError
          ? `${error.message}\n${JSON.stringify(error.body, null, 2)}`
          : String(error?.message ?? error);
      return {
        content: [{ type: "text", text: detail }],
        isError: true,
      };
    }
  };
}

const enc = encodeURIComponent;

// ---------------------------------------------------------------------------
// Accounts
// ---------------------------------------------------------------------------

server.registerTool(
  "list_accounts",
  {
    title: "List LinkedIn accounts",
    description:
      "List all LinkedIn accounts connected to the Aimfox workspace, including their IDs (needed for conversation and limit tools).",
    inputSchema: {},
  },
  handle(() => client.get("/accounts")),
);

server.registerTool(
  "get_account_limits",
  {
    title: "Get account interaction limits",
    description:
      "Get the daily interaction limits (connects, message requests, InMails) for a LinkedIn account.",
    inputSchema: {
      account_id: z.string().describe("Aimfox account ID (from list_accounts)"),
    },
  },
  handle(({ account_id }) => client.get(`/accounts/${enc(account_id)}/limits`)),
);

server.registerTool(
  "set_account_limits",
  {
    title: "Set account interaction limits",
    description:
      "Set the daily interaction limits for a LinkedIn account. All three limits must be provided.",
    inputSchema: {
      account_id: z.string().describe("Aimfox account ID"),
      connect: z.number().int().describe("Daily connection request limit"),
      message_request: z.number().int().describe("Daily message request limit"),
      inmail: z.number().int().describe("Daily InMail limit"),
    },
  },
  handle(({ account_id, connect, message_request, inmail }) =>
    client.patch(`/accounts/${enc(account_id)}/limits`, {
      connect,
      message_request,
      inmail,
    }),
  ),
);

// ---------------------------------------------------------------------------
// Campaigns
// ---------------------------------------------------------------------------

server.registerTool(
  "list_campaigns",
  {
    title: "List campaigns",
    description: "List all outreach campaigns in the Aimfox workspace.",
    inputSchema: {},
  },
  handle(() => client.get("/campaigns")),
);

server.registerTool(
  "get_campaign",
  {
    title: "Get campaign",
    description: "Get a specific Aimfox campaign by ID.",
    inputSchema: {
      campaign_id: z.string().describe("Campaign ID (from list_campaigns)"),
    },
  },
  handle(({ campaign_id }) => client.get(`/campaigns/${enc(campaign_id)}`)),
);

server.registerTool(
  "create_campaign",
  {
    title: "Create campaign",
    description: "Create a new Aimfox outreach campaign.",
    inputSchema: {
      name: z.string().describe("Campaign name"),
      type: z
        .enum(["list", "search"])
        .describe("Campaign type: 'list' (custom list) or 'search' (search-based)"),
      outreach_type: z
        .enum(["connect", "inbound"])
        .describe("Outreach type: 'connect' (connection requests) or 'inbound'"),
      audience_size: z.number().int().describe("Target audience size"),
      account_ids: z
        .array(z.string())
        .describe("LinkedIn account IDs to run the campaign from"),
    },
  },
  handle((body) => client.post("/campaigns", body)),
);

server.registerTool(
  "pause_campaign",
  {
    title: "Pause campaign",
    description: "Pause a running Aimfox campaign.",
    inputSchema: { campaign_id: z.string().describe("Campaign ID") },
  },
  handle(({ campaign_id }) =>
    client.patch(`/campaigns/${enc(campaign_id)}`, { state: "PAUSED" }),
  ),
);

server.registerTool(
  "resume_campaign",
  {
    title: "Resume campaign",
    description: "Resume a paused Aimfox campaign.",
    inputSchema: { campaign_id: z.string().describe("Campaign ID") },
  },
  handle(({ campaign_id }) =>
    client.patch(`/campaigns/${enc(campaign_id)}`, { state: "ACTIVE" }),
  ),
);

server.registerTool(
  "add_profile_to_campaign",
  {
    title: "Add profile to campaign",
    description:
      "Add a LinkedIn profile to a campaign's audience. Optionally attach per-profile custom variables (usable in message templates).",
    inputSchema: {
      campaign_id: z.string().describe("Campaign ID"),
      profile_url: z
        .string()
        .describe(
          "LinkedIn profile URL, e.g. https://www.linkedin.com/in/john-doe/",
        ),
      custom_variables: z
        .record(z.string())
        .optional()
        .describe(
          "Optional custom variables for this profile, e.g. {\"company\": \"Acme\"}",
        ),
    },
  },
  handle(({ campaign_id, profile_url, custom_variables }) =>
    custom_variables
      ? client.post(`/campaigns/${enc(campaign_id)}/audience/multiple`, {
          type: "profile_url",
          profiles: [{ profile_url, custom_variables }],
        })
      : client.post(`/campaigns/${enc(campaign_id)}/audience`, { profile_url }),
  ),
);

server.registerTool(
  "remove_profile_from_campaign",
  {
    title: "Remove profile from campaign",
    description:
      "Remove a profile from a campaign's audience, by profile URN or public identifier.",
    inputSchema: {
      campaign_id: z.string().describe("Campaign ID"),
      profile: z.string().describe("Profile URN or public identifier"),
    },
  },
  handle(({ campaign_id, profile }) =>
    client.delete(`/campaigns/${enc(campaign_id)}/audience/${enc(profile)}`),
  ),
);

// ---------------------------------------------------------------------------
// Campaign custom variables
// ---------------------------------------------------------------------------

server.registerTool(
  "get_campaign_custom_variables",
  {
    title: "Get campaign custom variables",
    description: "Get the custom variables defined for a campaign's targets.",
    inputSchema: { campaign_id: z.string().describe("Campaign ID") },
  },
  handle(({ campaign_id }) =>
    client.get(`/campaigns/${enc(campaign_id)}/custom-variables`),
  ),
);

server.registerTool(
  "get_target_custom_variables",
  {
    title: "Get target custom variables",
    description: "Get the custom variables for a specific target in a campaign.",
    inputSchema: {
      campaign_id: z.string().describe("Campaign ID"),
      target_urn: z.string().describe("Target profile URN"),
    },
  },
  handle(({ campaign_id, target_urn }) =>
    client.get(
      `/campaigns/${enc(campaign_id)}/custom-variables/${enc(target_urn)}`,
    ),
  ),
);

server.registerTool(
  "set_target_custom_variables",
  {
    title: "Set target custom variables",
    description:
      "Set custom variables for a target in a campaign (usable in message templates).",
    inputSchema: {
      campaign_id: z.string().describe("Campaign ID"),
      target_urn: z.string().describe("Target profile URN"),
      variables: z
        .record(z.string())
        .describe("Custom variables, e.g. {\"first_name\": \"Jane\"}"),
    },
  },
  handle(({ campaign_id, target_urn, variables }) =>
    client.post(`/campaigns/${enc(campaign_id)}/custom-variables`, {
      custom_variables: [{ target_urn, variables }],
    }),
  ),
);

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

server.registerTool(
  "get_lead",
  {
    title: "Get lead",
    description: "Get a lead by its Aimfox lead ID.",
    inputSchema: { lead_id: z.string().describe("Lead ID") },
  },
  handle(({ lead_id }) => client.get(`/leads/${enc(lead_id)}`)),
);

server.registerTool(
  "search_leads",
  {
    title: "Search leads",
    description:
      "Search leads in the workspace by keywords and filters. Paginated via start/count.",
    inputSchema: {
      keywords: z.string().optional().describe("Free-text search keywords"),
      start: z.number().int().optional().describe("Pagination offset (default 0)"),
      count: z.number().int().optional().describe("Page size (default 10)"),
      optimize: z
        .boolean()
        .optional()
        .describe("Let Aimfox optimize the search"),
      current_companies: z.array(z.string()).optional(),
      past_companies: z.array(z.string()).optional(),
      education: z.array(z.string()).optional(),
      interests: z.array(z.string()).optional(),
      labels: z.array(z.string()).optional().describe("Filter by label IDs"),
      languages: z.array(z.string()).optional(),
      locations: z.array(z.string()).optional(),
      origins: z.array(z.string()).optional(),
      skills: z.array(z.string()).optional(),
      lead_of: z
        .array(z.string())
        .optional()
        .describe("Filter by owning account IDs"),
    },
  },
  handle(({ start, count, ...filters }) =>
    client.post(
      "/leads:search",
      {
        keywords: filters.keywords ?? "",
        current_companies: filters.current_companies ?? [],
        past_companies: filters.past_companies ?? [],
        education: filters.education ?? [],
        interests: filters.interests ?? [],
        labels: filters.labels ?? [],
        languages: filters.languages ?? [],
        locations: filters.locations ?? [],
        origins: filters.origins ?? [],
        skills: filters.skills ?? [],
        lead_of: filters.lead_of ?? [],
        optimize: filters.optimize ?? false,
      },
      { start: start ?? 0, count: count ?? 10 },
    ),
  ),
);

server.registerTool(
  "list_recent_leads",
  {
    title: "List recent leads",
    description: "List the most recent leads across the workspace.",
    inputSchema: {},
  },
  handle(() => client.get("/analytics/recent-leads")),
);

server.registerTool(
  "get_lead_custom_variables",
  {
    title: "Get lead custom variables",
    description: "Get the custom variables of a lead for a given account.",
    inputSchema: {
      account_id: z.string().describe("Aimfox account ID"),
      lead_urn: z.string().describe("Lead profile URN"),
    },
  },
  handle(({ account_id, lead_urn }) =>
    client.get(
      `/accounts/${enc(account_id)}/leads/${enc(lead_urn)}/custom-variables`,
    ),
  ),
);

server.registerTool(
  "add_label_to_lead",
  {
    title: "Add label to lead",
    description: "Attach an existing workspace label to a lead.",
    inputSchema: {
      lead_id: z.string().describe("Lead ID"),
      label_id: z.string().describe("Label ID (from list_labels)"),
    },
  },
  handle(({ lead_id, label_id }) =>
    client.post(`/leads/${enc(lead_id)}/labels/${enc(label_id)}`),
  ),
);

server.registerTool(
  "remove_label_from_lead",
  {
    title: "Remove label from lead",
    description: "Remove a label from a lead.",
    inputSchema: {
      lead_id: z.string().describe("Lead ID"),
      label_id: z.string().describe("Label ID"),
    },
  },
  handle(({ lead_id, label_id }) =>
    client.delete(`/leads/${enc(lead_id)}/labels/${enc(label_id)}`),
  ),
);

// ---------------------------------------------------------------------------
// Lead notes
// ---------------------------------------------------------------------------

server.registerTool(
  "list_lead_notes",
  {
    title: "List lead notes",
    description: "List all notes attached to a lead.",
    inputSchema: { lead_id: z.string().describe("Lead ID") },
  },
  handle(({ lead_id }) => client.get(`/leads/${enc(lead_id)}/notes`)),
);

server.registerTool(
  "add_note_to_lead",
  {
    title: "Add note to lead",
    description: "Add a text note to a lead.",
    inputSchema: {
      lead_id: z.string().describe("Lead ID"),
      text: z.string().describe("Note text"),
    },
  },
  handle(({ lead_id, text }) =>
    client.post(`/leads/${enc(lead_id)}/notes`, { text }),
  ),
);

server.registerTool(
  "update_lead_note",
  {
    title: "Update lead note",
    description: "Update the text of an existing lead note.",
    inputSchema: {
      lead_id: z.string().describe("Lead ID"),
      note_id: z.string().describe("Note ID"),
      text: z.string().describe("New note text"),
    },
  },
  handle(({ lead_id, note_id, text }) =>
    client.patch(`/leads/${enc(lead_id)}/notes/${enc(note_id)}`, { text }),
  ),
);

server.registerTool(
  "delete_lead_note",
  {
    title: "Delete lead note",
    description: "Delete a note from a lead.",
    inputSchema: {
      lead_id: z.string().describe("Lead ID"),
      note_id: z.string().describe("Note ID"),
    },
  },
  handle(({ lead_id, note_id }) =>
    client.delete(`/leads/${enc(lead_id)}/notes/${enc(note_id)}`),
  ),
);

// ---------------------------------------------------------------------------
// Conversations
// ---------------------------------------------------------------------------

server.registerTool(
  "list_conversations",
  {
    title: "List conversations",
    description: "List all LinkedIn conversations across the workspace.",
    inputSchema: {},
  },
  handle(() => client.get("/conversations")),
);

server.registerTool(
  "get_conversation",
  {
    title: "Get conversation",
    description: "Get a conversation (with messages) for an account.",
    inputSchema: {
      account_id: z.string().describe("Aimfox account ID"),
      conversation_urn: z.string().describe("Conversation URN"),
    },
  },
  handle(({ account_id, conversation_urn }) =>
    client.get(
      `/accounts/${enc(account_id)}/conversations/${enc(conversation_urn)}`,
    ),
  ),
);

server.registerTool(
  "get_lead_conversation",
  {
    title: "Get lead conversation",
    description: "Get the conversation an account has with a specific lead.",
    inputSchema: {
      account_id: z.string().describe("Aimfox account ID"),
      lead_id: z.string().describe("Lead ID"),
    },
  },
  handle(({ account_id, lead_id }) =>
    client.get(`/accounts/${enc(account_id)}/leads/${enc(lead_id)}/conversation`),
  ),
);

server.registerTool(
  "start_conversation",
  {
    title: "Start conversation",
    description:
      "Start a new LinkedIn conversation with a lead from one of your accounts. Sends a real message to the lead.",
    inputSchema: {
      account_id: z.string().describe("Aimfox account ID to send from"),
      lead_id: z.string().describe("Lead ID of the recipient"),
      message: z.string().describe("Message text to send"),
    },
  },
  handle(({ account_id, lead_id, message }) =>
    client.post(`/accounts/${enc(account_id)}/conversations`, {
      message,
      recipients: [lead_id],
    }),
  ),
);

server.registerTool(
  "send_message",
  {
    title: "Send message to conversation",
    description:
      "Send a message in an existing LinkedIn conversation. Sends a real message to the other participant.",
    inputSchema: {
      account_id: z.string().describe("Aimfox account ID to send from"),
      conversation_urn: z.string().describe("Conversation URN"),
      message: z.string().describe("Message text to send"),
    },
  },
  handle(({ account_id, conversation_urn, message }) =>
    client.post(
      `/accounts/${enc(account_id)}/conversations/${enc(conversation_urn)}`,
      { message },
    ),
  ),
);

server.registerTool(
  "mark_conversation_as_read",
  {
    title: "Mark conversation as read",
    description: "Mark a conversation as read for an account.",
    inputSchema: {
      account_id: z.string().describe("Aimfox account ID"),
      conversation_urn: z.string().describe("Conversation URN"),
    },
  },
  handle(({ account_id, conversation_urn }) =>
    client.post(
      `/accounts/${enc(account_id)}/conversations/${enc(conversation_urn)}/mark-as-read`,
    ),
  ),
);

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const LABEL_COLORS = [
  "info",
  "quaternary",
  "success",
  "secondary",
  "danger",
  "yellow",
];

server.registerTool(
  "list_labels",
  {
    title: "List labels",
    description: "List all lead labels in the workspace.",
    inputSchema: {},
  },
  handle(() => client.get("/labels")),
);

server.registerTool(
  "create_label",
  {
    title: "Create label",
    description: "Create a new workspace label for tagging leads.",
    inputSchema: {
      name: z.string().describe("Label name"),
      color: z.enum(LABEL_COLORS).describe("Label color"),
    },
  },
  handle((body) => client.post("/labels", body)),
);

server.registerTool(
  "update_label",
  {
    title: "Update label",
    description: "Rename or recolor an existing workspace label.",
    inputSchema: {
      label_id: z.string().describe("Workspace label ID"),
      name: z.string().describe("New label name"),
      color: z.enum(LABEL_COLORS).describe("New label color"),
    },
  },
  handle(({ label_id, name, color }) =>
    client.patch(`/labels/${enc(label_id)}`, { name, color }),
  ),
);

server.registerTool(
  "delete_label",
  {
    title: "Delete label",
    description: "Delete a workspace label.",
    inputSchema: { label_id: z.string().describe("Workspace label ID") },
  },
  handle(({ label_id }) => client.delete(`/labels/${enc(label_id)}`)),
);

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

server.registerTool(
  "list_templates",
  {
    title: "List templates",
    description: "List all message templates in the workspace.",
    inputSchema: {},
  },
  handle(() => client.get("/templates")),
);

server.registerTool(
  "get_template",
  {
    title: "Get template",
    description: "Get a message template by ID.",
    inputSchema: { template_id: z.string().describe("Template ID") },
  },
  handle(({ template_id }) => client.get(`/templates/${enc(template_id)}`)),
);

server.registerTool(
  "create_template",
  {
    title: "Create template",
    description:
      "Create a message template (connection note, InMail, or message).",
    inputSchema: {
      name: z.string().describe("Template name"),
      type: z
        .enum(["NOTE_TEMPLATE", "INMAIL_TEMPLATE", "MESSAGE_TEMPLATE"])
        .describe("Template type"),
      subject: z.string().describe("Subject line (used for InMail templates)"),
      message: z.string().describe("Template message body"),
      ai: z
        .boolean()
        .optional()
        .describe("Enable AI personalization (default false)"),
    },
  },
  handle(({ name, type, subject, message, ai }) =>
    client.post("/templates", { name, type, subject, message, ai: ai ?? false }),
  ),
);

server.registerTool(
  "delete_template",
  {
    title: "Delete template",
    description: "Delete a message template.",
    inputSchema: { template_id: z.string().describe("Template ID") },
  },
  handle(({ template_id }) => client.delete(`/templates/${enc(template_id)}`)),
);

// ---------------------------------------------------------------------------
// Blacklist
// ---------------------------------------------------------------------------

server.registerTool(
  "list_blacklisted_profiles",
  {
    title: "List blacklisted profiles",
    description: "List LinkedIn profiles on the workspace blacklist.",
    inputSchema: {},
  },
  handle(() => client.get("/blacklist")),
);

server.registerTool(
  "add_profile_to_blacklist",
  {
    title: "Blacklist profile",
    description:
      "Add a LinkedIn profile to the blacklist so campaigns never contact it.",
    inputSchema: { profile_urn: z.string().describe("Profile URN") },
  },
  handle(({ profile_urn }) => client.post(`/blacklist/${enc(profile_urn)}`)),
);

server.registerTool(
  "remove_profile_from_blacklist",
  {
    title: "Un-blacklist profile",
    description: "Remove a LinkedIn profile from the blacklist.",
    inputSchema: { profile_urn: z.string().describe("Profile URN") },
  },
  handle(({ profile_urn }) => client.delete(`/blacklist/${enc(profile_urn)}`)),
);

server.registerTool(
  "list_blacklisted_companies",
  {
    title: "List blacklisted companies",
    description: "List companies on the workspace blacklist.",
    inputSchema: {},
  },
  handle(() => client.get("/blacklist-companies")),
);

server.registerTool(
  "add_companies_to_blacklist",
  {
    title: "Blacklist companies",
    description:
      "Add companies (by LinkedIn company URL) to the blacklist so their employees are never contacted.",
    inputSchema: {
      company_urls: z
        .array(z.string())
        .describe("LinkedIn company URLs to blacklist"),
    },
  },
  handle(({ company_urls }) =>
    client.post("/blacklist-companies", { companies: company_urls }),
  ),
);

server.registerTool(
  "remove_company_from_blacklist",
  {
    title: "Un-blacklist company",
    description: "Remove a company from the blacklist.",
    inputSchema: { company_urn: z.string().describe("Company URN") },
  },
  handle(({ company_urn }) =>
    client.delete(`/blacklist-companies/${enc(company_urn)}`),
  ),
);

// ---------------------------------------------------------------------------
// Webhooks
// ---------------------------------------------------------------------------

const WEBHOOK_EVENTS = [
  "account_logged_in",
  "account_logged_out",
  "campaign_created",
  "campaign_started",
  "campaign_ended",
  "campaign_reply",
  "accepted",
  "connect",
  "inbox_event",
  "inmail",
  "inmail_reply",
  "lead_label_added",
  "message",
  "message_request",
  "new_connection",
  "new_reply",
  "reply",
  "view",
];

server.registerTool(
  "list_webhooks",
  {
    title: "List webhooks",
    description: "List all webhooks configured in the workspace.",
    inputSchema: {},
  },
  handle(() => client.get("/webhooks")),
);

server.registerTool(
  "create_webhook",
  {
    title: "Create webhook",
    description:
      "Create a webhook that POSTs Aimfox events (replies, connections, campaign changes, ...) to a URL.",
    inputSchema: {
      name: z.string().describe("Webhook name"),
      url: z.string().describe("HTTPS URL to deliver events to"),
      events: z
        .array(z.enum(WEBHOOK_EVENTS))
        .describe("Event types to subscribe to"),
      integration: z
        .boolean()
        .optional()
        .describe("Mark as integration webhook (default false)"),
    },
  },
  handle(({ name, url, events, integration }) =>
    client.post("/webhooks", {
      name,
      url,
      events,
      integration: integration ?? false,
    }),
  ),
);

server.registerTool(
  "update_webhook",
  {
    title: "Update webhook",
    description: "Update a webhook's name, URL, or subscribed events.",
    inputSchema: {
      webhook_id: z.string().describe("Webhook ID"),
      name: z.string().describe("Webhook name"),
      url: z.string().describe("HTTPS URL to deliver events to"),
      events: z
        .array(z.enum(WEBHOOK_EVENTS))
        .describe("Event types to subscribe to"),
    },
  },
  handle(({ webhook_id, name, url, events }) =>
    client.patch(`/webhooks/${enc(webhook_id)}`, { name, url, events }),
  ),
);

server.registerTool(
  "delete_webhook",
  {
    title: "Delete webhook",
    description: "Delete a webhook.",
    inputSchema: { webhook_id: z.string().describe("Webhook ID") },
  },
  handle(({ webhook_id }) => client.delete(`/webhooks/${enc(webhook_id)}`)),
);

// ---------------------------------------------------------------------------

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Aimfox MCP server running on stdio");
