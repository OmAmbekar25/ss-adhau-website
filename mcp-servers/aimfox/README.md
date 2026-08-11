# Aimfox MCP Server

An [MCP](https://modelcontextprotocol.io) server that exposes the
[Aimfox](https://aimfox.com) LinkedIn outreach API as tools, so MCP clients
(Claude Code, Claude Desktop, Cursor, etc.) can manage campaigns, leads,
conversations, labels, templates, blacklists, and webhooks.

## Setup

1. Create an API key in Aimfox: **Integrations → Create API Key**
   (see the [Aimfox API docs](https://docs.aimfox.com)).
2. Install dependencies:

   ```sh
   cd mcp-servers/aimfox
   npm install
   ```

3. Register the server with your MCP client.

### Claude Code

```sh
claude mcp add aimfox \
  --env AIMFOX_API_KEY=your-api-key \
  -- node /absolute/path/to/mcp-servers/aimfox/src/index.js
```

### Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "aimfox": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-servers/aimfox/src/index.js"],
      "env": { "AIMFOX_API_KEY": "your-api-key" }
    }
  }
}
```

## Configuration

| Environment variable | Required | Description                                             |
| -------------------- | -------- | ------------------------------------------------------- |
| `AIMFOX_API_KEY`     | yes      | Aimfox API key (Bearer token)                           |
| `AIMFOX_BASE_URL`    | no       | API base URL, defaults to `https://api.aimfox.com/api/v2` |

## Tools

| Area             | Tools                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Accounts         | `list_accounts`, `get_account_limits`, `set_account_limits`                                                                  |
| Campaigns        | `list_campaigns`, `get_campaign`, `create_campaign`, `pause_campaign`, `resume_campaign`, `add_profile_to_campaign`, `remove_profile_from_campaign` |
| Custom variables | `get_campaign_custom_variables`, `get_target_custom_variables`, `set_target_custom_variables`, `get_lead_custom_variables`   |
| Leads            | `get_lead`, `search_leads`, `list_recent_leads`, `add_label_to_lead`, `remove_label_from_lead`                               |
| Lead notes       | `list_lead_notes`, `add_note_to_lead`, `update_lead_note`, `delete_lead_note`                                                |
| Conversations    | `list_conversations`, `get_conversation`, `get_lead_conversation`, `start_conversation`, `send_message`, `mark_conversation_as_read` |
| Labels           | `list_labels`, `create_label`, `update_label`, `delete_label`                                                                |
| Templates        | `list_templates`, `get_template`, `create_template`, `delete_template`                                                       |
| Blacklist        | `list_blacklisted_profiles`, `add_profile_to_blacklist`, `remove_profile_from_blacklist`, `list_blacklisted_companies`, `add_companies_to_blacklist`, `remove_company_from_blacklist` |
| Webhooks         | `list_webhooks`, `create_webhook`, `update_webhook`, `delete_webhook`                                                        |

> **Note:** `start_conversation` and `send_message` send real LinkedIn
> messages from your connected account; `add_profile_to_campaign` enrolls a
> real person into an outreach sequence. Point the server at a test
> workspace while experimenting.

## Notes

- The Aimfox API allows **60 requests/minute**; on a 429 the server waits for
  the `Retry-After` interval (default 5s) and retries once.
- All tool responses return the raw Aimfox JSON. API errors are returned as
  MCP tool errors with the upstream status and body, so the model can react
  to them.
- Endpoint catalog derived from the official Aimfox API
  (`https://api.aimfox.com/api/v2`) as also used by Aimfox's n8n and Make
  integrations.
