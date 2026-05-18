# Architecture — defect-rate-ia

> **Source of truth (all AI tools):** [CLAUDE.md](../CLAUDE.md)

English conventions for maintainability, reuse, and clarity without over-engineering.

## Documentation map (tool-agnostic)

| Document | Purpose |
|----------|---------|
| [CLAUDE.md](../CLAUDE.md) | Full specification — **read this first** |
| [architecture-reference.md](./architecture-reference.md) | Tree, templates, anti-patterns |
| [architecture-examples.md](./architecture-examples.md) | Before/after snippets |

Cursor-only thin wrappers (same rules, no extra content): `.cursor/rules/architecture.mdc`, `.cursor/skills/defect-rate-conventions/SKILL.md`

## Quick reference

| Topic | Rule |
|-------|------|
| Smart components | `app/**/page.tsx` — hooks + dumb UI only |
| Dumb components | `components/{atoms,molecules,organisms,templates}/` — props/callbacks, no HTTP |
| API error UI | `RequestErrorState` molecule + `btn-retry` |
| Logic | `hooks/use*.ts` |
| HTTP client | `services/*.service.ts` with **axios** only |
| Pure code | `lib/` — no I/O |
| Imports | Barrels: `@/components`, `@/hooks`, `@/services` |
| Colors / layout | `styles/primitives/` + `styles/utilities.css` |
| Dependencies | `pnpm add --save-exact package@version` |
| Comments | **Not allowed** in maintained source — [CLAUDE.md](../CLAUDE.md#code-style) |
| Class names | Merge with `cn` from `@/styles` — never `` `utility ${className}` `` |

## Layers

```
page.tsx → hook → queries → /api/route → lib/aws
              ↓
         components (atomic layers)
```

## Design system

- All hex values live in `styles/primitives/colors.css`.
- Semantic tokens in `app/globals.css` (`@theme inline`).
- Reusable classes via `@utility` in `styles/utilities.css`.
- No arbitrary Tailwind values (`w-[…]`, `text-[#…]`, etc.) in JSX.

## Details

- Full spec: **[CLAUDE.md](../CLAUDE.md)**
- Templates & anti-patterns: **[architecture-reference.md](./architecture-reference.md)**
- Before/after: **[architecture-examples.md](./architecture-examples.md)**
