import { AlertTriangle, Check, X } from "lucide-react";
import type { Recommendation } from "@/lib/types";

export const SURFACE: Record<Recommendation, string> = {
  VALID: "score-surface-valid",
  REVIEW: "score-surface-review",
  FRAUD: "score-surface-fraud",
};

export const RING: Record<Recommendation, string> = {
  VALID: "score-ring-valid",
  REVIEW: "score-ring-review",
  FRAUD: "score-ring-fraud",
};

export const TEXT: Record<Recommendation, string> = {
  VALID: "score-text-valid",
  REVIEW: "score-text-review",
  FRAUD: "score-text-fraud",
};

export const BTN: Record<Recommendation, string> = {
  VALID: "score-btn-valid",
  REVIEW: "score-btn-review",
  FRAUD: "score-btn-fraud",
};

export const LABELS: Record<Recommendation, string> = {
  VALID: "Aprobar",
  REVIEW: "Enviar a revisión",
  FRAUD: "Marcar como fraude",
};

export const TITLES: Record<Recommendation, string> = {
  VALID: "Reclamo válido",
  REVIEW: "Requiere revisión",
  FRAUD: "Posible fraude",
};

export const ICONS: Record<
  Recommendation,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  VALID: Check,
  REVIEW: AlertTriangle,
  FRAUD: X,
};

export const CIRCUMFERENCE = 2 * Math.PI * 54;
