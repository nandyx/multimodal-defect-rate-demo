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

### Debug logging (`console.info`)

- **Allowed:** `console.info("[debug:<context>] message", data)` in API routes for debugging service responses.
- Format: `[debug:<route-name>]` prefix followed by the step and raw data.
- Use in `app/api/**/route.ts` to trace service calls (Comprehend, Rekognition, Translate, Groq).
- **Not allowed:** `console.log` in client-side code (components, hooks, queries).
- Keep `console.error` for actual errors in catch blocks.

### Component constants (`consts/*.const.ts`)

When a dumb component owns **more than 3** top-level constants tied 1:1 to that component (variant maps, copy, icons, layout numbers, …), extract them to **`consts/<feature>.const.ts`** (e.g. `consts/credibility-score.const.ts`).

- Import from the component: `@/consts/credibility-score.const`
- Do **not** re-export `*.const.ts` from `components/index.ts`
- ≤3 related constants may stay in the `.tsx` file

### Business rules (`rules/*.rule.ts`)

Copy, labels, and branching derived from domain state belong in **`rules/<feature>.rule.ts`**, not inside dumb components.

- Pure functions only (no React, no I/O)
- Import from components: `@/rules/claim-card.rule`
- Example: `scenarioLabel`, `claimDetailHeaderTitle`, `requestErrorTitle`, `sentimentVariant`

### Atomic components (`components/{atoms,molecules,organisms,templates}/`)

All UI lives under **`components/`** in Atomic Design layers. Composing lower layers is required; composing sideways or upward is forbidden.

| Layer | Path | Contains | May import |
|-------|------|----------|------------|
| Atoms | `components/atoms/` | Smallest UI (Skeleton, chips, bars) | `@/styles`, icons, `@/lib/types` only |
| Molecules | `components/molecules/` | Simple combos (PageHeader, RequestErrorState, ClaimCard) | `atoms/`, `@/consts/` |
| Organisms | `components/organisms/` | Domain blocks (AnalysisPanel, ClaimDetailContent) | `atoms/`, `molecules/`, `@/rules/`, `@/types/` |
| Templates | `components/templates/` | Screen layout, no new business logic | `atoms/`, `molecules/`, `organisms/` |

**Public barrel** ([`components/index.ts`](components/index.ts)): re-exports `templates/`, `organisms/`, and `PageHeader` for pages. Do not export `atoms/` by default.

**Infra outside atomic tree:** [`providers/QueryProvider.tsx`](providers/QueryProvider.tsx) (TanStack Query).

**API / network errors:** use molecule [`RequestErrorState`](components/molecules/RequestErrorState.tsx) + `btn-retry` utility. Copy in `rules/request-error.rule.ts`. Show on `isError`; never leave skeleton visible when the mutation failed.

**Score animation:** organism `CredibilityScoreSection` may call `useAnimatedScore`; molecule `CredibilityScore` receives `displayValue` only.

---

## Layered architecture

```
app/**/page.tsx          → smart (orchestration only)
hooks/use*.ts            → application logic (state, effects, TanStack Query mutations)
queries/*.query.ts       → HTTP via axios + TanStack Query patterns (browser/client only)
components/*             → dumb UI (props + callbacks)
lib/*                    → pure code, http-client, no React
lib/aws/*                → AWS SDK wrappers (server-side only)
lib/groq/*               → Groq AI evaluation (server-side only)
app/api/**/route.ts      → server routes (use lib/aws, lib/groq)
```

| Layer | Location | May | Must not |
|-------|----------|-----|----------|
| Smart | `app/**/page.tsx` | Compose hooks + dumb components | `fetch`/`axios`, long inline business logic |
| Hooks | `hooks/` | State, effects, TanStack Query mutations | Direct HTTP from pages |
| Queries | `queries/` | `axios` via `@/lib/http-client`, export query/mutation functions | Be imported from dumb components |
| Dumb | `components/` (atomic layers) | Props, callbacks, presentational UI | `fetch`, router, domain state, business copy/rules, upward/sideways component imports |
| Consts | `consts/` | Variant maps, labels, icons tied to a component | React, I/O |
| Rules | `rules/` | Business copy and branching from domain state | React, I/O |
| Lib | `lib/` | Domain types, http-client, pure helpers, server-side services | React |
| Types | `types/` | Shared UI/app types (view modes, props unions) | Network I/O, hooks-only types |

**App Router note:** “pages” means `app/**/page.tsx`, not a legacy `pages/` directory.

Visual-only behavior (e.g. score animation) → `useAnimatedScore` in `hooks/`; used from `CredibilityScoreSection` (organism); molecule `CredibilityScore` receives `displayValue` as a prop.

---

## Custom hooks

- Name: `use` + domain (`useClaimDetail`).
- Export through `hooks/index.ts`.
- Consume query hooks from `queries/` (`useAnalyzeClaim()`, `useTranslateText()`).
- Own `useState`, `useEffect` for local UI state; delegate HTTP state to TanStack Query.
- Never import `axios`, `fetch`, or `httpClient` directly.

---

## Queries (TanStack Query + axios)

- One file per domain: `queries/claim.query.ts`, `queries/translate.query.ts`.
- Each file exports a **hook** (`useAnalyzeClaim`, `useTranslateText`) that wraps `useMutation`.
- The HTTP function stays **private** inside the file — only the hook is exported.
- Shared HTTP client: `lib/http-client.ts` with `baseURL: "/api"`.
- **Only** query modules import `axios` (via `@/lib/http-client`).
- `QueryProvider` wraps the app in `app/layout.tsx`.

```typescript
// lib/http-client.ts
import axios from "axios";

export const httpClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});
```

```typescript
// queries/claim.query.ts
import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/lib/http-client";

async function analyzeClaim(payload: AnalyzePayload): Promise<ClaimAnalysis> {
  const { data } = await httpClient.post("/analyze-claim", payload);
  return data;
}

export function useAnalyzeClaim() {
  return useMutation({ mutationFn: analyzeClaim });
}
```

```typescript
// hooks/useClaimDetail.ts — consuming queries
import { useAnalyzeClaim, useTranslateText } from "@/queries";

const analysisMutation = useAnalyzeClaim();
analysisMutation.mutate(payload);   // fire
analysisMutation.data;              // result
analysisMutation.isPending;         // loading
analysisMutation.error?.message;    // error
```

**`lib/` vs `queries/`:** `lib/` contains the http-client and server-side code (AWS, Groq). `queries/` is client-side and exports TanStack Query hooks. Route handlers → `lib/aws`, `lib/groq`.

---

## Barrel exports

Folders with multiple modules export `index.ts`:

```typescript
import { useClaimDetail } from "@/hooks";
import { analyzeClaim } from "@/queries";
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
| @tanstack/react-query | 5.75.5 | `pnpm add --save-exact @tanstack/react-query@5.75.5` |
| groq-sdk | 0.20.0 | `pnpm add --save-exact groq-sdk@0.20.0` |

---

## Folder layout

```
app/
  page.tsx
  claim/[id]/page.tsx
  api/**/route.ts
components/
  atoms/
  molecules/
  organisms/
  templates/
  index.ts
providers/
  QueryProvider.tsx
consts/
  credibility-score.const.ts
rules/
  claim-card.rule.ts
  claim-detail-header.rule.ts
  request-error.rule.ts
  analysis-panel.rule.ts
hooks/
  index.ts
queries/
  claim.query.ts
  translate.query.ts
  index.ts
styles/
  cn.ts
  index.ts
  primitives/colors.css
  utilities.css
lib/
  http-client.ts
  aws/
  groq/
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
2. `http-client` in `lib/` + domain queries in `queries/`; remove `fetch` from pages.
3. Extract `useClaimDetail`, `useAnimatedScore` with TanStack Query `useMutation`.
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
