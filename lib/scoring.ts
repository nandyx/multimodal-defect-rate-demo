import type { Recommendation } from "./types";

type ScoringInput = {
  sentiment: string;
  keyPhrases: string[];
  labels: { name: string; confidence: number }[];
  moderationFlags: { name: string; confidence: number }[];
  textLength: number;
};

type ScoringResult = {
  value: number;
  recommendation: Recommendation;
  reasons: string[];
};

const FOOD_RELATED_LABELS = [
  "food", "meal", "burger", "hamburger", "sandwich", "pizza", "fries",
  "drink", "beverage", "plate", "dish", "bread", "cheese", "meat",
  "restaurant", "dining", "lunch", "dinner", "breakfast", "snack",
  "salad", "soup", "dessert", "cake", "cookie", "fruit", "vegetable",
];

const IRRELEVANT_IMAGE_LABELS = [
  "screenshot", "selfie", "person", "human", "face", "text", "document",
  "electronics", "phone", "computer", "monitor", "screen",
];

export function calculateScore(input: ScoringInput): ScoringResult {
  let score = 100;
  const reasons: string[] = [];

  if (input.moderationFlags.length > 0) {
    score -= 100;
    reasons.push(
      `Imagen con contenido inapropiado: ${input.moderationFlags.map((f) => f.name).join(", ")}`
    );
  }

  const labelNames = input.labels.map((l) => l.name.toLowerCase());
  const hasFoodLabel = labelNames.some((name) =>
    FOOD_RELATED_LABELS.some((food) => name.includes(food))
  );
  if (input.labels.length > 0 && !hasFoodLabel) {
    score -= 50;
    reasons.push("La imagen no muestra comida o producto alimenticio");
  }

  if (input.labels.length === 0) {
    score -= 50;
    reasons.push("No se detectaron elementos relevantes en la imagen");
  }

  const hasIrrelevant = labelNames.some((name) =>
    IRRELEVANT_IMAGE_LABELS.some((irr) => name.includes(irr))
  );
  if (hasIrrelevant) {
    score -= 40;
    reasons.push(
      `Imagen irrelevante detectada: ${labelNames
        .filter((name) => IRRELEVANT_IMAGE_LABELS.some((irr) => name.includes(irr)))
        .join(", ")}`
    );
  }

  if (input.keyPhrases.length > 0 && input.labels.length > 0) {
    const phrasesLower = input.keyPhrases.map((kp) => kp.toLowerCase());
    const anyOverlap = labelNames.some((label) =>
      phrasesLower.some(
        (phrase) => phrase.includes(label) || label.includes(phrase)
      )
    );
    if (!anyOverlap && hasFoodLabel) {
      score -= 30;
      reasons.push("Los elementos detectados en la imagen no coinciden con la descripción del texto");
    }
  }

  if (input.sentiment === "POSITIVE") {
    score -= 20;
    reasons.push("El tono del mensaje es positivo, inusual para un reclamo");
  }

  if (input.textLength < 10) {
    score -= 15;
    reasons.push("La descripción del reclamo es demasiado corta");
  }

  score = Math.max(0, Math.min(100, score));

  let recommendation: Recommendation;
  if (score >= 70) {
    recommendation = "VALID";
    if (reasons.length === 0) {
      reasons.push("El reclamo parece legítimo: la imagen y el texto son coherentes");
    }
  } else if (score >= 40) {
    recommendation = "REVIEW";
    reasons.push("Se recomienda revisión manual por parte del equipo");
  } else {
    recommendation = "FRAUD";
    reasons.push("Alta probabilidad de reclamo fraudulento");
  }

  return { value: score, recommendation, reasons };
}
