import type { StubClaim } from "@/data/stubs/claims";

export function scenarioLabel(scenarioType: StubClaim["scenarioType"]) {
  if (scenarioType === "real") return "Reclamo legítimo";
  if (scenarioType === "fake") return "Posible fraude";
  return "Sin evidencia fotográfica";
}
