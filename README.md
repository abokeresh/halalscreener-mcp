# halalscreener-mcp

The **read-only Shariah (halal) compliance layer for AI agents.** A local MCP server that lets Claude, Cursor, ChatGPT, and any MCP client screen stocks for AAOIFI Standard No. 21 compliance, explain verdicts, calculate purification, and ask the AI Scholar — with an audited, reproducible safety envelope on every verdict.

> **Informational only.** Verdicts are educational data, batch-screened (not real-time), **not a fatwa**, and **never an autonomous trade gate**. Always keep a human in the loop and consult a qualified scholar.

## Quick start

1. Get an API key (free tier available) at **https://halalscreener.app/en/mcp**.
2. Add to your MCP client config:

```json
{
  "mcpServers": {
    "halalscreener": {
      "command": "npx",
      "args": ["-y", "halalscreener-mcp"],
      "env": { "HALALSCREENER_API_KEY": "hs_live_your_key_here" }
    }
  }
}
```

That's it. This package is a **thin proxy** — it holds no secrets and no screening logic; it forwards your calls to the hosted HalalScreener MCP using *your* key.

## Tools

| Tool | Tier | What it does |
|---|---|---|
| `screen_stock` | Free* | AAOIFI verdict + grade + audit hash for a symbol |
| `screen_portfolio` | Free* | Per-symbol verdicts + portfolio summary |
| `get_stock_detail` | Premium | Full financial + qualitative/quantitative breakdown |
| `explain_verdict` | Premium | The auditable "why" behind a verdict |
| `calculate_purification` | Premium | Impure income to donate (AAOIFI No. 21) |
| `ask_scholar` | Premium | Conversational multi-madhab Islamic-finance Q&A |
| `check_compliance_changes` | Premium | Portfolio drift monitor — holdings that changed status |
| `compliance_history` | Premium | A stock's AAOIFI verdict timeline over time |

\* Free tier: 3 verdict-only screens/month. Premium ($16.99/mo) unlocks full verdicts, reasoning, purification, and the AI Scholar.

## Resources

- `methodology://aaoifi` — how HalalScreener applies AAOIFI Standard No. 21
- `disclaimer://terms` — the governing disclaimer

## Configuration

| Env var | Required | Default |
|---|---|---|
| `HALALSCREENER_API_KEY` | ✅ | — |
| `HALALSCREENER_MCP_URL` | — | `https://halalscreener.app/api/mcp/mcp` |

## License

MIT
