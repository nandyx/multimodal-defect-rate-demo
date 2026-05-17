# Project instructions — defect-rate-ia

**Applies to:** Claude Code, Cursor, Claude Projects, and any other AI assistant working in this repository.

**Language:** English for agent-facing docs. This file is the **single source of truth**.

Shared documentation lives in the **repo root and `docs/`** (not inside `.cursor/`). Tool-specific files only point here.

| Audience | Entry file | Content |
|----------|------------|---------|
| All agents | `CLAUDE.md` | Full spec (this file) |
| Cursor | `.cursor/rules/architecture.mdc` | Short summary → CLAUDE.md |
| Humans | `docs/architecture.md` | Overview + links |

| Supplement | Path |
|------------|------|
| Templates & anti-patterns | [docs/architecture-reference.md](docs/architecture-reference.md) |
| Before/after examples | [docs/architecture-examples.md](docs/architecture-examples.md) |

---

## Principles

1. **Maintainability:** one clear responsibility per layer.
2. **Reuse:** shared dumb components and CSS utilities; no generic abstractions until needed.
3. **No over-engineering:** no `features/`, Redux, or Repository/UseCase layers unless the codebase outgrows this model.

---

## Code style

### No comments in code

- **Do not add** `//`, `/* */`, or JSX `{/* */}` comments in `.ts`, `.tsx`, `.css`, or other source we maintain.
- Prefer expressive names, small functions, and types over explanatory comments.
- **Exceptions:** generated files (e.g. `next-env.d.ts`), third-party vendored code, and license headers where legally required.

### Component constants (`consts/*.const.ts`)

When a dumb component owns **more than 3** top-level constants tied 1:1 to that component (variant maps, copy, icons, layout numbers, …), extract them to **`consts/<feature>.const.ts`** (e.g. `consts/credibility-score.const.ts`).

- Import from the component: `@/consts/credibility-score.const`
- Do **not** re-export `*.const.ts` from `components/index.ts`
- ≤3 related constants may stay in the `.tsx` file

### Business rules (`rules/*.rule.ts`)

Copy, labels, and branching derived from domain state belong in **`rules/<feature>.rule.ts`**, not inside dumb components.

- Pure functions only (no React, no I/O)
- Import from components: `@/rules/claim-card.rule`
- Example: `scenarioLabel`, `claimDetailHeaderTitle`

---

## Layered architecture

```
app/**/page.tsx          → smart (orchestration only)
hooks/use*.ts            → application logic (state, effects, handlers)
services/*.service.ts    → HTTP via axios (browser/client only)
components/*             → dumb UI (props + callbacks)
lib/*                    → pure code, no I/O
app/api/**/route.ts      → server routes (may use lib/aws)
```

| Layer | Location | May | Must not |
|-------|----------|-----|----------|
| Smart | `app/**/page.tsx` | Compose hooks + dumb components | `fetch`/`axios`, long inline business logic |
| Hooks | `hooks/` | State, effects, call services | Direct HTTP from pages |
| Services | `services/` | `axios` via `http-client.ts` | Be imported from dumb components |
| Dumb | `components/` | Props, callbacks, presentational UI | `fetch`, router, domain state, business copy/rules |
| Consts | `consts/` | Variant maps, labels, icons tied to a component | React, I/O |
| Rules | `rules/` | Business copy and branching from domain state | React, I/O |
| Lib | `lib/` | Domain types, scoring, pure helpers | Network I/O |
| Types | `types/` | Shared UI/app types (view modes, props unions) | Network I/O, hooks-only types |

**App Router note:** “pages” means `app/**/page.tsx`, not a legacy `pages/` directory.

Visual-only behavior (e.g. score animation) → `useAnimatedScore` in `hooks/`; dumb component receives `displayValue` as a prop.

---

## Custom hooks

- Name: `use` + domain (`useClaimDetail`).
- Export through `hooks/index.ts`.
- Own `useState`, `useEffect`, and handlers; call `services`, never `fetch`/`axios` directly.

---

## Services (axios)

- One file per domain: `claim.service.ts`, `translate.service.ts`.
- Shared client: `services/http-client.ts` with `baseURL: "/api"`.
- **Only** service modules import `axios`.

```typescript
import axios from "axios";

export const httpClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});
```

**`lib/` vs `services/`:** `lib/` has no network calls. Browser → `services/`. Route handlers → `lib/aws` (or a server-side service in a later phase).

---

## Barrel exports

Folders with multiple modules export `index.ts`:

```typescript
import { useClaimDetail } from "@/hooks";
import { analyzeClaim } from "@/services";
import { Skeleton, AnalysisPanel } from "@/components";
```

Avoid deep imports (`@/components/Foo`) except during incremental migration.

---

## Design system (Tailwind v4)

1. **Primitives:** `styles/primitives/colors.css` — all hex/rgb values (`--primitive-*`).
2. **Theme:** `app/globals.css` — `@theme inline` semantic tokens (`--color-canvas`, etc.).
3. **Utilities:** `styles/utilities.css` — `@utility` classes (`surface-card`, `canvas-page`, …).
4. **Class merging:** `styles/cn.ts` — `cn()` (`clsx` + `tailwind-merge`). Import from `@/styles`.

### Merging classes with `cn`

Always combine conditional or overridable classes with `cn`, never template strings:

```tsx
import { cn } from "@/styles";

<div className={cn("skeleton-pulse", className)} />
<button disabled className="btn-primary" />
```

**Forbidden:** `` className={`skeleton-pulse ${className}`} ``

### Adding a color

1. Add `--primitive-*` in `colors.css`.
2. Map to `--color-*` in `@theme` when needed.
3. Add a `@utility` if the pattern repeats 3+ times.
4. Use token/utility in JSX — never `bg-[#...]` or `style={{ color: ... }}` for UI colors.

### Forbidden in JSX

- Arbitrary Tailwind: `w-[120px]`, `animate-[...]`, `text-[#E8626D]`.
- Repeated raw palette (`bg-gray-50`, …) when a project utility exists.

### Hover in utilities

Nest `&:hover { ... }` inside `@utility` blocks (Tailwind v4 does not allow `@utility name:hover`).

---

## Dependencies

- Package manager: **pnpm**.
- **Exact versions** for new deps (no `^`): `pnpm add --save-exact <package>@<version>`.
- Record every new dependency in the table below.

| Package | Version | Install |
|---------|---------|---------|
| axios | 1.9.0 | `pnpm add --save-exact axios@1.9.0` |
| clsx | 2.1.1 | `pnpm add --save-exact clsx@2.1.1` |
| tailwind-merge | 3.3.1 | `pnpm add --save-exact tailwind-merge@3.3.1` |

---

## Folder layout

```
app/
  page.tsx
  claim/[id]/page.tsx
  api/**/route.ts
components/
  CredibilityScore.tsx
  index.ts
consts/
  credibility-score.const.ts
rules/
  claim-card.rule.ts
  claim-detail-header.rule.ts
hooks/
  index.ts
services/
  index.ts
styles/
  cn.ts
  index.ts
  primitives/colors.css
  utilities.css
lib/
types/
  index.ts
data/
CLAUDE.md
docs/
  architecture.md
  architecture-reference.md
  architecture-examples.md
```

---

## Migration checklist (existing code)

1. Primitives + utilities in `styles/`.
2. `http-client` + domain services; remove `fetch` from pages.
3. Extract `useClaimDetail`, `useAnimatedScore`.
4. Smart `page.tsx` = composition only.
5. Shared dumb components + barrels.
6. Presentational `CredibilityScore` + animation hook.
7. Apply utilities on `app/page.tsx`.

**Done when:** no `fetch` in pages; no domain state in dumb components; barrel imports; no arbitrary `[]` Tailwind classes; **no comments** in source.

---

## Further reading

- [docs/architecture.md](docs/architecture.md) — overview and doc map
- [docs/architecture-reference.md](docs/architecture-reference.md) — templates and anti-patterns
- [docs/architecture-examples.md](docs/architecture-examples.md) — before/after snippets
