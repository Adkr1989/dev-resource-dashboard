# Dev Resource Dashboard — Claude Code Context

**Project**: ADEV Resource Dashboard — internal tool for tracking dev resources, links, and repos
**Owner**: Ari Klopfer
**Repo**: public on GitHub (Adkr1989/dev-resource-dashboard)

---

## Purpose

Internal dashboard for organizing and accessing ADEV development resources, links, tools, and project references. Used daily during dev sessions.

---

## Token Optimization Rules

- Read specific files by path rather than scanning the whole project
- Use Edit for targeted changes, not full rewrites
- Reference existing components when adding new ones

---

## Prompt Templates

### Add new resource/link
```
FEATURE: Add [resource name] to [section]
FIELDS: title, url, description, category
Follow the existing resource card pattern
```

### Update dashboard data
```
UPDATE: [what to change]
FILE: [specific file]
Don't change the overall layout structure
```

---

## Authorship
All commits authored by Ari Klopfer. No Claude attribution.
