import type { ClaimDetailView } from "@/types";

export function claimDetailHeaderTitle(view: ClaimDetailView) {
  if (view === "detail") return "Reclamos";
  return "Análisis IA";
}
