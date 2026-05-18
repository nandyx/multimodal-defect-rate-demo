# Before / after — defect-rate-ia

Canonical rules: **[CLAUDE.md](../CLAUDE.md)**

## HTTP in page → service + hook

**Before**

```tsx
const res = await fetch("/api/analyze-claim", {
  method: "POST",
  body: JSON.stringify({ claimId }),
});
```

**After**

```tsx
import { analyzeClaim } from "@/services";

const result = await analyzeClaim({ claimId, scenarioType, text, imageUrl });
```

---

## Score animation in dumb component → hook

**Before**

```tsx
export function CredibilityScore({ value }: Props) {
  const [animatedValue, setAnimatedValue] = useState(0);
  useEffect(() => { /* requestAnimationFrame */ }, [value]);
}
```

**After**

```tsx
const displayValue = useAnimatedScore(value);
<CredibilityScore displayValue={displayValue} recommendation={...} />
```

---

## Inline color → primitive utility

**Before**

```tsx
<p style={{ color: "#E8626D" }}>ID:</p>
```

**After**

```tsx
<p className="text-label-accent">ID:</p>
```

---

## Arbitrary Tailwind → utility

**Before**

```tsx
<div className="w-[120px] h-[120px]">
<span className="animate-[bounce_1.4s_ease-in-out_infinite]" />
```

**After**

```tsx
<div className="score-circle-sm md:score-circle-lg">
<span className="loading-dot" />
```

---

## Comment → self-documenting code

**Before**

```tsx
// silently fail on translate errors
} catch {
```

**After**

```tsx
} catch {
  setIsTranslating(false);
}
```

Use typed errors or a named handler if the catch block needs behavior; do not add comments.

---

## Template string classes → `cn`

**Before**

```tsx
<div className={`skeleton-pulse ${className}`} />
```

**After**

```tsx
import { cn } from "@/styles";

<div className={cn("skeleton-pulse", className)} />
```

---

## Duplicated Skeleton → shared dumb component

**Before:** inline `Skeleton` in page and `AnalysisPanel`.

**After:** `components/atoms/Skeleton.tsx` — imported by molecules/organisms, not from the public barrel.

---

## Flat components → Atomic layers

**Before**

```
components/AnalysisPanel.tsx  → imports ./AnalysisChip, ./CredibilityScoreAnimated
```

**After**

```
components/organisms/AnalysisPanel.tsx
  → ../atoms/AnalysisChip
  → ../molecules/AnalysisSkeleton
  → ../molecules/RequestErrorState
  → ./CredibilityScoreSection
```

---

## Inline API error → RequestErrorState

**Before**

```tsx
if (error) {
  return (
    <div className="surface-card text-center">
      <p>Error en el análisis</p>
      <button className="btn-primary" onClick={onRetry}>Reintentar</button>
    </div>
  );
}
if (isLoading) return <AnalysisSkeleton />;
```

**After**

```tsx
import { RequestErrorState } from "../molecules/RequestErrorState";

if (error) return <RequestErrorState message={error} onRetry={onRetry} />;
if (isLoading) return <AnalysisSkeleton />;
```

---

## Score animation wrapper → CredibilityScoreSection (organism)

**Before:** `CredibilityScoreAnimated` molecule with `useAnimatedScore` inside.

**After**

```tsx
// components/organisms/CredibilityScoreSection.tsx
const displayValue = useAnimatedScore(value);
return <CredibilityScore displayValue={displayValue} recommendation={recommendation} reasons={reasons} />;
```
