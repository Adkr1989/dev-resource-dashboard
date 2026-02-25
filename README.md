# DevDash

A lightweight, provider-agnostic dashboard for organizing your AI development resources. Track repositories, AI agents, integrations, commands, and clients in one place.

Works with **any AI service** - Claude, GPT, Gemini, Copilot, open-source models, or no AI at all. Zero dependencies. Pure HTML, CSS, and JavaScript.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/Adkr1989/dev-resource-dashboard.git
cd dev-resource-dashboard

# Serve locally (pick one)
npx serve .
# or
python -m http.server 8000

# Open http://localhost:8000
```

That's it. No build step, no npm install, no framework.

## How It Works

DevDash reads JSON files from the `data/` folder and renders them as a tabbed dashboard with cards, tables, search, and export.

```
dev-resource-dashboard/
  index.html            # Single page app
  css/dashboard.css     # Dark theme styles
  js/
    data-loader.js      # Fetches and caches JSON
    dashboard.js        # Renders tabs, cards, tables, search
  data/
    config.json         # Dashboard title, tabs, layout
    repositories.json   # Your git repos
    agents.json         # AI agents (any provider)
    integrations.json   # APIs, MCP servers, plugins, webhooks
    commands.json       # CLI commands, scripts, slash commands
    clients.json        # Client/project tracking
```

## Customization

### Change the dashboard title and tabs

Edit `data/config.json`:

```json
{
  "title": "My Dev Dashboard",
  "subtitle": "All my resources in one place",
  "lastUpdated": "2026-02-24",
  "tabs": [
    { "id": "repositories", "label": "Repos", "dataFile": "repositories.json" },
    { "id": "agents", "label": "Agents", "dataFile": "agents.json" },
    { "id": "integrations", "label": "Integrations", "dataFile": "integrations.json" }
  ]
}
```

Add or remove tabs by adding/removing entries. Each tab points to a JSON data file.

### Add a new tab

1. Create `data/my-tab.json` with this structure:

```json
{
  "categories": [
    {
      "name": "Category Name",
      "count": 2,
      "items": [
        {
          "name": "Item Name",
          "badge": "Active",
          "badgeClass": "badge-active",
          "description": "What this item does.",
          "meta": ["tag1", "tag2"],
          "tools": ["tool1", "tool2"],
          "path": "optional/path",
          "url": "https://optional-link.com"
        }
      ]
    }
  ]
}
```

2. Add it to `config.json`:

```json
{ "id": "my-tab", "label": "My Tab", "dataFile": "my-tab.json" }
```

### Display modes

Categories support two display modes:

**Cards** (default) - rich cards with badges, tags, and descriptions:
```json
{ "name": "Category", "count": 3, "items": [...] }
```

**Tables** - compact rows with custom columns:
```json
{ "name": "Category", "count": 3, "display": "table", "columns": ["Name", "Status", "Notes"], "items": [...] }
```

### Badge classes

| Class | Color | Use for |
|-------|-------|---------|
| `badge-active` | Green | Active, connected, deployed |
| `badge-ready` | Blue | Ready, configured, available |
| `badge-pipeline` | Gold | In progress, planned, pending |
| `badge-builtin` | Purple | Built-in, system, default |
| `badge-requires` | Red | Needs setup, missing config |

### Card fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Display name |
| `badge` | No | Short status label |
| `badgeClass` | No | Badge color class (see above) |
| `description` | No | One-line description |
| `meta` | No | Array of tag strings |
| `tools` | No | Array of tool/capability names |
| `path` | No | File path or identifier |
| `url` | No | Clickable link (opens in new tab) |

## Features

- **Tabbed navigation** - switch between resource types
- **Global search** - filter cards and table rows instantly
- **Stat cards** - auto-counted totals per tab, clickable to navigate
- **Export** - download all dashboard data as JSON
- **Responsive** - works on desktop and mobile
- **No dependencies** - pure HTML/CSS/JS, no build step
- **Provider agnostic** - not tied to any AI service or platform

## Hosting

DevDash is static files. Host it anywhere:

- **GitHub Pages** - push and enable in repo settings
- **Vercel** - `vercel deploy`
- **Netlify** - drag and drop the folder
- **Any web server** - just serve the files
- **Local** - `npx serve` or `python -m http.server`

## License

MIT
