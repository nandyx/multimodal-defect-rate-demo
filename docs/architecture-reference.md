# Architecture reference — defect-rate-ia

Canonical spec: **[CLAUDE.md](../CLAUDE.md)**

## Target tree

```
defect-rate-ia/
├── CLAUDE.md
├── docs/
│   ├── architecture.md
│   ├── architecture-reference.md
│   └── architecture-examples.md
├── app/
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── providers/
├── hooks/
├── queries/
├── styles/
└── lib/
```

## Atomic component layers

All under `components/`. Import direction: **down only**.

```
templates → organisms → molecules → atoms
```

| Layer | Example |
|-------|---------|
| `atoms/` | `Skeleton`, `AnalysisChip` |
| `molecules/` | `PageHeader`, `RequestErrorState`, `ClaimCard` |
| `organisms/` | `AnalysisPanel`, `ClaimDetailContent` |
| `templates/` | `ClaimDetailView` |

Pages import from `@/components` (templates/organisms). `providers/QueryProvider` is outside the atomic tree.

## Data flow

```
page.tsx → useXxx() → queries/*.query.ts → /api/* → lib/aws
                ↓
         components (props, atomic layers)
```

## Templates

### Smart page

```tsx
"use client";

import { use } from "react";
import { useClaimDetail } from "@/hooks";
import { ClaimDetailView, ClaimNotFound } from "@/components";

export default function ClaimDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const vm = useClaimDetail(id);
  if (!vm.claim) return <ClaimNotFound />;
  return (
    <ClaimDetailView
      claim={vm.claim}
      view={vm.view}
      claimLoaded={vm.claimLoaded}
      analysis={vm.analysis}
      isLoading={vm.isLoading}
      error={vm.error}
      translateError={vm.translateError}
      onRunAnalysis={vm.runAnalysis}
    />
  );
}
```

### Dumb component

```tsx
import { cn } from "@/styles";

type Props = {
  title: string;
  className?: string;
  onAction: () => void;
};

export function MyCard({ title, className, onAction }: Props) {
  return (
    <div className={cn("surface-card", className)}>
      <h2 className="text-body">{title}</h2>
      <button type="button" onClick={onAction} className="btn-primary">
        Action
      </button>
    </div>
  );
}
```

### `cn` helper (`styles/cn.ts`)

```tsx
import { cn } from "@/styles";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton-pulse", className)} />;
}
```

Never: `` className={`skeleton-pulse ${className}`} ``

### Hook

```tsx
import { useState, useCallback } from "react";
import { analyzeClaim } from "@/services";

export function useClaimDetail(id: string) {
  const [analysis, setAnalysis] = useState(null);
  const runAnalysis = useCallback(async () => {
    const result = await analyzeClaim({ claimId: id });
    setAnalysis(result);
  }, [id]);
  return { analysis, runAnalysis };
}
```

### Barrel

```ts
export { useClaimDetail } from "./useClaimDetail";
export { useAnimatedScore } from "./useAnimatedScore";
```

## lib vs services

| | `lib/` | `services/` |
|---|--------|-------------|
| HTTP | No | Yes (axios) |
| Browser | Pure helpers | API calls |
| Server routes | `lib/aws` | Optional wrappers |

## Anti-patterns

| Anti-pattern | Fix |
|--------------|-----|
| Large `page.tsx` | Hook + dumb components |
| `fetch` in component | Service + hook |
| Domain `useState` in dumb UI | Hook or smart parent |
| `bg-gray-50` repeated | `canvas-page` / tokens |
| `style={{ color: "#..." }}` | `text-label-accent` |
| `// comment` in source | Remove; use clear names |
| Deep `@/components/Foo` | `@/components` barrel |
| Organism imports organism | Compose via template or lift to page |
| Inline API error UI | `RequestErrorState` molecule |
| Skeleton while `isError` | Show `RequestErrorState` + `onRetry` |

## Main utilities

| Utility | Use |
|---------|-----|
| `canvas-page` | Full-page background |
| `surface-card` | White card |
| `surface-muted` | Inner gray block |
| `text-label-accent` | Brand accent label |
| `skeleton-pulse` | Loading placeholder |
| `btn-primary` | Primary CTA |
| `btn-retry` | Gray retry button (API errors) |
| `score-circle-sm` / `score-circle-lg` | Credibility ring size |
